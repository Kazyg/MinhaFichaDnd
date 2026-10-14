# Implementação e revalidação — 08/10/2026

Atualização posterior ao fechamento: o usuário forneceu uma fonte local para magias e talentos de 2024. Identificação, índice e delimitação pendente estão em [FONTE-PHB2024.md](FONTE-PHB2024.md). Os resultados abaixo descrevem a execução anterior e não significam que esse catálogo adicional já foi implementado.

Execução `execucao-20261008-01`, Windows, Node 24.14.0, npm 11.9.0. HEAD permaneceu `89642a44a1a6f9c6d4317ab7fb1af7e77b885e78`. O trabalho inclui o checkout local, não somente HEAD. Sem commit, deploy, subagentes, audit fix ou troca de stack. Nenhum AGENTS.md encontrado no projeto/ancestrais. Os documentos históricos F1–F10, diagnóstico e evidências anteriores foram preservados.

## Plano e resultado por ID

Sequência executada: baseline/N01/N02 → P01/P02/P03 → P04/P07/P16, com regressões P10/P12 → P06/P09 e delimitação P05/P08/P11/P15/P18 → P13/P17/P14 → P19. A resposta do usuário foi **“Vou indicar entradas e fontes”**: não chegou lista de expansão até este fechamento. Não se presumiu autorização para todos os livros ou SRDs.

