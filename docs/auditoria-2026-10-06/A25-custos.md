# A25 — custos de carregamento e construção de catálogos

Executado em 2026-10-08, após conferir F3–F7 e aprovar a baseline atual: 211 testes em dez suítes. Nenhum AGENTS.md encontrado no projeto/ancestrais consultados. O checkout já continha mudanças extensas, inclusive arquivos não rastreados; foram preservados. Sem commit, deploy, atualização de dependências ou alteração de regras D&D.

## Mudanças e limites de identidade

- `regras.ts` separa configurações da instanciação dos catálogos. `LevelUm` e a leitura de idiomas consultam somente configurações; `NivelBlock` consulta somente a edição. Arrays de configuração são novos por chamada. A validação de edição e o fallback legado 2014 continuam iguais.
- As factories das duas edições copiam magias e talentos apenas quando suas propriedades são acessadas. Cada acesso retorna uma cópia independente. Não há memoização global de instâncias com IDs aleatórios. As definições privadas de conteúdo em `conteudo.ts` continuam separadas das cópias entregues aos consumidores.
- Espécies 2024 eram instâncias compartilhadas em escopo de módulo, inclusive o objeto `semAtributos`. Agora são construídas por chamada, com atributos independentes, conservando nomes, textos e protótipos.
- A exportação PDF usa `import()` dentro do tratamento de erros existente. `pdf-lib` e o exportador saem do JavaScript inicial. Falha continua apresentando a opção de guardar JSON e permite tentar novamente. Técnica documentada oficialmente em [Code Splitting — Create React App](https://create-react-app.dev/docs/code-splitting/), consultada em 2026-10-08.
- IDs de subclasses e efeitos continuam sendo gerados pelos mesmos construtores. IDs, snapshots, edição, envelopes, backups e migrações F1/F3 salvos não são reescritos. Não foi necessária migração de identidade.

## Bundle comparável

Ambas as compilações usam o checkout local desta execução, React Scripts 5, Node v24.14.0, configuração de produção igual e diretórios `BUILD_PATH` temporários exclusivos. A baseline não é o número arredondado da auditoria antiga. O diretório `build` anterior não foi usado como destino. Foram preservados os builds temporários para inspeção.

Medição de arquivos JS com `gzipSync` padrão do Node, sem mapas. Arquivos iniciais identificados por `asset-manifest.json`. Reproduzir a leitura com `node docs/auditoria-2026-10-06/A25-medir.cjs <BUILD_PATH>`; os destinos estão em `A25-baseline-build-path.txt` e `A25-after-build-path.txt`.

| Indicador, bytes gzip | Antes | Depois | Diferença |
| --- | ---: | ---: | ---: |
| JavaScript inicial, sem ofuscação | 1.282.995 | 1.102.913 | −180.082 (−14,04%) |
| Todo o JavaScript, sem ofuscação | 1.285.667 | 1.287.640 | +1.973 (+0,15%) |
| JavaScript inicial, com ofuscação | 2.564.638 | 2.093.155 | −471.483 (−18,38%) |
| Todo o JavaScript, com ofuscação | 2.577.113 | 2.562.683 | −14.430 (−0,56%) |

Os chunks PDF somam 182.055 bytes gzip sem ofuscação e só são solicitados ao exportar. Os source maps mostram 131 fontes de `pdf-lib` no chunk 105 e o exportador no 714; nenhum deles está no main. O ganho principal é transferência inicial, não redução equivalente do total nem latência comprovada.

Ofuscação medida separadamente em cópias temporárias, com os flags atuais `--compact true --control-flow-flattening true`, adicionando `--seed 25` em ambas para comparação. Nenhum comando `npm run obfuscate` com destino fixo `./build` foi executado. O script `scripts/build.cjs` já respeitava `BUILD_PATH` por F2; não foi modificado. As primeiras cópias de ensaio tinham `-obfuscated` no caminho e foram ignoradas pela CLI; foram descartadas da comparação e a medição foi repetida com caminhos `minhaficha-a25-cli-*`, confirmando transformação dos bytes e logs por arquivo. A execução ofuscada não foi validada em navegador.

Evidências: `A25-{baseline,after}-bundle.json`, `A25-{baseline,after}-obfuscated-bundle.json`, logs de build e de ofuscação correspondentes. A ofuscação aumenta expressivamente o tamanho absoluto; esse custo não foi ocultado ou removido para melhorar a comparação.

## Trabalho evitado em criação, reabertura e troca de nível

Instrumentação com spies em `getMagiasConteudo`/`getTalentosConteudo`, usando React real, FichaProvider e CriarFicha em JSDOM, desktop, Guerreiro/Humano com antecedente e idiomas preenchidos. Cenários: selecionar ficha nova; exportar/importar e reabrir; mudar nível ativo de 1 para 3. Mesma fixture e comandos nos dois estados. Para repetir a baseline com a fixture completa, os sete arquivos de produção foram recuperados dos source maps do build inicial durante o teste e restaurados em `finally` ao terminar.

| Edição | Etapa | Cópias de magias antes → depois | Cópias de talentos antes → depois |
| --- | --- | ---: | ---: |
| 2014 e 2024 | Criação | 23 → 0 | 43 → 20 |
| 2014 e 2024 | Reabertura | 24 → 0 | 44 → 20 |
| 2014 e 2024 | Nível 3 | 21 → 0 | 41 → 20 |

Evidências comparáveis: `A25-baseline-profile-comparable.log` e `A25-after-profile.log`. O primeiro ensaio, `A25-baseline-profile.log`, tinha idiomas 2024 incompletos e não serve para comparar a tela de níveis das duas edições. Foi preservado, mas não usado na tabela. A contagem inclui renders disparados pelo contexto; não é custo por um único render. As 20 consultas de talentos remanescentes são consumidores reais e não foram memoizadas indiscriminadamente.

Não há ferramenta de navegador/Playwright disponível nesta sessão. Não foram medidos CPU, frames, rede real, React Profiler em navegador ou latência de criação/reabertura/troca. Durações do Jest não são apresentadas como latência do aplicativo. A redução de chamadas comprova trabalho evitado, não identifica um gargalo de CPU.

## Validação

- Baseline: 211 testes, dez suítes, aprovados (`A25-baseline-test.log`).
- Após alterações de produção: 217 testes, onze suítes, aprovados (`A25-test.log`). Inclui restauração F3, progressão F4, cálculos/PDF F5, conjuração F6, conteúdo F7, inventário, contexto e acessibilidade.
- Verificação final direcionada: sete testes, duas suítes, aprovados (`A25-targeted-final.log`), incluindo novo caso de falha/repetição da exportação assíncrona. São 218 testes distintos validados no conjunto dessas execuções.
- Novos testes alternam edições em duas fichas, alteram traços, subclasses e antecedentes, exportam/reabrem e verificam isolamento e IDs preservados. Também verificam cópias independentes de magias/talentos/configurações e a ausência das cópias de magias nos três fluxos React. Os fluxos React preexistentes de troca de ficha/reabertura também passaram.
- Typecheck e lint aprovados (`A25-types.log`, `A25-lint.log`). Builds de produção e ofuscação separados concluídos. `git diff --check` dos arquivos rastreados desta frente aprovado.
- Persistem avisos preexistentes de React nos testes, Browserslist desatualizado e depreciação do Node. Não foram tratadas como medições de desempenho.

`A25-alteracoes.patch` registra somente as diferenças de produção contra o início desta execução, recuperado dos source maps, para distinguir A25 das alterações anteriores no checkout. Arquivos novos adicionais: `regras.ts`, `custos.test.js`, `exportacaoSobDemanda.test.js` e este relatório/script de medição.

## Investigação e pendências

Foram examinados getRulesetData, índices das edições, construtores de raças/classes/subclasses/efeitos, CriacaoFicha, LevelUm, NivelBlock, Magia, Itens/ItensTraduzidos, inventário, App e package.json. CriacaoFicha ainda precisa de classes/raças/antecedentes para seleção; sua factory permanece sem cache. Magia e Itens têm conteúdo estático volumoso; as classes de itens também geram IDs, e F8 já copia itens na entrada do inventário. Não foi introduzido compartilhamento de instâncias nesses caminhos.

O provider e a hidratação importam catálogos sincronamente, por isso apenas tornar a rota do App lazy não separaria toda essa carga. A fronteira PDF comprovou ganho sem alterar o contrato síncrono de restauração. Separar módulos de inventário/magias e reduzir mais construções exige novas medições e exame das referências mutáveis dos seletores. O bundle inicial ainda é grande. Permanecem pendentes perfil e smoke test dos chunks em navegador real, incluindo a variante ofuscada. Não há alegação de aceleração de CPU nem certificação editorial adicional do conteúdo.
