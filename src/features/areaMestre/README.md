# Área do Mestre — Fases 1 a 7.1

As seções abaixo registram as entregas e suas decisões. As entregas mais recentes
aparecem primeiro; o histórico das fases iniciais foi preservado.

## Fichas JSON exibidas pelo PDF do exportador do site

### Exportador reutilizado e isolamento

`utils/exportarFichaPdf.ts` já separa `gerarFichaPdf(ficha)` (bytes em memória) de
`exportarFichaPdf(ficha)` (download). O novo fluxo usa diretamente a primeira,
sem criar um segundo gerador nem modificar a exportação normal. Ambas as edições
usam o template local `public/ficha-de-personagem-dd-5e.pdf`, fontes Helvetica
embutidas e os seletores existentes para os valores 2014/2024; o apêndice inclui
classes, atributos, equipamentos, magias e demais detalhes já previstos pelo
exportador. O carregamento do template é aguardado antes de salvar os bytes.

`pdfFichaJson.ts` interpreta uma cópia do arquivo com `parseImport`, o mesmo
hidratador do editor. Essa operação apenas restaura/migra modelos em memória:
não seleciona personagens, não acessa o contexto React do editor, não navega,
não imprime e não escreve no localStorage. O módulo do gerador é importado
dinamicamente, somente quando um JSON precisa de PDF.

### Importação e visualização

`prepararImportacaoComPdf` compõe a leitura e os metadados existentes com a
geração do PDF. Novas importações reconhecem o envelope `minhafichadnd`, versão 1,
kind `ficha`, validado pelo parser do site; snapshots históricos sem envelope
precisam conter os seis atributos e campos característicos do DTO exportado.
Uma extensão JSON, ou apenas `id`/`nomePersonagem`, não identifica um snapshot
histórico legítimo. Edição omitida em legado identificado significa 2014;
edições desconhecidas são recusadas. O leitor antigo de metadados permanece
compatível com documentos já importados e não é usado como filtro de novas entradas.

O anexo original continua em `FichaOriginal.anexoId`, com os bytes JSON intactos.
`pdfAnexoId` referencia o novo anexo `application/pdf`. Nome, edição, PV normalizados
e retrato continuam nos metadados existentes. Instâncias reutilizam os anexos da
ficha original, mantendo seus próprios PV. JSON e PDF entram juntos no agregado
confirmado e na transação do IndexedDB. Falha de geração não libera Incluir;
um botão permite tentar preparar novamente o mesmo arquivo. Falha no commit não
produz anexos PDF órfãos no banco.

`VisualizadorFicha` direciona JSON para seu PDF associado e reutiliza
`VisualizadorDocumento`: páginas, zoom, scroll, abertura e download do PDF são os
mesmos do PDF importado diretamente. A modal principal não renderiza o snapshot
estruturado nem JSON bruto. A revisão de importação continua mostrando somente
o arquivo e os campos resumidos; o retrato permanece disponível separadamente.

### Fichas antigas, persistência e backup

Na primeira abertura de JSON sem `pdfAnexoId`, `useCampanhas.garantirPdfFicha`
conclui autosaves, gera o PDF e salva o agregado sob a revisão existente.
Conversões pendentes da mesma ficha compartilham uma tarefa; o bloqueio de escrita
protege a operação, e a revisão do repositório rejeita conflitos entre abas.
Geração ou gravação com falha mostra erro e permite tentar novamente. Falha de
releitura depois do commit exige recarga para não repetir uma conversão confirmada.

`converterFichaJson` não aplica o filtro mais restrito de novas importações a
documentos antigos: usa a validação/hidratação histórica do site. Acrescenta apenas
o PDF e sua referência, preservando os metadados revisados, retratos, instâncias,
PV atuais/máximos e os outros documentos da campanha. Uma vez persistido, o PDF
é reutilizado em todas as aberturas; não é regenerado automaticamente. Não existe
nesta entrega uma ação de atualização do JSON original ou regeneração manual.

O IndexedDB permanece na versão 4, sem novos stores ou migração destrutiva.
A validação aceita o campo opcional somente para JSON e exige o anexo PDF válido.
Backup v6 lê versões 1–6, inclui ambos os binários e remapeia `pdfAnexoId` junto
às referências de JSON/retrato. Backups antigos sem PDF podem ser convertidos
após restaurar, sem substituir a campanha original.

### Verificação e limites

`pdfFichaJson.test.ts` usa o template real, gera PDFs 2014/2024 e compara todos os
textos desenhados e a quantidade de páginas com `gerarFichaPdf` normal. Cobre
legados, formatos externos, falha/retry, integridade de referências, reload,
backup/restauração e rollback do IndexedDB. `ui/JsonPdf.test.tsx` percorre geração
real → gravação → visualizador → fechar/reabrir campanha → backup/restauração →
abrir PDF novamente, verificando que o gerador roda uma vez e não grava no
localStorage. O motor de renderização do PDF no canvas é simulado nesses testes;
o arquivo gerado e os fluxos de persistência são reais. `ImportarFicha.test.tsx`
foi atualizado para usar exportações legítimas e cobrir erro de geração/repetição.

As limitações visuais são as do exportador existente: mesmo template em ambas
as edições, retratos exibidos separadamente, campos não representados e substituição
de caracteres não suportados pela fonte conforme o apêndice informa. Não foi
criada uma ficha simplificada nem alterado o PDF padrão para contornar essas
limitações. Não há navegador disponível nesta sessão para revisão visual manual.
OCR, extração de PDF/imagens, turnos e condições não foram alterados. Sem commit/push.

Validação em 18/10/2026: `npm run typecheck`, `npm run lint` e
`npm run build:verify` passaram; o build também confirmou a integridade dos assets
locais de OCR. A suíte completa passou: **90 suítes e 1.728 testes**, em 159,3 s,
incluindo a exportação PDF normal e as regressões das fichas 2014/2024.
O gzip informado pelo CRA antes da ofuscação mantém a entrada principal em
**1,38 MB**. O workspace sob demanda mede **47,41 kB de JS e 7,90 kB de CSS**;
na última validação da Fase 7.1 eram 46,22 kB e 7,77 kB. O gerador continua em
`import()` tanto na Área do Mestre quanto no botão de exportação do editor;
não foi acrescentado ao carregamento inicial nem adicionada nova dependência.

## Fase 7.1 — condições e efeitos temporários

O catálogo pesquisável reúne 77 opções: as 15 condições oficiais e os marcadores solicitados
em cinco categorias: condições oficiais, dano contínuo, efeitos negativos, efeitos
positivos e outros marcadores. Inclui efeito personalizado, observação e exaustão
com nível de 0 a 6 conforme o refinamento do seletor. Os identificadores internos
permanecem independentes dos nomes exibidos. Envenenado e Veneno contínuo são
entradas diferentes. Nenhum marcador aplica dano, cura, modificadores ou penalidades.

Cada aplicação possui ID próprio e referências à campanha, ao combate e ao
participante real. Aplicações repetidas e instâncias da mesma ficha são independentes.
`condicoes.ts` concentra inclusão, edição, remoção e contagem; os componentes React
somente apresentam os dados e enviam ações. `catalogoCondicoes.ts` concentra nomes,
categorias, aliases de busca e identificadores dos ícones SVG locais.

A duração padrão representa turnos completos do alvo, com encerramento no final
do turno. O seletor também oferece o início do turno: nesse modo o contador é
consumido na entrada do próximo turno elegível do alvo. A ocorrência temporal
persistida identifica o turno em andamento independentemente da posição na roleta.
Aplicar durante o turno do próprio alvo não consome esse turno parcial. Turnos de
outros participantes, reordenação, alternância de combate e reload não consomem
duração. Editar os turnos restantes preserva o controle da ocorrência, sem avançar
rodadas nem reiniciar o combate. A duração manual permanece até remoção explícita.

O motor `executarAcaoCombate` atualiza condições e iniciativa no mesmo agregado,
salvo pela transação existente. A condição que chega a zero é removida nessa mesma
operação, e sua representação desaparece após o commit. Falhas não deixam iniciativa
e efeitos parcialmente atualizados. Participantes com zero PV continuam mantendo
seus efeitos. Encerramento interrompe a contagem e copia as condições ainda ativas
para o histórico, inclusive ao restaurar PV; encontros futuros começam sem efeitos.

As condições ficam embutidas nos registros dos combates. O IndexedDB permanece na
versão 4: não há novo store ou upgrade destrutivo. Ausência de condições equivale a
lista vazia, e ausência de ocorrência temporal usa o valor inicial compatível.
Backup v5 aceita versões 1 a 5, preserva o controle temporal e remapeia os IDs das
aplicações e suas referências, incluindo os snapshots históricos.

`CondicoesCombate` apresenta busca, categoria, lista vertical com rolagem própria,
duração, momento de encerramento e observação. Adicionar, editar e excluir usam o
mesmo bloqueio transacional de ações do combate. `CondicoesRevisionadas` mantém a
revisão da abertura; mudanças locais ou em outra aba rejeitam a edição antiga.
Após commit com falha de releitura, exige recarga para impedir reaplicação.

Os cards mostram ícones SVG locais com contador ou ∞, nome acessível, tooltip e
cores discretas por categoria. O excesso abre a lista completa. Cópias da roleta
são decorativas; as ações usam uma representação principal de cada participante,
sem duplicar aplicações. O botão Encerrar combate permanece abaixo de Próximo turno.

Arquivos novos: `catalogoCondicoes.ts`, `condicoes.ts`, `ui/CondicoesCombate.tsx`,
`ui/IconeCondicao.tsx` e `ui/condicoes.css`. Integração em modelos, validação,
execução, encerramento, backup, hook, workspace, roleta e histórico. Testes novos
em `condicoes.test.ts`, `condicoesRoundTrip.test.ts`, `useCondicoes.test.tsx` e
`ui/CondicoesCombate.test.tsx`; o fluxo completo pelo workspace também foi ampliado.

Typecheck, lint e `build:verify` passaram. O build preservou os assets locais de OCR
após ofuscação. Métricas gzip do CRA antes da ofuscação: entrada principal 1,38 MB;
workspace sob demanda 46,22 kB de JS e 7,77 kB de CSS. A versão anterior da Fase 7
media 39,19 kB e 7,10 kB, respectivamente. Não foram adicionadas dependências.
A suíte completa passou em 18/10/2026: **88 suítes e 1.717 testes**, em 138,9 s.
Inclui cenário com Guerreiro, Mago e dois Goblins, duração no início/final do turno,
turno parcial, condições repetidas, reordenação, edição e exclusão, zero PV,
reload, backup antigo e novo, histórico, rollback, conflito entre abas e confirmação
duplicada. A integração do workspace verifica aplicar e editar pela roleta, salvar
no IndexedDB e remover o ícone após a expiração no turno completo do alvo.

A revisão visual desktop/mobile, foco e gestos reais permanece pendente: o
inventário desta sessão não disponibilizou apps ou navegadores. Os efeitos são
marcadores, sem automação de regras, dano ou cura. OCR e reconhecimento de fichas
continuam fora do escopo desta fase. Sem commit ou push.

## Fase 7 — encerramento, múltiplos encontros e histórico

### Fluxo e interface

`Combates e histórico` abre o gerenciador pelo menu ou pela navegação da campanha,
sem outro painel fixo. Agrupa preparados, em andamento e encerrados; mostra nome,
estado, participantes, rodada e datas. Histórico é ordenado por encerramento mais
recente. Preparados abrem o resumo existente, onde o início é confirmado. Ativos
permitem retomar, consultar participantes e encerrar; encerrados só oferecem consulta.
Listagens não criam URLs de imagens nem renderizam PDFs: usam os metadados já
carregados no agregado da campanha.

A preparação tem nome opcional; vazio recebe `Combate N`, contando os encontros da
campanha em ordem de criação. `nomeCombate` fornece o mesmo padrão para registros
antigos. A sidebar conserva botões compactos com apenas ícone e nome. A roleta
continua com cinco posições, centro ativo, handle, animação circular e próximo
turno à direita; um pequeno botão de encerrar fica junto à identificação.
Alternar somente seleciona a visualização; não grava, avança ou reinicia encontros.

Ao preparar enquanto existe execução ativa, uma escolha permite criar outro
encontro ou finalizar o atual. Com vários ativos, a seleção é explícita; só é
preenchida automaticamente quando o mestre já selecionou um encontro ou há apenas
um disponível. Criar outro nunca encerra o anterior. Instâncias ocupadas aparecem
indisponíveis com o nome do combate que as utiliza; outras instâncias da mesma
ficha permanecem disponíveis. A ativação revalida a ocupação por ID da instância.

