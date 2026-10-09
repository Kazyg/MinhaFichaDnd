# F8 — Inventário e recursos (A19, A20, A24)

Implementado em 2026-10-07 sobre o checkout com alterações anteriores F3/F5/F6/F7. Instruções, estado Git, relatórios das dependências e código foram conferidos antes de editar. Não foram encontrados AGENTS.md no projeto; o relatório F3 também registra a verificação dos ancestrais. Alterações anteriores preservadas. Sem commit ou deploy.

## Mudanças

- Operações de equipamento centralizadas em `FichaPersonagem.ts`. Exclusão remove o vínculo equipado na mesma chamada. Trocar escudo valida a ocupação resultante, descontando o anterior; uma operação recusada não altera o equipamento. Equipar repetidamente a mesma arma é idempotente. Somente objetos existentes na mochila podem ser equipados.
- `getMaosOcupadas` deriva a ocupação das armas e do escudo. A propriedade antiga `maosOcupadas` é apenas um cache de compatibilidade atualizado pelas operações; seu setter antigo ignora incrementos. Armas com Duas Mãos/Two-Handed ocupam duas mãos neste controle de equipamento pronto para uso; demais armas, uma. Isso não modela segurar uma arma de duas mãos sem atacar, alternância de empunhadura versátil ou economia de ações.
- Adições copiam o objeto do catálogo e atribuem outro ID se a mesma identidade já existir naquela mochila. IDs das instâncias sobrevivem ao JSON. Referências restauradas apontam para os registros locais da mochila, sem substituir seus dados por catálogos atuais.
- `itensSintonizados` guarda IDs independentemente de `itensEquipados`. Equipar não sintoniza; desequipar mantém o vínculo e exclui os benefícios ativos. Encerrar sintonização mantém o equipamento, mas suspende benefícios que exigem esse vínculo. Excluir remove ambos. O limite é conferido no modelo, além da UI. O nome legado `getItensSintonizadosEquipados` permanece por compatibilidade, retornando os itens sintonizados mesmo fora do equipamento.
- Parser inglês de bônus de atributo lê atributo/valor na ordem correta. Casos portugueses e atributos fixos permanecem suportados. Nomes como `+3 weapon`/`+2 armor` e frases de ataque local não concedem bônus globais. A classe de magia só é reconhecida em frases de vínculo com as magias da classe, não em palavras soltas no nome/descrição.
- Itens aceitam `efeitosExplicitos`, inclusive um array vazio para impedir inferência. Esses dados prevalecem sobre o parser; efeitos mantêm referências de conteúdo F7, cujo filtro por edição/revisão continua aplicado. Efeitos já salvos são conservados no item ao desequipar/desativar, permitindo reativar ajustes antigos sem reinterpretar o texto. Nenhum catálogo novo de benefícios foi criado.
- `recursos.slots` registra quantidades gastas por círculo da Conjuração e por fonte de Pacto. Pacto não usa o círculo como identidade: o gasto acompanha a mudança de círculo no avanço. Gastos excedentes, círculos temporariamente ausentes e fontes inativas não são truncados por mudanças de nível.
- `recursos.morte` guarda sucessos/falhas de 0 a 3. As telas usam esses campos persistidos pelo contexto F1/F3. Novos dados são validados na importação. Há testes com contexto e armazenamento reais, além dos testes de modelo e componentes.
- Recuperação de espaços tem comandos explícitos para descanso curto/longo concluído. Curto recupera apenas Pacto ativo; longo recupera pools ativos conhecidos. Campos desconhecidos/inativos são conservados. Os comandos não modificam PV, dados de vida, morte, sintonização ou outros recursos.
- Restaurar Vida altera apenas PV atuais e informa que não é descanso. O estado local anteriormente chamado `vidaTemporaria` foi renomeado para `vidaEditada`: era o rascunho de PV atuais, não PV temporários. Entradas negativas de dano/cura são limitadas a zero. O controle de abrir o modal também pode ser acionado pelo teclado.

## Migração e recuperação

O envelope permanece na versão 1; a edição salva é mantida, com o fallback legado DND_2014 existente. Campos adicionais: `itensSintonizados`, `recursos`, `inventarioAnterior`, `efeitosExplicitos` nos itens e marcador `F8-inventario-v1`.

