import { podeTerSubclasse } from './subclasseElegibilidade';
import { EscolhaMagia, adicionarMagia, removerMagia, selecionarEscolhasMagia, selecionarFontesConjuracao } from './fichaConjuracao';
import { chaveClasse, nivelDaClasse, niveisMetamagia, podeSelecionarClasse } from '../rulesets/progressao';
import { aplicarASI, arquivarEscolha, concluirDistribuicao, selecionarTalentoAvanco } from './escolhasProgressao';
import { EscolhaMetamagia, metamagiasNoNivel, selecionarMetamagia } from '../rulesets/metamagia';
import { BackGround } from "../classesPrincipais/BackGrounds.class";
import { Classes } from "../classesPrincipais/Classes.class";
import { Raca } from "../classesPrincipais/Raca.class";
import { Atributos } from "../classesPrincipais/Atributos.class";
import { Multiclasses } from "../classesPrincipais/Multiclasses";
import { SubClasses } from "../classesPrincipais/SubClasses";
import { Efeitos } from "../classesPrincipais/Efeitos";
import { Armaduras_equip } from "../equipamentos/Armaduras"
import { Armas } from "../equipamentos/Armas";
import { Itens } from "../../bibliotecas/Itens";
import { Patronos } from "../classesEspeciais/Patronos.class";
import { criarConcessoesTalento, talento2024 } from './talentos2024Utils';
import { resolverConteudo } from '../rulesets/conteudo';
import { calcularLimiteSintonizacao, extrairEfeitosDoItem } from "./fichaEfeitosUtils";
import { TipoEquipamento, equipamentoDoItem, itemMagicoVinculado, melhoriaCompativel, motivoBloqueioMelhoria, restaurarEquipamentosMagicos, sincronizarEstadoItensMagicos } from './fichaEquipamentosMagicos';

export class Ficha {
    especializacoesOficiais?: import('./fichaEspecializacao').Especializacao[];
    itensSintonizados?: string[];
    recursos: { slots: Record<string, number>; morte?: { sucessos?: number; falhas?: number } };
    inventarioAnterior?: unknown;
    getMaosOcupadas() {
        return (this.ArmaEquipada ?? []).reduce((n, a) => n + this.maosDaArma(a), 0) + (this.escudoEquipado ? 1 : 0);
    }
    maosDaArma(arma: Armas) { return /duas m[aã]os|two.handed/i.test(arma.propriedades ?? '') ? 2 : 1; }
    atualizarMaos() { this.maosOcupadas = this.getMaosOcupadas(); }
    setSintonizarItem(id: string, ativo: boolean) {
        const item = this.itensMochila?.find(i => i.id === id);
        if (!item?.sintonizavel) return false;
        const ids = this.getItensSintonizadosEquipados().map(i => i.id);
        if (ativo && !ids.includes(id) && ids.length >= calcularLimiteSintonizacao(this)) return false;
        this.itensSintonizados = ativo ? Array.from(new Set([...ids, id])) : ids.filter(i => i !== id);
        if (this.itensEquipados?.some(i => i.id === id)) this.sincronizarEfeitosItem(item);
        return true;
    }
    selecionarBaseEquipamentoMagico(id: string, baseNome: string) {
        const item = this.itensMochila?.find(i => i.id === id);
        if (!item?.equipamentoMagico || item.vinculoEquipamento || !item.equipamentoMagico.basesCompativeis?.includes(baseNome)) return false;
        item.equipamentoMagico = { ...item.equipamentoMagico, baseNome };
        restaurarEquipamentosMagicos(this);
        return !!item.vinculoEquipamento;
    }
    vincularItemMagico(idItem: string, tipo: TipoEquipamento, idEquipamento: string) {
        const item = this.itensMochila?.find(i => i.id === idItem);
        const equipamento = tipo === 'arma' ? this.ArmasMochila?.find(a => a.id === idEquipamento) : this.ArmadurasMochila?.find(a => a.id === idEquipamento);
        if (!item || !equipamento || !melhoriaCompativel(item, tipo, equipamento) || motivoBloqueioMelhoria(this, tipo, equipamento)) return false;
        if (item.vinculoEquipamento && (item.vinculoEquipamento.tipo !== tipo || item.vinculoEquipamento.id !== idEquipamento)) return false;
        const ocupado = itemMagicoVinculado(this, tipo, idEquipamento);
        if (ocupado && ocupado.id !== idItem) return false;
        item.vinculoEquipamento = { tipo, id: idEquipamento };
        sincronizarEstadoItensMagicos(this);
        return true;
    }
    desvincularItemMagico(idItem: string) {
        const item = this.itensMochila?.find(i => i.id === idItem);
        if (!item || item.equipamentoMagico?.modo !== 'melhoria') return false;
        delete item.vinculoEquipamento;
        sincronizarEstadoItensMagicos(this);
        return true;
    }

