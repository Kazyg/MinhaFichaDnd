import { BackGround } from "../classesPrincipais/BackGrounds.class";
import { Classes } from "../classesPrincipais/Classes.class";
import { Raca } from "../classesPrincipais/Raca.class";
import { Atributos } from "../classesPrincipais/Atributos.class";

export class Ficha {
    nomePersonagem: string | null;
    racaPrincipal?: Raca | null;
    subRaca?: Raca | null;
    classePrincipal: Classes | null;
    subClasse: any | null;
    backGround: BackGround | null;
    atributosPersonagem: Atributos | null;
    iniciativa: number | null;
    proeficiencia: number | null;
    percepcao: number | null;
    vidaTotal: number | null;
    pericias: string[] | null;
    levelTotal: number | null;
    classeArmadura: number | null;
    speed: number | null;
    tamanho: string | null;
    talentos: string[] | null;
    idiomas: string[] | null;

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
        tamanho: string,
        idiomas: string[]
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
        this.idiomas = idiomas;
    }

    // Métodos para alterar propriedades
    setNomePersonagem(nome: string | null) {
        this.nomePersonagem = nome;
    }

    setRacaPrincipal(raca: Raca | null) {
        this.racaPrincipal = raca;
    }

    setSubRaca(subRaca: Raca | null) {
        this.subRaca = subRaca;
    }

    setClassePrincipal(classe: Classes | null) {
        this.classePrincipal = classe;
    }

    setSubClasse(subClasse: any | null) {
        this.subClasse = subClasse;
    }

    setBackGround(backGround: BackGround | null) {
        this.backGround = backGround;
    }

    setAtributosPersonagem(atributos: Atributos | null) {
        this.atributosPersonagem = atributos;
    }

    setIniciativa(iniciativa: number | null) {
        this.iniciativa = iniciativa;
    }

    setProeficiencia(proeficiencia: number | null) {
        this.proeficiencia = proeficiencia;
    }

    setPercepcao(percepcao: number | null) {
        this.percepcao = percepcao;
    }

    setVidaTotal(vidaTotal: number | null) {
        this.vidaTotal = vidaTotal;
    }

    setPericias(pericias: string[] | null) {
        this.pericias = pericias;
    }

    setLevelTotal(levelTotal: number | null) {
        this.levelTotal = levelTotal;
    }

    setClasseArmadura(classeArmadura: number | null) {
        this.classeArmadura = classeArmadura;
    }

    setSpeed(speed: number | null) {
        this.speed = speed;
    }

    setTamanho(tamanho: string | null) {
        this.tamanho = tamanho;
    }

    setTalentos(talentos: string[] | null) {
        this.talentos = talentos;
    }
    setIdiomasRaca(idiomas: string[] | null){
        this.idiomas = idiomas;
    }
    setIdiomas(idiomas: string | null){
        idiomas? this.idiomas?.push(idiomas) : this.idiomas = this.idiomas;
    }
    removerIdioma(idioma: string) {
        if (this.idiomas) {
            this.idiomas = this.idiomas.filter((i) => i !== idioma);
        }
    }
}