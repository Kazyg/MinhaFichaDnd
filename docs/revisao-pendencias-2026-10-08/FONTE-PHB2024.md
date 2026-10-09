# Fonte fornecida pelo usuário — 08/10/2026

Após o fechamento de `IMPLEMENTACAO.md`, o usuário indicou o arquivo local `C:/Users/Guilherme/Downloads/dampd-5e---livro-do-jogador-2024.pdf` e autorizou: “vc pode usar as magias e talentos contidos nesse livro”. A fonte de consulta de 2024 está definida. Foi solicitada a delimitação entre todas as entradas do livro e uma seleção; essa resposta permanece pendente neste registro. O fornecimento desta fonte não altera o conteúdo de 2014.

## Identificação conferida no arquivo

- 397 páginas PDF; 36.744.043 bytes.
- SHA-256: `55f530ae733992d95cf6c7a000b86b40a2166e98292347e76db4693941f7236c`.
- Livro do Jogador, regras de 2024; tradução comunitária Heróis Anônimos, conforme prefácio na página PDF 6.
- Créditos na página PDF 8: primeira edição brasileira em 04/02/2025; versão atual declarada **6ª edição, 13/08/2025**. Essa é a revisão da tradução, não uma nova edição das regras.
- Talentos: capítulo 5, páginas impressas 199–211; índice nas páginas impressas 199–200 (PDF 205–206).
- Descrições das magias: páginas impressas 239–343 (PDF 245–349).
- Nessas seções, página PDF = página impressa + 6.

## Inventário e limites

[FONTE-PHB2024-indice.json](FONTE-PHB2024-indice.json) registra **75 talentos** (10 de Origem, 43 Gerais, 10 Estilos de Luta e 12 Dádivas Épicas) e **391 magias**, com nomes e localizadores. Aumento no Valor de Atributo está incluído na contagem dos talentos gerais; o aplicativo já o trata separadamente.

O índice foi extraído com PDF.js 4.10.38, instalado em diretório temporário, sem mudança das dependências do projeto. [indexar-fonte-phb2024.cjs](indexar-fonte-phb2024.cjs) permite repetir a extração com o arquivo original e o módulo do extrator. A verificação exige hash, contagens esperadas, nomes únicos e correspondência da quantidade de magias com os 391 cabeçalhos de tempo de conjuração. A extração contempla os dois caracteres de ordinal encontrados no PDF (`º` e `°`).

Este inventário não implementa seleção, requisitos, concessões, efeitos ou persistência. O catálogo operacional continua como no fechamento anterior; não foram substituídas revisões salvas. Não foi feita revisão mecânica de todas as entradas nem conferência da errata oficial nesta etapa.

## Aplicação a P05/P09/P15/P18

A pendência de acesso ao livro de 2024 foi atendida. A escolha entre todo o índice e entradas específicas foi apresentada ao usuário. Para cada entrada incluída, continuam valendo os contratos do prompt: escolhas, requisitos no nível de aquisição, repetibilidade, categoria, efeitos persistidos, isolamento entre fichas e preservação de revisões/snapshots anteriores. Concessões por talentos precisam de vagas e usos próprios; a autorização para magias e talentos não inclui automaticamente implementar todas as características de espécies, classes e subclasses do livro.

Novas entradas devem identificar esta tradução como fonte fornecida, sem classificá-la como tradução oficial ou atribuir-lhe a licença CC do SRD. Os créditos do arquivo não demonstram licença de redistribuição. O livro integral e sua extração textual permanecem fora do repositório; o índice contém somente nomes, categorias, níveis e localizadores. Na implementação, conferir regras e produzir resumos próprios, mantendo a procedência e as pendências de licença explícitas. Divergências entre esta revisão e erratas posteriores, especialmente a magia de elementais menores já citada em F7, exigem decisão de revisão explícita antes de publicar mecânica nova.
