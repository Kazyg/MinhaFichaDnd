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

// Semantic resources are independent of translated feature labels and saved tables.
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

export function cumpreRequisitosClasse(classe: string | Classes, valor: (atributo: string) => number): boolean {
  const tem = (a: string) => valor(a) >= 13;
  switch (chaveClasse(classe)) {
    case 'barbaro': return tem('forca');
    case 'bardo': case 'bruxo': case 'feiticeiro': return tem('carisma');
    case 'clerigo': case 'druida': return tem('sabedoria');
    case 'guerreiro': return tem('forca') || tem('destreza');
    case 'ladino': return tem('destreza');
    case 'mago': return tem('inteligencia');
    case 'monge': case 'patrulheiro': return tem('destreza') && tem('sabedoria');
    case 'paladino': return tem('forca') && tem('carisma');
    default: return false;
  }
}

export function erroSelecaoClasse(ficha: Ficha, classe: Classes, nivel: number): string | null {
  if (!Number.isInteger(nivel) || nivel < 1 || nivel > 20) return 'Nível inválido.';
  if (nivel === 1) return null;
  const anteriores = (ficha.multiclasses ?? []).filter(m => m.nivelEscolhido.some(n => n < nivel)).map(m => m.classe);
  if (!anteriores.length && ficha.classePrincipal) anteriores.push(ficha.classePrincipal);
  if (!anteriores.length) return 'Selecione primeiro a classe do nível 1.';
  // Advancing an already acquired class is not entering a new multiclass.
  // Recheck prerequisites only when acquiring the first level of a new class.
  if (anteriores.some(c => chaveClasse(c) === chaveClasse(classe))) return null;
  const antes = { ...ficha, levelTotal: Math.min(nivel - 1, ficha.levelTotal ?? 0) } as Ficha;
  const requisitos: Record<string, string> = {
    barbaro: 'Força 13', bardo: 'Carisma 13', bruxo: 'Carisma 13', feiticeiro: 'Carisma 13',
    clerigo: 'Sabedoria 13', druida: 'Sabedoria 13', guerreiro: 'Força 13 ou Destreza 13',
    ladino: 'Destreza 13', mago: 'Inteligência 13', monge: 'Destreza 13 e Sabedoria 13',
    patrulheiro: 'Destreza 13 e Sabedoria 13', paladino: 'Força 13 e Carisma 13',
  };
  const invalidas = [...anteriores, classe].filter(c => !cumpreRequisitosClasse(c, a => calcularValorAtributoFinal(antes, a)));
  if (!invalidas.length) return null;
  const valores = atributosChaves.map(a => `${a}: ${calcularValorAtributoFinal(antes, a)}`).join(', ');
  return `Requisitos de multiclasse: ${invalidas.map(c => `${c.nome} exige ${requisitos[chaveClasse(c)] ?? 'uma classe reconhecida'}`).join('; ')}. Atributos antes do nível ${nivel}: ${valores}. Conclua a distribuição de atributos se ainda não foi aplicada.`;
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
