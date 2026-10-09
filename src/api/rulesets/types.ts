import { Raca } from "../classesPrincipais/Raca.class";
import { Classes } from "../classesPrincipais/Classes.class";
import { BackGround } from "../classesPrincipais/BackGrounds.class";

export type RulesetVersion = "DND_2014" | "DND_2024";

export type ReferenciaConteudo = { id: string; edicao: RulesetVersion; revisao: string };
export type MetadadosConteudo = ReferenciaConteudo & {
  fonte: { titulo: string; url?: string; localizador: string; consultadoEm: string };
  errata: string | null;
  natureza: 'oficial' | 'compativel' | 'homebrew' | 'nao-verificado';
  licenca: 'CC-BY-4.0' | 'pendente';
  categoria: string;
};
export type TalentoConteudo = MetadadosConteudo & {
  nome: string; descricao: string; repetivel: boolean; suportado: boolean;
  requisito: { tipo: string | null; requisito: string[] | null; valor: number | null };
  bonus: { tipo: string | null; condicao: string | null; bonus: string[] | null; valor: number | null }[];
  escolha?: 'atributo-agarrador' | 'treinamentos';
  iniciativa?: 'fixo5' | 'proficiencia';
  phb?: RegrasTalento2024;
};
export type RegrasTalento2024 = {
  requisitoTexto: string;
  atributosRequisito: string[];
  conjuracao?: 'conjuracao' | 'conjuracao-ou-pacto';
  treino?: string;
  estilo?: boolean;
  aumento?: { atributos: string[]; quantidade: number; limite: number };
  escolhas?: 'artifista' | 'musico' | 'elemento' | 'analitico' | 'mente' | 'pericia' | 'epica-pericia' | 'energia' | 'maestria' | 'iniciado' | 'ritualista' | 'sombras' | 'fadas';
  proficiencias?: string[];
  pvPorNivel?: number;
  pv?: number;
  deslocamento?: number;
  estiloEfeito?: 'estilo_defesa' | 'estilo_arquearia' | 'estilo_duelismo';
  recursos?: { id: string; nome: string; quantidade: number | 'proficiencia'; recuperacao: 'curto' | 'longo' | 'turno' | 'iniciativa' }[];
};
export type MagiaTalento = { conteudo: ReferenciaConteudo; snapshot: MagiaConteudo; atributo: string; gratuita: boolean; nivelAquisicao: number; observacao?: string };
export type BeneficiosTalento = { atributos: Record<string, number>; treinamentos: string[]; especializacoes: string[]; salvaguardas: string[]; resistencias: string[]; maestria?: string };
export type MagiaConteudo = MetadadosConteudo & {
  nome: string; nivel: number; tipo: string; listas: string[]; descricao: string;
  conjuracao: string; alcance: { tipo: string; distancia: number };
  componentes: { componentes: string[]; material: string | null };
  concentracao: boolean | null; duracao: string; ritual: boolean | null;
  cura?: { dadosBase: number; dadosPorCirculo: number; dado: number; exclui: string[] };
};

export type AtributoPersonagem = "forca" | "destreza" | "constituicao" | "inteligencia" | "sabedoria" | "carisma";

export type RulesetData = {
  version: RulesetVersion;
  racasOuEspecies: Raca[];
  classes: Classes[];
  backgroundsOuOrigens: BackGround[];
  talentos: TalentoConteudo[];
  armas: unknown[];
  armaduras: unknown[];
  itens: unknown[];
  magias: MagiaConteudo[];
  regras: {
    labelRacaOuEspecie: string;
    labelSubRacaOuOpcao: string;
    labelBackgroundOuOrigem: string;
    especieConcedeAtributos: boolean;
    backgroundConcedeAtributos: boolean;
    backgroundConcedeTalentoOrigem: boolean;
    backgroundPermiteEscolhaBonusAtributo: boolean;
    nivelPadraoSubclasse: number;
    usaTalentosRevisados: boolean;
    suportaWeaponMastery: boolean;
    idiomasObrigatorios: string[];
    quantidadeIdiomasLivres: number;
    idiomasDisponiveis: string[];
    especieConcedeIdiomas: boolean;
  };
};
