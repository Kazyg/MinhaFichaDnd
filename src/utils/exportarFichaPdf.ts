import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Ficha } from "../api/fichaPersonagem/FichaPersonagem";
import { selecionarEscolhasMagia } from '../api/fichaPersonagem/fichaConjuracao';
import { resolverMagiaSalva, rotuloConteudo } from '../api/rulesets/conteudo';
import { talentoDoEfeito } from '../api/fichaPersonagem/talentosConteudo';
import { calcularValorAtributoFinal, listarEfeitosAtivos, selecionarAtributo } from "../api/fichaPersonagem/fichaEfeitosUtils";

import { selecionarCA, selecionarArma, selecionarClassesAtivas, selecionarNiveis, selecionarVida, selecionarIniciativa, selecionarDeslocamento, selecionarPericia, selecionarPercepcaoPassiva, selecionarProficiencia, explicarParcelas } from '../api/fichaPersonagem/fichaSeletores';

const TEMPLATE_PATH = `${process.env.PUBLIC_URL || ""}/ficha-de-personagem-dd-5e.pdf`;

type PdfFont = Awaited<ReturnType<PDFDocument["embedFont"]>>;

type Rect = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type BoxDrawOptions = {
  align?: "left" | "center" | "right";
  valign?: "top" | "middle" | "bottom";
  minSize?: number;
  maxSize?: number;
  bold?: boolean;
  singleLine?: boolean;
  paddingX?: number;
  paddingY?: number;
  lineHeightFactor?: number;
};

type Pagina1Map = {
  nome: Rect;
  classeNivel: Rect;
  antecedente: Rect;
  jogador: Rect;
  raca: Rect;
  alinhamento: Rect;
  xp: Rect;
  forca: Rect;
  forcaMod: Rect;
  destreza: Rect;
  destrezaMod: Rect;
  constituicao: Rect;
  constituicaoMod: Rect;
  inteligencia: Rect;
  inteligenciaMod: Rect;
  sabedoria: Rect;
  sabedoriaMod: Rect;
  carisma: Rect;
  carismaMod: Rect;
  salvaguardas: Record<string, Rect>;
  pericias: Record<string, Rect>;
  ca: Rect;
  iniciativa: Rect;
  deslocamento: Rect;
  proficiencia: Rect;
  inspiracao: Rect;
  hpMax: Rect;
  hpAtual: Rect;
  hpTemp: Rect;
  dadosVida: Rect;
  deathSuccess1: Rect;
  deathSuccess2: Rect;
  deathSuccess3: Rect;
  deathFail1: Rect;
  deathFail2: Rect;
  deathFail3: Rect;
  percepcaoPassiva: Rect;
  ataques: Rect;
  equipamento: Rect;
  proficiencias: Rect;
  caracteristicas: Rect;
};

