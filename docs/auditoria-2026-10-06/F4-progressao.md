# F4 — Criação e progressão (A06, A07, A08, A16)

Implementação em 2026-10-07, sobre o checkout local já modificado por F1/F2/F3 e pelos catálogos. Sem commit, deploy ou conversão de edições. Não foram encontrados AGENTS.md no projeto/ancestrais consultados. Os contratos de hidratação, preservação de snapshots, backup e salvamento F1/F3 continuam em uso.

## Alterações

- `rulesets/progressao.ts` centraliza identidade de classes, recursos `asi`/`epic-boon`, pré-requisitos e contagem de níveis. Classes novas persistem `chave`; snapshots antigos continuam resolvidos por aliases, sem reescrever seus nomes. O gate não depende de textos das tabelas 2014/2024. As tabelas das doze classes revisadas foram examinadas; não foi necessário reescrevê-las.
- Multiclasse usa a mesma elegibilidade no filtro e em `selecionarClasseNoNivel`: valida origem e destino, combina requisitos AND/OR e não usa aumentos futuros para autorizar escolhas anteriores. O nível ativo, o nível da classe até determinada posição e os níveis planejados são tratados separadamente.
- Distribuição exige seis valores, array padrão correto, todas as rolagens alocadas ou orçamento integral de 27 pontos (8–15). Novas rolagens guardam o conjunto gerado. A origem 2024 precisa oferecer três atributos válidos e escolhas distintas. A conclusão valida novamente antes de modificar a ficha; bônus são aplicados sobre a base persistida, sem acumulação ao reabrir.
- O ASI é uma operação atômica com duas escolhas de +1, validada também fora da UI. Considera valores 19/20 e aumentos posteriores ao editar retroativamente. Não foi introduzido teto global no cálculo de atributos: efeitos de outras fontes podem continuar acima de 20.
- Trocar ASI por talento, ou vice-versa, substitui apenas os efeitos daquele avanço. O catálogo disponível continua sendo usado; a UI explica a ausência de talentos gerais/dádivas no catálogo revisado. Há filtro comum de categorias e dos pré-requisitos representados pelos metadados existentes.
- Metamagia usa eventos por nível de classe e slot. A UI respeita os marcos de cada edição e a substituição de uma opção por nível em 2024; impede duplicatas. Descrições 2014 não são usadas como regras 2024. As dez opções revisadas são identificadas e vinculadas à fonte, sem reproduzir sua mecânica integral.
- Patrono separado permanece restrito ao Bruxo 2014, incluindo multiclasse; a seleção salva a opção recebida e atualiza a tela. Em 2024 o controle é o de subclasse no nível 3. Dados legados de patrono continuam armazenados.
- Efeitos novos de estilo de luta registram nível de classe e posição no nível total. Trocas de raça/origem preservam perícias não pertencentes à lista fixa substituída. Trocar espécie 2024 não apaga os atributos concedidos pela origem.

## Preservação e recuperação

Campos opcionais novos: `escolhasAnteriores`, `escolhasMetamagia` e `distribuicaoAtributos.gerados`; `chave` nas novas classes. O envelope F1 permanece na versão 1. As escolhas de avanço, metamagia, patrono, atributos, raça/origem e subclasses substituídas são arquivadas quando tratadas pelas novas operações. Efeitos de avanço removidos pelo remapeamento F3 também são arquivados.

As quatro propriedades antigas `metamagica1`–`metamagica4` não são sobrescritas. Sua leitura fornece uma compatibilidade inicial; editar cria a sequência nova sem destruir os textos e opções anteriores. Reduzir o nível ativo mantém os eventos e escolhas planejadas para posterior avanço. Não há migração destrutiva durante leitura nem gravação automática por esta camada. O arquivo de escolhas está no JSON exportado; ainda não existe uma tela dedicada para restaurar cada entrada desse histórico.

## Evidências de regras

Consultadas em 2026-10-07, distinguindo explicitamente as edições:

