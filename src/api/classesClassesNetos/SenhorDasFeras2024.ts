import { SubClasses } from "../classesPrincipais/SubClasses";

export class SenhorDasFeras2024 extends SubClasses {
    niveis: { nome: string; nivel: number; descricao: string; }[];

    constructor() {
        super("Senhor das Feras", "Você forma um vínculo místico com uma fera primal, sustentado por magia primordial e uma conexão profunda com a natureza.");
        this.niveis = [
            { nome: "Companheiro Primal", nivel: 3, descricao: "Você invoca magicamente uma fera primal usando o bloco de Fera da Terra, Fera do Céu ou Fera do Mar, escolhendo sua aparência. A fera é Amigável a você e seus aliados, age no seu turno, pode se mover e usar Reação, mas só executa Esquivar a menos que você use Ação Bônus para comandá-la ou sacrifique um ataque da ação Atacar para ordenar Golpe da Fera. Se a fera morreu na última hora, você pode usar ação Usar Magia, tocá-la e gastar espaço de magia para restaurá-la após 1 minuto. Ao completar Descanso Longo, pode invocar outra fera primal." },
            { nome: "Treinamento Excepcional", nivel: 7, descricao: "Ao usar Ação Bônus para ordenar sua fera Companheira Primal, você também pode ordená-la a executar Ajudar, Correr, Desengajar ou Esquivar usando a Ação Bônus dela. Além disso, quando a fera acerta e causa dano, ela pode causar dano Energético ou seu dano normal, à sua escolha." },
            { nome: "Fúria Bestial", nivel: 11, descricao: "Ao ordenar sua fera Companheira Primal a executar Golpe da Fera, ela pode usar essa ação duas vezes. Além disso, na primeira vez em cada turno que ela atinge uma criatura sob sua Marca do Predador, a fera causa dano Energético adicional igual ao dano bônus dessa magia." },
            { nome: "Compartilhar Magias", nivel: 15, descricao: "Ao conjurar uma magia em si, você também pode afetar sua fera Companheira Primal com a magia se a fera estiver a até 9 metros de você." }
        ];
    }
}
