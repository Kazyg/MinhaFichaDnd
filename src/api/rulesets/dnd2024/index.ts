import { getRulesetConfig } from "../regras";
import { getTalentosConteudo, getMagiasConteudo } from '../conteudo';
import { BackGround } from "../../classesPrincipais/BackGrounds.class";
import { Raca } from "../../classesPrincipais/Raca.class";
import { Paladino2024 } from "../../classesClassesFilhos/Paladino2024.class";
import { Barbaro2024 } from "../../classesClassesFilhos/Barbaro2024.class";
import { Bardo2024 } from "../../classesClassesFilhos/Bardo2024.class";
import { Bruxo2024 } from "../../classesClassesFilhos/Bruxo2024.class";
import { Clerigo2024 } from "../../classesClassesFilhos/Clerigo2024.class";
import { Druida2024 } from "../../classesClassesFilhos/Druida2024.class";
import { Feiticeiro2024 } from "../../classesClassesFilhos/Feiticeiro2024.class";
import { Lutador2024 } from "../../classesClassesFilhos/Lutador2024.class";
import { Mago2024 } from "../../classesClassesFilhos/Mago2024.class";
import { Monge2024 } from "../../classesClassesFilhos/Monge2024.class";
import { Ranger2024 } from "../../classesClassesFilhos/Ranger2024.class";
import { Ladino2024 } from "../../classesClassesFilhos/Ladino2024.class";
import { RulesetData } from "../types";

const semAtributos = () => ({ atributo: [], bonus: [] });

const criarOrigem = (
  nome: string,
  proeficienciasHabilidades: string[],
  atributos: string[],
  talentoOrigem: string,
  equipamentos: string[] = [],
  ferramentas: string[] = []
): BackGround => {
  const origem = new BackGround(
    nome,
    proeficienciasHabilidades,
    0,
    equipamentos,
    ferramentas,
    {
      nome: "Talento de Origem",
      descricao: `${talentoOrigem}. A origem também sugere os atributos ${atributos.join(", ")}.`
    }
  ) as BackGround & { atributos?: { atributo: string[]; bonus: number[] }; talentoOrigem?: string };

  origem.atributos = { atributo: atributos, bonus: atributos.map(() => 1) };
  origem.talentoOrigem = talentoOrigem;
  return origem;
};