// Coordinates measured on the bundled 612 × 792 template (reference render: 816 × 1056).
const templateRect = (left: number, right: number, top: number, bottom: number): Rect => ({
  xMin: left * .75, xMax: right * .75, yMin: (1056 - bottom) * .75, yMax: (1056 - top) * .75,
});
const PAGE_1_MAP: Pagina1Map = {
  nome: templateRect(65, 325, 85, 113),
  classeNivel: templateRect(362, 503, 94, 112),
  antecedente: templateRect(510, 637, 94, 112),
  jogador: templateRect(642, 752, 94, 112),
  raca: templateRect(362, 465, 111, 123),
  alinhamento: templateRect(470, 632, 111, 123),
  xp: templateRect(638, 752, 111, 123),
  forca: templateRect(48, 104, 214, 245), forcaMod: templateRect(61, 95, 247, 267),
  destreza: templateRect(48, 104, 310, 341), destrezaMod: templateRect(61, 95, 342, 362),
  constituicao: templateRect(48, 104, 405, 436), constituicaoMod: templateRect(61, 95, 438, 458),
  inteligencia: templateRect(48, 104, 500, 531), inteligenciaMod: templateRect(61, 95, 533, 553),
  sabedoria: templateRect(48, 104, 595, 626), sabedoriaMod: templateRect(61, 95, 628, 648),
  carisma: templateRect(48, 104, 690, 721), carismaMod: templateRect(61, 95, 723, 743),
  salvaguardas: {
    forca: templateRect(144, 163, 276, 289), destreza: templateRect(144, 163, 294, 307),
    constituicao: templateRect(144, 163, 312, 325), inteligencia: templateRect(144, 163, 330, 343),
    sabedoria: templateRect(144, 163, 348, 361), carisma: templateRect(144, 163, 366, 379),
  },
  pericias: Object.fromEntries(['acrobacia', 'arcanismo', 'atletismo', 'atuacao', 'enganacao', 'furtividade', 'historia', 'intimidacao', 'intuicao', 'investigacao', 'adestrarAnimais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia'].map((chave, i) => [chave, templateRect(145, 163, 428 + i * 18, 441 + i * 18)])),
  ca: templateRect(307, 352, 189, 220), iniciativa: templateRect(382, 432, 191, 224),
  deslocamento: templateRect(450, 508, 191, 224), proficiencia: templateRect(132, 159, 222, 250),
  inspiracao: templateRect(130, 159, 176, 200),
  hpMax: templateRect(353, 511, 263, 284), hpAtual: templateRect(311, 509, 291, 323),
  hpTemp: templateRect(311, 509, 357, 389), dadosVida: templateRect(309, 396, 438, 463),
  deathSuccess1: templateRect(462, 474, 430, 440), deathSuccess2: templateRect(478, 490, 430, 440),
  deathSuccess3: templateRect(494, 506, 430, 440), deathFail1: templateRect(462, 474, 449, 459),
  deathFail2: templateRect(478, 490, 449, 459), deathFail3: templateRect(494, 506, 449, 459),
  percepcaoPassiva: templateRect(43, 75, 788, 812), ataques: templateRect(305, 516, 530, 746),
  equipamento: templateRect(357, 519, 800, 1001), proficiencias: templateRect(47, 263, 838, 1001),
  caracteristicas: templateRect(548, 773, 520, 1001),
};

const formatBonus = (value: number) => `${value >= 0 ? "+" : ""}${value}`;

const calcularModificador = (valor: number) => Math.floor((valor - 10) / 2);

export const obterNivelClasses = (ficha: Ficha) => selecionarClassesAtivas(ficha).map(c => `${c.nome} ${c.nivel}`).join(' | ');

const obterTalentos = (ficha: Ficha) => {
  const talentos = new Set<string>();
  ficha.talentos?.forEach((talento) => talento && talentos.add(talento));
  listarEfeitosAtivos(ficha).forEach((efeito) => efeito.talento && talentos.add(efeito.talento));
  return Array.from(talentos);
};

const calcularCA = (ficha: Ficha) => selecionarCA(ficha).total;

const wrapText = (text: string, maxWidth: number, font: any, size: number) => {
  const palavras = text.split(/\s+/).flatMap((palavra) => {
    const partes: string[] = [];
    let parte = '';
    for (const letra of palavra) {
      if (parte && font.widthOfTextAtSize(parte + letra, size) > maxWidth) { partes.push(parte); parte = ''; }
      parte += letra;
    }
    if (parte) partes.push(parte);
    return partes;
  });
  const linhas: string[] = [];
  let linhaAtual = "";

  palavras.forEach((palavra) => {
    const proximaLinha = linhaAtual ? `${linhaAtual} ${palavra}` : palavra;
    const largura = font.widthOfTextAtSize(proximaLinha, size);
    if (largura <= maxWidth) {
      linhaAtual = proximaLinha;
    } else {
      if (linhaAtual) linhas.push(linhaAtual);
      linhaAtual = palavra;
    }
  });

  if (linhaAtual) linhas.push(linhaAtual);
  return linhas;
};

