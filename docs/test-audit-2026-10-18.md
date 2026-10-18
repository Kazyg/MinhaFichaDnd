# Auditoria e saneamento dos testes — 18/10/2026

Revisão de partida: `a3df02f`. Ambiente: Windows, Node 24.14.0, npm 11.9.0, dependências já instaladas a partir do projeto. Nenhuma regra de negócio, biblioteca de conteúdo ou dependência foi alterada. A árvore Git estava limpa no início.

## 1. Diagnóstico inicial e método

Foram encontrados **96 arquivos de testes e 1.746 casos executáveis**. A execução inicial teve **1.738 aprovações, oito falhas e nenhum caso ignorado**, em 307,271 s. Duas suítes falharam; 94 passaram. Não há snapshots. O lint apresentou dois erros e nenhum warning; o typecheck passou. O build inicial compilou e concluiu a ofuscação com código de saída zero.

A estrutura inspecionada compreende `src/api`, `src/bibliotecas`, `src/leveis`, `src/pages`, `src/utils`, `src/features/areaMestre`, `scripts`, `public` e o workflow `.github/workflows/validate.yml`. São 530 arquivos sob `src`. Não foram encontrados arquivos `AGENTS.md` nem outro conjunto de testes fora de `src`.

Ferramentas existentes: Jest 27 e JSDOM via `react-scripts` 5, React Testing Library, `jest-dom`, `user-event` e `fake-indexeddb`. `src/setupTests.js` cria uma fábrica IndexedDB por caso e adapta `structuredClone`. Alguns testes de anexos usam `Blob` do Node para leitura binária. Os testes de estilo usam PostCSS sobre os arquivos CSS reais. Os limites de navegador, canvas, OCR e PDF.js são frequentemente substituídos por contratos controlados; a geração de PDF também possui testes com `pdf-lib` real e o template do projeto.

| Comando disponível | Uso nesta auditoria |
| --- | --- |
| `npm run lint` | ESLint de todo `src`; executado antes e depois |
| `npm run typecheck` | `tsc --noEmit`; executado antes e depois |
| `npm test -- --watchAll=false --runInBand --coverage --json --outputFile=...` | Suíte completa e cobertura inicial/final |
| `npm test -- --watchAll=false --runInBand --runTestsByPath ...` | Validações direcionadas das alterações |
| `npm run build` | Build inicial completo, incluindo ofuscação |
| `npm run build:verify` | Build final em temporário próprio e verificação de integridade dos assets OCR |

Não existe comando independente de integração: os testes de hooks, interfaces completas, IndexedDB, ZIP e round trips pertencem à mesma execução Jest e foram executados nela. **Não existe harness nem comando E2E de navegador configurado**; essa validação não foi executada. `obfuscate` é uma etapa já incluída nos builds, não uma suíte adicional.

A fase diagnóstica preservou produção e testes. O saneamento começou depois de encerrada a execução inicial da suíte e das verificações de lint/tipos; o build inicial já havia compilado e continuava ofuscando seus artefatos. Revisões paralelas dividiram fichas/regras, Mestre sem UI, Mestre UI e páginas/utilitários, com responsabilidade exclusiva por arquivo. A revisão leu todos os corpos dos casos, tabelas parametrizadas e produção correspondente; o inventário foi reconciliado com cada `assertionResult` real do Jest. A extração automática de títulos/assertions serviu como índice de evidências, não como critério automático de aprovação.

**Inventário completo:** [CSV por arquivo e caso](test-audit-2026-10-18-inventory.csv). Cada linha identifica módulo, arquivo, linha inicial, ordinal do caso, parâmetros, nome anterior/final, categoria anterior/final, justificativa, recomendação, ação e resultados das duas execuções. O ordinal diferencia expansões que possuem o mesmo título. Foram verificadas ausência de linhas excedentes e correspondência de todos os 1.746 casos; não houve auditoria por amostragem.

**Evidências de execução:** [JSON consolidado](test-audit-2026-10-18-evidence.json), com resultados e tempos por arquivo, falhas iniciais, cobertura parcial e verificações finais. Os logs integrais e resultados intermediários ficaram em `tmp/audit-*`, diretório local ignorado pelo Git; os resultados duráveis necessários estão nos dois arquivos acima.

