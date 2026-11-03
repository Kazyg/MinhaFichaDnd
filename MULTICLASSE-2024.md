# Correção de multiclasse 2024

## Diagnóstico

O estado encontrado já validava requisitos em `erroSelecaoClasse`, no domínio
`Ficha.selecionarClasseNoNivel` e no fluxo de criação/evolução de `CriacaoFicha`.
As doze classes de 2024 estavam presentes. O modal, porém, permitia selecionar
opções inválidas e só explicava o impedimento depois da seleção. As regras e
suas descrições também estavam duplicadas em uma função booleana e uma tabela.

## Implementação

- `src/api/rulesets/progressao.ts`: estrutura única dos requisitos das doze
  classes e função `avaliarMulticlasse(classesAtuais, desejada, atributos,
  versaoRegras)`. Retorna permissão, requisitos por classe, alternativas,
  valores, mínimos e condições atendidas/ausentes. Grupos representam OU;
  atributos no mesmo grupo representam E. O mínimo é inclusivo: 13.
- A confirmação continua passando pela validação de domínio antes de qualquer
  mutação. Primeira classe e novos níveis de uma classe já adquirida ficam
  dispensados. Todas as classes anteriores ao nível escolhido são verificadas.
- O cálculo existente dos atributos efetivos é reutilizado, com aumentos
  adquiridos antes do nível escolhido; aumentos futuros não liberam escolhas
  retroativas. Não há cache de elegibilidade.
- `src/leveis/NivelBlock.tsx`: fornece ao modal somente as classes permitidas,
  conforme a correção de apresentação solicitada. Classes indisponíveis não
  aparecem na lista nem exibem textos de impedimento.
- `src/pages/modals/ModalSelecaoClasse.tsx`: mantém a validação da confirmação,
  sem descrições adicionais por opção. A validação de domínio permanece ativa.
- `src/api/rulesets/multiclasse.test.js`: novos testes do resultado estruturado,
  catálogo completo, limite 12/13, três classes antes de uma quarta, aumento
  que libera escolha e dispensas das duas edições.
- `src/api/fichaPersonagem/progressao.test.js`: verifica a ausência de classes
  indisponíveis e a atualização Carisma 12 → 13, que faz Feiticeiro aparecer
  e permite confirmar a escolha pela UI.

O comportamento de 2014, inclusive suas mensagens, foi preservado. Não foram
alterados a persistência, o carregamento, a exportação ou os dados de fichas
antigas. Alterações de IndexedDB já existentes no diretório foram preservadas.

## Cobertura

A suíte de progressão existente complementa os novos testes: condições E/OU,
requisitos da classe de origem, bloqueio atômico da confirmação, aumentos
permanentes e futuros, classes existentes com atributos baixos, criação,
reabertura, fluxo React e regressões 2014. As integrações usam o repositório
IndexedDB de testes. Também foi executada a suíte de persistência existente.

## Fonte

[D&D Beyond — Creating a Character, Multiclassing](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character#Multiclassing):
requisito 13 nos atributos primários da nova classe e das classes atuais.

Não foi encontrada configuração Playwright, Cypress ou suíte E2E separada.
A interface foi verificada por testes React; não foi feita inspeção visual
manual em navegador desktop/mobile.

## Resultados das verificações

- `npm run typecheck`: passou.
- `npm run lint`: somente os dois erros preexistentes de
  `testing-library/no-node-access` em `src/pages/ajustesFeature.test.js:30,44`;
  nenhum aviso novo.
- `npm run build`: passou, incluindo ofuscação.
- `npm run build:verify`: passou; arquivos OCR preservados.
- Multiclasse, progressão e navegação: 80 testes passando em três suítes,
  incluindo o teste final de atualização dos atributos.
- Suíte completa: 1.718 passaram, 13 falharam, 93 suítes executadas. Das falhas,
  oito correspondem ao baseline da Área do Mestre (`pdfFichaJson.test.ts` e
  `roundTrip.test.ts`); cinco foram timeouts de 5 segundos em navegação,
  exportação e encerramento durante execução concorrente com o build.
  Todas as suítes com esses timeouts passaram na repetição: navegação está
  incluída nos 80 testes acima; exportação e encerramento somaram mais quatro
  testes passando. Não houve falha adicional reproduzida nessas repetições.
- A suíte completa passou pelos testes existentes de IndexedDB,
  serialização e restauração. Nenhuma alteração na implementação de
  persistência foi necessária.
- `git diff --check`: passou.

A execução completa começou antes da inclusão do último teste de interface;
a execução focada posterior cobre a versão final. Não foi repetida toda a suíte
após esse acréscimo. As oito falhas do baseline e os dois erros de lint não
foram corrigidos, conforme o escopo solicitado.