| ID | Estado | Entrega, evidência, limite e próximo passo |
|---|---|---|
| P01 | Parcialmente resolvida | DOM Testing Library unificado em 9.3.4; os avisos `act` desapareceram sem mocks de console. Router usa flags após verificar duas rotas absolutas, ausência de splats/lazy em render e testar navegação/foco. caniuse-lite atualizado especificamente. DEP0176 localizado em `react-dev-utils/checkRequiredFiles.js:19`; permanece na versão 12.0.1 da toolchain, sem monkey patch em node_modules. Bundle permanece grande: P14. Nenhum aviso de key reproduzido. Logs `tests-final.log`, `build-final.log`. Próximo passo do DEP0176: patch compatível publicado pelo mantenedor ou decisão explícita sobre manutenção da toolchain. |
| P02 | Parcialmente resolvida | 107→102 ocorrências; críticas 4→0. Patches compatíveis e mitigação local descritos abaixo. `triagem-dependencias.json` cobre todos os pacotes/advisories restantes e closure dos roots runtime. A árvore CRA continua com 79 altas; não se certificou infraestrutura real de hosting nem exploração. Não publicar dev-server; fontes/builds somente controlados e perfil de desenvolvimento isolado. Próximo passo: revisar individualmente atualizações maiores da toolchain fora deste escopo, não aplicar sugestão CRA 0.0.0. |
| P03 | Resolvida no critério TS/TSX | Nove diagnósticos confirmados e corrigidos: arrays por instância nas classes base, fallback de array opcional, callback tipado via `Ficha[]`, ReactNode e índice number. `strict: true`; typecheck 0. `allowJs`, `checkJs: false`, `skipLibCheck` e `any` preexistentes não equivalem à checagem integral JS/contratos de runtime. Sem casts de ausência, novas exclusões ou `@ts-nocheck`. |
| P04 | Parcialmente resolvida | Painel em Perícias identifica efeitos sem origem, idiomas, atributos sem método, distribuição inválida/rolagens ausentes e speed/linhagem salvos. Manter é decisão explícita com snapshot; arquivar retira só o efeito escolhido e guarda cópia. Não infere idioma livre pela posição. Valores não são corrigidos automaticamente. Edição de campos ambíguos segue cópia JSON, não editor visual geral; roteiro abaixo. Testes em `pendenciasRevisao.test.js`. Para identificar origem real ainda é necessária informação da mesa. |
| P05 | Decisão de escopo | Mantidos Alerta2014, Alerta/Habilidoso/Imobilizador2024 e ASI separado. Usuário vai indicar entradas/fontes; faltam nomes, edição, livro/revisão e autorização/licença admitida. Não foram publicados talentos/dádivas adicionais. |
| P06 | Resolvida | Dez resumos próprios de 2024, conferidos no SRD5.2.1 pp.66–67, revisão/data/URL/licença persistidos em novas escolhas. Snapshots antigos permanecem intactos. Pontos e efeitos de combate são manuais. Teste de escolha/reabertura e texto diferente do legado. |
| P07 | Parcialmente resolvida | Validador compartilhado UI/domínio: Bardo2014 3/10, Ladino2014 1/6; Bardo2024 2/9, Ladino2024 1/6, Patrulheiro2024 2/9 e Mago2024 2 com seis perícias elegíveis. Fonte/edição/quantidade/duplicata/treinamento/nível ativo e aquisição. Redução/remoção da fonte inativa escolhas sem apagá-las; arquivar guarda anterior. Manual claramente separado e preservado. Ferramentas de ladrão2014 e fontes suplementares continuam manuais. Treinos no array legado `pericias` não têm data de aquisição verificável; UI pede conferência. Próximo passo: escopo de ferramentas/outras fontes e histórico de treinamento explícito, sem inventar cronologia. |
| P08 | Decisão de escopo | Mantida indicação manual para estilos/situações não automatizados, dano versátil principal e PV por média. Nenhuma nova automação de combate aprovada; falta conjunto pequeno com fontes. |
| P09 | Parcialmente resolvida | Inventário novo de 7.908 registros/referências (inclui índices por classe, não 7.908 conteúdos únicos) e 60 assets, com arquivo/coleção/índice/nome, fonte/licença e documento faltante por registro. Todos os hashes de assets coincidem com F7. Alerta2014 continua redirecionando ao marketplace; não houve acesso primário integral ou permissão nova. Impacto: procedência editorial não certificada fora do subconjunto indicado. Falta declaração/licença do titular da tradução/asset e fonte com revisão/localizador. Não houve remoção do acervo. |
| P10 | Resolvida, regressões | Migração F8 não refeita. Testes atuais de inventário, backup, duplicatas, órfãos, mãos e isolamento passam. |
| P11 | Parcialmente resolvida | Regressões PT/EN e `efeitosExplicitos` passaram; nenhum parser de prosa arbitrária ou migração de IDs. Inventário de fontes acima registra lacunas por definição. Sem nova entrada aprovada que exija migração de identidade. Novos itens deverão declarar efeitos e referência; instância possuída não vira ID de catálogo. |
| P12 | Parcialmente resolvida / decisão de escopo | Regressões de slots/morte, gastos excedentes, pools inativos e descansos passaram. Ausência legada de morte agora permanece ausente; clique grava apenas o contador escolhido. Não se converteram capacidades em consumo. Tempo/distância/maldição/requisitos/cópias de sintonização, Recuperação Arcana, PV temporários, dados gastos, maestrias e limpeza de morte continuam manuais. Falta lista explícita para qualquer automação adicional. Marcações antigas já perdidas são irrecuperáveis. |
| P13 | Parcialmente resolvida | Edge154 headless real, perfis novos, desktop 1440×900/mobile 390×844, plain e ofuscado: teclado/foco, criação, nome/autosave, reload/Home, duas fichas, JSON cópia/substituição, item equipado/sintonizado e PDF falha/repetição. Capturas reproduziram corte da grade mobile e texto escuro no desktop; CSS corrigido e revalidado. NVDA/VoiceOver não disponíveis; Ctrl+plus não mudou width/DPR no headless. Zoom real200%/400%, contraste de todos os estados, remoção do controle focado em navegador, progressão/subclasses e recursos de magia completos ainda exigem ensaio específico. JSDOM cobre parte desses comportamentos, sem equivalência assistiva. |
| P14 | Parcialmente resolvida | Medidas de bytes, smoke dos chunks e 48 perfis CPU: importação/reabertura e troca1→3, ambas as edições/variantes, três repetições por cache HTTP frio/quente. Timings e limites abaixo; nenhum lazy/cache adicional sem benefício medido. Não há instrumentação de commits React no build de produção nem comparação de uma otimização nova. Próximo passo: perfis de componentes com build específico, somente se for investigar redução de renders; não atribuir a catálogos um gargalo apenas por contagens. |
| P15 | Decisão de escopo | Fontes básicas por classe/subclasse e testes existentes preservados. Não adicionados Segredos Mágicos, Arcana Mística, ordens ou concessões de espécie/talento/domínio/juramento/patrono. Faltam entradas e fontes prometidas pelo usuário; controle manual continua indicado na aba de magias. |
| P16 | Resolvida no fluxo mínimo | Roteiro seguro de cópia/arquivo/reimportação abaixo; teste recupera efeito arquivado mantendo original e históricos. Sem restaurador visual universal ou `Object.assign` irrestrito de arquivos históricos. |
| P17 | Parcialmente resolvida | NFC corrige `Joa\u0303o` no PDF sem modificar JSON. Teste reproduz limites em Łukasz/李/emoji; Helvetica/WinAnsi continua substituindo caracteres fora da cobertura por ?. Português com acentos compostos e caracteres WinAnsi são o conjunto suportado; não todo Unicode. Onze páginas do PDF longo renderizadas e inspecionadas, inclusive intermediárias. Fonte extra não adicionada; falta definir idiomas/scripts adicionais necessários para escolher cobertura e medir custo. |
| P18 | Decisão de escopo | Validação existente mantida; nenhum tipo novo de pré-requisito exigido por entrada aprovada. Ampliar somente junto da lista que o usuário vai fornecer, com nível de aquisição. |
| P19 | Resolvida para esta execução | Logs exclusivos com códigos, tentativas falhas preservadas e matriz por ID. Nenhum resultado antigo atribuído a esta execução. `git-before.txt`/`git-after.txt`; whitespace preexistente em Home.css:115 permanece identificado no diff-check. |
| N01 | Resolvida | PDF lê sucessos/falhas persistidos e distingue ausência; UI também informa ausência/incompletude. 0/0,2/1,3/3 e legado nas duas edições com ida e volta JSON e PDF real. Oito reproduções de valores/hrefs falharam antes; dois testes legados inicialmente tinham fixture sem nome obrigatório, corrigida antes da validação final (não contar essas falhas de fixture como prova do bug). |
| N02 | Resolvida | Link e rótulo por edição, fonte oficial2014/2024. Testes de href/rótulo passam; mecânica de sintonização não alterada. |