const wrapParagraphs = (text: string, maxWidth: number, font: PdfFont, size: number) => {
  return text
    .split("\n")
    .flatMap((paragrafo) => {
      const texto = paragrafo.trim();
      return texto ? wrapText(texto, maxWidth, font, size) : [""];
    });
};

const obterDimensoesRect = (rect: Rect, options: BoxDrawOptions) => {
  const paddingX = options.paddingX ?? 2;
  const paddingY = options.paddingY ?? 1;
  return {
    width: Math.max(rect.xMax - rect.xMin - paddingX * 2, 1),
    height: Math.max(rect.yMax - rect.yMin - paddingY * 2, 1),
    paddingX,
    paddingY,
  };
};

const calcularTamanhoFonteParaBox = (
  text: string,
  rect: Rect,
  font: PdfFont,
  options: BoxDrawOptions = {}
) => {
  const { width, height } = obterDimensoesRect(rect, options);
  const maxSize = options.maxSize ?? 12;
  const minSize = options.minSize ?? 5;
  const lineHeightFactor = options.lineHeightFactor ?? 1.1;

  for (let size = maxSize; size >= minSize; size -= 0.5) {
    const linhas = options.singleLine ? [text] : wrapParagraphs(text, width, font, size);
    const larguraMaxima = Math.max(...linhas.map((linha) => font.widthOfTextAtSize(linha || " ", size)), 0);
    const alturaTotal = linhas.length * size * lineHeightFactor;
    if (larguraMaxima <= width && alturaTotal <= height) {
      return { size, linhas };
    }
  }

  const size = minSize;
  return {
    size,
    linhas: options.singleLine ? [text] : wrapParagraphs(text, width, font, size),
  };
};

