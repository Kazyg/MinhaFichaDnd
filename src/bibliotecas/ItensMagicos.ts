import registros from './equipamentosMagicosCatalogo.json';

export type EquipamentoMagico = {
  tipo: 'arma' | 'armadura' | 'escudo';
  modo: 'melhoria' | 'especifico';
  baseNome?: string;
  bonusAtaque?: number;
  bonusDano?: number;
  bonusCA?: number;
  exigeSintonizacao: boolean;
  requisitoSintonizacao?: string;
  propriedadesEspeciais?: string[];
  edicao?: 'DND_2014' | 'DND_2024';
  catalogoId?: string;
  basesCompativeis?: string[];
  bonusMagia?: { classeNome: string; ataque?: number; cd?: number }[];
  usarDescricaoCatalogo?: boolean;
  danoTipo?: string;
  danoBase?: { dano_1: string; dano_2: string };
  atributosArma?: string[];
  propriedadesArma?: string[];
  proficienciasAlternativas?: string[];
  destrezaSemLimite?: boolean;
  furtividade?: string;
  forcaRequerida?: number;
  treinoArmadura?: boolean;
  treinoArma?: boolean;
  atributosFixos?: { atributo: string; valor: number }[];
};

export type VinculoEquipamento = { tipo: 'arma' | 'armadura'; id: string };


export function metadadosMagicosCatalogo(nome: string): EquipamentoMagico | undefined {
  const chave = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const generico = chave.match(/^(?:\+([123]) (weapon|arma|armor|armadura|shield|escudo)|(weapon|arma|armor|armadura|shield|escudo),? \+([123]))(?: \(\*\))?$/);
  if (generico) {
    const bonus = Number(generico[1] ?? generico[4]);
    const tipo = generico[2] ?? generico[3];
    if (['weapon', 'arma'].includes(tipo)) return { tipo: 'arma', modo: 'melhoria', bonusAtaque: bonus, bonusDano: bonus, exigeSintonizacao: false };
    return { tipo: ['shield', 'escudo'].includes(tipo) ? 'escudo' : 'armadura', modo: 'melhoria', bonusCA: bonus, exigeSintonizacao: false };
  }
  const registro = registros.find(r => [r.nomeIngles, r.nomeLocal].some(nome => nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === chave));
  return registro ? JSON.parse(JSON.stringify(registro.metadados)) : undefined;
}

export function metadadosDoRegistroCatalogo(indice: number, nomeIngles: string): EquipamentoMagico | undefined {
  const registro = registros.find(r => r.indice === indice && r.nomeIngles === nomeIngles);
  return registro ? JSON.parse(JSON.stringify(registro.metadados)) : undefined;
}