### Divergência em relação aos 1.708 históricos

A diferença observada é **+38 casos**. A comparação usa casos expandidos de `test.each`/`describe.each`, não quantidade de declarações `test(...)`. O catálogo sozinho responde por 468 casos; contar declarações ou arquivos produz totais diferentes.

O commit atual `a3df02f` alterou testes de contexto, progressão, serialização, multiclasses e navegação e introduziu arquivos de IndexedDB, exclusão de fichas e seletores de talentos. Portanto, o número histórico não descreve o checkout auditado. O relatório anterior não informa revisão/comando/resultado bruto; não é possível atribuir exatamente os 38 casos a uma comparação histórica reproduzível sem essa referência. O total atual foi confirmado pela descoberta e execução Jest, sem testes `skip`, `todo` ou `only` encontrados na busca de código. Não há motivo para reduzir a suíte até 1.708.

### Cobertura e confiabilidade iniciais

A coleta Istanbul disponível produziu dados de 344 arquivos, porém **falhou ao instrumentar `src/features/areaMestre/pdfMotor.ts`**: Babel tenta interpretar `import.meta` como script. Os números são parciais, não uma cobertura integral aprovada. Não foram acrescentadas exclusões nem alterado o módulo de produção para esconder o erro.

Cobertura parcial inicial: linhas **84,73%** (6.244/7.369), statements **81,98%**, branches **77,69%** e funções **79,73%**. O JSON registra denominadores e distribuição por módulo. Percentuais de linhas complementam a leitura comportamental e não demonstram qualidade de assertions.

Não foi comprovada flakiness de execução: os testes afetados tiveram validação direcionada e integrada, mas isso não equivale a uma campanha estatística de repetições. Foram encontrados riscos concretos de isolamento: `fetch`, `crypto`, largura de tela e spies sem restauração em falha, ficha mutável compartilhada e interações assíncronas sem espera adequada. O aviso React de `act` em persistência de recursos foi corrigido usando `userEvent.click` aguardado, sem ocultar `console.error`.

## 2. Correções de lint e das oito falhas

### Lint

Os dois erros eram `testing-library/no-node-access` em `src/pages/ajustesFeature.test.js`, nas verificações de `closest('[inert]')` e `document.querySelector('[inert]')`. A intenção era assegurar que a modal fosse interativa e que o foco retornasse ao acionador. Foram substituídas por verificações do foco do título da modal e do botão de seleção após confirmar. As interações e assertions sobre efeito Defesa/Duelismo, ausência de duplicação e fechamento foram preservadas. Não foram desabilitadas regras nem adicionadas supressões.

Um wrapper de `act` introduzido durante o saneamento foi recusado pelo lint; ele foi substituído por interações `userEvent` aguardadas e o lint completo foi executado novamente. Esse erro intermediário não pertence ao diagnóstico original.

### Área do Mestre

| Arquivo e casos afetados | Comportamento esperado | Causa e correção |
| --- | --- | --- |
| `roundTrip.test.ts`: cinco casos — round trip completo; abertura/salvamento; rollback na abertura; colisão de IDs; cota no segundo arquivo | Preservar bytes, vínculos, estados e atomicidade no ciclo IndexedDB → ZIP → campanha | A fixture falhava antes de chamar produção porque JSDOM não fornece `TextEncoder`. Importação explícita de `TextEncoder` de `util` no teste. |
| `pdfFichaJson.test.ts`: geração por edição 2014/2024 e round trip integrado, três casos | Gerar PDF real legível, preservar JSON e recuperar anexos/vínculos após persistência/backup | `NodeBlob.arrayBuffer()` retorna objeto de outro contexto; `pdf-lib` o recusa em sua verificação por `instanceof`. Os dois pontos de leitura agora passam `new Uint8Array(bytes)` local. Os bytes e a validação do PDF real foram preservados. |

As oito falhas eram de ambiente de teste, não de regras de campanha/combate. Os nomes completos e mensagens originais estão em `failuresBefore` no JSON. Não houve exclusão, `skip`, alteração de expectativa para aceitar resultado incorreto ou captura de exceção para evitar falha. A validação direcionada dos seis arquivos de domínio/hook alterados passou em **58/58 casos**, 24,56 s.

