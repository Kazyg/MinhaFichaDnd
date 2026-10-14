# Revisão técnica e preparação para portfólio — 13/10/2026

**Atualização posterior:** o usuário autorizou o merge de `feat/regras-2024`. A integração e suas novas validações estão no [relatório do merge](../merge-regras-2024-2026-10-13/RELATORIO.md). A falha de Iniciado e a proposta de bloqueio abaixo são o histórico da revisão anterior, não o resultado final da integração.

Execução no Windows, Node 24.14.0, npm 11.9.0, fuso America/Sao_Paulo. Base Git `66a36b5`, checkout inicialmente limpo. Sem commit, push, deploy, subagentes, troca de stack ou `audit fix`. Nenhum AGENTS.md localizado no projeto nem nos ancestrais consultados. Logs desta pasta pertencem a esta execução; relatórios de 06–09/10 são históricos.

## Diagnóstico e ordem recomendada

| Prioridade | Problema confirmado | Arquivos e encaminhamento |
| --- | --- | --- |
| Alta | Talentos PHB2024 são marcados como suportados, mas `phb` não é consumido pelo domínio | `src/api/rulesets/dnd2024/conteudoPhb.ts`, `talentosConteudo.ts`, `escolhasProgressao.ts`, `fichaSeletores.ts`. Iniciado em Magia é aceito sem escolhas/concessões. Bloqueio amplo de novas seleções sujeito à aprovação; preservar dados existentes. |
| Alta | Licença do catálogo integral, traduções, imagens e template PDF não comprovada | `src/bibliotecas`, `src/api/rulesets/dnd2024/phb2024.json`, `public`, `PDF`, inventário F7. Não recomendar nova divulgação pública antes de resolver. |
| Média | Testes desatualizados após expansão e retirada de links da UI | `conteudoVersionado.test.js`, `accessibility.test.js`. Corrigidas expectativas de edição/fonte e sequência de foco; a expectativa que expõe Iniciado incompleto foi mantida. |
| Média | Patch compatível de segurança de Router disponível | `package.json`, `package-lock.json`: 6.30.4 → 6.30.6, sem major. |
| Média | Toolchain ainda tem 79 ocorrências altas e bundle grande | Auditoria e build desta pasta; mitigações e alcance abaixo. Atualização ampla exige revisão separada. |
| Baixa | README com URL de clone placeholder e informação histórica imprecisa | README reestruturado, link publicado, comandos reais, limites e licenças. |
| Baixa | Propriedade raiz `obfuscate` redundante e ignorada pelo npm | Removida; preservados `scripts.obfuscate` e a implementação efetivamente chamada pelo build. Não havia duas chaves JSON no mesmo objeto: eram uma chave no objeto scripts e outra na raiz. |
| Baixa | Resultados temporários de comparação sem consumidor executável | Removidos `tmp_compare_result.json` e `tmp_itens_compare_result.json`, após busca de referências. |

Ordem executada: estrutura e histórico → baseline → correções pequenas de testes/lint/configuração → README/limpeza → fontes e auditoria online → patch Router → nova suíte/lint/tipos/build → relatório. O trabalho dependente de seleção editorial permanece aguardando decisão.

## Estrutura, referências e escolhas de manutenção

- `CriacaoFicha.tsx` (370 linhas) é usado por `criarFicha.js` nos layouts desktop/mobile; `NivelBlock.tsx` (513) é usado por CriacaoFicha. São componentes ativos, com estado e regras interligadas. Não foram fragmentados por tamanho: domínio/progressão já têm módulos extraídos e testes; uma divisão adicional sem defeito reproduzido não reduziria risco nesta revisão.
- `AbaMagias.tsx` tem 75 linhas, é usada por InventarioMagiasDetalhes e já delega às regras de conjuração. A alegação histórica de componente muito grande não descreve o estado atual.
- `FichaPersonagem.ts` tem 637 linhas, com responsabilidades delegadas a persistência, restauração, inventário, seletores, recursos e progressão. Foram mantidos seus contratos e classes.
- `Itens.ts` (28.164 linhas) importa a tradução de nomes de `ItensTraduzidos.ts`, que importa `ItensIngles.ts` (25.346). Portanto o catálogo inglês possui cadeia de uso real. `Magia.ts` tem 8.737 linhas e participa de resolução e listas legadas. Não foram removidos nem duplicados catálogos, nem aplicada divisão/lazy sem medição.
- `forceUpdate` permanece, mas o provider observa objetos/arrays aninhados por Proxy e agenda persistência. Seu uso não demonstra por si só perda de atualização. Os testes de mutação, reabertura, backup e falhas continuam passando.
- `my-app/` contém apenas README de redirecionamento e `.gitignore`, sem aplicação executável. Mantido como referência histórica explícita; nenhum segundo projeto foi instalado ou apresentado como ativo.
- PDFs em `PDF/` e `public/` têm SHA-256 idêntico: `610bbf1bc1284b5393d38645b964ed48c20c688ffa45b8d1393b10ae2568f67c`. O código e os testes usam `public/ficha-de-personagem-dd-5e.pdf`. Ambos foram preservados por procedência/licença pendente; deduplicação desse material fica para a decisão editorial.
- XML e Mapear PDF já estavam ausentes do menu; o teste correspondente passou. Exportação PDF sob demanda, falha e nova tentativa já estavam implementadas e testadas. Não reimplementadas.

