import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Ficha } from "../api/fichaPersonagem/FichaPersonagem.ts";
import { calcularBonusCAItens, calcularValorAtributoFinal } from "../api/fichaPersonagem/fichaEfeitosUtils.ts";

const TEMPLATE_PATH = `${process.env.PUBLIC_URL || ""}/ficha-de-personagem-dd-5e.pdf`;

type DrawOptions = {
  size?: number;
  maxWidth?: number;
  lineHeight?: number;
};

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

const PAGE_1_MAP: Pagina1Map = {
  nome: { xMin: 50, xMax: 170, yMin: 710, yMax: 730 },
  classeNivel: { xMin: 280, xMax: 360, yMin: 710, yMax: 730 },
  antecedente: { xMin: 380, xMax: 460, yMin: 710, yMax: 730 },
  jogador: { xMin: 470, xMax: 560, yMin: 710, yMax: 730 },
  raca: { xMin: 270, xMax: 340, yMin: 700, yMax: 710 },
  alinhamento: { xMin: 350, xMax: 420, yMin: 700, yMax: 710 },
  xp: { xMin: 480, xMax: 540, yMin: 700, yMax: 710 },
  forca: { xMin: 40, xMax: 60, yMin: 610, yMax: 630 },
  forcaMod: { xMin: 45, xMax: 65, yMin: 590, yMax: 600 },
  destreza: { xMin: 40, xMax: 60, yMin: 560, yMax: 580 },
  destrezaMod: { xMin: 45, xMax: 65, yMin: 540, yMax: 550 },
  constituicao: { xMin: 40, xMax: 60, yMin: 510, yMax: 530 },
  constituicaoMod: { xMin: 45, xMax: 65, yMin: 490, yMax: 500 },
  inteligencia: { xMin: 40, xMax: 60, yMin: 460, yMax: 480 },
  inteligenciaMod: { xMin: 45, xMax: 65, yMin: 440, yMax: 450 },
  sabedoria: { xMin: 40, xMax: 60, yMin: 410, yMax: 430 },
  sabedoriaMod: { xMin: 45, xMax: 65, yMin: 390, yMax: 400 },
  carisma: { xMin: 40, xMax: 60, yMin: 360, yMax: 380 },
  carismaMod: { xMin: 45, xMax: 65, yMin: 340, yMax: 350 },
  salvaguardas: {
    forca: { xMin: 90, xMax: 140, yMin: 620, yMax: 630 },
    destreza: { xMin: 90, xMax: 140, yMin: 600, yMax: 610 },
    constituicao: { xMin: 90, xMax: 140, yMin: 580, yMax: 590 },
    inteligencia: { xMin: 90, xMax: 140, yMin: 560, yMax: 570 },
    sabedoria: { xMin: 90, xMax: 140, yMin: 540, yMax: 550 },
    carisma: { xMin: 90, xMax: 140, yMin: 520, yMax: 530 },
  },
  pericias: {
    acrobacia: { xMin: 90, xMax: 140, yMin: 500, yMax: 510 },
    arcanismo: { xMin: 90, xMax: 140, yMin: 480, yMax: 490 },
    atletismo: { xMin: 90, xMax: 140, yMin: 460, yMax: 470 },
    atuacao: { xMin: 90, xMax: 140, yMin: 440, yMax: 450 },
    furtividade: { xMin: 90, xMax: 140, yMin: 420, yMax: 430 },
    historia: { xMin: 90, xMax: 140, yMin: 400, yMax: 410 },
    intimidacao: { xMin: 90, xMax: 140, yMin: 380, yMax: 390 },
    intuicao: { xMin: 90, xMax: 140, yMin: 360, yMax: 370 },
    investigacao: { xMin: 90, xMax: 140, yMin: 340, yMax: 350 },
    medicina: { xMin: 90, xMax: 140, yMin: 320, yMax: 330 },
    natureza: { xMin: 90, xMax: 140, yMin: 300, yMax: 310 },
    percepcao: { xMin: 90, xMax: 140, yMin: 280, yMax: 290 },
    persuasao: { xMin: 90, xMax: 140, yMin: 260, yMax: 270 },
    religiao: { xMin: 90, xMax: 140, yMin: 240, yMax: 250 },
    sobrevivencia: { xMin: 90, xMax: 140, yMin: 220, yMax: 230 },
  },
  ca: { xMin: 200, xMax: 240, yMin: 600, yMax: 630 },
  iniciativa: { xMin: 250, xMax: 290, yMin: 600, yMax: 630 },
  deslocamento: { xMin: 300, xMax: 360, yMin: 600, yMax: 630 },
  proficiencia: { xMin: 200, xMax: 240, yMin: 550, yMax: 570 },
  inspiracao: { xMin: 250, xMax: 290, yMin: 550, yMax: 570 },
  hpMax: { xMin: 400, xMax: 460, yMin: 600, yMax: 630 },
  hpAtual: { xMin: 400, xMax: 460, yMin: 560, yMax: 590 },
  hpTemp: { xMin: 400, xMax: 460, yMin: 520, yMax: 550 },
  dadosVida: { xMin: 480, xMax: 540, yMin: 560, yMax: 590 },
  deathSuccess1: { xMin: 480, xMax: 490, yMin: 520, yMax: 530 },
  deathSuccess2: { xMin: 500, xMax: 510, yMin: 520, yMax: 530 },
  deathSuccess3: { xMin: 520, xMax: 530, yMin: 520, yMax: 530 },
  deathFail1: { xMin: 480, xMax: 490, yMin: 500, yMax: 510 },
  deathFail2: { xMin: 500, xMax: 510, yMin: 500, yMax: 510 },
  deathFail3: { xMin: 520, xMax: 530, yMin: 500, yMax: 510 },
  percepcaoPassiva: { xMin: 200, xMax: 260, yMin: 250, yMax: 270 },
  ataques: { xMin: 200, xMax: 550, yMin: 350, yMax: 500 },
  equipamento: { xMin: 200, xMax: 550, yMin: 150, yMax: 340 },
  proficiencias: { xMin: 40, xMax: 180, yMin: 150, yMax: 300 },
  caracteristicas: { xMin: 380, xMax: 550, yMin: 50, yMax: 140 },
};

