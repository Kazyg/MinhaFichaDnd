# MinhaFichaDnd

Aplicação web para criar e gerenciar fichas de personagens de Dungeons & Dragons 5e, com regras de 2014 e 2024.

[Aplicação publicada](https://minhafichadnd.com.br/) · [Repositório](https://github.com/Kazyg/MinhaFichaDnd) · [Arquitetura e documentação](docs/arquiteture.md)

O projeto reúne criação, progressão e consulta da ficha em uma interface para desktop e dispositivos móveis. Seu objetivo técnico é desenvolver e manter uma aplicação React com regras de domínio, persistência local e compatibilidade com documentos existentes, por meio de melhorias incrementais.

## Funcionalidades

- Seleção de raça/espécie, classe, subclasse e antecedente/origem por edição.
- Atributos, perícias, idiomas, efeitos, progressão de níveis e multiclasses.
- Inventário, armas, armaduras, sintonização e seleção de magias.
- Salvamento automático local e ação Salvar Ficha, com tratamento de falhas.
- Importação e exportação JSON, com escolha explícita entre cópia e substituição quando há colisão de ID.
- Exportação PDF carregada sob demanda, com tratamento de falha e nova tentativa.

As automações são parciais. Uma entrada no catálogo não garante implementação de todos os seus requisitos, escolhas ou efeitos; consulte as limitações abaixo.

## Tecnologias

React 18, JavaScript, TypeScript 4.9, React Router 6, Context API, Create React App (`react-scripts` 5), pdf-lib, Framer Motion e React Toastify. Testes com Jest e React Testing Library; verificação com ESLint e TypeScript.

## Executar localmente

Ambiente desta revisão: Node.js 24.14.0 e npm 11.9.0. O workflow usa Node 24. Instale a partir do lockfile:

```sh
git clone https://github.com/Kazyg/MinhaFichaDnd.git
cd MinhaFichaDnd
npm ci
npm start
```

Abra `http://127.0.0.1:3000`. O script limita o servidor de desenvolvimento ao loopback. Para publicação, use artefatos estáticos; o servidor de desenvolvimento não é hosting de produção.

## Verificação e build

| Comando | Finalidade |
| --- | --- |
| `npm test -- --watchAll=false --runInBand` | Executar a suíte uma vez |
| `npm run lint` | Verificar JS/JSX/TS/TSX |
| `npm run typecheck` | Verificar TS/TSX com `strict: true` |
| `npm run build:verify` | Compilar e ofuscar em temporário exclusivo, removido ao terminar |
| `npm run build` | Gerar e ofuscar em `build/` ou no `BUILD_PATH` informado |
| `npm run obfuscate` | Ofuscar manualmente o `build/` existente; desnecessário depois de `build` |

O build usa `javascript-obfuscator`. Ofuscação não substitui segurança ou licenciamento e aumenta o JavaScript. Prefira `build:verify` para preservar artefatos anteriores. `allowJs: true` e `checkJs: false` não oferecem checagem integral de tipos dentro de JavaScript.

## Organização

| Diretório | Responsabilidade |
| --- | --- |
| `src/pages` | Home, edição, modais e componentes de interface |
| `src/leveis` | Escolhas e progressão |
| `src/api/fichaPersonagem` | Modelo, persistência, restauração, seletores e regras |
| `src/api/rulesets` | Regras e referências por edição |
| `src/bibliotecas` | Catálogos legados e dados estáticos |
| `src/utils` | Utilitários e exportação PDF |
| `public` | Recursos estáticos, template PDF e atribuições |
| `scripts` | Inicialização local e build |
| `docs` | Documentação central em `arquiteture.md`, auditorias e evidências |

## Persistência e compatibilidade

As fichas ficam no `localStorage`, restritas ao navegador e à origem. Não há conta, backend de fichas ou sincronização entre dispositivos. Alterações são observadas e a gravação é tentada após 300 ms; Salvar Ficha força a gravação. Estados pendentes, erros e recuperação aparecem na interface; o indicador fica oculto quando tudo está salvo.

Limpar os dados do navegador pode apagar fichas. Mantenha cópias JSON fora dele. Em caso de erro, exporte as alterações em memória ou o conteúdo original pelas ações de recuperação antes de fechar. A importação aceita até 5 MiB. PDF serve para consulta/impressão e não substitui backup JSON.

Fichas legadas sem edição seguem 2014. Referências, snapshots, campos desconhecidos e escolhas arquivadas são preservados pelos contratos existentes; revisões desconhecidas não são convertidas silenciosamente. Testes usam armazenamento sintético, sem alterar fichas reais. O roteiro de recuperação está no [relatório anterior](docs/revisao-pendencias-2026-10-08/IMPLEMENTACAO.md#recuperação-mínima-p04p16).

## Limitações conhecidas

- Cobertura e automações diferem por edição. As regras de talentos de `feat/regras-2024` foram integradas com escolhas, requisitos, concessões e usos de magias; benefícios condicionais de combate continuam manuais. O acervo PHB 2024 vai além do subconjunto SRD auditado anteriormente, com licença de redistribuição pendente. Consulte a [integração e validação](docs/merge-regras-2024-2026-10-13/RELATORIO.md).
- XML não está implementado; o mapeamento PDF é uma ferramenta interna ausente do menu.
- O PDF usa Helvetica/WinAnsi: caracteres fora da cobertura podem virar `?`; o JSON mantém o texto integral.
- O bundle é grande, e a toolchain CRA mantém avisos e dependências vulneráveis. A revisão registra o alcance conhecido, sem afirmar segurança integral.
- Testes de componentes não certificam layout em navegador, zoom real, leitor de tela ou conformidade integral de acessibilidade. Resultados históricos e atuais são separados nos relatórios.

## Créditos e licenciamento

O subconjunto identificado em [CONTEUDO-LICENCAS.txt](public/CONTEUDO-LICENCAS.txt) usa os SRDs 5.1 e 5.2.1 da Wizards of the Coast sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), com atribuição e indicação das adaptações locais. Os resumos em português não são traduções oficiais. Veja a [fonte oficial dos SRDs](https://www.dndbeyond.com/srd).

Essa licença não se estende automaticamente ao acervo inteiro. Textos legados, tradução comunitária do PHB 2024, imagens, ícones e modelo PDF têm pendências de procedência ou permissão de redistribuição. Acesso a um livro e créditos em um arquivo não comprovam autorização para publicação. Não foi adicionada licença genérica que englobe esses materiais.

Consulte a [auditoria atual](docs/revisao-portfolio-2026-10-13/RELATORIO.md), o [inventário de assets](docs/auditoria-2026-10-06/F7-assets.json) e a [auditoria de conteúdo](docs/auditoria-2026-10-06/F7-conteudo.md). A recomendação de divulgação como portfólio permanece condicionada à resolução das pendências de conteúdo e validação funcional.

Não foram incluídas capturas de tela: a autorização dos recursos visuais ainda não foi documentada.