`EncerrarCombate` apresenta nome, rodada, participantes e prévia de PV. Nenhum rádio
é selecionado inicialmente; Confirmar fica desabilitado até escolher **Manter PV
atuais** ou **Restaurar PV anteriores**. Restaurar copia atuais e máximos capturados
na ativação, inclusive quando a instância começou ferida; não completa os PV até
o máximo. Cancelar não executa encerramento. Rodapé mantém as ações lado a lado.

### Domínio, confirmação e concorrência

`encerramentoCombate.ts` concentra `encerrarCombate`, `podeRestaurarPV` e a identificação
dos encontros. Só aceita ativo; encerrados não avançam, reordenam ou reabrem. Captura
os resultados antes de aplicar a decisão, mantém rodada e ordem final, registra a
data de encerramento e limpa o participante ativo. Apenas instâncias participantes
são restauradas. Outros ativos e seus PV permanecem intactos. Avulsos/minions ficam
na campanha e podem ser reutilizados; nenhuma instância/arquivo é excluído por encerrar.

O workspace conclui autosaves antes de abrir a modal. `EncerramentoRevisionado`
conserva a prévia e sua revisão de abertura. `useCampanhas.encerrarCombate` compara
essa revisão, relê a campanha atual, valida novamente e salva o agregado inteiro
pela transação/revisão existentes. Mudança local ou em outra aba invalida a decisão
antiga e exige recarga; nenhum PV recente é sobrescrito silenciosamente. Lock e
ref impedem confirmação concorrente. Falhas antes do commit não publicam restauração
ou histórico parcial. Falha de releitura após commit publica o encerramento conhecido
e bloqueia novas gravações até recarregar, sem reaplicar a restauração. beforeunload
e cleanup continuam protegendo a operação pendente.

Ao encerrar o selecionado, seus controles desaparecem e o histórico pode ser
consultado; outro ativo não é escolhido arbitrariamente. Se a seleção se tornar
indisponível por alteração externa, a interface oferece escolher outro encontro.
O painel direito acompanha os mesmos PV persistidos, reutilizando PopupVida.

### Histórico independente e exclusões posteriores

`Combate.historico` versão 1 registra decisão de PV, início da execução e participantes
com IDs históricos, nome, categoria, iniciativa, ordem, PV inicial confiável ou null,
e PV final observado antes da eventual restauração. `encerradoEm` e `rodada` permanecem
no combate. Os valores são cópias, independentes de renomear/curar/ferir a instância.
`HistoricoCombate` é somente leitura e pode abrir a ficha original quando disponível.
Registros antigos sem resultados mostram uma mensagem, sem inventar PV/decisões.

Instâncias só podem ser removidas quando todos os seus vínculos pertencem a
encerrados com histórico completo. Os IDs de instância/ficha então são identificadores
históricos, não dependências vivas obrigatórias; nomes/tipos/PV continuam disponíveis.
Preparados e ativos continuam exigindo referências existentes. O backup remapeia
também esses IDs históricos sem entidade viva, preservando a relação entre os
participantes, snapshots e resultados sem criar instâncias artificiais.

### Migração e compatibilidade

IndexedDB passa de **3 para 4**, sem recriar banco/stores ou ler binários na migração.
`execucao.origemSnapshot` diferencia `ativacao` de `legado`. Novas ativações sempre
registram a origem real. Em registros anteriores sem marcador, a reconstrução antiga
copiava exatamente `iniciadoEm` para `ativadoEm`: datas diferentes identificam o
snapshot real existente; datas iguais são tratadas conservadoramente como legado.
Uma ativação antiga que ocorreu no mesmo instante da preparação é ambígua e não
habilita restauração. Nesses casos, ou sem snapshot, manter PV continua disponível.
Não são usados os PV da ficha original ou da preparação como restauração inventada.
Erros de upgrade revertem a migração e preservam os dados da versão 3.

Schema do agregado permanece **1**; backup passa a **v4**, com leitor **v1/v2/v3/v4**.
Exportação/restauração incluem resultados, decisão, nomes, estados e snapshots,
mantendo ativos retomáveis e histórico consultável. Restaurar cria outra campanha
e não sobrescreve a original. Nenhuma dependência nova ou alteração de OCR/extração.

### Arquivos e revisão final

Novos: `encerramentoCombate.ts`, `ui/GerenciadorCombates.tsx`, `ui/EncerrarCombate.tsx`,
`ui/HistoricoCombate.tsx` e `ui/combates.css`. Integração em modelos, validação,
repositório, backup, instâncias, preparação, hook, workspace, resumo e barra.
Testes novos: `encerramentoCombate.test.ts`, `encerramentoRoundTrip.test.ts`,
`encerramentoCompatibilidade.test.ts`, `useEncerramentoCombate.test.tsx`,
`ui/Combates.test.tsx`, `ui/EncerramentoWorkspace.test.tsx`; testes antigos de versão
e nome padrão foram atualizados. Há integração com importação real JSON/PDF, dois
ativos independentes, dano/reordenação, decisões diferentes de encerramento,
imutabilidade histórica, reload e backup com referências históricas remapeadas.

Validação final da Fase 7 (18/10/2026): `npm run typecheck`, `npm run lint` e
`npm run build:verify` concluíram com sucesso. A suíte completa passou: **84 suítes,
1.687 testes**, em 133,6 s. O build verificou também a preservação dos assets locais
de OCR após a ofuscação. Tamanhos gzip informados pelo CRA antes da ofuscação:
entrada principal **1,38 MB**, workspace carregado sob demanda **39,19 kB** de JS
e **7,10 kB** de CSS (antes: 34,96 kB e 6,51 kB na Fase 6.1). O inventário de
automação não ofereceu apps ou navegadores nesta sessão.

Permanecem pendentes a revisão visual desktop/tablet/mobile, foco e gestos reais,
e a correção conhecida de reconhecimento de nome/PV/retratos em PDFs/imagens,
expressamente fora desta fase. Não há reabertura/edição de histórico, mapas,
recompensas ou sincronização com servidor. Sem commit ou push.

## Fase 6.1 — roleta de iniciativa

`ui/BarraIniciativa.tsx` e `ui/barraIniciativa.css` substituem a faixa tradicional
por cinco posições: offsets -2, -1, 0, +1, +2 da ordem persistida. `janelaIniciativa`
usa módulo positivo para percorrer circularmente a lista. O offset 0, e somente
ele, recebe aria-current e o card maior com borda laranja, inclusive sem retrato.
Com 2–4 participantes, repetem-se somente representações. As chaves combinam ID
real e volta visual (sem IDs de DOM repetidos); a volta não é gravada no domínio.
Não foram criadas entidades, snapshots ou ordens adicionais para a apresentação.

Uma ocorrência por ID tem os controles, preferindo a mais próxima do centro e, em
empate, a próxima. As demais são cópias decorativas, identificadas como tal. Todas
as operações continuam utilizando IDs reais de participante/instância, e os PV vêm
do mesmo agregado. Clicar abre o resumo/ficha/PopupVida existentes. Nenhum estado
de PV é mantido na roleta. A identificação do combate e a rodada ficam compactas;
Próximo turno ocupa a lateral direita no desktop, alinhado aos cinco cards.

Transições usam Web Animations nativa, sem dependências: geometria anterior e atual
das ocorrências compartilhadas gera deslocamento horizontal, escala e opacidade
durante 220ms. A ocorrência que entra aparece pela direita, sem cards extras no
DOM. Chaves permanecem consistentes na passagem de rodada. Alterar PV/mensagens não
reanima a faixa. Animações são canceladas ao desmontar, e movimento reduzido as
desativa; sem suporte à API, a apresentação atualiza imediatamente. Não há roleta
aleatória nem avanço fictício antes do commit.

O handle é um ícone sem fundo/borda permanente, com hover neutro, cursor grab e
foco visível. Drag entre cards usa o ID do destino real, não seu offset visual;
soltar sobre outra cópia do mesmo participante é uma operação nula. As setas visuais
foram removidas. Setas do teclado, Home e End no handle continuam reordenando.
Um clique/toque ou Enter no handle abre **Reorganizar iniciativa**, com a ordem
completa e seu próprio scroll. É possível arrastar verticalmente, com rolagem nas
bordas, ou escolher qualquer posição pelo select, incluindo participantes fora da
janela de cinco. A lista também permite abrir qualquer participante. Fechá-la não
substitui a roleta principal, não avança turno e não reinicia rodada. Cancelamento,
perda de captura e bloqueio pendente descartam gestos; o clique produzido por um
drag é suprimido para não abrir outro diálogo.

Depois de reorganizar, o ativo continua centralizado. O motor da Fase 6 não mudou:
os IDs já visitados continuam sendo ignorados até concluir o ciclo da rodada.
A roleta representa os vizinhos da ordem persistida; após uma reorganização,
avançar pode pular um vizinho que já teve turno, centralizando o ID efetivamente
confirmado pelo motor, sem alterar essa regra para simular uma animação.

Tablet reduz os cards proporcionalmente. Até 650px, o viewport recorta a faixa
centralizada quando necessário, e identificação/botão ficam numa linha compacta
sob os retratos. Até 450px, extremidades cortadas são prévias sem controles
focáveis, evitando que Tab role o viewport e tire o ativo do centro. Os três cards
centrais e a lista completa mantêm o acesso por teclado a todos os participantes.
Não há scroll horizontal da página nem crescimento da barra pelo total de combatentes.

Para atualizar mudanças de outra aba, `useCampanhas` notifica commits por
BroadcastChannel e relê a revisão salva. Sem canal, foco/visibilidade oferecem
recarga auxiliar. Mensagens não carregam fichas/Blobs nem aplicam operações: apenas
sinalizam uma releitura do IndexedDB. Uma leitura antiga nunca substitui revisão
mais nova, campanha trocada ou edição concorrente. Rascunhos, transações pendentes,
conflitos, campos focados e modais impedem recarga automática; um sinal adiado é
reavaliado sem sobrescrever formulários locais. Não há polling de dados sem um
sinal pendente. Falhas dessa leitura auxiliar preservam os controles explícitos
de recarga/erro, e canais/listeners/timers são liberados ao desmontar.

IndexedDB continua v3, backup v3 (leitor v1/v2/v3) e schema 1. Não há migração ou
dependência nova. Motor, snapshots, importação, OCR e header principal permanecem.
Testes de roleta foram atualizados; novos `sincronizacaoAbas.test.tsx` e
`ui/roletaLayout.test.ts` cobrem atualização segura e contratos de layout. A
integração do workspace continua testando vida, ficha, reordenação e reload, agora
usando o handle de teclado. As regressões de turnos e backup continuam na suíte.

Inventário de navegador novamente vazio (`apps: [], browsers: []`). Revisão visual
desktop/tablet/mobile, animação física, hover/foco e drag com toque real permanecem
pendentes. Em telas estreitas as extremidades ficam parcialmente cortadas por
decisão de layout; para destinos distantes, use a ordem completa, sem arrastar
através de cards invisíveis. Rolagem de borda dessa lista acontece enquanto o
ponteiro se move, não continuamente com o dedo parado. Sem commit/push ou Fase 7.

Validação final: **78 suítes e 1.659 testes aprovados** (128,9s), incluindo os
**29 testes direcionados** de roleta/layout, workspace e sincronização. Comando
completo: `CI=true npm test -- --watchAll=false --runInBand --testTimeout=30000`.
Typecheck, lint e `build:verify` aprovados; ofuscação e assets locais preservados.
Medição CRA antes da ofuscação: inicial **1,38MB gzip**, chunk do mestre **34,96KB**
e CSS **6,51KB** (Fase 6: 33,28KB/6,14KB). Nenhuma dependência adicionada.
Avisos anteriores de `fs.F_OK` na ferramenta de build e `act(...)` em testes de
fichas permanecem, sem falhas. Fontes/diff revisados e logs temporários removidos.

## Fase 6 — execução e barra de iniciativa

### Interface e retomada

A sidebar conserva a preparação existente. Cada encontro preparado abre seu resumo,
agora com **Iniciar combate**; confirmar uma preparação continua sem ativar turnos.
Encontros em andamento aparecem em uma seção própria com rodada e participantes.
Depois de reabrir a campanha, escolha **Retomar combate**: não há seleção arbitrária
nem reinicialização automática, inclusive quando existem vários ativos independentes.
Trocar a barra exibida apenas seleciona a visualização, sem escrever no combate.

`ui/BarraIniciativa.tsx` é uma faixa separada abaixo do header principal, fora do
grid. Exibe posição, nome, iniciativa, retrato compartilhado, PV da instância e
rodada. O participante ativo tem borda laranja e aria-current; o status anuncia seu
nome e rodada. Itens de largura consistente rolam horizontalmente, inclusive por
toque, sem aumentar a página. Somente uma mudança do ID ativo pode ajustar o scroll
da própria faixa; alterações de PV e reordenações não provocam recentralização.
Movimento reduzido troca a rolagem suave por imediata.

