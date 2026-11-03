# Área do Mestre — domínio, serviços, hooks e integração

Foram lidos os 30 arquivos de teste fora de `ui`, seus casos parametrizados e os módulos de produção correspondentes. O inventário contém 322 casos executáveis: 317 A, 4 B e 1 E. Não houve evidência suficiente para C ou D. Testes de domínio, hooks, persistência e ZIP que compartilham regras verificam riscos distintos e não foram tratados como duplicatas.

## Falhas históricas investigadas

- `roundTrip.test.ts`: os cinco casos falham antes de chamar produção, na construção da fixture `campanhaCompleta`, por ausência de `TextEncoder` no jsdom. Importação explícita de `TextEncoder` de `util` é suficiente e não altera a aplicação.
- `pdfFichaJson.test.ts`: dois casos parametrizados de PDF e o round trip integrado falham em `PDFDocument.load`. `NodeBlob.arrayBuffer()` fornece um ArrayBuffer de outro contexto; o validador do pdf-lib usa `instanceof` do contexto jsdom e o rejeita. Converter os bytes para `new Uint8Array(...)` no chamador do teste mantém o conteúdo binário e permite validar o PDF real.

## Fragilidades concretas

1. `preparacaoCombate.test.ts`, referência original existente: o título promete proteção de referência trocada, mas só dispara colisões de combate e participante. Acrescentar fixture com duas fichas válidas e mudar a referência da instância existente, mantendo os demais campos válidos.
2. `execucaoCombate.test.ts`, todos os turnos incluindo zero PV: todos iniciam com PV=2. Definir um combatente com PV=0 antes da ativação para que filtragem indevida de inconscientes seja detectada.
3. `useCampanhas.test.ts`, falha de listagem preserva dados: o banco começa vazio e o retry espera `[]`; semear campanha e verificar que permanece acessível.
4. `pdfFichaJson.test.ts`, conversão preserva retrato: a fixture não associa imagem alguma. Associar retrato e verificar vínculo e bytes após a conversão.
5. `preparacaoRoundTrip.test.ts`, cancelar seleções: só manipula uma fixture local e consulta banco, sem executar a preparação. Substituir por preparação real de rascunho sem commit, verificar participantes/PV produzidos e confirmar que agregado original e IndexedDB permanecem intactos. O cancelamento pela UI é responsabilidade de testes de interface.

## Lacunas priorizadas

| Prioridade | Funcionalidade existente | Comportamento pouco protegido | Risco | Teste recomendado |
|---|---|---|---|---|
| Alta | `useCampanhas.garantirPdfFicha` | Deduplicação de chamadas para a mesma ficha, bloqueio de troca/edição durante conversão, commit confirmado seguido de falha de releitura | Duplicação de PDF ou estado local desatualizado sobrescrever dados confirmados | Integração hook + repositório IndexedDB, com barreiras de Promise e falhas no armazenamento |
| Média | `ocr.ts`, entrada Blob | Decodificação de imagem, limite de 80 MP, redimensionamento e liberação de URL/canvas em erro, aborto e timeout de carregamento | Recursos vazando e operação presa em imagens problemáticas | Unitário com Image/canvas controlados; integração em navegador para decodificação real |
| Média | `ocr.ts`, criação tardia do worker | Aborto/timeout antes de `criarMotor` resolver | Worker órfão após cancelamento | Promise controlada para criarMotor, resolver após abortar e verificar terminate |
| Média | `retratos.carregarImagemRecorte` | Cancelamento, imagem ilegível, limite de 50 MP e liberação de URL | Vazamento de URL e falhas em imagens grandes | Unitário de ciclo de vida mais smoke em navegador |
| Média | `validacao.ts` / `persistencia.ts` | Limites de 4096 entidades, 128 MiB de anexos, revisão máxima | Limites removidos por regressão podem permitir agregados excessivos | Testes de fronteira com tamanhos declarados sem alocações volumosas |
| Média | `execucaoCombate.ts` | Limite de rodada em MAX_SAFE_INTEGER durante fechamento de ciclo | Contador inseguro e dados posteriormente recusados | Unitário: avanço dentro da rodada permitido e virada recusada sem mutação |
| Baixa | `persistencia.excluirAnexo` | Anexo usado como `pdfAnexoId` | Mensagem de erro genérica em lugar de conflito de vínculo; validador ainda impede commit inválido | Integração que verifica rejeição e preservação completa da ficha/PDF |

Os motores reais pdf.js/Tesseract são fronteiras de navegador, majoritariamente substituídos por contratos controlados nos testes. O teste de PDF aqui usa o gerador/pdf-lib real, mas não comprova carregamento dos workers em navegador. Cobertura de linhas não elimina esse risco.

## Saneamento executado após diagnóstico

As oito falhas de ambiente foram corrigidas nos próprios testes, preservando a validação de bytes/PDF real. As cinco fragilidades acima foram corrigidas: o cenário de referência inclui ficha/anexo válidos e IDs de participantes novos; o ciclo inclui combatente com PV zero; a falha de listagem preserva uma campanha semeada e a reabre; a conversão associa retrato real e compara seus bytes; a preparação sem commit agora executa `confirmarPreparacao` e verifica tanto o agregado produzido quanto a ausência de mutação/gravação.

Nenhum teste foi removido, consolidado ou ignorado. A contagem permaneceu igual. Nenhum arquivo de produção foi alterado neste escopo.

Validação direcionada: 6 suítes, 58/58 testes aprovados, 24,56 s (`tmp/audit-mestre-after.json`). O inventário foi cruzado com os resultados reais do baseline: 322 casos, incluindo exatamente as oito falhas. Preserva categoria inicial, nome executado, status inicial, categoria final e motivo da alteração. Os cinco casos B/E passaram a A após saneamento; os outros 264 casos deste escopo aguardam a validação final integrada.