## 3. Auditoria de qualidade e classificação

A classificação inicial descreve o que existia antes do saneamento; a final registra o resultado da intervenção. A significa proteção relevante e eficaz **dentro do contrato exercitado**, não ausência de lacunas em toda a funcionalidade. B inclui cenário incompleto, isolamento insuficiente e verificações que prometem comportamento visual além do que JSDOM/CSS estático demonstra. E foi reservado ao caso que não executava a operação de produção pretendida. C/D exigiam evidência de ausência de proteção adicional; não houve caso comprovado.

| Categoria | Inicial | Proporção inicial | Final | Proporção final |
| --- | ---: | ---: | ---: | ---: |
| A — relevante e eficaz | 1.691 | 96,85% | 1.739 | 99,60% |
| B — relevante, mas fraco/parcial | 54 | 3,09% | 7 | 0,40% |
| C — duplicado sem proteção adicional | 0 | 0% | 0 | 0% |
| D — desnecessário | 0 | 0% | 0 | 0% |
| E — inválido | 1 | 0,06% | 0 | 0% |
| **Total** | **1.746** | **100%** | **1.746** | **100%** |

| Módulo | Arquivos | Casos | A/B/C/D/E inicial | A/B/C/D/E final |
| --- | ---: | ---: | --- | --- |
| Fichas: domínio e persistência | 19 | 680 | 670/10/0/0/0 | 680/0/0/0/0 |
| Regras 2014/2024 | 5 | 77 | 75/2/0/0/0 | 77/0/0/0/0 |
| Aplicação | 1 | 5 | 4/1/0/0/0 | 5/0/0/0/0 |
| Catálogos | 1 | 468 | 468/0/0/0/0 | 468/0/0/0/0 |
| Mestre: domínio e persistência | 30 | 322 | 317/4/0/0/1 | 322/0/0/0/0 |
| Mestre: interface | 22 | 118 | 103/15/0/0/0 | 112/6/0/0/0 |
| Progressão | 2 | 10 | 8/2/0/0/0 | 10/0/0/0/0 |
| Páginas e componentes | 14 | 54 | 45/9/0/0/0 | 53/1/0/0/0 |
| PDF e utilitários | 2 | 12 | 1/11/0/0/0 | 12/0/0/0/0 |

As 468 verificações parametrizadas do catálogo inspecionam entradas reais e seus contratos; não foram removidas simplesmente por repetirem o mesmo corpo. Da mesma forma, regra unitária, modal, hook e round trip não foram tratados como duplicatas: podem detectar erros diferentes de cálculo, integração, serialização, migração e commit.

### Sete B mantidos com recomendação

São três casos de `prepararCombateLayout.test.ts`, três de `roletaLayout.test.ts` e um de `ModalMagias.test.tsx`. Os seis primeiros verificam declarações CSS reais e continuam úteis para detectar regressões de estilo, mas não provam geometria, cascade completa, scroll ou ausência de overflow. O último valida o algoritmo de ajuste de fonte com dimensões simuladas; não demonstra medição real de texto. Foram mantidos e classificados explicitamente como proteção parcial. A complementação em navegador requer introduzir e definir um harness E2E/visual, fora das correções pequenas desta auditoria.

## 4. Testes removidos, consolidados ou substituídos

**Nenhum caso completo foi removido e nenhuma tabela parametrizada foi reduzida.** Não se encontrou justificativa suficiente para eliminar proteção em troca de menor contagem.

Foi removido um `waitFor` literalmente repetido e consecutivo em `AreaMestreWorkspace.test.tsx`; ele repetia a mesma condição sobre duas instâncias, sem nova ação entre as verificações. O restante do fluxo persiste e recupera os dados reais.

O caso E de `preparacaoRoundTrip.test.ts` alterava apenas uma fixture local e verificava que o banco não mudava. Isso não demonstrava a preparação/cancelamento prometidos. O mesmo caso foi substituído por execução real de `confirmarPreparacao` sem commit: verifica combate preparado, três participantes, novas instâncias e PV alterados no resultado, além de agregado original e registros IndexedDB intactos. O título passou a indicar precisamente esse contrato. O cancelamento pela interface continua sendo responsabilidade dos testes UI, não inferência desse teste de domínio.

