# Arquitetura — MinhaFichaDnd

Documento central de arquitetura e manutenção do projeto.

## Aplicação e execução

SPA React 18 com JavaScript, TypeScript 4.9, React Router 6 e Create React App (`react-scripts` 5). Usa Context API, React Toastify, Framer Motion e pdf-lib. Não há backend de fichas, autenticação ou sincronização entre dispositivos.

A aplicação executável está na raiz. `src/App.js` envolve as rotas no `FichaProvider`: `/` abre a Home, `/criar-ficha` abre a edição e `/mestre` carrega a Área do Mestre sob demanda. A interface tem layouts para desktop e dispositivos móveis.

```sh
npm ci
npm start
```

O servidor local usa `http://127.0.0.1:3000`, limitado ao loopback por `scripts/start-local.cjs`. Para produção, hospedar os arquivos estáticos compilados e configurar fallback das rotas da SPA para `index.html`.

## Estrutura e responsabilidades

| Caminho | Responsabilidade |
| --- | --- |
| `src/pages` | Home, editor, componentes, modais e estilos |
| `src/leveis` | Escolhas de nível, progressão e multiclasses |
| `src/api/fichaPersonagem` | Modelo, contexto, persistência, restauração, inventário, conjuração e seletores |
| `src/api/classesPrincipais` | Modelos de domínio e concessões de equipamentos |
| `src/api/rulesets` | Contratos, catálogos, fontes e regras por edição |
| `src/bibliotecas` | Catálogos legados e dados estáticos |
| `src/utils` | Utilitários e exportação PDF |
| `src/features/areaMestre` | Campanhas, anexos, workspace e motor de combate |
| `public` | Entradas estáticas: HTML, imagens, template PDF e atribuições |
| `scripts` | Inicialização, compilação, importação e auditoria de catálogos |
| `arquiteture.md` | Este guia de arquitetura e manutenção |
| `tmp` | Arquivos de trabalho locais, ignorados pelo Git |
| `build` | Saída gerada e ignorada pelo Git; recriada por `npm run build` |

### Fluxo de dados

A interface usa o contexto da ficha e os módulos de domínio. As regras e os seletores calculam os resultados a partir do modelo e dos efeitos; a persistência serializa a ficha e restaura modelos e registros legados na leitura. Ao alterar uma regra, conferir também importação/exportação, progressão e isolamento entre fichas.

## Persistência, importação e recuperação

- `FichaPersonagem.ts` contém o modelo; `FichaContext.tsx` coordena o estado e a gravação. `fichaStorage.ts` valida documentos; `fichaRestauracao.ts` restaura modelos.
- O armazenamento das fichas do editor é `localStorage`, por navegador e origem. As chaves são `fichas`, `fichas.backup` e `fichas.recuperacao`.
- Alterações disparam tentativa de gravação após 300 ms. Salvar Ficha força a gravação; a interface informa pendências, falhas e recuperação.
- Importação JSON aceita até 5 MiB e valida os campos conhecidos. Em colisão de ID, o usuário escolhe cópia ou substituição.
- Campos desconhecidos, snapshots e escolhas arquivadas são preservados. Fichas sem edição seguem 2014; revisões ou edições desconhecidas não são reinterpretadas silenciosamente.
- Em falhas, exportar as alterações em memória ou o original pelas ações de recuperação antes de fechar. JSON é o backup recuperável; PDF é para consulta/impressão. Limpar os dados do navegador pode apagar as fichas.

A Área do Mestre usa IndexedDB independente e backups ZIP de campanhas. Seus contratos, migrações e fluxos estão no [README do módulo](src/features/areaMestre/README.md).

## Edições, referências e progressão

A edição da ficha determina catálogos e seletores. Aquisições conservam referências `{id, edicao, revisao}` e snapshots; não há conversão automática entre 2014 e 2024. A duplicação entre catálogos de origem e conteúdo versionado tem função de compatibilidade: unificá-los exige comparação por entrada e preservação de referências.

Talentos verificam requisitos, repetição e escolhas obrigatórias. Cada aquisição conserva suas concessões e escolhas. A remoção afeta somente a origem correspondente; bônus de níveis inativos não se aplicam. Escolhas 2024 usam `escolhasTalento2024`, preservando os formatos legados de `escolhasTalento`. Benefícios condicionais de combate continuam sob controle da mesa.

Magias concedidas por talentos não consomem a seleção de classe. Usos gratuitos são persistidos no efeito e restaurados pelo descanso disponível na seção; truques não os gastam. A implementação 2024 não substitui integralmente a progressão legada de classes.

## Conjuração e apresentação das magias

`fichaConjuracao.ts` concentra os registros e limites; os catálogos por edição e `magiasRevisadas.json` fornecem conteúdo e fórmulas verificadas. Aliases conservam a edição da origem, sem substituir descrições 2014 por textos 2024.

Novas seleções de círculo 1 ou superior são preparadas automaticamente, inclusive magias conhecidas. Truques têm contagem separada. Para Mago, a escolha respeita preparação e aquisição no grimório; cópias têm origem separada. Reselecionar uma magia não preparada reativa o registro existente. A leitura não prepara em massa nem exclui registros antigos.

