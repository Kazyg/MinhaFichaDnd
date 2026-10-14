# Magias e talentos de 2024

Após integração em `feature/dnd2024`, a edição da ficha determina os seletores de magias e talentos. O catálogo de 2024 contém 391 magias e 75 talentos; dados e regras de `feat/regras-2024` foram adaptados aos contratos existentes. Não houve conversão automática de edição de fichas.

Novas aquisições mantêm referências `{id, edicao, revisao}` e snapshots. Escolhas de campos do PHB são armazenadas em `escolhasTalento2024`, preservando arrays em `escolhasTalento`. Documentos da outra branch com nomes `2024: Nome` e escolhas em objeto no campo original também são aceitos sem reescrever esse campo. Usos gratuitos continuam no registro de efeito.

## Talentos

A seleção verifica nível mínimo, atributos, características exigidas, treinamento e repetição. Escolhas obrigatórias aparecem antes da confirmação. Incluem aumentos de atributos, proficiências, Especialização, Maestria, tipos de dano, resistências e magias com restrições por classe, escola, círculo e Ritual.

Cada aquisição conserva suas escolhas no próprio registro de efeito. Atributos, proficiências, salvaguardas, iniciativa, vida, deslocamento e benefícios de armadura suportados pela ficha são derivados de concessões associadas àquela aquisição. Trocar ou remover o talento remove apenas suas concessões. Bônus de nível inativo não se aplicam.

Magias de talentos são derivadas das escolhas, sem consumir a quantidade de magias de classe e sem apagar magias aprendidas por outras fontes. Usos gratuitos são registrados e restaurados no botão de Descanso Longo da seção de talentos. Truques não gastam esses usos. A exportação em JSON conserva escolhas, referências e usos; o PDF inclui as magias concedidas e escolhas dos talentos.

As descrições apresentam os demais benefícios, incluindo ações, reações, vantagens, dano condicional, alvos e limites por turno. O aplicativo é uma ficha, e esses benefícios de combate continuam sendo aplicados pelo jogador e pelo Mestre. O conteúdo de 2024 não substitui o sistema legado de progressão das classes.

## Manutenção

Dados: `src/bibliotecas/catalogos2024.json`.

Para reproduzir a extração dos PDFs originais:

```bash
pdftotext -raw magias-2024.pdf /tmp/magias2024-raw.txt
pdftotext -raw talentos-2024.pdf /tmp/talentos2024-raw.txt
node scripts/importar-catalogos-2024.cjs /tmp/magias2024-raw.txt /tmp/talentos2024-raw.txt
```

O importador valida contagens, nomes únicos e metadados antes de gravar. A ausência de uma contagem esperada encerra o processo com erro.

```bash
CI=true npm test -- --watchAll=false --runInBand
npm run build
```
