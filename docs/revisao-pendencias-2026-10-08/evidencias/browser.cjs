const fs=require('fs'), path=require('path'), http=require('http');
const root=process.argv[2], profile=process.argv[3], out=process.argv[4];
const server=http.createServer((req,res)=>{
 let file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root)){res.writeHead(403);return res.end();}
 if(!fs.existsSync(file)||fs.statSync(file).isDirectory()) file=path.join(root,'index.html');
 const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.svg':'image/svg+xml','.pdf':'application/pdf'};
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const port=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];
 const tabs=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let id=0;const pending=new Map(), events=[], requests=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}else {if(m.method==='Runtime.exceptionThrown')events.push(m.params);if(m.method==='Network.responseReceived')requests.push({url:m.params.response.url,status:m.params.response.status});}};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
 const ev=async(expression)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw r.exceptionDetails;return r.result.value;};
 const wait=async(expr)=>{for(let i=0;i<100;i++){if(await ev(expr))return;await new Promise(r=>setTimeout(r,100));}throw Error('Timeout '+expr);};
 const click=async(text)=>ev("(()=>{const b=[...document.querySelectorAll('button')].find(b=>(b.getAttribute('aria-label')||b.textContent).includes("+JSON.stringify(text)+"));if(!b)throw Error('missing button');b.click();return true})()");
 const shot=async(name)=>{const s=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(s.data,'base64'));};
 const result={base,version:await send('Browser.getVersion'),checks:[]};
 try{
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:path.join(out,'downloads')});
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url:base});await wait("!!document.querySelector('[aria-label=\"Criar Nova Ficha\"]')");
 for(const edition of ['2014','2024']){
   await click('Criar Nova Ficha');await wait("!!document.querySelector('[role=\"dialog\"]')");await click('Regras '+edition);await wait("location.pathname==='/criar-ficha'");
   await wait("!!document.querySelector('input')");
   result.checks.push({edition,text:(await ev('document.body.innerText')).slice(0,1500)});
   await shot('desktop-'+edition);
   await click('Menu da ficha');await click('Exportar PDF');
   await wait("!document.querySelector('#acoes-ficha')");
   result.checks.push({edition,pdfAlert:await ev("[...document.querySelectorAll('[role=\"alert\"]')].map(x=>x.textContent)"),storage:await ev("JSON.parse(localStorage.getItem('fichas')).data.map(f=>({id:f.id,edition:f.versaoRegras}))")});
   await send('Page.navigate',{url:base});await wait("!!document.querySelector('[aria-label=\"Criar Nova Ficha\"]')");
 }
 await click('Carregar Ficha Salva');await wait("!!document.querySelector('.selection-option')");await ev("document.querySelector('.selection-option').click()");await wait("location.pathname==='/criar-ficha'");
 await send('Page.reload');await wait("!!document.querySelector('[aria-label=\"Menu da ficha\"]')");result.checks.push({reopened:true});
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await wait("[...document.querySelectorAll('button')].some(b=>b.textContent==='Informações')");
 await click('Informações');await shot('mobile-informacoes');
 result.checks.push({mobile:await ev("({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,text:document.body.innerText.slice(0,1000)})")});
 result.requests=requests;result.exceptions=events;
 }catch(e){result.error=String(e?.message||JSON.stringify(e));}
 finally{fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(result,null,2));await send('Browser.close').catch(()=>{});ws.close();server.close();console.log(JSON.stringify(result));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});


