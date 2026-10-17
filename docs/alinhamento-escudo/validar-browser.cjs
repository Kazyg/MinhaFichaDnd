// Real-app visual regression harness. Uses installed Edge and Node's native CDP/WebSocket.
// Every run owns a fresh temporary browser profile; no personal browser/storage is used.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn } = require('node:child_process');

const phase = process.argv[2] || 'after';
if (!['before', 'after'].includes(phase)) throw Error('Usage: node validar-browser.cjs [before|after] [baseURL]');
const base = process.argv[3] || 'http://127.0.0.1:3001';
const out = path.join(__dirname, phase);
fs.mkdirSync(out, { recursive: true });
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'minhaficha-escudo-'));
const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const log = fs.openSync(path.join(out, 'browser.log'), 'w');
const browser = spawn(edgePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', log] });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const result = { phase, base, isolatedProfile: profile, values: phase === 'before' ? [11] : [1, 8, 9, 10, 11, 20], checks: [], exceptions: [] };
const sizes = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false, deviceScaleFactor: 1 },
  { name: 'mobile-390', width: 390, height: 844, mobile: true, deviceScaleFactor: 1 },
  ...(phase === 'after' ? [
    { name: 'mobile-320', width: 320, height: 740, mobile: true, deviceScaleFactor: 1 },
    { name: 'desktop-1920', width: 1920, height: 1080, mobile: false, deviceScaleFactor: 1 },
    { name: 'escala-48', width: 1440, height: 900, mobile: false, deviceScaleFactor: 1, iconSize: 48 },
    { name: 'escala-96', width: 1440, height: 900, mobile: false, deviceScaleFactor: 1, iconSize: 96 },
  ] : []),
];
let ws, send;

