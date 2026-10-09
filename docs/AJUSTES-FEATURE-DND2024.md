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