## 5. Testes melhorados e regressões detectáveis

**48 casos B/E passaram a A**, contabilizando as expansões parametrizadas e os casos afetados pelo mesmo cleanup compartilhado. As correções de lint/ambiente também beneficiam casos que já eram A. O CSV fornece a ação individual por caso; abaixo estão todos os grupos relevantes de saneamento.

| Arquivo(s) | Verificação acrescentada ou corrigida |
| --- | --- |
| `App.test.js` | Cancelar seleção deixa a coleção IndexedDB vazia, além de não gravar o legado no localStorage. |
| `FichaContext.test.js` | Mais dez segundos após autosave sem nova alteração não geram outro save; StrictMode preserva IDs únicos no repositório e provider. O título foi limitado a unicidade dos dados, sem impor quantidade de chamadas internas. |
| `fichasIndexedDB.test.ts` | Entrada realmente contém `__proto__` vindo de JSON; registro inválido é isolado sem poluir protótipos. |
| `fichaSerialization.test.js` | Árvore acima do limite de profundidade é efetivamente rejeitada. |
| `progressao.test.js` | Recusas com array/point buy/origem inválidos preservam atributos; saiu a assertion tautológica sobre uma string constante. |
| `conteudoVersionado.test.js` | Referência bem formada com revisão futura preserva snapshot no round trip e não concede benefício ativo indevido. |
| `catalogoEquipamentosMagicos.test.tsx` | Hover e saída do mouse realmente exercitados, preservando teclado, Escape e toque. |
| `LevelUm.distribuicao.test.js` | Rolagem determinística 1/2/4/6 exige 12 em cada atributo: detecta soma de 3d6 ou descarte do maior, que o antigo teste de intervalo aceitaria. Spy restaurado após cada caso. |
| `custos.test.js` | Além de zero leituras de catálogo de magias, reabertura/subida não aumentam chamadas de talentos em relação à criação. Sem limiar absoluto arbitrário; spies restaurados mesmo em falha. Removido log de diagnóstico. |
| `fichaRecursosPersistencia.test.js` | Interações aguardadas com `userEvent` concluem o ciclo assíncrono de atualização/persistência, eliminando warnings de `act`. |
| `fichaSeletores.test.js`, `fichaRestauracao.test.js`, `pendenciasPdf.test.js` | Restauração garantida de fetch, mocks e largura de tela, inclusive quando o teste falha; os 11 casos do último arquivo compartilham o cleanup de fetch corrigido. |
| `ModalSelecao.test.js` | Ficha nova por cenário; Meio-Elfo restaurado exige bônus exatos de carisma/destreza/sabedoria 2/1/1. |
| `Selecao2024.test.tsx` | Trocar lista limpa tanto truque quanto magia de primeiro círculo; editar o talento existente substitui a escolha sem duplicar a fonte nem manter a magia anterior. |
| `GerenciarFichas.exclusao.test.jsx` | Depois de retorno falso/exceção, reabre confirmação e executa retry bem-sucedido, com duas chamadas e ID correto. |
| `AbaMagias.test.js` | Slot acionado exige contador 1 e marca individual consumida; `toBeDefined` sozinho aceitaria contador zero. |
| `navegacaoAreas.test.js` | Título corrigido para falha ao sair, fluxo realmente executado. Não foi criada uma expectativa fictícia de troca de ficha; essa integração permanece recomendada. |
| `preparacaoCombate.test.ts` | Referência da ficha original realmente trocada com o restante do agregado válido; a guarda de identidade deve rejeitar. |
| `execucaoCombate.test.ts` | Um combatente realmente inicia com zero PV e continua na ordem/turnos conforme contrato existente. |
| `useCampanhas.test.tsx` | Falha de listagem ocorre com campanha persistida; retry deve recuperá-la, não apenas retornar lista vazia. |
| `pdfFichaJson.test.ts`, `ui/JsonPdf.test.tsx` | Retrato real semeado; conversão/primeira abertura preservam ID, vínculo e bytes, além de PV e PDF. |
| `ui/Combates.test.tsx` | Consulta da ficha vinculada no histórico realmente aciona callback esperado. |
| `ui/PainelPV.test.tsx` | Fração e inteiro inseguro não persistem; reduzir máximo positivo limita PV atuais ao novo máximo; máximo zero continua sem presumir informação. |
| `ui/VisualizadorFicha.test.tsx` | Renderização confere CA 16, atributos, slots e PV históricos, além da mera presença dos títulos. |
| `ui/RecortarRetrato.test.tsx` | Sugestão do PDF é revisada e confirmada; payload comprova o recorte escolhido. |
| `ui/CondicoesCombate.test.tsx` | Descritor global de crypto restaurado no teardown, evitando vazamento entre cenários. |
| `ui/AreaMestreWorkspace.test.tsx` | Coleções abertas por Enter/Space em botão nativo, em vez de apenas cliques para um título que prometia teclado. |