## Evidências e validação

Todos os caminhos nesta seção são relativos a [execucao-20261008-01](execucao-20261008-01/).

- `tests-before.log`: 218 testes/12 suítes, saída 0; lint/typecheck base0; `strict-before.log`: nove diagnósticos, saída 2.
- `reproduce-before.json`: PDF com 2/1 persistidos ainda declarava ausência. `n01-n02-before.log`: testes novos antes da correção. `n01-n02-after.log` preserva a identificação do erro de fixture legado; a correção está em `tests-after1.log` e posteriores.
- `tests-final.log`: **239 testes/14 suítes**, saída 0. `lint-final.log` e `types-final.log`: saída 0, sem diagnósticos. Sem avisos React act/Router/key no log final. Testes usam armazenamento sintético.
- `build-final.log`: compilação0; `obfuscation-final.log`: ofuscação0, seed 25. `build-css.log`: recompilação justificada pelas duas correções visuais posteriores; JS permanece idêntico. Destinos novos no TEMP; artefatos anteriores preservados. `npm run obfuscate` de destino fixo não foi usado.
- `build-verify-final.log`/`.exit.txt`: `npm run build:verify` terminou com saída 0, incluindo a atribuição pública final e as correções CSS, em temporário exclusivo removido pelo script seguro. `diff-touched-final.exit.txt`: 0 nos arquivos rastreados trabalhados; o diff global continua apontando somente o whitespace preexistente em Home.css. `preservacao-final.json` confirma que nenhum caminho do status inicial desapareceu e nenhuma exclusão adicional foi introduzida.
- `browser-plain-complete/result.json` e `browser-obfuscated/result.json`: cenários JS completos em Edge154.0.4258.62. `browser-sandbox-failure.log`: GPU/access denied no sandbox; execução fora dele funcionou. As tentativas `browser-plain`, `plain2`, `plain3` registram problemas do driver (Enter sem evento textual e seletor aria inexistente), não defeitos certificados da aplicação. `plain4` corrigiu esses problemas.
- `browser-css/result.json` e `browser-css-obfuscated/result.json`: repetição aprovada após corrigir CSS; capturas de Informações mostram todas as cinco seções no mobile, sem corte lateral. `obfuscation-css.log`/`.exit.txt`: saída 0. `assistive-tooling.log`: NVDA não localizado no PATH/caminhos padrão; VoiceOver não é ferramenta Windows disponível.
- `pdf-longo.pdf`, `render-pdf.log` e `pdf-pagina-1.png` até `pdf-pagina-11.png`: PDF longo atual, gerado pelo teste F5 com metadados F6/F7. A versão histórica tinha outro conteúdo; 11 versus 7 páginas não é medição isolada desta alteração. As páginas do anexo não tiveram linhas fora da margem ou conteúdo final perdido. Página1 mantém a limitação de campos fixos e encaminha ao anexo.
- `fontes-por-entrada.json`: inventário completo extraído de exports locais e dos catálogos versionados; script `inventariar.cjs` reproduz. Não confundir presença de fonte local com licença verificada.

