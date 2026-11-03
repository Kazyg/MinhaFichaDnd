import type { Ficha } from '../fichaPersonagem/FichaPersonagem';
import type { Classes } from '../classesPrincipais/Classes.class';
import { calcularValorAtributoFinal } from '../fichaPersonagem/fichaEfeitosUtils';

export const atributosChaves = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] as const;
export const normalizarChave = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function chaveClasse(classe: string | { nome: string; chave?: string }): string {
  if (typeof classe !== 'string' && classe.chave) return classe.chave;
  const nome = normalizarChave(typeof classe === 'string' ? classe : classe.nome);
  return ({ lutador: 'guerreiro', fighter: 'guerreiro', rogue: 'ladino', ranger: 'patrulheiro' } as Record<string, string>)[nome] ?? nome;
}


export function recursosNoNivel(classe: string | { nome: string; chave?: string }, nivel: number, edicao: string): string[] {
  const chave = chaveClasse(classe);
  if (!['barbaro', 'bardo', 'bruxo', 'clerigo', 'druida', 'feiticeiro', 'guerreiro', 'ladino', 'mago', 'monge', 'paladino', 'patrulheiro'].includes(chave)) return [];
  const asi = [4, 8, 12, 16, ...(edicao === 'DND_2014' ? [19] : []), ...(chave === 'guerreiro' ? [6, 14] : []), ...(chave === 'ladino' ? [10] : [])];
  return [...(asi.includes(nivel) ? ['asi'] : []), ...(edicao === 'DND_2024' && nivel === 19 ? ['epic-boon'] : [])];
}

export function nivelDaClasse(ficha: Ficha, classe: string | Classes, ate = ficha.levelTotal ?? 0): number {
  return new Set((ficha.multiclasses ?? []).filter(m => chaveClasse(m.classe) === chaveClasse(classe))
    .flatMap(m => m.nivelEscolhido).filter(n => n <= ate)).size;
}

