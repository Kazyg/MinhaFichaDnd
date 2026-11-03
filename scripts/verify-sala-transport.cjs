const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/** Executa o SDK do bundle final, sem rede e sem sessões ou chaves reais. */
async function verificarTransporteSala(jsDirectory) {
  const mapName = fs.readdirSync(jsDirectory).filter(name => name.endsWith('.js.map')).find(name => {
    const map = JSON.parse(fs.readFileSync(path.join(jsDirectory, name), 'utf8'));
    return map.sources.some(source => source.endsWith('/@supabase/supabase-js/src/index.ts'));
  });
  assert.ok(mapName, 'Bundle do Supabase não encontrado nos source maps do build de verificação.');
  const chunks = [];
  const requests = [];
  const context = {
    URL, Headers, Request, Response, WebSocket, Blob, FormData, AbortController,
    TextEncoder, TextDecoder, console, setTimeout, clearTimeout, setInterval, clearInterval,
    self: { webpackChunkfixa_rpg: chunks },
    fetch: async (input, init) => {
      requests.push({ url: String(input), init });
      return new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
    },
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(jsDirectory, mapName.replace(/\.map$/, '')), 'utf8'), context, { timeout: 10000 });
  assert.equal(chunks.length, 1, 'Esperado um chunk isolado para testar o SDK.');
  const modules = chunks[0][1];
  const cache = {};
  const requireModule = id => {
    if (cache[id]) return cache[id].exports;
    assert.ok(modules[id], `Dependência ${id} ausente no chunk do SDK.`);
    const module = { exports: {} };
    cache[id] = module;
    modules[id](module, module.exports, requireModule);
    return module.exports;
  };
  requireModule.d = (target, definitions) => {
    for (const key in definitions) Object.defineProperty(target, key, { enumerable: true, get: definitions[key] });
  };
  requireModule.o = (target, key) => Object.prototype.hasOwnProperty.call(target, key);
  requireModule.r = target => Object.defineProperty(target, '__esModule', { value: true });
  requireModule.g = context;
  const exports = Object.keys(modules).flatMap(id => Object.values(requireModule(id)));
  assert.equal(exports.length, 1, 'Atualize o teste se os exports do chunk do SDK mudarem.');
  const createClient = exports[0];
  const client = createClient('https://example.supabase.co', 'sb_publishable_transport_test', {
    accessToken: async () => 'test-session-token',
  });
  const controller = new AbortController();
  const result = await client.from('salas').select('id').abortSignal(controller.signal);
  assert.equal(result.error, null);
  const rpc = await client.rpc('sala_publicar', { p_sala: 'test-room' });
  assert.equal(rpc.error, null);
  assert.equal(requests.length, 2);
  for (const { init } of requests) {
    const headers = new Headers(init?.headers);
    assert.equal(headers.get('apikey'), 'sb_publishable_transport_test', 'O bundle descartou a chave pública da requisição.');
    assert.equal(headers.get('authorization'), 'Bearer test-session-token', 'O bundle descartou a sessão do usuário.');
  }
  assert.equal(requests[0].init.method, 'GET');
  assert.equal(requests[0].init.signal, controller.signal);
  assert.equal(requests[1].init.method, 'POST');
  assert.deepEqual(JSON.parse(requests[1].init.body), { p_sala: 'test-room' });
  console.log('Sala online: bundle final preserva chave pública, sessão, método, corpo e cancelamento.');
}

module.exports = { verificarTransporteSala };
if (require.main === module) {
  verificarTransporteSala(process.argv[2]).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
