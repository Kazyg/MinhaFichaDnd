/** @jest-environment node */
import './ambienteIndexedDB.testUtils';
import fs from 'fs';
import { webcrypto } from 'crypto';
import { PDFDocument, PDFPage } from 'pdf-lib';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { Ficha } from '../../api/fichaPersonagem/FichaPersonagem';
import { Atributos } from '../../api/classesPrincipais/Atributos.class';
import { exportFicha, parseImport } from '../../api/fichaPersonagem/fichaStorage';
import { gerarFichaPdf } from '../../utils/exportarFichaPdf';
import { prepararImportacaoComPdf, converterFichaJson, validarJsonDoSite } from './pdfFichaJson';
import { prepararImportacao } from './importacao';
import { incorporarImportacao } from './fichasCampanha';
import { DadosCampanha } from './modelos';
import { criarLayoutPadrao } from './ui/layoutWorkspace';
import { RepositorioCampanhasIndexedDB } from './persistencia';
import { exportarBackup, restaurarBackup, lerBackup } from './backup';
import { validarDadosCampanha } from './validacao';

const data = '2026-10-18T12:00:00.000Z';
const contexto = { campanhaId:'c', fichaId:'f', anexoId:'json', categoria:'jogador' as const, importadoEm:data };
const arquivo = (texto: string) => Object.assign(new Blob([texto], { type:'application/json' }), { name:'Aria.json' }) as File;
const textoFicha = (versaoRegras: 'DND_2014' | 'DND_2024') => exportFicha(new Ficha({ id:'original', nomePersonagem:'Ária', versaoRegras,
  levelTotal:2, atributosPersonagem:new Atributos(15,14,13,12,11,10), vidaAtual:7, vidaTotal:18,
  classePrincipal:{ nome:'Mago', dadosVida:6 } as Ficha['classePrincipal'],
  magiasEscolhidas:[{ classe:'Mago', magia:['Bola de Fogo'] }],
}));
function vazio(): DadosCampanha { return { campanha:{ id:'c', nome:'PDF', schemaVersion:1, roteiro:'', criadoEm:data, atualizadoEm:data },
  fichas:[], anexos:[], instancias:[], combates:[], participantes:[], layout:criarLayoutPadrao('c') }; }
const template = Uint8Array.from(fs.readFileSync(`${process.cwd()}/public/ficha-de-personagem-dd-5e.pdf`));
const fetchAnterior = global.fetch;
beforeAll(() => { Object.defineProperty(globalThis,'crypto',{ configurable:true,value:webcrypto }); });
beforeEach(() => { global.fetch = jest.fn(async () => ({ ok:true, arrayBuffer:async () => template.buffer })) as unknown as typeof fetch; });
afterEach(() => { global.fetch = fetchAnterior; jest.restoreAllMocks(); });

test.each(['DND_2014','DND_2024'] as const)('gera PDF real %s com a mesma saída textual do exportador normal e preserva JSON', async versao => {
  const texto = textoFicha(versao);
  const original = arquivo(texto);
  const desenhar = jest.spyOn(PDFPage.prototype,'drawText');
  const preparado = await prepararImportacaoComPdf(original, contexto);
  const conteudo = desenhar.mock.calls.map(c => c[0]);
  desenhar.mockClear();
  const normal = await gerarFichaPdf(parseImport(texto));
  expect(desenhar.mock.calls.map(c => c[0])).toEqual(conteudo);
  expect(conteudo.join('\n')).toContain(versao === 'DND_2024' ? '2024' : '2014');
  expect(conteudo.join('\n')).toContain('Bola de Fogo');
  expect(preparado.anexos[0].arquivo).toBe(original);
  expect(await preparado.anexos[0].arquivo.text()).toBe(texto);
  const pdf = preparado.anexos.find(a => a.id === preparado.ficha.pdfAnexoId)!;
  const documento = await PDFDocument.load(await pdf.arquivo.arrayBuffer());
  expect(documento.getPageCount()).toBe((await PDFDocument.load(normal)).getPageCount());
  expect(documento.getPageCount()).toBeGreaterThanOrEqual(3);
  expect(preparado.ficha).toMatchObject({ anexoId:'json', formato:'json', origemJson:{ versaoRegras:versao }, pvIniciais:{ atuais:7,maximos:18 } });
});

test('aceita snapshot histórico completo sem edição explícita e recusa JSON externo e versões desconhecidas', async () => {
  const historico = JSON.parse(textoFicha('DND_2014')).data;
  delete historico.versaoRegras;
  expect(validarJsonDoSite(JSON.stringify(historico)).versaoRegras).toBe('DND_2014');
  expect((await prepararImportacaoComPdf(arquivo(JSON.stringify(historico)),contexto)).ficha.pdfAnexoId).toBeTruthy();
  for (const externo of [{id:'x',nomePersonagem:'Aria'}, {nome:'Aria'}, ['ficha'], {format:'externo',version:1,data:historico}]) {
    expect(() => validarJsonDoSite(JSON.stringify(externo))).toThrow();
  }
  await expect(prepararImportacaoComPdf(arquivo('{"id":"x","nomePersonagem":"Aria"}'), contexto)).rejects.toThrow('exportado pelo MinhaFichaDnd');
  historico.versaoRegras = 'DND_2030';
  expect(() => validarJsonDoSite(JSON.stringify(historico))).toThrow();
});

test('falha de geração não produz resultado parcial e permite repetir a importação', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({ok:false});
  const original = arquivo(textoFicha('DND_2024'));
  await expect(prepararImportacaoComPdf(original,contexto)).rejects.toThrow('template');
  expect((await prepararImportacaoComPdf(original,contexto)).anexos).toHaveLength(2);
});