O handle dedicado usa Pointer Events com captura para mouse/toque, limiar de gesto,
feedback de destino e rolagem nas bordas durante o movimento. Só o drop grava a
permutação completa; cancelamento/perda de captura descarta o gesto. Arrastar não
abre o participante. Botões esquerda/direita e setas no handle oferecem alternativa
de teclado. Ações pendentes têm bloqueio imediato por ref e controles desabilitados.

`ui/ParticipanteEmCombate.tsx` abre um resumo compacto com retrato, PV e acesso à
ficha completa. Ajustar vida reutiliza **PopupVida**, sem outro formulário de dano
e cura. Tanto essa entrada quanto `PainelPV` alteram a mesma instância do agregado;
barra e painel direito acompanham o resultado. A ficha original e outras instâncias
não mudam. 0 PV recebe indicação visual e permanece na sequência, sem regra de morte.

### Motor, ordem e rodadas

`execucaoCombate.ts` exporta `executarAcaoCombate(dados, id, acao, agora)`:
`iniciar`, `avancar` ou `{ordem: IDs de participantes}`. Iniciar exige preparado,
participantes válidos e nenhuma instância já ocupada por outro ativo. Preserva a
ordem confirmada, define o primeiro ID ativo e rodada 1. Não reinicia ativos.
Iniciativas negativas e empates da preparação continuam válidos; durante a execução,
a iniciativa não é reordenada novamente. A ordem manual é a sequência persistida.

`combate.execucao` versão 1 contém `ativadoEm`, `visitados` (incluindo o ativo) e
`pvAtivacao`, com participanteId, instanciaId e cópia dos PV na ativação. `pvInicio`
continua sendo o snapshot da preparação, que pode diferir dos PV antes do primeiro
turno. Dano, cura, reordenação e avanço conservam `pvAtivacao` inalterado.

Regra determinística do ciclo: após o ativo, percorrer circularmente a nova ordem
e escolher o primeiro ID ainda não visitado nesta rodada. Reordenar mantém ativo,
rodada e visitados. Assim, quem já teve turno não repete acidentalmente e quem ainda
não teve não é pulado. Quando todos foram visitados, o próximo avanço incrementa a
rodada e ativa a primeira posição da ordem vigente, iniciando outro conjunto.
Portanto uma reordenação pode exigir passar por uma posição já visitada sem dar-lhe
outro turno, até concluir o ciclo. Não há adição/remoção de participantes nesta fase.

### Persistência, concorrência e compatibilidade

`useCampanhas.executarCombate(id, acao)` conclui primeiro os PV/edições pendentes,
aplica o motor e salva o agregado pela transação existente com revisão otimista.
A interface publica o estado do turno só após commit. Falha antes do commit mantém
o turno anterior; conflito entre abas exige recarregar e não sobrescreve a revisão
mais recente. Ações concorrentes recebem false enquanto há confirmação pendente;
edição programática nesse intervalo é recusada. Falha de releitura após commit
publica o resultado conhecido, bloqueia novas gravações e pede recarga, sem sugerir
que o avanço foi revertido. Saída aguarda a transação e beforeunload avisa.

IndexedDB sobe de **v2 para v3**, sem recriar stores ou arquivos. A migração ocorre
na transação de upgrade e preenche execuções ativas legadas sem o novo campo.
Como essas versões não registravam progresso nem PV reais de ativação, somente
para esse legado é adotado o prefixo da ordem até o ativo e o snapshot histórico
`pvInicio`. Isso é reconstrução de compatibilidade: não recupera um histórico que
nunca foi salvo. Preparados existentes ficam intactos e recebem snapshot real ao
iniciar. Falha do upgrade conserva a versão e os dados anteriores.

Schema do agregado continua **1**; o campo opcional de execução possui versão própria.
Backup novo é **v3**, leitor aceita **v1/v2/v3** e normaliza ativos legados. Restore
remapeia também os IDs de visitados e dos snapshots de participante/instância.
Ordem, rodada, ativo, progresso, PV atuais, snapshots, documentos e retratos sobrevivem
à exportação/restauração. Nenhuma dependência foi adicionada.

### Arquivos, validação e limites

Produção: novos `execucaoCombate.ts`, `ui/BarraIniciativa.tsx`,
`ui/barraIniciativa.css`, `ui/ParticipanteEmCombate.tsx`; alterações em modelos,
validação, repositório, backup, hook, workspace e resumo de preparado. Testes novos:
`execucaoCombate.test.ts`, `execucaoRoundTrip.test.ts`, `useExecucaoCombate.test.tsx`,
`ui/BarraIniciativa.test.tsx` e `ui/ExecucaoWorkspace.test.tsx`; expectativas de
upgrade futuro e formato de backup atualizadas nos testes existentes.

Os testes cobrem inicialização, snapshots distintos, ciclos, reordenação parcial,
PV zero, toque/teclado/cancelamento, bloqueio pendente, falhas e conflitos, migração
com rollback, backups antigos e integração com quatro participantes, dano/cura,
ficha, reabertura e retomada explícita. O round-trip importa JSON/PDF reais, preserva
arquivos e continua o combate depois de restaurar o backup.

O inventário de navegador retornou `apps: [], browsers: []`. Permanecem pendentes
revisão visual desktop/mobile, toque físico/drag nas bordas, legibilidade com muitos
combatentes e interação real de scroll/resize do workspace. Testes DOM e contratos
de layout não substituem essa revisão. Nenhum OCR ou extração foi alterado.
Encerramento, manter/restaurar PV, histórico e gestão completa ficam para a Fase 7.
Não há mecanismo provisório de encerramento. Sem commit ou push.

Validação da Fase 6: suíte completa com **76 suítes e 1.644 testes aprovados**
(146,3s; `CI=true npm test -- --watchAll=false --runInBand --testTimeout=30000`).
São 39 casos adicionais. As suítes novas também foram executadas separadamente.
O limite de timeout é só da CLI; nenhuma configuração global foi alterada.
`npm run typecheck`, `npm run lint` e `npm run build:verify` aprovados, incluindo
ofuscação e conferência dos assets locais de OCR. Medição CRA antes da ofuscação:
JS inicial **1,38MB gzip**, workspace **33,28KB gzip**, CSS do workspace **6,14KB**.
O inicial conserva a referência da Fase 5; a interface/motor ficam no chunk do mestre.
Permanecem avisos anteriores de `fs.F_OK` na ferramenta de build e `act(...)` em
testes de fichas. Nenhum erro de validação final. Fontes e diff revisados, sem
alterar os arquivos de reconhecimento ou descartar mudanças locais anteriores.

## Fase 5.1 — refinamento da preparação

`ui/PrepararCombate.tsx` e `ui/prepararCombate.css` organizam a preparação em dois
painéis, sem o antigo quadro de revisão. O cabeçalho contém apenas título e fechar;
Cancelar e Confirmar preparação ficam no rodapé. Mensagens de erro continuam junto
às ações e todos os controles permanecem bloqueados durante a confirmação.

A modal tem largura máxima de 1100px e altura de 88dvh (90dvh até 650px), com
overflow externo oculto. A cadeia flex/grid usa min-height:0; somente o conteúdo
de cada painel tem overflow-y:auto. Cabeçalhos e rodapé não encolhem nem fazem
parte das listas roláveis. As scrollbars herdam o estilo da Área do Mestre.

No celular, um seletor alterna entre os painéis, preservando o rascunho. matchMedia
acompanha mudanças de viewport; o atributo hidden retira o painel inativo tanto do
layout quanto da navegação por teclado. O botão + permanece no cabeçalho dos
disponíveis, tem nome acessível e tooltip por mouse e foco, e abre o fluxo existente.

Seleção, iniciativas, PV, instâncias, persistência, backup e OCR foram preservados.
Os testes de interface verificam cabeçalhos/ações separados das listas, 50 minions,
atalho/tooltip, alternância móvel e descarte; um contrato de CSS verifica dimensões,
overflow e limites flex/grid. Esse contrato não substitui medição visual no navegador.
Não há navegador disponível nesta sessão: revisão visual desktop/mobile e rolagem
por mouse/toque permanecem pendentes. Nenhuma dependência foi adicionada.

Validação: typecheck e lint aprovados; suíte completa com 71 suítes e 1.605 testes
aprovados (`--watchAll=false --runInBand --testTimeout=30000`, timeout apenas na CLI).
`npm run build:verify` também aprovado, incluindo ofuscação e verificação dos
arquivos locais de OCR. O build emitiu aviso de depreciação de `fs.F_OK`, sem falha.

## Fase 5 — preparação de combate

### Arquitetura e fluxo

`Iniciar combate` abre `PrepararCombate`, em três regiões: disponíveis, selecionados
e revisão/ações. A modal é ampla no desktop e empilhada em telas menores. As pequenas
configurações substituem o diálogo principal, sem empilhar focus traps. Escape e
Cancelar protegem tanto a configuração em edição quanto a preparação alterada;
beforeunload também avisa. O rascunho é exclusivamente estado React, sem autosave.

`preparacaoCombate.ts` define `ParticipantePreparacao`, `RascunhoPreparacaoCombate`,
ordenação estável e `confirmarPreparacao`. O serviço é puro: valida, copia e retorna
um único agregado. `useCampanhas.confirmarCombate` primeiro conclui edições normais
pendentes, monta o agregado, chama `repo.salvar` uma vez para o encontro completo e
relê `obter` para receber a revisão. Só publica as novas instâncias/participantes
depois do commit; falha não deixa um rascunho de combate agendado no autosave.

Jogadores são selecionados por instância, com PV atuais e resumo já disponível.
Fichas antigas sem instância podem criar sua primeira ocorrência apenas no rascunho.
Monstros oferecem instância existente ou uma nova com nome numerado livre, própria
iniciativa e PV, compartilhando ficha/arquivos. Configuração inclui nome, iniciativa
e PV atuais/máximos; máximos desconhecidos têm aviso e aceitam preenchimento manual.
Não há restauração automática de PV. Nomes/PV das instâncias existentes só mudam se os ajustes forem
explicitamente confirmados junto com toda a preparação; fichas originais não mudam.

Avulsos usam `InstanciaFicha` com `fichaOriginalId: null`; podem ser jogador/monstro.
Minion rápido preenche 1PV, editável. Criação em quantidade aceita 1–100, com IDs,
nomes e objetos de PV independentes; a iniciativa comum inicial pode ser editada
individualmente. Não existe um domínio separado para minions. Não há upload de
imagem de avulso: o vínculo de retrato atual pertence à ficha original; avulsos usam
placeholder, evitando criar documentos artificiais ou campos extras nesta fase.

A lista permite editar/remover e ordena iniciativa inteira decrescente (positiva,
zero ou negativa). Empates preservam a ordem de inclusão, mesmo após editar. Exige
pelo menos dois participantes e IDs únicos, sem repetir instância. Referências,
campanha, PV e categorias são validados pelo domínio e pelo validador transacional.
Instância em combate **ativo** é bloqueada. Duas instâncias podem compartilhar a
mesma ficha; preparados não reservam instâncias, conforme a regra de exclusividade
somente para ativos. A futura ativação deverá validar essa exclusividade novamente.

### Confirmação, rollback e recuperação

O novo estado é `preparado`, com rodada **0**, participante ativo **null** e sem
encerramento. `iniciadoEm` conserva o timestamp da confirmação neste estado; não
representa execução de turno. `pvInicio` copia os valores revisados na confirmação,
sem compartilhar o objeto de PV da instância. `ordem` persiste a sequência inicial.

A transação existente engloba combate, vínculos e instâncias novas/ajustadas. Se
falhar uma escrita, o IndexedDB reverte tudo; revisão obsoleta também não publica
a preparação. A modal mantém o rascunho e informa o erro. Retry usa o ID do encontro
mantido na abertura. Uma falha de leitura **após** commit é distinguida de rollback:
mostra o encontro salvo e bloqueia gravações até recarregar a revisão, sem permitir
confirmar o mesmo encontro novamente. Saída durante confirmação é protegida e a
conexão aguarda a transação em andamento antes de encerrar.

Cancelar/remove do rascunho não escreve: instâncias temporárias são descartadas,
instâncias preexistentes e arquivos permanecem. Avulsos e cópias confirmados passam
a ser instâncias comuns da campanha e aparecem no painel de PV; não são apagados
automaticamente ao fechar a preparação. A integridade existente impede remover
instâncias referenciadas por participantes persistidos.

