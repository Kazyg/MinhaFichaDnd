# Ajustes da interface e progressão — 09/10/2026

Base: `feature/dnd2024`, commit `e478ced`. Revisadas as notas de implementação e auditoria de progressão da branch.

## Alterações

- Retirados da tela de perícias os controles de especialização manual e os painéis de revisão de dados antigos/especialização por fonte oficial. Efeitos, escolhas oficiais e arquivos anteriores continuam preservados no modelo e na exportação.
- Retirados os textos solicitados de perícias, armas, sintonização e conjuração, o link de sintonização e os dois botões de recuperação de espaços por descanso. Consumo de espaços e regras do domínio não foram apagados.
- A faixa de salvamento fica oculta quando tudo está salvo; estados de gravação pendente, erros e recuperação permanecem disponíveis.
- Listas das modais: filtro escuro, linhas cinza, opção selecionada laranja com borda branca, botões ocupando a largura da linha e rolagem cinza. Layout móvel preservado.
- Estilo de luta: a modal estava dentro do `map` de características, criando várias instâncias que tornavam umas às outras `inert`. Agora existe uma única instância. O estilo atual continua disponível ao reabrir, sem liberar duplicatas de outras fontes.
- Progressão: avançar uma classe já adquirida não repete a validação de entrada em multiclasse. Uma classe nova continua exigindo os atributos das classes envolvidas; aumentos futuros não autorizam escolhas anteriores.

## Verificação

- Testes das sete suítes diretamente relacionadas: **105/105 passaram**.
- Suíte completa: **243 passaram, 3 falharam**, em 15 suítes.
- As três falhas de `conteudoVersionado.test.js` foram reproduzidas em uma cópia isolada do commit original: expectativa de ausência de Raio de Fogo 2024, data de consulta fixada em 07/10 e expectativa de Iniciado em Magia ainda pendente. Não foram alteradas por este trabalho.
- `npm run lint`, `npm run typecheck` e `npm run build:verify`: passaram. O build mantém o aviso de tamanho do bundle.
- Conferência em Chromium: seleção de Anão com borda branca e preenchimento laranja; modais verificadas em 1280×900 e 390×844, sem transbordamento horizontal na página móvel.
- Testes de regressão cobrem modal única, seleção/troca/reabertura de estilo, avanço de classe adquirida em ambas as edições, bônus já adquirido liberando classe nova e preservação de efeitos/consumo após as remoções.

As alterações são commitadas na branch `feature/dnd2024` a pedido do usuário. O push não está incluído neste ajuste.

## Segunda revisão — modais, talentos e multiclasse

- Removidos o aviso de Restaurar Vida, o link de regras de descanso e a mensagem de catálogo parcial de talentos na progressão.
- Retirado o preenchimento laranja da opção selecionada nas modais: fundo cinza com borda branca.
- Restaurado o formato de escolha Atributo/Talento da `main`, sem o fieldset e o texto de instrução introduzidos na feature. Mantida a confirmação atômica do aumento para não gravar uma distribuição incompleta.
- O botão de talentos usa o estilo da `main`, mostra o talento salvo e abre o catálogo completo. Requisitos, duplicidade e conteúdo sem suporte continuam bloqueando a confirmação, sem ocultar os registros da lista.
- A seleção de subclasse aparece apenas no nível de entrada da classe, respeitando as diferenças entre 2014 e 2024, em vez de repetir nos níveis seguintes.
- O aviso temporário de salvamento agora é flutuante: aparecer/desaparecer não altera a altura da página. Entrada, recuperação e retorno de foco das modais usam `preventScroll`.
- Classes não elegíveis continuam visíveis para consulta, com o motivo e os atributos usados na avaliação. A modal não fecha se a gravação da escolha falhar.
- O caso enviado pelo usuário foi conferido: Paladino 2014 com Carisma 8 não atende ao requisito de Carisma 13 da classe de origem para multiclasse. Não foi removida essa regra. Testes confirmam a seleção de outra classe no nível 2 quando todos os requisitos são atendidos.
- Busca e resolução de conteúdo deixam de copiar os catálogos completos em cada cálculo derivado; apenas a entrada solicitada é clonada. Referências antigas, revisão e isolamento dos objetos retornados foram preservados.

Conferência com Chromium e uma cópia da ficha enviada: catálogo 2014 com 42 opções visíveis, Alerta selecionado e persistido, requisito de multiclasse explicado e zero eventos de rolagem da página na confirmação da modal. O arquivo enviado não foi incluído no repositório.

Verificação final desta revisão: **252 testes passaram e as mesmas 3 falhas preexistentes permaneceram**, em 16 suítes. Lint, TypeScript e build com ofuscação passaram. Commit e push para `feature/dnd2024` autorizados pelo usuário; `main` permanece inalterada.

## Terceira revisão — links de licença e filtro de multiclasse

Removidos os links “Atribuições e licenças do conteúdo” das interfaces de talentos e magias. Os arquivos de atribuição e licença continuam preservados no projeto.

A modal de multiclasse voltou a listar somente classes elegíveis. Na segunda revisão, todas estavam visíveis para consulta, mas a confirmação das inválidas permanecia bloqueada; agora elas também são ocultadas, conforme solicitado. Os requisitos da tabela (13, Guerreiro com OU, Monge/Paladino/Patrulheiro com E) continuam aplicados no domínio e na confirmação. Avançar uma classe já adquirida não exige uma nova entrada em multiclasse.

Testes de interface verificam o filtro nas duas edições, incluindo bloqueio pelo requisito da classe de origem e rejeição de uma classe inválida pela operação do modelo.