const formatBonus = (value: number) => `${value >= 0 ? "+" : ""}${value}`;

const calcularModificador = (valor: number) => Math.floor((valor - 10) / 2);

const normalizarLista = (valores: Array<string | null | undefined>) =>
  valores.filter((valor): valor is string => Boolean(valor && valor.trim()));

const obterNomeClasses = (ficha: Ficha) => {
  const classes = [ficha.classePrincipal?.nome, ...(ficha.multiclasses?.map((item) => item.classe.nome) ?? [])];
  return Array.from(new Set(normalizarLista(classes))).join(" / ");
};

const obterNivelClasses = (ficha: Ficha) => {
  const classes = [
    ficha.classePrincipal ? `${ficha.classePrincipal.nome} ${ficha.levelTotal ?? 1}` : null,
    ...(ficha.multiclasses?.map((item) => `${item.classe.nome} ${item.nivelClasse}`) ?? []),
  ];
  return Array.from(new Set(normalizarLista(classes))).join(" | ");
};

const obterTalentos = (ficha: Ficha) => {
  const talentos = new Set<string>();
  ficha.talentos?.forEach((talento) => talento && talentos.add(talento));
  ficha.efeitos?.forEach((efeito) => efeito.talento && talentos.add(efeito.talento));
  return Array.from(talentos);
};

const calcularCA = (ficha: Ficha) => {
  let ca = 10;
  const des = calcularModificador(calcularValorAtributoFinal(ficha, "destreza"));
  const con = calcularModificador(calcularValorAtributoFinal(ficha, "constituicao"));
  const sab = calcularModificador(calcularValorAtributoFinal(ficha, "sabedoria"));

  if (!ficha.ArmaduraEquipada) {
    ca += des;
    if (ficha.multiclasses?.some((m) => m.classe.nome === "barbaro")) {
      ca += con;
    } else if (ficha.multiclasses?.some((m) => m.classe.nome === "Monge")) {
      ca += sab;
    }
  } else {
    const armadura = ficha.ArmaduraEquipada;
    ca = armadura.ac;
    if (armadura.categoria === "Armadura Leve") {
      ca += des;
    }
    if (armadura.categoria === "Armadura Média") {
      ca += Math.min(des, 2);
    }
  }

  if (ficha.escudoEquipado) {
    ca += ficha.escudoEquipado.ac;
  }

  ca += calcularBonusCAItens(ficha);
  return ca;
};