## Alterações efetivas

| Arquivo | Problema e solução |
| --- | --- |
| `README.md` | Apresentação profissional com URL real, tecnologias, instalação, tabela de scripts, estrutura, persistência, limites e atribuições restritas ao subconjunto comprovado. Sem métricas inventadas ou screenshots de autorização incerta. |
| `package.json` | Removida configuração raiz de ofuscação não executada; aplicado patch Router 6.30.6. |
| `package-lock.json` | Apenas Router/DOM 6.30.6 e `@remix-run/router` 1.23.4 e seus metadados/resoluções. |
| `conteudoVersionado.test.js` | Raio de Fogo agora deve ter referência 2024 própria e licença pendente; continua testando ausência de fallback para nome inexistente e revisão/edição desconhecidas. Data de consulta valida formato e parsing, em vez de impor a data antiga a fontes posteriores. |
| `accessibility.test.js` | Retirado Tab extra após remoção do link da modal; adicionada asserção de foco no botão Escolher antes de Enter. Seleção e retorno de foco continuam obrigatórios. |
| `progressao.test.js` | Asserção incondicional de presença das classes esperadas resolve `jest/no-conditional-expect`, mantendo o filtro e a rejeição pelo domínio. |
| `docs/VERIFICACAO.md` | Link e resultado corrente separados das validações históricas. |
| Dois `tmp_*compare_result.json` | Removidos resultados derivados sem referências no código/build. Recuperáveis no Git; nenhum catálogo editado. |
| Esta pasta | Relatório, consultas atuais, script reproduzível de triagem e logs exclusivos. |

## Validação executada

| Comando | Resultado final | Evidência |
| --- | --- | --- |
| `npm test -- --watchAll=false --runInBand` | **256 passaram, 1 falhou; 15 suítes passaram, 1 falhou; saída 1** | [testes-router.log](testes-router.log), `testes-router.exit.txt` |
| `npm run lint` | Saída 0, sem diagnósticos | [lint-router.log](lint-router.log), `lint-router.exit.txt` |
| `npm run typecheck` | Saída 0, strict já habilitado | [types-router.log](types-router.log), `types-router.exit.txt` |
| `npm run build:verify` | Compilação e ofuscação aprovadas, saída 0, temporário exclusivo removido | [build-router.log](build-router.log), `build-router.exit.txt` |
| `git diff --check` | Saída 0 | `diff-check.log`, `diff-check.exit.txt` |
| `npm audit --json` | Saída 1 por vulnerabilidades, consulta online concluída | [audit-after.json](audit-after.json) |
| `node docs/revisao-portfolio-2026-10-13/triagem.cjs` | 102 registros classificados; Router e Router DOM alcançáveis pelos roots runtime examinados | [triagem.json](triagem.json) |

Baseline: 253 passaram/4 falharam em 16 suítes; lint tinha dois erros em asserções condicionais; typecheck passou. Logs `testes.log`, `lint.log`, `types.log` e códigos preservados. Houve resultado intermediário de 257 aprovados (`testes-final.log`) após alterar a expectativa de Iniciado. Essa alteração foi revertida ao confirmar que escondia uma falha funcional; **esse resultado não valida o estado final**. Não foram usados mocks globais de console nem relaxamento da proteção de dados.

