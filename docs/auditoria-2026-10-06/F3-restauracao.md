# F3 — Restauração consistente (A03, A04, A09)

Implementação em 2026-10-07. Nenhum commit ou deploy. O checkout já continha alterações extensas de F1/F2 e dos catálogos; elas foram preservadas. Não foram encontrados arquivos AGENTS.md no projeto ou nos diretórios ancestrais.

## Alterações

- `fichaStorage.hydrateFicha` continua sendo a entrada única para importação, leitura e normalização no contexto. `fichaRestauracao.ts` restaura protótipos das classes, subclasses, raças, antecedentes, patronos e multiclasses. Atributos e efeitos continuam usando a proteção F1 existente. O catálogo identifica o protótipo por edição e nome, com aliases legados de classes; os snapshots, IDs, campos desconhecidos e ajustes manuais salvos prevalecem sobre o catálogo.
- A aba de magias passou a consumir os modelos restaurados, eliminando sua factory local. As subclasses arcanas voltam a satisfazer `instanceof` depois do JSON. Tabelas opcionais ausentes não causam acesso direto a `.find`.
- Idiomas livres e atributos selecionados são escolhas persistidas. Idiomas antigos são reconstruídos separando os idiomas fixos dos restantes, sem apagar o array original. Editar um idioma livre preserva os demais idiomas, inclusive manuais. O modal de idiomas recebeu identificação acessível de diálogo.
- Distribuição de atributos, método, valores ainda disponíveis, pontos e escolhas de bônus ficam na ficha, inclusive enquanto a distribuição está em andamento. Reabrir a tela não reseta os valores nem aplica bônus novamente. Perícias iniciais e escolhas de perícia/instrumento de multiclasse são lidas dos dados salvos, sem listas React concorrentes. Patrono também é lido da ficha.
- A troca de ficha remonta a árvore da página por ID. Alternar abas mobile pode desmontar a criação sem perder as escolhas.
- `selecionarClasseNoNivel` centraliza a reatribuição e recalcula os níveis de cada classe a partir de `nivelEscolhido`. `podeTerSubclasse` usa limiar, não igualdade. Guerreiro 4 mantém sua subclasse ao mover o nível 5 para Mago.
- `setSubClasse` substitui a escolha da mesma classe. Remoção/troca invalida apenas efeitos com a origem explícita dessa subclasse e escolhas específicas reconhecidas, como terreno e animal totêmico. Novos efeitos da tela de níveis registram classe e nível de classe de origem: acompanham a nova posição daquele nível, ou são removidos se ele deixar de existir. Efeitos manuais não são deslocados por índice.

## Dados e migração

O envelope F1 permanece na versão 1. Campos adicionais opcionais: `idiomasLivres`, `atributosSelecionados`, `distribuicaoAtributos`, `migracoes`, `subclassesAnteriores` e `nivelClasseOrigem` nos efeitos. A edição salva é preservada; ausência de edição mantém o comportamento legado DND_2014. Nenhuma conversão para DND_2024.

Na leitura de subclasses duplicadas da mesma classe, a última seleção fica ativa e as anteriores são preservadas integralmente em `subclassesAnteriores`. A ficha registra `F3-subclasse-unica-v1` em `migracoes`. A leitura não grava automaticamente. Na primeira gravação da coleção migrada, `fichas.backup.F3-subclasse-unica-v1` guarda a coleção anterior, além do backup rotativo da F1. Essa cópia permanente não é sobrescrita; falha de criação/verificação bloqueia a gravação. A repetição da leitura não duplica o arquivo de subclasses. Importações também preservam as seleções deslocadas dentro da própria ficha.

## Validação

Comandos e logs desta execução:

- `npm test -- --watchAll=false --runInBand` com `CI=true`: 43 testes em 3 suítes; [log](F3-test.log).
- `npm run lint`: aprovado, código de saída 0; [log](F3-lint.log).
- `npm run typecheck`: aprovado, código de saída 0; [log](F3-types.log).
- `npm run build:verify`: aprovado, código de saída 0, incluindo compilação e ofuscação em diretório temporário exclusivo, usando o script F2; [log](F3-build.log). O diretório `build` existente não é destino desse comando.

Os dez novos casos incluem quatro combinações de Guerreiro/Ladino arcano × 2014/2024, edição após importar, comparação de snapshots e dos cálculos de magias depois de reabrir, migração idempotente, falha no backup, remapeamento de efeitos com origem, retenção de dados antigos/manuais e fluxo React real de idiomas/perícias/distribuição, abas mobile e troca/reabertura da ficha. O modal de magias é substituído por um botão no teste do consumidor; a aba e seus cálculos reais são exercitados. O fluxo de idiomas usa o modal real. Testes React executados em JSDOM, sem validação visual em navegador físico.

## Limites e pendências

- Fichas antigas não registravam o método de distribuição nem o resultado original das rolagens. Esses dados não são inventados; os valores de atributos salvos são preservados. A nova distribuição passa a registrar suas escolhas.
- Idiomas antigos não têm proveniência: a reconstrução usa a ordem dos idiomas não fixos até o número de escolhas. Ajustes manuais permanecem no array original; a origem exata não pode ser recuperada sem informação adicional.
- Efeitos legados sem origem explícita são preservados, mesmo depois de editar níveis. Revisão manual pode ser necessária para benefícios antigos cuja origem não pode ser determinada com segurança.
- Persistem avisos de React nos testes existentes e avisos de chaves em componentes legados; Browserslist informa base desatualizada. `git diff --check` também aponta whitespace preexistente em `src/pages/css/Home.css`, fora deste trabalho.
- Nenhuma expansão ou revisão geral do catálogo. Limiares confrontados com [Classes 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes) e [Character Classes 2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes). No modelo legado, o patrono de Bruxo 2014 é separado e `subClasse` representa a Dádiva do Pacto. Conteúdo não coberto por essas fontes continua não verificado; os testes de restauração comprovam preservação, não exatidão editorial do catálogo.
