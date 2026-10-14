# F7 — Conteúdo versionado (A15, A17, A23)

Implementação e consulta em **2026-10-07**, fuso America/Sao_Paulo. Instruções e estado conferidos antes da edição: nenhum AGENTS.md encontrado no projeto/ancestrais consultados; checkout com muitas alterações locais e F3/F4/F6 implementados, documentados e testados. Essas alterações foram preservadas. Sem commit, deploy, instalação ou atualização de dependências.

## Contrato e integração

- `rulesets/types.ts` define identidade estável, edição, fonte/localizador/data de consulta, revisão, errata, categoria, natureza e licença. Natureza admite `oficial`, `compativel`, `homebrew`, `nao-verificado`; não inferimos compatibilidade nem homebrew a partir de procedência desconhecida. “Oficial” identifica a origem da regra; os resumos em português são adaptações locais.
- `rulesets/conteudo.ts` e os dois `index.ts` fornecem catálogos distintos. IDs não são IDs aleatórios de instâncias da ficha. Grafias legadas que colidem após normalização permanecem distintas: o ID incorpora a grafia original nesses casos. Não houve fusão de magias por suposição.
- Referências salvas contêm `{id, edicao, revisao}`. Novas escolhas também guardam snapshot, incluindo fonte e licença; talentos guardam escolhas adicionais. Resolver exige a referência completa. Edição/revisão desconhecida não produz substituição por nome, revisão atual ou 2014. Alterações futuras devem criar outra revisão e manter as anteriores resolvíveis.
- Novas escolhas são validadas no domínio, além do modal: edição, categoria, nível, requisito representado, repetibilidade, escolhas obrigatórias, proficiência existente e teto de atributo. Efeitos futuros não satisfazem requisitos anteriores. ASI retroativo também respeita o teto de um talento posterior. O modal transmite os metadados e as escolhas e não fecha após falha de seleção.
- Alerta novo entra no seletor de iniciativa, sem gravar cache. Imobilizador concede +1 no atributo escolhido. Habilidoso concede treinamento nos seletores de perícias/ferramentas. A remoção/substituição do avanço retira só seus benefícios e arquiva a escolha anterior. Humano/Origem têm validação própria; origem com escolhas obrigatórias pode ser configurada no nível 1.
- Modal de magias, detalhes, preparação e novas escolhas consultam conteúdo por edição/referência. O modal permite calcular a fórmula de Curar Ferimentos para círculo/modificador informados, sem gastar espaços ou alterar PV. Escolas e listas de 2014 não são utilizadas nas seleções novas de 2024.
- `AbaDetalhes` ainda continha o lookup direto de talentos 2014, embora `TalendoDescricao` já tivesse sido corrigido por edição antes desta frente. Ambos agora distinguem escolhas versionadas e legadas. Descrições de características de classe também deixaram de buscar um texto sem edição como substituto de 2024; registros explicitamente revisados continuam disponíveis, com procedência editorial pendente.
- Importação F1/F3 valida a estrutura das novas referências/escolhas; referências bem formadas, mas desconhecidas, ficam preservadas. JSON mantém snapshots, escolhas e arquivos anteriores; PDF identifica revisão, escolhas e conteúdo legado separadamente da edição da fonte de conjuração.

## Subconjunto implementado

| Conteúdo | 2014 | 2024 | Situação |
| --- | --- | --- | --- |
| Alerta | +5 na iniciativa, a partir do registro local existente | bônus de proficiência na iniciativa; texto da troca com aliado e condição de incapacitação | 2014: verificação editorial/licença pendentes; 2024: SRD 5.2.1 |
| Curar Ferimentos | Evocação; 1d8 + modificador; +1d8/círculo acima do primeiro; exclui mortos-vivos/constructos | Abjuração; 2d8 + modificador; +2d8/círculo; sem essas exclusões | Resumos/fórmulas próprios, SRD 5.1 e 5.2.1 |
| Habilidoso | Acervo preservado, sem nova implementação nesta frente | Origem, repetível, três perícias/ferramentas distintas e ainda não possuídas | Escolhas persistidas; benefícios nos seletores |
| Imobilizador (Grappler) | Acervo preservado, sem nova implementação nesta frente | Geral; nível 4; FOR **ou** DES 13; escolha de +1 FOR/DES, teto 20; não repetível | Requisito/escolha/cálculo implementados; combate explicado no resumo |

O catálogo 2024 de magias contém **oito entradas**: Curar Ferimentos e sete entradas de índice — Luz, Mãos Mágicas, Desejo, Ilusão Menor, Prestidigitação, Detectar Magia e Disfarçar-se. Nas entradas de índice, apenas nome, lista, círculo e escola foram integrados; a descrição integral deve ser consultada na fonte. Campos não integrados dizem “Consultar fonte”, sem copiar dados da edição anterior.

