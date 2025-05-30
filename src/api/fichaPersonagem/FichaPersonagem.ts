import { BackGround } from "../classesPrincipais/BackGrounds.class";
import { Classes } from "../classesPrincipais/Classes.class";
import { Raca } from "../classesPrincipais/Raca.class";
import { Atributos } from "../classesPrincipais/Atributos.class";
import { Multiclasses } from "../classesPrincipais/Multiclasses";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { Efeitos } from "../classesPrincipais/Efeitos";
import { Armaduras_equip } from "../equipamentos/Armaduras.ts"
import { Armas } from "../equipamentos/Armas";
import { Metamagica } from "../../bibliotecas/Metamagica.ts";
import { Itens } from "../../bibliotecas/Itens.ts";
import { Patronos } from "../classesEspeciais/Patronos.class.ts";

export class Ficha {
    id: string;
    nomePersonagem: string | null;
    racaPrincipal?: Raca | null;
    subRaca: Raca | null;
    classePrincipal: Classes | null;
    subClasse: { classe: Classes, subclasse: SubClasses }[] | null;
    multiclasses: Multiclasses[] | null;
    backGround: BackGround | null;
    atributosPersonagem: Atributos | null;
    iniciativa: number | null;
    proeficiencia: number | null;
    percepcao: number | null;
    vidaTotal: number | null;
    vidaAtual: number | null;
    pericias: string[] | null;
    levelTotal: number | null;
    classeArmadura: number | null;
    speed: number | null;
    tamanho: string | null;
    talentos: string[] | null;
    idiomas: string[] | null;
    estiloLuta: { estilo: string, classe: string }[] | null;
    animalSelecionado: { animal: string, nivel: number }[] | null;
    terrenoSelecionado: string | null;
    efeitos: Efeitos[] | null;
    ArmadurasMochila: Armaduras_equip[] | null;
    ArmasMochila: Armas[] | null;
    cA: number | null;
    ArmaduraEquipada: Armaduras_equip | null;
    escudoEquipado: Armaduras_equip | null;
    ArmaEquipada: Armas[] | null;
    maosOcupadas: number | null;
    espacosMagiaDisponiveis: { nivelMagia: number, espaco: number }[] | null;
    espacosMagiaTotais: { nivelMagia: number, espaco: number }[] | null;
    magiasConhecidas: { classe: string, magias: number }[] | null;
    truquesConhecidos: { classe: string, magias: number }[] | null;
    magiasEscolhidas: { classe: string, magia: string[] }[] | null;
    metamagica1: { nome: string, descricao: string } | null;
    metamagica2: { nome: string, descricao: string } | null;
    metamagica3: { nome: string, descricao: string } | null;
    metamagica4: { nome: string, descricao: string } | null;
    ouro: number;
    prata: number;
    cobre: number;
    itensMochila: Itens[] | null;
    patrono: Patronos | null | undefined;

    constructor(data: Partial<Ficha> = {}) {
        this.id = data?.id ?? this.gerarIdUnico();
        this.nomePersonagem = data?.nomePersonagem ?? null;
        this.racaPrincipal = data?.racaPrincipal ?? null;
        this.subRaca = data?.subRaca ?? null;
        this.classePrincipal = data?.classePrincipal ?? null;
        this.subClasse = data?.subClasse ?? null;
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
        this.estiloLuta = data?.estiloLuta ?? null;
        this.animalSelecionado = data?.animalSelecionado ?? null;
        this.terrenoSelecionado = data?.terrenoSelecionado ?? null;
        this.efeitos = data?.efeitos ?? null;
        this.ArmadurasMochila = data?.ArmadurasMochila ?? null;
        this.ArmasMochila = data?.ArmasMochila ?? null;
        this.cA = data?.cA ?? null;
        this.vidaAtual = data.vidaAtual ?? null;
        this.ArmaduraEquipada = data?.ArmaduraEquipada ?? null;
        this.ArmaEquipada = data?.ArmaEquipada ?? null;
        this.escudoEquipado = data?.escudoEquipado ?? null;
        this.maosOcupadas = data?.maosOcupadas ?? null;
        this.magiasConhecidas = data?.magiasConhecidas ?? null;
        this.espacosMagiaDisponiveis = data?.espacosMagiaDisponiveis ?? null;
        this.espacosMagiaTotais = data?.espacosMagiaTotais ?? null;
        this.truquesConhecidos = data?.truquesConhecidos ?? null;
        this.magiasEscolhidas = data?.magiasEscolhidas ?? null;
        this.metamagica1 = data?.metamagica1 ?? null;
        this.metamagica2 = data?.metamagica2 ?? null;
        this.metamagica3 = data?.metamagica3 ?? null;
        this.metamagica4 = data?.metamagica4 ?? null;
        this.ouro = data?.ouro ?? 0;
        this.prata = data?.prata ?? 0;
        this.cobre = data?.cobre ?? 0;
        this.itensMochila = data?.itensMochila ?? null;
        this.patrono = data?.patrono ?? null;
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
        if (this.backGround?.proeficienciasHabilidades && raca?.pericia) {
            this.pericias = [...this.backGround?.proeficienciasHabilidades, ...raca?.pericia]
        } else if (!this.backGround?.proeficienciasHabilidades && raca?.pericia) {
            this.pericias = raca.pericia
        }
    }

