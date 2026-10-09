# Prompts de implementação — ordem recomendada

Cada bloco pode ser copiado sozinho para uma nova conversa. Referência: auditoria de 06/10/2026; confirme sempre o estado atual. IDs Axx identificam achados e Fxx as fases. Estes prompts não autorizam deploy ou alterações em dados reais.

## 1. F1 — Integridade, importação e salvamento

~~~text
Implemente a fase de integridade de dados no MinhaFichaDnd, SPA React18/Create React App com JS/TS, fichas D&D2014/2024 e localStorage. Achados A01, A02, A05 da auditoria de 06/10/2026.

Antes de editar, leia AGENTS.md/README se existirem, package.json, git status e o código atual. Preserve alterações locais. Referência opcional: docs/auditoria-2026-10-06/RELATORIO.md; este pedido é autocontido.

Investigue src/api/fichaPersonagem/FichaContext.tsx, FichaPersonagem.ts, src/pages/home.jsx, src/pages/criarFicha.js e src/api/rulesets/getRulesetData.ts. O provider pode substituir JSON corrompido por []; mutações com forceUpdate não acionam gravação da coleção; importação aceita dados sem schema e substitui ficha com mesmo ID.

Implemente leitura/escrita com estados de falha, preservação do conteúdo original, recuperação e feedback visível. Valide envelope/versionamento, edição, tipos, números finitos, IDs/referências e tamanho razoável da entrada. Colisão de ID deve oferecer cópia ou substituição explícita. Fichas sem versaoRegras podem continuar 2014 por migração documentada; versão desconhecida não deve virar 2014 silenciosamente. Não apague opções desconhecidas de documentos antigos.

Mantenha a promessa de autosave se não houver decisão posterior diferente, com indicador sujo/salvando/salvo/erro e gravação coerente após mutações. Não declare sucesso antes de persistir nem grave estado vazio de recuperação. Não implemente nuvem, conversão de edição ou reescrita de regras. Esta fase não depende de outra; não espere tipagem global para proteger dados.

Fontes: contrato atual do app e fixtures sintéticas baseadas no construtor; cenarios.json da auditoria se disponível. Nenhuma regra D&D deve mudar. Nunca exercite corrupção no armazenamento real do usuário.

Teste provider com armazenamento isolado: JSON inválido, não-array, entrada nula, quota/acesso negados, colisão, versão futura e editar/reabrir. Rode npm test -- --watchAll=false --runInBand, lint/typecheck disponíveis e build com saída temporária. O script build encadeava ofuscação em ./build fixo; preserve build preexistente e declare o que foi executado. Não atualize dependências amplamente.

Aceitação: falhas preservam bytes anteriores, importações inválidas não alteram coleção, salvamento verificável e fichas antigas válidas abrem. Termine com arquivos alterados, decisões de compatibilidade, testes e pendências. Não faça commit/deploy.
~~~

## 2. F2 — Testes, tipos e validação contínua

~~~text
No MinhaFichaDnd, SPA React18 com react-scripts5, TypeScript4.9 e JS/TS misturados, implemente uma base de verificação confiável. IDs A21 e parte de A26, auditoria de 06/10/2026.

Confirme o estado atual antes de editar: AGENTS.md/README, git status, package.json, lockfile, configurações e src/App.test.js. Preserve trabalho local. Investigue src/declarations.d.ts, src/react-app-env.d.ts, src/api/classesPrincipais, src/api/rulesets/types.ts e .github/workflows/auto-pr.yml. A auditoria encontrou teste procurando “learn react”, nenhum tsconfig na raiz, imports .ts/.tsx incompatíveis com TS4.9 em checagem explícita e tipos React19 com runtime18. Build transpilar não comprova tipagem.

Substitua teste obsoleto por comportamento da Home/seleção de edição. Configure scripts de lint/typecheck coerentes com compilador/bundler e CI que valide sem criar PRs ou publicar. Trate resolução/imports primeiro para separar erros reais de cascatas. Corrija contratos diretamente necessários; não use @ts-nocheck, any global ou exclusão dos módulos centrais para produzir aprovação artificial. Sem migração de stack. Mudança pontual de tipos/configuração deve ser justificada; evite upgrades de runtime não relacionados.

