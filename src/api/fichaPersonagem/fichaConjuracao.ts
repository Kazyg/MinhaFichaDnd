import { buscarMagiaConteudo, getMagiasConteudo, referenciaConteudo, resolverMagiaSalva } from '../rulesets/conteudo';
import type { MagiaConteudo, ReferenciaConteudo } from '../rulesets/types';
import type { Ficha } from './FichaPersonagem';
import { chaveClasse, normalizarChave } from '../rulesets/progressao';
import { calcularBonusMagiaPorClasse } from './fichaEfeitosUtils';
import { selecionarClassesAtivas, modificadorAtributo, selecionarProficiencia } from './fichaSeletores';
import { EdicaoMagia, ProgressaoMagia, espacosCompletos, espacosDaFonte, limitesDaFonte } from '../rulesets/conjuracao';
import { magiasBardo, magiasBruxo, magiasClerigo, magiasDruida, magiasFeiticeiro, magiasMago, magiasPaladino, magiasPatrulheiro } from '../../bibliotecas/Magia';

type Documento = Ficha | null | undefined;
export type CategoriaMagia = 'truque' | 'conhecida' | 'livro' | 'preparada' | 'pendente';
export type EscolhaMagia = {
  id: string; nome: string; fonte: string; classe: string; edicao: EdicaoMagia;
  catalogo: string; nivel: number | null; categoria: CategoriaMagia; preparada: boolean;
  conteudo?: ReferenciaConteudo; snapshot?: MagiaConteudo;
  aquisicao: 'progressao' | 'copia' | 'legado'; aviso?: string;
};
export type FonteConjuracao = {
  id: string; classe: string; chave: string; nome: string; edicao: EdicaoMagia; nivel: number;
  lista: string; atributo: string; progressao: ProgressaoMagia; circuloMaximo: number;
  espacos: number[]; truques: number; magias: number; livroPorProgressao: number;
  categoria: CategoriaMagia; cd: number; ataque: number;
};
// Acervo histórico: usado só na leitura legada, reconhecimento de classes e escolas 2014.
// Seleções novas usam getMagiasConteudo(fonte.edicao), nunca estas listas em 2024.
export const listasMagias: Record<string, { nome: string; nivel: number; tipo: string }[]> = {
  bardo: magiasBardo, bruxo: magiasBruxo, clerigo: magiasClerigo, druida: magiasDruida,
  feiticeiro: magiasFeiticeiro, mago: magiasMago, paladino: magiasPaladino, patrulheiro: magiasPatrulheiro,
};
export const catalogoMagias = [...new Map(Object.values(listasMagias).flat().map(m => [m.nome, m])).values()];
export const buscarMagia = (nome: string) => catalogoMagias.find(m => m.nome === nome);
const fonteId = (edicao: EdicaoMagia, chave: string, sub = '') => `${edicao}:${chave}${sub ? `:${sub}` : ''}`;
export function selecionarFontesConjuracao(f: Documento): FonteConjuracao[] {
  const edicao = f?.versaoRegras ?? 'DND_2014';
  return selecionarClassesAtivas(f).flatMap(c => {
    const sub = f?.subClasse?.find(s => chaveClasse(s.classe) === c.chave)?.subclasse;
    const nomeSub = normalizarChave(sub?.nome ?? '');
    const arcana = c.nivel >= 3 && ((c.chave === 'guerreiro' && ['cavaleiro arcano', 'cavaleiro mistico'].includes(nomeSub)) || (c.chave === 'ladino' && nomeSub === 'trapaceiro arcano'));
    if (!listasMagias[c.chave] && !arcana) return [];
    const progressao: ProgressaoMagia = arcana ? 'terco' : c.chave === 'bruxo' ? 'pacto' : ['paladino', 'patrulheiro'].includes(c.chave) ? 'meia' : 'completa';
    const espacos = espacosDaFonte(c.nivel, progressao, edicao);
    if (!espacos.length) return [];
    const atributo = arcana || c.chave === 'mago' ? 'inteligencia' : ['clerigo', 'druida', 'patrulheiro'].includes(c.chave) ? 'sabedoria' : 'carisma';
    const mod = modificadorAtributo(f, atributo);
    const categoria: CategoriaMagia = c.chave === 'mago' ? 'livro' : edicao === 'DND_2024' || ['clerigo', 'druida', 'paladino'].includes(c.chave) ? 'preparada' : 'conhecida';
    return [{ id: fonteId(edicao, c.chave, arcana ? nomeSub : ''), classe: c.nome, chave: c.chave,
      nome: arcana ? `${c.nome} — ${sub!.nome}` : c.nome, edicao, nivel: c.nivel,
      lista: arcana ? 'mago' : c.chave, atributo, progressao, espacos, circuloMaximo: espacos.length,
      ...limitesDaFonte(c.chave, c.nivel, edicao, mod), categoria,
      cd: 8 + mod + selecionarProficiencia(f) + calcularBonusMagiaPorClasse(f, 'cd_magia', c.nome),
      ataque: mod + selecionarProficiencia(f) + calcularBonusMagiaPorClasse(f, 'ataque_magia', c.nome),
    }];
  });
}
export function selecionarPoolsMagia(f: Documento) {
  const fontes = selecionarFontesConjuracao(f);
  const comuns = fontes.filter(s => s.progressao !== 'pacto');
  const nivel = comuns.reduce((s, c) => s + (c.progressao === 'completa' ? c.nivel : c.progressao === 'terco' ? Math.floor(c.nivel / 3) : c.edicao === 'DND_2024' ? Math.ceil(c.nivel / 2) : Math.floor(c.nivel / 2)), 0);
  const pools = comuns.length ? [{ id: 'conjuracao', nome: 'Conjuração', recuperacao: 'Descanso longo', fontes: comuns.map(c => c.id), espacos: comuns.length === 1 ? [...comuns[0].espacos] : espacosCompletos(nivel) }] : [];
  return [...pools, ...fontes.filter(c => c.progressao === 'pacto').map(c => ({ id: `pacto:${c.id}`, nome: `Magia de Pacto — ${c.nome}`, recuperacao: 'Descanso curto ou longo', fontes: [c.id], espacos: [...c.espacos] }))];
}