Outros talentos do acervo continuam armazenados, mas não são oferecidos como seleções operacionais enquanto suas escolhas/benefícios estiverem incompletos. Origens que os concedem mostram a pendência e preservam o nome. Essa restrição decorre da implementação incompleta, não de uma conclusão sobre a licença. O ASI existente continua disponível. Ausência de todo o PHB não é tratada como defeito por si só.

Benefícios que dependem de combate — troca de iniciativa, surpresa, vantagem, agarrar e movimento — são informados para aplicação pela mesa. Não foi criado um motor de combate, gasto de usos/descanso ou concessão de magias por Iniciado em Magia. O cálculo de iniciativa, aumento de atributos, treinamentos e fórmula de cura são operacionais.

## Preservação de fichas

- Não há migração F7 que reinterprete automaticamente uma escolha antiga. Talento sem referência mantém seus efeitos numéricos salvos; não recebe automaticamente um novo +5 ou proficiência. A UI o identifica como legado em vez de afirmar qual revisão originou aquele nome.
- Magias F6 com `catalogo-2014` continuam resolvidas no acervo anterior, mesmo em ficha 2024. O rótulo e a pendência deixam essa diferença visível. A descrição legada não é substituída por Curar Ferimentos revisado. O acervo antigo permanece no arquivo original.
- “Revisar fonte e conteúdo” aplica explicitamente o catálogo atual da fonte escolhida e arquiva a escolha anterior. Novas preparações de registros legados em 2024 exigem essa revisão. Registros já salvos/preparados não são apagados na leitura.
- Revisão desconhecida preserva snapshot no JSON e pode exibi-lo como memória não aplicada. Não é interpretada como mecânica atual. Efeitos versionados de outra edição ou referência desconhecida não entram nos cálculos; efeitos antigos sem referência continuam com sua semântica numérica salva.
- O envelope permanece na versão 1; campos são opcionais e os backups F1/F3/F6 continuam em uso. Leitura/render não grava migração. Não há conversão automática de edição.

## Fontes consultadas e revisão

Todas as consultas abaixo ocorreram em **2026-10-07**. A data identifica a consulta, não a data editorial do livro. Não foram baixados/reproduzidos livros pagos inteiros.