const especies2024 = () => [
  new Raca("Aasimar", "Médio ou Pequeno", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Resistência Celestial", descricao: "Você tem resistência a dano Necrótico e Radiante." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 18 metros." },
    { traco: "Mãos Curativas", descricao: "Com uma ação Usar Magia, você toca uma criatura e joga um número de d4s igual ao seu Bônus de Proficiência. A criatura restaura Pontos de Vida iguais ao total jogado. Após usar este traço, você só pode usá-lo novamente após completar um Descanso Longo." },
    { traco: "Portador da Luz", descricao: "Você conhece o truque Luz. Carisma é seu atributo de conjuração para esse truque." },
    { traco: "Revelação Celestial", descricao: "No nível 3 de personagem, você pode se transformar como uma Ação Bônus por 1 minuto, escolhendo Asas Celestiais, Manto Necrótico ou Transfiguração Radiante cada vez que se transformar. A transformação termina antes se você ficar Incapacitado. Uma vez em cada um dos seus turnos durante a transformação, quando causar dano a um alvo com um ataque ou magia, você causa dano adicional ao alvo igual ao seu Bônus de Proficiência. O dano adicional é Necrótico para Manto Necrótico e Radiante para Asas Celestiais ou Transfiguração Radiante. Após se transformar, você só pode fazê-lo novamente após completar um Descanso Longo." }
  ], [], [
    new Raca("Asas Celestiais", "Médio ou Pequeno", 30, [], semAtributos(), [
      { traco: "Asas Celestiais", descricao: "Durante a Revelação Celestial, você recebe Deslocamento de Voo igual ao seu Deslocamento." }
    ]),
    new Raca("Manto Necrótico", "Médio ou Pequeno", 30, [], semAtributos(), [
      { traco: "Manto Necrótico", descricao: "Durante a Revelação Celestial, criaturas que não sejam seus aliados a até 3 metros devem passar em uma salvaguarda de Carisma contra CD 8 + seu modificador de Carisma + seu Bônus de Proficiência ou ficam Amedrontadas até o final do seu próximo turno." }
    ]),
    new Raca("Transfiguração Radiante", "Médio ou Pequeno", 30, [], semAtributos(), [
      { traco: "Transfiguração Radiante", descricao: "Durante a Revelação Celestial, você emite Luz Plena em raio de 3 metros e Meia-luz por mais 3 metros. No fim de cada um de seus turnos, cada criatura a até 3 metros sofre dano Radiante igual ao seu Bônus de Proficiência." }
    ])
  ]),
  new Raca("Anão", "Médio", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 36 metros." },
    { traco: "Resistência a Toxinas", descricao: "Você tem resistência a dano Venenoso e vantagem nas salvaguardas para evitar ou encerrar a condição Envenenado." },
    { traco: "Tenacidade Anã", descricao: "Seus Pontos de Vida máximos aumentam em 1 e aumentam em mais 1 sempre que você atinge um nível de personagem." },
    { traco: "Conhecimento de Pedras", descricao: "Como uma Ação Bônus, você adquire Sismiconsciência com alcance de 18 metros por 10 minutos. Você deve estar em, ou tocar, uma superfície de pedra natural ou trabalhada. Você pode usar esta Ação Bônus um número de vezes igual ao seu Bônus de Proficiência e restaura todos os usos ao completar um Descanso Longo." }
  ]),
  new Raca("Draconato", "Médio", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Herança Dracônica", descricao: "Escolha uma herança dracônica. Ela define o tipo de dano do seu Ataque de Sopro e da sua Resistência a Dano: Azul ou Bronze causa Elétrico; Branco ou Prata causa Gélido; Cobre ou Negro causa Ácido; Latão, Ouro ou Vermelho causa Ígneo; Verde causa Venenoso." },
    { traco: "Ataque de Sopro", descricao: "Ao executar a ação Atacar, você pode substituir um ataque por energia mágica em Cone de 4,5 metros ou Linha de 9 metros por 1,5 metro, escolhendo a forma a cada uso. Cada criatura na área realiza salvaguarda de Destreza contra CD 8 + seu modificador de Constituição + seu Bônus de Proficiência. Falha causa 1d10 do tipo da Herança Dracônica; sucesso causa metade. O dano aumenta para 2d10 no nível 5, 3d10 no nível 11 e 4d10 no nível 17. Você pode usar um número de vezes igual ao seu Bônus de Proficiência e restaura os usos ao completar um Descanso Longo." },
    { traco: "Resistência a Dano", descricao: "Você tem resistência ao tipo de dano determinado por sua Herança Dracônica." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 18 metros." },
    { traco: "Voo Dracônico", descricao: "No nível 5 de personagem, como uma Ação Bônus, você cria asas espectrais por 10 minutos, até retraí-las ou até ficar Incapacitado. Pela duração, você tem Deslocamento de Voo igual ao seu Deslocamento. Após usar este traço, você só pode usá-lo novamente após completar um Descanso Longo." }
  ], [], [
    new Raca("Azul", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Elétrico." }]),
    new Raca("Branco", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Gélido." }]),
    new Raca("Bronze", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Elétrico." }]),
    new Raca("Cobre", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Ácido." }]),
    new Raca("Latão", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Ígneo." }]),
    new Raca("Negro", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Ácido." }]),
    new Raca("Ouro", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Ígneo." }]),
    new Raca("Prata", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Gélido." }]),
    new Raca("Verde", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Venenoso." }]),
    new Raca("Vermelho", "Médio", 30, [], semAtributos(), [{ traco: "Tipo de Dano", descricao: "Ígneo." }])
  ]),
  new Raca("Elfo", "Médio", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 18 metros." },
    { traco: "Linhagem Élfica", descricao: "Escolha Alto Elfo, Drow ou Elfo Silvestre. Você recebe o benefício de nível 1 da linhagem. Nos níveis 3 e 5, aprende as magias indicadas; elas estão sempre preparadas e podem ser conjuradas uma vez sem espaço de magia, recuperando esse uso ao completar um Descanso Longo. Inteligência, Sabedoria ou Carisma é seu atributo de conjuração para essas magias, escolhido ao selecionar a linhagem." },
    { traco: "Ancestralidade Feérica", descricao: "Você tem vantagem nas salvaguardas para evitar ou encerrar a condição Enfeitiçado." },
    { traco: "Sentidos Aguçados", descricao: "Você tem proficiência em Intuição, Percepção ou Sobrevivência." },
    { traco: "Transe", descricao: "Você pode completar um Descanso Longo em 4 horas ao meditar, sem precisar dormir, mantendo a consciência; magia não pode forçá-lo a dormir." }
  ], [], [
    new Raca("Alto Elfo", "Médio", 30, [], semAtributos(), [
      { traco: "Linhagem Élfica", descricao: "No nível 1, você conhece Prestidigitação Arcana e pode substituí-lo por outro truque da lista de Mago ao completar um Descanso Longo. No nível 3, aprende Detectar Magia. No nível 5, aprende Passo Nebuloso." }
    ]),
    new Raca("Drow", "Médio", 30, [], semAtributos(), [
      { traco: "Linhagem Élfica", descricao: "No nível 1, sua Visão no Escuro aumenta para 36 metros e você conhece Luzes Dançantes. No nível 3, aprende Fogo das Fadas. No nível 5, aprende Escuridão." }
    ]),
    new Raca("Elfo Silvestre", "Médio", 35, [], semAtributos(), [
      { traco: "Linhagem Élfica", descricao: "No nível 1, seu Deslocamento aumenta para 10,5 metros e você conhece Arte Druídica. No nível 3, aprende Passos Largos. No nível 5, aprende Passos sem Rastro." }
    ])
  ], ["Intuição", "Percepção", "Sobrevivência"]),
  new Raca("Gnomo", "Pequeno", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 18 metros." },
    { traco: "Astúcia de Gnomo", descricao: "Você tem vantagem em salvaguardas de Inteligência, Sabedoria e Carisma." },
    { traco: "Linhagem Gnômica", descricao: "Escolha Gnomo das Rochas ou Gnomo do Bosque. Inteligência, Sabedoria ou Carisma é seu atributo de conjuração para as magias desse traço, escolhido ao selecionar a linhagem." }
  ], [], [
    new Raca("Gnomo das Rochas", "Pequeno", 30, [], semAtributos(), [
      { traco: "Linhagem Gnômica", descricao: "Você conhece Prestidigitação Arcana e Reparar. Você também pode gastar 10 minutos conjurando Prestidigitação Arcana para fabricar um dispositivo mecânico minúsculo que produz um efeito escolhido da magia quando ativado com uma Ação Bônus. Você pode manter três dispositivos ao mesmo tempo; cada um se desfaz após 8 horas ou quando desmontado com uma ação Usar Objeto." }
    ]),
    new Raca("Gnomo do Bosque", "Pequeno", 30, [], semAtributos(), [
      { traco: "Linhagem Gnômica", descricao: "Você conhece Ilusão Menor. Você sempre tem Falar com Animais preparada e pode conjurá-la sem espaço de magia um número de vezes igual ao seu Bônus de Proficiência, recuperando os usos ao completar um Descanso Longo. Você também pode conjurá-la usando espaços de magia." }
    ])
  ]),
  new Raca("Golias", "Médio", 35, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Ancestralidade Gigante", descricao: "Escolha um benefício sobrenatural de sua ancestralidade gigante. Você pode usar o benefício escolhido um número de vezes igual ao seu Bônus de Proficiência e restaura os usos ao completar um Descanso Longo." },
    { traco: "Forma Grande", descricao: "A partir do nível 5 de personagem, como uma Ação Bônus, você pode se tornar Grande por 10 minutos se houver espaço suficiente. Pela duração, você tem vantagem em testes de Força e seu Deslocamento aumenta em 3 metros. Após usar este traço, você só pode usá-lo novamente após completar um Descanso Longo." },
    { traco: "Porte Poderoso", descricao: "Você tem vantagem em testes de atributo para encerrar a condição Imobilizado e conta como um tamanho maior ao determinar sua capacidade de carga." }
  ], [], [
    new Raca("Arrepio do Gelo", "Médio", 35, [], semAtributos(), [{ traco: "Gigante do Gelo", descricao: "Ao atingir um alvo com uma jogada de ataque e causar dano, você pode causar 1d6 de dano Gélido adicional e reduzir o Deslocamento do alvo em 3 metros até o início do seu próximo turno." }]),
    new Raca("Queimadura de Fogo", "Médio", 35, [], semAtributos(), [{ traco: "Gigante de Fogo", descricao: "Ao atingir um alvo com uma jogada de ataque e causar dano, você pode causar 1d10 de dano Ígneo adicional." }]),
    new Raca("Resistência da Pedra", "Médio", 35, [], semAtributos(), [{ traco: "Gigante da Pedra", descricao: "Ao sofrer dano, você pode executar uma Reação para jogar 1d12, adicionar seu modificador de Constituição e reduzir o dano por esse total." }]),
    new Raca("Salto da Nuvem", "Médio", 35, [], semAtributos(), [{ traco: "Gigante das Nuvens", descricao: "Como uma Ação Bônus, você se teleporta magicamente até 9 metros para um espaço desocupado à sua vista." }]),
    new Raca("Tombo da Colina", "Médio", 35, [], semAtributos(), [{ traco: "Gigante da Colina", descricao: "Ao atingir uma criatura Grande ou menor com uma jogada de ataque e causar dano, você pode impor a condição Caído ao alvo." }]),
    new Raca("Trovão da Tempestade", "Médio", 35, [], semAtributos(), [{ traco: "Gigante da Tempestade", descricao: "Ao sofrer dano de uma criatura a até 18 metros, você pode executar uma Reação para causar 1d8 de dano Trovejante a essa criatura." }])
  ]),
  new Raca("Humano", "Médio ou Pequeno", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Eficiente", descricao: "Você adquire Inspiração Heroica sempre que completa um Descanso Longo." },
    { traco: "Hábil", descricao: "Você adquire proficiência em uma perícia à sua escolha." },
    { traco: "Versátil", descricao: "Você adquire um talento de Origem à sua escolha. Habilidoso é recomendado." }
  ], [], [], ["Escolha uma perícia"]),
  new Raca("Orc", "Médio", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Pico de Adrenalina", descricao: "Você pode executar a ação Correr como uma Ação Bônus. Ao fazer isso, recebe Pontos de Vida Temporários iguais ao seu Bônus de Proficiência. Você pode usar este traço um número de vezes igual ao seu Bônus de Proficiência e restaura os usos ao completar um Descanso Curto ou Longo." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 36 metros." },
    { traco: "Vigor Implacável", descricao: "Ao ser reduzido a 0 Pontos de Vida, mas não morto imediatamente, você fica com 1 Ponto de Vida. Após usar este traço, você só pode usá-lo novamente após completar um Descanso Longo." }
  ]),
  new Raca("Pequenino", "Pequeno", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Corajoso", descricao: "Você tem vantagem nas salvaguardas para evitar ou encerrar a condição Amedrontado." },
    { traco: "Agilidade Pequenina", descricao: "Você pode se mover pelo espaço de qualquer criatura que seja um tamanho maior que você, mas não pode parar no mesmo espaço." },
    { traco: "Sorte", descricao: "Ao tirar 1 no d20 de um Teste de d20, você pode jogar novamente o dado e deve usar a nova jogada." },
    { traco: "Furtividade Natural", descricao: "Você pode executar a ação Esconder mesmo quando estiver encoberto apenas por uma criatura que seja pelo menos um tamanho maior que você." }
  ]),
  new Raca("Tiferino", "Médio ou Pequeno", 30, [], semAtributos(), [
    { traco: "Tipo de Criatura", descricao: "Você é Humanoide." },
    { traco: "Visão no Escuro", descricao: "Você tem Visão no Escuro com alcance de 18 metros." },
    { traco: "Legado Ínfero", descricao: "Escolha um legado: Abissal, Ctônico ou Infernal. Você recebe o benefício de nível 1 do legado. Nos níveis 3 e 5, aprende as magias indicadas; elas estão sempre preparadas e podem ser conjuradas uma vez sem espaço de magia, recuperando esse uso ao completar um Descanso Longo. Inteligência, Sabedoria ou Carisma é seu atributo de conjuração para essas magias, escolhido ao selecionar o legado." },
    { traco: "Presença Sobrenatural", descricao: "Você conhece Taumaturgia. Ao conjurá-la com este traço, ela usa o mesmo atributo de conjuração escolhido para Legado Ínfero." }
  ], [], [
    new Raca("Abissal", "Médio ou Pequeno", 30, [], semAtributos(), [
      { traco: "Legado Ínfero", descricao: "No nível 1, você tem resistência a dano Venenoso e conhece Rajada de Veneno. No nível 3, aprende Raio Nauseante. No nível 5, aprende Paralisar Pessoa." }
    ]),
    new Raca("Ctônico", "Médio ou Pequeno", 30, [], semAtributos(), [
      { traco: "Legado Ínfero", descricao: "No nível 1, você tem resistência a dano Necrótico e conhece Toque Necrótico. No nível 3, aprende Vitalidade Vazia. No nível 5, aprende Raio do Enfraquecimento." }
    ]),
    new Raca("Infernal", "Médio ou Pequeno", 30, [], semAtributos(), [
      { traco: "Legado Ínfero", descricao: "No nível 1, você tem resistência a dano Ígneo e conhece Raio de Fogo. No nível 3, aprende Repreensão Diabólica. No nível 5, aprende Escuridão." }
    ])
  ])
];

export const createDnd2024Ruleset = (): RulesetData => ({
  racasOuEspecies: especies2024(),
  classes: [
    new Paladino2024(),
    new Barbaro2024(),
    new Bardo2024(),
    new Bruxo2024(),
    new Clerigo2024(),
    new Druida2024(),
    new Feiticeiro2024(),
    new Mago2024(),
    new Lutador2024(),
    new Monge2024(),
    new Ranger2024(),
    new Ladino2024()
  ],
  backgroundsOuOrigens: [
    criarOrigem("Acólito", ["Intuição", "Religião"], ["inteligencia", "sabedoria", "carisma"], "Iniciado em Magia (Clérigo)", ["Suprimentos de Calígrafo", "Livro (orações)", "Símbolo Sagrado", "Pergaminho (10 folhas)", "Túnica", "8 PO", "ou 50 PO"], ["Suprimentos de Calígrafo"]),
    criarOrigem("Andarilho", ["Furtividade", "Intuição"], ["destreza", "sabedoria", "carisma"], "Sortudo", ["2 Adagas", "Ferramentas de Ladrão", "Kit de Jogos (qualquer um)", "2 Algibeiras", "Roupas de Viagem", "Saco de Dormir", "16 PO", "ou 50 PO"], ["Ferramentas de Ladrão"]),
    criarOrigem("Artesão", ["Investigação", "Persuasão"], ["forca", "destreza", "inteligencia"], "Artifista", ["Ferramentas de Artesão", "2 Algibeiras", "Roupas de Viagem", "32 PO", "ou 50 PO"], ["Ferramentas de Artesão"]),
    criarOrigem("Artista", ["Acrobacia", "Atuação"], ["forca", "destreza", "carisma"], "Músico", ["Instrumento Musical", "Espelho", "2 Fantasias", "Perfume", "Roupas de Viagem", "11 PO", "ou 50 PO"], ["Instrumento Musical"]),
    criarOrigem("Charlatão", ["Enganação", "Prestidigitação"], ["destreza", "constituicao", "carisma"], "Habilidoso", ["Kit de Falsificação", "Fantasia", "Roupas Finas", "15 PO", "ou 50 PO"], ["Kit de Falsificação"]),
    criarOrigem("Criminoso", ["Furtividade", "Prestidigitação"], ["destreza", "constituicao", "inteligencia"], "Alerta", ["2 Adagas", "Ferramentas de Ladrão", "2 Algibeiras", "Pé de Cabra", "Roupas de Viagem", "16 PO", "ou 50 PO"], ["Ferramentas de Ladrão"]),
    criarOrigem("Eremita", ["Medicina", "Religião"], ["constituicao", "sabedoria", "carisma"], "Curandeiro", ["Cajado", "Kit de Herbalismo", "Lâmpada", "Livro (filosofia)", "Óleo (3 frascos)", "Roupas de Viagem", "Saco de Dormir", "16 PO", "ou 50 PO"], ["Kit de Herbalismo"]),
    criarOrigem("Escriba", ["Investigação", "Percepção"], ["destreza", "inteligencia", "sabedoria"], "Habilidoso", ["Suprimentos de Calígrafo", "Lâmpada", "Óleo (3 frascos)", "Pergaminho (12 folhas)", "Roupas Finas", "23 PO", "ou 50 PO"], ["Suprimentos de Calígrafo"]),
    criarOrigem("Fazendeiro", ["Lidar com Animais", "Natureza"], ["forca", "constituicao", "sabedoria"], "Vigoroso", ["Foice", "Ferramentas de Carpinteiro", "Kit de Curandeiro", "Balde de Ferro", "Pá", "30 PO", "ou 50 PO"], ["Ferramentas de Carpinteiro"]),
    criarOrigem("Guarda", ["Atletismo", "Percepção"], ["forca", "inteligencia", "sabedoria"], "Alerta", ["Lança", "Besta Leve", "20 Virotes", "Kit de Jogos", "Aljava", "Grilhões", "Lanterna Coberta", "Roupas de Viagem", "12 PO", "ou 50 PO"], ["Kit de Jogos"]),
    criarOrigem("Guia", ["Furtividade", "Sobrevivência"], ["destreza", "constituicao", "sabedoria"], "Iniciado em Magia (Druida)", ["Arco Curto", "20 Flechas", "Ferramentas de Cartógrafo", "Aljava", "Roupas de Viagem", "Saco de Dormir", "Tenda", "3 PO", "ou 50 PO"], ["Ferramentas de Cartógrafo"]),
    criarOrigem("Marinheiro", ["Acrobacia", "Percepção"], ["forca", "destreza", "sabedoria"], "Valentão de Taverna", ["Adaga", "Ferramentas de Navegador", "Corda", "Roupas de Viagem", "20 PO", "ou 50 PO"], ["Ferramentas de Navegador"]),
    criarOrigem("Mercador", ["Lidar com Animais", "Persuasão"], ["constituicao", "inteligencia", "carisma"], "Sortudo", ["Ferramentas de Navegador", "2 Algibeiras", "Roupas de Viagem", "22 PO", "ou 50 PO"], ["Ferramentas de Navegador"]),
    criarOrigem("Nobre", ["História", "Persuasão"], ["forca", "inteligencia", "carisma"], "Habilidoso", ["Kit de Jogos", "Perfume", "Roupas Finas", "29 PO", "ou 50 PO"], ["Kit de Jogos"]),
    criarOrigem("Sábio", ["Arcanismo", "História"], ["constituicao", "inteligencia", "sabedoria"], "Iniciado em Magia (Mago)", ["Cajado", "Suprimentos de Calígrafo", "Livro (história)", "Pergaminho (8 folhas)", "Túnica", "8 PO", "ou 50 PO"], ["Suprimentos de Calígrafo"]),
    criarOrigem("Soldado", ["Atletismo", "Intimidação"], ["forca", "destreza", "constituicao"], "Atacante Selvagem", ["Lança", "Arco Curto", "20 Flechas", "Kit de Curandeiro", "Kit de Jogos", "Aljava", "Roupas de Viagem", "14 PO", "ou 50 PO"], ["Kit de Jogos"])
  ],
  // Content APIs return independent copies only when the caller requests them.
  get talentos() { return getTalentosConteudo("DND_2024"); },
  armas: [],
  armaduras: [],
  itens: [],
  get magias() { return getMagiasConteudo("DND_2024"); },
  ...getRulesetConfig("DND_2024")
});
