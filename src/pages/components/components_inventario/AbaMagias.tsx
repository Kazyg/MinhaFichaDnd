import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ModalSelecaoMagias from "../../modals/ModalMagias.tsx";
import "../../css/Magias.css"
import { toast } from "react-toastify";
import { useFicha } from "../../../api/fichaPersonagem/FichaContext.tsx";
import { Bruxo } from "../../../api/classesClassesFilhos/Bruxo.class.ts";
import { Clerigo } from "../../../api/classesClassesFilhos/Clerigo.class.ts"
import { Druida } from "../../../api/classesClassesFilhos/Druida.class.ts"
import { Feiticeiro } from "../../../api/classesClassesFilhos/Feiticeiro.class.ts"
import { Lutador } from "../../../api/classesClassesFilhos/Lutador.class.ts"
import { Rogue } from "../../../api/classesClassesFilhos/Rogue.class.ts"
import { Mago } from "../../../api/classesClassesFilhos/Mago.class.ts"
import { Paladino } from "../../../api/classesClassesFilhos/Paladino.class.ts"
import { Ranger } from "../../../api/classesClassesFilhos/Ranger.class.ts"
import { CavaleiroArcano } from "../../../api/classesClassesNetos/CavaleiroArcano.ts";
import { TrapaceiroArcano } from "../../../api/classesClassesNetos/TrapaceiroArcano.ts";
import magiaFire from "../../../imagens/darkFireMagia.png"
import magiaIcon from "../../../imagens/local_fire_department_24dp_B7B7B7_FILL0_wght400_GRAD0_opsz24.png"
import excluirIcon from "../../../imagens/delete_icon.png"
import magiaIcon1 from "../../../imagens/local_fire_department_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.png"
import { magiasBardo, magiasBruxo, magiasClerigo, magiasDruida, magiasFeiticeiro, magiasMago, magiasPaladino, magiasPatrulheiro, Magias } from "../../../bibliotecas/Magia.ts"
import { Classes } from "../../../api/classesPrincipais/Classes.class.ts";