Nenhuma regra de produção foi alterada para satisfazer esses testes. A preservação de dados é exercitada com armazenamento real simulado quando esse é o contrato; mocks de contexto e callbacks continuam nos testes de componente em que isolam uma fronteira legítima.

## 6. Lacunas identificadas e prioridades

As lacunas abaixo dizem respeito a código existente. Não pressupõem conteúdo novo da biblioteca nem ausência total de testes do módulo; indicam os comportamentos que continuam insuficientemente protegidos.

| Prioridade | Funcionalidade / referência | Comportamento pendente | Risco de regressão | Teste recomendado |
| --- | --- | --- | --- | --- |
| Alta | `CriacaoFicha.tsx` — troca de raça/espécie e origem | Integração de limpeza de sub-raça/efeitos, arquivamento de atributos anteriores, preservação de idiomas livres e troca de talento de origem; os testes das modais não percorrem todos esses callbacks do pai | Efeitos antigos ou atributos/idiomas indevidos sobrevivem a uma troca | Integração UI + Ficha real + round trip, por edição, com escolhas antes/depois explícitas |
| Alta | `ModalInventarioItens.tsx` | Compra usando saldo misto ouro/prata/cobre, troco, fundos insuficientes e cancelamento; nenhuma linha do módulo foi executada na coleta inicial | Dedução monetária incorreta ou item concedido sem pagamento | Componente com Ficha real, preços fracionários e callbacks; conferir moedas e inventário após reabrir |
| Alta | `fichasIndexedDB.ts` | `onblocked`, `onversionchange`, fechamento de conexão antiga e reabertura após erro | Atualização de banco em outra aba impede salvar/reabrir | Integração fake-indexeddb e E2E com duas abas |
| Alta | `FichaContext` — conflito e recuperação | Dois providers em conflito real: conservar pendências, baixar JSON da memória e reler explicitamente | Perda ou descarte inadvertido da edição pendente | Integração com repositórios compartilhando fábrica; verificar exportação e resolução |
| Alta | `FichaContext` — backup de recuperação | Restaurar última cópia válida, backup ausente/inválido e exportar os bytes corrompidos originais | Fluxo de recuperação falha no momento de perda de acesso à coleção | Integração UI com backup real e feedback de falha; manter original intacto |
| Alta | `useCampanhas.garantirPdfFicha` | Chamadas concorrentes para a mesma ficha; bloqueio de troca/edição durante conversão; commit concluído seguido de falha na releitura | PDF duplicado ou estado local antigo sobrescreve dado confirmado | Hook + IndexedDB com promises controladas e falha após commit |
| Alta | `ui/ImportarFicha` | Cancelar OCR/trocar arquivo enquanto reconhecimento anterior ainda está pendente | Resultado antigo sobrescreve revisão do arquivo novo | Integração UI com promises controladas, AbortSignal e resolução fora de ordem |
| Média | `pdf.ts` / `pdfMotor.ts` | Extração/renderização reais, limites de páginas/trechos, cancelamento e destruição do documento em falha | Workers presos, uso excessivo de memória ou documento incorreto | Contratos do adaptador com documento controlado e smoke no navegador com worker real |
| Média | `ocr.ts` | Blob real, redimensionamento/limites, URL/canvas liberados em erro/timeout; worker criado depois do aborto | Vazamento de recursos ou operação presa | Unitários de ciclo de vida com promessa tardia e navegador para decodificação real |
| Média | `retratos.ts` / `ui/RecortarRetrato` | Imagem ilegível/grande, aborto, drag por pointer com limites e resultado tardio após cancelar | Recorte incorreto e URLs/recursos não liberados | Unidade com Image controlada, integração de coordenadas e smoke de pointer |
| Média | `ui/EditarFichaImportada` | Falha/rejeição ao salvar mantém rascunho e permite retry, inclusive ausência do documento original | Perda silenciosa das edições | Componente com falha seguida de sucesso e original preservado |
| Média | Histórico de combate | Snapshot de condições e indisponibilidade de ficha removida; callback de ficha válida foi fortalecido | Histórico mostra estado atual em lugar do encerrado ou oferece acesso inválido | Componente com snapshots e vínculos válidos/removidos |
| Média | `validacao.ts` / `persistencia.ts` | Fronteiras de 4.096 entidades, 128 MiB e revisão máxima | Agregados excessivos ou revisões inseguras aceitos | Fronteiras sem alocar arquivos grandes; rejeição sem commit parcial |
| Média | `execucaoCombate.ts` | Virada de rodada em `MAX_SAFE_INTEGER` | Contador inválido e perda de capacidade de persistir | Unidade: avançar dentro da rodada, recusar virada e preservar estado |
| Média | Fórmulas de magias | Círculo fracionário, >9, abaixo do mínimo e modificador negativo | Fórmula incorreta em dados importados/adulterados | Unidade parametrizada com resultados e recusas exatos |
| Média | Layout responsivo, fonte e workers | Os sete B restantes e carregamento real de OCR/PDF.js | Overflow, foco/scroll/pointer ou assets funcionam no mock e falham no navegador | Definir harness E2E/visual e smoke 390 px/desktop, sem substituir contratos unitários |
| Média | Gerenciar fichas — pendências | Selecionar outra ficha com `salvarPendentes` falso/rejeitado; o caso de navegação existente só percorre saída | Alternância descarta edição que não pôde ser salva | Integração do gerenciador com duas fichas, falha e retry; conferir ID selecionado e rascunho |
| Baixa | `persistencia.excluirAnexo` | Anexo usado especificamente como `pdfAnexoId` | Rejeição genérica em lugar de diagnóstico de vínculo; validador ainda evita commit inválido | Integração: rejeitar e preservar agregado/PDF |
| Baixa | Resumo de características | Negrito e descrição vazia | Perda de ênfase ou apresentação indevida | Renderização pequena com conteúdo vazio e destaque |

