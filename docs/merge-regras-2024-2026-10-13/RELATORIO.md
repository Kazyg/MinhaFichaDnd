# Merge de feat/regras-2024 em feature/dnd2024

Solicitado pelo usuário em 13/10/2026. Origem confirmada por fetch: `a635369dca993e408dcea3b0132b3de67302d9d8`; destino anterior: `66a36b5`. Windows, Node 24.14.0/npm 11.9.0. Sem push ou deploy.

## Integração

O merge teve conflitos em 14 arquivos. Foram preservados o provider e as proteções de persistência/importação, o versionamento de conteúdo, os seletores, a interface e as correções recentes do destino. As alterações locais da revisão foram guardadas antes do merge em stash recuperável e reaplicadas durante a resolução. Não foi usado reset nem descartada a revisão local.

Da origem foram trazidos o catálogo de 75 talentos/391 magias, os campos de escolhas e regras de talentos, os testes e o importador dos catálogos. A integração adaptou a seleção, validação no domínio, criação e remoção de concessões, cálculos, magias concedidas por talentos, seus usos gratuitos e PDF. Não foram misturadas as listas 2024 nas listas legadas 2014; a edição continua sendo a da ficha.

Novas aquisições continuam com `{id, edicao, revisao}` e snapshot. Escolhas por campo são guardadas em `escolhasTalento2024`; arrays antigos em `escolhasTalento` permanecem intactos. O importador também aceita o formato da outra branch, com objeto no próprio campo `escolhasTalento` e nomes `2024: Nome`, preservando esse campo. Nenhuma chave de localStorage ou versão do envelope foi alterada. Leitura não recria concessões nem inventa escolhas antigas. Campos desconhecidos, backups e recuperação existentes foram mantidos.

Trocar talento por ASI arquiva também suas concessões e retira os respectivos bônus. Nível/classe/revisão inativos não devem aplicar os benefícios; uma concessão depende de o registro de origem continuar ativo. A interface exibe os campos obrigatórios e limpa magias anteriores ao mudar a lista de Iniciado. Os usos de talentos não consomem a seleção de magias de classe. O descanso disponível nessa seção restaura especificamente seus usos gratuitos.

Os testes importados foram ajustados para os contratos atuais: envelope `data`, campo adicional de escolhas, referências versionadas, ausência de mistura entre edições e PDF com anexo. Foram adicionados tipos Jest 27.5.2 para verificar os novos testes TS/TSX com strict, sem excluir testes do typecheck.

## Validação

- Suíte completa final: **748 testes em 22 suítes aprovados**, saída 0 — [testes-merge.log](testes-merge.log). Inclui a proteção contra aquisição não repetível com nomes qualificados e versionados, inclusive quando já existe escolha futura planejada.
- Após reforçar a dependência da concessão em relação ao registro de origem, regressões específicas aprovadas — [regressao-final.log](regressao-final.log). O teste altera apenas a revisão do registro principal depois da ida e volta JSON, verificando que os bônus não continuam ativos por referências antigas nas concessões.
- Lint e typecheck estrito finais aprovados, saída 0 — `lint-merge.log` e `types-merge.log`.
- Build e ofuscação descartáveis aprovados, saída 0 — `build-merge.log` e `build-merge.exit.txt`; artefatos anteriores preservados. Permanecem os avisos da toolchain sobre DEP0176 e tamanho do bundle.
- As primeiras rodadas estão preservadas: testes trazidos usavam uma fixture sem classe conjuradora e API antiga de magias; uma regressão nova esperava array vazio em vez do `null` inicial. Corrigidas as fixtures e as chamadas, mantendo as asserções de validação e preservação. A suíte anterior de 256/257 da revisão não representa o resultado do merge.

Nenhum dado real de fichas foi usado ou modificado. Não foram executados testes de navegador/zoom/leitor de tela nesta integração; a ferramenta não tinha sessão conectada. A aprovação automática não certifica todas as regras de combate dos 75 talentos. Efeitos condicionais de combate continuam dependentes da mesa, conforme o escopo da implementação original.

## Limites

O merge não comprova licença de redistribuição da tradução ou dos catálogos completos. As atribuições SRD e pendências da auditoria foram preservadas; não houve substituição por conteúdo externo. A duplicação de dados de origem e do catálogo versionado foi mantida para não reinterpretar revisões e snapshots durante o merge; uma unificação futura exige comparação por entrada e preservação das referências existentes.

O commit local conclui o merge; o envio ao GitHub não foi solicitado. O stash de segurança anterior fica disponível para recuperação e não deve ser reaplicado novamente sobre o resultado sem revisão.
