# Concessões iniciais de equipamentos e moedas

A seleção de background sincroniza as concessões com os inventários existentes,
sem substituir o inventário nem reiniciar atributos, níveis ou talentos de avanço.
As concessões são persistidas na ficha, no armazenamento local e no JSON.

## Comportamento

- Acólito 2014: símbolo sagrado, livro de preces, cinco varetas de incenso,
  vestimentas, roupas comuns e 15 PO. O recipiente mencionado apenas como
  contexto das moedas não vira item físico, conforme a representação solicitada.
- Acólito 2024: sua própria lista e 8 PO, ou somente 50 PO. As alternativas
  são mutuamente exclusivas e a escolha é persistida.
- Os 32 backgrounds cadastrados têm concessões estruturadas separadas por versão.
  O adaptador textual permanece para backgrounds personalizados e snapshots antigos.
  Bolsas e algibeiras independentes continuam físicas, incluindo as duas algibeiras
  de Andarilho, Artesão, Criminoso e Mercador 2024.
- Instrumento do Artista e trapaça do Charlatão substituem o objeto genérico.
- Armas e armaduras reconhecidas reutilizam seus modelos. Quantidades são
  representadas por instâncias distintas, conforme o inventário atual.
- Cada instância automática tem origem e identificador próprios. A reconciliação
  remove somente os identificadores registrados para a concessão anterior.
- Reselecionar a mesma concessão não repõe itens removidos ou consumidos.
- A escolha de ferramenta do Anão 2014 concede apenas proficiência: o catálogo
  racial não concede a posse física das ferramentas.

## Reconciliação financeira

O registro conserva as moedas restantes da origem, os gastos acumulados e o saldo
observado. Retiradas feitas pelos métodos existentes consomem primeiro as moedas
da origem; depósitos manuais não aumentam a concessão. Ao trocar de background,
o sistema retira somente a contribuição restante e calcula a nova contribuição
descontando os gastos acumulados. Alternar backgrounds não recupera dinheiro gasto.

Abrir ou importar fichas antigas não credita moedas automaticamente. Uma seleção
explícita de background inicia o crédito de moedas quando faltava o registro ou
quando o registro legado da implementação anterior bloqueava o crédito. O saldo
existente é mantido e o crédito é registrado uma vez. Os itens antigos permanecem
intactos ao reselecionar o mesmo background sem origem rastreada.
Se o saldo mudar fora dos métodos rastreados, ou for insuficiente para a
reconciliação, a atualização financeira é suspensa. Os valores são preservados,
sem avisos administrativos permanentes na interface. Não há inferência de quais
objetos antigos foram adquiridos manualmente; eles também são preservados.

Objetos sem correspondência no catálogo usam o modelo de item comum, com valores
neutros e indicação de propriedades não cadastradas. Kits sem composição explícita
continuam como itens únicos; seus conteúdos não são inventados.

## Arquivos desta implementação

- `src/api/backGroundsFilhos/Acolito.class.ts`
- `src/api/classesPrincipais/BackGrounds.class.ts`
- `src/api/classesPrincipais/concessoesEquipamento.ts`
- `src/api/equipamentos/Armas.ts`
- `src/api/equipamentos/Armaduras.ts`
- `src/bibliotecas/Itens.ts`
- `src/api/fichaPersonagem/FichaPersonagem.ts`
- `src/api/fichaPersonagem/fichaConcessoesIniciais.ts`
- `src/api/fichaPersonagem/fichaStorage.ts`
- `src/pages/components/CriacaoFicha.tsx`
- `src/pages/components/components_inventario/AbaItens.tsx`
- `src/pages/modals/ModalSelecaoBackGround.tsx`
- `src/api/fichaPersonagem/fichaConcessoesIniciais.test.ts`
- `src/api/fichaPersonagem/backgroundOuroFluxo.test.tsx`
- `src/pages/modals/ModalSelecaoBackGround.test.tsx`
- `src/api/rulesets/equipamentoBackground.ts`
- `src/api/rulesets/equipamentoBackground.test.ts`
- `src/api/rulesets/dnd2014/index.ts`
- `src/api/rulesets/dnd2024/index.ts`
- `docs/concessoes-iniciais.md`

## Validação direcionada

Os testes cobrem concessões, moedas, gastos, trocas, cópias manuais, identidade,
importação/exportação JSON, proficiências do Anão e seleção pela interface.

Comando: `npm test -- --watchAll=false --runInBand --runTestsByPath src/api/fichaPersonagem/backgroundOuroFluxo.test.tsx src/api/rulesets/equipamentoBackground.test.ts src/api/fichaPersonagem/fichaConcessoesIniciais.test.ts src/pages/modals/ModalSelecaoBackGround.test.tsx`.

Resultado da correção de crédito legado: 33 testes direcionados passaram, incluindo
seleção pela interface usando o contexto real, salvamento e reabertura.
`npm run typecheck`,
`npm run build` (incluindo ofuscação) e `git diff --check` passaram.
A suíte completa da revisão anterior teve 1.202 testes aprovados e cinco falhas nas suítes
`fichaConjuracao.test.js` e `conteudoVersionado.test.js`, relacionadas a preparação
e apresentação de magias. Esses arquivos não foram alterados nesta correção.

## Backgrounds revisados

| 2014 | PO | 2024 | PO com equipamentos |
| --- | ---: | --- | ---: |
| Acólito | 15 | Acólito | 8 |
| Artesão da guilda | 15 | Andarilho | 16 |
| Artista | 15 | Artesão | 32 |
| Cavaleiro | 0 | Artista | 11 |
| Charlatão | 15 | Charlatão | 15 |
| Criminal | 15 | Criminoso | 16 |
| Eremita | 5 | Eremita | 16 |
| Forasteiro | 10 | Escriba | 23 |
| Herói Injustiçado | 20 | Fazendeiro | 30 |
| Guilda dos Ladrões das Sombras | 20 | Guarda | 12 |
| Marinheiro | 10 | Guia | 3 |
| Nobre | 25 | Marinheiro | 20 |
| Órfão | 10 | Mercador | 22 |
| Pirata Bêbado | 0 | Nobre | 29 |
| Sábio | 10 | Sábio | 8 |
| Soldado | 10 | Soldado | 14 |

As colunas enumeram catálogos independentes, não equivalências entre backgrounds.
Todos os backgrounds 2024 têm a alternativa de somente 50 PO.

Conferência oficial: [Acólito 2014](https://www.dndbeyond.com/backgrounds/7-acolyte)
e [origens nas regras básicas 2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins).
O descarte da representação física de recipientes de dinheiro é uma escolha de
representação deste aplicativo; recipientes concedidos separadamente não são descartados.

Casos sem quantidade exata permanecem descritos, sem escolher um valor arbitrário:
moedas sem valor informado não creditam dinheiro; as folhas de papel (5 a 9) e os
frascos de tinta da Guilda das Sombras preservam suas descrições. Kits, escolhas
genéricas de ferramentas/jogos e a sacola com seis garrafas do Pirata mantêm os
conjuntos cadastrados. Recipientes já salvos não são removidos ao abrir/importar
a ficha; uma nova seleção explícita reconcilia somente instâncias automáticas.