Na primeira leitura de inventário antigo, a migração arquiva mochilas, referências equipadas, contador, sintonizações e efeitos em `inventarioAnterior`. Resolve IDs duplicados nas mochilas, elimina vínculos órfãos/repetidos e recalcula mãos. Se o equipamento antigo excede duas mãos, mantém o escudo e as armas que cabem, na ordem salva; o conjunto original continua no arquivo de recuperação. Em duplicatas com o mesmo ID, o vínculo aponta para a primeira instância; as demais recebem outro ID. Snapshots equipados divergentes da mochila ficam no arquivo anterior, enquanto a mochila é a fonte ativa.

Na ausência do campo de sintonizações antigo, itens sintonizáveis equipados mantêm o vínculo que a antiga ação Equipar representava. Um array novo explicitamente vazio permanece vazio. A migração não reinterpreta todos os efeitos salvos; os efeitos órfãos desativados ficam no arquivo anterior. Fichas sem inventário nem contador a reparar não recebem migração desnecessária. Releituras não repetem o arquivo.

A leitura não grava automaticamente. Na primeira gravação migrada, `fichas.backup.F8-inventario-v1` conserva a coleção anterior e é verificado antes da gravação principal, além do backup rotativo existente. Falha de backup bloqueia a gravação. Importações carregam o arquivo anterior no próprio JSON exportado. Recuperação integral pode usar o JSON original/backup pela interface existente; recuperação seletiva exige revisar o arquivo `inventarioAnterior` no JSON e reimportar a escolha corrigida.

## Validação

- `CI=true npm test -- --watchAll=false --runInBand`: **204 testes em 9 suítes**, aprovados; [log](F8-test.log).
- 19 testes novos: equipamento em ambas as edições; identidade de cópias; sintonização/equipamento/efeitos; migração idempotente e backup; atributos PT/EN; prevenção de bônus globais; consumo após mudar nível e círculo de Pacto; descanso compatível; desmontagem/importação; restauração de PV isolada; rejeição de recursos inválidos; persistência pelo contexto real.
- `npm run lint`: aprovado; [log](F8-lint.log).
- `npm run typecheck`: aprovado; [log](F8-types.log).
- `npm run build:verify`: compilação e ofuscação em diretório temporário exclusivo, pelo script seguro existente; [log](F8-build.log). O diretório build existente não é o destino.
- `git diff --check` dos arquivos rastreados trabalhados: aprovado.

Testes de interface usam React/JSDOM; não houve inspeção visual em navegador físico. Permanecem avisos anteriores de React/Router e Browserslist desatualizado; dependências não foram atualizadas.

## Fontes e limites

Consultadas em 2026-10-07:

- [SRDs oficiais](https://www.dndbeyond.com/srd): referência das duas edições. Não há conversão automática de edição.
- [Descanso 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/adventuring): recuperação depende do recurso e do tipo de descanso.
- [Glossário 2024](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary): descanso curto/longo e recuperação específica de características.
- [Equipamento 2024](https://www.dndbeyond.com/sources/dnd/br-2024/equipment#Attunement): sintonização separada de vestir/empunhar, requisitos e limite padrão. Os controles registram a decisão da mesa; não simulam tempo, distância, maldições, requisitos específicos ou impedimento de sintonizar cópias do mesmo tipo.

Recuperação dos pools usa a separação Conjuração/Pacto da F6; não implementa Recuperação Arcana ou outras exceções. Não há descanso completo automático, novos controles de PV temporários/dados de vida, maestrias, condições ou motor de combate. Campos manuais de PV temporários existentes no JSON são preservados como campos desconhecidos e nunca somados por esses comandos.

Marcações que a versão anterior guardava somente em React não podem ser recuperadas depois de já perdidas. Campos antigos `espacosMagiaDisponiveis`/`espacosMagiaTotais` continuam preservados; não se presume que caches antigos de capacidade sejam consumo. Testes de morte são registros manuais: cura/estabilização não os limpam automaticamente. O parser é uma compatibilidade limitada, não uma interpretação geral de descrições; benefícios não representados explicitamente exigem revisão manual. Dados novos devem preferir efeitos explícitos com referência F7 quando forem conteúdo versionado.
