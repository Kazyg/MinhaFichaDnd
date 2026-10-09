# Integridade de dados — 06/10/2026

Implementação de A01, A02 e A05. As alterações locais de regras/2024 foram preservadas; nenhuma fórmula ou opção do catálogo foi alterada.

## Persistência e recuperação

- A chave `fichas` recebe um envelope `{format: "minhafichadnd", version: 1, kind: "colecao", selectedId, data: [...]}`. A seleção e a coleção são gravadas juntas. A antiga chave `ficha` é apenas uma dica de seleção na leitura.
- A hidratação não grava nada. JSON inválido, formato inesperado, entradas nulas, versão não suportada e falhas de acesso bloqueiam as gravações e exibem recuperação. Não há substituição automática por `[]`.
- Antes de escrever, o conteúdo atual é comparado com o conteúdo lido, para detectar alterações de outra aba. Os bytes anteriores são copiados e verificados em `fichas.backup`. Só então a chave principal é gravada e relida para verificar sucesso. Não há transação entre abas no localStorage; essa detecção não é um bloqueio distribuído.
- A recuperação permite baixar os bytes originais, reler o armazenamento, restaurar o último backup válido ou colar uma coleção corrigida. Recuperações explícitas preservam os bytes substituídos em `fichas.recuperacao`. Se a validação ou o backup falhar, a chave principal não é tocada.
- Erros de quota/acesso mantêm as edições em memória, mostram erro e oferecem nova tentativa e exportação. Criação, exclusão e importação só mudam a coleção exposta após persistência confirmada. Não há anúncio de sucesso antes da releitura.
- O autosave observa setters, atribuições diretas, objetos e arrays aninhados, além de `forceUpdate`. O atraso é de 300 ms; os estados são sujo/salvando/salvo/erro. Escritas síncronas podem tornar o estado intermediário de salvamento muito breve. Reatribuições de dados equivalentes não geram ciclos com os cálculos existentes durante renderização. Há tentativa de gravação ao sair; falhas com alterações pendentes solicitam o aviso nativo do navegador.
- A edição de nome atualiza a ficha imediatamente. O antigo timer local de 1,5 s podia deixar o campo visualmente editado sem alteração no modelo antes de sair.

## Contrato e compatibilidade

- Importações aceitam ficha JSON antiga ou envelope `{format: "minhafichadnd", version: 1, kind: "ficha", data: {...}}`. Exportações novas usam esse envelope. Coleções antigas em array continuam aceitas.
- A ausência de `versaoRegras` migra para `DND_2014` em memória; a migração só é persistida no próximo salvamento. `null`, versões desconhecidas e envelopes futuros são rejeitados, sem fallback silencioso.
- Validam-se identidade, tipos dos campos conhecidos, estruturas de atributos/efeitos/equipamentos/classes, números finitos, IDs duplicados da coleção/efeitos/multiclasses, referência da ficha selecionada e vínculos explícitos de subclasse com classes da ficha. Limites: 5 MiB por entrada, 500 fichas por coleção, profundidade 60 e IDs de até 200 caracteres. Chaves que sobrescreveriam protótipos ou métodos são rejeitadas.
- Referências do catálogo são snapshots incorporados e nomes, não chaves estrangeiras estáveis. Não se exige que opções antigas ainda existam no catálogo atual. Campos e escolhas desconhecidos são preservados. Campos opcionais ausentes recebem os padrões do construtor; `null` de fichas incompletas continua aceito. Não se valida elegibilidade de regras D&D nesta fase.
- Métodos de `Ficha`, `Atributos` e `Efeitos` são restaurados sem descartar campos adicionais. A reconstrução geral de subclasses e demais protótipos do catálogo não faz parte desta fase.
- O catálogo de bárbaro 2014 contém `Infinity` em `niveis[nivel=20].furias`. Apenas esse valor semântico é codificado como `"ilimitado"` no JSON e restaurado em memória. Outros números não finitos são rejeitados. Valores `null` já existentes em arquivos antigos não são reinterpretados.
- Colisões na importação exigem escolha entre cópia (novo ID) e substituição explícita. Cancelar ou importar dados inválidos não modifica a coleção.

## Arquivos desta implementação

- `src/api/fichaPersonagem/fichaStorage.ts`: contrato, validação, serialização, migração e escrita com backup/verificação.
- `src/api/fichaPersonagem/FichaContext.tsx`: estados, recuperação, mutações observadas e autosave.
- `src/api/fichaPersonagem/FichaPersonagem.ts` e `src/api/rulesets/getRulesetData.ts`: rejeição de edição desconhecida.
- `src/pages/home.jsx`: importação validada e escolha de colisão.
- `src/pages/criarFicha.js`: exportação versionada e resultado real de salvar.
- `src/pages/components/InformacoesPersonagem.tsx`: atualização imediata do nome.
- `src/api/fichaPersonagem/FichaContext.test.js` e `src/App.test.js`: regressões e atualização do teste inicial obsoleto do CRA.

## Verificação

- `npm test -- --watchAll=false --runInBand`: 29 testes aprovados. Incluem armazenamento injetado em memória, corrupção/não-array/null, quota/acesso negados, falha de verificação, colisão, versão futura, recuperação, conflito entre abas, edição/reabertura, métodos aninhados, seleção legada, ambas as edições e edição pela página real. Nenhuma corrupção foi exercitada no armazenamento de um usuário.
- `npx --no-install eslint` nos arquivos desta implementação: aprovado. Não há script de typecheck nem `tsconfig.json` neste projeto; não se reivindica typecheck global.
- Build executado diretamente com `node node_modules/react-scripts/bin/react-scripts.js build` e `BUILD_PATH` em diretório temporário exclusivo. A primeira tentativa detectou imports novos sem extensão; foram corrigidos e a execução seguinte compilou com sucesso.
- O script `npm run build` não foi usado, pois encadeia ofuscação no caminho fixo `./build`. A ofuscação não foi executada e o build preexistente foi preservado.
- Avisos existentes observados: React Router future flags, chave React ausente em componente da página, base Browserslist antiga, API depreciada do Node e bundle grande. `git diff --check` também encontra whitespace em `Home.css`, alteração local anterior não modificada nesta fase.
- Sem atualização de dependências, commit ou deploy. Persistência depende da disponibilidade/quota do armazenamento local; backups completos também consomem quota. Não foi feito teste manual em navegador real.