Após salvar, `ResumoCombatePreparado` mostra nomes, tipos, iniciativa e PV da
preparação. Se o painel de vida posteriormente alterar PV, o resumo distingue os
valores atuais do snapshot. A sidebar permite consultar os preparados depois de
reabrir a campanha. Isso é recuperação básica, sem gerenciar a execução ou múltiplos
combates ativos. O resumo salvo é somente consulta nesta fase.

### Compatibilidade e arquivos

Banco continua **v2**, schema do domínio **v1** e backup **v2**, com leitor **v1/v2**.
O novo estado amplia um enum já armazenado; nenhum campo/store/índice ou dado antigo
exige transformação. Portanto não foi criada migração artificial. `validacao.ts`
aceita preparado e exige 0/null, conservando as regras anteriores de ativo/encerrado.
Backup já serializa o agregado e remapeia IDs/referências; restaura preparados com
iniciativas, snapshots e ordem. Anexos, roteiros, layout e leitura só de metadados
na listagem de campanhas permanecem no mesmo contrato. Sem novas dependências.

Arquivos de produção desta fase: `modelos.ts`, `validacao.ts`, novo
`preparacaoCombate.ts`, `useCampanhas.ts`, `ui/AreaMestreWorkspace.tsx` e CSS, novos
`ui/PrepararCombate.tsx`, `ui/prepararCombate.css`, `ui/ResumoCombatePreparado.tsx`.
Testes novos: `preparacaoCombate.test.ts`, `preparacaoRoundTrip.test.ts`,
`usePreparacaoCombate.test.tsx`, `ui/PrepararCombate.test.tsx`; integração do workspace
ampliada e expectativas do botão de combate atualizadas.

### Limites e pendências

**Reconhecimento de nome, PV e retratos em PDF/imagem continua com falhas conhecidas.**
Por decisão do usuário, a correção foi adiada até concluir todas as fases. Nenhum
OCR, extração/parsing de PDF ou reconhecimento de imagens foi alterado na Fase 5.
O mestre pode preencher e revisar os valores manualmente na preparação.

Não foram implementados participante ativo, barra horizontal, rodadas, próximo
turno, reordenação durante execução, encerramento ou restauração de PV. A Fase 6
poderá consumir `combates.estado === 'preparado'`, os vínculos e a `ordem` persistida,
revalidando exclusividade antes de ativar. A gestão completa de encontros/histórico
continua para as fases correspondentes. Nenhum commit, push ou reset.

O inventário de navegador retornou novamente `apps: [], browsers: []`. Não houve
revisão visual em navegador real. Permanecem pendentes desktop/tablet/mobile,
foco entre configuração/descarte/resumo e interações com o grid enquanto a modal
está aberta; os testes DOM/IndexedDB não substituem essa revisão.

### Validação final da Fase 5 — 18/10/2026

- `npm run typecheck` e `npm run lint`: aprovados, sem novos avisos.
- `npm run build:verify`: aprovado, incluindo ofuscação e conferência dos assets
  OCR preexistentes. Nenhuma dependência ou código de reconhecimento foi alterado.
- Suítes novas/direcionadas: domínio/validação, interface, hook e round-trip
  aprovados. A integração DOM confirma descarte sem gravação, minions, edição,
  falha com retry, resumo e recuperação; o round-trip real importa JSON/PDF,
  prepara quatro combatentes e verifica referências/bytes/snapshots após backup.
- Suíte completa: **70 suítes e 1.599 testes aprovados**, 273,8s; 37 casos adicionais
  à Fase 4.1. Comando: `CI=true npm test -- --watchAll=false --runInBand --testTimeout=30000`.
  Uma execução direcionada concorrente com typecheck/lint excedeu os 5s no caso
  antigo de sidebar/layout; a execução serial com limite de 30s passou. Não foram
  modificados os timeouts dos arquivos de teste nem a configuração global.
- Bundle inicial permanece em **1,38MB gzip** (arredondamento CRA). Workspace:
  **29,29KB**, comparado aos 25,17KB da Fase 4.1; CSS **5,31KB** contra 4,82KB.
  As dependências PDF/OCR continuam sob demanda e os arquivos originais não são
  duplicados para cada combatente.
- Diff e espaços revisados; logs temporários removidos. Avisos anteriores de
  bundle elevado, `act(...)` em testes de fichas e `fs.F_OK` na ferramenta de build
  permanecem. A limitação de navegador real está registrada acima.

## Fase 4.1 — coleções compactas, reconhecimento e recorte

### Interface e reutilização

- O painel de PV apresenta apenas nome, atuais/máximos e barra segmentada compacta,
  agrupados por jogadores/monstros. A barra abre a experiência **PopupVida** já
  existente em `pages/components/components_InformacoesPersonagem/ModalVida.tsx`.
  A apresentação foi exportada por props, mantendo o wrapper/contexto da ficha do
  jogador. A modal usa o nome da instância, slider, dano, cura e Restaurar Vida.
  Restaurar/slider são rascunhos: somente Confirmar persiste; Cancelar descarta.
  Ações de nome/máximo, ficha original, duplicação e remoção ficam em Detalhes.
  Erro de salvamento mantém aviso e impede reaplicar dano acidentalmente.
- Os quadros de fichas exibem miniaturas pequenas em **duas colunas**, com nomes
  discretos truncados. Um botão acessível cobre somente o conteúdo e abre
  `ColecaoFichas`, com imagens maiores, resumo, PV de referência e administração.
  Consulta reutiliza `VisualizadorFicha`; o diálogo da coleção é substituído pelo
  diálogo selecionado, sem empilhar focus traps. Header, handle, X e resize do
  grid conservam seus eventos. Não há botões de inclusão duplicados nos quadros.
- Roteiros são linhas de ícone/título/lixeira, com título truncado, abertura do
  editor existente e exclusão confirmada sem propagar clique para o editor.
- Menu ampliado para até 340px, limitado à viewport, com fundo neutro e hover/foco.
  A importação usa rodapé Cancelar/Incluir lado a lado. JSON mostra somente arquivo
  e campos de revisão, preservando o visualizador completo depois de importar.

### Reconhecimento por formato

JSON usa campos estruturados, nunca OCR. A investigação encontrou a causa de um
caso real: `vidaTotal` é nulo quando a ficha usa o máximo calculado pelo site.
Agora o importador reutiliza **selecionarVida**, sem hidratar classes ou gravar no
localStorage, quando há Constituição válida, nível 1–20 e dado de vida salvo para
todos os níveis. Máximo explícito tem prioridade; snapshots incompletos continuam
com aviso e zero. A edição ausente no legado usa DND_2014. Testes utilizam exportações
reais de `Ficha` 2014/2024 e o corpo legado, incluindo Paladino2/CON15 com 20 PV.
Não existe retrato formal no JSON exportado: nenhum alias/URL desconhecido é tratado
como imagem; há upload separado e a correção de retratos de fichas antigas.

PDF textual usa `pdfjs-dist` existente, preservando coordenadas dos fragmentos.
`reconhecimento.ts` agrupa linhas e procura rótulos/valores próximos, inclusive
valor acima do rótulo, sem depender da ordem do stream. Reconhece HP, PV, Hit Points,
Pontos de Vida, Totais/Máximos/Max HP e Atuais/Current HP. Ignora temporários,
frações, decimais, valores incompatíveis e ambiguidades. `HP 66 (12d8 + 12)` resulta
em 66, sem interpretar os dados de vida. Nome vem de rótulo explícito, cabeçalho
acima de Nome do Personagem ou título superior de bloco de monstro.

Imagens e PDFs digitalizados usam **tesseract.js 7.0.0** com modelos por+eng locais.
`ocr.ts`/`ocrMotor.ts` são importados sob demanda, somente durante importação.
TSV conserva coordenadas e confiança; uma linha com palavras abaixo de 65 é recusada
inteira, para não perder um qualificador como “temporários”. Há progresso, parada
manual, timeout de 90s, liberação de worker/URLs/canvas e preenchimento manual em
falhas. Imagens são reduzidas a 2200px no maior lado e recusadas acima de 80MP;
PDFs digitalizados rasterizam a primeira página. PDFs textuais consultam até três
páginas. OCR não roda na consulta nem em cada renderização. Campos já corrigidos
manualmente não são sobrescritos quando o reconhecimento termina.

### Retratos e fichas antigas

`RecortarRetrato` permite selecionar uma área por arraste ou campos percentuais,
com alternativa acessível por teclado nos campos. PDFs permitem escolher página.
Uma heurística conservadora sugere apenas regiões grandes, coloridas e isoladas
da página rasterizada; múltiplas regiões semelhantes, decoração pequena ou ausência
de evidência ficam para seleção manual. A sugestão é revisável e não é aplicada
automaticamente como retrato. Não há extração arbitrária de objetos internos PDF.

Ao usar o recorte, `retratos.ts` gera PNG separado, proporcional, de até 1024px no
maior lado; a prévia pode ser revisada antes de Incluir/Salvar. O original permanece
intacto. O novo Blob usa o vínculo `imagemAnexoId` já existente e é compartilhado
pelas instâncias. `EditarFichaImportada` completa nomes, PV de referência e retratos
antigos, preservando nomes/PV das instâncias já ajustadas pelo mestre. Não executa
nova extração automaticamente sobre fichas existentes.

### Assets, persistência e testes

Novas dependências: tesseract.js 7.0.0 e @tesseract.js-data/eng e /por 1.0.0.
O core WASM vem da dependência do Tesseract. `scripts/prepare-ocr.cjs` copia worker,
três kernels LSTM e idiomas para `public/ocr` antes de start/build. Esse diretório
é gerado e ignorado pelo Git; não é necessário versionar 16,2MB de binários.
Os assets são servidos pelo próprio site e baixados somente quando necessários;
não são parte do JS inicial e nenhum documento é enviado a serviços externos.
Não é criado um cache IndexedDB adicional pelo Tesseract (`cacheMethod: none`).
O build exclui essas distribuições da ofuscação; `build:verify` confere os bytes
de worker/kernels/idiomas na saída final para evitar assets ausentes ou alterados.

Banco permanece v2, schema v1 e backup v2 com leitor v1/v2. Nenhuma migração ou
recriação foi necessária: retratos usam os anexos existentes. Backup, roteiros,
layout e revisão concorrente conservam seus contratos e testes de regressão.

Arquivos principais: `ui/AreaMestreWorkspace.tsx`, `ui/CardFicha.tsx`, novos
`ui/ColecaoFichas.tsx`, `ui/EditarFichaImportada.tsx`, `ui/RecortarRetrato.tsx`,
`ui/ImportarFicha.tsx`, `ui/PainelPV.tsx` e estilos; `importacao.ts`, `pdf.ts`, novos
`reconhecimento.ts`, `ocr.ts`, `ocrMotor.ts`, `retratos.ts`; `ModalVida.tsx`, scripts
de build/start/preparo, package/lock e .gitignore. Testes novos cobrem reconhecimento,
OCR, recorte, edição persistida e coleção; testes de importação/workspace/PV ampliados.

Smoke tests reais em Node/canvas: OCR por+eng reconheceu monstro 66/66 e jogador
7/20 sem confundir temporários, com confiança global 94; geração de recorte produziu
PNG 1024×652 com pixel esperado e original 2200×1400 preservado. Esses testes não
substituem navegador real. O inventário novamente retornou `apps: [], browsers: []`.
Revisão visual pendente em desktop/mobile: downloads locais do OCR/worker, seleção
por pointer, focos entre diálogos, miniaturas, barras, menu e interação com grid.
Layouts complexos, scans ruins, rotação, idiomas diferentes ou retratos sem região
isolada podem exigir ajuste manual; confiança é um filtro, não garantia de acerto.
Nenhum combate/iniciativa/turno da Fase 5 foi implementado. Sem commit/push/reset.

### Validação final da Fase 4.1 — 18/10/2026

- Typecheck e lint aprovados, sem novos avisos.
- Build descartável aprovado, incluindo ofuscação e verificação byte a byte dos
  assets locais de OCR. Saída temporária removida pelo script existente.
- Suíte completa: **66 suítes e 1.562 testes aprovados** em 124,6s, com os timeouts
  padrão. São 42 casos adicionais à Fase 4. Após o ajuste final de tipagem/edição
  legada, os 62 casos direcionados de JSON/reconhecimento/OCR também passaram.
- Cobertura inclui exemplos HP/PV/dados de vida, máximos/atuais/temporários,
  cabeçalhos, OCR posicional/confiança/timeout/cancelamento, JSON real/legado,
  recorte/page selection/limpeza, edição persistida de ficha antiga, coleções,
  roteiro em linhas e fluxo de três instâncias com dano e reabertura do banco.
  Migrações, backup v1/v2, bytes/retratos e grid mouse/resize continuaram aprovados.
