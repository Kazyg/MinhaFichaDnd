const fs = require('fs');
const { execFileSync } = require('child_process');
const parser = require('@babel/parser');
const postcss = require('postcss');
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const changes = [];
const parse = (text, file) => parser.parse(text, { sourceType: 'unambiguous', plugins: [...(/\.tsx?$/.test(file) ? ['typescript'] : []), 'jsx'], tokens: true });
const tokens = ast => ast.tokens.filter(t => !String(t.type).startsWith('Comment')).map(t => [t.type.label, t.value]);
for (const file of files) {
  let ranges = [], ast;
  if (!/\.(?:[cm]?js|jsx|tsx?|css|html|svg|xml|ya?ml)$/.test(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  if (/\.(?:[cm]?js|jsx|tsx?)$/.test(file)) {
    ast = parse(before, file);
    ranges = ast.comments.map(c => [c.start, c.end]);
  } else if (/\.css$/.test(file)) {
    postcss.parse(before).walkComments(c => ranges.push([c.source.start.offset, c.source.start.offset + c.toString().length]));
  } else if (/\.(?:html|svg|xml)$/.test(file)) {
    ranges = [...before.matchAll(/<!--[\s\S]*?-->/g)].map(m => [m.index, m.index + m[0].length]);
  } else {
    ranges = [...before.matchAll(/^\s*#[^\r\n]*/gm)].map(m => [m.index, m.index + m[0].length]);
  }
  if (!ranges.length) continue;
  let after = before;
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    const replacement = ' ' + (before.slice(start, end).match(/\r\n|\r|\n/g) || []).join('');
    after = after.slice(0, start) + replacement + after.slice(end);
  }
  after = after.replace(/[\t ]+$/gm, '');
  if (ast && JSON.stringify(tokens(ast)) !== JSON.stringify(tokens(parse(after, file)))) throw Error('Tokens alterados: ' + file);
  if (/\.css$/.test(file)) postcss.parse(after);
  fs.writeFileSync(file, after);
  changes.push({ file, comments: ranges.length });
}
console.log(JSON.stringify({ files: changes.length, comments: changes.reduce((sum, c) => sum + c.comments, 0), changes }, null, 2));