Indicadores de cobertura que ajudaram a priorizar a leitura: `ModalInventarioItens.tsx` 0/97 linhas, `CriacaoFicha.tsx` 48/144 (33,33%), `pdf.ts` 5/47 (10,63%) e `NivelBlock.tsx` 61/148 (41,21%), na coleta inicial parcial. São evidências de caminhos não exercitados, não prova automática de erro nem justificativa para adicionar testes mecânicos de linhas. Regras de atributos/proficiência/conjuração/equipamentos já possuem testes de domínio; a lacuna mais relevante nesses fluxos é a ligação entre escolhas, limpeza de efeitos e persistência pela UI.

## 7. Comparativo e validação final

| Métrica | Antes | Depois |
| --- | ---: | ---: |
| Total de testes descobertos/executados | 1.746 / 1.746 | 1.746 / 1.746 |
| Testes aprovados | 1.738 | 1.746 |
| Testes falhando | 8 | 0 |
| Testes ignorados | 0 | 0 |
| Suítes/arquivos aprovados | 94/96 | 96/96 |
| Erros / warnings de lint | 2 / 0 | 0 / 0 |
| Erros de typecheck | 0 | 0 |
| Cobertura parcial: linhas | 84,73% | 84,73% |
| Cobertura parcial: statements | 81,98% | 82,02% |
| Cobertura parcial: branches | 77,69% | 77,75% |
| Cobertura parcial: funções | 79,73% | 79,80% |
| Tempo Jest completo com cobertura | 307,271 s | 206,742 s |
| Build completo | Aprovado (`build`) | Aprovado (`build:verify`, 60,77 s) |
| E2E de navegador | Não configurado/não executado | Não configurado/não executado |