test('converte legado mínimo já importado, preserva ajustes e retrato e não regenera', async () => {
  const legado = await prepararImportacao(arquivo('{"id":"antigo","nomePersonagem":"Antiga","vidaAtual":2,"vidaTotal":9}'),contexto);
  let dados = incorporarImportacao(vazio(),{ficha:legado.ficha,anexos:[legado.anexo]});
  dados.fichas[0].pvIniciais={atuais:4,maximos:20}; dados.instancias[0].pv={atuais:1,maximos:30};
  const convertido = await converterFichaJson(dados,'f');
  expect(convertido.instancias).toBe(dados.instancias);
  expect(convertido.fichas[0].pvIniciais).toEqual({atuais:4,maximos:20});
  expect(convertido.anexos[0]).toBe(dados.anexos[0]);
  expect(await converterFichaJson(convertido,'f')).toBe(convertido);
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test('importar → PDF → IndexedDB → reload → backup → restaurar mantém ambos arquivos e vínculos', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB:new IDBFactory(),nomeBanco:'pdf-integracao' });
  try {
    const preparado = await prepararImportacaoComPdf(arquivo(textoFicha('DND_2024')),contexto);
    const retrato = new Blob([new Uint8Array([137,80,78,71,13,10,26,10])],{type:'image/png'});
    preparado.anexos.push({id:'retrato',campanhaId:'c',nome:'retrato.png',mime:'image/png',tamanho:retrato.size,arquivo:retrato});
    preparado.ficha.imagemAnexoId='retrato';
    await repo.criar(incorporarImportacao(vazio(),preparado));
    repo.fechar();
    const salvo = (await repo.obter('c'))!;
    expect(salvo.fichas[0].pdfAnexoId).toBe(preparado.ficha.pdfAnexoId);
    const pdf = salvo.anexos.find(a=>a.id===salvo.fichas[0].pdfAnexoId)!;
    expect((await PDFDocument.load(await pdf.arquivo.arrayBuffer())).getPageCount()).toBeGreaterThanOrEqual(3);
    const restaurado = await restaurarBackup(await exportarBackup(salvo),repo);
    const reaberto = (await repo.obter(restaurado.campanha.id))!;
    expect(reaberto.fichas[0].anexoId).not.toBe(salvo.fichas[0].anexoId);
    expect(reaberto.fichas[0].pdfAnexoId).not.toBe(salvo.fichas[0].pdfAnexoId);
    expect(reaberto.fichas[0].imagemAnexoId).not.toBe('retrato');
    expect(reaberto.instancias[0].pv).toEqual({atuais:7,maximos:18});
    expect(await reaberto.anexos.find(a=>a.id===reaberto.fichas[0].anexoId)!.arquivo.text()).toBe(textoFicha('DND_2024'));
    expect(new Uint8Array(await reaberto.anexos.find(a=>a.id===reaberto.fichas[0].pdfAnexoId)!.arquivo.arrayBuffer())).toEqual(new Uint8Array(await pdf.arquivo.arrayBuffer()));
    expect(await converterFichaJson(reaberto,reaberto.fichas[0].id)).toBe(reaberto);
    const corrompido = {...reaberto,fichas:reaberto.fichas.map(f=>({...f,pdfAnexoId:'ausente'}))};
    expect(()=>validarDadosCampanha(corrompido)).toThrow();
  } finally { repo.fechar(); }
});

test('falha de transação ao converter não grava PDF órfão nem altera ficha ou PV', async () => {
  const repo = new RepositorioCampanhasIndexedDB({ indexedDB:new IDBFactory(),nomeBanco:'pdf-rollback' });
  try {
    const legado=await prepararImportacao(arquivo(textoFicha('DND_2014')),contexto);
    await repo.criar(incorporarImportacao(vazio(),{ficha:legado.ficha,anexos:[legado.anexo]}));
    const anterior=(await repo.obter('c'))!;
    const convertido=await converterFichaJson(anterior,'f');
    const nativo=IDBObjectStore.prototype.put;
    const put=jest.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,...args:Parameters<IDBObjectStore['put']>){
      if(this.name==='fichas') throw new DOMException('Sem espaço','QuotaExceededError');
      return nativo.apply(this,args);
    });
    await expect(repo.salvar(convertido)).rejects.toThrow(); put.mockRestore();
    expect(await repo.obter('c')).toEqual(anterior);
  } finally { repo.fechar(); }
});

test('backup v5 sem PDF continua legível e pode ser convertido sem descartar seu JSON', async () => {
  const legado=await prepararImportacao(arquivo(textoFicha('DND_2014')),contexto);
  const dados=incorporarImportacao(vazio(),{ficha:legado.ficha,anexos:[legado.anexo]});
  const arquivos=unzipSync(new Uint8Array(await (await exportarBackup(dados)).arrayBuffer()));
  const manifesto=JSON.parse(strFromU8(arquivos['manifesto.json'])); manifesto.versao=5;
  arquivos['manifesto.json']=strToU8(JSON.stringify(manifesto));
  const lido=await lerBackup(new Blob([zipSync(arquivos)]));
  expect(lido.fichas[0].pdfAnexoId).toBeUndefined();
  const convertido=await converterFichaJson(lido,'f');
  expect(convertido.fichas[0].pdfAnexoId).toBeTruthy();
  expect(await convertido.anexos[0].arquivo.text()).toBe(await dados.anexos[0].arquivo.text());
});