    magiasConjuracao?: EscolhaMagia[];
    escolhasAnteriores?: { tipo: string; valor: unknown }[];
    escolhasMetamagia?: EscolhaMetamagia[];
    idiomasLivres?: string[];
    idiomasBackground?: string[];
    atributosSelecionados?: string[];
    distribuicaoAtributos?: {
        metodo: string | null; atributos: Record<string, number>; valores: number[]; pontos: number;
        modo: "todos" | "dois"; maior: string; menor: string;
        gerados?: number[];
    };
    migracoes?: string[];
    subclassesAnteriores?: { classe: Classes, subclasse: SubClasses }[];
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
    itensEquipados: Itens[] | null;
    limiteSintonizacao: number;
    patrono: Patronos | null | undefined;
    versaoRegras: "DND_2014" | "DND_2024";

    constructor(data: Partial<Ficha> = {}) {
        this.especializacoesOficiais = data.especializacoesOficiais?.map(e => ({ ...e }));
        if (data.versaoRegras !== undefined && data.versaoRegras !== "DND_2014" && data.versaoRegras !== "DND_2024") {
            throw new Error(`Versão de regras não suportada: ${String(data.versaoRegras)}`);
        }
        this.itensSintonizados = data.itensSintonizados ?? [];
        this.recursos = data.recursos ?? { slots: {}, morte: { sucessos: 0, falhas: 0 } };
        this.inventarioAnterior = data.inventarioAnterior;
        this.idiomasLivres = data.idiomasLivres;
        this.idiomasBackground = data.idiomasBackground;
        this.magiasConjuracao = data.magiasConjuracao;
        this.escolhasAnteriores = data.escolhasAnteriores;
        this.escolhasMetamagia = data.escolhasMetamagia;
        this.atributosSelecionados = data.atributosSelecionados;
        this.distribuicaoAtributos = data.distribuicaoAtributos;
        this.migracoes = data.migracoes;
        this.subclassesAnteriores = data.subclassesAnteriores;
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
        this.talentos = data?.talentos ?? null;
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
        this.itensEquipados = data?.itensEquipados ?? null;
        this.limiteSintonizacao = data?.limiteSintonizacao ?? 3;
        this.patrono = data?.patrono ?? null;
        this.versaoRegras = data?.versaoRegras ?? "DND_2014";
    }

    calcularModificador(valor: number): number {
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
        if (this.speed === null || this.speed === this.racaPrincipal?.velocidade) this.speed = raca?.velocidade ?? null;
        const anteriores = this.racaPrincipal?.pericia ?? [];
        const fixasOrigem = this.backGround?.proeficienciasHabilidades ?? [];
        this.pericias = [...new Set([...(this.pericias ?? []).filter(p => !anteriores.includes(p) || fixasOrigem.includes(p)), ...fixasOrigem, ...(raca?.pericia ?? [])])];
        if (this.racaPrincipal?.nome !== raca?.nome) arquivarEscolha(this, 'raca', this.racaPrincipal);
        this.racaPrincipal = raca;
    }

