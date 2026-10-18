
import { webcrypto } from 'crypto';
import { Blob as NodeBlob } from 'buffer';
import { zipSync, unzipSync, strFromU8, strToU8 } from 'fflate';
import { exportarBackup, lerBackup, restaurarBackup, LIMITES_BACKUP } from './backup';
import { DadosCampanha } from './modelos';
import { normalizarRoteirosCampanha } from './roteiros';

Object.defineProperty(globalThis, 'Blob', { value: NodeBlob, configurable: true });
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
const data = '2026-10-17T12:00:00Z';
function campanha(): DadosCampanha {
  const arquivo = new Blob([new Uint8Array([0, 255, 37, 80, 68, 70])], { type: 'application/pdf' });
  return {
    campanha: { id: 'campanha', schemaVersion: 1, nome: 'Teste', roteiro: 'Roteiro completo', criadoEm: data, atualizadoEm: data },
    anexos: [{ id: 'anexo', campanhaId: 'campanha', nome: 'monstro.pdf', mime: 'application/pdf', tamanho: arquivo.size, arquivo }, { id: 'imagem', campanhaId: 'campanha', nome: 'imagem.png', mime: 'image/png', tamanho: 3, arquivo: new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' }) }],
    fichas: [{ id: 'ficha', campanhaId: 'campanha', categoria: 'monstro', formato: 'pdf', anexoId: 'anexo', imagemAnexoId: 'imagem', nome: 'Monstro', pvIniciais: { atuais: 7, maximos: 7 }, origemPV: 'manual-pendente', avisos: ['extracao-manual'], importadoEm: data }],
    instancias: [{ id: 'instancia', campanhaId: 'campanha', fichaOriginalId: 'ficha', categoria: 'monstro', nome: 'Monstro', pv: { atuais: 2, maximos: 7 } }, { id: 'instancia2', campanhaId: 'campanha', fichaOriginalId: 'ficha', categoria: 'monstro', nome: 'Outro', pv: { atuais: 7, maximos: 7 } }],
    combates: [{ id: 'combate', campanhaId: 'campanha', estado: 'ativo', rodada: 2, participanteAtivoId: 'participante', iniciadoEm: data, encerradoEm: null }],
    participantes: [{ id: 'participante', combateId: 'combate', instanciaId: 'instancia', iniciativa: 14, ordem: 0, pvInicio: { atuais: 7, maximos: 7 } }, { id: 'participante2', combateId: 'combate', instanciaId: 'instancia2', iniciativa: 9, ordem: 1, pvInicio: { atuais: 7, maximos: 7 } }],
    layout: { campanhaId: 'campanha', versao: 1, sidebarRecolhida: true, paineis: [{ id: 'painel', tipo: 'pv', x: 0, y: 0, largura: 2, altura: 2, recolhido: false, fechado: false }] },
  };
}
async function alterar(backup: Blob, alterarArquivos: (arquivos: Record<string, Uint8Array>) => void): Promise<Blob> {
  const arquivos = unzipSync(new Uint8Array(await backup.arrayBuffer()));
  alterarArquivos(arquivos);
  return new Blob([zipSync(arquivos)]);
}

test('round-trip preserva metadados, entidades, estado e bytes exatos', async () => {
  const original = campanha();
  const lido = await lerBackup(await exportarBackup(original));
  expect(lido).toEqual({ ...original, campanha: normalizarRoteirosCampanha(original.campanha) });
  expect(await lido.anexos[0].arquivo.arrayBuffer()).toEqual(await original.anexos[0].arquivo.arrayBuffer());
});

test('restaura todos os relacionamentos com IDs novos e grava uma única vez', async () => {
  const criar = jest.fn().mockResolvedValue(undefined);
  let id = 0;
  const resultado = await restaurarBackup(await exportarBackup(campanha()), { criar }, () => `novo-${++id}`);
  expect(criar).toHaveBeenCalledTimes(1);
  expect(criar).toHaveBeenCalledWith(resultado);
  expect(resultado.campanha.id).toBe('novo-1');
  expect(resultado.anexos[0].campanhaId).toBe(resultado.campanha.id);
  expect(resultado.fichas[0].anexoId).toBe(resultado.anexos[0].id);
  expect(resultado.fichas[0].imagemAnexoId).toBe(resultado.anexos[1].id);
  expect(resultado.instancias[0].fichaOriginalId).toBe(resultado.fichas[0].id);
  expect(resultado.participantes[0].instanciaId).toBe(resultado.instancias[0].id);
  expect(resultado.participantes[0].combateId).toBe(resultado.combates[0].id);
  expect(resultado.combates[0].participanteAtivoId).toBe(resultado.participantes[0].id);
  expect(resultado.layout.paineis[0].id).not.toBe('painel');
  expect(resultado.instancias[0].pv).toEqual({ atuais: 2, maximos: 7 });
});

test.each(['ausente', 'corrompido', 'extra', 'caminho', 'referencia', 'versao'] as const)('rejeita %s antes de persistir', async caso => {
  const backup = await alterar(await exportarBackup(campanha()), arquivos => {
    if (caso === 'ausente') delete arquivos['anexos/0.bin'];
    if (caso === 'corrompido') arquivos['anexos/0.bin'][0] ^= 1;
    if (caso === 'extra') arquivos['anexos/999.bin'] = new Uint8Array([1]);
    if (caso === 'caminho') arquivos['../segredo'] = new Uint8Array([1]);
    const manifesto = JSON.parse(strFromU8(arquivos['manifesto.json']));
    if (caso === 'referencia') manifesto.dados.fichas[0].anexoId = 'inexistente';
    if (caso === 'versao') manifesto.versao = 500;
    arquivos['manifesto.json'] = strToU8(JSON.stringify(manifesto));
  });
  const criar = jest.fn();
  await expect(restaurarBackup(backup, { criar })).rejects.toMatchObject({ codigo: caso === 'versao' ? 'backup-incompativel' : 'backup-invalido' });
  expect(criar).not.toHaveBeenCalled();
});

test('rejeita colisão do gerador sem persistir', async () => {
  const criar = jest.fn();
  await expect(restaurarBackup(await exportarBackup(campanha()), { criar }, () => 'repetido')).rejects.toMatchObject({ codigo: 'conflito' });
  expect(criar).not.toHaveBeenCalled();
});

test('propaga falha atômica do repositório', async () => {
  const falha = { codigo: 'cota-excedida' };
  const criar = jest.fn().mockRejectedValue(falha);
  let id = 0;
  await expect(restaurarBackup(await exportarBackup(campanha()), { criar }, () => `novo-${++id}`)).rejects.toBe(falha);
  expect(criar).toHaveBeenCalledTimes(1);
});

test('rejeita ZIP truncado, texto e tamanho declarado excessivo antes da descompressão', async () => {
  await expect(lerBackup(new Blob(['invalid']))).rejects.toMatchObject({ codigo: 'backup-invalido' });
  const backup = new Uint8Array(await (await exportarBackup(campanha())).arrayBuffer());
  await expect(lerBackup(new Blob([backup.subarray(0, backup.length - 1)]))).rejects.toMatchObject({ codigo: 'backup-invalido' });
  const v = new DataView(backup.buffer);
  const central = v.getUint32(backup.length - 6, true);
  v.setUint32(central + 24, LIMITES_BACKUP.anexo + 1, true);
  await expect(lerBackup(new Blob([backup]))).rejects.toMatchObject({ codigo: 'arquivo-grande' });
});




test('interrompe deflate cujo tamanho real excede o anunciado', async () => {
  const arquivo = zipSync({ 'anexos/0.bin': new Uint8Array(1024 * 1024), 'manifesto.json': strToU8('{}') });
  const v = new DataView(arquivo.buffer);
  const central = v.getUint32(arquivo.length - 6, true);
  v.setUint32(central + 24, 1, true);
  v.setUint32(v.getUint32(central + 42, true) + 22, 1, true);
  await expect(lerBackup(new Blob([arquivo]))).rejects.toMatchObject({ codigo: 'backup-invalido' });
});

test('detecta corrupção do manifesto por CRC mesmo se ainda for JSON válido', async () => {
  const arquivo = new Uint8Array(await (await exportarBackup(campanha())).arrayBuffer());
  const marcador = strToU8('Teste');
  const indice = arquivo.findIndex((_, i) => marcador.every((byte, j) => arquivo[i + j] === byte));
  expect(indice).toBeGreaterThan(-1);
  arquivo[indice] = 'R'.charCodeAt(0);
  await expect(lerBackup(new Blob([arquivo]))).rejects.toMatchObject({ codigo: 'backup-invalido' });
});

test('exportação captura metadados e relações antes do primeiro await', async () => {
  const dados = campanha();
  const exportacao = exportarBackup(dados);
  dados.campanha.nome = 'Alterado durante exportação';
  dados.instancias[0].pv.atuais = 0;
  dados.fichas[0].anexoId = 'inexistente';
  dados.anexos.splice(0, 1);
  const lido = await lerBackup(await exportacao);
  expect(lido.campanha.nome).toBe('Teste');
  expect(lido.instancias[0].pv.atuais).toBe(2);
  expect(lido.fichas[0].anexoId).toBe('anexo');
  expect(lido.anexos).toHaveLength(2);
});

test.each(['', 'application/octet-stream'])('preserva Blob.type original %p independente do MIME canônico', async tipo => {
  const dados = campanha();
  dados.anexos[0].arquivo = new Blob([await dados.anexos[0].arquivo.arrayBuffer()], { type: tipo });
  const lido = await lerBackup(await exportarBackup(dados));
  expect(lido.anexos[0].mime).toBe('application/pdf');
  expect(lido.anexos[0].arquivo.type).toBe(tipo);
  expect(await lido.anexos[0].arquivo.arrayBuffer()).toEqual(await dados.anexos[0].arquivo.arrayBuffer());
});

test.each([undefined, 42, 'a'.repeat(256), 'image/png\n'])('rejeita tipo binário inválido %p', async tipoBinario => {
  const backup = await alterar(await exportarBackup(campanha()), arquivos => {
    const manifesto = JSON.parse(strFromU8(arquivos['manifesto.json']));
    manifesto.dados.anexos[0].tipoBinario = tipoBinario;
    arquivos['manifesto.json'] = strToU8(JSON.stringify(manifesto));
  });
  await expect(lerBackup(backup)).rejects.toMatchObject({ codigo: 'backup-invalido' });
});

test('propaga falha de leitura binária com código previsível', async () => {
  const dados = campanha();
  jest.spyOn(dados.anexos[0].arquivo, 'arrayBuffer').mockRejectedValue(new Error('falha'));
  await expect(exportarBackup(dados)).rejects.toMatchObject({ codigo: 'backup-invalido' });
});

test('ausência de randomUUID retorna indisponivel sem persistir', async () => {
  const backup = await exportarBackup(campanha());
  const criar = jest.fn();
  Object.defineProperty(globalThis, 'crypto', { value: { subtle: webcrypto.subtle }, configurable: true });
  try {
    await expect(restaurarBackup(backup, { criar })).rejects.toMatchObject({ codigo: 'indisponivel' });
    expect(criar).not.toHaveBeenCalled();
  } finally {
    Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
  }
});
