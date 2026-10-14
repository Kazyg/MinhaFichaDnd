import { magiasPhb2024, talentosPhb2024 } from './dnd2024/conteudoPhb';
import { Talentos } from '../../bibliotecas/Talentos';
import { Magias, magiasBardo, magiasBruxo, magiasClerigo, magiasDruida, magiasFeiticeiro, magiasMago, magiasPaladino, magiasPatrulheiro } from '../../bibliotecas/Magia';
import { talentosOrigem2024 } from './dnd2024/talentosLegados';
import type { MagiaConteudo, MetadadosConteudo, ReferenciaConteudo, RulesetVersion, TalentoConteudo } from './types';

export const SRD51 = 'https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf';
export const SRD521 = 'https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf';
export const ERRATA2024 = 'https://media.dndbeyond.com/compendium-images/errata/PHB-24/PHB-2024_v1.pdf';
export const chaveConteudo = (nome: string) => nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
const copia = <T,>(valor: T): T => JSON.parse(JSON.stringify(valor));
function edicaoValida(edicao: RulesetVersion) {
  if (edicao !== 'DND_2014' && edicao !== 'DND_2024') throw new Error(`Edição de conteúdo não suportada: ${String(edicao)}`);
}
function meta(nome: string, edicao: RulesetVersion, categoria: string, verificado = false): MetadadosConteudo {
  const localizador: Record<string, string> = { Alerta: 'Alert, Feats, p. 87', Habilidoso: 'Skilled, Feats, p. 87', Imobilizador: 'Grappler, Feats, p. 87', 'Curar Ferimentos': edicao === 'DND_2024' ? 'Cure Wounds, Spells, p. 121' : 'Cure Wounds, Spells' };
  return { id: `${edicao}:${categoria === 'magia' ? 'magia' : 'talento'}:${chaveConteudo(nome)}`, edicao,
    revisao: verificado ? edicao === 'DND_2024' ? 'srd-5.2.1-pt-resumo-1' : 'srd-5.1-pt-resumo-1' : 'legado-local-1',
    categoria, natureza: verificado ? 'oficial' : 'nao-verificado', licenca: verificado ? 'CC-BY-4.0' : 'pendente',
    errata: verificado && edicao === 'DND_2024' ? ERRATA2024 : null,
    fonte: { titulo: verificado ? edicao === 'DND_2024' ? 'SRD 5.2.1' : 'SRD 5.1' : 'Catálogo local anterior à F7',
      url: verificado ? edicao === 'DND_2024' ? SRD521 : SRD51 : undefined,
      localizador: verificado ? localizador[nome] ?? nome : nome, consultadoEm: '2026-10-07' } };
}
const requisitoVazio = { tipo: null, requisito: null, valor: null };
const bonusVazio = [{ tipo: null, condicao: null, bonus: null, valor: null }];
const talentos2014: TalentoConteudo[] = Talentos.map(t => ({ ...t, ...meta(t.nome, 'DND_2014', 'Legacy'), repetivel: false, suportado: false }));
// O texto e a licença do Alerta 2014 não foram certificados: preservamos o registro local.
const alerta2014 = talentos2014.find(t => t.nome === 'ALERTA')!;
alerta2014.suportado = true;
alerta2014.iniciativa = 'fixo5';
alerta2014.fonte = { ...alerta2014.fonte, titulo: 'Alerta 2014 — registro local; PHB pendente de acesso', url: 'https://www.dndbeyond.com/feats/alert' };
const talentos2024: TalentoConteudo[] = talentosOrigem2024.map(t => ({ ...t, ...meta(t.nome, 'DND_2024', t.categoria), repetivel: false, suportado: false }));
function substituirTalento(t: TalentoConteudo) {
  const i = talentos2024.findIndex(v => v.nome === t.nome);
  if (i < 0) talentos2024.push(t); else talentos2024[i] = t;
}
substituirTalento({ ...meta('Alerta', 'DND_2024', 'Origin', true), nome: 'Alerta', repetivel: false, suportado: true,
  requisito: requisitoVazio, bonus: bonusVazio, iniciativa: 'proficiencia',
  descricao: 'Some seu bônus de proficiência à iniciativa. Após rolar, pode trocar a iniciativa com um aliado disposto no mesmo combate, se nenhum dos dois estiver incapacitado. A troca é resolvida pela mesa.' });
substituirTalento({ ...meta('Habilidoso', 'DND_2024', 'Origin', true), nome: 'Habilidoso', repetivel: true, suportado: true,
  requisito: requisitoVazio, bonus: bonusVazio, escolha: 'treinamentos',
  descricao: 'Escolha três proficiências em qualquer combinação de perícias e ferramentas. Pode adquirir este talento novamente.' });
