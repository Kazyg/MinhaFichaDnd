import { BackGround } from "../classesPrincipais/BackGrounds.class";
import { Classes } from "../classesPrincipais/Classes.class";
import { Raca } from "../classesPrincipais/Raca.class";
import { Atributos } from "../classesPrincipais/Atributos.class";

export class Ficha {
    nomePersonagem: string;
    racaPrincipal: Raca;
    classePrincipal: Classes;
    backGround: BackGround;
    atributosPersonagem: Atributos;
    iniciativa: number;
    proeficiencia: number;
    percepcao: number;
    vidaTotal: number;
    pericias: string[];
    levelTotal: number;
    classeArmadura: number;
    speed: number;
    tamanho: string;
    
    constructor(
        nomePersonagem: string,
        racaPrincipal: Raca,
        classePrincipal: Classes,
        backGround: BackGround,
        atributosPersonagem: Atributos,
        iniciativa: number,
        proeficiencia: number,
        percepcao: number,
        vidaTotal: number,
        pericias: string[],
        levelTotal: number,
        classeArmadura: number,
        speed: number,
        tamanho: string
    ) {
        this.nomePersonagem = nomePersonagem;
        this.racaPrincipal = racaPrincipal;
        this.classePrincipal = classePrincipal;
        this.backGround = backGround;
        this.atributosPersonagem = atributosPersonagem;
        this.iniciativa = iniciativa;
        this.proeficiencia = proeficiencia;
        this.percepcao = percepcao;
        this.vidaTotal = vidaTotal;
        this.pericias = pericias;
        this.levelTotal = levelTotal;
        this.classeArmadura = classeArmadura;
        this.speed = speed;
        this.tamanho = tamanho;
    }
}