## Dependências, alcance e mitigações

As primeiras consultas falharam por rede (`audit-before.json`/`audit-prod-before.json`). As seguintes concluíram com acesso autorizado ao registry, preservadas em `audit-online.json`, `audit-prod-online.json`, `audit-after.json`, `audit-prod-after.json`.

| Consulta | Baixas | Moderadas | Altas | Críticas | Total |
|---|---:|---:|---:|---:|---:|
| Antes, total | 6 | 15 | 82 | 4 | 107 |
| Antes, omit=dev | 6 | 15 | 81 | 4 | 106 |
| Depois, total | 6 | 17 | 79 | 0 | 102 |
| Depois, omit=dev | 6 | 17 | 78 | 0 | 101 |

`react-scripts`/testes continuam em dependencies: omit=dev não é bundle. Patches dentro dos ranges: form-data3.0.3→3.0.5 (Jest/JSDOM, boundary e CRLF multipart), proxy-addr2.0.7→2.0.8 (Express/dev-server, confiança IP), shell-quote1.8.2→1.12.0 (launch-editor, escaping/parse), websocket-driver0.7.4→0.7.5 (SockJS, compressão/length headers). Router6.30.0→6.30.4 e dependente @remix-run/router corrigem advisories compatíveis sem major. `dependency-explain.log` registra cadeias. `package-lock.json` preserva integridade/resolução. caniuse-lite1.0.30001705→1.0.30001815 remove a base antiga; DOM Testing Library9.3.4 satisfaz ambos os consumidores e centraliza seus wrappers act.

O cálculo por lockfile em `triagem-dependencias.json` identifica só React Router/DOM entre os pacotes restantes alcançáveis pelos roots runtime examinados. É classificação de dependência, não prova automática de tree shaking ou exploração. Os outros 100 pacotes são caminhos de ferramentas nessa análise; há advisory transitivo e por pacote, não 102 exploits distintos. Todos preservam ranges/URLs/severidade no JSON.

