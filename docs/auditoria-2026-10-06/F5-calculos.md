# F5 — Cálculos compartilhados (A12, A13, A14, A18)

Implementado em 2026-10-07 sobre o checkout já alterado por F1–F4 e pelos catálogos. Nenhum AGENTS.md encontrado no projeto ou nos ancestrais consultados. Sem commit ou deploy. Os contratos F3 de identidade, snapshots e persistência permanecem em uso; não houve migração de atributos derivados para valores base nem atualização de dependências.

## Alterações

- `fichaSeletores.ts`: seletores puros de níveis/classes ativos, proficiência, iniciativa, perícias/especialização, percepção passiva, PV, deslocamento, proficiências, CA e armas. Fontes, parcelas aplicadas/inativas, condições e alternativas de CA podem ser explicadas pelos consumidores. Posições futuras continuam salvas, mas não contribuem para os cálculos.
- `fichaEfeitosUtils.ts`: atributo final também fornece base e explicação das fontes; efeitos com nível de classe de origem respeitam esse marco F4, além do nível total. A antiga soma indiscriminada de bônus de CA foi removida.
- Informações, perícias, modal de vida e inventário consomem os seletores. Iniciativa usa Destreza final; perícias usam atributos finais e especialização sem duplicar proficiência. Especialização tem controle explícito, persistido como efeito manual; o usuário deve registrar apenas os benefícios concedidos pelas regras de seu personagem.
- CA conserva a fórmula da armadura sem treino e explica as penalidades. Escudos respeitam a edição. Defesa exige armadura, e em 2024 treino; bônus do mesmo estilo não se acumulam. Monge exige ausência de armadura/escudo; Bárbaro permite escudo. Fórmulas alternativas não são somadas, e multiclasse não concede Defesa sem Armadura pela segunda vez. O seletor usa a melhor fórmula disponível.
- Armas compartilham ataque, dano e fontes com o PDF. Arquearia aplica-se ao ataque de arma à distância; Duelismo, ao dano principal de uma única arma corpo a corpo equipada em uma mão. O inventário de armaduras mostra a CA prevista ao equipar, incluindo o restante do equipamento.
- Elfo 2014 passou a registrar Percepção fixa, e Elfo da Floresta novo tem velocidade 35 ft. O catálogo 2024 já tinha Elfo Silvestre a 35 ft: foi mantido. Deslocamento consulta a linhagem; trocar raça não apaga velocidade manual diferente do antigo valor da raça.
- PDF: edição explícita, classes com níveis ativos (Guerreiro 3/Mago 2 sem Guerreiro 5 extra), valores compartilhados, todos os atributos/perícias e suas fontes, armas, informação ausente identificada e anexo paginado. Textos grandes nos campos fixos remetem ao anexo completo. O mapa da primeira página foi recalibrado após renderização revelar sobreposições preexistentes. Inclui agora as 18 perícias nos campos corretos.

## Preservação e ajustes

Seletores não escrevem na ficha. PV calculados não precisam alimentar `vidaTotal` para o PDF: ambos os consumidores consultam o mesmo resultado. `vidaTotal` explicitamente salvo funciona como máximo manual; `classeArmadura`/`cA` salvos funcionam como CA manual. As fórmulas de referência continuam explicáveis. A diferença entre iniciativa salva e o modificador da Destreza base é conservada como ajuste; efeitos `iniciativa`, `bonus_pericia`, `pv_maximo` e `deslocamento` permitem parcelas explícitas. Não se altera PV atual ao recalcular o máximo.

O campo `speed` legado igual à velocidade da raça é tratado como o antigo cache da raça; outros valores são preservados como substituições manuais. Essa distinção é uma compatibilidade heurística, pois o documento antigo não registrava proveniência. Snapshots de linhagens antigas não são reescritos pelo catálogo novo; uma ficha antiga com velocidade 30 na própria linhagem precisa de revisão/reseleção se desejar adotar a correção para 35.

## Validação

- Suíte completa: **90 testes, 5 suítes aprovadas** — [F5-test.log](F5-test.log).
- Após o ajuste visual final das coordenadas: **12 testes F5 aprovados**, incluindo geração real do PDF — [F5-seletores-test.log](F5-seletores-test.log).
- Lint e tipos aprovados — [lint](F5-lint.log), [tipos](F5-types.log).
- Build com compilação/ofuscação em diretório temporário exclusivo pelo script `build:verify`; não usa o diretório `build` existente — [log final](F5-build-final.log).
- `git diff --check` dos arquivos trabalhados passou; apenas avisos de normalização LF/CRLF.
- Testes cobrem PV44 para Guerreiro5/CON14, retroatividade, origem/ASI/item na iniciativa, especialização, armaduras leves/médias/pesadas, Destreza negativa, escudos nas duas edições, Defesa, Monge/Bárbaro, estilos de armas, linhagens, ajustes manuais, reabertura e níveis incompletos/planejados.
- [PDF longo de sete páginas](F5-longo.pdf), com 170 magias, gerado e renderizado pelo leitor nativo Windows. Inspecionadas visualmente primeira página, primeira página do anexo e última: [página 1](F5-pagina-1.png), [página 2](F5-pagina-2.png), [página 7](F5-pagina-7.png). [Script de renderização](F5-render.ps1). Verificação automatizada confirma a última magia e posições verticais válidas.

## Fontes e limites

Fontes consultadas em 2026-10-07:

- [Equipamento 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/equipment): fórmulas das categorias de armadura, escudos e penalidades por falta de proficiência.
- [Atributos 2014](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/using-ability-scores): modificadores e aplicação de proficiência em testes.
- [Equipamento 2024](https://www.dndbeyond.com/sources/dnd/br-2024/equipment): falta de treino não redefine a CA da armadura; o bônus do escudo exige treino.
- [Origens 2024](https://www.dndbeyond.com/sources/dnd/br-2024/character-origins): deslocamento de Elfo Silvestre a 35 ft.
- [SRDs/erratas](https://www.dndbeyond.com/srd): referência oficial das edições; nenhuma troca automática de edição ou reescrita geral do catálogo.

Pendências explícitas: especialização não valida automaticamente elegibilidade/quantidade por classe; outros estilos, ataques secundários, uso versátil com duas mãos, condições de combate e benefícios raciais/classes não representados como efeitos exigem aplicação manual. PV automáticos usam média fixa, não histórico de rolagens. Efeitos legados sem origem continuam preservados; a origem não é inventada. A fonte PDF Helvetica substitui caracteres não suportados por `?`, avisando no anexo. Campos curtos podem remeter ao anexo. Não houve revisão visual completa da aplicação em navegador/mobile, nem inspeção de todas as páginas intermediárias do PDF. Permanecem avisos preexistentes de React nos testes e da base Browserslist desatualizada.
