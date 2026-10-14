import { SubClasses } from "../classesPrincipais/SubClasses";

export class PatronoGrandeAntigo2024 extends SubClasses {
    niveis: {
        nome: string;
        nivel: number;
        descricao: string;
    }[];

    constructor() {
        super("Patrono O Grande Antigo", "Você se conecta a uma entidade indescritível do Reino Distante ou a um deus ancestral, aprendendo segredos que permitem aproveitar sua estranha magia.");
        this.niveis = [
            {
                nome: "Magias de Pacto do Grande Antigo",
                nivel: 3,
                descricao: "Você sempre tem magias adicionais preparadas: no nível 3, Detectar Pensamentos, Força Espectral, Gargalhada Nefasta de Tasha e Sussurros Dissonantes; no nível 5, Clarividência e Fome de Hadar; no nível 7, Confusão e Invocar Aberração; no nível 9, Modificar Memória e Telecinese."
            },
            {
                nome: "Magias Psíquicas",
                nivel: 3,
                descricao: "Ao conjurar uma magia de Bruxo que cause dano, você pode mudar seu tipo de dano para Psíquico. Além disso, pode conjurar uma magia de Bruxo de Encantamento ou Ilusão sem componentes Verbais ou Somáticos."
            },
            {
                nome: "Mente Desperta",
                nivel: 3,
                descricao: "Como Ação Bônus, escolha uma criatura à sua vista a até 9 metros. Vocês podem se comunicar telepaticamente a até 1,5 quilômetros vezes seu modificador de Carisma, mínimo 1,5 quilômetro, usando mentalmente um idioma comum. A ligação dura um número de minutos igual ao seu nível de Bruxo ou até você conectar outra criatura."
            },
            {
                nome: "Combatente Clarividente",
                nivel: 6,
                descricao: "Ao formar uma ligação telepática com Mente Desperta, você pode forçar a criatura a realizar uma salvaguarda de Sabedoria contra sua CD de magia. Se falhar, ela tem Desvantagem em ataques contra você e você tem Vantagem em ataques contra ela pela duração da ligação. Você recupera o uso ao completar Descanso Curto ou Longo ou ao gastar espaço de Magia de Pacto."
            },
            {
                nome: "Danação Mística",
                nivel: 10,
                descricao: "Você sempre tem Danação preparada. Ao conjurá-la e escolher um atributo, o alvo também tem Desvantagem nas salvaguardas do atributo escolhido pela duração da magia."
            },
            {
                nome: "Escudo Mental",
                nivel: 10,
                descricao: "Seus pensamentos não podem ser lidos por telepatia ou outros meios, a menos que você permita. Você tem Resistência a dano Psíquico e, sempre que uma criatura causar dano Psíquico a você, ela sofre a mesma quantidade de dano."
            },
            {
                nome: "Criar Servo",
                nivel: 14,
                descricao: "Ao conjurar Invocar Aberração, você pode modificá-la para não exigir Concentração. A duração se torna 1 minuto para essa conjuração, e a Aberração recebe Pontos de Vida Temporários iguais ao seu nível de Bruxo + seu modificador de Carisma. Na primeira vez de cada turno que ela atingir uma criatura sob sua Danação, causa dano Psíquico adicional igual ao bônus dessa magia."
            }
        ];
    }
}
