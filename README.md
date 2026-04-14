+# Minha Ficha D&D
+
+Aplicação web para criação e gerenciamento de fichas de personagens de **Dungeons & Dragons 5e**.
+
+O projeto permite montar personagens escolhendo raça, sub-raça, classe e background, além de acompanhar progressão de níveis, multiclasses, perícias, idiomas, inventário, equipamentos e magias. Também oferece salvamento local no navegador, importação e exportação em JSON e geração da ficha em PDF.
+
+## Funcionalidades
+
+- Criação de fichas de personagem para D&D 5e
+- Seleção de raça, sub-raça, classe e background
+- Configuração de atributos, perícias, idiomas e efeitos
+- Progressão de níveis e suporte a multiclasses
+- Gerenciamento de inventário, equipamentos e magias
+- Salvamento automático/local das fichas com `localStorage`
+- Importação e exportação de fichas em `JSON`
+- Exportação da ficha em `PDF`
+- Interface adaptada para desktop e mobile
+
+## Tecnologias utilizadas
+
+- React
+- JavaScript
+- TypeScript
+- React Router DOM
+- pdf-lib
+- Framer Motion
+- React Toastify
+
+## Requisitos
+
+Antes de começar, você precisa ter instalado:
+
+- [Node.js](https://nodejs.org/) em versão LTS
+- `npm` (normalmente já vem com o Node.js)
+
+## Instalação
+
+### 1. Clone o repositório
+
+```bash
+git clone <URL_DO_REPOSITORIO>
+```
+
+### 2. Acesse a pasta do projeto
+
+```bash
+cd MinhaFichaDnd
+```
+
+### 3. Instale as dependências
+
+```bash
+npm install
+```
+
+## Como executar o projeto
+
+Para iniciar o ambiente de desenvolvimento:
+
+```bash
+npm start
+```
+
+Depois disso, a aplicação ficará disponível em:
+
+```bash
+http://localhost:3000
+```
+
+## Scripts disponíveis
+
+### `npm start`
+Inicia a aplicação em modo de desenvolvimento.
+
+### `npm run build`
+Gera a versão de produção na pasta `build/` e executa a etapa de ofuscação do JavaScript.
+
+### `npm test`
+Executa os testes do projeto.
+
+## Estrutura geral do projeto
+
+- `src/pages` - páginas principais da aplicação
+- `src/pages/components` - componentes da criação e edição da ficha
+- `src/api` - classes e regras de negócio da ficha e entidades do jogo
+- `src/utils` - utilitários, incluindo exportação para PDF
+
+## Observações
+
+- O projeto usa os scripts do `react-scripts`, então o recomendado é iniciar com `npm start`.
+- Caso o comando falhe, confirme se as dependências foram instaladas com `npm install`.
+- As fichas ficam persistidas localmente no navegador.
+
+## Objetivo do projeto
+
+Este projeto foi desenvolvido para facilitar a criação e manutenção de fichas de personagens de RPG, centralizando regras, atributos e recursos do personagem em uma interface web mais prática e organizada.