Fórmulas estruturadas especificam dados, tipo, bônus, modificador e escalonamento. Projéteis/alvos e dano por projétil são separados. Alterar o círculo de visualização não rola dados nem consome espaços. Não inferir cálculos de combate a partir de texto durante a renderização.

A revisão de 14/10 inventariou 858 registros e conferiu 184 registros nas fontes oficiais, sem certificar todo o acervo. Lago e Ralo de osso não são oferecidos para novas escolhas; registros salvos permanecem preservados. Há candidatos de combate ainda sem conferência individual.

Reprodução:

```sh
node scripts/auditar-catalogo-magias.cjs
node scripts/revisar-magias.cjs
```

O segundo comando depende de `tmp/srd51-spells.json` e `tmp/srd52-spells.json`, com registros `{ page, text }` extraídos dos PDFs oficiais. São entradas locais necessárias para regeneração, embora não sejam necessárias para executar ou compilar a aplicação.

As auditorias auxiliares gravam suas saídas em `tmp/auditoria-magias` e
`tmp/auditoria-equipamentos-magicos`. O extrator do PHB recebe a extração e o índice
como entradas externas: `node scripts/extrair-phb2024.cjs <pages.json> <indice.json>`.

## Inventário, concessões e equipamentos mágicos

Concessões de background são reconciliadas por IDs e origem, sem substituir inventário, atributos ou progressão. Trocar uma origem remove somente as instâncias rastreadas; reselecionar a mesma concessão não repõe itens consumidos. Proficiência em ferramenta não implica posse física.

As moedas registram saldo observado, contribuição restante e gastos. Retiradas consomem primeiro a contribuição; depósitos não a aumentam. Trocar backgrounds não recupera dinheiro gasto. Fichas antigas não recebem crédito ao abrir/importar; a seleção explícita inicia a concessão quando aplicável. Divergência financeira suspende a reconciliação e preserva os valores. Backgrounds 2024 oferecem equipamentos e moedas próprios ou somente 50 PO, com escolha persistida.

Equipamentos mágicos persistem snapshot, base e vínculo por ID de instância. Equipar e sintonizar são estados independentes. Melhorias vinculam-se a equipamentos existentes; bases alternativas exigem escolha. Seletores calculam CA, ataque e dano suportados. Cargas, reações, ativações e benefícios condicionais permanecem manuais. Dados sem base verificável não geram equipamentos automaticamente.

## Exportação PDF

O template está em `public/ficha-de-personagem-dd-5e.pdf`. A exportação com pdf-lib é carregada sob demanda e oferece tratamento de falha e nova tentativa. Helvetica/WinAnsi limita caracteres; os não suportados podem virar `?`, enquanto JSON conserva o texto integral. XML não está implementado; o mapeador PDF é ferramenta interna fora do menu.

## Build, recursos estáticos e limpeza

`public` é fonte necessária. CRA copia seus recursos para `build` e gera HTML e bundles em `build/static`; por isso há arquivos repetidos. Não editar as cópias geradas. `scripts/build.cjs` compila e aplica ofuscação. `BUILD_PATH` altera o destino. `npm run obfuscate` existe para uso manual e é desnecessário após o build normal.

`npm run build:verify` cria saída exclusiva no temporário do sistema e a remove ao terminar, preservando builds locais. Ofuscação aumenta o JavaScript e não substitui segurança ou licenciamento.

O antigo `my-app` continha apenas README e gitignore residuais e foi removido. O gitignore da raiz governa o projeto.

### Arquivos locais em tmp

`srd51-spells.json` e `srd52-spells.json` são entradas de `scripts/revisar-magias.cjs`
e devem ser preservados para regeneração. Logs, capturas, perfis de navegador e
saídas auxiliares são descartáveis. A pasta é ignorada pelo Git e não é necessária
para executar ou compilar a aplicação.

## Validação e limites conhecidos

Executar na raiz, usando Node 24 no CI:

```sh
npm test -- --watchAll=false --runInBand
npm run lint
npm run typecheck
npm run build:verify
```

O workflow `.github/workflows/validate.yml` instala com `npm ci` e executa esses quatro checks em push/PR; não faz deploy. Jest/React Testing Library verificam cenários sintéticos, sem acessar fichas reais. TypeScript usa `strict: true`, mas `allowJs: true` com `checkJs: false` não garante checagem integral de JavaScript.

Testes DOM não certificam layout real, zoom, leitores de tela ou acessibilidade integral. CRA tem dívida de dependências e o bundle é grande; verificações antigas não representam uma análise atual de segurança.

## Conteúdo e licenciamento

[CONTEUDO-LICENCAS.txt](public/CONTEUDO-LICENCAS.txt) delimita o material SRD e as atribuições. A licença do subconjunto SRD não abrange automaticamente o acervo completo, traduções comunitárias, imagens, ícones ou o template PDF. Não há licença geral que resolva essas pendências. Resumos locais não são traduções oficiais.

Manter origem, edição, página, revisão e licença junto aos registros. O acesso a um livro ou sua citação não comprova permissão de redistribuição. A divulgação como portfólio permanece condicionada às pendências documentadas.