A falha final é `Humano 2024 aceita só Origem, impede duplicata e não oferece placeholders`, em `conteudoVersionado.test.js`: esperava seleção pendente para Iniciado em Magia (Mago), mas recebeu `null` (sucesso). `conteudoPhb.ts` produz `phb.escolhas = iniciado`, enquanto `erroTalento`/`registrarTalento` só tratam `escolha` dos talentos SRD. Busca global confirma que os campos de `phb` são construídos/tipados, mas não consumidos fora desse módulo. Não tratar simples persistência da descrição como implementação de magia, requisito ou bônus.

Build preservou o aviso DEP0176 de `fs.F_OK` e o aviso de tamanho: chunk inicial plain reportado em aproximadamente 1,21 MB gzip, PDF em 176,42 kB e chunk auxiliar em 5,48 kB. São valores arredondados do CRA **antes da ofuscação**, não comparação de desempenho ou bytes finais ofuscados. Não foi medido tempo de interação nesta execução. Router/act/key não apareceram como warnings na suíte final. Não houve `npm ci` em instalação vazia; lockfile atualizado e build local aprovado não equivalem a nova certificação em máquina limpa.

## Compatibilidade e fluxos

Nenhuma chave de localStorage, formato serializado, regra de personagem, catálogo, classe de modelo ou migração foi alterada. Os testes atuais passaram para criação nas duas edições, cancelamento, salvamento/reabertura, leitura legada sem edição, preservação de campos desconhecidos, JSON inválido, colisão de ID, exclusão, falha de backup, restauração, progressão, multiclasses, inventário, recursos, cálculos e PDF com testes de morte. Não houve acesso ou corrupção de fichas reais.

Isso comprova os cenários sintéticos cobertos pela suíte, não compatibilidade com toda ficha histórica possível. Mudanças recentes de UI retiraram painéis de revisão e descanso; o domínio e os registros continuam preservados, conforme regressões em `ajustesFeature.test.js`. Não foram restaurados controles que o usuário havia removido.

A descoberta de superfícies pela ferramenta de navegador retornou `apps: []`, `browsers: []`; nenhuma sessão navegável foi disponibilizada. Não foi iniciado servidor nem usado perfil real do usuário. Portanto não se validaram navegador, desktop/mobile, downloads reais, zoom 200%/400%, contraste ou leitor de tela nesta execução. Os ensaios registrados em 08–09/10 permanecem históricos. Próximo ensaio: navegador isolado disponível, fixtures sintéticas, criar/editar/salvar/recarregar/importar/exportar nas duas edições, alternar fichas, níveis/subclasses, equipamentos/recursos e PDF com falha/repetição; desktop 1440×900/mobile 390×844, Tab/Shift+Tab/Enter/Escape e zoom real, seguido de NVDA com versão registrada.

## Dependências e alcance

Consultas online antes/depois: **102 ocorrências: 79 altas, 17 moderadas, 6 baixas, 0 críticas**. `--omit=dev` antes do patch: 101 (78 altas). A primeira consulta sem acesso externo falhou e foi preservada em `audit.json`; não foi considerada resultado de segurança. CRA e bibliotecas de teste estão em dependencies, portanto omit=dev não descreve o bundle.