- JS inicial continua em **1,38MB gzip** na medição arredondada do CRA. Workspace
  passa de 22,27 para **25,17KB** e CSS de 4,31 para **4,82KB**. OCR e reconhecimento
  ficam em chunks sob demanda; assets locais totalizam **16.170.728 bytes** e não
  são adicionados ao carregamento inicial. Motor PDF permanece 98,53KB gzip separado.
- Diff, textos UTF-8 e espaços revisados; logs temporários removidos. Permanecem
  avisos anteriores de bundle inicial elevado, `act(...)` em testes de fichas e
  depreciação `fs.F_OK` no build. Revisão visual em navegador permanece pendente,
  conforme a limitação documentada acima.

## Fase 4 — importação, consulta e PV independentes

### Fluxo e formatos

Os botões da navegação e dos quadros abrem `ImportarFicha`: seleção, prévia,
revisão do nome/PV, retrato opcional e confirmação. Monstros aceitam PDF, PNG,
JPEG, GIF e WebP; jogadores também aceitam JSON nativo 2014/2024 com envelope
ou legado. Limites permanecem 20MiB por binário e 5MiB por JSON. Extensão, MIME,
assinatura e contratos existentes são conferidos; SVG e coleções JSON são recusados.
Cancelar antes de confirmar não altera a campanha. Não há OCR ou serviços externos.

O importador existente continua preservando os bytes originais. Agora também usa
`Blob.text/arrayBuffer` quando disponíveis, mantendo fallback FileReader e erros
normalizados. JSON é validado sem hidratar `Ficha`, recalcular valores ou escrever
no localStorage. Nome, edição e PV vêm do contrato real; classe, nível e raça são
lidos sob demanda para os cards e o visualizador. O contrato exportado não possui
campo oficial de retrato: campos desconhecidos e URLs externas não são interpretados
como imagens. Pode-se fornecer um retrato separado, armazenado como Blob local.

Imagens usam o próprio anexo como miniatura. PDFs consultam somente a camada de
texto das cinco primeiras páginas (até 100 mil caracteres por página), buscando
um único rótulo explícito de nome e PV. Valores ambíguos, fracionários ou ausentes
exigem preenchimento manual; PV desconhecidos começam em 0 com aviso. Não há
extração confiável de ilustrações nesta implementação: o PDF usa um placeholder
de documento até o mestre fornecer um retrato separado. O original não é alterado.

`incorporarImportacao` reúne ficha, anexos e instância inicial no mesmo agregado
validado; `useCampanhas` o grava na transação já existente. Não há gravação parcial
por anexo. IDs estáveis permitem repetir a confirmação após falha sem duplicar
ficha/instância; o arquivo fica bloqueado nessa situação. Edições locais completas
ficam pendentes se houver quota/conflito, com erro e proteção de saída existentes.

### Quadros e visualizadores

Cards responsivos abrem o original, mostram formato/edição/resumo/quantidade de
instâncias e oferecem exclusão confirmada e outra instância de monstro. A exclusão
é recusada enquanto existirem instâncias. Anexos são preservados, inclusive quando
compartilhados. Remover instância também é explícito e recusa referências de combate.
O layout aprovado, as laterais redimensionáveis, os roteiros e o scroll interno
foram mantidos; a marca continua laranja e o workspace limitado à viewport.

`VisualizadorFicha` abre uma modal ampla. `VisualizadorDocumento` oferece PDF em
canvas com páginas, encaixe/zoom, carregamento e erros; imagens proporcionais com
zoom; JSON estruturado somente leitura com os campos efetivamente presentes.
PV históricos do JSON são distinguidos dos PV das instâncias. Retratos separados
também aparecem na consulta. Todos oferecem abertura/download do original.
Object URLs são revogadas; renders são cancelados, canvas zerado e documentos PDF
destruídos no descarte. Salvar PV não reinicia o PDF aberto. O canvas limita cada
render a 16 milhões de pixels e 8192 pixels por lado.

Nova dependência: **pdfjs-dist 4.10.38**, necessária para renderizar páginas e ler
texto (pdf-lib existente não renderiza). O motor e seu worker ficam em imports
dinâmicos/asset separado; não usam CDN. `isEvalSupported: false` e XFA desativado;
não são executadas ações/scripts de documentos. A interface não interpreta HTML
externo. O wrapper `pdf.ts` não carrega o motor antes de abrir um PDF.

### Instâncias, PV e recuperação

Importar cria uma primeira instância. Novas ocorrências recebem nomes numerados;
duplicar monstro copia seus PV atuais para um objeto independente. Todas referenciam
o mesmo original/retrato, sem replicar os arquivos. Renomear, ajustar PV e remover
instâncias estão no painel direito, agrupado por jogadores/monstros.

Dano para em zero; cura para no máximo. Ajuste manual exige inteiros seguros,
não negativos e campos preenchidos; reduzir o máximo limita os atuais ao novo
máximo, com a regra explicada na modal. Máximo zero indica PV indefinidos, sem
estado de derrota. Barra, texto e cores distinguem completos/ferido/zero/indefinido.
As alterações atualizam a tela imediatamente e confirmam o salvamento pela fila
de revisão existente, que relê `obter` após cada commit. Erros preservam a edição;
o aviso orienta repetir o salvamento, sem reaplicar dano/cura. Conflitos continuam
exigindo recarga explícita, sem merge ou perda silenciosa.

O menu e o gerenciador permitem restaurar um ZIP como nova campanha; o menu da
campanha permite gerar/baixar seu backup. São os serviços da Fase 2, sem outra
persistência. **Banco continua v2, schema de domínio v1 e backup v2, com leitor
v1/v2**. Nenhum campo/store ou migração foi necessário. Listar campanhas continua
lendo apenas metadados. Os testes verificam arquivos, retratos, instâncias, PV,
roteiros e layout após restauração e reabertura.

### Arquivos desta etapa

- Importação: `importacao.ts`, novos `importacaoVisual.ts`, `fichasCampanha.ts`,
  `ui/ImportarFicha.tsx` e `ui/importarFicha.css`.
- Consulta: novos `pdf.ts`, `pdfMotor.ts`, `pdfjs.d.ts`, `leituraFichaJson.ts`,
  `ui/CardFicha.tsx`, `ui/VisualizadorFicha.tsx`, `ui/VisualizadorDocumento.tsx`
  e `ui/visualizadorFicha.css`.
- Instâncias: novos `instancias.ts`, `ui/PainelPV.tsx`, `ui/painelPV.css`.
- Integração: `ui/AreaMestreWorkspace.tsx`, `ui/areaMestreWorkspace.css`,
  `useCampanhas.ts`, novo `ui/BackupCampanha.tsx`, package/lock e este README.
- Testes novos: `importacaoVisual.test.ts`, `instancias.test.ts`,
  `instanciasPersistencia.test.ts`, `roundTripImportacao.test.ts`,
  `ui/ImportarFicha.test.tsx`, `ui/VisualizadorFicha.test.tsx`,
  `ui/PainelPV.test.tsx`, `ui/BackupCampanha.test.tsx`; integração existente do
  workspace ampliada com upload real, três instâncias, dano, consulta,
  exclusão protegida e recuperação após remontar.

### Limitações e próxima fase

Inventário de controle de navegador nesta sessão: `apps: [], browsers: []`.
Não foi possível validar visualmente upload, worker PDF, responsividade ou reload
em navegador real. Testes DOM/IndexedDB e o build não substituem essa revisão.
Também foi exercitado o motor PDF real em Node/canvas: duas páginas renderizadas
e texto extraído de um PDF gerado, com fontes padrão locais para o ambiente Node.
O aviso do motor recomenda seu build legacy em Node; produção usa o build browser.
PDFs corrompidos/protegidos mostram erro e acesso ao original; não há fluxo de senha.
Imagens digitalizadas exigem nome/PV manuais; retrato de PDF é selecionado à parte.

Preparação de combate, participantes, iniciativa, rodadas, turnos e encerramento
continuam pendentes para a Fase 5 e seguintes. Nenhum desses fluxos foi antecipado.
Alterações anteriores preservadas; nenhum commit, push ou reset realizado.

### Validação final da Fase 4 — 17/10/2026

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, sem novos avisos.
- `npm run build:verify`: aprovado, incluindo ofuscação e descarte da saída temporária.
- Suíte completa com timeout padrão: **60 suítes e 1.520 testes aprovados**
  (108,9s). São 47 casos a mais que a Fase 3.1, incluindo o round-trip exigido.
- Uma execução concorrente com o build teve uma falha transitória na espera pela
  importação lazy de `/mestre`. A suíte de navegação passou isolada (8 testes) e
  a suíte completa passou novamente em execução serial, sem alterar timeouts.
- JS inicial permanece **1,38MB gzip** (arredondamento CRA); workspace passa de
  13,54 para **22,27KB**, CSS para aproximadamente **4,3KB**. Motor PDF separado:
  **98,53KB gzip**, worker de aproximadamente **1,38MB bruto** como asset separado.
  Backup também é carregado sob demanda. Nenhum motor PDF no JS inicial.
- Permanecem avisos anteriores de bundle inicial elevado, `act(...)` em testes
  de fichas e depreciação `fs.F_OK` na ferramenta de build. Diff e espaços revisados.
- Não houve validação em navegador real, conforme a limitação registrada acima.

## Escopo e integração originais — Fase 1

Fundação isolada em TypeScript estrito. Nenhuma alteração nas rotas, no contexto
das fichas, no localStorage ou na interface de `src/pages/AreaMestre.jsx`.
A tela existente é um workspace vazio com gerenciador inicial de campanhas;
`AccessibleDialog`, os estilos de áreas e o roteamento poderão ser reutilizados.
O projeto usa React 18, CRA/react-scripts, React Router, Jest e Testing Library.
Não foram adicionadas dependências.

Branch verificada: `feature/area-do-mestre`, HEAD inicial `c9e38f6`
(`feat: area do mestre inicial`), árvore de trabalho inicialmente limpa.
As análises de domínio/importação e persistência foram feitas em paralelo por
subagentes, com responsabilidade exclusiva sobre seus respectivos testes.

Arquivos criados nesta fase:

| Arquivo | Responsabilidade |
| --- | --- |
| `modelos.ts` | DTOs e relações do domínio |
| `dominio.ts` | Erros, validação de PV/IDs e criação de instâncias independentes |
| `importacao.ts` | Preparação de anexos e leitura validada de metadados JSON |
| `contratos.ts` | Contrato do futuro repositório e códigos de falha de persistência |
| `dominio.test.ts` | 22 casos de domínio e isolamento |
| `importacao.test.ts` | 35 casos de compatibilidade e importação |
| `README.md` | Decisões, limites e plano da próxima fase |

Nenhum arquivo preexistente foi alterado; nenhum commit ou push foi realizado.

## Verificação em 17/10/2026

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado após corrigir uma asserção condicional em teste novo.
- `npm run build:verify`: aprovado, incluindo ofuscação, usando saída temporária.
- Novas suítes: 57 testes aprovados (35 de importação + 22 de domínio).
- Suíte completa (`CI=true npm test -- --watchAll=false --runInBand`):
  39 suítes aprovadas de 40; 1.343 testes aprovados de 1.345. Dois casos
  preexistentes de navegação em 390/1280 px excederam o timeout padrão de 5 s.
- Repetição direcionada de `navegacaoAreas.test.js` e `dominio.test.ts` com
  `--testTimeout=30000`: 2 suítes e 30 testes aprovados. O limite não foi
  alterado permanentemente no projeto.
- Revisão final: apenas os sete arquivos novos deste módulo; sem mudanças no
  funcionamento das fichas e sem alterações de dependências.

Problemas observados: timeout de navegação descrito acima, avisos `act(...)` em
testes existentes de persistência, aviso de bundle elevado do CRA e depreciação
`fs.F_OK` na ferramenta de build. Não houve validação visual, pois a interface
não foi alterada. IndexedDB, backups, OCR, visualizadores e fluxos de combate
permanecem pendentes para as fases respectivas.

## Relações e propriedade dos dados

- Campanha possui roteiro, datas ISO e versão de schema do domínio.
- Anexo pertence à campanha e conserva o `File`/`Blob` original, nome, MIME e tamanho.
- Ficha original referencia o anexo e guarda metadados de consulta, avisos e PV iniciais.
- Instância referencia a ficha original e possui seu próprio nome e PV. `null` na
  referência reserva avulsos/minions. `criarInstancia` copia os PV, sem duplicar o arquivo.
- Participante referencia uma instância e um combate, com iniciativa, ordem e
  snapshot independente dos PV iniciais. A ordem resolve empates deterministicamente.
- Combate guarda o ID do participante ativo, evitando depender de índice ao reordenar.
- Layout pertence à campanha e guarda coordenadas de grid, dimensões e visibilidade.