const drawTextInBox = (
  page: any,
  text: string,
  rect: Rect,
  regularFont: PdfFont,
  boldFont: PdfFont,
  options: BoxDrawOptions = {}
) => {
  const texto = textoSeguro(text?.trim() || '', options.bold ? boldFont : regularFont);
  if (!texto) return;

  const font = options.bold ? boldFont : regularFont;
  const { width, height, paddingX, paddingY } = obterDimensoesRect(rect, options);
  const { size, linhas } = calcularTamanhoFonteParaBox(texto, rect, font, options);
  const lineHeight = size * (options.lineHeightFactor ?? 1.1);
  const limite = Math.max(1, Math.floor(height / lineHeight));
  const excede = linhas.length > limite || linhas.some(l => font.widthOfTextAtSize(l, size) > width);
  const visiveis = excede ? [...linhas.slice(0, Math.min(limite - 1, linhas.length - 1)), 'Ver anexo'] : linhas;
  const totalHeight = visiveis.length * lineHeight;

  let startY = rect.yMax - paddingY - size;
  if (options.valign === "middle") {
    startY = rect.yMin + paddingY + (height + totalHeight) / 2 - lineHeight;
  }
  if (options.valign === "bottom") {
    startY = rect.yMin + paddingY + totalHeight - lineHeight;
  }

  visiveis.forEach((linha, index) => {
    const larguraLinha = font.widthOfTextAtSize(linha || " ", size);
    let x = rect.xMin + paddingX;

    if (options.align === "center") {
      x = rect.xMin + paddingX + (width - larguraLinha) / 2;
    }
    if (options.align === "right") {
      x = rect.xMax - paddingX - larguraLinha;
    }

    page.drawText(linha, {
      x,
      y: startY - index * lineHeight,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  });
};

const calcularSalvaguarda = (ficha: Ficha, atributo: string, nomeResistencia: string) => {
  const valor = calcularValorAtributoFinal(ficha, atributo as any);
  const mod = calcularModificador(valor);
  const bonus = ficha.classePrincipal?.testesResistencias?.includes(nomeResistencia)
    ? selecionarProficiencia(ficha)
    : 0;
  return mod + bonus;
};

const calcularPericia = (ficha: Ficha, nome: string, atributo: string) => selecionarPericia(ficha, nome, atributo).total;

const obterCaracteristicasPagina1 = (ficha: Ficha) => {
  const caracteristicas = new Set<string>();
  ficha.talentos?.forEach((talento) => talento && caracteristicas.add(talento));
  listarEfeitosAtivos(ficha).forEach((efeito) => efeito.talento && caracteristicas.add(efeito.talento));
  ficha.racaPrincipal?.tracos?.forEach((traco) => traco.traco && caracteristicas.add(traco.traco));
  ficha.subRaca?.tracos?.forEach((traco) => traco.traco && caracteristicas.add(traco.traco));
  if (ficha.backGround?.caracteristicas?.nome) {
    caracteristicas.add(ficha.backGround.caracteristicas.nome);
  }
  return Array.from(caracteristicas).join("\n");
};

const textoSeguro = (texto: string, font: PdfFont) => [...texto.normalize('NFC')].map(c => {
  if (c === '\n') return c;
  try { font.encodeText(c); return c; } catch { return '?'; }
}).join('');

const baixarArquivo = (bytes: Uint8Array, nome: string) => {
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(arrayBuffer).set(bytes);
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const carregarTemplatePdf = async () => {
  const resposta = await fetch(TEMPLATE_PATH);
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar o template da ficha PDF.");
  }

  const templateBytes = await resposta.arrayBuffer();
  return PDFDocument.load(templateBytes);
};

const desenharMapaCoordenadas = async (pdfDoc: PDFDocument) => {
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const passoGrade = 10;

  pdfDoc.getPages().forEach((page, pageIndex) => {
    const largura = page.getWidth();
    const altura = page.getHeight();

    page.drawText(`MAPA DE COORDENADAS - PÁGINA ${pageIndex + 1}`, {
      x: 24,
      y: altura - 24,
      size: 10,
      font: fontBold,
      color: rgb(0.8, 0.1, 0.1),
      opacity: 0.85,
    });

    for (let x = 0; x <= largura; x += passoGrade) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: altura },
        thickness: x % 100 === 0 ? 0.8 : x % 50 === 0 ? 0.55 : 0.2,
        color: rgb(0.85, 0.1, 0.1),
        opacity: x % 50 === 0 ? 0.16 : 0.08,
      });

      for (let y = 0; y <= altura; y += passoGrade) {
        page.drawText(`(${x},${y})`, {
          x: Math.min(x + 1, Math.max(largura - 34, 0)),
          y: Math.min(y + 1, Math.max(altura - 8, 0)),
          size: 3.2,
          font,
          color: rgb(0.8, 0.1, 0.1),
          opacity: x % 50 === 0 && y % 50 === 0 ? 0.42 : 0.2,
        });
      }
    }

    for (let y = 0; y <= altura; y += passoGrade) {
      page.drawLine({
        start: { x: 0, y },
        end: { x: largura, y },
        thickness: y % 100 === 0 ? 0.8 : y % 50 === 0 ? 0.55 : 0.2,
        color: rgb(0.85, 0.1, 0.1),
        opacity: y % 50 === 0 ? 0.16 : 0.08,
      });
    }
  });
};

export const exportarMapaPdf = async () => {
  const pdfDoc = await carregarTemplatePdf();
  await desenharMapaCoordenadas(pdfDoc);
  const pdfBytes = await pdfDoc.save();
  baixarArquivo(pdfBytes, "mapa_coordenadas_ficha_dnd.pdf");
};

