
export const VERSAO_SCHEMA_MESTRE = 1 as const;
export type CategoriaFicha = 'jogador' | 'monstro';
export type FormatoFicha = 'json' | 'imagem' | 'pdf';
export interface PontosVida { atuais: number; maximos: number }
export type AvisoImportacao = 'nome-ausente' | 'pv-nao-identificados' | 'pv-atuais-nao-identificados' | 'extracao-manual';

export interface RoteiroCampanha {
  id: string;
  titulo: string;
  conteudo: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Campanha {
  id: string;

  revisao?: number;
  schemaVersion: typeof VERSAO_SCHEMA_MESTRE;
  nome: string;
  roteiro: string;
  roteiros?: RoteiroCampanha[];
  criadoEm: string;
  atualizadoEm: string;
}


export interface AnexoCampanha {
  id: string;
  campanhaId: string;
  nome: string;
  mime: string;
  tamanho: number;
  arquivo: Blob;
}

export interface FichaOriginal {
  id: string;
  campanhaId: string;
  categoria: CategoriaFicha;
  formato: FormatoFicha;
  anexoId: string;

  pdfAnexoId?: string;
  imagemAnexoId?: string;
  nome: string;
  pvIniciais: PontosVida;
  origemPV: 'json' | 'manual-pendente';
  origemJson?: { id: string; versaoRegras: 'DND_2014' | 'DND_2024'; envelope: boolean };
  avisos: AvisoImportacao[];
  importadoEm: string;
}


export interface InstanciaFicha {
  id: string;
  campanhaId: string;
  fichaOriginalId: string | null;
  categoria: CategoriaFicha;
  nome: string;
  pv: PontosVida;
}

export interface ParticipanteCombate {
  id: string;
  combateId: string;
  instanciaId: string;
  iniciativa: number;
  ordem: number;
  pvInicio: PontosVida;
}


export interface CondicaoCombate {
  id: string;
  campanhaId: string;
  combateId: string;
  participanteId: string;
  tipo: string;
  nomePersonalizado?: string;
  nivel?: number;
  duracao: 'turnos' | 'manual';
  restantes: number | null;
  momento: 'inicio' | 'final';
  ignorarOcorrencia: number | null;
  observacao?: string;
}

export interface Combate {
  id: string;
  nome?: string;
  campanhaId: string;
  estado: 'preparado' | 'ativo' | 'encerrado';
  rodada: number;
  participanteAtivoId: string | null;

  iniciadoEm: string;
  encerradoEm: string | null;
  condicoes?: CondicaoCombate[];
  execucao?: {
    ocorrenciaTurno?: number;
    versao: 1;
    origemSnapshot?: 'ativacao' | 'legado';
    ativadoEm: string;

    visitados: string[];
    pvAtivacao: { participanteId: string; instanciaId: string; pv: PontosVida }[];
  };
  historico?: {
    versao: 1;
    decisaoPV: 'manter' | 'restaurar';
    condicoes?: CondicaoCombate[];
    iniciadoEm: string;
    participantes: {
      participanteId: string; instanciaId: string; fichaOriginalId: string | null;
      nome: string; categoria: CategoriaFicha; iniciativa: number; ordem: number;
      pvInicial: PontosVida | null; pvFinal: PontosVida;
    }[];
  };
}

export interface PainelLayout {
  id: string;
  tipo: 'monstros' | 'jogadores' | 'roteiro' | 'pv';
  x: number; y: number; largura: number; altura: number;
  recolhido: boolean;
  fechado: boolean;
}
export interface LayoutCampanha {
  campanhaId: string;
  versao: 1;
  sidebarRecolhida: boolean;
  larguraSidebar?: number;
  larguraPV?: number;
  paineis: PainelLayout[];
}


export interface DadosCampanha {
  campanha: Campanha;
  anexos: AnexoCampanha[];
  fichas: FichaOriginal[];
  instancias: InstanciaFicha[];
  combates: Combate[];
  participantes: ParticipanteCombate[];
  layout: LayoutCampanha;
}