substituirTalento({ ...meta('Imobilizador', 'DND_2024', 'General', true), nome: 'Imobilizador', repetivel: false, suportado: true,
  requisito: { tipo: 'atributo', requisito: ['forca', 'destreza'], valor: 13 }, bonus: bonusVazio, escolha: 'atributo-agarrador',
  descricao: 'Requer nível 4 e Força ou Destreza 13. Aumente Força ou Destreza em 1, até 20. Uma vez por turno, ao acertar um ataque desarmado na ação Atacar, pode causar dano e agarrar. Tem vantagem contra quem agarra e move alvos de seu tamanho ou menores sem custo extra de movimento. Benefícios de combate são resolvidos pela mesa.' });
const catalogoTalentos2024 = talentosPhb2024.map(t => talentos2024.find(a => a.nome === t.nome && a.suportado) ?? t);
const catalogoTalentos = (edicao: RulesetVersion) => edicao === 'DND_2014' ? talentos2014 : catalogoTalentos2024;
export function getTalentosConteudo(edicao: RulesetVersion): TalentoConteudo[] {
  edicaoValida(edicao); return copia(catalogoTalentos(edicao));
}
export function buscarTalentoConteudo(edicao: RulesetVersion, nome: string) {
  const canonico = nome.startsWith('Iniciado em Magia (') ? 'Iniciado em Magia' : nome;
  edicaoValida(edicao);
  const talento = catalogoTalentos(edicao).find(t => chaveConteudo(t.nome) === chaveConteudo(canonico));
  return talento ? copia(talento) : undefined;
}

export const listasLegadas = { bardo: magiasBardo, bruxo: magiasBruxo, clerigo: magiasClerigo, druida: magiasDruida,
  feiticeiro: magiasFeiticeiro, mago: magiasMago, paladino: magiasPaladino, patrulheiro: magiasPatrulheiro };
const vazia = { conjuracao: 'Consultar fonte', alcance: { tipo: 'Consultar fonte', distancia: 0 },
  componentes: { componentes: [] as string[], material: null }, concentracao: null, duracao: 'Consultar fonte', ritual: null };