Os contratos de combate/layout não executam regras ou fluxos futuros. Ao implementar
essas fases, validar IDs únicos, referências na mesma campanha, mínimo de dois
participantes, snapshot por cópia e exclusividade de instância entre combates ativos.
O snapshot deve ser capturado na confirmação, e não ao abrir a preparação.

Objetos são DTOs compatíveis com structured clone; não armazenar classes `Ficha`,
proxies, métodos ou object URLs. O módulo não cria URLs temporárias. Futuramente,
os visualizadores devem revogá-las ao trocar de anexo/desmontar.
Os IDs e a data de importação são fornecidos pelo chamador para permitir testes
determinísticos; a futura camada transacional deverá rejeitar colisões.

## Importação implementada

`prepararImportacao(File, contexto)` retorna ficha + anexo sem efeitos de persistência.
Erros possuem códigos estáveis em `ErroAreaMestre`. A importação não chama
`parseImport`, pois esse método hidrata classes e executa migrações das fichas.
Reutiliza `parseJSON` e `validateFicha` para manter a compatibilidade existente.

Formato atual real: `{format: "minhafichadnd", version: 1, kind: "ficha", data: {...}}`.
Também são aceitos documentos legados sem envelope. Coleções, versões desconhecidas,
campos conhecidos inválidos, chaves perigosas e JSON malformado são rejeitados.
Campos desconhecidos permanecem no arquivo original sem serem copiados para o DTO.
Ausência da edição em documento legado significa DND_2014, conforme o modelo atual.
Fichas incompletas com nome nulo são válidas: o nome do arquivo é a representação
provisória e um aviso indica a ausência do nome do personagem.

Metadados confirmados vêm de `nomePersonagem`, `vidaTotal`, `vidaAtual` e
`versaoRegras`. Não há campo formal de retrato no modelo atual; nenhum campo
desconhecido é interpretado como imagem. Imagens importadas referenciam seu próprio
anexo como retrato. Não se infere PV por atributos, classes ou texto incerto.
PV exigem inteiros seguros não negativos. Máximo ausente/inválido resulta em 0/0;
atual ausente/inconsistente resulta em atual 0, preservando máximo válido. Ambos
os casos incluem aviso para definição manual. Zero explícito é um valor válido.

Jogadores aceitam JSON (até 5 MiB, limite já existente), PDF e imagens; monstros
aceitam PDF e imagens. Formatos de imagem iniciais: PNG, JPEG, GIF e WebP.
SVG não é aceito. Limite inicial conservador para binários: 20 MiB por arquivo.
MIME vazio ou genérico é aceito quando extensão e assinatura binária correspondem;
MIME específico divergente é rejeitado. A assinatura verifica o tipo, não garante
que o documento completo possa ser decodificado. O visualizador futuro deverá
tratar arquivos truncados/corrompidos e PDFs protegidos sem perder o original.
Não há extração de texto/OCR nesta fase: PDF/imagem mantêm o original e recebem
PV 0/0 e avisos de preenchimento manual. `pdf-lib` já instalado não é um motor OCR.

## Plano registrado na Fase 1

O plano abaixo foi implementado na Fase 2, conforme detalhado na seção seguinte.

Implementar `RepositorioCampanhas` com IndexedDB nativo, banco exclusivo da Área
do Mestre e stores para campanhas, anexos, fichas, instâncias, combates,
participantes e layout. Índices por campanha e referências; anexos em Blob, sem
base64. Salvar/excluir o agregado atomicamente. Não migrar o localStorage existente
(`fichas`, backups, recuperação e seleção legada), que permanece sob `FichaContext`.

Versão do banco, schema do domínio e versão de backup serão independentes.
Migrações sequenciais em `onupgradeneeded` devem abortar em falhas; versões futuras
desconhecidas devem ser recusadas. Tratar bloqueios, `versionchange`, indisponibilidade,
cota e abortos com os códigos de persistência definidos no contrato.

Backup completo: manifesto versionado e arquivos binários (contêiner a decidir na
Fase 2). Verificar IDs únicos, tamanho, checksums, referências e versão antes de
qualquer escrita; restauração em transação única. Política de cópia deve remapear
todos os IDs/referências; substituir exige escolha explícita. Nunca sobrescrever
silenciosamente anexos em colisão. Incluir todos os anexos referenciados, inclusive
retratos, sem object URLs.

Testar abertura/migração, quota, bloqueio entre abas, rollback, colisões, anexos
ausentes/corrompidos, backup completo e recuperação após fechar/reabrir. Depois
disso, conectar à interface nas fases autorizadas pelo usuário.

## Fase 2 — persistência e backup

Implementação independente de React, sem alterar páginas, rotas, fichas 2014/2024
ou `localStorage`. A Fase 1 estava não commitada no início desta etapa e foi
preservada. Não houve commit/push. Apenas `modelos.ts` (revisão opcional),
`contratos.ts` e este documento foram ajustados na fundação anterior.

### Banco e índices

IndexedDB nativo, banco exclusivo `minhafichadnd-area-mestre`, versão inicial **1**.
Os Blobs ficam separados dos metadados. Não há cópias binárias por instância.

| Store | Chave | Índices não exclusivos |
| --- | --- | --- |
| `campanhas` | `id` | nenhum; listagem carrega apenas metadados |
| `anexos` | `id` | `campanhaId` |
| `arquivos` | `id` (igual ao anexo) | `campanhaId` |
| `fichas` | `id` | `campanhaId`, `anexoId`, `imagemAnexoId` |
| `instancias` | `id` | `campanhaId`, `fichaOriginalId` |
| `combates` | `id` | `campanhaId` |
| `participantes` | `id` | `campanhaId`, `combateId`, `instanciaId` |
| `layouts` | `campanhaId` | nenhum |

`participantes.campanhaId` é um campo interno para consulta/exclusão em cascata;
é removido ao reconstruir o DTO público. IDs são únicos por store, inclusive entre
campanhas. Painéis têm IDs únicos dentro do layout, não uma store própria.

### Contratos públicos e uso

`criarRepositorioCampanhas(opcoes?)` retorna `RepositorioCampanhasIndexedDB`.
Opções permitem injetar fábrica IndexedDB/nome do banco para testes.

- `listar(): Promise<Campanha[]>`: não carrega anexos/binários.
- `obter(id): Promise<DadosCampanha | null>`: lê o agregado em uma transação
  consistente e valida os relacionamentos; campanha removida retorna `null`.
- `criar(dados): Promise<void>`: exclusivo, nunca substitui IDs existentes.
- `salvar(dados): Promise<void>`: substitui atomicamente o agregado existente,
  exigindo a revisão obtida na última leitura.
- `excluir(id): Promise<void>`: exclui campanha e todos os seus registros na mesma
  transação. Campanha inexistente gera `nao-encontrado`.
- `excluirFicha(campanhaId, fichaId)`: rejeita ficha com instâncias dependentes;
  preserva anexos para eventual uso compartilhado.
- `excluirAnexo(campanhaId, anexoId)`: rejeita anexo referenciado como documento
  ou retrato. Remoção de anexos sem uso é explícita.
- `fechar(): void`: fecha conexão e libera caches fracos; o próximo acesso reabre.

```ts
const repo = criarRepositorioCampanhas();
await repo.criar(dadosNovos);
const dados = await repo.obter(dadosNovos.campanha.id);
if (dados) {
  dados.campanha.roteiro = 'Próxima cena';
  await repo.salvar(dados);
}
repo.fechar();
```

`Campanha.revisao` é opcional apenas para representar novos dados da Fase 1.
O repositório atribui revisão **1** na criação e incrementa ao salvar. O DTO do
chamador não é alterado: **depois de criar, salvar ou restaurar, use `obter` antes
da próxima edição**. Uma revisão obsoleta ou ausente no update gera `conflito`,
inclusive entre abas. Isso evita a perda silenciosa de alterações concorrentes;
não há merge automático. `excluir` é uma remoção explícita, sem revisão esperada.

Cada gravação captura um snapshot dos metadados antes do primeiro `await`,
valida tudo e usa uma transação `readwrite` abrangendo as stores relacionadas.
Falha/abort/quota reverte toda a escrita. Remover registros do agregado também
é validado: não se pode deixar referências pendentes. O cliente pode remover
dependências juntas numa única chamada a `salvar`. Blobs imutáveis recuperados
na mesma revisão não são regravados ao mudar apenas PV ou roteiro; um `WeakMap`
evita reter arquivos grandes indefinidamente. Metadados pequenos são regravados.

`validarDadosCampanha(unknown)` valida tipos, schema, IDs únicos, PV, datas,
MIMEs/tamanhos, referências da mesma campanha, retratos, vínculo de participante,
ordem única, participante ativo e exclusividade de instância em encontros ativos.
Aceita campanhas vazias e avulsos com `fichaOriginalId: null`. Combates persistidos
precisam ter pelo menos dois participantes; rascunhos de preparação não pertencem
ao agregado persistido. Não implementa rolagens, turnos ou interface de combate.

`ErroPersistencia` fornece códigos estáveis: `indisponivel`, `bloqueado`,
`cota-excedida`, `transacao-falhou`, `dados-corrompidos`, `conflito`,
`nao-encontrado`, `versao-incompativel`, `migracao-falhou`, `backup-invalido`,
`backup-incompativel`, `arquivo-grande`. Não há limpeza automática de dados.

### Migrações

`VERSAO_BANCO_MESTRE` e `MIGRACOES_MESTRE` em `persistencia.ts` são independentes
de `VERSAO_SCHEMA_MESTRE` (domínio) e `VERSAO_BACKUP_MESTRE` (arquivo).
Para evoluir: incrementar a versão do banco e adicionar a função da nova versão
ao mapa. Aplicam-se, em ordem, todas as versões entre `oldVersion + 1` e a nova.
Não remover/recriar stores com dados como estratégia de upgrade.

Migrações devem agendar requests na transação `versionchange`, sem `await` de
rede/temporizador. Para migrar registros, usar cursor/requests da própria transação.
Exceção, request falho ou migração ausente aborta o upgrade e conserva a versão
anterior. Testes simulam upgrade para uma store adicional e rollback de falha;
nenhuma migração fictícia de produto foi acrescentada à versão 1.

`onversionchange` fecha conexões antigas; abertura bloqueada retorna erro claro
e o pedido pendente não executa upgrade tardio após ser rejeitado. Banco de
versão superior à suportada gera `versao-incompativel`. Não há downgrade automático.

### ZIP e restauração

`exportarBackup(dados): Promise<Blob>` exporta um snapshot completo em ZIP.
`lerBackup(blob): Promise<DadosCampanha>` valida o arquivo sem gravar.
`restaurarBackup(blob, repositorio, gerarId?): Promise<DadosCampanha>` valida,
remapeia **todos** os IDs internos (inclusive painéis e referências de retrato) e
invoca `criar` uma única vez. Sempre importa como nova campanha; nunca substitui.
O ID de origem registrado em `origemJson.id` continua sendo proveniência do
documento externo e não é remapeado. Os bytes do JSON original também não mudam.
Colisões do gerador ou com registros existentes geram erro e rollback, sem retry
silencioso. O retorno representa os dados submetidos, com revisão 0; reler com
`obter` para receber a revisão 1 persistida antes de editar.

Estrutura do arquivo:

```text
manifesto.json
anexos/0.bin
anexos/1.bin
...
```

Manifesto: `{ formato: "MinhaFichaDnd/areaMestre", versao: 1, dados: {...} }`.
`dados` contém o agregado completo; cada anexo troca `arquivo` por `caminho`,
`sha256` e `tipoBinario`. Nome, MIME canônico, tamanho e vínculos são preservados.
`tipoBinario` conserva `Blob.type`, mesmo vazio/genérico. Bytes são preservados
integralmente. Metadados exclusivos do filesystem, como `File.lastModified`, não
fazem parte do modelo; ao restaurar, o documento é um Blob com nome no registro.

Todas as entradas têm CRC32, incluindo manifesto; anexos também têm SHA-256 via
WebCrypto (HTTPS/localhost). Os hashes detectam corrupção, não autenticam autoria.
Verificam-se tamanho, entradas ausentes/extras/duplicadas, cabeçalhos ZIP e todas
as entidades/referências antes de abrir uma transação de restauração.

Limites iniciais: ZIP até **64 MiB**, conteúdo descompactado até **128 MiB**,
manifesto até **4 MiB**, até **2.048 entradas**, binário até **20 MiB** e JSON
até **5 MiB**. Cada coleção tem até 4.096 registros. Limites são conservadores:
arquivos ficam em memória durante backup, sem streaming de gravação em disco.
Um agregado maior que o limite exportável é recusado explicitamente, nunca
exportado parcialmente. Quota do navegador continua sendo variável.

