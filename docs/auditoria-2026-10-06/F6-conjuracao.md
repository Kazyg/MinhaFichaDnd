# F6 — Conjuração (A10/A11)

Implementado em 2026-10-07 sobre o checkout já modificado por F1–F5 e pelos catálogos. Git status e arquivos atuais foram inspecionados antes da edição; não foram encontrados AGENTS.md no projeto ou nos ancestrais consultados. Sem commit, deploy ou atualização de dependências.

## Regras e fontes

- Uma única fonte de Conjuração usa a tabela própria, mesmo que haja outras classes sem Conjuração ou um Bruxo. Duas ou mais fontes usam a tabela multiclasse. Meios-conjuradores arredondam para baixo em 2014 e para cima em 2024; subclasses arcanas contam um terço arredondado para baixo. A aprendizagem/preparação é limitada por cada classe. Fontes: [multiclasse 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/customization-options) e [multiclasse 2024](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character).
- As tabelas de espaços completos, meios-conjuradores, Pacto e limites básicos foram conferidas por edição. Mago2014 prepara INT + nível, mínimo 1; Paladino2014 usa CAR + metade do nível arredondada para baixo, mínimo 1. Em 2024, preparação segue as tabelas. Fontes: [classes 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes), [classes 2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes), [SRD 5.1](https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf) e [SRD 5.2.1](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf).
- Pacto tem espaços separados, recuperados em descanso curto ou longo; Conjuração recupera em descanso longo. O livro do Mago começa com seis magias e recebe duas por nível posterior; cópias adicionais não consomem essa quantidade. Preparação é uma seleção independente dentro do livro.
- Cavaleiro Arcano/Místico e Trapaceiro Arcano usam INT e a lista de Mago, com identidade própria. As tabelas revisadas foram conferidas no conteúdo do PHB distribuído pelo Roll20: [Cavaleiro](https://roll20.net/compendium/dnd5e/Subclasses%3AEldritch%20Knight?expansion=32231) e [Trapaceiro](https://roll20.net/compendium/dnd5e/Subclasses%3AArcane%20Trickster?expansion=32231). Mantidas as restrições de escolas de 2014, incluindo vagas livres nos níveis 3/8/14/20, e a reserva de Mãos Mágicas do Trapaceiro. Em 2024 não há restrição de escolas.

## Alterações

- `rulesets/conjuracao.ts`: tabelas determinísticas e limites básicos por classe/edição, independentes dos snapshots serializados.
- `fichaConjuracao.ts`: seletores puros de fontes, pools, escolhas e pendências; validação de lista, círculo, categoria e quantidade; operações explícitas de adicionar, preparar, arquivar e revisar fonte. Usa a progressão ativa F4 e atributos finais/proficiência F5. Não depende de `instanceof`, não ordena arrays da ficha e não grava durante consultas.
- `AbaMagias.tsx`: mostra todos os espaços, inclusive sem magias escolhidas; grupos separados de Pacto e Conjuração; CD/ataque por fonte; contagens independentes; preparação do livro; pendências e revisão de origem.
- `ModalMagias.tsx`: fonte explícita, opção de cópia de livro, erro de elegibilidade e confirmação desabilitada quando inválida. Corrigidos filtro de nível zero, combinação de filtros e ordenação que poderia alterar o catálogo. Detalhes não oferecem uma falsa ação de adicionar.
- `FichaPersonagem.ts`: setter validado, duplicidade por fonte e exclusão sem atingir outra classe. Aba de detalhes e PDF passam a ler o registro novo. O consumidor de requisitos de talentos reconhece o novo campo.
- As tabelas existentes dos conjuradores e das quatro subclasses foram inspecionadas. Não foi necessário reescrever seus snapshots; as tabelas de espaços das sete classes com Conjuração concordam com o motor em todos os 20 níveis das duas edições.

## Migração recuperável

`magiasConjuracao` é opcional no envelope F1, que continua na versão 1. Cada escolha registra ID, nome, fonte estável (edição/classe/subclasse), classe, edição das regras, catálogo, círculo, categoria, preparação e aquisição (progressão/cópia/legado).

Na hidratação, escolhas antigas são projetadas uma única vez. `magiasEscolhidas` permanece integralmente como snapshot recuperável e deixa de ser o registro ativo quando o novo campo existe. Fonte ambígua ou ausente não é adivinhada. Magias desconhecidas, de círculo indevido ou além do limite permanecem visíveis com pendências. Para Mago, a antiga lista é interpretada como livro/preparação com aviso de revisão; nenhuma escolha é descartada para ajustar limites.

O marcador `F6-conjuracao-v1` permite criar `fichas.backup.F6-conjuracao-v1` na primeira gravação da coleção migrada. O backup permanente não é sobrescrito; falha ao criá-lo/verificá-lo impede a gravação principal. A leitura não salva automaticamente. Arquivar ou revisar fonte preserva a escolha anterior em `escolhasAnteriores`, inclusive em exportações JSON. Reabrir não duplica escolhas nem arquivos. Reduzir níveis conserva as escolhas e recalcula as pendências.

## Validação

- Casos pedidos: Paladino2024 1, Paladino2014 3, Mago1/Paladino1 revisado, Mago1/Paladino2 legado, Bruxo3, Mago5 e subclasses arcanas em oito marcos, antes/depois de JSON simples e da importação F1/F3.
- Mago2014 INT16/SAB10 prepara quatro; Desejo bloqueado no nível1; truques não consomem preparação; cópias e livro separados; mesma magia em fontes distintas; exclusão por fonte; alterações de atributos/níveis; render sem gravação; validação no modal.
- Migração idempotente, escolhas inválidas preservadas, revisão com arquivo anterior, círculo adulterado rejeitado na preparação, backup permanente e bloqueio de gravação se o backup falhar.
- Testes F3 foram adaptados para verificar os seletores e a persistência da escolha, substituindo a expectativa antiga de gravação de caches durante render.
- Suíte completa: **159 testes, seis suítes aprovadas** (`CI=true npm test -- --watchAll=false --runInBand`). Lint e tipos aprovados (`npm run lint`, `npm run typecheck`). Logs: [testes](F6-test.log), [lint](F6-lint.log), [tipos](F6-types.log).
- Build final aprovado, código de saída 0: `npm run build:verify` compilou e ofuscou em diretório temporário exclusivo, preservando o `build` existente: [log](F6-build.log). Avisos não bloqueantes: bundle grande, Browserslist desatualizado e depreciação de `fs.F_OK` em dependência.

## Pendências e limites explícitos

- F7: listas/descrições ainda são do catálogo2014, identificado em cada escolha e avisado na tela revisada. Não houve substituição nem expansão global do catálogo. Magias concedidas por talentos, espécie, domínio/juramento/patrono, Segredos Mágicos, ordens divinas/primais e Arcana Mística precisam de fontes e concessões próprias; não são tratadas como vagas básicas nem novos espaços de Pacto.
- F8: marcações de gasto continuam locais à sessão. Recuperação é informada por pool; não há automação de descanso nem migração silenciosa dos antigos caches de espaços disponíveis.
- O editor verifica o estado atual, não toda a história de aprendizagem/substituições em cada nível ou descanso. Custos e tempo de cópia são conferidos pela mesa. Preparações concedidas por características não são automatizadas. Nenhum dano de magia foi automatizado.
- Escolhas arquivadas e snapshots são recuperáveis no JSON/backup; não foi criado um restaurador visual geral de arquivos antigos.
- Os testes de UI usam React Testing Library; não substituem inspeção visual em navegador real. Avisos existentes de React Router/act e Browserslist desatualizado ficam nos logs, sem atualização de dependências nesta entrega.