    setSubRaca(subRaca: Raca | null) {
        this.subRaca = subRaca;
    }

    setClassePrincipal(classe: Classes | null) {
        this.classePrincipal = classe;
    }

    selecionarClasseNoNivel(classe: Classes, nivel: number) {
        if (!podeSelecionarClasse(this, classe, nivel)) return false;
        const anterior = this.multiclasses?.find(m => m.nivelEscolhido.includes(nivel));
        if (anterior && chaveClasse(anterior.classe) === chaveClasse(classe)) return true;
        if (anterior) {
            anterior.nivelEscolhido = anterior.nivelEscolhido.filter(n => n !== nivel);
            anterior.nivelClasse = anterior.nivelEscolhido.length;
            if (!anterior.nivelClasse) this.multiclasses = this.multiclasses?.filter(m => m.id !== anterior.id) ?? null;
            // Only explicit provenance authorizes invalidation. Legacy/manual effects
            // without an origin are retained rather than guessed from their position.
            this.efeitos = this.efeitos?.filter(e => !(e.classeNome === anterior.classe.nome &&
                ((e.origemTipo === 'nivel' && !e.nivelClasseOrigem && e.level === nivel) || (!anterior.nivelClasse && e.origemTipo === 'classe')))) ?? null;
            const entradaEstilo = anterior.classe.niveis?.find(n => n.caracteristicas?.some(c => c.includes('Estilo de Luta')))?.nivel;
            if (!anterior.nivelClasse || (entradaEstilo && anterior.nivelClasse < entradaEstilo)) this.excluirEstiloLuta(anterior.classe.nome);
            if (this.subClasse?.find(s => s.classe.nome === anterior.classe.nome)?.subclasse.nome === 'Caminho do Guerreiro Totêmico') {
                this.animalSelecionado = this.animalSelecionado?.filter(a => a.nivel <= anterior.nivelClasse) ?? null;
            }
            if (!podeTerSubclasse(anterior.classe.nome, anterior.nivelClasse, this.versaoRegras)) {
                const sub = this.subClasse?.find(s => s.classe.nome === anterior.classe.nome);
                if (sub) this.removerSubClasse(sub.subclasse.id);
            }
        }
        const destino = this.multiclasses?.find(m => chaveClasse(m.classe) === chaveClasse(classe));
        if (destino) {
            destino.nivelEscolhido = [...destino.nivelEscolhido, nivel].sort((a, b) => a - b);
            destino.nivelClasse = destino.nivelEscolhido.length;
        } else {
            this.multiclasses = [...(this.multiclasses ?? []), new Multiclasses(classe, 1, nivel)];
            const efeito = new Efeitos();
            efeito.setProeficienciasMulticlasse(classe.proficienciaMulticlasse ?? []);
            efeito.setLevel(nivel);
            efeito.setTituloEfeito(classe.nome);
            efeito.setClasseNome(classe.nome);
            efeito.origemTipo = 'classe';
            efeito.origemId = classe.nome;
            this.setEfeitos(efeito);
        }
        this.efeitos = this.efeitos?.filter(e => {
            if (e.origemTipo !== 'nivel' || !e.nivelClasseOrigem || ![classe.nome, anterior?.classe.nome].includes(e.classeNome)) return true;
            const niveis = this.multiclasses?.find(m => m.classe.nome === e.classeNome)?.nivelEscolhido.slice().sort((a, b) => a - b) ?? [];
            const destino = niveis[e.nivelClasseOrigem - 1];
            if (destino === undefined) { arquivarEscolha(this, 'efeito-nivel', e); return false; }
            if (/^(selecionadoAtributo|selecionadoTalento|TalentoEscolhido|atributo[12]Classe)/.test(e.tituloEfeito)) {
                e.tituloEfeito = e.tituloEfeito.replace(/\d+$/, String(destino));
            }
            e.setLevel(destino);
            return true;
        }) ?? null;
        if (nivel === 1) this.classePrincipal = classe;
        return true;
    }

