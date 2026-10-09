const fs = require('fs'), path = require('path'), os = require('os'), http = require('http'), { spawn } = require('child_process');
const root = fs.readFileSync(path.join(__dirname, process.argv[2] || 'build-final-path.txt'), 'utf8').trim();
const tag = process.argv[3] || 'plain';
const out = path.join(__dirname, 'browser-' + tag); fs.mkdirSync(out);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'minhaficha-browser-final-'));
const stderr = fs.openSync(path.join(out, 'edge.log'), 'w');
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', stderr] });
const delay = ms => new Promise(r => setTimeout(r, ms));
const server = http.createServer((req, res) => {
  const relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '');
  let file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html');
  res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.pdf': 'application/pdf' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
let ws, send;
const result = { tag, root, profile, checks: [], errors: [], requests: [], timings: [] };
(async () => {
  for (let n = 0; n < 100 && !fs.existsSync(path.join(profile, 'DevToolsActivePort')); n++) await delay(100);
  const port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pending = new Map();
  send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id; const timeout = setTimeout(() => { pending.delete(n); reject(Error('CDP timeout: ' + method)); }, 20000);
    pending.set(n, { resolve: v => { clearTimeout(timeout); resolve(v); }, reject }); ws.send(JSON.stringify({ id: n, method, params }));
  });
  let failPdf = true;
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id) { const p = pending.get(m.id); pending.delete(m.id); if (p) m.error ? p.reject(m.error) : p.resolve(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') result.errors.push(m.params);
    else if (m.method === 'Network.responseReceived' && !m.params.response.url.startsWith('data:')) result.requests.push({ url: m.params.response.url, status: m.params.response.status });
    else if (m.method === 'Fetch.requestPaused') {
      const p = m.params;
      if (failPdf && /\/static\/js\/\d+\./.test(p.request.url)) { failPdf = false; send('Fetch.failRequest', { requestId: p.requestId, errorReason: 'Failed' }).catch(() => {}); }
      else send('Fetch.continueRequest', { requestId: p.requestId }).catch(() => {});
    }
  };
  const ev = async expression => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw Error(r.exceptionDetails.text + ': ' + r.exceptionDetails.exception?.description); return r.result.value; };
  const wait = async expression => { for (let n = 0; n < 150; n++) { if (await ev(expression)) return; await delay(100); } throw Error('Timeout: ' + expression); };
  const click = text => ev(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent).includes(${JSON.stringify(text)}));if(!b)throw Error('Botão ausente');b.click();return true})()`);
  const check = (name, ok, details) => { result.checks.push({ name, ok, details }); if (!ok) throw Error(name); };
  const shot = async name => { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(r.data, 'base64')); };
  const key = async (key, code, modifiers = 0) => {
    const windowsVirtualKeyCode = ({ Tab: 9, Enter: 13, Escape: 27, '+': 187 })[key];
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, modifiers, windowsVirtualKeyCode, ...(key === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers, windowsVirtualKeyCode });
    await delay(80);
  };
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  result.version = await send('Browser.getVersion'); result.manifest = JSON.parse(fs.readFileSync(path.join(root, 'asset-manifest.json')));
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable'); await send('Performance.enable');
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: out });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const home = async () => { await send('Page.navigate', { url: base }); await wait(`!!document.querySelector('[aria-label="Criar Nova Ficha"]')`); };
  await home();
  await key('Tab', 'Tab'); check('Tab inicial', await ev(`document.activeElement.getAttribute('aria-label')==='Carregar Ficha Salva'`));
  await key('Tab', 'Tab'); await key('Enter', 'Enter');
  await wait(`!!document.querySelector('[role="dialog"]')`);
  check('Foco inicial do diálogo', await ev(`document.activeElement.tagName==='H2'`));
  await key('Tab', 'Tab', 8); check('Shift+Tab contido', await ev(`document.activeElement.textContent==='Fechar'`));
  await key('Escape', 'Escape'); check('Retorno do foco', await ev(`document.activeElement.getAttribute('aria-label')==='Criar Nova Ficha'`));
  for (const ed of ['2014', '2024']) {
    const start = performance.now(); await click('Criar Nova Ficha'); await click('Regras ' + ed);
    await wait(`!!document.querySelector('#nome-personagem')`);
    await ev(`(()=>{const input=document.querySelector('#nome-personagem');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Sintética ${ed}');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
    await wait(`JSON.parse(localStorage.getItem('fichas')).data.some(f=>f.nomePersonagem==='Sintética ${ed}')`);
    result.timings.push({ etapa: 'criação-nome-autosave', ed, ms: performance.now() - start, nota: 'Ensaio único, inclui polling/autosave, não comparação A25.' });
    await click('Sucesso de morte 2'); await click('Falha de morte 1');
    await click('Menu da ficha'); await click('Salvar Ficha');
    await shot('desktop-' + ed);
    await send('Page.reload'); await wait(`document.querySelector('#nome-personagem')?.value==='Sintética ${ed}'`);
    check('Morte após recarregar ' + ed, await ev(`document.querySelector('[aria-label="Sucesso de morte 2"]').getAttribute('aria-pressed')==='true'`));
    if (ed === '2014') {
      check('PDF ausente antes da ação', !result.requests.some(r => /\/static\/js\/\d+\./.test(r.url)));
      await send('Fetch.enable', { patterns: [{ urlPattern: '*static/js/*', requestStage: 'Request' }] });
      await click('Menu da ficha'); await click('Exportar PDF');
      await wait(`document.body.innerText.includes('Não foi possível exportar o PDF')`);
      check('Falha de chunk oferece JSON', await ev(`document.body.innerText.includes('exporte JSON')`));
      await send('Fetch.disable');
    }
    await click('Menu da ficha'); await click('Exportar PDF');
    await wait(`!document.querySelector('#acoes-ficha')`);
    check('PDF sem alerta após tentativa ' + ed, !await ev(`document.body.innerText.includes('Não foi possível exportar o PDF')`));
    await click('Menu da ficha'); await click('Exportar JSON');
    await home();
  }
  await click('Carregar Ficha Salva'); await click('Sintética 2014'); await wait(`document.querySelector('#nome-personagem')?.value==='Sintética 2014'`);
  check('Alternância sem vazamento', await ev(`JSON.parse(localStorage.getItem('fichas')).data.map(f=>f.nomePersonagem).join('|')==='Sintética 2014|Sintética 2024'`));
  const upload = async file => {
    await home(); await click('Carregar Ficha Salva');
    const { root: domRoot } = await send('DOM.getDocument');
    const { nodeId } = await send('DOM.querySelector', { nodeId: domRoot.nodeId, selector: '#importar-ficha' });
    await send('DOM.setFileInputFiles', { nodeId, files: [file] });
    await wait(`[...document.querySelectorAll('button')].some(b=>b.textContent==='Confirmar Importação'&&!b.disabled)`);
    await click('Confirmar Importação');
  };
  for (const ed of ['DND_2014', 'DND_2024']) {
    const file = path.join(__dirname, 'fixture-' + ed + '.json');
    const profiling = process.argv.includes('--profile');
    if (profiling) await send('Profiler.enable');
    for (let rep = 0; rep < (profiling ? 6 : 3); rep++) {
      if (profiling) {
        await send('Network.setCacheDisabled', { cacheDisabled: rep < 3 });
        if (rep < 3) await send('Network.clearBrowserCache');
        else await home();
        await send('Profiler.start');
      }
      const start = performance.now();
      await upload(file);
      if (rep) { await wait(`!!document.querySelector('[aria-label="ID já existente"]')`); await click('Substituir ficha existente'); }
      await wait(`document.querySelector('#nome-personagem')?.value==='A25 ${ed}'`);
      result.timings.push({ etapa: 'A25-importar-reabrir', ed, rep, ms: performance.now() - start, cache: profiling ? (rep < 3 ? 'frio-desabilitado' : 'quente') : rep ? 'quente' : 'após fluxos anteriores; não frio' });
      if (profiling) {
        fs.writeFileSync(path.join(out, `cpu-import-${ed}-${rep}.json`), JSON.stringify(await send('Profiler.stop')));
        const before = await send('Performance.getMetrics'); const t = performance.now();
        await send('Profiler.start');
        await click('Nível: 1');
        await ev(`[...document.querySelectorAll('[role="dialog"] button')].find(b=>b.textContent==='3').click()`);
        await wait(`[...document.querySelectorAll('button')].some(b=>b.textContent==='Nível: 3')`);
        const after = await send('Performance.getMetrics');
        result.timings.push({ etapa: 'A25-nivel1-3', ed, rep, ms: performance.now() - t, cache: rep < 3 ? 'frio-desabilitado' : 'quente', before, after });
        fs.writeFileSync(path.join(out, `cpu-level-${ed}-${rep}.json`), JSON.stringify(await send('Profiler.stop')));
      }
      check('JSON mantém edição e morte ' + ed + '/' + rep, await ev(`(()=>{const f=JSON.parse(localStorage.getItem('fichas')).data.find(f=>f.id==='browser-${ed}');return f.versaoRegras==='${ed}'&&f.recursos.morte.sucessos===2&&f.recursos.morte.falhas===1})()`));
    }
    await upload(file); await wait(`!!document.querySelector('[aria-label="ID já existente"]')`); await click('Importar como cópia');
    await wait(`!!document.querySelector('#nome-personagem')`);
    check('Importação como cópia mantém original ' + ed, await ev(`JSON.parse(localStorage.getItem('fichas')).data.filter(f=>f.nomePersonagem==='A25 ${ed}').length===2`));
    await click('Itens'); await click('Sintonizar'); await click('Equipar');
    await click('Menu da ficha'); await click('Salvar Ficha');
    check('Inventário sintonizado persistido ' + ed, await ev(`(()=>{const s=JSON.parse(localStorage.getItem('fichas'));const f=s.data.find(f=>f.id===s.selectedId);return f.itensSintonizados.includes('item-sintetico')&&f.itensEquipados.some(i=>i.id==='item-sintetico')})()`));
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await click('Informações'); await shot('mobile-informacoes');
  result.checks.push({ name: 'Mobile largura', details: await ev(`({viewport:innerWidth,scroll:document.documentElement.scrollWidth})`) });
  await click('Perícias'); await shot('mobile-pericias');
  await send('Emulation.clearDeviceMetricsOverride');
  const beforeZoom = await ev(`({width:innerWidth,dpr:devicePixelRatio})`);
  for (let n = 0; n < 4; n++) await key('+', 'Equal', 2);
  result.zoomAttempt = { before: beforeZoom, after: await ev(`({width:innerWidth,dpr:devicePixelRatio})`), method: 'Ctrl+plus real via Input; não usar deviceScaleFactor como zoom.' };
  result.metrics = await send('Performance.getMetrics');
  result.storage = await ev(`JSON.parse(localStorage.getItem('fichas'))`);
  await delay(1000);
  result.downloads = fs.readdirSync(out).filter(f => /\.(pdf|json)$/.test(f));
})().catch(e => { result.error = e.stack || String(e); process.exitCode = 1; }).finally(async () => {
  fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(result, null, 2));
  if (send) await send('Browser.close').catch(() => {});
  ws?.close(); server.close(); browser.kill(); fs.closeSync(stderr);
  console.log(JSON.stringify({ tag, checks: result.checks, error: result.error, downloads: result.downloads, zoom: result.zoomAttempt }));
});
