# Persistência de fichas em IndexedDB

Implementação de 18/10/2026.

## Arquitetura

Antes, `FichaProvider` lia e gravava sincronicamente a coleção completa na chave
`fichas` do LocalStorage. O ponteiro legado `ficha` identificava a seleção nas
coleções antigas em array; os envelopes atuais incluem `selectedId`. A camada
`fichaStorage.ts` já centralizava validação, hidratação de modelos e JSON público.
Criação, edição, evolução, seleção, importação e exclusão passam pelo contexto;
JSON e PDF usam os modelos em memória.

Agora, `FichasIndexedDB` concentra o acesso assíncrono ao banco nativo, seguindo
a abordagem já utilizada pela Área do Mestre. O contexto continua responsável
pelos modelos observáveis, autosave e comunicação de erros. Nenhum componente
acessa IndexedDB diretamente. Não foram adicionadas dependências.

O banco `minhafichadnd-personagens`, versão 1, contém:

- `fichas`: registros completos, com `keyPath: id`.
- `meta/estado`: revisão da coleção, seleção e ordem dos identificadores.
- `meta/migracao-localStorage-v1`: conclusão, data, quantidade e problemas encontrados.

`MIGRACOES_FICHAS` organiza upgrades futuros. O banco das campanhas e suas
migrações não foram modificados. A preferência `progressao-recolhida` continua
no LocalStorage.

## Migração e preservação

A inicialização verifica o marcador no IndexedDB antes de acessar o LocalStorage.
Sem marcador, lê a coleção legada em array ou envelope v1 e a seleção aplicável.
Cada ficha é validada e hidratada separadamente pelas funções existentes; campos
adicionais são preservados. Registros inválidos e IDs repetidos são registrados
no console e nos metadados, sem impedir a transferência dos demais.

A migração usa uma transação conjunta de fichas e metadados. Registros existentes
no destino sempre têm prioridade. Novos registros são relidos e comparados dentro
da transação; o sucesso só é confirmado em `oncomplete`. Falhas abortam também o
marcador. Duas inicializações simultâneas verificam o marcador novamente dentro
da transação de escrita, evitando duplicação. Depois da conclusão, repetir a
migração não ressuscita fichas excluídas e não exige acesso ao LocalStorage.

Nenhuma chave legada é apagada ou atualizada, incluindo backups de migrações
anteriores. Erros de sintaxe ou envelope bloqueiam o editor com opções de releitura,
exportação do original e recuperação por coleção corrigida ou backup legado.
Essa recuperação grava o banco novo e mantém os bytes antigos intactos.

## Concorrência e interface

Operações do contexto são enfileiradas. Uma revisão é comparada atomicamente
antes de cada gravação: abas desatualizadas recebem erro e mantêm suas mudanças
em memória para exportação ou releitura. Não há fusão automática entre abas.
A atualização usa a coleção completa em uma transação, mantendo a semântica do
editor anterior; a leitura individual também está disponível por ID.

A interface aguarda o commit para fechar criação, importação, seleção e salvamento,
e para navegar ao sair. O editor só aparece depois da carga, sem lista vazia
provisória. O autosave conserva o debounce de cinco segundos e observa mudanças
aninhadas. Mudanças feitas durante uma gravação continuam pendentes; salvar antes
de sair aguarda também essas alterações. Erros não são apresentados como sucesso.

O formato público de JSON, os exportadores PDF e as regras dos personagens não
foram alterados. Multiclasse 2024 e melhorias visuais permanecem fora do escopo.

## Arquivos

Criados:

- `fichasIndexedDB.ts`: banco, migração, leitura e transações com revisão.
- `fichasIndexedDB.test.ts`: testes isolados de banco, migração e falhas.
- `fichaSerialization.test.js`: testes do contrato JSON extraídos da suíte do contexto.
- Este relatório.

Alterados:

- `FichaContext.tsx`: integração assíncrona, fila, revisões e recuperação.
- `pages/components/GerenciarFichas.jsx`, `pages/criarFicha.js` e
  `pages/AreaMestre.jsx`: aguardam os resultados antes de concluir ações ou sair.
- `setupTests.js`: fábrica IndexedDB isolada por teste e suporte a clone no JSDOM.
- Testes `App`, `FichaContext` (JS/TSX), `backgroundOuroFluxo`,
  `fichaRecursosPersistencia`, `fichaRestauracao`, `progressao`, `rulesets/custos`,
  `accessibility`, `exportacaoSobDemanda` e `navegacaoAreas`: adaptação às transações
  e à inicialização assíncronas, com verificações no banco novo.

## Validação

Os testes cobrem CRUD, listagem, leitura por ID, ambas as edições, preservação de
campos adicionais, JSON importado e exportado, reabertura do banco, seleção,
migração única e múltipla, reexecução, dados inválidos, duplicados, preferência
pelo registro novo, rollback e nova tentativa, abertura negada, conflito entre
abas, autosave, alterações durante gravação, eventos de saída e StrictMode.
As integrações exercitam criação, edição, evolução, troca de ficha, exclusão,
importação com colisão, restauração de métodos, slots, morte, ouro e ação de PDF.
Não há infraestrutura Playwright/Cypress ou script E2E no projeto.

Resultados finais:

- `npm run typecheck`: passou.
- `npm run lint`: dois erros preexistentes em `pages/ajustesFeature.test.js`,
  linhas 30 e 44 (`testing-library/no-node-access`); nenhum nos arquivos alterados.
- `CI=true npm test -- --watchAll=false --runInBand`: 1.708 testes passaram,
  8 falharam; 90 de 92 suites passaram.
- Os 23 testes do contexto e do repositorio IndexedDB passaram, assim como as
  integracoes de criacao, reabertura, navegacao, importacao, exclusao, progressao,
  recursos e exportacao sob demanda.
- `npm run build`: passou, incluindo ofuscacao.
- `npm run build:verify`: passou; assets OCR preservados.
- E2E: nenhum runner/script disponivel; integracoes existentes executadas.

Falhas anteriores, reproduzidas tambem com o setup de testes original:

- `features/areaMestre/pdfFichaJson.test.ts`: tres falhas em `PDFDocument.load`
  por incompatibilidade de `ArrayBuffer` entre contextos.
- `features/areaMestre/roundTrip.test.ts`: cinco falhas por `TextEncoder` ausente
  no JSDOM.

Esses arquivos e o teste com erros de lint nao foram alterados. A validacao
global ainda tem essas pendencias preexistentes.
Logs locais em `tmp/migracao-indexeddb/`: `tests.log`, `typecheck.log`,
`final-lint.log`, `final-build.log`, `build-verify.log`, `baseline-pdf.log` e
`baseline-roundtrip.log`.

## Limitações

- IndexedDB é local à origem e ao perfil do navegador; apagar os dados do site
  remove o banco. Os backups legados preservados não recebem edições novas.
- Encerramento forçado do processo durante o debounce pode perder mudanças ainda
  não confirmadas. `beforeunload` pede confirmação com mudanças pendentes;
  `pagehide` e `visibilitychange` iniciam a gravação, mas o navegador não permite
  aguardar Promises no encerramento. Navegação interna e salvar manualmente
  aguardam a confirmação da transação.
- A revisão é da coleção inteira: conflitos de abas também são detectados quando
  elas editam fichas diferentes. O usuário pode exportar as alterações em memória.
- Permanecem os limites de validação existentes da coleção (500 fichas e 5 MiB);
  a migração não muda o contrato público ou as regras de hidratação.