// Snapshot acessível também a fichas 2024 antigas que explicitamente usavam catalogo-2014.
const magiasLegadas: MagiaConteudo[] = [...new Map(Object.values(listasLegadas).flat().map(m => [m.nome, m])).values()].map(m => ({
  ...vazia, ...Magias.find(d => d.nome === m.nome), ...m, ...meta(m.nome, 'DND_2014', 'magia'),
  descricao: Magias.find(d => d.nome === m.nome)?.descricao ?? 'Descrição legada indisponível.',
  listas: Object.entries(listasLegadas).filter(([, lista]) => lista.some(v => v.nome === m.nome)).map(([chave]) => chave),
}));
// Não fundir grafias distintas do acervo: a ficha antiga referencia o nome exato.
const idsLegados = magiasLegadas.map(m => m.id);
magiasLegadas.forEach(m => {
  if (idsLegados.filter(id => id === m.id).length > 1) m.id += `:${encodeURIComponent(m.nome)}`;
});
function curar(edicao: RulesetVersion): MagiaConteudo {
  const dados = edicao === 'DND_2024' ? 2 : 1;
  return { ...vazia, ...meta('Curar Ferimentos', edicao, 'magia', true), nome: 'Curar Ferimentos', nivel: 1,
    tipo: edicao === 'DND_2024' ? 'abjuração' : 'evocação', listas: ['bardo', 'clerigo', 'druida', 'paladino', 'patrulheiro'],
    conjuracao: '1 ação', alcance: { tipo: 'toque', distancia: 0 }, componentes: { componentes: ['V', 'S'], material: null }, duracao: 'Instantânea', concentracao: false, ritual: false,
    descricao: `Uma criatura tocada recupera ${dados}d8 + modificador de conjuração PV. Cada círculo acima do primeiro acrescenta ${dados}d8.` + (edicao === 'DND_2014' ? ' Não afeta mortos-vivos nem constructos.' : ''),
    cura: { dadosBase: dados, dadosPorCirculo: dados, dado: 8, exclui: edicao === 'DND_2014' ? ['morto-vivo', 'constructo'] : [] } };
}
const magias2014 = magiasLegadas.map(m => m.nome === 'Curar Ferimentos' ? curar('DND_2014') : m);
// Subconjunto com listas/círculo/escola verificados; texto integral consultado na fonte.
const indices2024: [string, string, number, string, string[]][] = [
  ['Luz', 'Light', 0, 'evocação', ['bardo', 'clerigo', 'feiticeiro', 'mago']],
  ['Mãos Mágicas', 'Mage Hand', 0, 'conjuração', ['bardo', 'feiticeiro', 'bruxo', 'mago']],
  ['Desejo', 'Wish', 9, 'conjuração', ['feiticeiro', 'mago']],
  ['Ilusão Menor', 'Minor Illusion', 0, 'ilusão', ['bardo', 'feiticeiro', 'bruxo', 'mago']],
  ['Prestidigitação', 'Prestidigitation', 0, 'transmutação', ['bardo', 'feiticeiro', 'bruxo', 'mago']],
  ['Detectar Magia', 'Detect Magic', 1, 'adivinhação', ['bardo', 'clerigo', 'druida', 'paladino', 'patrulheiro', 'feiticeiro', 'bruxo', 'mago']],
  ['Disfarçar-se', 'Disguise Self', 1, 'ilusão', ['bardo', 'feiticeiro', 'mago']],
];
const magias2024: MagiaConteudo[] = [curar('DND_2024'), ...indices2024.map(([nome, ingles, nivel, tipo, listas]) => ({
  ...vazia, ...meta(nome, 'DND_2024', 'magia', true), nome, nivel, tipo, listas,
  fonte: { titulo: 'SRD 5.2.1', url: SRD521, localizador: ingles, consultadoEm: '2026-10-07' },
  descricao: `${ingles} — índice verificado de 2024. Consulte a descrição no SRD 5.2.1; esta entrada não automatiza seus efeitos.`,
}))];
const catalogoMagias2024 = magiasPhb2024.map(m => m.nome === 'Curar Ferimentos' ? curar('DND_2024') : m);
const catalogoMagias = (edicao: RulesetVersion) => edicao === 'DND_2014' ? magias2014 : catalogoMagias2024;
export function getMagiasConteudo(edicao: RulesetVersion): MagiaConteudo[] {
  edicaoValida(edicao); return copia(catalogoMagias(edicao));
}
export function buscarMagiaConteudo(edicao: RulesetVersion, nome: string) {
  edicaoValida(edicao);
  const magia = catalogoMagias(edicao).find(m => m.nome === nome);
  return magia ? copia(magia) : undefined;
}
export const referenciaConteudo = ({ id, edicao, revisao }: ReferenciaConteudo): ReferenciaConteudo => ({ id, edicao, revisao });
export function resolverConteudo(ref: ReferenciaConteudo): MagiaConteudo | TalentoConteudo | undefined {
  // Referência desconhecida nunca vira uma revisão atual nem outra edição.
  if (!ref || !['DND_2014', 'DND_2024'].includes(ref.edicao)) return undefined;
  // Resolve first, then clone only the requested entry. Cloning both complete
  // catalogs for every derived attribute makes selecting a feat stall the UI.
  return copia([...catalogoMagias(ref.edicao), ...catalogoTalentos(ref.edicao), ...magiasLegadas, ...magias2024, ...talentos2024].find(c => c.id === ref.id && c.edicao === ref.edicao && c.revisao === ref.revisao) ?? null) ?? undefined;
}
export function resolverMagiaSalva(escolha: { nome: string; catalogo: string; conteudo?: ReferenciaConteudo; snapshot?: MagiaConteudo }) {
  if (escolha.conteudo) {
    const c = resolverConteudo(escolha.conteudo);
    return c && 'listas' in c ? c : undefined;
  }
  return escolha.catalogo === 'catalogo-2014' ? copia(magiasLegadas.find(m => m.nome === escolha.nome) ?? null) ?? undefined : undefined;
}
export function formulaCura(ref: ReferenciaConteudo, circulo: number, modificador: number, tipoAlvo = ''): string | null {
  const c = resolverConteudo(ref);
  if (!c || !('cura' in c) || !c.cura || !Number.isInteger(circulo) || circulo < c.nivel || circulo > 9 || !Number.isFinite(modificador) || c.cura.exclui.includes(tipoAlvo)) return null;
  return `${c.cura.dadosBase + c.cura.dadosPorCirculo * (circulo - c.nivel)}d${c.cura.dado}${modificador < 0 ? '' : '+'}${modificador}`;
}
export const rotuloConteudo = (c: MetadadosConteudo) => `${c.edicao.replace('DND_', '')} · ${c.natureza} · ${c.revisao} · ${c.licenca === 'pendente' ? 'licença pendente' : c.licenca}`;
