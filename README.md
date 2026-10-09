# Minha Ficha D&D

Aplicação web para criação e gerenciamento de fichas de personagens de **Dungeons & Dragons 5e**.

O projeto permite montar personagens escolhendo raça, sub-raça, classe e background, além de acompanhar progressão de níveis, multiclasses, perícias, idiomas, inventário, equipamentos e magias. Também oferece salvamento local no navegador, importação e exportação em JSON e geração da ficha em PDF.

## Funcionalidades

- Criação de fichas de personagem para D&D 5e
- Seleção de raça, sub-raça, classe e background
- Configuração de atributos, perícias, idiomas e efeitos
- Progressão de níveis e suporte a multiclasses
- Gerenciamento de inventário, equipamentos e magias
- Salvamento local no navegador, com status visível e ação Salvar Ficha
- Importação e exportação de fichas em `JSON`
- Exportação da ficha em `PDF`
- Interface adaptada para desktop e mobile

## Tecnologias utilizadas

- React
- JavaScript
- TypeScript
- React Router DOM
- pdf-lib
- Framer Motion
- React Toastify

## Requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) em versão LTS
- `npm` (normalmente já vem com o Node.js)

## Instalação

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Acesse a pasta do projeto

```bash
cd MinhaFichaDnd
```

### 3. Instale as dependências

```bash
npm ci
```

## Como executar o projeto

Para iniciar o ambiente de desenvolvimento:

```bash
npm start
```

Depois disso, a aplicação ficará disponível em:

```bash
http://localhost:3000
```

## Scripts disponíveis

### `npm start`
Inicia a aplicação em modo de desenvolvimento.

### `npm run build`
Gera a versão de produção na pasta `build/` e executa a etapa de ofuscação do JavaScript.

### `npm test`
Executa os testes do projeto.

## Estrutura geral do projeto

- `src/pages` - páginas principais da aplicação
- `src/pages/components` - componentes da criação e edição da ficha
- `src/api` - classes e regras de negócio da ficha e entidades do jogo
- `src/utils` - utilitários, incluindo exportação para PDF

## Observações

- O projeto usa os scripts do `react-scripts`, então o recomendado é iniciar com `npm start`.
- Caso o comando falhe, confirme se as dependências foram instaladas com `npm install`.
- As fichas ficam persistidas localmente no navegador.

## Objetivo do projeto

Este projeto foi desenvolvido para facilitar a criação e manutenção de fichas de personagens de RPG, centralizando regras, atributos e recursos do personagem em uma interface web mais prática e organizada.

## Verificação automatizada

Revalidação e correções de 08/10/2026: [matriz P01–P19/N01/N02 e evidências](docs/revisao-pendencias-2026-10-08/IMPLEMENTACAO.md). O comando `npm start` limita o servidor de desenvolvimento a `127.0.0.1`; ele não deve ser usado como hosting de produção.

Os comandos reproduzíveis de testes, lint, tipagem e build descartável, decisões de configuração e limitações estão em [docs/VERIFICACAO.md](docs/VERIFICACAO.md). Para validar sem alterar `build/`, execute `npm run build:verify`.

## Conteúdo por edição (F7 — A15, A17, A23)

Novas escolhas de talentos e magias registram ID, edição, fonte, revisão/errata, categoria e licença. O catálogo é parcial: Alerta 2014/2024, Habilidoso e Imobilizador 2024 têm escolhas/benefícios implementados; Curar Ferimentos tem escola e fórmula próprias de cada edição. Outros talentos permanecem pendentes de implementação. O índice de magias 2024 não usa a lista 2014 como substituta.

Fichas antigas mantêm referências, efeitos e snapshots. Conteúdo legado e revisões desconhecidas aparecem como pendências; revisar uma escolha é uma ação explícita que arquiva o registro anterior. O JSON preserva esses dados e o PDF identifica a revisão/pendência.

[Atribuições e licenças do subconjunto](public/CONTEUDO-LICENCAS.txt). Os resumos em português são adaptações locais dos SRDs; esta atribuição não certifica a procedência de todo o acervo antigo. Consulte [fontes, escopo, validações e pendências](docs/auditoria-2026-10-06/F7-conteudo.md) e o [inventário de assets/PDF](docs/auditoria-2026-10-06/F7-assets.json).

## Salvamento e uso

As fichas ficam no `localStorage` deste navegador e origem; não há conta, servidor ou sincronização entre dispositivos. O contexto observa alterações nas fichas e tenta gravar após 300 ms; Salvar Ficha força a gravação. Confirme o status “Salvo neste navegador”. Em caso de erro, use as ações de recuperação ou exporte as alterações em memória antes de fechar. Limpar os dados do navegador pode apagar as fichas; mantenha cópias JSON.

Carregar Ficha Salva também permite importar JSON (até 5 MiB). IDs repetidos exigem escolher cópia ou substituição. Exportar JSON preserva os dados editáveis; PDF é uma representação para consulta/impressão, não um backup completo. XML não está implementado; o mapeamento de PDF é uma ferramenta interna e não aparece no menu.

Escolha 2014 ou 2024 ao criar a ficha. A edição persistida é mantida ao reabrir; fichas legadas sem edição seguem 2014. Os catálogos e automações são parciais em ambas as edições; a presença de uma opção não garante implementação completa de seus efeitos. Confira as pendências exibidas e o relatório de conteúdo acima.

Os seletores usam botões acionáveis com Enter/Espaço. Nos diálogos, Tab/Shift+Tab percorrem os controles e Escape cancela; fechar devolve o foco ao controle de origem, quando ele continua disponível. Validações automatizadas e limites de verificação assistiva estão em [A22/A26](docs/auditoria-2026-10-06/F8-acessibilidade.md).