    aplicarAumentoAtributos(nivel: number, escolhas: string[]) { return aplicarASI(this, nivel, escolhas); }
    concluirAtributos() { return concluirDistribuicao(this); }
    selecionarTalentoAvanco(nivel: number, nome: string, escolhas: import('./talentosConteudo').EscolhasSelecaoTalento = []) { return selecionarTalentoAvanco(this, nivel, nome, escolhas); }
    selecionarMetamagia(nivelClasse: number, slot: number, nome: string) { return selecionarMetamagia(this, nivelClasse, slot, nome); }

    setSubClasse(classe: Classes, subClasse: SubClasses) {
        const anteriores = (this.subClasse ?? []).filter(s => s.classe.nome === classe.nome);
        for (const anterior of anteriores) {
            if (anterior.subclasse.id !== subClasse.id) this.removerSubClasse(anterior.subclasse.id);
        }
        this.subClasse = [...(this.subClasse ?? []).filter(s => s.classe.nome !== classe.nome), { classe, subclasse: subClasse }];
    }

    removerSubClasse(id: string) {
        arquivarEscolha(this, 'subclasse', this.subClasse?.find(s => s.subclasse.id === id));
        const anterior = this.subClasse?.find(s => s.subclasse.id === id)?.subclasse;
        if (anterior?.nome === 'C?rculo da Terra') this.removerTerreno();
        if (anterior?.nome === 'Caminho do Guerreiro Totêmico') this.animalSelecionado = [];
        this.excluirEfeitoPorOrigem("subclasse", id);
        if (this.subClasse) this.subClasse = this.subClasse.filter(s => s.subclasse.id !== id);
    }

    setBackGround(backGround: BackGround | null) {
        if (this.versaoRegras === 'DND_2014') {
            const outrasFontesIdioma = [...(this.idiomasLivres ?? []), ...(this.racaPrincipal?.idiomas ?? []), ...(this.subRaca?.idiomas ?? []), ...(nivelDaClasse(this, 'ladino') > 0 ? ['Gíria de Ladrões'] : [])];
            this.idiomas = (this.idiomas ?? []).filter(i => !this.idiomasBackground?.includes(i) || outrasFontesIdioma.includes(i));
            this.idiomasBackground = backGround?.nome === 'Membro da Guilda dos Ladrões das Sombras' ? ['Gíria de Ladrões'] : [];
            this.idiomas = [...new Set([...this.idiomas, ...this.idiomasBackground])];
        }
        const anteriores = this.backGround?.proeficienciasHabilidades ?? [];
        const fixasRaca = [...(this.racaPrincipal?.pericia ?? []), ...(this.subRaca?.pericia ?? [])];
        const outrasFontes = (this.efeitos ?? []).filter(e => e.tituloEfeito !== 'background').flatMap(e => [e.pericia, ...(e.proeficienciasClasse ?? []), ...(e.proeficienciasRaca ?? []), ...(e.proeficienciasBackGround ?? []), ...(e.proficienciasMulticlasse ?? []), ...(Array.isArray(e.escolhasTalento) ? e.escolhasTalento : [])]);
        this.pericias = [...new Set([...(this.pericias ?? []).filter(p => !anteriores.includes(p) || fixasRaca.includes(p) || outrasFontes.includes(p)), ...fixasRaca, ...(backGround?.proeficienciasHabilidades ?? [])])];
        if (this.backGround?.nome !== backGround?.nome) arquivarEscolha(this, 'origem', this.backGround);
        this.backGround = backGround;
    }

    setAtributosPersonagem(atributos: Atributos | null) {
        this.atributosPersonagem = atributos;
        this.setIniciativa(atributos?.destreza.valor || null);
    }