Exportação usa ZIP armazenado (`level: 0`): imagens/PDFs já comprimidos têm ganho
limitado e isso evita custo de compressão. Leitura aceita store/deflate, com
pré-validação de tamanhos e descompressão incremental limitada mesmo se o
cabeçalho mentir. O formato próprio rejeita ZIP64, comentários, campos extras,
data descriptors, criptografia, multipartes e caminhos arbitrários. Não pretende
ser um importador de qualquer ZIP editado por terceiros.

### Dependências, arquivos e testes

`fflate` 0.8.2 é a única dependência de produção adicionada: ZIP pequeno, sem
dependências transitivas, importado dinamicamente dentro dos serviços. IndexedDB
usa a API nativa; uma biblioteca adicional não traria benefício suficiente para
o repositório transacional atual. `fake-indexeddb` 6.2.4 é exclusivamente de teste.
Não foram ligados serviços de backup ao bundle inicial ou a novas telas.

Novos arquivos: `persistencia.ts`, `backup.ts`, `validacao.ts`, `erros.ts`,
`persistencia.test.ts`, `backup.test.ts`, `validacao.test.ts`, `roundTrip.test.ts`
e `ambienteIndexedDB.testUtils.ts`. Este último adapta apenas os testes Node às
primitivas Blob/DOMException/structuredClone ausentes no sandbox do Jest 27.
`package.json` e lockfile registram somente as duas dependências novas.

Testes cobrem CRUD, reabertura da conexão, bytes PDF/imagem/JSON, isolamento de
PV, metadados sem arquivos na listagem, relações, concorrência/revisões,
colisões, exclusão protegida e em cascata, upgrade, rollback de migração,
bloqueio de abertura, falhas de quota, ZIP corrompido, CRC/hash, ZIP bomb,
anexo ausente, schema inválido e snapshots diante de mutações concorrentes.
O round-trip usa o repositório real sobre fake-indexeddb, fecha/reabre a conexão,
restaura outra campanha e compara conteúdo, bytes, roteiro, layout, iniciativas,
snapshots e PV; também verifica rollback após falhar o segundo Blob e retry.

Persistência em navegador real após encerrar/reabrir o processo não foi testada
manualmente nesta etapa; reabertura automatizada conserva a mesma fábrica de
IndexedDB. A Fase 3 deverá integrar os serviços à tela existente e validar os
fluxos em desktop/mobile, feedback de erros, recuperação de conflitos entre abas,
download/upload, permissões e recursos temporários dos visualizadores futuros.

### Resultado da validação final da Fase 2 — 17/10/2026

- `npm run typecheck`: aprovado após todas as alterações de produção.
- `npm run lint`: aprovado; os últimos ajustes de backup também tiveram lint
  direcionado aprovado pelo responsável pelo módulo.
- `npm run build:verify`: aprovado, incluindo ofuscação e limpeza da saída
  temporária. Hash do bundle inicial `main.cd8485fa.js` e tamanhos iguais aos da
  Fase 1, pois os serviços ainda não são importados pelas páginas.
- `CI=true npm test -- --watchAll=false --runInBand`: **44 suítes, 1.430 testes
  aprovados**, timeout padrão, em aproximadamente 104 s. Os dois timeouts antigos
  de navegação não se repetiram. Não foi necessário aumentar timeout.
- **85 testes novos**: persistência 19, backup 22, validação/erros 39 e integração
  round-trip 5. Os 57 testes da Fase 1 continuam aprovados.
- Permanecem avisos existentes de `act(...)` nos testes de persistência das
  fichas, bundle elevado do CRA e depreciação `fs.F_OK` da ferramenta de build.
- Revisão do diff: alterações rastreadas restritas a package/lockfile, com
  preservação da pasta não commitada da Fase 1. Nenhuma alteração de UI,
  localStorage ou regras; nenhum commit/push. Cache temporário do npm removido.

Limitações deliberadas: testes usam fake-indexeddb; exigem Node >=18 e primitivas
Node de structured clone. Backup em memória com limites explícitos, WebCrypto
em contexto seguro e metadados do filesystem fora do DTO. A persistência durável
depende das políticas do navegador (limpeza de dados do site também remove o
banco), por isso backups portáveis continuam necessários.

A Fase 2 termina aqui. Fase 3 (interface, sidebar, quadros/grid e integração dos
serviços) depende de autorização; nenhuma implementação visual foi antecipada.

## Fase 3 — workspace conectado às campanhas

### Escopo entregue

A rota `/mestre` existente passa a usar os serviços IndexedDB da Fase 2. Sua
página continua responsável por navegação e pelo guard de salvamento das fichas
do jogador, sem modificar `FichaContext`, regras 2014/2024 ou localStorage.
O workspace mantém as cores escuras, laranja, bordas e tipografia das áreas
existentes, reutilizando `AccessibleDialog`, `Areas.css`, Router, React e Jest.

- Gerenciador com listagem de campanhas reais, criação por nome e seleção.
- Cabeçalho com nome, edição dos metadados básicos, navegação entre campanhas,
  menu hambúrguer e configurações.
- Sidebar com ícones/descrições, estado recolhido persistido e ações futuras
  explicitamente desabilitadas. No mobile vira uma barra de ações que pode ser
  recolhida em uma faixa de ícones, sem sobrepor os quadros.
- Quadros centrais para monstros, jogadores e roteiro, com expansão/recolhimento,
  scroll próprio, ocultação sem excluir conteúdo e restauração nas configurações.
- Registros existentes são lidos dos DTOs: nome, formato, edição do JSON e número
  de instâncias. Imagens/retratos disponíveis viram miniaturas; PDF/JSON sem
  retrato usam representação genérica. Nenhum dado de exemplo é inserido.
- Roteiro editável, recuperado por campanha e salvo automaticamente.
- Região direita reservada para PV no desktop; migra para baixo no tablet/mobile.
  Não há controles funcionais de vida, combate, iniciativa ou novos importadores.

Criar uma campanha gera layout padrão e agregado vazio válido, chama `criar` e
reconsulta `obter`. Não são alteradas as versões de banco, domínio ou backup:
os modelos já contêm todos os dados utilizados nesta fase.

### Grid e acessibilidade

