import { AnexoCampanha, DadosCampanha } from '../areaMestre/modelos';

export interface EscolhaSala {
  jogadores: string[];
  combateId: string | null;
  monstros: string[];
}
export interface ArquivoPublico { id: string; mime: string; nome: string }
export interface VisaoSala {
  nome: string;
  jogadores: { id: string; nome: string; pv: { atuais: number; maximos: number }; ficha: ArquivoPublico | null; retrato: ArquivoPublico | null }[];
  combate: { imagens: { id: string; retrato: ArquivoPublico | null }[] } | null;
}
export interface PublicacaoSala { visao: VisaoSala; arquivos: Map<string, Blob> }

const imagens = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

/** Única passagem da campanha privada para a sala. Nunca serializar DadosCampanha. */
export function prepararPublicacao(dados: DadosCampanha, escolha: EscolhaSala): PublicacaoSala {
  const arquivos = new Map<string, Blob>();
  // IDs derivados da posição evitam expor nomes/IDs privados de monstros e anexos.
  const adicionar = (anexo: AnexoCampanha | undefined, id: string, retrato: boolean): ArquivoPublico | null => {
    if (!anexo || anexo.campanhaId !== dados.campanha.id) return null;
    if (!(imagens.has(anexo.mime) || (!retrato && anexo.mime === 'application/pdf'))) return null;
    if (anexo.arquivo.size > 20 * 1024 * 1024) throw new Error('Um arquivo compartilhado excede 20 MiB.');
    arquivos.set(id, anexo.arquivo);
    return { id, mime: anexo.mime, nome: retrato ? 'Retrato' : 'Ficha do grupo' };
  };
  const anexo = (id?: string) => dados.anexos.find(a => a.id === id);
  const jogadores = dados.instancias.filter(i => i.categoria === 'jogador' && i.campanhaId === dados.campanha.id && escolha.jogadores.includes(i.id)).map((instancia, indice) => {
    const ficha = dados.fichas.find(f => f.id === instancia.fichaOriginalId && f.categoria === 'jogador' && f.campanhaId === dados.campanha.id);
    const documento = ficha ? anexo(ficha.formato === 'json' ? ficha.pdfAnexoId : ficha.anexoId) : undefined;
    return {
      id: `j${indice}`, nome: instancia.nome,
      pv: { atuais: instancia.pv.atuais, maximos: instancia.pv.maximos },
      ficha: adicionar(documento, `j${indice}-ficha`, false),
      retrato: adicionar(anexo(ficha?.imagemAnexoId), `j${indice}-retrato`, true),
    };
  });
  const combate = dados.combates.find(c => c.id === escolha.combateId && c.campanhaId === dados.campanha.id && c.estado === 'ativo');
  const revelados = combate ? dados.participantes.filter(p => p.combateId === combate.id && escolha.monstros.includes(p.instanciaId)) : [];
  const retratos = revelados.flatMap(p => {
    const instancia = dados.instancias.find(i => i.id === p.instanciaId && i.categoria === 'monstro' && i.campanhaId === dados.campanha.id);
    if (!instancia) return [];
    const ficha = dados.fichas.find(f => f.id === instancia.fichaOriginalId && f.categoria === 'monstro' && f.campanhaId === dados.campanha.id);
    return [{ ficha }];
  }).map(({ ficha }, indice) => ({
    id: `m${indice}`,
    // Nunca usar anexoId como fallback: uma imagem pode ser a ficha inteira.
    retrato: adicionar(ficha?.imagemAnexoId !== ficha?.anexoId ? anexo(ficha?.imagemAnexoId) : undefined, `m${indice}-retrato`, true),
  }));
  return { visao: { nome: dados.campanha.nome, jogadores, combate: combate ? { imagens: retratos } : null }, arquivos };
}
