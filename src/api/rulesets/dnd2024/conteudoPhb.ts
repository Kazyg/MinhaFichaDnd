import dados from './phb2024.json';
import type { MagiaConteudo, TalentoConteudo, RegrasTalento2024, MetadadosConteudo } from '../types';

export const atributosPhb = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];
const chave = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
const atributosNoTexto = (s: string) => atributosPhb.filter(a => chave(s).includes(a));
const metadados = (nome: string, categoria: string, pagina: number): MetadadosConteudo => ({
  id: `DND_2024:${categoria === 'magia' ? 'magia' : 'talento'}:${chave(nome)}`, edicao: 'DND_2024',
  revisao: 'phb2024-ha6-20250813-1', categoria, natureza: 'nao-verificado', licenca: 'pendente', errata: null,
  fonte: { titulo: 'Livro do Jogador 2024 — tradução comunitária Heróis Anônimos, 6ª edição (13/08/2025)', localizador: `p. ${pagina}; PDF p. ${pagina + 6}; ${nome}`, consultadoEm: '2026-10-08' },
});
const escolhas: Record<string, RegrasTalento2024['escolhas']> = {
  Artifista: 'artifista', Músico: 'musico', 'Adepto Elemental': 'elemento', Analítico: 'analitico', 'Mente Aguçada': 'mente',
  'Especialista em Perícia': 'pericia', 'Dádiva da Proficiência em Perícia': 'epica-pericia', 'Dádiva da Resistência à Energia': 'energia',
  'Mestre das Armas': 'maestria', 'Iniciado em Magia': 'iniciado', 'Conjurador Ritualista': 'ritualista', 'Tocado pela Sombra': 'sombras', 'Tocado pelas Fadas': 'fadas',
};
const treinos: Record<string, string[]> = {
  Chef: ['Utensílios de Cozinheiro'], Envenenador: ['Kit de Veneno'], 'Valentão de Taverna': ['Armas improvisadas'],
  'Especialista em Armaduras Leves': ['Armaduras leves', 'Escudos'], 'Especialista em Armaduras Médias': ['Armaduras médias'],
  'Especialista em Armaduras Pesadas': ['Armaduras pesadas'], 'Treinamento com Armas Marciais': ['Armas marciais'],
};
const recursos: Record<string, RegrasTalento2024['recursos']> = {
  Sortudo: [{ id: 'sorte', nome: 'Pontos de Sorte', quantidade: 'proficiencia', recuperacao: 'longo' }],
  'Exterminador de Conjuradores': [{ id: 'resguardo', nome: 'Resguardo Mental', quantidade: 1, recuperacao: 'curto' }],
  'Conjurador Ritualista': [{ id: 'ritual-rapido', nome: 'Ritual Rápido', quantidade: 1, recuperacao: 'longo' }],
  'Dádiva da Recuperação': [{ id: 'ate-morte', nome: 'Até a Morte', quantidade: 1, recuperacao: 'longo' }, { id: 'vitalidade', nome: 'Dados d10 de Recuperar Vitalidade', quantidade: 10, recuperacao: 'longo' }],
  'Dádiva do Destino': [{ id: 'destino', nome: 'Aprimorar Destino', quantidade: 1, recuperacao: 'iniciativa' }],
  'Dádiva da Proeza em Combate': [{ id: 'pontaria', nome: 'Pontaria Inigualável', quantidade: 1, recuperacao: 'turno' }],
};
export const magiasPhb2024: MagiaConteudo[] = dados.magias.map(m => ({ ...m, ...metadados(m.nome, 'magia', m.pagina) }));
export const talentosPhb2024: TalentoConteudo[] = dados.talentos.map(t => {
  const categoria = ({ Origem: 'Origin', Geral: 'General', 'Estilo de Luta': 'Fighting Style', 'Dádiva Épica': 'Epic Boon' } as Record<string, string>)[t.categoria];
  const atributoTexto = t.descricao.match(/Aumento no Valor de Atributo\. ([\s\S]+?)(?:máximo (?:20|30)\.|acima de 20\.)/)?.[1];
  const temAumento = categoria === 'General' || categoria === 'Epic Boon';
  const aumento = temAumento ? { atributos: atributoTexto && atributosNoTexto(atributoTexto).length ? atributosNoTexto(atributoTexto) : [...atributosPhb], quantidade: t.nome === 'Aumento no Valor de Atributo' ? 2 : 1, limite: categoria === 'Epic Boon' ? 30 : 20 } : undefined;
  const requisito = chave(t.requisitoTexto);
  const treino = requisito.includes('armadura-leve') ? 'Armaduras leves' : requisito.includes('armadura-media') ? 'Armaduras médias' : requisito.includes('armadura-pesada') ? 'Armaduras pesadas' : requisito.includes('escudo') ? 'Escudos' : undefined;
  const phb: RegrasTalento2024 = { requisitoTexto: t.requisitoTexto, atributosRequisito: atributosNoTexto(t.requisitoTexto),
    conjuracao: requisito.includes('conjuracao') ? requisito.includes('pacto') ? 'conjuracao-ou-pacto' : 'conjuracao' : undefined,
    treino, estilo: categoria === 'Fighting Style', aumento, escolhas: escolhas[t.nome], proficiencias: treinos[t.nome], recursos: recursos[t.nome],
    pvPorNivel: t.nome === 'Vigoroso' ? 2 : undefined, pv: t.nome === 'Dádiva da Fortitude' ? 40 : undefined,
    // Velocidades do documento são em pés; os textos do livro usam metros.
    deslocamento: t.nome === 'Velocista' ? 10 : t.nome === 'Dádiva da Velocidade' ? 30 : undefined,
    estiloEfeito: t.nome === 'Defensivo' ? 'estilo_defesa' : t.nome === 'Arquearia' ? 'estilo_arquearia' : t.nome === 'Duelismo' ? 'estilo_duelismo' : undefined };
  return { ...metadados(t.nome, categoria, t.pagina), nome: t.nome, descricao: t.descricao,
    repetivel: t.repetivel, suportado: true, requisito: { tipo: null, requisito: null, valor: null }, bonus: [], phb };
});