    setIniciativa(destreza: number | null) {
        if (destreza === null) {
            this.iniciativa = null;
            return;
        }
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
        const conteudo = efeitos.conteudo && resolverConteudo(efeitos.conteudo);
        if ((efeitos.escolhasTalento2024 || (efeitos.escolhasTalento && !Array.isArray(efeitos.escolhasTalento))) && talento2024(efeitos.talento) && (!efeitos.conteudo || (conteudo && 'phb' in conteudo && conteudo.phb))) {
            this.efeitos?.push(...criarConcessoesTalento(efeitos, this).map(e => Object.assign(e, {
                conteudo: efeitos.conteudo, classeNome: efeitos.classeNome, nivelClasseOrigem: efeitos.nivelClasseOrigem,
            })));
        }
    }
    excluirEfeitoPorTitulo(titulo: string) {
        if (this.efeitos) {
            this.efeitos = this.efeitos?.filter(e => e.tituloEfeito !== titulo && !(e.origemTipo === 'talento2024' && e.origemId === titulo));
        }
    }
    excluirEfeitoPorNivel(nivel: number) {
        if (this.efeitos) {
            this.efeitos = this.efeitos?.filter(e => e.level !== nivel);
        }
    }
    excluirEfeitoPorOrigem(origemTipo: string, origemId: string) {
        if (this.efeitos) {
            this.efeitos = this.efeitos.filter(e => !(e.origemTipo === origemTipo && e.origemId === origemId));
        }
    }
    setArmaMochila(arma: Armas) {
        arma = Object.assign(Object.create(Object.getPrototypeOf(arma)), arma);
        while (this.ArmasMochila?.some(i => i.id === arma.id)) arma.id = this.gerarIdUnico();
        if (!this.ArmasMochila) {
            this.ArmasMochila = [arma];
        } else {
            this.ArmasMochila = [...this.ArmasMochila, arma];
        }
    }
    excluirArmaMochila(idArma: string) {
        const magico = itemMagicoVinculado(this, 'arma', idArma);
        if (magico?.equipamentoMagico?.modo === 'especifico') { this.excluirItem(magico.id); return; }
        if (magico) this.desvincularItemMagico(magico.id);
        this.setDesequiparArma(idArma);
        if (this.ArmasMochila) this.ArmasMochila = this.ArmasMochila.filter(s => s.id !== idArma);
    }
    setArmaduraMochila(armadura: Armaduras_equip) {
        armadura = Object.assign(Object.create(Object.getPrototypeOf(armadura)), armadura);
        while (this.ArmadurasMochila?.some(i => i.id === armadura.id)) armadura.id = this.gerarIdUnico();
        if (!this.ArmadurasMochila) {
            this.ArmadurasMochila = [armadura];
        } else {
            this.ArmadurasMochila = [...this.ArmadurasMochila, armadura];
        }
    }
    excluirArmaduraMochila(idArmadura: string) {
        const magico = itemMagicoVinculado(this, 'armadura', idArmadura);
        if (magico?.equipamentoMagico?.modo === 'especifico') { this.excluirItem(magico.id); return; }
        if (magico) this.desvincularItemMagico(magico.id);
        if (this.ArmaduraEquipada?.id === idArmadura) this.setDesequiparArmadura();
        if (this.escudoEquipado?.id === idArmadura) this.setDesequiparEscudo();
        if (this.ArmadurasMochila) this.ArmadurasMochila = this.ArmadurasMochila.filter(s => s.id !== idArmadura);
    }
    setCA(cA: number) {
        this.cA = cA;
    }
    setVidaAtual(vidaAtual: number) {
        this.vidaAtual = vidaAtual;
    }
    setArmaduraEquipada(armadura: Armaduras_equip) {
        this.ArmaduraEquipada = this.ArmadurasMochila?.find(a => a.id === armadura.id) ?? this.ArmaduraEquipada;
        sincronizarEstadoItensMagicos(this);
    }
    setDesequiparArmadura() {
        this.ArmaduraEquipada = null;
        sincronizarEstadoItensMagicos(this);
    }
    setEscudoEquipado(escudo: Armaduras_equip) {
        const item = this.ArmadurasMochila?.find(a => a.id === escudo.id);
        if (!item || this.getMaosOcupadas() - (this.escudoEquipado ? 1 : 0) + 1 > 2) return false;
        this.escudoEquipado = item;
        this.atualizarMaos();
        sincronizarEstadoItensMagicos(this);
        return true;
    }
    setDesequiparEscudo() { this.escudoEquipado = null; this.atualizarMaos(); sincronizarEstadoItensMagicos(this); }
    setEquiparArma(arma: Armas) {
        const item = this.ArmasMochila?.find(a => a.id === arma.id);
        if (!item) return false;
        if (this.ArmaEquipada?.some(a => a.id === item.id)) return true;
        if (this.getMaosOcupadas() + this.maosDaArma(item) > 2) return false;
        this.ArmaEquipada = [...(this.ArmaEquipada ?? []), item];
        this.atualizarMaos();
        sincronizarEstadoItensMagicos(this);
        return true;
    }
    setDesequiparArma(id: string) {
        this.ArmaEquipada = this.ArmaEquipada?.filter(a => a.id !== id) ?? null;
        this.atualizarMaos();
        sincronizarEstadoItensMagicos(this);
    }
    // Compatibility entry point: the old increment is deliberately ignored.
    setMaosOcupadas(_mao: number) { this.atualizarMaos(); }
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
    setMagiaEscolhidas(escolha: { classe: string, magia: string, fonte?: string }) {
        const fontes = selecionarFontesConjuracao(this).filter(f => chaveClasse(f.classe) === chaveClasse(escolha.classe));
        const fonte = escolha.fonte ?? (fontes.length === 1 ? fontes[0].id : undefined);
        return fonte ? adicionarMagia(this, fonte, escolha.magia) : 'Escolha uma fonte de conjuração válida.';
    }
    excluirMagiaEscolhidas(magia: string, fonte?: string) {
        const escolhas = selecionarEscolhasMagia(this).filter(e => e.nome === magia && (!fonte || e.fonte === fonte));
        if (escolhas.length !== 1) return false;
        removerMagia(this, escolhas[0].id);
        return true;
    }
    setMetamagicaSelecionada(nome: string, index: number) {
        const slot = [1, 3, 10, 17].indexOf(index);
        return slot >= 0 && this.selecionarMetamagia(niveisMetamagia(this.versaoRegras)[slot], slot, nome);
    }
    getMetamagica(index: number) {
        if (this.escolhasMetamagia) return metamagiasNoNivel(this, nivelDaClasse(this, 'feiticeiro')).find(e => e.slot === [1, 3, 10, 17].indexOf(index))?.nome;
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
        item = Object.assign(Object.create(Object.getPrototypeOf(item)), item);
        if (item.equipamentoMagico) item.equipamentoMagico = JSON.parse(JSON.stringify(item.equipamentoMagico));
        delete item.vinculoEquipamento;
        delete item.requisitosSintonizacaoConfirmados;
        while (this.itensMochila?.some(i => i.id === item.id)) item.id = this.gerarIdUnico();
        if (!this.itensMochila) {
            this.itensMochila = [item];
        } else {
            this.itensMochila = [...this.itensMochila, item];
        }
        restaurarEquipamentosMagicos(this);
    }
    excluirItem(idItem: string) {
        const item = this.itensMochila?.find(i => i.id === idItem);
        const representacao = item?.equipamentoMagico?.modo === 'especifico' ? item.vinculoEquipamento : undefined;
        if (item?.vinculoEquipamento) delete item.vinculoEquipamento;
        this.itensSintonizados = this.itensSintonizados?.filter(id => id !== idItem);
        this.excluirEfeitoPorOrigem("item", idItem);
        if (this.itensMochila) this.itensMochila = this.itensMochila.filter(s => s.id !== idItem);
        if (this.itensEquipados?.some(item => item.id === idItem)) {
            this.setDesequiparItem(idItem);
        }
        if (representacao?.tipo === 'arma') this.excluirArmaMochila(representacao.id);
        if (representacao?.tipo === 'armadura') this.excluirArmaduraMochila(representacao.id);
    }
    setLimiteSintonizacao(limite: number) {
        this.limiteSintonizacao = limite;
    }
    getItensSintonizadosEquipados() {
        return this.itensMochila?.filter(item => item.sintonizavel && this.itensSintonizados?.includes(item.id)) ?? [];
    }
    setEquiparItem(item: Itens) {
        item = this.itensMochila?.find(i => i.id === item.id) as Itens;
        if (!item) return false;
        if (item.equipamentoMagico) {
            const equipamento = equipamentoDoItem(this, item);
            if (!equipamento || !item.vinculoEquipamento) return false;
            if (item.vinculoEquipamento.tipo === 'arma') return this.setEquiparArma(equipamento as Armas);
            if (item.equipamentoMagico.tipo === 'escudo') return this.setEscudoEquipado(equipamento as Armaduras_equip);
            this.setArmaduraEquipada(equipamento as Armaduras_equip);
            return true;
        }
        if (!this.itensEquipados) {
            this.itensEquipados = [];
        }
        if (!this.itensEquipados.some(i => i.id === item.id)) {
            this.itensEquipados.push(item);
        }
        this.sincronizarEfeitosItem(item);
        return true;
    }
    setDesequiparItem(idItem: string) {
        const vinculado = this.itensMochila?.find(i => i.id === idItem);
        if (vinculado?.equipamentoMagico && vinculado.vinculoEquipamento) {
            const v = vinculado.vinculoEquipamento;
            if (v.tipo === 'arma') this.setDesequiparArma(v.id);
            else if (this.ArmaduraEquipada?.id === v.id) this.setDesequiparArmadura();
            else if (this.escudoEquipado?.id === v.id) this.setDesequiparEscudo();
        }
        this.itensSintonizados = this.itensSintonizados?.filter(id => id !== idItem);
        const item = this.itensEquipados?.find(i => i.id === idItem);
        if (this.itensEquipados) {
            this.itensEquipados = this.itensEquipados.filter(i => i.id !== idItem);
        }
        if (item) {
            const salvos = this.efeitos?.filter(e => e.origemTipo === 'item' && e.origemId === item.id) ?? [];
            const legados = salvos.filter(e => !e.id.startsWith(`item:${item.id}:`));
            if (item.efeitosExplicitos === undefined && legados.length) item.efeitosExplicitos = legados;
            this.excluirEfeitoPorOrigem("item", item.id);
        }
    }
    sincronizarEfeitosItem(item: Itens) {
        const salvos = this.efeitos?.filter(e => e.origemTipo === 'item' && e.origemId === item.id) ?? [];
        const legados = salvos.filter(e => !e.id.startsWith(`item:${item.id}:`));
        if (item.efeitosExplicitos === undefined && legados.length) item.efeitosExplicitos = legados;
        this.excluirEfeitoPorOrigem("item", item.id);
        const ativo = this.itensEquipados?.some(i => i.id === item.id) && (!item.sintonizavel || this.itensSintonizados?.includes(item.id));
        const efeitosItem = ativo ? extrairEfeitosDoItem(item) : [];
        efeitosItem.forEach((efeito) => this.setEfeitos(efeito));
    }
    setPatrono(patrono: Patronos | null | undefined) {
        if (this.versaoRegras !== 'DND_2014') return false;
        if (nivelDaClasse(this, 'bruxo') < 1 && (!this.classePrincipal || chaveClasse(this.classePrincipal) !== 'bruxo' || (this.levelTotal ?? 0) < 1)) return false;
        if (patrono?.nome !== this.patrono?.nome) {
            arquivarEscolha(this, 'patrono', this.patrono);
            if (this.patrono) this.excluirEfeitoPorOrigem('patrono', this.patrono.nome);
        }
        this.patrono = patrono;
        return true;
    }
}