Pode começar independente de F1. Se persistência já foi corrigida, inclua regressões sem desfazer contrato novo. Use fixtures sintéticas. Referência opcional: docs/auditoria-2026-10-06/typecheck-exploratorio.log. Os 625 diagnósticos vieram de configuração exploratória, não são 625 bugs independentes. Nenhuma regra D&D deve mudar. Consulte documentação oficial das ferramentas para decisões de configuração quando necessário.

Rode npm test -- --watchAll=false --runInBand, novos npm run lint e npm run typecheck e build em diretório descartável. O build encadeava ofuscação em ./build fixo; preserve artefatos anteriores. Escreva testes de comportamento, sem espelhar implementação.

Aceitação: comandos reproduzíveis documentados, teste real da aplicação, CI de validação e erros restantes explicitados. Preserve documentos e edição sem migração funcional. Termine com mudanças, validações e pendências; não faça commit/deploy.
~~~

## 3. F3 — Documento restaurável e escolhas consistentes

~~~text
Implemente restauração consistente no MinhaFichaDnd, app React/JS/TS de fichas D&D2014/2024. Achados A03, A04, A09. Confirme código atual, instruções e git status antes de editar; preserve alterações.

Depende da proteção F1; incorpore testes/configuração F2 quando disponíveis. Não faça migração destrutiva se F1 faltar. Investigue src/api/fichaPersonagem/FichaPersonagem.ts e FichaContext.tsx, src/pages/components/CriacaoFicha.tsx, src/leveis/LevelUm.tsx e NivelBlock.tsx, src/pages/modals/ModalSelecaoIdiomas.tsx, src/pages/criarFicha.js e o consumidor de subclasses em components_inventario/AbaMagias.tsx.

new Ficha(JSON.parse(...)) restaura só instância externa, perdendo métodos e instanceof aninhados. Idiomas/perícias/distribuição têm estado React não reidratado: ficha2024 com idiomas salvos reabre com níveis bloqueados. Trocar subclasse faz push e mantém anterior; reatribuir nível5 de Guerreiro para Mago apaga subclasse mesmo com Guerreiro4.

Escolha a menor solução coerente: DTO/hidratação explícita ou funções sobre dados com IDs estáveis. Centralize restauração, evitando factories espalhadas. Preserve edição, escolhas, conteúdo antigo e ajustes manuais; registre migrações com backup. Persista dados necessários às escolhas e deixe estado apenas visual na UI. Uma classe deve ter uma subclasse escolhida; invalidar somente dependências daquela origem. Elegibilidade usa limiar e nível de classe, não igualdade com nível de entrada. Não converta2014 em2024.

Fontes: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes e https://www.dndbeyond.com/sources/dnd/br-2024/character-classes . Conteúdo fora delas permanece não verificado; não expanda catálogo nesta fase. Referência opcional: relatório/cenarios.json em docs/auditoria-2026-10-06.

Teste ida e volta JSON/reabertura com atributos, efeitos e subclasses arcanas de Guerreiro/Ladino em ambas edições; edite níveis após importar. Monte fluxo React de idiomas/perícias, alternância de abas mobile e troca de ficha.

Aceitação: sem TypeError, mesmas escolhas/cálculos antes/depois, nenhuma subclasse duplicada e Guerreiro4 mantém subclasse ao reatribuir nível5. Rode testes, lint, tipos e build seguro sem sobrescrever build antigo. Termine com migrações, alterações, resultados e pendências; não faça commit/deploy.
~~~

## 4. F4 — Atributos, níveis e escolhas por edição

~~~text
Corrija criação/progressão no MinhaFichaDnd, React/JS/TS para D&D2014 e revisão2024. IDs A06, A07, A08, A16. Leia instruções e confirme estado atual antes de editar, preservando mudanças locais. Depende dos contratos F3 e da proteção F1; integre testes disponíveis.