Dependência de produção adicionada: **react-grid-layout 2.3.0**, com tipos próprios.
Foi escolhida por reunir arraste, resize, compactação e tratamento de colisões,
compatíveis com React/CRA; assim não há motor de colisões artesanal. A API nova
usa `GridLayout`, `useContainerWidth` e `verticalCompactor`.
Referência: [documentação oficial](https://github.com/react-grid-layout/react-grid-layout).

Desktop: viewport a partir de 1.200 px e área central a partir de 600 px usa
12 colunas. Tablet deriva 6 colunas; mobile abaixo de 600 px empilha os quadros.
Arraste/resize são habilitados no modo de edição do desktop; tablet/mobile
oferecem botões de organização. A largura real é medida pelo container, e não
presumida pelo tamanho da janela. Nenhuma mudança de breakpoint dispara escrita.

O padrão usa três quadros com largura 4 e altura 10, em unidades de grid;
altura de linha 34 px e espaçamento 12 px. Largura mínima 3, altura expandida
entre 3 e 20, altura visual recolhida 2, com limite de 60 linhas. Ao recolher,
a altura expandida é mantida para a próxima abertura. `bounded` restringe o gesto
ao container; a biblioteca trata colisões/compactação e as gravações rejeitam
posições além do limite vertical. O workspace tem scroll para posições inferiores.

Um handle dedicado no cabeçalho inicia o arraste. Botões, campos, links e texto
editável não iniciam gestos. As mudanças de posição/dimensão chegam ao hook apenas
no fim do gesto; não há autosave a cada movimento do ponteiro ou na montagem.
Controles de organização ficam fora dos quadros para não obstruir o modo compacto.

Alternativa por teclado/toque: ativar “Editar posições e dimensões dos quadros”
nas configurações e fechar a janela. Botões permitem mover para cima/baixo e
alternar largura/altura, com limites e compactação. Essa mudança é uma escolha
explícita sobre o layout canônico, mesmo no mobile; posições apenas derivadas
do breakpoint nunca substituem o desktop. Restaurar padrão também é persistido.

`completarLayout` adapta layouts vazios legados, preserva IDs/painéis existentes
e acrescenta tipos principais ausentes sem colidir identificadores. Coordenadas
antigas claramente em pixels recebem posições padrão na representação do grid.
A leitura não grava essa adaptação; a próxima edição salva o layout exibido.

Botões têm nomes acessíveis, expansão usa `aria-expanded`, foco visível, feedback
usa `status`/`alert` e diálogos reutilizam trap/restauração de foco. Escape fecha
menus/diálogos. Ocultar um quadro move foco para configurações; adicionar roteiro
restaura/expande o quadro e foca seu campo. Carregamento bloqueia edições do
workspace anterior durante a seleção. Miniaturas revogam object URLs na troca
ou desmontagem e oferecem fallback em erro de imagem.

### Autosave, erros e concorrência

`useCampanhas` centraliza a integração com `RepositorioCampanhas`. Pode receber
um repositório injetado para testes; em produção cria/fecha a própria conexão.
Expõe campanhas, dados, carregamento, salvamento, pendências, erro e conflito,
além de criar, selecionar, atualizar, salvar agora, recarregar e listar.

Edições ficam imediatamente no estado React e usam debounce de **600 ms**.
Uma fila única serializa as gravações. Cada commit é seguido de `obter`, que
fornece a revisão atual. Edições realizadas durante uma gravação permanecem
locais e são salvas na próxima passagem da fila, sem serem substituídas pelo
resultado antigo. Uma leitura de seleção atrasada não substitui a seleção nova.

Trocar/criar campanha e sair pelo menu aguardam `salvarAgora`. Falhas mantêm os
dados locais e impedem a navegação controlada. Em conflito, não há sobrescrita
nem merge silencioso: o usuário pode copiar o texto e continuar editando ou
confirmar explicitamente o descarte para recarregar a versão persistida.
Erros comuns permitem tentar salvar novamente. Estado de sucesso não é exibido
enquanto houver erro de armazenamento.

`beforeunload` pede a confirmação padrão do navegador quando há pendências.
Ao desmontar por navegação SPA, a fila é drenada; se falhar, o rascunho é mantido
**apenas em memória nesta sessão** para ser recuperado ao voltar à área, com
aviso e sem sobrescrever o banco. Não é armazenamento paralelo em localStorage.
Fechar à força o processo ou confirmar a saída com mudanças não salvas pode
perder esse rascunho; nenhum código cliente garante persistência após isso.

### Arquivos da Fase 3

| Arquivo | Responsabilidade |
| --- | --- |
| `src/pages/AreaMestre.jsx` | Adaptador da rota e saída com flush |
| `src/App.js` | Carregamento sob demanda da rota do mestre |
| `useCampanhas.ts` | Integração React, fila/revisões, debounce e recuperação |
| `ui/AreaMestreWorkspace.tsx` | Gerenciador, sidebar, conteúdo, menus/configurações |
| `ui/areaMestreWorkspace.css` | Aparência responsiva isolada da área |
| `ui/GridWorkspace.tsx` | Grid, gestos e alternativa por teclado |
| `ui/layoutWorkspace.ts` | Padrão, adaptação e conversão dos layouts |
| `ui/gridWorkspace.css` | Grid e controles de organização |
| `ui/MiniaturaFicha.tsx` | Imagens, URLs temporárias e fallback |
| `useCampanhas.test.tsx` | Integração com IndexedDB, autosave e concorrência |
| `ui/AreaMestreWorkspace.test.tsx` | Fluxos da interface sobre fake-indexeddb |
| `ui/GridWorkspace.test.tsx`, `ui/layoutWorkspace.test.ts` | Eventos, limites e breakpoints |
| `ui/MiniaturaFicha.test.tsx` | Ciclo de vida das miniaturas |
| `ui/testRepositorio.ts` | Adaptação local do clone/IDs no Jest/jsdom |
| `src/pages/navegacaoAreas.test.js` | Atualiza somente o cenário provisório antigo do mestre |
| `package.json`, `package-lock.json`, `README.md` | Dependência e documentação |

A rota usa `React.lazy`/`Suspense`; o grid é carregado apenas ao abrir o mestre.
As fases anteriores continuam preservadas sem commit, reset, push ou mudanças
nos importadores, banco, validação, backup e regras existentes.

### Limitação da validação visual

A ferramenta de controle de navegador retornou inventário vazio de navegadores
e apps nesta sessão. **Não houve validação real em navegador**, captura visual,
arraste físico, resize físico ou fechamento/reabertura do processo do navegador.
Jest/jsdom e fake-indexeddb verificam comportamento/integração, não substituem
essa verificação. Gestos nos testes de grid usam callbacks simulados da biblioteca;
compactação e limites também são testados com a implementação real do compactor.

Antes de aprovar a interface, revisar visualmente `/mestre` em desktop/tablet/mobile,
gestos, foco, reload e reabertura do navegador. A Fase 4 permanece pendente de
autorização: importação visual, visualizadores completos, controles funcionais
de PV e integração dos anexos; não foi implementada nesta etapa.

### Resultado final da Fase 3 — 17/10/2026

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:verify`: aprovado, incluindo ofuscação e saída temporária.
- `CI=true npm test -- --watchAll=false --runInBand`: **49 suítes, 1.456 testes
  aprovados**, timeout padrão, aproximadamente 104 s. Sem recorrência dos
  timeouts de navegação observados na Fase 1.
- **26 testes novos**: hook 8, workspace 6, miniaturas 3, grid 5 e layout 4.
  Os testes das fases anteriores e das fichas 2014/2024 continuam aprovados.
- Bundle inicial (gzip arredondado pelo CRA): **1,37 → 1,38 MB**, aumento pequeno.
  Novos chunks JS de aproximadamente **23,96 KB** e **11,44 KB**, mais CSS de
  **2,84 KB**, carregados sob demanda; CSS inicial passou de 16,26 para 16,34 KB.
  O aviso de bundle elevado já existia e permanece.
- Avisos existentes `act(...)` em testes das fichas e `fs.F_OK` no build não
  impedem as verificações. Não houve novos erros de lint ou typecheck.
- Diff/whitespace e codificação revisados; cache temporário de instalação
  removido. As alterações não commitadas das fases anteriores permanecem no
  workspace. Nenhum commit, push, reset ou avanço de fase.

A implementação está pronta para revisão local. A aprovação visual deve incluir
os cenários reais descritos acima, pois o ambiente não disponibilizou navegador.

## Fase 3.1 — refinamento da interface e múltiplos roteiros

As descrições anteriores registram as fases originais. Esta seção substitui os
comportamentos antigos do header, configurações, roteiro único e modo de edição
do grid. A etapa continua restrita à Área do Mestre, sem funcionalidades da Fase 4.

### Header e navegação

O header agora tem apenas o menu e o nome da campanha à esquerda, com truncamento
e `title` para nomes longos. A marca `minhafichadnd` fica na coluna central de uma
grade simétrica (`1fr auto 1fr`), centralizada em relação ao header inteiro.
Padding e altura foram reduzidos; em telas muito estreitas a marca é ocultada
para preservar o nome/menu. O botão hambúrguer tem fundo transparente e estados
de hover/foco/ativo. Não há fundo laranja permanente no menu.

Campanhas, edição de nome, restauração do padrão e reexibição de quadros ficam
somente no menu hambúrguer. O modal de configurações, seu checkbox de edição e
os controles visuais redundantes do grid foram removidos. Não há barra permanente
de sucesso; carregamento/pendência mantêm anúncio discreto para leitor de tela,
enquanto erros e conflitos continuam visíveis com suas ações de recuperação.

A sidebar ficou mais compacta. O laranja existente `#b93600` e seu hover
`#d04408` foram extraídos de `Areas.css` para os tokens compartilhados
`--area-acao`/`--area-acao-hover`; seu uso conserva o visual existente das outras
áreas. Ações futuras continuam desabilitadas. Expandir/recolher permanece salvo.

### Redimensionamento das laterais

`PaineisLaterais` organiza os três slots. No desktop, a sidebar inicia em **260px**
e PV em **320px**. Limites salvos: esquerda **200–400px**, direita **240–440px**.
Separadores de 8px nas bordas internas têm cursor `col-resize`, indicador visual,
pointer capture, cancelamento e alternativa por teclado (`←`, `→`, `Home`, `End`;
Shift amplia o passo). Os valores acessíveis incluem mínimo, máximo e atual.

O arraste altera uma prévia local fluida; `pointerup` persiste o resultado uma
única vez via hook. Coordenadas fracionárias são arredondadas antes de gravar.
Há reserva de **368px** para o centro: 320 úteis, 32 de padding e 16 de separadores.
As larguras efetivas se ajustam ao espaço disponível sem sobrescrever a preferência
salva automaticamente. O ResizeObserver do grid reage à nova largura central.
Quando a esquerda é recolhida, sua largura expandida continua preservada.

No tablet, PV vai para baixo do centro; no mobile, tudo fica vertical e os
separadores horizontais não são exibidos. Larguras desktop não quebram o mobile.
Novos campos opcionais no layout: `larguraSidebar` e `larguraPV`; dados antigos
recebem valores padrão na adaptação visual, sem apagar o layout salvo.

### Causa e correção do drag-and-drop

Havia três condições que explicam o handle com cursor mas sem movimento:

1. `editarLayout` iniciava em `false`: um checkbox em configurações habilitava
   os gestos, mas o handle continuava com cursor de arraste mesmo desabilitado.
2. A exigência de pelo menos 600px **no centro** podia desabilitar os gestos em
   desktop depois de ampliar as laterais.
3. `bounded: true` limitava o movimento à altura automática atual do container.
   Com quadros preenchendo toda essa altura, não havia espaço vertical de arraste.

Arraste e resize ficam disponíveis diretamente no desktop, com centro útil a
partir de 320px. O antigo modo de edição agora só é usado internamente como guard
de carregamento. `bounded` foi desativado para evitar a armadilha de altura; as
constraints padrão da biblioteca continuam limitando a grade por colunas e
`maxRows: 60`. A compactação e as colisões seguem a implementação da biblioteca.
Nenhuma posição fora dos limites é aceita para persistência.

O handle real recebe foco e identificação do painel. Setas movem; Shift + setas
redimensionam. Essa alternativa opera sobre o layout canônico de 12 colunas,
inclusive em tablet/mobile, sem salvar coordenadas derivadas do breakpoint.
Botões de fechar/expandir/adicionar não iniciam arraste. O cursor é `grab` somente
quando o gesto está habilitado e `grabbing` durante a interação pressionada.

`GridWorkspace.mouse.test.tsx` usa **GridLayout, GridItem e react-draggable reais**,
disparando `mouseDown`/`mouseMove`/`mouseUp`. Só a medição de largura/offsetParent é
adaptada para jsdom. O teste verifica mudanças numéricas em X **e** Y, resize da
altura, bloqueio de drag por botão e persistência após autosave/fechar/reabrir o
repositório. Portanto a validação não depende apenas de classes ou callbacks mocks.
Isso ainda é teste DOM simulado, não um navegador real.

### Modelo, editor e migração dos roteiros

`RoteiroCampanha`: `{ id, titulo, conteudo, criadoEm, atualizadoEm }`.
`Campanha.roteiros?` contém os registros independentes pertencentes à campanha.
A coleção é embutida no agregado, aproveitando a transação e a revisão da campanha;
não precisa de store adicional ou referências binárias. IDs são únicos dentro da
campanha. O campo antigo `roteiro: string` permanece no contrato para compatibilidade.
Essa opção também significa que `listar()` traz os textos embutidos da campanha,
embora continue sem carregar arquivos binários; campanhas com muitos documentos
podem exigir uma projeção resumida ou store dedicada numa evolução futura.

Adicionar roteiro abre `EditorRoteiro`, com título, texto multilinha longo,
Salvar/Cancelar e validação. O quadro mostra cards com título, ícone de documento,
prévia e ação de adicionar; clicar abre o documento completo para editar.
Excluir exige confirmação e preserva os demais registros. Fechar a janela nunca
equivale a excluir um roteiro.

O rascunho fica local até Salvar. Cancelar/Escape com alterações pede confirmação;
o navegador é avisado de mudanças ainda não salvas. Rascunhos sobrevivem em memória
à navegação SPA nesta sessão; seu ID é conservado para não duplicar registros após
retry. Falha de salvamento mantém a modal/texto disponíveis, e a fila/revisão do
hook continua protegendo conflitos. Rascunhos em memória não sobrevivem ao processo
fechado à força nem substituem IndexedDB. Títulos têm limite de 200 caracteres;
o texto não recebe um limite novo que inviabilize documentos legados maiores.
O manifesto mantém seu limite de 4MiB: um backup que exceda esse limite é recusado
claramente, sem exportação parcial. Há regressão específica com legado acima de 4MiB.

**IndexedDB passa de versão 1 para 2.** A migração percorre campanhas por cursor e
transforma o texto legado não vazio em um registro “Roteiro original”. Preserva
eventuais registros já existentes, gera `roteiro-legado[-N]` sem colisões e só
esvazia o campo antigo na mesma atualização transacional. Não recria stores/banco.
`normalizarRoteirosCampanha` é imutável e idempotente. O schema de domínio continua
em 1 porque as novas propriedades são opcionais; o upgrade do banco registra a
transformação dos dados existentes. Há teste que aborta a atualização do cursor e
confirma o texto/revisão e o banco v1 íntegros após o rollback.

### Compatibilidade de backup

Backups novos usam **formato versão 2**. O leitor aceita **1 e 2**, normaliza o
roteiro legado e valida novamente antes de restaurar. Todos os roteiros, metadados,
larguras e anexos são exportados; IDs dos roteiros também são remapeados ao criar
uma campanha nova. Os limites ZIP, hashes, CRC e restauração atômica permanecem.
O round-trip completo compara dois roteiros independentes e ambas as larguras,
além dos arquivos e relacionamentos anteriores.

### Arquivos e escopo das alterações

- Interface: `ui/AreaMestreWorkspace.tsx`, `ui/areaMestreWorkspace.css`, novo
  `ui/EditorRoteiro.tsx`, novos `ui/PaineisLaterais.tsx` e `ui/paineisLaterais.css`.
- Grid: `ui/GridWorkspace.tsx`, `ui/gridWorkspace.css`, `ui/layoutWorkspace.ts`.
- Dados: `modelos.ts`, `validacao.ts`, `persistencia.ts`, `backup.ts`, novo `roteiros.ts`.
- Cores compartilhadas sem alterar os valores anteriores: `src/pages/css/Areas.css`.
- Testes: `ui/AreaMestreWorkspace.test.tsx`, `ui/GridWorkspace.test.tsx`,
  `ui/layoutWorkspace.test.ts`, novos `ui/GridWorkspace.mouse.test.tsx`,
  `ui/PaineisLaterais.test.tsx`, `roteiros.test.ts`; expectativas de compatibilidade
  atualizadas em `useCampanhas.test.tsx`, `persistencia.test.ts`, `backup.test.ts`
  e `roundTrip.test.ts`. Cenários de revisão, quota, rollback e bytes preservados.
- Nenhuma dependência adicionada nesta etapa. Fichas 2014/2024, importadores e
  localStorage permanecem sem alterações. Nenhum commit ou push.

### Limitações e revisão visual

O inventário de controle de navegador voltou vazio nesta sessão. Não foi possível
executar mouse físico/pointer em navegador real nem verificar visualmente header,
truncamento e responsividade. Os testes de mouse DOM com biblioteca real são mais
abrangentes que os mocks anteriores, mas não substituem esse teste no navegador.
Revisar `/mestre` em desktop/tablet/mobile, principalmente a marca central, os
extremos de largura, drag/resize, foco e modais com textos longos. A Fase 4 não foi
iniciada; importação e visualizadores completos e controles funcionais de PV
continuam pendentes de autorização.

### Validação final da Fase 3.1 — 17/10/2026

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado, sem erros ou avisos novos.
- `npm run build:verify`: aprovado, incluindo ofuscação e limpeza temporária.
- Suíte completa com timeout padrão: **52 suítes e 1.473 testes aprovados**,
  aproximadamente 110s. São 17 casos a mais que a Fase 3, além da atualização
  dos cenários antigos para o comportamento novo. Nenhum timeout de navegação
  precisou ser aumentado nesta entrega.
- Testes cobrem mouse DOM com grid real, persistência e reabertura, limites e
  coordenadas fracionárias das laterais, roteiros independentes, confirmação
  de descarte/exclusão, conflitos, backup v1/v2, rollback da migração e texto
  legado grande. A limitação de navegador real descrita acima permanece.
- JS inicial continua **1,38MB gzip**, na medição arredondada do CRA. O chunk do
  workspace passou de **11,44KB para 13,54KB** e seu CSS de 2,84 para 3,63KB;
  CSS inicial passou de 16,34 para 16,38KB. Sem aumento significativo do inicial
  ou novas dependências. Permanecem os avisos antigos de bundle alto, `act(...)`
  nos testes das fichas e `fs.F_OK` na ferramenta de build.
- Diff, espaços e UTF-8 revisados. Todas as alterações locais anteriores foram
  preservadas. Nenhum commit, push, reset ou avanço para a Fase 4.