// Pure, lossless projection. The original legacy array remains in the document as a recovery snapshot.
export function selecionarEscolhasMagia(f: Documento): EscolhaMagia[] {
  if (f?.magiasConjuracao) return f.magiasConjuracao;
  const fontes = selecionarFontesConjuracao(f);
  return (f?.magiasEscolhidas ?? []).flatMap((g, gi) => g.magia.map((nome, mi) => {
    const candidatas = fontes.filter(s => chaveClasse(g.classe) === s.chave || (chaveClasse(g.classe) === 'mago' && s.lista === 'mago'));
    const fonte = candidatas.length === 1 ? candidatas[0] : undefined;
    const magia = buscarMagia(nome);
    const categoria = magia?.nivel === 0 ? 'truque' : fonte?.categoria ?? 'pendente';
    return { id: `legado:${gi}:${mi}`, nome, fonte: fonte?.id ?? `legado:${g.classe}`, classe: fonte?.classe ?? g.classe,
      edicao: f?.versaoRegras ?? 'DND_2014', catalogo: 'catalogo-2014', nivel: magia?.nivel ?? null,
      categoria, preparada: categoria === 'livro' || categoria === 'preparada', aquisicao: 'legado',
      aviso: !fonte ? 'Origem antiga ambígua ou inativa: escolha uma fonte para revisar.' : categoria === 'livro' ? 'Lista antiga interpretada como livro e preparação; confirme a preparação.' : undefined,
    } as EscolhaMagia;
  }));
}
export function migrarMagias(f: Ficha) {
  if (f.magiasConjuracao) return;
  f.magiasConjuracao = selecionarEscolhasMagia(f);
  if (f.magiasEscolhidas?.length) f.migracoes = [...new Set([...(f.migracoes ?? []), 'F6-conjuracao-v1'])];
}
export function categoriaNaFonte(fonte: FonteConjuracao, nome: string): CategoriaMagia {
  return buscarMagiaConteudo(fonte.edicao, nome)?.nivel === 0 ? 'truque' : fonte.categoria;
}
export function validarEscolhaMagia(f: Documento, fonteIdEscolhida: string, nome: string, aquisicao: EscolhaMagia['aquisicao'] = 'progressao', ignorarId?: string): string | null {
  const fonte = selecionarFontesConjuracao(f).find(s => s.id === fonteIdEscolhida);
  if (!fonte) return 'Fonte de conjuração inativa ou não identificada.';
  const magia = getMagiasConteudo(fonte.edicao).find(m => m.nome === nome && m.listas.includes(fonte.lista));
  if (!magia) return 'Magia ausente da lista desta fonte no catálogo disponível.';
  if (magia.nivel > fonte.circuloMaximo) return `Esta fonte permite no máximo o círculo ${fonte.circuloMaximo}. Espaços combinados não ampliam esse limite.`;
  const escolhas = selecionarEscolhasMagia(f).filter(e => e.fonte === fonte.id && e.id !== ignorarId);
  if (escolhas.some(e => e.nome === nome)) return 'Esta magia já está registrada nesta fonte.';
  const categoria = categoriaNaFonte(fonte, nome);
  const atuais = escolhas.filter(e => e.categoria === categoria);
  const limite = categoria === 'truque' ? fonte.truques : categoria === 'livro' ? fonte.livroPorProgressao : fonte.magias;
  const contagem = categoria === 'livro' ? atuais.filter(e => e.aquisicao !== 'copia').length : atuais.length;
  if (!(categoria === 'livro' && aquisicao === 'copia') && contagem >= limite) return `Limite de ${limite} para ${categoria === 'livro' ? 'magias de livro por progressão' : categoria + 's'} nesta fonte.`;
  if (aquisicao === 'copia' && categoria !== 'livro') return 'Cópia só se aplica ao livro do Mago.';
  if (fonte.progressao === 'terco' && fonte.edicao === 'DND_2014' && magia.nivel > 0) {
    const escolas = fonte.chave === 'guerreiro' ? ['abjuração', 'evocação'] : ['encantamento', 'ilusão'];
    const livres = [3,8,14,20].filter(n => fonte.nivel >= n).length;
    if (!escolas.includes(magia.tipo) && atuais.filter(e => !escolas.includes(buscarMagia(e.nome)?.tipo ?? '')).length >= livres) return `Limite de ${livres} escolhas fora das escolas da subclasse.`;
  }
  // Arcane Trickster has Mage Hand and two free choices, not three free choices.
  if (fonte.chave === 'ladino' && categoria === 'truque' && nome !== 'Mãos Mágicas' && atuais.filter(e => e.nome !== 'Mãos Mágicas').length >= fonte.truques - 1) return 'Um dos truques é reservado a Mãos Mágicas.';
  return null;
}
export function adicionarMagia(f: Ficha, fonteIdEscolhida: string, nome: string, aquisicao: EscolhaMagia['aquisicao'] = 'progressao'): string | null {
  const erro = validarEscolhaMagia(f, fonteIdEscolhida, nome, aquisicao);
  if (erro) return erro;
  const fonte = selecionarFontesConjuracao(f).find(s => s.id === fonteIdEscolhida)!;
  migrarMagias(f);
  const categoria = categoriaNaFonte(fonte, nome);
  const escolha: EscolhaMagia = { id: f.gerarIdUnico(), nome, fonte: fonte.id, classe: fonte.classe, edicao: fonte.edicao,
    catalogo: fonte.edicao, conteudo: referenciaConteudo(buscarMagiaConteudo(fonte.edicao, nome)!), snapshot: buscarMagiaConteudo(fonte.edicao, nome), nivel: buscarMagiaConteudo(fonte.edicao, nome)!.nivel, categoria, preparada: categoria === 'preparada', aquisicao };
  f.magiasConjuracao = [...f.magiasConjuracao!, escolha];
  return null;
}
export function prepararMagia(f: Ficha, id: string, preparada: boolean): string | null {
  const escolha = selecionarEscolhasMagia(f).find(e => e.id === id);
  if (!escolha || escolha.categoria !== 'livro') return 'Escolha uma magia do livro.';
  const fonte = selecionarFontesConjuracao(f).find(s => s.id === escolha.fonte);
  if (preparada) {
    if (!fonte || (escolha.nivel ?? 99) > fonte.circuloMaximo) return 'Esta magia não pode ser preparada no nível atual desta fonte.';
    const magia = resolverMagiaSalva(escolha);
    if (escolha.conteudo && (!magia || magia.edicao !== fonte.edicao)) return 'Revisão de conteúdo desconhecida ou de outra edição; revise a escolha.';
    if (!escolha.conteudo && fonte.edicao === 'DND_2024') return 'Catálogo legado 2014: revise explicitamente o conteúdo antes de preparar em 2024.';
    if (!magia || magia.nome !== escolha.nome || !magia.listas.includes(fonte.lista) || magia.nivel === 0 || magia.nivel !== escolha.nivel || escolha.edicao !== fonte.edicao) return 'Revise a lista, o círculo e a edição desta escolha antes de preparar.';
    if (selecionarEscolhasMagia(f).filter(e => e.fonte === fonte.id && e.id !== id && e.preparada).length >= fonte.magias) return `Limite de ${fonte.magias} magias preparadas.`;
  }
  migrarMagias(f);
  f.magiasConjuracao = f.magiasConjuracao!.map(e => e.id === id ? { ...e, preparada, aviso: undefined } : e);
  return null;
}
export function removerMagia(f: Ficha, id: string) {
  migrarMagias(f);
  const removida = f.magiasConjuracao!.find(e => e.id === id);
  if (!removida) return;
  f.escolhasAnteriores = [...(f.escolhasAnteriores ?? []), { tipo: 'magia', valor: removida }];
  f.magiasConjuracao = f.magiasConjuracao!.filter(e => e.id !== id);
}
export function revisarFonteMagia(f: Ficha, id: string, fonteIdEscolhida: string): string | null {
  const escolha = selecionarEscolhasMagia(f).find(e => e.id === id);
  if (!escolha) return 'Escolha não encontrada.';
  const erro = validarEscolhaMagia(f, fonteIdEscolhida, escolha.nome, 'progressao', id);
  if (erro) return erro;
  const fonte = selecionarFontesConjuracao(f).find(s => s.id === fonteIdEscolhida)!;
  migrarMagias(f);
  f.escolhasAnteriores = [...(f.escolhasAnteriores ?? []), { tipo: 'fonte-magia', valor: escolha }];
  const categoria = categoriaNaFonte(fonte, escolha.nome);
  f.magiasConjuracao = f.magiasConjuracao!.map(e => e.id === id ? { ...e, fonte: fonte.id, classe: fonte.classe,
    edicao: fonte.edicao, catalogo: fonte.edicao, conteudo: referenciaConteudo(buscarMagiaConteudo(fonte.edicao, e.nome)!), snapshot: buscarMagiaConteudo(fonte.edicao, e.nome), categoria, nivel: buscarMagiaConteudo(fonte.edicao, e.nome)!.nivel, preparada: categoria === 'preparada', aviso: undefined } : e);
  return null;
}
export function pendenciasMagia(f: Documento, escolha: EscolhaMagia): string[] {
  const fonte = selecionarFontesConjuracao(f).find(s => s.id === escolha.fonte);
  const erro = validarEscolhaMagia(f, escolha.fonte, escolha.nome, escolha.aquisicao, escolha.id);
  const avisos = [escolha.aviso, erro];
  const conteudo = resolverMagiaSalva(escolha);
  if (!conteudo) avisos.push('Referência ou revisão de conteúdo desconhecida; snapshot preservado, sem fallback.');
  if (conteudo && conteudo.nome !== escolha.nome) avisos.push('Nome salvo diverge da referência de conteúdo; revise a escolha.');
  if (!escolha.conteudo) avisos.push('Conteúdo legado catalogo-2014 sem revisão individual; significado antigo preservado.');
  if (conteudo && conteudo.edicao !== f?.versaoRegras) avisos.push('Conteúdo 2014 em ficha de outra edição: revisão explícita necessária.');
  if (conteudo?.licenca === 'pendente') avisos.push('Fonte/licença deste conteúdo ainda pendente.');
  if (escolha.edicao !== f?.versaoRegras) avisos.push('Edição da escolha difere da ficha; revisar sem converter automaticamente.');
  if (fonte && escolha.categoria !== categoriaNaFonte(fonte, escolha.nome)) avisos.push('Categoria antiga precisa ser revisada.');
  if (conteudo && escolha.nivel !== conteudo.nivel) avisos.push('Círculo salvo difere do catálogo; revise a escolha.');
  if (fonte && escolha.categoria === 'livro' && escolha.preparada && selecionarEscolhasMagia(f).filter(e => e.fonte === fonte.id && e.preparada).length > fonte.magias) avisos.push(`Preparação excede o limite de ${fonte.magias}.`);
  return avisos.filter((a): a is string => !!a);
}