- [Criação 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/step-by-step-characters): seis atributos, array 15/14/13/12/10/8, 4d6 descartando o menor e compra de 27 pontos, antes dos bônus raciais.
- [Personalização 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/customization-options): pré-requisitos de origem/destino e tabela com limiar 13; Guerreiro permite Força **ou** Destreza, enquanto Monge, Paladino e Patrulheiro têm requisitos compostos.
- [Classes 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes): ASI nos níveis de classe, extras de Guerreiro/Ladino; Feiticeiro recebe duas metamagias no 3 e uma adicional no 10 e 17; patrono de Bruxo no 1 e Dádiva do Pacto no 3.
- [Criação 2024](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character): aumentos vinculados à origem, escolhas +2/+1 ou +1/+1/+1 nos atributos indicados; multiclasse exige habilidades primárias das classes atuais e da nova.
- [Classes 2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes): ASI 4/8/12/16, extras de Guerreiro 6/14 e Ladino 10, e escolha de dádiva épica ou outro talento elegível no 19. Feiticeiro recebe 2/4/6 opções nos níveis 2/10/17 e pode substituir uma ao ganhar nível de classe. Bruxo escolhe patrono como subclasse no 3.
- [Talentos 2024](https://www.dndbeyond.com/sources/dnd/br-2024/feats): categorias, ASI com requisito nível 4 e teto 20; dádivas exigem nível 19 e têm aumentos próprios, com teto 30. Isso não autoriza elevar o teto do ASI comum.

As páginas gratuitas não constituem todo o catálogo dos livros/suplementos. A página gratuita de talentos 2024 inclui exemplos gerais, estilos e dádivas que ainda não estão implementados no catálogo local; sua presença na fonte não foi confundida com disponibilidade no aplicativo. Subclasses e opções suplementares já existentes foram preservadas, sem certificação editorial abrangente.

## Validação

- `CI=true npm test -- --watchAll=false --runInBand`: **78 testes, quatro suítes**, incluindo 43 testes F1/F3 existentes e 35 casos novos. [Log](F4-test.log).
- `npm run typecheck`: aprovado. [Log](F4-types.log).
- `npm run lint`: aprovado, sem erros ou avisos do ESLint. [Log](F4-lint.log).
- `npm run build:verify`: aprovado, incluindo compilação e ofuscação em diretório temporário exclusivo, sem substituir `build`. [Log](F4-build.log).
- `git diff --check` nos arquivos rastreados alterados nesta frente: aprovado.

Os testes novos cobrem os marcos das 12 classes em ambas as edições e sua UI no nível 4; aliases e chaves após renomear/reabrir; limiares 12/13 compostos, origem inválida e aumentos futuros; ASI 19/20, distribuição incompleta, orçamento, repetição indevida de rolagens, substituição restrita e histórico; metamagia 2014/2024, redução/reabertura; patrono separado e subclasse revisada. Os testes React usam JSDOM, sem inspeção visual em navegador físico.

## Limites e pendências

- O catálogo 2024 local ainda não oferece talentos gerais/dádivas completos. O marco 19 permite ASI como outro talento elegível e os talentos existentes; não inventa uma dádiva automática. Mecânicas completas de talentos e conjuração continuam fora desta frente.
- Metamagias 2024 apresentam nomes e link para a regra, sem descrição mecânica completa local. Opções suplementares de 2014 ausentes do catálogo não foram acrescentadas.
- Pré-requisitos de talentos dependem dos metadados existentes; fontes de conjuração/proficiência não representadas nesses metadados não têm reconhecimento abrangente. Não foi reescrito o motor de conjuração/inventário.
- Rolagens antigas sem o conjunto original permanecem recuperáveis; não é possível provar retroativamente a origem dos dados. Efeitos antigos sem proveniência e ajustes manuais são mantidos. Distribuições antigas inválidas não são silenciosamente corrigidas ao importar: devem ser revisadas pelo usuário.
- Permanecem avisos preexistentes de React nos testes e de Browserslist desatualizado; o build pode emitir aviso de depreciação do Node. Nenhuma atualização de dependências foi feita nesta frente.