- [GHSA-2w69-qvjg-hvjx](https://github.com/remix-run/react-router/security/advisories/GHSA-2w69-qvjg-hvjx): mantenedor exclui BrowserRouter declarativo; patch também atualizado.
- [GHSA-337j-9hxr-rhxg](https://github.com/remix-run/react-router/security/advisories/GHSA-337j-9hxr-rhxg): exige SSR/hydration manual em Data/Framework Mode, não encontrado nesta SPA.
- [GHSA-wrjc-x8rr-h8h6](https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6): redirecionamento por destino não confiável. As quatro chamadas `navigate` em Home/CriarFicha usam constantes `/` e `/criar-ficha`; JSON não fornece destino. Não extrapolar essa conclusão se forem adicionados links dinâmicos.
- Outros advisories de Router e os quatro pacotes críticos estão discriminados nos JSONs antes/depois. A atualização não significa exclusão de todo risco futuro.

Mitigação aplicada: `npm start` passa por `scripts/start-local.cjs`, fixando HOST 127.0.0.1. Usar perfil de desenvolvimento isolado sem visitar páginas não confiáveis enquanto o servidor estiver aberto; loopback sozinho não elimina ataques vindos do navegador. Build/testes devem consumir somente fontes/assets controlados. Publicação é somente de artefatos estáticos; nunca expor CRA/dev-server. A política/infraestrutura real de hosting não foi auditada. Não se declarou segurança integral ou ausência de altos riscos em ambientes não examinados.

## Fontes de regras e licenças

Consulta em 08/10/2026:

- [SRD5.1 CC](https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf): Bardo/Expertise p.13; Ladino/Expertise p.39. Ferramentas de ladrão fora do seletor de perícias desta entrega.
- [SRD5.2.1 CC](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf): Bardo, Patrulheiro, Ladino, Mago/Scholar; Metamagic Options pp.66–67. As dez descrições são resumos/adaptações locais, não tradução oficial. A atribuição existente foi estendida em `public/CONTEUDO-LICENCAS.txt`.
- [Classes2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes): confirmação dos marcos e perícias. URL incorreta `/classes` falhou; `/character-classes` funcionou.
- [Sintonização2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/magic-items#Attunement) e [2024](https://www.dndbeyond.com/sources/dnd/br-2024/equipment#Attunement): links específicos, sem unificação de mecânica.
- [Alerta2014](https://www.dndbeyond.com/feats/alert): redirecionamento ao marketplace. Nenhuma licença inferida de gratuidade/metadados. O +5 local permanece identificado como verificação editorial pendente.

## Recuperação mínima P04/P16

1. Menu → Exportar JSON; guarde o original fora do navegador. Não edite a única cópia. Se houver erro de salvamento, exporte primeiro os dados em memória e os bytes originais disponíveis na recuperação.
2. Revise o painel de dados antigos em Perícias. Manter arquiva snapshot e registra decisão; arquivar efeito remove somente aquele ID do conjunto ativo. Nenhuma ação inventa origem, rolagem ou gasto.
3. Para restaurar um histórico, duplique o JSON exportado. No envelope, trabalhe em `data`. Consulte `escolhasAnteriores`, `subclassesAnteriores` ou `inventarioAnterior`, preservando esses campos.
4. Copie apenas a entrada desejada para o campo ativo correspondente. Antes de substituir algo, acrescente a escolha substituída a `escolhasAnteriores` com `tipo` explicativo e `valor` integral. Efeito requer ID único; subclasse deve referenciar classe existente/elegível; inventário deve manter IDs de instância distintos e referências equipadas/sintonizadas válidas. Não copie o arquivo histórico inteiro por cima da ficha.
5. Para idiomas antigos, informe explicitamente `idiomasLivres` conforme a mesa e preserve o array completo `idiomas`; para rolagens sem resultados originais, mantenha a ausência e a anotação de revisão, não gere um conjunto fictício. Ajuste speed/snapshot só com decisão da mesa.
6. Home → Carregar Ficha Salva → Importar JSON → **Importar como cópia**. Importação valida estrutura, não certifica toda elegibilidade D&D. Compare original/cópia, edição, atributos, níveis, fontes, equipamentos e recursos; exporte/reabra a cópia. Só substitua o original após conferir. Cancele em qualquer conflito; nenhum erro exige corromper armazenamento real.

Os testes novos exercitam arquivo de efeito, exportação, reimportação e restauração em cópia sem alterar original/inventarioAnterior. Regressões F3/F8 cobrem arquivos de subclasse/inventário, backups permanentes e bloqueios. Não há promessa de recuperar dados que nunca foram persistidos.

## Medidas e limites

| JS gzip | Histórico da revisão | Intermediário desta execução | Final |
|---|---:|---:|---:|
| Inicial plain | 1.102.913 | 1.103.080 | 1.106.564 |
| Total plain | 1.287.640 | 1.287.914 | 1.291.410 |
| Inicial ofuscado seed 25 | 2.093.155 | 2.090.755 | 2.102.942 |
| Total ofuscado seed 25 | 2.562.683 | 2.560.253 | 2.573.210 |

O build intermediário já continha strict/N01/N02: **não é baseline intacta anterior às alterações**. Foi usado para localizar DEP0176 e comparar o restante do trabalho. As duas variantes foram ofuscadas com os mesmos flags/seed e caminhos próprios; valores históricos não foram vendidos como nova melhoria. Final acrescenta funcionalidades e alguns bytes; não houve otimização ampla. Chunks PDF plain:176.698+5.476 bytes gzip, fonte Helvetica mantida. A correção CSS posterior não altera esses bytes JS.

Os ensaios adicionais estão em `browser-profile-plain` e `browser-profile-obfuscated`: cada diretório tem24 perfis CPU CDP (importação e nível1→3 × duas edições × seis repetições), requests, métricas e manifest. `perfil-resumo.json`, reproduzido por `resumir-perfil.cjs`, contém mínimo/mediana/máximo de todos os grupos. Sem throttling; mesma máquina, Edge, fixture e comandos. Frio significa cache HTTP limpo/desabilitado, **não** processo/JIT frio. Quente faz navegação de aquecimento antes da coleta. A primeira importação cria o ID; seguintes substituem, portanto não interpretar diferença frio/quente como experimento isolado de cache. Os valores incluem driver/polling, diálogo e overhead do profiler; amostras CPU excluem apenas `(idle)`.

| Variante/edição | Importar/reabrir: mediana ms (frio/quente) | Nível1→3: mediana ms (frio/quente) |
|---|---:|---:|
| Plain2014 | 694,7 / 680,4 | 94,9 / 116,1 |
| Plain2024 | 701,7 / 688,0 | 83,7 / 76,0 |
| Ofuscado2014 | 817,4 / 869,8 | 190,6 / 190,9 |
| Ofuscado2024 | 890,0 / 815,8 | 180,8 / 163,4 |

Esses números descrevem o ensaio final, não melhora sobre A25 nem latência sem instrumentação. Há custo observável da variante ofuscada neste ensaio, mas nenhum módulo foi isolado como gargalo para justificar refatoração. Não se removeram flags de ofuscação para melhorar métricas. O teste JSDOM continua com magias0/0/0 e talentos20/20/20 nas duas edições. Duração Jest não é latência. Subclasses e gasto de slots completos ainda não foram exercitados no driver de navegador; a troca de nível ativo foi.

Próximo ensaio humano: mesmo build/hash dos manifests salvos; desktop/mobile, zoom real 200%/400%, todas as abas e erros, NVDA com versão registrada; confirmar nomes/papéis/estados e anúncios, foco após remoção e contraste. O headless não respondeu ao atalho de zoom (width/DPR iguais), e isso foi registrado como tentativa inconclusiva, não aprovação.