export default function AbaMagias() {
  const [modalMagiasAberta, setModalMagiasAberta] = useState(false);
  const [modalInfoMagiasAberta, setModalInfoMagiasAberta] = useState(false);
  const [magiaInfo, setMagiaInfo] = useState("");
  const { ficha, refreshKey, forceUpdate } = useFicha();
  const [magiaAtiva, setMagiasAtivas] = useState<boolean[]>(() =>
    new Array(3/*magias.length*/).fill(false)
  );
  const [niveisExpandidos, setNiveisExpandidos] = useState<Record<number, boolean>>({});
  const [espacosAtivos, setEspacosAtivos] = useState<Record<string, boolean>>({});

  const handleUsarMagia = (index: number) => {
    setMagiasAtivas((prev) => {
      const novoEstado = [...prev];
      novoEstado[index] = !novoEstado[index];
      return novoEstado;
    });
  };
  const toggleNivelExpandido = (nivel: number) => {
    setNiveisExpandidos(prev => ({
      ...prev,
      [nivel]: !prev[nivel]
    }));
  };
  const toggleEspacoAtivo = (nivel: number, index: number) => {
    const key = `nivel-${nivel}-index-${index}`;
    setEspacosAtivos(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 1, delay: i * 0.2, ease: "easeOut" }
    })
  };

  const calcularModificador = (valor) => Math.floor((valor - 10) / 2);

  const tabelaConjuradores = [
    {
      nivel: 1, espacos: [
        { nivelMagia: 1, espaco: 2 }, { nivelMagia: 2, espaco: 0 }, { nivelMagia: 3, espaco: 0 },
        { nivelMagia: 4, espaco: 0 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 2, espacos: [
        { nivelMagia: 1, espaco: 3 }, { nivelMagia: 2, espaco: 0 }, { nivelMagia: 3, espaco: 0 },
        { nivelMagia: 4, espaco: 0 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 3, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 2 }, { nivelMagia: 3, espaco: 0 },
        { nivelMagia: 4, espaco: 0 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 4, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 0 },
        { nivelMagia: 4, espaco: 0 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 5, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 2 },
        { nivelMagia: 4, espaco: 0 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 6, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 0 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 7, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 1 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 8, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 2 }, { nivelMagia: 5, espaco: 0 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 9, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 1 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 10, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 0 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 11, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 12, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 0 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 13, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 14, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 0 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 15, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 1 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 16, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 1 }, { nivelMagia: 9, espaco: 0 }
      ]
    },
    {
      nivel: 17, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 2 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 1 }, { nivelMagia: 9, espaco: 1 }
      ]
    },
    {
      nivel: 18, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 3 }, { nivelMagia: 6, espaco: 1 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 1 }, { nivelMagia: 9, espaco: 1 }
      ]
    },
    {
      nivel: 19, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 3 }, { nivelMagia: 6, espaco: 2 },
        { nivelMagia: 7, espaco: 1 }, { nivelMagia: 8, espaco: 1 }, { nivelMagia: 9, espaco: 1 }
      ]
    },
    {
      nivel: 20, espacos: [
        { nivelMagia: 1, espaco: 4 }, { nivelMagia: 2, espaco: 3 }, { nivelMagia: 3, espaco: 3 },
        { nivelMagia: 4, espaco: 3 }, { nivelMagia: 5, espaco: 3 }, { nivelMagia: 6, espaco: 2 },
        { nivelMagia: 7, espaco: 2 }, { nivelMagia: 8, espaco: 1 }, { nivelMagia: 9, espaco: 1 }
      ]
    }
  ];

  const todasMagiasPorClasse = {
    Bardo: magiasBardo,
    Bruxo: magiasBruxo,
    Clerigo: magiasClerigo,
    Druida: magiasDruida,
    Feiticeiro: magiasFeiticeiro,
    Mago: magiasMago,
    Paladino: magiasPaladino,
    Patrulheiro: magiasPatrulheiro
  };

  function buscarMagiaNaClasse(nomeMagia: string, classe: keyof typeof todasMagiasPorClasse) {
    return todasMagiasPorClasse[classe]?.find(m => m.nome === nomeMagia);
  }

  const agruparMagiasPorNivel = () => {
    const magiasAgrupadas: Record<number, { nome: string, classe: string }[]> = {};

    ficha?.magiasEscolhidas?.forEach(magiaEscolhida => {
      let classe;
      switch (magiaEscolhida.classe) {
        case "Bardo": classe = "Bardo";
          break;
        case "Bruxo": classe = "Bruxo";
          break;
        case "Clerigo": classe = "Clerigo";
          break;
        case "Druida": classe = "Druida";
          break;
        case "Feiticeiro": classe = "Feiticeiro";
          break;
        case "Mago": classe = "Mago";
          break;
        case "Paladino": classe = "Paladino";
          break;
        case "Patrulheiro": classe = "Patrulheiro";
          break;
      }
      magiaEscolhida.magia.forEach(magiaNome => {
        const magiaInfo = buscarMagiaNaClasse(magiaNome, classe);
        if (magiaInfo) {
          const nivel = magiaInfo.nivel;
          if (!magiasAgrupadas[nivel]) {
            magiasAgrupadas[nivel] = [];
          }
          magiasAgrupadas[nivel].push({
            nome: magiaNome,
            classe: magiaEscolhida.classe
          });
        }
      });
    });

    return magiasAgrupadas;
  };

  function hidratarClasse(classeData: any): Classes {
    switch (classeData.nome) {
      case 'Bruxo':
        return Object.assign(new Bruxo(), classeData);

      case 'Clerigo':
        return Object.assign(new Clerigo(), classeData);

      case 'Druida':
        return Object.assign(new Druida(), classeData);

      case 'Feiticeiro':
        return Object.assign(new Feiticeiro(), classeData);

      case 'Lutador':
        return Object.assign(new Lutador(), classeData);

      case 'Rogue':
        return Object.assign(new Rogue(), classeData);

      case 'Mago':
        return Object.assign(new Mago(), classeData);

      case 'Paladino':
        return Object.assign(new Paladino(), classeData);

      case 'Ranger':
        return Object.assign(new Ranger(), classeData);

      default:
        return classeData;
    }
  }

  function calcularMagiasConhecidas() {
    debugger;
    let magiasConhecidas: { classe: string, magias: number }[] = [];
    let truqueConhecidos: { classe: string, magias: number }[] = [];
    if (ficha) {
      const { levelTotal, multiclasses, atributosPersonagem, efeitos } = ficha;
      let tamanhoArrayClasses = multiclasses?.length || 0;
      if (levelTotal && multiclasses) for (let quantClasses = 1; quantClasses <= tamanhoArrayClasses; quantClasses++) {
        const classeNoNivel = hidratarClasse(multiclasses[quantClasses -1].classe);
        let nivelClasse = 0;
        const niveisEscolhidos = ficha?.multiclasses?.find(m => m.classe.nome === classeNoNivel?.nome)?.nivelEscolhido.sort((a, b) => a - b) ?? [];

        for (const nivel of niveisEscolhidos) {
          if (nivel <= nivel) {
            nivelClasse++;
          } else {
            break;
          }
        }

        if (classeNoNivel instanceof Bruxo) {
          magiasConhecidas.push({ classe: "Bruxo", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.magiasConhecidas ?? 0 });
          truqueConhecidos.push({ classe: "Bruxo", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.truquesConhecidos ?? 0 });
        }
        if (classeNoNivel instanceof Clerigo) {
          let magiaClerigo = 0
          let sabedoriaAtual = atributosPersonagem?.sabedoria.valor;
          const efeitosSabedoria = efeitos?.filter((e: any) => e.atributo === "sabedoria");
          if (efeitosSabedoria) if (efeitosSabedoria.length > 0) {
            const bonusSabedoria = efeitosSabedoria.reduce((acc: number, e: any) => acc + e.bonus, 0);
            if (sabedoriaAtual) sabedoriaAtual += bonusSabedoria;
          }
          magiaClerigo = calcularModificador(sabedoriaAtual) + nivelClasse;
          magiasConhecidas.push({ classe: "Clerigo", magias: magiaClerigo });
          truqueConhecidos.push({ classe: "Clerigo", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.truquesConhecidos ?? 0 });
        }
        if (classeNoNivel instanceof Druida) {
          let magiaDruida = 0
          let sabedoriaAtual = atributosPersonagem?.sabedoria.valor;
          const efeitosSabedoria = efeitos?.filter((e: any) => e.atributo === "sabedoria");
          if (efeitosSabedoria) if (efeitosSabedoria.length > 0) {
            const bonusSabedoria = efeitosSabedoria.reduce((acc: number, e: any) => acc + e.bonus, 0);
            if (sabedoriaAtual) sabedoriaAtual += bonusSabedoria;
          }
          magiaDruida = calcularModificador(sabedoriaAtual) + nivelClasse;
          magiasConhecidas.push({ classe: "Druida", magias: magiaDruida });
          truqueConhecidos.push({ classe: "Druida", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.truquesConhecidos ?? 0 });
        }
        if (classeNoNivel instanceof Feiticeiro) {
          magiasConhecidas.push({ classe: "Feiticeiro", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.magiasConhecidas ?? 0 });
          truqueConhecidos.push({ classe: "Feiticeiro", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.truquesConhecidos ?? 0 });
        }
        if (classeNoNivel instanceof Lutador) {
          let subClasse = ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel.nome)?.subclasse;
          if (subClasse instanceof CavaleiroArcano) {
            magiasConhecidas.push({ classe: "Lutador", magias: subClasse.magiasEspacos.find(m => m.nivel === nivelClasse)?.magias ?? 0 });
            truqueConhecidos.push({ classe: "Lutador", magias: subClasse.magiasEspacos.find(m => m.nivel === nivelClasse)?.truques ?? 0 });
          }
        }
        if (classeNoNivel instanceof Rogue) {
          let subClasse = ficha?.subClasse?.find(s => s.classe.nome === classeNoNivel.nome)?.subclasse;
          if (subClasse instanceof TrapaceiroArcano) {
            magiasConhecidas.push({ classe: "Ladino", magias: subClasse.magiasEspacos.find(m => m.nivel === nivelClasse)?.magias ?? 0 });
            truqueConhecidos.push({ classe: "Ladino", magias: subClasse.magiasEspacos.find(m => m.nivel === nivelClasse)?.truques ?? 0 });
          }
        }
        if (classeNoNivel instanceof Mago) {
          let magiaMago = 0
          let inteligenciaAtual = atributosPersonagem?.sabedoria.valor;
          const efeitosInteligencia = efeitos?.filter((e: any) => e.atributo === "inteligência");
          if (efeitosInteligencia) if (efeitosInteligencia.length > 0) {
            const bonusInteligencia = efeitosInteligencia.reduce((acc: number, e: any) => acc + e.bonus, 0);
            if (inteligenciaAtual) inteligenciaAtual += bonusInteligencia;
          }
          magiaMago = calcularModificador(inteligenciaAtual) + nivelClasse;
          magiasConhecidas.push({ classe: "Mago", magias: magiaMago });
          truqueConhecidos.push({ classe: "Mago", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.truquesConhecidos ?? 0 });
        }

        if (classeNoNivel instanceof Paladino) {
          let magiaPaladino = 0
          let carismaAtual = atributosPersonagem?.carisma.valor;
          const efeitosCarisma = efeitos?.filter((e: any) => e.atributo === "carisma");
          if (efeitosCarisma) if (efeitosCarisma.length > 0) {
            const bonusInteligencia = efeitosCarisma.reduce((acc: number, e: any) => acc + e.bonus, 0);
            if (carismaAtual) carismaAtual += bonusInteligencia;
          }
          magiaPaladino = calcularModificador(carismaAtual) + nivelClasse;
          magiasConhecidas.push({ classe: "Paladino", magias: magiaPaladino });
          truqueConhecidos.push({ classe: "Paladino", magias: 0 });
        }
        if (classeNoNivel instanceof Ranger) {
          magiasConhecidas.push({ classe: "Patrulheiro", magias: classeNoNivel.niveis.find(n => n.nivel === nivelClasse)?.magiasConhecidas ?? 0 });
          truqueConhecidos.push({ classe: "Patrulheiro", magias: 0 });
        }
      }
    }
    ficha?.setMagiasConhecidas(magiasConhecidas);
    ficha?.setTruquesConhecidas(truqueConhecidos);
  }

  const getEspacosPorNivel = (nivelMagia: number) => {
    calcularEspacosMagia();
    return ficha?.espacosMagiaTotais?.find(e => e.nivelMagia === nivelMagia)?.espaco || 0;
  };

  function calcularEspacosMagia() {
    let levelConjurador = 0;
    if (ficha) {
      const { levelTotal, multiclasses, atributosPersonagem, efeitos } = ficha;
      multiclasses?.map((multiclasse) => {

        let nivelClasse = 0;
        const niveisEscolhidos = multiclasse?.nivelEscolhido.sort((a, b) => a - b) ?? [];

        for (const nivel of niveisEscolhidos) {
          if (nivel <= (levelTotal || 0)) {
            nivelClasse++;
          } else {
            break;
          }
        }
        if ((multiclasse?.classe.nome === "Bardo") ||
          (multiclasse?.classe.nome === "Clerigo") ||
          (multiclasse?.classe.nome === "Druida") ||
          (multiclasse?.classe.nome === "Feiticeiro") ||
          (multiclasse?.classe.nome === "Mago")) {
          levelConjurador += nivelClasse;
        }
        if ((multiclasse?.classe.nome === "Paladino") ||
          (multiclasse?.classe.nome === "Patrulheiro")) {
          levelConjurador += Math.floor(nivelClasse / 2);
        }
        if ((multiclasse?.classe.nome === "Lutador" && ficha.subClasse?.find(s => s.classe.nome === multiclasse.classe.nome)?.subclasse instanceof CavaleiroArcano) ||
          (multiclasse?.classe.nome === "Ladino" && ficha.subClasse?.find(s => s.classe.nome === multiclasse.classe.nome)?.subclasse instanceof TrapaceiroArcano)) {
          levelConjurador += Math.floor(nivelClasse / 3);
        }

      })
    }
    ficha?.setEspacosMagiaTotais(tabelaConjuradores.find(t => t.nivel === levelConjurador)?.espacos || [{ nivelMagia: 0, espaco: 0 }])
  }

  function validarMagiaClasse(magia: string) {
    let classe = [""];
    let magiaAchada;
    if (!!magiasBardo.find(m => m.nome === magia)) {
      classe.push("Bardo");
      magiaAchada = magiasBardo.find(m => m.nome === magia);
    }
    if (!!magiasBruxo.find(m => m.nome === magia)) {
      classe.push("Bruxo");
      magiaAchada = magiasBruxo.find(m => m.nome === magia);
    }
    if (!!magiasClerigo.find(m => m.nome === magia)) {
      classe.push("Clerigo");
      magiaAchada = magiasClerigo.find(m => m.nome === magia);
    }
    if (!!magiasDruida.find(m => m.nome === magia)) {
      classe.push("Druida");
      magiaAchada = magiasDruida.find(m => m.nome === magia);
    }
    if (!!magiasFeiticeiro.find(m => m.nome === magia)) {
      classe.push("Feiticeiro");
      magiaAchada = magiasFeiticeiro.find(m => m.nome === magia);
    }
    if (!!magiasMago.find(m => m.nome === magia)) {
      classe.push("Mago");
      magiaAchada = magiasMago.find(m => m.nome === magia);
    }
    if (!!magiasPaladino.find(m => m.nome === magia)) {
      classe.push("Paladino");
      magiaAchada = magiasPaladino.find(m => m.nome === magia);
    }
    if (!!magiasPatrulheiro.find(m => m.nome === magia)) {
      classe.push("Patrulheiro");
      magiaAchada = magiasPatrulheiro.find(m => m.nome === magia);
    }
    return { magiaAchada, classe };
  }

  function validarMagiaEscolhida(magiaAchada: {
    nome: string;
    nivel: number;
    tipo: string;
  }, classe: string[]) {
    calcularMagiasConhecidas();
    debugger;
    let classeValida;
    if (magiaAchada.nivel === 0) {
      let permitido = false;
      classe.forEach(classe => {
        const truquesDaClasse = ficha?.truquesConhecidos?.find(t => t.classe === classe)?.magias ?? 0;
        const truquesAtuais = ficha?.magiasEscolhidas?.find(m => m.classe === classe)?.magia.length || 0;

        if (truquesAtuais < truquesDaClasse) {
          permitido = true
          classeValida = classe;
        }
      });

      if (permitido === false) {
        toast.error(`Você já atingiu o limite de magias para esta classe`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return { valida: false, classeValida };
      }
    } else {
      let permitido = false;
      classe.forEach(classe => {
        const magiasDaClasse = ficha?.magiasConhecidas?.find(m => m.classe === classe)?.magias ?? 0;
        const magiasAtuais = ficha?.magiasEscolhidas?.find(m => m.classe === classe)?.magia.length || 0;

        if (magiasAtuais < magiasDaClasse) {
          permitido = true;
          classeValida = classe;
        }
      });
      if (permitido === false) {
        toast.error(`Você já atingiu o limite de magias para esta classe`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return { valida: false, classeValida };;
      }
    }
    return { valida: true, classeValida };
  }

  const renderMagiasPorNivel = () => {
    const magiasAgrupadas = agruparMagiasPorNivel();
    const niveisOrdenados = Object.keys(magiasAgrupadas)
      .map(Number)
      .sort((a, b) => a - b);

    return niveisOrdenados.map(nivel => {
      const magiasDoNivel = magiasAgrupadas[nivel];
      const espacos = getEspacosPorNivel(nivel);
      const isExpanded = niveisExpandidos[nivel] !== false; // Padrão: expandido

      return (
        <div key={`nivel-${nivel}`} className="nivel-magia-container">
          <div className="nivel-header">
            <h4>Nível {nivel}</h4>
            <span onClick={() => toggleNivelExpandido(nivel)}>{isExpanded ? '▼' : '▶'}</span>
            <div className="espacos-magia">
              {[...Array(espacos)].map((_, i) => {
                const key = `nivel-${nivel}-index-${i}`;
                const isAtivo = espacosAtivos[key] || false;

                return (
                  <button
                    key={key}
                    className="botao-espaco-magia"
                    onClick={() => toggleEspacoAtivo(nivel, i)}
                  >
                    <img
                      src={isAtivo ? magiaIcon : magiaIcon1}
                      className="espaco-magia-icon"
                      alt={`Espaço de magia nível ${nivel}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {isExpanded && (
            <div className="magias-do-nivel">
              {magiasDoNivel.map((magia, index) => (
                <div key={`${nivel}-${index}`} className="magia-container">
                  <div className="moldura-container">
                    {magiaAtiva[index] && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.img
                            key={i}
                            className={`moldura-magia${i + 1}`}
                            src={magiaFire}
                            initial="hidden"
                            animate="visible"
                            custom={i}
                            variants={variants}
                          />
                        ))}
                      </>
                    )}
                  </div>
                  <div className="dados-magia-container">
                    <div className="magia-coluna1">
                      <p>{magia.nome} ({magia.classe})</p>
                    </div>
                    <div className="magia-coluna2">
                      <button
                        className="botao-equipar"
                        onClick={() => {
                          setModalInfoMagiasAberta(true);
                          setMagiaInfo(magia.nome)
                        }}
                      >
                        <img src={magiaIcon1} className="equipar" />
                        <img src={magiaIcon1} className="equipar-hover" />
                      </button>
                    </div>
                    <div className="magia-coluna3">
                      <button
                        className="botao-equipar"
                        onClick={() => handleUsarMagia(index)}
                      >
                        <img src={magiaIcon1} className="equipar" />
                        <img src={magiaIcon1} className="equipar-hover" />
                      </button>
                      <button
                        className="botao-excluir"
                        onClick={() => {
                          ficha?.excluirMagiaEscolhidas(magia.nome);
                          forceUpdate();
                        }}
                      >
                        <img alt="excluir" className="icon-excluir" src={excluirIcon} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div key={refreshKey} className="magias">
        <h3>Magias Aprendidas</h3>
        <button className="adicionar-armas" onClick={() => setModalMagiasAberta(true)}>
          Escolher Magia
        </button>
        {renderMagiasPorNivel()}
      </div>
      {modalInfoMagiasAberta && (
        <>
          <div className="popup-overlay" onClick={() => setModalInfoMagiasAberta(false)}></div>
          <div className="popup">
            <ModalSelecaoMagias
              onSelect={(magia) => {
              }}
              magiaSelect={magiaInfo}
              onClose={() => setModalInfoMagiasAberta(false)}
              titulo={"Info " + magiaInfo}
            />
          </div>
        </>
      )}
      {modalMagiasAberta && (
        <>
          <div className="popup-overlay" onClick={() => setModalMagiasAberta(false)}></div>
          <div className="popup">
            <ModalSelecaoMagias
              onSelect={(magia) => {
                const magiaClasse = validarMagiaClasse(magia);
                const valida = validarMagiaEscolhida(magiaClasse.magiaAchada, magiaClasse.classe);
                if (valida.valida) ficha?.setMagiaEscolhidas({ classe: valida.classeValida, magia: magiaClasse.magiaAchada.nome });
              }}
              magiaSelect=""
              onClose={() => setModalMagiasAberta(false)}
              titulo="Lista de Magias"
            />
          </div>
        </>
      )}
    </>
  );
}