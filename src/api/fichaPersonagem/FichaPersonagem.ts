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

    constructor(data: Partial<Ficha> = {})
    {
        this.nomePersonagem = data?.nomePersonagem ?? null;
        this.racaPrincipal = data?.racaPrincipal ?? null;
        this.classePrincipal = data?.classePrincipal ?? null;
        this.backGround = data?.backGround ?? null;
        this.atributosPersonagem = data?.atributosPersonagem ?? null;
        this.iniciativa = data?.iniciativa ?? null;
        this.proeficiencia = data?.proeficiencia ?? null;
        this.percepcao = data?.percepcao ?? null;
        this.vidaTotal = data?.vidaTotal ?? null;
        this.pericias = data?.pericias ?? null;
        this.levelTotal = data?.levelTotal ?? null;
        this.classeArmadura = data?.classeArmadura ?? null;
        this.speed = data?.speed ?? null;
        this.tamanho = data?.tamanho ?? null;
        this.idiomas = data?.idiomas ?? null;
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

    setAtributosPersonagem(atributos: Atributos) {
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

    setPericia(pericia: string | null){
        pericia? this.pericias?.push(pericia) : this.pericias = this.pericias;
    }

    removerIPericia(pericia: string) {
        if (this.pericias) {
            this.pericias = this.pericias.filter((i) => i !== pericia);
        }
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