type ClasseMulticlasse = string | { nome: string; chave?: string };
const nomesAtributos: Record<string, string> = { forca: 'Força', destreza: 'Destreza', inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma' };

export const requisitosMulticlasse: Record<string, string[][]> = {
  barbaro: [['forca']], bardo: [['carisma']], bruxo: [['carisma']],
  clerigo: [['sabedoria']], druida: [['sabedoria']], feiticeiro: [['carisma']],
  guerreiro: [['forca'], ['destreza']], ladino: [['destreza']], mago: [['inteligencia']],
  monge: [['destreza', 'sabedoria']], paladino: [['forca', 'carisma']], patrulheiro: [['destreza', 'sabedoria']],
};

function avaliarRequisito(classe: ClasseMulticlasse, valor: (atributo: string) => number) {
  const alternativas = (requisitosMulticlasse[chaveClasse(classe)] ?? []).map(grupo =>
    grupo.map(atributo => ({ atributo, minimo: 13, valor: valor(atributo), atendido: valor(atributo) >= 13 })));
  return {
    classe, alternativas,
    atendido: alternativas.some(grupo => grupo.every(r => r.atendido)),
    texto: alternativas.map(grupo => grupo.map(r => `${nomesAtributos[r.atributo]} ${r.minimo}`).join(' e ')).join(' ou ') || 'uma classe reconhecida',
  };
}

export function cumpreRequisitosClasse(classe: ClasseMulticlasse, valor: (atributo: string) => number): boolean {
  return avaliarRequisito(classe, valor).atendido;
}

export function avaliarMulticlasse(classesAtuais: ClasseMulticlasse[], desejada: ClasseMulticlasse,
  atributos: Record<string, number>, versaoRegras: string) {
  const dispensado = !classesAtuais.length || classesAtuais.some(c => chaveClasse(c) === chaveClasse(desejada));
  const classes = [...new Map([...classesAtuais, desejada].map(c => [chaveClasse(c), c])).values()];
  const requisitos = dispensado ? [] : classes.map(c => avaliarRequisito(c, a => atributos[a]));
  return { permitido: requisitos.every(r => r.atendido), requisitos, versaoRegras,
    atendidos: requisitos.filter(r => r.atendido), ausentes: requisitos.filter(r => !r.atendido) };
}

export function erroSelecaoClasse(ficha: Ficha, classe: Classes, nivel: number): string | null {
  if (!Number.isInteger(nivel) || nivel < 1 || nivel > 20) return 'Nível inválido.';
  if (nivel === 1) return null;
  const anteriores = (ficha.multiclasses ?? []).filter(m => m.nivelEscolhido.some(n => n < nivel)).map(m => m.classe);
  if (!anteriores.length && ficha.classePrincipal) anteriores.push(ficha.classePrincipal);
  if (!anteriores.length) return 'Selecione primeiro a classe do nível 1.';


  if (anteriores.some(c => chaveClasse(c) === chaveClasse(classe))) return null;
  const antes = { ...ficha, levelTotal: Math.min(nivel - 1, ficha.levelTotal ?? 0) } as Ficha;
  const atributos = Object.fromEntries(atributosChaves.map(a => [a, calcularValorAtributoFinal(antes, a)]));
  const resultado = avaliarMulticlasse(anteriores, classe, atributos, ficha.versaoRegras);
  if (resultado.permitido) return null;

  if (ficha.versaoRegras !== 'DND_2024') {
    const valores = atributosChaves.map(a => `${a}: ${atributos[a]}`).join(', ');
    return `Requisitos de multiclasse: ${resultado.ausentes.map(r => `${typeof r.classe === 'string' ? r.classe : r.classe.nome} exige ${r.texto}`).join('; ')}. Atributos antes do nível ${nivel}: ${valores}. Conclua a distribuição de atributos se ainda não foi aplicada.`;
  }
  return `Requisitos de multiclasse: ${resultado.ausentes.map(r => {
    const nome = typeof r.classe === 'string' ? r.classe : r.classe.nome;
    return `${nome} requer ${r.texto}${anteriores.some(c => chaveClasse(c) === chaveClasse(r.classe)) ? ' (classe atual; também precisa cumprir seus requisitos para adquirir uma nova classe)' : ''}`;
  }).join('; ')}.`;
}

export function podeSelecionarClasse(ficha: Ficha, classe: Classes, nivel: number): boolean {
  return erroSelecaoClasse(ficha, classe, nivel) === null;
}

export const niveisMetamagia = (edicao: string) => edicao === 'DND_2024' ? [2, 2, 10, 10, 17, 17] : [3, 3, 10, 17];

export function erroDistribuicao(ficha: Ficha): string | null {
  const d = ficha.distribuicaoAtributos;
  if (!d?.metodo) return 'Escolha um método de distribuição.';
  const valores = atributosChaves.map(a => d.atributos[a]);
  if (valores.some(v => !Number.isInteger(v) || v < 3 || v > 18)) return 'Distribua os seis atributos antes de concluir.';
  if (d.metodo === 'Point Buy') {
    const custos: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
    const gasto = valores.reduce((s, v) => s + (custos[v] ?? Infinity), 0);
    if (gasto !== 27 || d.pontos !== 0) return 'Distribua os 27 pontos, com valores entre 8 e 15.';
  } else if (d.metodo === 'Array Padrão' || d.metodo === 'Rolagem de Dados') {
    if (d.valores.length) return 'Distribua todos os valores disponíveis.';
    if (d.metodo === 'Array Padrão' && valores.slice().sort((a, b) => a - b).join() !== '8,10,12,13,14,15') return 'Use cada valor do array padrão uma vez.';
    if (d.metodo === 'Rolagem de Dados' && d.gerados && valores.slice().sort((a, b) => a - b).join() !== d.gerados.slice().sort((a, b) => a - b).join()) return 'Use cada resultado da rolagem uma vez.';
  } else return 'Método de distribuição desconhecido.';
  if (ficha.versaoRegras === 'DND_2024') {
    const origem = ficha.backGround as unknown as { atributos?: { atributo: string[] } };
    const opcoes = origem?.atributos?.atributo?.map(normalizarChave) ?? [];
    if (new Set(opcoes).size !== 3 || opcoes.some(a => !atributosChaves.includes(a as typeof atributosChaves[number]))) return 'Escolha uma origem com três atributos válidos.';
    if (d.modo !== 'todos' && (d.modo !== 'dois' || !opcoes.includes(normalizarChave(d.maior)) || !opcoes.includes(normalizarChave(d.menor)) || normalizarChave(d.maior) === normalizarChave(d.menor))) return 'Escolha dois atributos distintos da origem.';
  }
  return null;
}