Investigue src/leveis/LevelUm.tsx, NivelBlock.tsx, components/CaracteristicasClasseProps.tsx, src/pages/components/CriacaoFicha.tsx, src/api/rulesets, src/api/classesClassesFilhos/*2024.class.ts e src/api/fichaPersonagem/FichaPersonagem.ts.

Gate de ASI procura rótulo2014 e não reconhece classes2024 no nível4. Distribuição conclui atributos zero e ASI comum ultrapassa20. Multiclasse usa nomes inconsistentes e não confere origem. Metamagia/patrono usam controles legados; handler de patrono grava estado anterior.

Identifique recursos/classes por chaves estáveis, separando rótulos. Valide distribuição completa, orçamento e limites por fonte; não aplique teto global que invalide exceções oficiais. Use elegibilidade comum à UI e às operações. Separe nível total/classe/planejado. Controles de ASI, metamagia e patrono devem seguir edição/progressão documentadas; considere categorias e dádivas sem inventar conteúdo ausente. Substitua somente dependências correspondentes à escolha alterada; migração deve manter opções antigas recuperáveis.

Fontes: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/step-by-step-characters ; https://www.dndbeyond.com/sources/dnd/basic-rules-2014/customization-options ; https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character ; https://www.dndbeyond.com/sources/dnd/br-2024/character-classes ; https://www.dndbeyond.com/sources/dnd/br-2024/feats . Identifique revisão e limites do conteúdo gratuito.

Teste classes nos marcos pertinentes, requisitos12/13 compostos, origem inválida, ASI com valores19/20, array incompleto e avanço/redução/reabertura. Aceitação: opções válidas disponíveis, nenhuma distribuição incompleta oficial, controles coerentes com progressões verificadas e dados antigos preservados.

Não reescreva conjuração/inventário nem implemente conversão entre edições. Rode testes, lint, typecheck e build seguro. Termine com alterações, evidências de regras, validações e pendências; não faça commit/deploy.
~~~

## 5. F5 — Cálculos compartilhados e PDF

~~~text
No MinhaFichaDnd, centralize incrementalmente cálculos divergentes entre telas/PDF. IDs A12, A13, A14, A18. Confirme instruções/código atual e preserve alterações. Depende de F3 para documento/identidade e integra progressão F4.

Arquivos: src/api/fichaPersonagem/fichaEfeitosUtils.ts, FichaPersonagem.ts; src/pages/components/InformacoesPersonagem.tsx, PericiasEOutros.tsx, components_InformacoesPersonagem/ModalVida.tsx, components_inventario/AbaArmas.tsx e AbaArmaduras.tsx; src/leveis/components/CaracteristicasClasseProps.tsx; src/pages/components/CriacaoFicha.tsx; src/api/classesFilhos/Elfo.class.ts, classesNetos/ElfoFloresta.class.ts, rulesets/dnd2024/index.ts; src/utils/exportarFichaPdf.ts.

A auditoria encontrou iniciativa anterior ao bônus inicial, perícias com atributo base, especialização ausente, estilos sem aplicação uniforme, CA sem treino virando10 na UI e valor diferente no PDF, Defesa incondicional, Monge com escudo e velocidade de linhagem ignorada. PV máximos calculados na tela não atualizam campo lido pelo PDF. Guerreiro3/Mago2 imprime também Guerreiro5.

Crie seletores puros pequenos e compartilhe resultados. Represente fonte/condição dos bônus, alternativas de CA e nível ativo. Preserve valores base, escolhas, ajustes manuais e edição; não migre derivados como atributos base. PDF deve incluir edição, mesmos valores e informação ausente explicitada. Não introduza motor genérico complexo ou automação total de combate.

Fontes: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment ; https://www.dndbeyond.com/sources/dnd/basic-rules-2014/using-ability-scores ; https://www.dndbeyond.com/sources/dnd/br-2024/equipment ; https://www.dndbeyond.com/sources/dnd/br-2024/character-origins ; SRDs/erratas em https://www.dndbeyond.com/srd . Observe diferença de escudo sem treino entre edições.

Teste Guerreiro5/CON14 com PV44, iniciativa após bônus/ASI/item, especialização, CA por armadura/escudo/Defesa/Monge/Bárbaro, troca de linhagem e PDF multiclasse. Compare UI/exportação e revise visualmente PDF longo quando houver ambiente.

Rode testes, lint, tipos e build seguro, preservando artefatos anteriores. Aceitação: números equivalentes e fontes de bônus explicáveis, sem duplicação. Termine com alterações, validações, limitações visuais e pendências; não faça commit/deploy.
~~~

## 6. F6 — Conjuração e seleção de magias

~~~text
Corrija conjuração no MinhaFichaDnd, SPA React/TS com D&D2014/2024 e multiclasse. IDs A10/A11. Confirme instruções, git status e código atual antes de editar; preserve mudanças. Depende de F3 e usa progressão/atributos finais F4/F5.

Investigue src/pages/components/components_inventario/AbaMagias.tsx, src/pages/modals/ModalMagias.tsx, src/api/fichaPersonagem/FichaPersonagem.ts, classesClassesFilhos de conjuradores e classesClassesNetos/CavaleiroArcano.ts, CavaleiroMistico2024.ts, TrapaceiroArcano.ts, TrapaceiroArcano2024.ts.

Slots usam fórmula multiclasse até em classe única, arredondam meios sempre para baixo e não mantêm pool de Pacto. Mago2014 usa SAB; contagem de truques inclui magias; nível da magia não é validado; setter impede magia em duas classes. instanceof reaberto é frágil. Separe slots por origem/recuperação, truques, conhecidas/livro/preparadas e fonte de conjuração. Slots combinados não autorizam aprender qualquer círculo. Funções puras fora do render; não sort/mutar documento durante consulta.

Fontes: https://www.dndbeyond.com/sources/dnd/basic-rules-2014/customization-options ; https://www.dndbeyond.com/sources/dnd/basic-rules-2014/classes ; https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character ; https://www.dndbeyond.com/sources/dnd/br-2024/character-classes ; SRD5.1/5.2.1 em https://www.dndbeyond.com/srd . Confirme tabelas por edição.

Migre magias de modo recuperável; não exclua escolhas ilegais silenciosamente. Liste pendências e preserve fonte/edição. Não expanda todas as listas nem substitua catálogo2014: F7 trata conteúdo. Não automatize dano de todas as magias.

Teste Paladino2024 nível1, Paladino2014 nível3, Mago1/Paladino1 revisado, Mago1/Paladino2 legado, Bruxo3, Mago5 e subclasses arcanas antes/depois de JSON. Mago2014 nível1 INT16/SAB10 deve preparar4; não admitir Desejo no nível1; primeiro truque não é bloqueado por magias preparadas; permitir fontes distintas elegíveis.

Rode testes, lint, tipos e build seguro. Aceitação: tabelas/limites corretos, Pacto separado, documento reaberto equivalente. Termine com regras, alterações, migrações, testes e pendências; não faça commit/deploy.
~~~

## 7. F7 — Conteúdo versionado, talentos e fontes

~~~text
Implemente conteúdo versionado no MinhaFichaDnd, React/JS/TS para D&D2014/2024. IDs A15, A17, A23. Confirme instruções/estado antes de editar; preserve mudanças. Inventário de fontes pode começar independente; integração depende de F3/F4/F6.

Investigue src/api/rulesets/types.ts, getRulesetData.ts e index.ts das edições; src/bibliotecas/Talentos.ts, Magia.ts, CaracteristicasClasse.ts, bibliotecaPrincipal.ts, ItensTraduzidos.ts; src/leveis/components/TalendoDescricao.tsx; src/pages/modals/ModalSelecaoTalento.tsx e ModalMagias.tsx; src/pages/components/CriacaoFicha.tsx; README e assets/PDF.

Há lookup de talento2014 em ficha2024, talentos sem benefícios/escolhas operacionais, requisitos descartados pelo modal e biblioteca de magias única. Curar Ferimentos é exemplo concreto de texto/escola diferentes. Introduza ID, edição, fonte, revisão/errata, categoria e licença; separe oficial, compatível, homebrew e não verificado. UI/cálculos devem usar versão correta sem fallback silencioso. Implemente requisitos/escolhas dos talentos suportados; ausência de todo PHB não é bug automaticamente.

Fontes: https://www.dndbeyond.com/srd ; https://www.dndbeyond.com/sources/dnd/br-2024/feats ; https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions ; https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character ; https://media.dndbeyond.com/compendium-images/errata/PHB-24/PHB-2024_v1.pdf . Registre consulta e revisão. A auditoria encontrou página de magias divergente da errata em Conjure Minor Elementals; SRD5.2.1 continha correção. Não confunda acesso gratuito com licença, nem reproduza livros inteiros. Conteúdo pago indisponível fica pendente.

Preserve significado/referências de fichas antigas; não substitua mecânica silenciosamente. Inventarie atribuições sem concluir ilegalidade ou remover conteúdo por suposição. Se catálogo publicado não estiver definido, avance em infraestrutura/subconjunto verificável e registre decisão pendente.

Teste Alerta e Curar Ferimentos em ambas edições, requisitos/categorias/repetibilidade, escolhas adicionais, versão desconhecida e exportação/reabertura. Rode testes/lint/tipos/build seguro. Aceitação: fontes rastreáveis, diferenças verificadas, nenhuma mistura oculta e licença ou pendência identificada. Termine com alterações, fontes, validações e pendências; não faça commit/deploy.
~~~

## 8. F8 — Inventário e recursos de sessão

~~~text
Corrija inventário/recursos no MinhaFichaDnd, React/JS/TS para D&D2014/2024. IDs A19, A20, A24. Confirme instruções, estado e código antes de editar; preserve alterações. Depende de F3/F5/F6; efeitos novos seguem F7 quando disponível.

Investigue src/api/fichaPersonagem/FichaPersonagem.ts e fichaEfeitosUtils.ts; src/pages/components/components_inventario/AbaItens.tsx, AbaArmas.tsx, AbaArmaduras.tsx, AbaMagias.tsx; src/pages/components/InformacoesPersonagem.tsx e components_InformacoesPersonagem/ModalVida.tsx; modelos de equipamentos.

Apagar equipamento deixa referência órfã, contador de mãos é incremental e troca de escudo pode inflá-lo. Equipar é usado como sintonizar. Slots gastos/testes de morte não sobrevivem desmontagens. Regex de atributo em inglês captura grupos em ordem inversa à consumida. Corrija com operações atômicas, IDs estáveis, contagens derivadas e sintonização separada. Corrija padrões suportados e prefira efeitos explícitos em dados novos, sem inferir benefícios globais por palavras isoladas.

Priorize recursos já apresentados. Consumo deve sobreviver a salvar/importar e mudança de nível sem reset silencioso. Preserve estado antigo e edição por migração recuperável. Separe PV atuais/temporários/dados de vida se implementar esses controles. Restaurar Vida não equivale a descanso completo. Maestrias/condições/recursos adicionais entram apenas como conjunto pequeno documentado; não faça motor de combate.

Fontes: SRDs em https://www.dndbeyond.com/srd ; https://www.dndbeyond.com/sources/dnd/basic-rules-2014/adventuring ; https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary ; https://www.dndbeyond.com/sources/dnd/br-2024/equipment . Recuperação depende da edição/recurso.

Teste equipar/trocar/excluir/reabrir arma, armadura e escudo, sintonização independente, parser inglês/português, slots/morte após mudar abas/recarregar. Descanso não recupera recurso incompatível nem soma PV temporários.

Rode testes/lint/tipos/build seguro. Aceitação: referências/mãos consistentes, recursos apresentados persistentes, controles novos com regra citada. Termine com mudanças, migrações, testes e pendências; não faça commit/deploy.
~~~

## 9. F9 — Acessibilidade e clareza

~~~text
Melhore teclado/acessibilidade e clareza no MinhaFichaDnd, SPA React de fichas D&D2014/2024. IDs A22/A26. Confirme instruções, git status e código antes de editar; preserve mudanças. Pode começar independente; sincronize feedback/estado com F1/F3.

Investigue src/pages/home.jsx, src/pages/criarFicha.js, src/pages/modals/ModalSelecaoTalento.tsx, ModalSelecaoIdiomas.tsx e demais seletores, components_InformacoesPersonagem/ModalVida.tsx, CSS de modais/fluxos, README.md e my-app/README.md. Seleções em li/span não têm teclado; falta gestão de foco. Menu contém XML que só registra console e Mapear PDF de depuração. README tem prefixos de patch, contrato de salvamento impreciso e documento Next.js incompatível com stack real.

Use controles semânticos, nomes acessíveis, estado expandido/selecionado, erros associados e diálogos com foco inicial/contenção/Escape/retorno. Revise efeitos de refreshKey e desmontagem no foco. Preserve conteúdo, escolhas, edição e persistência; nenhuma fórmula deve mudar. Sem redesenho integral. Atualize menu/documentação para funcionalidades reais; identifique ou retire ação simulada sem implementar XML não solicitado.

Fonte técnica: documentação oficial WAI-ARIA APG de diálogo modal e elementos HTML nativos; consulte quando necessário. Não altera regras D&D. Referência opcional: docs/auditoria-2026-10-06/RELATORIO.md, mas confirme evidências atuais.

Teste teclado em criar/abrir/selecionar/cancelar e retorno de foco, rótulos com Testing Library, leitor de tela e viewports móvel/desktop quando houver ambiente. Verifique zoom e conteúdo extenso. Não declare conformidade WCAG integral sem teste correspondente. Rode testes, lint, tipos e build seguro sem dependências desnecessárias.

Aceitação: fluxos centrais sem mouse, foco previsível, mensagens compreensíveis e instruções reais de execução/limitações por edição. Nenhuma migração destrutiva ou alteração de dados pessoais. Termine com mudanças, validações reais, limitações visuais e pendências; não faça commit/deploy.
~~~

## 10. F10 — Performance medida

~~~text
Reduza custos demonstráveis no MinhaFichaDnd, React18/Create React App com catálogos D&D2014/2024. ID A25. Confirme instruções/estado antes de editar; preserve alterações. Execute depois de estabilizar F3–F7; cache não deve mascarar identidade inconsistente.

Investigue src/api/rulesets/getRulesetData.ts, index.ts das edições, construtores em src/api, src/pages/components/CriacaoFicha.tsx, src/leveis/LevelUm.tsx e NivelBlock.tsx, src/bibliotecas/Magia.ts e Itens*, consumidores do inventário, imports do App e package.json. Auditoria mediu bundle principal1,3MB gzip e observou factories de catálogos completos em múltiplos renders. Não mediu CPU: confirme antes de atribuir gargalo.

Estabeleça baseline atual de bundle/perfil em criação, reabertura e troca de níveis. Separe definições imutáveis de dados do personagem antes de memorizar: factories geravam IDs e seletores podiam mutar conteúdo. Reduza recomputação e carregue seções/catálogos sob demanda onde houver benefício medido. Não troque stack, fórmulas, conteúdo autorizado ou funcionalidades para melhorar métricas artificialmente. Não compartilhe instâncias mutáveis entre fichas.

Fontes: perfil/código local e documentação oficial React/bundler da técnica escolhida, consultada quando necessário. Nenhuma regra D&D deve mudar. Preserve documentos antigos, edição e migrações. Alteração de identidade exige migração recuperável compatível com F1/F3.

Rode build descartável e compare tamanhos; trate ofuscação separadamente, pois script tinha caminho ./build fixo. Preserve artefatos anteriores. Teste duas fichas editadas alternadamente para detectar vazamento de escolhas e regressões de reabertura. Execute testes/lint/typecheck e perfil de navegador quando disponível. Sem navegador, declare limitação e não invente latência.

Aceitação: ganho medido no indicador visado, sem regressão funcional e com isolamento dos personagens. Evite memoização indiscriminada. Termine com mudanças, medições comparáveis, validações e pendências; não faça commit/deploy.
~~~