(async () => {
  for (let attempt = 0; attempt < 100 && !fs.existsSync(path.join(profile, 'DevToolsActivePort')); attempt++) await delay(100);
  const port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
  const tabs = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  ws = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  const pending = new Map();
  let id = 0;
  send = (method, params = {}) => new Promise((resolve, reject) => {
    const nextId = ++id;
    const timeout = setTimeout(() => { pending.delete(nextId); reject(Error('CDP timeout: ' + method)); }, 20000);
    pending.set(nextId, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
    ws.send(JSON.stringify({ id: nextId, method, params }));
  });
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const p = pending.get(message.id);
      pending.delete(message.id);
      if (p) message.error ? p.reject(message.error) : p.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') result.exceptions.push(message.params);
  };
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
    return response.result.value;
  };
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 150; attempt++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    throw Error('Timed out waiting for ' + expression);
  };
  const screenshot = async (name, clip) => {
    const response = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, ...(clip ? { clip } : {}) });
    fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(response.data, 'base64'));
  };
  result.version = await send('Browser.getVersion');
  await send('Page.enable');
  await send('Runtime.enable');

  for (const viewport of sizes) {
    const { name, iconSize, ...metrics } = viewport;
    await send('Emulation.setDeviceMetricsOverride', metrics);
    for (const value of result.values) {
      const collection = { format: 'minhafichadnd', version: 1, kind: 'colecao', selectedId: 'escudo-visual', data: [{ id: 'escudo-visual', nomePersonagem: 'Teste visual do escudo', classeArmadura: value, versaoRegras: 'DND_2014' }] };
      const caseId = name + '-' + value;
      const script = await send('Page.addScriptToEvaluateOnNewDocument', { source: 'window.__escudoVisualCase = ' + JSON.stringify(caseId) + '; localStorage.setItem("fichas", ' + JSON.stringify(JSON.stringify(collection)) + ');' });
      await send('Page.navigate', { url: base + '/criar-ficha' });
      await waitFor('window.__escudoVisualCase === ' + JSON.stringify(caseId) + ' && document.readyState === "complete" && !!document.querySelector(".criar-ficha")');
      if (viewport.mobile) {
        await evaluate('[...document.querySelectorAll(".aba-botao")].find(button => button.textContent === "Informações").click()');
      }
      await waitFor('!!document.querySelector(".ca-container") && document.querySelector(".ca-container").textContent.includes(' + JSON.stringify(String(value)) + ')');
      if (phase === 'after') await waitFor('document.querySelector(".escudo-ca")?.getAttribute("aria-label") === ' + JSON.stringify('Classe de armadura: ' + value));
      if (iconSize) {
        // Controlled layout stress case: real component, narrower container and
        // multiline neighbour. Only the explanatory text/layout is changed.
        await evaluate(`(() => {
          const style = document.createElement('style');
          style.textContent = '.escudo-ca { --escudo-ca-tamanho: ${iconSize}px; } .ca-container { width: 180px; } .ca-detalhes::after { content: " Descricao longa da classe de armadura para verificar quebra de linha e altura independente do escudo."; }';
          document.head.appendChild(style);
        })()`);
      }
      await evaluate('document.fonts.ready.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))');
      await evaluate('document.querySelector(".ca-container").scrollIntoView({ block: "center" })');
      await delay(120);
      const measurements = await evaluate(`(() => {
        const rect = element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        const describe = element => {
          const style = getComputedStyle(element);
          const box = rect(element);
          let svgBox = null;
          try { if (element.getBBox) { const b = element.getBBox(); svgBox = { x:b.x, y:b.y, width:b.width, height:b.height }; } } catch {}
          let textMetrics = null;
          if (element.matches('text, .ca-text, .escudo-ca-valor')) {
            const ctx = document.createElement('canvas').getContext('2d');
            ctx.font = style.fontStyle + ' ' + style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
            ctx.fontKerning = style.fontKerning;
            const m = ctx.measureText(element.textContent);
            textMetrics = { width:m.width, left:m.actualBoundingBoxLeft, right:m.actualBoundingBoxRight, ascent:m.actualBoundingBoxAscent, descent:m.actualBoundingBoxDescent, fontBoundingBoxAscent:m.fontBoundingBoxAscent, fontBoundingBoxDescent:m.fontBoundingBoxDescent };
          }
          return { tag:element.tagName, class:element.getAttribute('class'), text:element.matches('img,image') ? null : element.textContent, box, svgBox, attributes:Object.fromEntries([...element.attributes].map(a => [a.name, a.value]).filter(([key]) => key !== 'href' && key !== 'src')), css:{ position:style.position, display:style.display, font:style.font, fontFamily:style.fontFamily, fontSize:style.fontSize, lineHeight:style.lineHeight, textAlign:style.textAlign, transform:style.transform, alignItems:style.alignItems, justifyContent:style.justifyContent, flexShrink:style.flexShrink, width:style.width, height:style.height }, naturalWidth:element.naturalWidth, naturalHeight:element.naturalHeight, textMetrics };
        };
        const container = document.querySelector('.ca-container');
        const icon = container.querySelector('.escudo-ca') || container.querySelector('.icon-ca');
        const r = rect(icon);
        const crop = { x:Math.max(0,r.x + scrollX - 12),y:Math.max(0,r.y + scrollY - 12),width:r.width + 24,height:r.height + 24,scale:1 };
        return { viewport:{ width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scrollWidth:document.documentElement.scrollWidth }, elements:[container, ...container.querySelectorAll('.icon-ca,.ca-text,.escudo-ca,.escudo-ca image,.escudo-ca text,.escudo-ca-valor')].map(describe), crop, iconInCrop:{x:r.x+scrollX-crop.x,y:r.y+scrollY-crop.y,width:r.width,height:r.height} };
      })()`);
      const prefix = name + '-' + value;
      await screenshot(prefix + '-escudo', measurements.crop);
      const capturedSize = await evaluate('(() => { const r = document.querySelector(".escudo-ca, .icon-ca").getBoundingClientRect(); return {width:r.width,height:r.height}; })()');
      if (Math.abs(capturedSize.width - measurements.iconInCrop.width) > 0.02) throw Error('Layout changed during screenshot: ' + prefix);
      if (value === 11) await screenshot(name + '-pagina');
      result.checks.push({ scenario: name, screenshot:prefix + '-escudo.png', value, ...measurements });
      if (phase === 'after') {
        const icon = measurements.elements.find(element => element.class === 'escudo-ca');
        if (!icon || Math.abs(icon.box.width - icon.box.height) > 0.02 || icon.css.flexShrink !== '0') throw Error('Shield distorted: ' + prefix);
        if (icon.attributes['aria-label'] !== 'Classe de armadura: ' + value) throw Error('Incorrect accessible value: ' + prefix);
      }
      await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: script.identifier });
      console.log(JSON.stringify({ viewport: name, value, crop: measurements.crop, screenshot: prefix + '-escudo.png' }));
    }
  }
  const rows = sizes.map(size => '<section><h2>' + size.name + '</h2><div>' + result.values.map(value => '<figure><img src="' + size.name + '-' + value + '-escudo.png"><figcaption>CA ' + value + '</figcaption></figure>').join('') + '</div></section>').join('');
  fs.writeFileSync(path.join(out, 'galeria.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Alinhamento do escudo — ' + phase + '</title><style>body{background:#202328;color:white;font:16px Arial;padding:20px}section>div{display:flex;gap:20px}figure{margin:0;text-align:center;width:110px}img{display:block;margin:auto;max-width:110px}figcaption{margin-top:8px}h2{font-size:18px}</style><h1>Escudo: ' + phase + '</h1>' + rows);
  await send('Emulation.setDeviceMetricsOverride', { width: 900, height: phase === 'before' ? 850 : 1320, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: new URL('file:///' + path.join(out, 'galeria.html').replace(/\\/g, '/')).href });
  await waitFor('document.images.length > 0 && [...document.images].every(image => image.complete && image.naturalWidth > 0)');
  await screenshot('galeria');
})().catch(error => {
  result.error = error.stack || String(error);
  process.exitCode = 1;
}).finally(async () => {
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(result, null, 2));
  if (send) await send('Browser.close').catch(() => {});
  ws?.close();
  browser.kill();
  fs.closeSync(log);
  console.log(JSON.stringify({ phase, checks: result.checks.length, exceptions: result.exceptions.length, error: result.error, out }));
});
