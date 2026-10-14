import { EquipamentoInicial } from '../classesPrincipais/concessoesEquipamento';

const catalogos: Record<string, Record<string, EquipamentoInicial>> = {
  DND_2014: {
    "acolito": {
      itens: [{"nome": "símbolo sagrado", "quantidade": 1}, {"nome": "livro de preces", "quantidade": 1}, {"nome": "varetas de incenso", "quantidade": 5}, {"nome": "vestimentas", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}],
      moedas: {"ouro": 15, "prata": 0, "cobre": 0},
    },
    "artesão da guilda": {
      itens: [{"nome": "conjunto de ferramentas de artesão", "quantidade": 1}, {"nome": "carta de apresentação da sua guilda", "quantidade": 1}, {"nome": "conjunto de roupas de viajante", "quantidade": 1}],
      moedas: {"ouro": 15, "prata": 0, "cobre": 0},
    },
    "artista": {
      itens: [{"nome": "instrumento musical", "quantidade": 1}, {"nome": "presente de um admirador", "quantidade": 1}, {"nome": "traje", "quantidade": 1}],
      moedas: {"ouro": 15, "prata": 0, "cobre": 0},
    },
    "cavaleiro": {
      itens: [{"nome": "sela (montaria)", "quantidade": 1}, {"nome": "cavalo de montaria", "quantidade": 1}, {"nome": "roupas de viajante", "quantidade": 1}],
      moedas: {"ouro": 0, "prata": 0, "cobre": 0},
    },
    "Charlatao": {
      itens: [{"nome": "conjunto de roupas finas", "quantidade": 1}, {"nome": "m kit de disfarce", "quantidade": 1}, {"nome": "ferramentas de trapaça", "quantidade": 1}],
      moedas: {"ouro": 15, "prata": 0, "cobre": 0},
    },
    "criminal": {
      itens: [{"nome": "pé de cabra", "quantidade": 1}, {"nome": "conjunto de roupas escuras comuns com capuz", "quantidade": 1}],
      moedas: {"ouro": 15, "prata": 0, "cobre": 0},
    },
    "eremita": {
      itens: [{"nome": "estojo de pergaminho cheio de notas dos seus estudos e orações", "quantidade": 1}, {"nome": "cobertor de inverno", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}, {"nome": "kit de herbalismo", "quantidade": 1}],
      moedas: {"ouro": 5, "prata": 0, "cobre": 0},
    },
    "Forasteiro": {
      itens: [{"nome": "bordão", "quantidade": 1}, {"nome": "armadilha de caça", "quantidade": 1}, {"nome": "fetiche de um animal que você matou", "quantidade": 1}, {"nome": "conjunto de roupas de viajante", "quantidade": 1}],
      moedas: {"ouro": 10, "prata": 0, "cobre": 0},
    },
    "Heroi Injustiçado": {
      itens: [{"nome": "diário dos seus dias de glória no passado", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}],
      moedas: {"ouro": 20, "prata": 0, "cobre": 0},
    },
    "Membro da Guilda dos Ladrões das Sombras": {
      itens: [{"nome": "Adaga", "quantidade": 2}, {"nome": "Kit de Disfarce", "quantidade": 1}, {"nome": "Ferramentas de Ladrão", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}, {"nome": "conjunto de roupas de viajante", "quantidade": 1}, {"nome": "roupas finas", "quantidade": 1}, {"nome": "folhas de papel (5 a 9)", "quantidade": 1}, {"nome": "pena", "quantidade": 1}, {"nome": "frascos de tinta preta, vermelha e invisível", "quantidade": 1}, {"nome": "capa preta com o símbolo dos Ladrões das Sombras em cinza", "quantidade": 1}],
      moedas: {"ouro": 20, "prata": 0, "cobre": 0},
    },
    "marinheiro": {
      itens: [{"nome": "malagueta (clava)", "quantidade": 1}, {"nome": "15 metros de corda de seda", "quantidade": 1}, {"nome": "amuleto da sorte", "quantidade": 1}, {"nome": "conjunto de trajes comuns", "quantidade": 1}],
      moedas: {"ouro": 10, "prata": 0, "cobre": 0},
    },
    "nobre": {
      itens: [{"nome": "conjunto de trajes finos", "quantidade": 1}, {"nome": "anel de sinete", "quantidade": 1}, {"nome": "pergaminho de linhagem", "quantidade": 1}],
      moedas: {"ouro": 25, "prata": 0, "cobre": 0},
    },
    "Orfão": {
      itens: [{"nome": "faca pequena", "quantidade": 1}, {"nome": "mapa da cidade", "quantidade": 1}, {"nome": "rato de estimação", "quantidade": 1}, {"nome": "pequeno objeto para lembrar dos seus pais", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}],
      moedas: {"ouro": 10, "prata": 0, "cobre": 0},
    },
    "Pirata Bêbado": {
      itens: [{"nome": "garrafas de cerveja", "quantidade": 2}, {"nome": "sacola contendo 6 garrafas vazias de cerveja", "quantidade": 1}, {"nome": "Trajes de pirata", "quantidade": 1}, {"nome": "carteira vazia", "quantidade": 1}, {"nome": "cutelo que exala cheiro de álcool", "quantidade": 1}],
      moedas: {"ouro": 0, "prata": 0, "cobre": 0},
    },
    "sabio": {
      itens: [{"nome": "vidro de tinta escura", "quantidade": 1}, {"nome": "pena", "quantidade": 1}, {"nome": "faca pequena", "quantidade": 1}, {"nome": "carta de um falecido colega perguntando a você algo que você nunca terá a chance de responder", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}],
      moedas: {"ouro": 10, "prata": 0, "cobre": 0},
    },
    "soldado": {
      itens: [{"nome": "insígnia de patente", "quantidade": 1}, {"nome": "fetiche obtido de um inimigo caído", "quantidade": 1}, {"nome": "conjunto de dados de osso ou baralho", "quantidade": 1}, {"nome": "conjunto de roupas comuns", "quantidade": 1}],
      moedas: {"ouro": 10, "prata": 0, "cobre": 0},
    },
  },
  DND_2024: {
    "Acólito": {
      itens: [{"nome": "Suprimentos de Calígrafo", "quantidade": 1}, {"nome": "Livro (orações)", "quantidade": 1}, {"nome": "Símbolo Sagrado", "quantidade": 1}, {"nome": "Pergaminho", "quantidade": 10}, {"nome": "Túnica", "quantidade": 1}],
      moedas: {"ouro": 8, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Andarilho": {
      itens: [{"nome": "Adaga", "quantidade": 2}, {"nome": "Ferramentas de Ladrão", "quantidade": 1}, {"nome": "Kit de Jogos (qualquer um)", "quantidade": 1}, {"nome": "Algibeiras", "quantidade": 2}, {"nome": "Roupas de Viagem", "quantidade": 1}, {"nome": "Saco de Dormir", "quantidade": 1}],
      moedas: {"ouro": 16, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Artesão": {
      itens: [{"nome": "Ferramentas de Artesão", "quantidade": 1}, {"nome": "Algibeiras", "quantidade": 2}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 32, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Artista": {
      itens: [{"nome": "Instrumento Musical", "quantidade": 1}, {"nome": "Espelho", "quantidade": 1}, {"nome": "Fantasias", "quantidade": 2}, {"nome": "Perfume", "quantidade": 1}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 11, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Charlatão": {
      itens: [{"nome": "Kit de Falsificação", "quantidade": 1}, {"nome": "Fantasia", "quantidade": 1}, {"nome": "Roupas Finas", "quantidade": 1}],
      moedas: {"ouro": 15, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Criminoso": {
      itens: [{"nome": "Adaga", "quantidade": 2}, {"nome": "Ferramentas de Ladrão", "quantidade": 1}, {"nome": "Algibeiras", "quantidade": 2}, {"nome": "Pé de Cabra", "quantidade": 1}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 16, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Eremita": {
      itens: [{"nome": "Cajado", "quantidade": 1}, {"nome": "Kit de Herbalismo", "quantidade": 1}, {"nome": "Lâmpada", "quantidade": 1}, {"nome": "Livro (filosofia)", "quantidade": 1}, {"nome": "Óleo", "quantidade": 3}, {"nome": "Roupas de Viagem", "quantidade": 1}, {"nome": "Saco de Dormir", "quantidade": 1}],
      moedas: {"ouro": 16, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Escriba": {
      itens: [{"nome": "Suprimentos de Calígrafo", "quantidade": 1}, {"nome": "Lâmpada", "quantidade": 1}, {"nome": "Óleo", "quantidade": 3}, {"nome": "Pergaminho", "quantidade": 12}, {"nome": "Roupas Finas", "quantidade": 1}],
      moedas: {"ouro": 23, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Fazendeiro": {
      itens: [{"nome": "Foice", "quantidade": 1}, {"nome": "Ferramentas de Carpinteiro", "quantidade": 1}, {"nome": "Kit de Curandeiro", "quantidade": 1}, {"nome": "Balde de Ferro", "quantidade": 1}, {"nome": "Pá", "quantidade": 1}],
      moedas: {"ouro": 30, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Guarda": {
      itens: [{"nome": "Lança", "quantidade": 1}, {"nome": "Besta Leve", "quantidade": 1}, {"nome": "Virotes", "quantidade": 20}, {"nome": "Kit de Jogos", "quantidade": 1}, {"nome": "Aljava", "quantidade": 1}, {"nome": "Grilhões", "quantidade": 1}, {"nome": "Lanterna Coberta", "quantidade": 1}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 12, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Guia": {
      itens: [{"nome": "Arco Curto", "quantidade": 1}, {"nome": "Flechas", "quantidade": 20}, {"nome": "Ferramentas de Cartógrafo", "quantidade": 1}, {"nome": "Aljava", "quantidade": 1}, {"nome": "Roupas de Viagem", "quantidade": 1}, {"nome": "Saco de Dormir", "quantidade": 1}, {"nome": "Tenda", "quantidade": 1}],
      moedas: {"ouro": 3, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Marinheiro": {
      itens: [{"nome": "Adaga", "quantidade": 1}, {"nome": "Ferramentas de Navegador", "quantidade": 1}, {"nome": "Corda", "quantidade": 1}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 20, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Mercador": {
      itens: [{"nome": "Ferramentas de Navegador", "quantidade": 1}, {"nome": "Algibeiras", "quantidade": 2}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 22, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Nobre": {
      itens: [{"nome": "Kit de Jogos", "quantidade": 1}, {"nome": "Perfume", "quantidade": 1}, {"nome": "Roupas Finas", "quantidade": 1}],
      moedas: {"ouro": 29, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Sábio": {
      itens: [{"nome": "Cajado", "quantidade": 1}, {"nome": "Suprimentos de Calígrafo", "quantidade": 1}, {"nome": "Livro (história)", "quantidade": 1}, {"nome": "Pergaminho", "quantidade": 8}, {"nome": "Túnica", "quantidade": 1}],
      moedas: {"ouro": 8, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
    "Soldado": {
      itens: [{"nome": "Lança", "quantidade": 1}, {"nome": "Arco Curto", "quantidade": 1}, {"nome": "Flechas", "quantidade": 20}, {"nome": "Kit de Curandeiro", "quantidade": 1}, {"nome": "Kit de Jogos", "quantidade": 1}, {"nome": "Aljava", "quantidade": 1}, {"nome": "Roupas de Viagem", "quantidade": 1}],
      moedas: {"ouro": 14, "prata": 0, "cobre": 0},
      alternativa: {"ouro": 50, "prata": 0, "cobre": 0},
    },
  },
};

export function equipamentoBackground(versao: 'DND_2014' | 'DND_2024', nome: string): EquipamentoInicial | undefined {
  const dados = catalogos[versao][nome];
  return dados ? JSON.parse(JSON.stringify(dados)) : undefined;
}