| Fonte | Evidência e decisão |
| --- | --- |
| [Página dos SRDs](https://www.dndbeyond.com/srd) | Primeira tentativa falhou; nova consulta teve sucesso. Distingue versões e acesso aos documentos/licenças. |
| [SRD 5.1, edição CC](https://media.dndbeyond.com/compendium-images/srd/5.1/SRD_CC_v5.1.pdf) | Informações legais p. 1; Cure Wounds em Spells. Base licenciada do resumo/fórmula 2014. |
| [SRD 5.2.1](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf) | Informações legais p. 1; Alert/Skilled/Grappler p. 87; ferramentas p. 93–94; Cure Wounds p. 121; índices/listas das sete outras magias e respectivas entradas. Revisão fixada `srd-5.2.1-pt-resumo-1`. |
| [Talentos 2024](https://www.dndbeyond.com/sources/dnd/br-2024/feats) | Categorias, requisitos, repetibilidade e conferência dos três talentos implementados. A página gratuita não define licença de redistribuição. |
| [Magias 2024](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions) | Conferência de Cure Wounds, escolas/listas das entradas de índice e divergência editorial descrita abaixo. |
| [Criação 2024](https://www.dndbeyond.com/sources/dnd/br-2024/creating-a-character) | Talento concedido pela origem, proficiência baseada no nível total e regras específicas de uso de origens antigas. Não autoriza converter automaticamente conteúdo salvo. |
| [Magias 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/spells) | Cure Wounds: escola, cura, escalonamento e exclusão de mortos-vivos/constructos. |
| [Errata PHB 2024 v1](https://media.dndbeyond.com/compendium-images/errata/PHB-24/PHB-2024_v1.pdf) | Correção de escalonamento de Conjure Minor Elementals de +2d8 para +1d8; Grappler usa ausência de movimento extra, não a formulação antiga de velocidade reduzida. |
| [Alerta 2014](https://www.dndbeyond.com/feats/alert) | Redireciona ao marketplace do PHB. URL numérica tentada também falhou. Verificação primária integral e licença permanecem pendentes. O +5 é comportamento do registro local, não uma certificação do conteúdo pago. |

**Divergência confirmada:** a página gratuita 2024 ainda descrevia Conjure Minor Elementals com **+2d8** por círculo acima do quarto; a errata PHB2024 v1 e o SRD5.2.1 p. 118 traziam **+1d8**. Essa magia não foi incluída no subconjunto novo. Uma futura implementação deve fixar a revisão corrigida, sem reutilizar a página divergente como fonte única. O texto legado 2014 também não é equivalente à magia revisada.

As atribuições exigidas pelos SRDs e o aviso de adaptação local estão em [public/CONTEUDO-LICENCAS.txt](../../public/CONTEUDO-LICENCAS.txt), acessível pelos modais e ligado no README. Essa declaração cobre o subconjunto indicado, não todo o projeto.

## Inventário de atribuições

| Área inspecionada | Constatação | Pendência |
| --- | --- | --- |
| `Talentos.ts` | Nomes, descrições, requisitos e bônus legados sem referência individual de fonte/revisão/licença | Conferir cada entrada antes de ampliar o subconjunto operacional; preservar originais |
| `Magia.ts` | Listas por classe e descrições compartilhadas, usadas historicamente como 2014; variantes de grafia | Conferência editorial individual; traduções e licenças pendentes fora de Cure Wounds |
| `CaracteristicasClasse.ts` | Registros sem edição e alguns com `versaoRegras: DND_2024`; sem comprovação individual de licença | Não certificar todo o conjunto; sem fallback de registro não marcado para 2024 |
| `bibliotecaPrincipal.ts` | Agregava características e talentos legados sem contexto editorial | Marca de procedência pendente e resolução de características por edição |
| `ItensTraduzidos.ts` / `Itens.ts` | Tradução por nomes/substituições e IDs aleatórios de instância; origem remete a listas locais em inglês | IDs de catálogo/procedência individual de itens ainda não migrados; nenhuma remoção ou conclusão jurídica |
| `README.md` | Não havia atribuição suficiente para certificar todo o acervo; parte antiga contém prefixos `+` literais | Mantida a redação preexistente; nova seção delimita atribuições e pendências |
| Imagens/ícones/PDF | [Inventário de 60 arquivos](F7-assets.json) com caminho, tamanho e SHA-256 | Autoria, origem e permissão de distribuição a documentar por arquivo |

`PDF/ficha-de-personagem-dd-5e.pdf` e `public/ficha-de-personagem-dd-5e.pdf` são idênticos: SHA-256 `610bbf1bc1284b5393d38645b964ed48c20c688ffa45b8d1393b10ae2568f67c`. Metadados lidos com pdf-lib, sem regravar: título “Ficha de Personagem D&D 5E”, autor “Johny Robert”, criador “Adobe InDesign CS6 (Macintosh)”, produtor “Adobe PDF Library 10.0.1”, três páginas. Metadados são indícios de atribuição, **não comprovação de licença**. Arquivos preservados integralmente.

## Validação

Resultados finais:

- `CI=true npm test -- --watchAll=false --runInBand`: **185 testes, sete suítes aprovadas**, incluindo **26 casos novos** de conteúdo versionado. [Log final](F7-test.log). O [log isolado anterior](F7-conteudo-test.log) contém os 22 casos iniciais, antes dos quatro casos adicionais de regressão.
- `npm run lint`: código 0, sem erros ou avisos do ESLint. [Log](F7-lint.log).
- `npm run typecheck`: código 0. [Log](F7-types.log).
- `git diff --check` nos arquivos rastreados tocados nesta frente: aprovado; avisos do Git sobre conversão LF/CRLF, sem erro de whitespace.
- `npm run build:verify`: **código 0**, compilação e ofuscação concluídas. [Log do build descartável](F7-build.log). O script F2 usou diretório temporário exclusivo (`minhafichadnd-build-EitZAR`) e preservou o `build` existente.

Avisos não bloqueantes preexistentes: React Router/act nos testes, Browserslist desatualizado e depreciação de `fs.F_OK` no build. Os logs do PowerShell podem apresentar `NativeCommandError` ao encapsular stderr mesmo quando o comando termina com código 0; os códigos de saída foram capturados explicitamente. Não houve atualização de dependências para suprimir avisos.

Os testes F3/F4/F6 foram mantidos: a fixture de restauração usa Luz (presente nos dois subconjuntos), os testes de escolas selecionam a lista da edição, e o teste de Habilidoso informa as três escolhas agora exigidas. Os casos novos exercitam domínio, modais React reais, JSON e geração/reabertura estrutural de PDF com pdf-lib. JSDOM não substitui inspeção visual em navegador.

## Decisões pendentes

1. Definir o catálogo que será publicado e as fontes/licenças de cada entrada fora do subconjunto SRD. A infraestrutura não presume que acesso gratuito equivale a permissão de redistribuição.
2. Verificar Alerta2014 em fonte primária acessível e confirmar os direitos do texto/tradução legados. Até lá, regra local identificada como não verificada, licença pendente.
3. Implementar os demais talentos/origens, suas concessões de magias e requisitos específicos; ampliar o catálogo 2024 de magias com revisões verificadas. Não oferecer placeholders como mecânica completa.
4. Completar proveniência de classes, itens, traduções e assets, sem apagar conteúdo ou declarar ilegalidade por ausência de atribuição.
5. Interface geral para restaurar entradas arquivadas continua fora desta frente; JSON e backups preservam essas entradas. Uso de regras compatíveis/homebrew deverá exigir classificação e referência próprias, sem fallback implícito.
