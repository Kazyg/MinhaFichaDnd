# A22/A26 — teclado, foco e clareza

Implementação em 08/10/2026. Sem commit/deploy, novas dependências, migração ou alteração de fórmulas D&D. O checkout já continha alterações extensas; foram preservadas. A busca no projeto e a consulta dos caminhos ancestrais não localizaram AGENTS.md.

## Mudanças

- `AccessibleDialog` compartilha nome/papel modal, foco inicial no título, contenção de Tab/Shift+Tab, Escape, isolamento do fundo com `inert`/`aria-hidden` e restauração desses atributos ao fechar. Retorna ao acionador conectado ou ao destino da página se ele foi desmontado. Recupera foco quando um controle é removido dentro do diálogo.
- Home, todos os seletores em `pages/modals`, vida, nível e detalhes do inventário usam esse ciclo. As opções de lista e a abertura de fichas são botões nativos; as seleções expõem `aria-pressed`. Filtros, importação, nome, XP e vida têm nomes acessíveis. Erros de importação e talento são associados aos controles; o erro de magia é associado à confirmação.
- `refreshKey` continua notificando alterações, mas não é usado como chave para remontar listas, inventário, perícias e níveis. Mantida a chave por ID de ficha da F3. A mudança de layout mobile/desktop oferece destino de foco quando desmonta o campo ativo.
- Removido o overlay vazio que era criado imperativamente pelo modal de vida. A barra de vida é botão nativo. Cálculos, aplicação de dano/cura e persistência permanecem iguais.
- Menu nomeado, estado expandido, Escape e retorno de foco. XML simulado e Mapear PDF de depuração saíram do menu; nenhum exportador XML foi implementado. Falha de PDF aparece como mensagem para o usuário.
- CSS permite rolagem, quebra de conteúdo e rodapé flexível; seletores empilham em telas estreitas. Foco visível e escolha selecionada têm indicação visual. README sem prefixos de patch; documento Next.js substituído por indicação da SPA ativa e seus comandos.

## Integração F1/F3

Sem agentes F1/F3 ativos nesta sessão; este registro documenta a integração com o código existente, sem envio de mensagens externas. O contexto continua responsável por status, erros, salvamento e recuperação. A Home reproduz seus erros dentro do diálogo para não ocultar falhas de criação/importação/exclusão atrás do fundo isolado. Mantidos debounce de 300 ms, gravação explícita, IDs, escolhas e edição persistida.

O teste mobile da F3 foi adaptado apenas para clicar no botão dentro do item de idioma. As mesmas verificações de troca de idioma, abas, fichas, perícias e distribuição persistida foram mantidas.

## Validação e limites

Comandos: `npm test -- --watchAll=false --runInBand`, `npm run lint`, `npm run typecheck` e `npm run build:verify`. Logs desta execução: `F8-test.log`, `F8-lint.log`, `F8-types.log`, `F8-build.log`; testes direcionados em `F8-targeted.log`.

Resultado final: **10 suítes / 211 testes aprovados; lint e tipos com saída 0; build de produção e ofuscação com saída 0**, em diretório temporário descartável. O `build/` existente não foi usado. `git diff --check` também detecta whitespace preexistente em `src/pages/css/Home.css:115`, arquivo não editado nesta tarefa.

Testing Library/user-event exercitam criação e reabertura por teclado em 2014/2024, cancelamento, Tab/Shift+Tab, foco inicial/retorno, seleção de talento e idioma, conteúdo extenso, atualização/remoção de controle, nomes de campos, erro de importação, menu e vida. O teste F3 exercita o layout mobile em JSDOM a 480 px. JSDOM não comprova aparência, zoom, layout ou anúncio por leitor de tela.

Não há ferramenta de navegador visual/leitor de tela disponível nesta sessão. Pendentes: NVDA/VoiceOver, navegação real em desktop/mobile, zoom 200%/400%, contraste e inspeção de conteúdo extenso. A revisão CSS não substitui esses testes; não se declara conformidade WCAG integral. Dependências não foram atualizadas para suprimir avisos de Browserslist. Os logs de teste mantêm os avisos de React `act` e React Router.

## Referências técnicas consultadas

- [WAI-ARIA APG: diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): foco inicial, contenção, Escape, retorno e fundo inerte.
- [HTML Standard: button](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element): controle nativo para ações de seleção.