O comando final de testes terminou com código zero: **96 suítes e 1.746 testes aprovados**, sem casos ignorados e sem warnings de `act`. O lint completo terminou com código zero em 11,31 s; o typecheck, com código zero em 9,89 s. O build final compilou, ofuscou e confirmou que worker, kernels e idiomas de OCR foram preservados; o temporário foi removido pelo script existente. `git diff --check` não apresentou erros de whitespace.

**A cobertura continua parcial:** a execução final repetiu o erro de instrumentação em `pdfMotor.ts`, apesar de o Jest retornar zero para os testes. Os 344 arquivos/denominadores permaneceram iguais, permitindo comparar somente esse conjunto instrumentado; não se declara a coleta completa aprovada. A cobertura de linhas inalterada, apesar de assertions melhores, ilustra a diferença entre execução de linhas e eficácia dos testes.

Os tempos comparam execuções no mesmo ambiente, mas com caches e carga concorrente diferentes. Não representam benchmark nem ganho de desempenho causado pelo saneamento. As alterações afetam testes; não houve implementação ou refatoração de produção.

A validação integrada inclui todos os testes unitários e de integração disponíveis. As execuções direcionadas também verificaram os arquivos alterados; uma nova consulta de teste UI inicialmente buscou um elemento oculto pela modal, foi corrigida e teve reexecução aprovada. Nenhum resultado intermediário foi contado como aprovação final.

## 8. Recomendações futuras e mutation testing

1. Priorizar as lacunas altas de dados e seleção antes de expandir os callbacks de criação e o fluxo de compras; aproveitar os cenários existentes em vez de criar uma segunda suíte paralela.
2. Definir um pequeno harness de navegador para layout, workers, decodificação e duas abas. Os testes JSDOM atuais continuam necessários e não devem ser removidos em troca dos E2E.
3. Corrigir a compatibilidade de instrumentação de `import.meta` no pipeline de cobertura ou avaliar o provider V8 em execução separada. Comparar denominadores antes de substituir a referência atual; não excluir silenciosamente o motor PDF.
4. Incluir identificador/cenário nos títulos parametrizados de importação e ordem inválida. Há expansões com títulos iguais, mas dados/erros distintos; isso dificulta diagnóstico e não comprova duplicação. O CSV já mantém ordinal e parâmetros para diferenciá-las.
5. Preservar teardown garantido, interações aguardadas e promises controladas. Evitar delays arbitrários e assertions baseadas somente em contagem de chamadas de mock quando há resultado observável disponível.

Não há Stryker/mutation runner instalado, configuração nem script de mutation no projeto/lockfile. Não foram instaladas dependências nem executada campanha de mutações. O uso seletivo é viável em módulos puros como validação de distribuição, requisitos de multiclasse, slots e vínculos de equipamento, mas a integração completa precisaria compatibilizar CRA/Jest, TypeScript e módulos de navegador. A revisão identificou manualmente mutantes plausíveis: autosave repetido, alternância de slot inoperante, distribuição recusada com mutação parcial e 3d6 no lugar de 4d6. As assertions foram fortalecidas para esses resultados; isso **não é um mutation score medido**. Recomenda-se piloto pequeno, com custo e escopo definidos, após a decisão sobre tooling.

## 9. Conclusão

A suíte possui proteção significativa de regras e persistência e ficou mais confiável com as oito falhas ambientais resolvidas, lint limpo, isolamento corrigido e cenários verdes que agora verificam seus contratos completos. A quantidade foi preservada porque não houve evidência suficiente para remover casos inteiros. A revisão não demonstrou ausência de regressões possíveis: permanecem sete contratos visuais parciais, cobertura incompleta do motor PDF e lacunas priorizadas de concorrência, recuperação e integração das escolhas.

Há base para iniciar a próxima implementação com testes de regressão por comportamento, desde que os caminhos alterados de criação, limpeza de efeitos e persistência recebam os cenários altos correspondentes durante o trabalho. A aprovação da suíte não deve ser interpretada como autorização para ampliar regras sem proteger esses vínculos. Não foi iniciada a implementação da nova biblioteca nesta auditoria.
