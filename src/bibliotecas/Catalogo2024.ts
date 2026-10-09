import catalogo from "./catalogos2024.json";
import { armas } from "../api/equipamentos/Armas.ts";

export const Magias2024 = catalogo.magias;
export const Talentos2024 = catalogo.talentos;
export type Talento2024 = (typeof Talentos2024)[number];
export type EscolhasTalento = Record<string, string[]>;
export const nomeExibicao = (nome: string) => nome.replace(/^2024: /, "");
export const normalizarRegra = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const atributos2024 = [
  "forca",
  "destreza",
  "constituicao",
  "inteligencia",
  "sabedoria",
  "carisma",
];
export const pericias2024 = [
  "Acrobacia",
  "Adestrar Animais",
  "Arcanismo",
  "Atletismo",
  "Atuação",
  "Enganação",
  "Furtividade",
  "História",
  "Intimidação",
  "Intuição",
  "Investigação",
  "Medicina",
  "Natureza",
  "Percepção",
  "Persuasão",
  "Prestidigitação",
  "Religião",
  "Sobrevivência",
];
export const ferramentasArtesao = [
  "Ferramentas de Carpinteiro",
  "Ferramentas de Coureiro",
  "Ferramentas de Entalhador",
  "Ferramentas de Ferreiro",
  "Ferramentas de Funileiro",
  "Ferramentas de Oleiro",
  "Ferramentas de Pedreiro",
  "Ferramentas de Tecelão",
];
export const instrumentos2024 = [
  "Alaúde",
  "Flauta",
  "Flauta de Pã",
  "Gaita de Foles",
  "Lira",
  "Oboé",
  "Tambor",
  "Trombeta",
  "Violino",
  "Dulcímero",
];
export const ferramentas2024 = [
  ...ferramentasArtesao,
  "Ferramentas de Alquimista",
  "Ferramentas de Calígrafo",
  "Ferramentas de Cartógrafo",
  "Ferramentas de Joalheiro",
  "Ferramentas de Pintor",
  "Ferramentas de Sapateiro",
  "Ferramentas de Vidraceiro",
  "Utensílios de Cozinheiro",
  "Utensílios de Cervejeiro",
  "Ferramentas de Ladrão",
  "Kit de Disfarce",
  "Kit de Falsificação",
  "Kit de Herbalismo",
  "Kit de Veneno",
  "Ferramentas de Navegador",
  "Dados",
  "Baralho",
  "Xadrez de Dragão",
  "Três Dragões",
  ...instrumentos2024,
];

export type CampoEscolha = {
  chave: string;
  rotulo: string;
  quantidade: number;
  opcoes: string[];
};
export function camposTalento(
  talento: Talento2024,
  escolhas: EscolhasTalento,
  proficiencia = 2,
): CampoEscolha[] {
  const campos: CampoEscolha[] = [];
  const add = (
    chave: string,
    rotulo: string,
    quantidade: number,
    opcoes: string[],
  ) => campos.push({ chave, rotulo, quantidade, opcoes });
  const aumento = talento.descricao.match(
    /Aumento no Valor de Atributo\.([\s\S]*?)(?:até no máximo|até o máximo)/,
  );
  if (aumento || talento.nomeExibicao === "Aumento no Valor de Atributo") {
    const trecho = normalizarRegra(aumento?.[1] || "um valor de atributo");
    let atributos = atributos2024.filter((a) => trecho.includes(a));
    if (!atributos.length) atributos = atributos2024;
    add("atributo", "Atributo aumentado", 1, atributos);
    if (talento.nomeExibicao === "Aumento no Valor de Atributo")
      add(
        "atributo2",
        "Segundo ponto de atributo (pode repetir)",
        1,
        atributos,
      );
  }
  const nome = talento.nomeExibicao;
  if (nome === "Adepto Elemental")
    add("elemento", "Domínio Elemental", 1, [
      "Ácido",
      "Elétrico",
      "Gélido",
      "Ígneo",
      "Trovejante",
    ]);
  if (nome === "Mestre das Armas")
    add(
      "maestria",
      "Arma para Maestria",
      1,
      armas.map((a) => a.nome),
    );
  if (nome === "Dádiva da Resistência à Energia")
    add("resistencia", "Resistências à Energia", 2, [
      "Ácido",
      "Elétrico",
      "Gélido",
      "Ígneo",
      "Necrótico",
      "Psíquico",
      "Radiante",
      "Trovejante",
      "Venenoso",
    ]);
  if (nome === "Habilidoso")
    add("proficiencias", "Perícias ou ferramentas", 3, [
      ...pericias2024,
      ...ferramentas2024,
    ]);
  if (nome === "Artifista")
    add("proficiencias", "Ferramentas de Artesão", 3, ferramentasArtesao);
  if (nome === "Músico")
    add("proficiencias", "Instrumentos Musicais", 3, instrumentos2024);
  if (nome === "Analítico")
    add("pericia", "Proficiência ou Especialização", 1, [
      "Intuição",
      "Investigação",
      "Percepção",
    ]);
  if (nome === "Mente Aguçada")
    add("pericia", "Proficiência ou Especialização", 1, [
      "Arcanismo",
      "História",
      "Investigação",
      "Natureza",
      "Religião",
    ]);
  if (nome === "Especialista em Perícia")
    add("pericia", "Nova proficiência em perícia", 1, pericias2024);
  if (
    ["Especialista em Perícia", "Dádiva da Proficiência em Perícia"].includes(
      nome,
    )
  )
    add(
      "especializacao",
      "Especialização em uma perícia proficiente",
      1,
      pericias2024,
    );
  if (nome === "Iniciado em Magia") {
    add("lista", "Lista de magias", 1, ["Clérigo", "Druida", "Mago"]);
    add("conjuracao", "Atributo de conjuração", 1, [
      "inteligencia",
      "sabedoria",
      "carisma",
    ]);
    const lista = escolhas.lista?.[0];
    add(
      "truques",
      "Dois truques",
      2,
      Magias2024.filter((m) => m.nivel === 0 && m.classes.includes(lista)).map(
        (m) => m.nome,
      ),
    );
    add(
      "magias",
      "Magia de 1º círculo",
      1,
      Magias2024.filter((m) => m.nivel === 1 && m.classes.includes(lista)).map(
        (m) => m.nome,
      ),
    );
  }
  if (nome === "Conjurador Ritualista")
    add(
      "magias",
      "Magias rituais de 1º círculo",
      proficiencia,
      Magias2024.filter((m) => m.nivel === 1 && m.ritual).map((m) => m.nome),
    );
  if (["Tocado Pelas Sombras", "Tocado Por Fadas"].includes(nome)) {
    const escolas =
      nome === "Tocado Pelas Sombras"
        ? ["ilusão", "necromancia"]
        : ["adivinhação", "encantamento"];
    add(
      "magias",
      "Magia adicional de 1º círculo",
      1,
      Magias2024.filter((m) => m.nivel === 1 && escolas.includes(m.tipo)).map(
        (m) => m.nome,
      ),
    );
  }
  return campos;
}