    setSubRaca(subRaca: Raca | null) {
        this.subRaca = subRaca;
    }

    setClassePrincipal(classe: Classes | null) {
        this.classePrincipal = classe;
    }

    setSubClasse(classe: Classes, subClasse: SubClasses) {
        if (this.subClasse === null) {
            this.subClasse = [];
        }
        this.subClasse.push({ classe: classe, subclasse: subClasse });
    }

    removerSubClasse(id: string) {
        if (this.subClasse) this.subClasse = this.subClasse.filter(s => s.subclasse.id !== id);
    }

    setBackGround(backGround: BackGround | null) {
        this.backGround = backGround;
        if (backGround?.proeficienciasHabilidades && this.racaPrincipal?.pericia) {
            this.pericias = [...backGround?.proeficienciasHabilidades, ...this.racaPrincipal?.pericia]
        } else if (backGround?.proeficienciasHabilidades && !this.racaPrincipal?.pericia) {
            this.pericias = backGround.proeficienciasHabilidades
        }
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

    setPericia(pericia: string[] | null) {
        if (pericia) {
            this.pericias = [...(this.pericias || []), ...pericia];
        }
    }

    removerIPericia(pericia: string) {
        if (this.pericias) {
            this.pericias = this.pericias.filter((i) => i !== pericia);
        }
    }

    setPericias(pericias: string[]) {
        const periciasOrigem = this.backGround?.proeficienciasHabilidades ?? [];
        const periciasRaca = this.racaPrincipal?.pericia ?? [];
        const todasPericias = [...new Set([...periciasOrigem, ...periciasRaca, ...pericias])];
        this.pericias = todasPericias;
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
    setEstiloLuta(estilo: string, classe: string) {
        if (this.estiloLuta === null) {
            this.estiloLuta = []
        }
        this.estiloLuta.push({ estilo: estilo, classe: classe });
    }
    excluirEstiloLuta(classe: string) {
        if (this.estiloLuta) this.estiloLuta = this.estiloLuta?.filter(e => e.classe !== classe);
    }
    substituirOuAdicionarAnimal(animal: string, nivel: number) {
        if (!this.animalSelecionado) {
            this.animalSelecionado = [];
        }
        const index = this.animalSelecionado.findIndex((item) => item.nivel === nivel);

        if (index !== -1) {
            this.animalSelecionado[index].animal = animal;
        } else {
            this.animalSelecionado.push({ animal, nivel });
        }
    }
    excluirAnimal(nivel: number) {
        if (!this.animalSelecionado) {
            this.animalSelecionado = [];
        }
        this.animalSelecionado = this.animalSelecionado.filter((item) => item.nivel !== nivel);
    }
    setTerrenoSelecionado(terreno: string) {
        this.terrenoSelecionado = terreno;
    }
    removerTerreno() {
        this.terrenoSelecionado = null;
    }
    setEfeitos(efeitos: Efeitos) {
        if (this.efeitos === null) {
            this.efeitos = []
        }
        this.efeitos?.push(efeitos);
    }
    excluirEfeitoPorTitulo(titulo: string) {
        if (this.efeitos) {
            this.efeitos = this.efeitos?.filter(e => e.tituloEfeito !== titulo);
        }
    }
    excluirEfeitoPorNivel(nivel: number) {
        if (this.efeitos) {
            this.efeitos = this.efeitos?.filter(e => e.level !== nivel);
        }
    }
    setArmaMochila(arma: Armas) {
        if (!this.ArmasMochila) {
            this.ArmasMochila = [arma];
        } else {
            this.ArmasMochila = [...this.ArmasMochila, arma];
        }
    }
    excluirArmaMochila(idArma: string) {
        if (this.ArmasMochila) this.ArmasMochila = this.ArmasMochila.filter(s => s.id !== idArma);
    }
    setArmaduraMochila(armadura: Armaduras_equip) {
        if (!this.ArmadurasMochila) {
            this.ArmadurasMochila = [armadura];
        } else {
            this.ArmadurasMochila = [...this.ArmadurasMochila, armadura];
        }
    }
    excluirArmaduraMochila(idArmadura: string) {
        if (this.ArmadurasMochila) this.ArmadurasMochila = this.ArmadurasMochila.filter(s => s.id !== idArmadura);
    }
    setCA(cA: number) {
        this.cA = cA;
    }
    setVidaAtual(vidaAtual: number) {
        this.vidaAtual = vidaAtual;
    }
    setArmaduraEquipada(armadura: Armaduras_equip) {
        this.ArmaduraEquipada = armadura;
    }
    setDesequiparArmadura() {
        this.ArmaduraEquipada = null;
    }
    setEscudoEquipado(escudo: Armaduras_equip) {
        this.escudoEquipado = escudo;
    }
    setDesequiparEscudo() {
        this.escudoEquipado = null;
    }
    setEquiparArma(arma: Armas) {
        if (this.ArmaEquipada === null) {
            this.ArmaEquipada = [];
        }
        this.ArmaEquipada?.push(arma);
    }
    setDesequiparArma(arma: string) {
        if (this.ArmaEquipada) this.ArmaEquipada = this.ArmaEquipada.filter(a => a.id !== arma);
    }
    setMaosOcupadas(mao: number) {
        if (this.maosOcupadas === null) {
            this.maosOcupadas = 0;
        }
        this.maosOcupadas += mao;
    }
    setEspacosMagiaDisponiveis(magiasmulticlasse: { nivelMagia: number, espaco: number }[]) {
        this.espacosMagiaDisponiveis = magiasmulticlasse;
    }
    setEspacosMagiaTotais(magiasmulticlasse: { nivelMagia: number, espaco: number }[]) {
        this.espacosMagiaTotais = magiasmulticlasse;
    }
    setMagiasConhecidas(novasMagias: { classe: string, magias: number }[]) {
        if (this.magiasConhecidas === null) {
            this.magiasConhecidas = [];
        }

        novasMagias.forEach(novaMagia => {
            const index = this.magiasConhecidas?.findIndex(m => m.classe === novaMagia.classe) || 0;
            if (index !== -1) {
                if (this.magiasConhecidas) this.magiasConhecidas[index] = novaMagia;
            } else {
                if (this.magiasConhecidas) this.magiasConhecidas.push(novaMagia);
            }
        });
    }
    setTruquesConhecidas(novosTruques: { classe: string, magias: number }[]) {
        if (this.truquesConhecidos === null) {
            this.truquesConhecidos = [];
        }

        novosTruques.forEach(novoTruque => {
            const index = this.truquesConhecidos?.findIndex(t => t.classe === novoTruque.classe) || 0;
            if (index !== -1) {
                if (this.truquesConhecidos) this.truquesConhecidos[index] = novoTruque;
            } else {
                if (this.truquesConhecidos) this.truquesConhecidos.push(novoTruque);
            }
        });
    }
    setMagiaEscolhidas(magiasEscolhidas: { classe: string, magia: string }) {
        if (this.magiasEscolhidas === null) this.magiasEscolhidas = [{ classe: magiasEscolhidas.classe, magia: [] }];
        if (!this.magiasEscolhidas.some(m => m.classe === magiasEscolhidas.classe)) this.magiasEscolhidas.push({ classe: magiasEscolhidas.classe, magia: [] });
        if (!this.magiasEscolhidas.some(m => m.magia.some(mn => mn === magiasEscolhidas.magia))) this.magiasEscolhidas?.find(m => m.classe === magiasEscolhidas.classe)?.magia.push(magiasEscolhidas.magia);
    }
    excluirMagiaEscolhidas(magia: string) {
        this.magiasEscolhidas = this.magiasEscolhidas && this.magiasEscolhidas.map((item) => ({
            classe: item.classe,
            magia: item.magia.filter(m => m !== magia),
        }));
    }
    setMetamagicaSelecionada(nome: string, index: number) {
        if (index === 1) this.metamagica1 = { nome: nome, descricao: Metamagica.find(m => m.nome === nome)?.descricao || "" }
        if (index === 3) this.metamagica2 = { nome: nome, descricao: Metamagica.find(m => m.nome === nome)?.descricao || "" }
        if (index === 10) this.metamagica3 = { nome: nome, descricao: Metamagica.find(m => m.nome === nome)?.descricao || "" }
        if (index === 17) this.metamagica4 = { nome: nome, descricao: Metamagica.find(m => m.nome === nome)?.descricao || "" }
    }
    getMetamagica(index: number) {
        if (index === 1) return this.metamagica1?.nome;
        if (index === 3) return this.metamagica2?.nome;
        if (index === 10) return this.metamagica3?.nome;
        if (index === 17) return this.metamagica4?.nome;
    }
    adicionarOuro(quantidade: number) {
        this.ouro += quantidade;
    }
    adicionarPrata(quantidade: number) {
        this.prata += quantidade;
    }
    adicionarCobre(quantidade: number) {
        this.cobre += quantidade;
    }
    setItemMochila(item: Itens) {
        if (!this.itensMochila) {
            this.itensMochila = [item];
        } else {
            this.itensMochila = [...this.itensMochila, item];
        }
    }
    excluirItem(idItem: string) {
        if (this.itensMochila) this.itensMochila = this.itensMochila.filter(s => s.id !== idItem);
    }
    setPatrono(patrono: Patronos | null | undefined) {
        this.patrono = patrono;
    }
}