# Revisão da aba Magias — 14/10/2026

A seleção prepara automaticamente as novas magias de círculo 1 ou superior, inclusive as conhecidas. Truques mantêm sua contagem separada. Para o Mago, a escolha precisa caber tanto no limite de preparação quanto no limite de aquisição do grimório; cópias continuam separadas da progressão. Selecionar novamente uma magia anteriormente registrada e não preparada reativa o registro existente, sem duplicá-lo. Não há preparação em massa nem exclusão de registros antigos na leitura da ficha.

Os cards ocupam uma coluna em toda a largura da aba. Ícones consumidos preservam o formato, com cinza mais claro, opacidade de 85% e contorno. Contadores, identidade dos ícones, salvamento e descansos não foram alterados nesta revisão. Os cards e o seletor usam uma apresentação voltada ao jogador: descrição expansível, propriedades, fórmulas e círculo de conjuração; procedimentos de revisão, referências internas e ações administrativas não aparecem.

## Cobertura e limites

- Inventário sistemático: **858 registros**, sendo 467 nomes de 2014 e 391 de 2024. São nomes do acervo, não 858 magias distintas; há variantes de grafia.
- **184 registros** recebem dados conferidos nas fontes oficiais: 93 de 2014 e 91 de 2024, incluindo aliases. O conjunto estruturado contém 87 definições de 2014 e 91 de 2024.
- **97 correspondências** recuperam descrições de 2014 já existentes sob outra grafia, capitalização ou tradução, sem usar textos 2024 como substitutos. Essa recuperação não certifica a procedência ou a licença dos textos locais; seus metadados continuam preservados.
- Dois nomes continuam sem identificação segura: **Lago** e **Ralo de osso**. Não são oferecidos para novas escolhas. Fichas que já os contêm preservam seus registros e mostram uma descrição de indisponibilidade em linguagem simples.
- A revisão não certifica integralmente todo o acervo. A auditoria identifica **190 candidatos de combate em 2014 e 181 em 2024** que ainda exigem conferência individual antes de estruturar seus efeitos. Podem incluir condições, tabelas, criaturas invocadas e fórmulas que não representam dano de conjuração. Seus números não são inferidos durante a renderização.
- Resumos próprios de mecânicas verificadas substituem a necessidade de reproduzir texto integral protegido. Eles não substituem a descrição completa do livro para condições, frequência de aplicação, exceções ou resolução pela mesa.

[auditoria.json](auditoria.json) registra cada entrada, a correspondência, a fonte da verificação e os candidatos restantes. As indicações extraídas do texto na auditoria servem para localizar trabalho de revisão; não são usadas para calcular ou renderizar fórmulas.

## Dados de combate

As fórmulas persistidas especificam dados, tipo, bônus fixo, uso do modificador, escalonamento por círculo ou nível, intervalo de círculos e rótulo. Projetéis/alvos são calculados separadamente do dano por projétil. Fórmulas alternativas e parcelas distintas recebem rótulos próprios. Não há rolagem automática nem consumo de espaço ao alterar o círculo de visualização.

Exemplos verificados:

- Mísseis Mágicos: 1d4 + 1 de Energia por dardo; três dardos, mais um por círculo superior; acerto automático, sem ataque ou resistência.
- Rajada Mística/Raio Místico: 1d10 por feixe; a quantidade de feixes cresce nos níveis 5, 11 e 17, sem multiplicar o dano de cada feixe.
- Toque Arrepiante/Toque Necrótico: distância e d8 em 2014; corpo a corpo e d10 em 2024.
- Rajada de Veneno: resistência de Constituição em 2014; ataque mágico à distância em 2024.
- Arma Espiritual: concentração somente em 2024; aumento de dano a cada dois círculos em 2014 e a cada círculo em 2024.
- Círculo da Morte: d6 em 2014 e d8 em 2024. Tempestade de Gelo/Tempestade Glacial: parcela de concussão usa d8 em 2014 e d10 em 2024.
- Cura: modificador apenas quando a magia o determina. Aura de Vitalidade e Regeneração não recebem modificador automático; Oração de Cura de 2024 também não o recebe.

## Fontes e atribuição

Este trabalho utiliza material do *System Reference Document 5.1* e do *System Reference Document 5.2*, publicados por Wizards of the Coast LLC, sob [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/legalcode). Os resumos em português e a estrutura de apresentação são adaptações próprias. Não há afiliação nem endosso.

- [SRD 5.1 oficial](https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf).
- [SRD 5.2 oficial](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.pdf).
- [Página oficial dos SRDs](https://www.dndbeyond.com/srd).

Cada definição em `src/api/rulesets/magiasRevisadas.json` conserva nome original em inglês, página e URL por edição. As referências, snapshots, licenças e textos históricos continuam disponíveis internamente; revisões desconhecidas não recebem fallback.

## Reprodução da auditoria

`node scripts/auditar-catalogo-magias.cjs` recria o inventário e os aliases a partir dos arquivos locais. `node scripts/revisar-magias.cjs` recria o conjunto estruturado a partir das definições revisadas e de extrações locais das seções de magias dos PDFs oficiais, em `tmp/srd51-spells.json` e `tmp/srd52-spells.json`, com registros `{ page, text }`. PDFs e extrações integrais são temporários; não são distribuídos com o catálogo. O script confere a presença da fórmula base na entrada correspondente antes de gerar o arquivo.
