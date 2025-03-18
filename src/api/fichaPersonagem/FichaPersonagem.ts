import { BackGround } from "../classesPrincipais/BackGrounds.class";
import { Classes } from "../classesPrincipais/Classes.class";
import { Raca } from "../classesPrincipais/Raca.class";
import { Atributos } from "../classesPrincipais/Atributos.class";
import { Multiclasses } from "../classesPrincipais/Multiclasses";

export class Ficha {
    id: string;
    nomePersonagem: string | null;
    racaPrincipal?: Raca | null;
    subRaca: Raca | null;
    classePrincipal: Classes | null;
    subClasse: any | null;
    multiclasses: Multiclasses[] | null;
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

    constructor(data: Partial<Ficha> = {}) {
        this.id = data?.id ?? this.gerarIdUnico();
        this.nomePersonagem = data?.nomePersonagem ?? null;
        this.racaPrincipal = data?.racaPrincipal ?? null;
        this.subRaca = data?.subRaca ?? null;
        this.classePrincipal = data?.classePrincipal ?? null;
        this.backGround = data?.backGround ?? null;
        this.multiclasses = data?.multiclasses ?? null;
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

    calcularModificador(valor) {
        return Math.floor((valor - 10) / 2)
    };

    gerarIdUnico() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 5);
        return `${timestamp}-${random}`;
    };

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
        this.setIniciativa(atributos?.destreza.valor || null);
    }

    setIniciativa(destreza: number | null) {
        this.iniciativa = this.calcularModificador(destreza)
    }

    setProeficiencia(level: number | null) {
        switch (level) {
            case 1:
            case 2:
            case 3:
            case 4:
                this.proeficiencia = 2;
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                this.proeficiencia = 3;
                break;
            case 9:
            case 10:
            case 11:
            case 12:
                this.proeficiencia = 4;
                break;
            case 13:
            case 14:
            case 15:
            case 16:
                this.proeficiencia = 5;
                break;
            case 17:
            case 18:
            case 19:
            case 20:
                this.proeficiencia = 6;
                break;
            default:
                this.proeficiencia = 0;
        }
    }

    setPercepcao(percepcao: number | null) {
        this.percepcao = percepcao;
    }

    setVidaTotal(vidaTotal: number | null) {
        this.vidaTotal = vidaTotal;
    }

    setPericia(pericia: string | null) {
        pericia && this.pericias?.push(pericia);
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
        this.setProeficiencia(this.levelTotal);
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
    setIdiomasRaca(idiomas: string[] | null) {
        this.idiomas = idiomas;
    }
    setIdiomas(idiomas: string | null) {
        idiomas && this.idiomas?.push(idiomas);
    }
    removerIdioma(idioma: string) {
        if (this.idiomas) {
            this.idiomas = this.idiomas.filter((i) => i !== idioma);
        }
    }
    setMulticlasse(multiclasses: Multiclasses) {
        this.multiclasses = [multiclasses];
    }
}