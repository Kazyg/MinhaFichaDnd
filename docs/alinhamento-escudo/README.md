# Alinhamento do número da classe de armadura

## Diagnóstico

O componente original era `InformacoesPersonagem`: um `img.icon-ca` e um
`span.ca-text` absoluto, ambos com dimensões declaradas separadamente.
O desenho é `src/imagens/icon_ac.png`, um PNG RGBA de 150 × 150; não havia
SVG, `viewBox` ou biblioteca de ícones envolvidos.

Medição do contorno e da área interna (coordenadas do PNG):

| Referência | Centro (x, y) |
| --- | --- |
| Caixa da imagem | 75; 75 |
| Bounding box do desenho visível | 74,5; 76 |
| Bounding box da área interna | 74,5; 75,5 |
| Centróide da área interna | 74,504; 65,032 |

A ponta inferior é estreita e a parte superior é larga. Portanto, o centro da
caixa não é uma boa referência visual. As margens transparentes são quase
simétricas: recortar a imagem não resolveria a diferença vertical.

Além disso, o flex centralizava a caixa tipográfica do `span`, com
`line-height: normal` e fonte herdada, não a tinta dos algarismos. O número 1
tem espaços laterais diferentes da sua largura visível. Nas capturas anteriores,
o centro da tinta de 11 estava 6,37 px (desktop) e 7,32 px (mobile) abaixo do
centróide interno do escudo.

Havia também uma fragilidade de layout: a imagem podia encolher por
`flex-shrink: 1`, enquanto a caixa absoluta do texto mantinha sua largura.
O texto era ancorado ao container completo, podendo divergir da posição da
imagem quando o bloco de detalhes ficasse mais alto. As capturas anteriores
com descrição curta não apresentaram compressão; esse era um risco adicional
da estrutura, não a causa observada naquele cenário.

## Implementação

`EscudoCA.tsx` reúne o PNG original e o texto em um SVG com `viewBox="0 0 150 150"`.
O arquivo da imagem não foi alterado. O SVG mantém proporção 1:1 e não encolhe
no flex. O bloco de detalhes ocupa o espaço restante e pode quebrar linhas.

O ponto de referência é (74,5; 65), derivado do centróide medido. A fonte
Arial, tamanho 75 nas coordenadas do SVG, peso 400 e kerning desativado são
compartilhados pela renderização e pela medição. `Canvas.measureText()` fornece
os limites reais da tinta (`actualBoundingBox*`), usados para calcular a origem
horizontal e a baseline. A fórmula é a mesma para qualquer valor; não existem
offsets por algarismo. A fonte e o número escalam junto com o desenho.

A medição ocorre em `useLayoutEffect` e é refeita quando o valor ou as fontes
carregadas mudam. Em ambientes sem Canvas/layout, existe um fallback SVG
visível, sem a garantia de precisão da medição. O nome acessível inclui o valor.
As antigas regras `.icon-ca`/`.ca-text`, inclusive as de mobile, foram removidas.

## Validação reproduzível

Inicie o projeto local em um terminal PowerShell:

```powershell
$env:BROWSER='none'
$env:PORT='3001'
npm start
```

Em outro terminal:

```powershell
python docs/alinhamento-escudo/medir-geometria.py
node docs/alinhamento-escudo/validar-browser.cjs after
python docs/alinhamento-escudo/verificar-pixels.py after
npm run typecheck
npx eslint src/pages/components/components_InformacoesPersonagem/EscudoCA.tsx src/pages/components/InformacoesPersonagem.tsx
$env:CI='true'
npm test -- --watchAll=false --runInBand --runTestsByPath src/api/fichaPersonagem/fichaSeletores.test.js src/api/fichaPersonagem/itensCa.test.js
```

Os scripts usam Node com WebSocket nativo, Edge instalado e Python/Pillow.
O navegador recebe um perfil temporário exclusivo. As fichas sintéticas são
carregadas pelo armazenamento normal da aplicação, com `classeArmadura` definido
para 1, 8, 9, 10, 11 e 20; o número renderizado não é substituído no DOM.

São 36 combinações: 1440 × 900, 1920 × 1080, 390 × 844 e 320 × 740, além de
dois cenários controlados com escudos de 48 e 96 px, container de 180 px e
descrição longa via CSS de teste. Os tamanhos naturais são aproximadamente
65,66 e 68,39 px em desktop e 80 px em mobile.

`before/galeria.png` registra o estado anterior; `after/galeria.png` reúne as
capturas atuais. `result.json` contém dimensões/estilos reais. `pixels.json`
verifica, independentemente do Canvas, o centro da tinta branca em relação ao
centróide delimitado pelo contorno laranja, com tolerância de 1 CSS px para
rasterização. O verificador executado em `before` deve falhar.

A validação móvel usa emulação de viewport no Edge; não representa uma execução
em aparelhos físicos ou nos motores Safari/Firefox.

Resultado em 16/10/2026: 36/36 verificações visuais aprovadas, zero exceções da
aplicação, maior desvio de 0,505 CSS px (tolerância de 1 px). As galerias foram
inspecionadas visualmente. TypeScript e lint dos componentes passaram; as duas
suítes relacionadas passaram com 24 testes. A imagem PNG original permanece
inalterada.