export const gerarFichaPdf = async (ficha: Ficha) => {
  const pdfDoc = await carregarTemplatePdf();
  const pages = pdfDoc.getPages();
  const [page1] = pages;
  while (pdfDoc.getPageCount() > 1) pdfDoc.removePage(1);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const nome = ficha.nomePersonagem || "Personagem sem nome";
  const niveis = obterNivelClasses(ficha);
  const classeNivel = niveis || "Classes não informadas";
  const raca = [ficha.racaPrincipal?.nome, ficha.subRaca?.nome].filter(Boolean).join(" / ");
  const background = ficha.backGround?.nome || "Não informado";
  const alinhamento = "Não informado";
  const experiencia = "Não informado";
  const forca = calcularValorAtributoFinal(ficha, "forca");
  const destreza = calcularValorAtributoFinal(ficha, "destreza");
  const constituicao = calcularValorAtributoFinal(ficha, "constituicao");
  const inteligencia = calcularValorAtributoFinal(ficha, "inteligencia");
  const sabedoria = calcularValorAtributoFinal(ficha, "sabedoria");
  const carisma = calcularValorAtributoFinal(ficha, "carisma");
  const idiomas = (ficha.idiomas ?? []).join(", ");
  const pericias = (ficha.pericias ?? []).join(", ");
  const ataques = (ficha.ArmaEquipada ?? []).map((arma) => { const a = selecionarArma(ficha, arma); return `${arma.nome}: ataque ${formatBonus(a.ataque)}, dano ${a.formula}`; }).join(" | ");
  const equipamentos = [
    ...(ficha.ArmadurasMochila?.map((item) => item.nome) ?? []),
    ...(ficha.ArmasMochila?.map((item) => item.nome) ?? []),
    ...(ficha.itensMochila?.map((item) => item.nome) ?? []),
  ].join(", ");
  const caracteristicas = obterCaracteristicasPagina1(ficha);
  const percepcaoPassiva = selecionarPercepcaoPassiva(ficha);

  const atributosPagina1 = {
    forca: { valor: forca, mod: calcularModificador(forca) },
    destreza: { valor: destreza, mod: calcularModificador(destreza) },
    constituicao: { valor: constituicao, mod: calcularModificador(constituicao) },
    inteligencia: { valor: inteligencia, mod: calcularModificador(inteligencia) },
    sabedoria: { valor: sabedoria, mod: calcularModificador(sabedoria) },
    carisma: { valor: carisma, mod: calcularModificador(carisma) },
  };

  drawTextInBox(page1, nome, PAGE_1_MAP.nome, font, fontBold, {
    bold: true,
    minSize: 8,
    maxSize: 16,
    singleLine: true,
    valign: "middle",
  });
  drawTextInBox(page1, classeNivel, PAGE_1_MAP.classeNivel, font, fontBold, {
    minSize: 7,
    maxSize: 11,
    singleLine: true,
    valign: "middle",
  });
  drawTextInBox(page1, background, PAGE_1_MAP.antecedente, font, fontBold, {
    minSize: 7,
    maxSize: 11,
    singleLine: true,
    valign: "middle",
  });
  drawTextInBox(page1, raca, PAGE_1_MAP.raca, font, fontBold, {
    minSize: 6,
    maxSize: 10,
    singleLine: true,
    valign: "middle",
  });
  drawTextInBox(page1, alinhamento, PAGE_1_MAP.alinhamento, font, fontBold, {
    minSize: 6,
    maxSize: 10,
    singleLine: true,
    valign: "middle",
  });
  drawTextInBox(page1, experiencia, PAGE_1_MAP.xp, font, fontBold, {
    minSize: 6,
    maxSize: 10,
    singleLine: true,
    align: "center",
    valign: "middle",
  });

  Object.entries(atributosPagina1).forEach(([chave, dados]) => {
    drawTextInBox(page1, String(dados.valor), PAGE_1_MAP[chave as keyof typeof atributosPagina1] as Rect, font, fontBold, {
      bold: true,
      minSize: 10,
      maxSize: 16,
      singleLine: true,
      align: "center",
      valign: "middle",
      paddingX: 1,
      paddingY: 1,
    });

    drawTextInBox(page1, formatBonus(dados.mod), PAGE_1_MAP[`${chave}Mod` as keyof Pagina1Map] as Rect, font, fontBold, {
      bold: true,
      minSize: 7,
      maxSize: 11,
      singleLine: true,
      align: "center",
      valign: "middle",
      paddingX: 1,
      paddingY: 0.5,
    });
  });

  const salvaguardas = {
    forca: calcularSalvaguarda(ficha, "forca", "Força"),
    destreza: calcularSalvaguarda(ficha, "destreza", "Destreza"),
    constituicao: calcularSalvaguarda(ficha, "constituicao", "Constituição"),
    inteligencia: calcularSalvaguarda(ficha, "inteligencia", "Inteligência"),
    sabedoria: calcularSalvaguarda(ficha, "sabedoria", "Sabedoria"),
    carisma: calcularSalvaguarda(ficha, "carisma", "Carisma"),
  };

  Object.entries(salvaguardas).forEach(([chave, valor]) => {
    drawTextInBox(page1, formatBonus(valor), PAGE_1_MAP.salvaguardas[chave], font, fontBold, {
      bold: true,
      minSize: 7,
      maxSize: 10,
      singleLine: true,
      align: "center",
      valign: "middle",
      paddingX: 1,
      paddingY: 0.5,
    });
  });

  const periciasPagina1: Record<string, number> = {
    adestrarAnimais: calcularPericia(ficha, "Adestrar Animais", "sabedoria"),
    enganacao: calcularPericia(ficha, "Enganação", "carisma"),
    prestidigitacao: calcularPericia(ficha, "Prestidigitação", "destreza"),
    acrobacia: calcularPericia(ficha, "Acrobacia", "destreza"),
    arcanismo: calcularPericia(ficha, "Arcanismo", "inteligencia"),
    atletismo: calcularPericia(ficha, "Atletismo", "forca"),
    atuacao: calcularPericia(ficha, "Atuação", "carisma"),
    furtividade: calcularPericia(ficha, "Furtividade", "destreza"),
    historia: calcularPericia(ficha, "História", "inteligencia"),
    intimidacao: calcularPericia(ficha, "Intimidação", "carisma"),
    intuicao: calcularPericia(ficha, "Intuição", "sabedoria"),
    investigacao: calcularPericia(ficha, "Investigação", "inteligencia"),
    medicina: calcularPericia(ficha, "Medicina", "sabedoria"),
    natureza: calcularPericia(ficha, "Natureza", "inteligencia"),
    percepcao: calcularPericia(ficha, "Percepção", "sabedoria"),
    persuasao: calcularPericia(ficha, "Persuasão", "carisma"),
    religiao: calcularPericia(ficha, "Religião", "inteligencia"),
    sobrevivencia: calcularPericia(ficha, "Sobrevivência", "sabedoria"),
  };

  Object.entries(periciasPagina1).forEach(([chave, valor]) => {
    drawTextInBox(page1, formatBonus(valor), PAGE_1_MAP.pericias[chave], font, fontBold, {
      bold: true,
      minSize: 7,
      maxSize: 10,
      singleLine: true,
      align: "center",
      valign: "middle",
      paddingX: 1,
      paddingY: 0.5,
    });
  });

  drawTextInBox(page1, String(calcularCA(ficha)), PAGE_1_MAP.ca, font, fontBold, {
    bold: true,
    minSize: 12,
    maxSize: 20,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, formatBonus(selecionarIniciativa(ficha).total), PAGE_1_MAP.iniciativa, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(selecionarDeslocamento(ficha).total), PAGE_1_MAP.deslocamento, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, formatBonus(selecionarProficiencia(ficha)), PAGE_1_MAP.proficiencia, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(selecionarVida(ficha).total), PAGE_1_MAP.hpMax, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(ficha.vidaAtual ?? 0), PAGE_1_MAP.hpAtual, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, "N/I", PAGE_1_MAP.hpTemp, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, selecionarClassesAtivas(ficha).map(c => { const dado = selecionarNiveis(ficha).find(n => n.classe && n.classe.nome === c.nome)?.classe?.dadosVida; return dado ? `${c.nivel}d${dado}` : 'N/I'; }).join(' + '), PAGE_1_MAP.dadosVida, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 14,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(percepcaoPassiva), PAGE_1_MAP.percepcaoPassiva, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 14,
    singleLine: true,
    align: "center",
    valign: "middle",
  });

  drawTextInBox(page1, ataques, PAGE_1_MAP.ataques, font, fontBold, {
    minSize: 6,
    maxSize: 10,
    valign: "top",
    lineHeightFactor: 1.15,
  });
  drawTextInBox(page1, equipamentos, PAGE_1_MAP.equipamento, font, fontBold, {
    minSize: 6,
    maxSize: 10,
    valign: "top",
    lineHeightFactor: 1.15,
  });
  drawTextInBox(page1, [pericias, idiomas].filter(Boolean).join("\n"), PAGE_1_MAP.proficiencias, font, fontBold, {
    minSize: 6,
    maxSize: 9,
    valign: "top",
    lineHeightFactor: 1.15,
  });
  drawTextInBox(page1, caracteristicas, PAGE_1_MAP.caracteristicas, font, fontBold, {
    minSize: 6,
    maxSize: 9,
    valign: "top",
    lineHeightFactor: 1.15,
  });

  // The full appendix flows onto fresh pages; nothing is silently dropped in fixed boxes.
  let pagina = pdfDoc.addPage();
  let y = pagina.getHeight() - 40;
  const linha = (texto: string) => {
    for (const l of wrapParagraphs(textoSeguro(texto, font), pagina.getWidth() - 80, font, 10)) {
      if (y < 40) { pagina = pdfDoc.addPage(); y = pagina.getHeight() - 40; }
      pagina.drawText(l, { x: 40, y, size: 10, font });
      y -= 14;
    }
    y -= 7;
  };
  linha(`Ficha de ${nome} - D&D ${ficha.versaoRegras === 'DND_2024' ? '2024' : '2014'}`);
  linha(`Classes e níveis ativos: ${classeNivel}`);
  const faltantes = selecionarNiveis(ficha).filter(n => !n.classe).map(n => n.nivel);
  if (faltantes.length) linha(`Classe não informada nos níveis: ${faltantes.join(', ')}`);
  linha(`Raça/espécie e linhagem: ${raca || 'Não informada'}. Origem: ${background}`);
  Object.keys(atributosPagina1).forEach(a => linha(`${a}: ${selecionarAtributo(ficha, a).explicacao}`));
  linha('Não representados neste PDF: jogador, alinhamento, XP, inspiração, PV temporários e dados de vida gastos. Caracteres não suportados pela fonte aparecem como ?.');
  const morte = ficha.recursos?.morte;
  linha(morte == null ? 'Testes de morte não informados.'
    : `Testes de morte: ${morte.sucessos ?? 'não informados'} sucessos; ${morte.falhas ?? 'não informadas'} falhas.`);
  linha(`CA: ${selecionarCA(ficha).total}. ${selecionarCA(ficha).explicacao}`);
  linha(`Alternativas de CA: ${selecionarCA(ficha).alternativas.map(a => `${a.fonte} = ${a.valor} (${a.aplicada ? 'disponível' : 'indisponível'})`).join('; ')}`);
  const vida = selecionarVida(ficha);
  linha(`PV atuais: ${ficha.vidaAtual ?? 'Não informados'}; máximos: ${vida.total}${vida.manual ? ' (máximo salvo manualmente)' : ' (média fixa)'}. ${explicarParcelas(vida.parcelas)}`);
  if (vida.ausentes.length) linha(`PV incompletos: dado de vida ausente nos níveis ${vida.ausentes.join(', ')}`);
  linha(`Iniciativa: ${formatBonus(selecionarIniciativa(ficha).total)}. ${explicarParcelas(selecionarIniciativa(ficha).parcelas)}`);
  linha(`Deslocamento: ${selecionarDeslocamento(ficha).total} ft. ${explicarParcelas(selecionarDeslocamento(ficha).parcelas)}`);
  linha(`Percepção passiva: ${percepcaoPassiva}. Proficiência: ${formatBonus(selecionarProficiencia(ficha))}`);
  const todasPericias = [['Acrobacia','destreza'],['Adestrar Animais','sabedoria'],['Arcanismo','inteligencia'],['Atletismo','forca'],['Atuação','carisma'],['Enganação','carisma'],['Furtividade','destreza'],['História','inteligencia'],['Intimidação','carisma'],['Intuição','sabedoria'],['Investigação','inteligencia'],['Medicina','sabedoria'],['Natureza','inteligencia'],['Percepção','sabedoria'],['Persuasão','carisma'],['Prestidigitação','destreza'],['Religião','inteligencia'],['Sobrevivência','sabedoria']];
  linha('Todas as perícias e fontes dos bônus:');
  todasPericias.forEach(([nome, atributo]) => { const p = selecionarPericia(ficha, nome, atributo); linha(`${nome}: ${formatBonus(p.total)}. ${explicarParcelas(p.parcelas)}`); });
  linha(`Armas: ${ataques || 'Nenhuma equipada'}`);
  (ficha.ArmaEquipada ?? []).forEach(a => linha(`${a.nome}: ${selecionarArma(ficha, a).explicacao}`));
  linha('Outros estilos e situações de combate exigem aplicação manual; arma versátil usa aqui o dano principal em uma mão.');
  linha(`Inventário: ${equipamentos || 'Não informado'}`);
  linha(`Itens equipados: ${(ficha.itensEquipados ?? []).map(i => i.nome).join(', ') || 'Nenhum'}`);
  linha(`Idiomas: ${idiomas || 'Não informados'}`);
  linha(`Características: ${caracteristicas || 'Não informadas'}`);
  linha(`Talentos: ${obterTalentos(ficha).join(', ') || 'Não informados'}`);
  (ficha.efeitos ?? []).filter(e => e.talento).forEach(e => {
    const t = talentoDoEfeito(e);
    linha(`${e.talento}: ${t ? `${t.id} | ${rotuloConteudo(t)}` : e.conteudo ? 'Revisão desconhecida, snapshot preservado no JSON' : 'Legado sem referência individual; efeitos salvos preservados'}. Escolhas: ${e.escolhasTalento?.join(', ') || 'nenhuma registrada'}`);
  });
  linha(`Estilos selecionados: ${(ficha.estiloLuta ?? []).map(e => e.estilo + ' (' + e.classe + ')').join(', ') || 'Nenhum'}`);
  linha('Magias:');
  selecionarEscolhasMagia(ficha).forEach(m => {
    const c = resolverMagiaSalva(m);
    linha(`${m.classe}: ${m.nome} (${m.categoria}${m.preparada ? ', preparada' : ''}; fonte ${m.edicao}). Conteúdo: ${c ? `${c.id} | ${rotuloConteudo(c)}` : 'revisão desconhecida, snapshot preservado no JSON'}${!m.conteudo ? '; registro legado sem revisão individual' : ''}`);
  });
  linha(`Ouro: ${ficha.ouro} | Prata: ${ficha.prata} | Cobre: ${ficha.cobre}`);
  page1.drawText(`D&D ${ficha.versaoRegras === 'DND_2024' ? '2024' : '2014'} - valores e detalhes completos no anexo`, { x: 40, y: 8, size: 7, font });
  return pdfDoc.save();
};

export const exportarFichaPdf = async (ficha: Ficha) => {
  const bytes = await gerarFichaPdf(ficha);
  baixarArquivo(bytes, `${(ficha.nomePersonagem || 'personagem').replace(/\s+/g, '_').toLowerCase()}_ficha_dnd.pdf`);
};
