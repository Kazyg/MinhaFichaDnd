# Base de verificação — A21 e parte de A26

**Estado corrente em 08/10/2026:** strict habilitado, 239 testes em 14 suítes aprovados, lint/typecheck aprovados. Consulte a [implementação atual, matriz e logs exclusivos](revisao-pendencias-2026-10-08/IMPLEMENTACAO.md). Os resultados abaixo são o histórico da base de 07/10, não o resultado desta nova execução.

Verificada em 07/10/2026, com Node 24.14.0 e npm 11.9.0. Execute na raiz:

```sh
npm ci
npm test -- --watchAll=false --runInBand
npm run lint
npm run typecheck
npm run build:verify
```

O workflow `.github/workflows/validate.yml` executa esses comandos em pushes e
pull requests, com permissão apenas de leitura. Substitui o workflow de criação
automática de PRs. Não publica nem faz deploy.

## Escopo e decisões

- React 18, react-scripts 5 e TypeScript 4.9 foram mantidos. Os tipos React foram
  alinhados ao runtime: `@types/react` 18.3.18 e `@types/react-dom` 18.3.5.
  ESLint 8.57.1, já compatível com CRA, agora é uma dependência direta do comando.
- `tsconfig.json` inclui todo `src`, inclusive os módulos centrais. Usa resolução
  `node`, módulos `esnext`, `isolatedModules`, `react-jsx` e `noEmit`, coerentes
  com `react-scripts/scripts/utils/verifyTypeScriptSetup.js` instalado. Não usa
  opções de resolução exclusivas do TypeScript 5.
- Imports relativos `.ts`/`.tsx` foram normalizados sem extensão. A mudança
  extensa é mecânica; não muda dados ou regras D&D. Ela permite resolver os
  módulos no TS 4.9 antes de avaliar seus contratos.
- A base incremental mantém `strict: false`, `allowJs: true`, `checkJs: false`:
  verifica os arquivos TS/TSX e incorpora os JS/JSX à resolução/inferência, mas
  não promete checagem estrita nem diagnósticos de tipos dentro do JavaScript.
  JS e TS recebem lint pela configuração existente `react-app`/`react-app/jest`.
  `skipLibCheck` evita verificar declarações de dependências, não código-fonte
  central. Não foram adicionados `@ts-nocheck`, tipos globais `any` ou exclusões.
- `src/react-app-env.d.ts` fornece os tipos de recursos do CRA; as declarações
  duplicadas de imagens em `src/declarations.d.ts` foram removidas.
- As classes principais e `rulesets/types.ts` foram investigados e seus
  contratos existentes preservados. Após resolver imports, não exigiram
  ampliação para passar nesta base. Os `unknown[]` de catálogos e os `any`
  locais preexistentes continuam sendo limitações a melhorar separadamente.
- Correções necessárias: retorno booleano explícito das ações de persistência
  e exportação do catálogo `manobras` para compilação isolada. Não houve
  alteração nas regras ou nos valores dos catálogos.

## Testes de comportamento

`App.test.js` exercita a Home real, fechamento da escolha sem criar ficha,
criação nas duas edições, digitação de nome sintético, persistência, reabertura
pela Home e proteção de armazenamento corrompido. Não simula o router ou o
contexto. Mantém os testes locais de persistência já presentes.

A digitação revelou que `InformacoesPersonagem` recriava a árvore DOM a cada
`refreshKey`, perdendo o foco após a primeira letra. Remover essa chave variável
preserva o campo e permite salvar/reabrir o nome completo, mantendo o contrato
novo de persistência.

## Build sem alterar artefatos anteriores

`npm run build:verify` cria um diretório único no temporário do sistema, executa
o build de produção **e a ofuscação** nele e o remove ao terminar, inclusive em
falha. O caminho é impresso no log. `build/` existente não é usado.

`npm run build` continua produzindo e ofuscando em `build/` por padrão; quando
`BUILD_PATH` é definido, ambas as etapas usam esse destino. Para validação,
prefira sempre `build:verify`. O comando manual legado `npm run obfuscate`
continua destinado explicitamente a `build/`.

## Resultado e limites

- Testes: 2 suítes e 33 testes aprovados.
- Lint e typecheck: código de saída 0, sem diagnósticos de código-fonte.
- Build de produção e ofuscação: aprovados em diretório descartável.
- Permanecem avisos de testes (React Router, `act` e chave de lista), base
  Browserslist antiga, depreciação de `fs.F_OK` no Node 24 e tamanho do bundle.
  Não foram silenciados com mocks de console ou regras desativadas.
- O npm informou 108 vulnerabilidades na árvore existente durante a instalação;
  não foi aplicado `audit fix`, pois atualização de runtime/dependências não
  relacionadas está fora desta mudança.
- A checagem explícita de tipos é independente do build. Aprovação nesta base
  não certifica regras D&D, contratos estritos ou todos os fluxos da aplicação.

Documentação oficial consultada:
[TypeScript no CRA](https://create-react-app.dev/docs/adding-typescript/),
[BUILD_PATH](https://create-react-app.dev/docs/advanced-configuration/),
[isolatedModules](https://www.typescriptlang.org/tsconfig/isolatedModules.html)
e [opções do TSConfig](https://www.typescriptlang.org/tsconfig/).