O patch 6.30.6 removeu o advisory direto [GHSA-jjmj-jmhj-qwj2](https://github.com/remix-run/react-router/security/advisories/GHSA-jjmj-jmhj-qwj2) de Router DOM. A contagem por pacote permaneceu igual porque Router DOM ainda herda os advisories transitivos. [router-before.json](router-before.json), [router-after.json](router-after.json) e o diff do lockfile comprovam versões e escopo. Não foi feita atualização indiscriminada.

Persistem em Router:

- [GHSA-wrjc-x8rr-h8h6](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6): destinos não confiáveis de navegação. As quatro chamadas atuais de `navigate` em Home/CriarFicha usam apenas `/` e `/criar-ficha`; não foi identificado destino fornecido por JSON. Preservar destinos constantes e validar futuras rotas dinâmicas. Isso é mitigação pelo uso examinado, não eliminação da vulnerabilidade da biblioteca.
- [GHSA-337j-9hxr-rhxg](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg): o mantenedor exclui Declarative Mode; a aplicação usa BrowserRouter e não SSR/hidratação manual de Data/Framework Mode. Não se aplica ao fluxo encontrado.

Os outros 100 registros de pacote não são alcançados pelos roots runtime examinados no lockfile. A [triagem reproduzível](triagem.cjs) mantém nós, severidades, ranges, fixAvailable e fontes de cada advisory. A classificação transitiva não comprova tree shaking, exploração nem segurança do hosting. Mitigações já presentes: dev server em 127.0.0.1; publicar somente build estático; consumir fontes/builds controlados e usar perfil isolado de desenvolvimento. Loopback não elimina todos os ataques vindos do navegador. Atualizações maiores de CRA/transitivos exigem frente própria; não aplicar recomendação de react-scripts 0.0.0. A infraestrutura real de publicação não foi auditada.

## Licenciamento obrigatório

Consultas primárias em 13/10/2026: [página oficial SRD](https://www.dndbeyond.com/srd) e [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). A licença permite adaptação/redistribuição do material abrangido com atribuição, link à licença e indicação de alterações. Não estender automaticamente essa permissão a livros completos, nomes/textos excluídos, tradução de terceiros ou assets.

| Categoria | Material/localização | Resultado, risco e alternativa |
| --- | --- | --- |
| 1 — Condições confirmadas | Subconjunto delimitado em `public/CONTEUDO-LICENCAS.txt`: Cure Wounds 2014/2024; Alert/Skilled/Grappler 2024; índices, especialização e dez resumos de metamagia identificados no relatório de 08/10 | A fonte oficial confirma SRD5.1/5.2.1 sob CC BY4.0. Atribuições existentes preservadas. A correspondência individual foi documentada anteriormente; não foi refeita conferência textual de todos esses resumos nesta sessão. |
| 2 — Origem/permissão incerta | `src/bibliotecas/Talentos.ts`, `Magia.ts`, `Itens.ts`, `ItensIngles.ts`, descrições em `CaracteristicasClasse.ts`, classes/raças/antecedentes e tradução em `phb2024.json` | Fontes locais, nomes de livros e autorização de consulta do usuário não demonstram direito de redistribuição. Exigir fonte primária, edição/página, revisão e licença/permissão do titular e tradutor; alternativamente delimitar material SRD e produzir adaptações próprias autorizadas. Não copiado novo conteúdo. |
| 2 — Origem/permissão incerta | Imagens/ícones em `src` e `public`; PDFs em `PDF` e `public` | Inventário por caminho/hash em [F7-assets.json](../auditoria-2026-10-06/F7-assets.json). Autoria em metadados do PDF não comprova licença. Confirmar titular/permissão por asset ou substituir por recursos próprios/licenciados após aprovação. Nenhum removido por suposição. |
| 3 — Uso não autorizado pelas fontes consultadas | Aasimar em `src/api/rulesets/dnd2024/index.ts`; textos específicos de Orcus em `src/bibliotecas/Itens.ts`/`ItensIngles.ts` | A FAQ oficial do SRD identifica Aasimar como excluído e explica a exclusão de nomes como Orcus. Portanto a CC do SRD não autoriza atribuir esses materiais ao SRD. Não encontrada outra autorização para esses registros. Isso não é conclusão de ilegalidade universal: falta examinar eventual permissão específica aplicável. Alternativas: autorização do titular ou catálogo público limitado, sem apagar snapshots privados. |

Inventários anteriores [fontes por entrada](../revisao-pendencias-2026-10-08/execucao-20261008-01/fontes-por-entrada.json) e [fonte PHB fornecida](../revisao-pendencias-2026-10-08/FONTE-PHB2024.md) permanecem úteis, mas o catálogo operacional atual ampliou-se depois deles. O README agora declara essa diferença; o relatório antigo não certifica o acervo ampliado. Não foi adicionada licença geral, alterado catálogo ou removida funcionalidade dependente de material protegido.

## GitHub

Leitura pela API oficial confirmou `description: null`, tópicos vazios e homepage `https://minha-fixa-dnd.vercel.app`, diferente do endereço solicitado. Evidência: [github-metadata.json](github-metadata.json). Proposta concreta:

- Descrição: “Aplicação React para criar e gerenciar fichas de RPG D&D 5e (2014/2024), com persistência local e importação/exportação JSON e PDF.”
- Homepage: `https://minhafichadnd.com.br/`.
- Tópicos: `react`, `typescript`, `javascript`, `dnd`, `dungeons-and-dragons`, `rpg`, `character-sheet`, `localstorage`.

Não aplicado remotamente: o conector disponível lê metadados, mas não expõe atualização de repositório/tópicos; CLI `gh` não instalado. Nenhuma configuração pública foi modificada por meio alternativo de credenciais.

## Decisão concreta pendente

**Atualização após orientação do usuário:** antes de decidir pelo bloqueio, foi consultada a branch remota `feat/regras-2024` (nome encontrado com “regras” no plural), atualizada por fetch e confirmada em `a635369dca993e408dcea3b0132b3de67302d9d8`. Ela contém uma implementação adicional que não está na branch atual. A proposta de bloqueio abaixo está suspensa; o próximo caminho técnico é avaliar sua adaptação, preservando os contratos atuais.

### Conferência da branch feat/regras-2024

- `src/bibliotecas/catalogos2024.json`: contagem efetivamente lida de **75 talentos e 391 magias**, igual à quantidade de entradas do arquivo PHB na branch atual. A diferença relevante é integração mecânica, não apenas quantidade de registros.
- `Catalogo2024.ts`: campos para atributos, proficiências, especialização, resistências, maestria e escolhas de magias por lista/escola/círculo/ritual.
- `talentos2024Utils.ts`: validação de pré-requisitos e escolhas; criação/remoção de concessões; magias derivadas do talento e usos gratuitos independentes; restauração de usos. `FichaPersonagem.setEfeitos` chama a criação de concessões, e a modal chama o validador.
- Testes executados em cópia isolada extraída com `git archive`, sem checkout, merge ou edição da branch atual: **484 testes passaram em quatro suítes, saída 0**. Suítes: `Catalogo2024.test.ts`, `talentos2024Utils.test.ts`, `Selecao2024.test.tsx`, `exportarFichaPdf.test.ts`. [Log](testes-branch-regras2024.log), `testes-branch-regras2024.exit.txt`. Parte expressiva dos casos verifica metadados por entrada; aprovação não certifica todas as regras de todos os talentos nem direitos de redistribuição.
- A cópia utilizou as dependências já instaladas no workspace via junction, não uma instalação do lockfile próprio da branch. Não foram executados build, suíte integral ou navegador dessa branch.
- **Integração requer adaptação:** a branch remota usa nomes `2024: Nome` e `escolhasTalento?: Record<string, string[]>`; a atual usa referências `{id, edicao, revisao}` e `escolhasTalento?: string[]`, inclusive validador de importação. Copiar arquivos ou fazer merge integral pode quebrar snapshots/importação e substituir proteções de persistência existentes. A branch remota também não contém os módulos de persistência/versionamento da branch atual.

A constatação anterior de talento incompleto continua válida para `feature/dnd2024`, mas não deve ser atribuída à implementação da outra branch. Nenhuma seleção foi bloqueada. O usuário solicitou esta inspeção; não foi inferida autorização para merge integral, alteração de formato ou publicação do conteúdo.

Proposta apresentada: bloquear **novas** seleções PHB2024 com mecânica incompleta, mantendo o acervo para consulta, snapshots/importação/exportação e os registros já salvos; preservar Alerta/Habilidoso/Imobilizador e ASI. Alterar a elegibilidade em um ponto compartilhado UI/domínio e testar recusa sem mutação, registro legado preservado e isolamento entre fichas. Não implementar todos os talentos ou magias por implicação. A alternativa é manter as opções e assumir/documentar o controle manual, com a falha de cobertura registrada.

Essa alteração ampla das opções dependeria da aprovação exigida pela etapa 7 do pedido. O usuário respondeu solicitando primeiro a inspeção da outra branch; inspeção concluída acima. Não houve aprovação de bloqueio e a proposta está suspensa.

## Prontidão e próximos passos

| Dimensão | Avaliação |
| --- | --- |
| Qualidade técnica | Melhorada incrementalmente; strict/lint/build aprovados. Contratos JS/any e toolchain ainda têm limites. |
| Estabilidade | Fluxos existentes cobertos passaram, mas Iniciado PHB2024 tem defeito confirmado e uma falha final. Não certificar integralidade do catálogo. |
| Documentação | README corrigido, comandos reais, persistência e limites explícitos, evidências novas separadas do histórico. Metadados remotos preparados, não aplicados. |
| Licenciamento | Subconjunto CC identificado; acervo integral e assets não liberados por esta auditoria. Divulgação pública como portfólio **não recomendada ainda**. |

Prioridades futuras: decisão sobre elegibilidade do catálogo incompleto; matriz de fontes/permissões atualizada por entrada ampliada; ensaio em navegador isolado e acessibilidade humana; frente delimitada de manutenção da toolchain. Extrações adicionais de componentes e carregamento de catálogos só devem acompanhar defeito ou custo medido. Sem reescrita e sem migração automática para outra stack.