const wrapText = (text: string, maxWidth: number, font: any, size: number) => {
  const palavras = text.split(/\s+/);
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
  const texto = text?.trim();
  if (!texto) return;

  const font = options.bold ? boldFont : regularFont;
  const { width, height, paddingX, paddingY } = obterDimensoesRect(rect, options);
  const { size, linhas } = calcularTamanhoFonteParaBox(texto, rect, font, options);
  const lineHeight = size * (options.lineHeightFactor ?? 1.1);
  const totalHeight = linhas.length * lineHeight;

  let startY = rect.yMax - paddingY - size;
  if (options.valign === "middle") {
    startY = rect.yMin + paddingY + (height + totalHeight) / 2 - lineHeight;
  }
  if (options.valign === "bottom") {
    startY = rect.yMin + paddingY + totalHeight - lineHeight;
  }

  linhas.forEach((linha, index) => {
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
    ? ficha.proeficiencia ?? 0
    : 0;
  return mod + bonus;
};

const calcularPericia = (ficha: Ficha, nome: string, atributo: string) => {
  const valor = calcularValorAtributoFinal(ficha, atributo as any);
  const mod = calcularModificador(valor);
  const treinado = ficha.pericias?.includes(nome) ? ficha.proeficiencia ?? 0 : 0;
  return mod + treinado;
};

const obterCaracteristicasPagina1 = (ficha: Ficha) => {
  const caracteristicas = new Set<string>();
  ficha.talentos?.forEach((talento) => talento && caracteristicas.add(talento));
  ficha.efeitos?.forEach((efeito) => efeito.talento && caracteristicas.add(efeito.talento));
  ficha.racaPrincipal?.tracos?.forEach((traco) => traco.traco && caracteristicas.add(traco.traco));
  ficha.subRaca?.tracos?.forEach((traco) => traco.traco && caracteristicas.add(traco.traco));
  if (ficha.backGround?.caracteristicas?.nome) {
    caracteristicas.add(ficha.backGround.caracteristicas.nome);
  }
  return Array.from(caracteristicas).join("\n");
};

const drawTextBlock = (
  page: any,
  text: string,
  x: number,
  startY: number,
  font: any,
  options: DrawOptions = {}
) => {
  const size = options.size ?? 10;
  const lineHeight = options.lineHeight ?? size + 2;
  const linhas = wrapText(text, options.maxWidth ?? 180, font, size);

  linhas.forEach((linha, index) => {
    page.drawText(linha, {
      x,
      y: startY - index * lineHeight,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return startY - linhas.length * lineHeight;
};

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

export const exportarFichaPdf = async (ficha: Ficha) => {
  const pdfDoc = await carregarTemplatePdf();
  const pages = pdfDoc.getPages();
  const [page1, page2, page3] = pages;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const nome = ficha.nomePersonagem || "Personagem sem nome";
  const classe = obterNomeClasses(ficha);
  const niveis = obterNivelClasses(ficha);
  const classeNivel = niveis || classe;
  const raca = [ficha.racaPrincipal?.nome, ficha.subRaca?.nome].filter(Boolean).join(" / ");
  const background = ficha.backGround?.nome || "";
  const alinhamento = "";
  const experiencia = "0";
  const forca = calcularValorAtributoFinal(ficha, "forca");
  const destreza = calcularValorAtributoFinal(ficha, "destreza");
  const constituicao = calcularValorAtributoFinal(ficha, "constituicao");
  const inteligencia = calcularValorAtributoFinal(ficha, "inteligencia");
  const sabedoria = calcularValorAtributoFinal(ficha, "sabedoria");
  const carisma = calcularValorAtributoFinal(ficha, "carisma");
  const idiomas = (ficha.idiomas ?? []).join(", ");
  const pericias = (ficha.pericias ?? []).join(", ");
  const ataques = (ficha.ArmaEquipada ?? []).map((arma) => `${arma.nome} ${arma.dano?.dano_1 ?? ""}`).join(" | ");
  const equipamentos = [
    ...(ficha.ArmadurasMochila?.map((item) => item.nome) ?? []),
    ...(ficha.ArmasMochila?.map((item) => item.nome) ?? []),
    ...(ficha.itensMochila?.map((item) => item.nome) ?? []),
  ].join(", ");
  const caracteristicas = obterCaracteristicasPagina1(ficha);
  const percepcaoPassiva = 10 + calcularModificador(sabedoria) + (ficha.pericias?.includes("Percepção") ? (ficha.proeficiencia ?? 0) : 0);

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
  drawTextInBox(page1, formatBonus(ficha.iniciativa ?? 0), PAGE_1_MAP.iniciativa, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(ficha.speed ?? 0), PAGE_1_MAP.deslocamento, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, formatBonus(ficha.proeficiencia ?? 0), PAGE_1_MAP.proficiencia, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(ficha.vidaTotal ?? 0), PAGE_1_MAP.hpMax, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(ficha.vidaAtual ?? ficha.vidaTotal ?? 0), PAGE_1_MAP.hpAtual, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, "0", PAGE_1_MAP.hpTemp, font, fontBold, {
    bold: true,
    minSize: 10,
    maxSize: 16,
    singleLine: true,
    align: "center",
    valign: "middle",
  });
  drawTextInBox(page1, String(ficha.levelTotal ?? 1), PAGE_1_MAP.dadosVida, font, fontBold, {
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

  let yPage2 = 740;
  page2.drawText(`Nome: ${nome}`, { x: 40, y: yPage2, size: 14, font: fontBold, color: rgb(0, 0, 0) });
  yPage2 -= 28;
  page2.drawText(`Classes e níveis: ${niveis}`, { x: 40, y: yPage2, size: 10, font, color: rgb(0, 0, 0) });
  yPage2 -= 24;
  page2.drawText("Talentos", { x: 40, y: yPage2, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yPage2 -= 14;
  yPage2 = drawTextBlock(page2, obterTalentos(ficha).join("\n") || "Nenhum talento.", 40, yPage2, font, {
    size: 10,
    maxWidth: 240,
    lineHeight: 12,
  });

  yPage2 -= 16;
  page2.drawText("Magias", { x: 40, y: yPage2, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yPage2 -= 14;
  yPage2 = drawTextBlock(
    page2,
    ficha.magiasEscolhidas?.flatMap((grupo) => grupo.magia.map((magia) => `${grupo.classe}: ${magia}`)).join("\n") || "Nenhuma magia.",
    40,
    yPage2,
    font,
    { size: 9, maxWidth: 250, lineHeight: 11 }
  );

  let yColunaDireita = 712;
  page2.drawText("Inventário", { x: 330, y: yColunaDireita, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yColunaDireita -= 14;
  yColunaDireita = drawTextBlock(page2, equipamentos || "Sem equipamentos.", 330, yColunaDireita, font, {
    size: 9,
    maxWidth: 230,
    lineHeight: 11,
  });
  yColunaDireita -= 16;
  page2.drawText("Idiomas", { x: 330, y: yColunaDireita, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yColunaDireita -= 14;
  yColunaDireita = drawTextBlock(page2, idiomas || "Nenhum idioma.", 330, yColunaDireita, font, {
    size: 9,
    maxWidth: 230,
    lineHeight: 11,
  });
  yColunaDireita -= 16;
  page2.drawText("Perícias", { x: 330, y: yColunaDireita, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yColunaDireita -= 14;
  drawTextBlock(page2, pericias || "Nenhuma perícia.", 330, yColunaDireita, font, {
    size: 9,
    maxWidth: 230,
    lineHeight: 11,
  });

  let yPage3 = 740;
  page3.drawText(`Resumo de ${nome}`, { x: 40, y: yPage3, size: 14, font: fontBold, color: rgb(0, 0, 0) });
  yPage3 -= 28;
  const resumo = [
    `Raça: ${raca || "-"}`,
    `Background: ${background || "-"}`,
    `CA: ${calcularCA(ficha)}`,
    `PV: ${ficha.vidaAtual ?? ficha.vidaTotal ?? 0}/${ficha.vidaTotal ?? 0}`,
    `Proficiência: ${formatBonus(ficha.proeficiencia ?? 0)}`,
    `Iniciativa: ${formatBonus(ficha.iniciativa ?? 0)}`,
    `Ouro: ${ficha.ouro} | Prata: ${ficha.prata} | Cobre: ${ficha.cobre}`,
  ].join("\n");
  yPage3 = drawTextBlock(page3, resumo, 40, yPage3, font, { size: 11, maxWidth: 250, lineHeight: 14 });
  yPage3 -= 20;
  page3.drawText("Armas equipadas", { x: 40, y: yPage3, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yPage3 -= 14;
  yPage3 = drawTextBlock(
    page3,
    (ficha.ArmaEquipada ?? []).map((arma) => `${arma.nome} - ${arma.dano?.dano_1 ?? "sem dano"}`).join("\n") || "Nenhuma arma equipada.",
    40,
    yPage3,
    font,
    { size: 10, maxWidth: 250, lineHeight: 12 }
  );
  yPage3 -= 20;
  page3.drawText("Itens equipados", { x: 40, y: yPage3, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yPage3 -= 14;
  drawTextBlock(page3, (ficha.itensEquipados ?? []).map((item) => item.nome).join("\n") || "Nenhum item equipado.", 40, yPage3, font, {
    size: 10,
    maxWidth: 250,
    lineHeight: 12,
  });

  const pdfBytes = await pdfDoc.save();
  baixarArquivo(pdfBytes, `${nome.replace(/\s+/g, "_").toLowerCase()}_ficha_dnd.pdf`);
};
