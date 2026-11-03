# Área do Mestre

Workspace em `/mestre` para campanhas, fichas importadas, roteiros, PV independentes,
preparação e execução de combates, condições e histórico. A rota e os módulos de
PDF, OCR e backup são carregados sob demanda.

## Organização

| Arquivos | Responsabilidade |
| --- | --- |
| `modelos.ts`, `dominio.ts`, `validacao.ts` | DTOs, invariantes e validação do agregado |
| `contratos.ts`, `persistencia.ts`, `erros.ts` | Repositório IndexedDB e erros de armazenamento |
| `useCampanhas.ts` | Integração React, autosave, revisões e operações transacionais |
| `importacao.ts`, `importacaoVisual.ts`, `fichasCampanha.ts` | Leitura, revisão e incorporação de fichas |
| `pdfFichaJson.ts` | Geração e associação do PDF para fichas JSON |
| `pdf.ts`, `pdfMotor.ts`, `reconhecimento.ts`, `ocr.ts`, `ocrMotor.ts`, `retratos.ts` | Consulta de documentos, reconhecimento e recorte |
| `instancias.ts`, `roteiros.ts` | PV por ocorrência e roteiros independentes |
| `preparacaoCombate.ts`, `execucaoCombate.ts`, `encerramentoCombate.ts` | Ciclo de vida e motor de combate |
| `catalogoCondicoes.ts`, `condicoes.ts` | Catálogo, aplicações e duração dos efeitos |
| `backup.ts` | Exportação, validação e restauração de campanhas |
| `ui/` | Workspace, grid, roleta, visualizadores, painéis e modais |

## Dados e persistência

`DadosCampanha` é a unidade de leitura e gravação. Contém campanha, anexos, fichas
originais, instâncias, combates, participantes e layout. Os registros são DTOs
compatíveis com structured clone; classes, métodos e object URLs não são persistidos.

Uma ficha original referencia seus arquivos. Cada instância tem nome e PV próprios,
sem duplicar os binários. Participantes ligam instâncias a combates por IDs estáveis;
avulsos usam `fichaOriginalId: null`. Roteiros ficam em `Campanha.roteiros`.

O banco `minhafichadnd-area-mestre` está na **versão 4**, com schema de domínio **1**.
As stores são `campanhas`, `anexos`, `arquivos`, `fichas`, `instancias`, `combates`,
`participantes` e `layouts`. `arquivos` guarda os Blobs separados dos metadados dos
anexos. A listagem de campanhas não lê binários. O localStorage das fichas do editor
é independente deste banco.

`RepositorioCampanhas` oferece `listar`, `obter`, `criar`, `salvar`, `excluir`,
`excluirFicha`, `excluirAnexo` e `fechar`. Gravações do agregado são atômicas:
falhas, quota ou abort revertem a transação. Exclusões respeitam as referências.
Anexos sem uso não são removidos automaticamente.

O repositório atribui revisão na criação e a incrementa ao salvar. **Reler com
`obter` após criar, salvar ou restaurar**, antes da próxima edição: o objeto
submetido não recebe a revisão nova. Revisões obsoletas são rejeitadas, inclusive
entre abas, sem sobrescrita ou merge silencioso.

`useCampanhas` serializa as gravações e aplica autosave com debounce de 600 ms.
Trocar campanha e sair aguardam as pendências. Ações de combate e conversão de PDF
compartilham um bloqueio de escrita. Modais de condições e encerramento conservam
a revisão de abertura. Após commit com falha de releitura, é preciso recarregar
antes de continuar, evitando repetir uma operação já salva.

Rascunhos de navegação SPA podem ser recuperados em memória na mesma sessão.
Fechar o processo com alterações não salvas pode perdê-las. Backups fora do
navegador são necessários para proteção contra limpeza dos dados locais.

### Migrações

`MIGRACOES_MESTRE` aplica os upgrades em ordem: criação das stores (v1), roteiros
independentes (v2), execução de combates legados (v3) e origem do snapshot de PV
(v4). Migrações agendam requests/cursors na própria transação de upgrade, sem
`await` externo ou recriação das stores. Falhas preservam a versão anterior.

Versões de banco, schema de domínio e backup têm evolução independente. Campos
opcionais de condições e PDF gerado são compatíveis sem novo upgrade do banco.

## Importação e consulta

Jogadores aceitam JSON do MinhaFichaDnd, PDF e imagens; monstros aceitam PDF e
imagens. Imagens suportadas: PNG, JPEG, GIF e WebP. Extensão, MIME e assinatura
binária são conferidos; nome, PV e retrato podem ser revisados antes de incluir.
Alterar os metadados da ficha original preserva os ajustes das instâncias existentes.

Novos JSONs usam o envelope `minhafichadnd`, versão 1, tipo `ficha`, ou um snapshot
histórico identificável pelos atributos e campos do exportador. Edição ausente
em legado reconhecido significa 2014. JSON arbitrário, coleções e edições
desconhecidas são recusados. Os bytes originais são preservados.

`prepararImportacaoComPdf` reutiliza `gerarFichaPdf` de
[`exportarFichaPdf.ts`](../../utils/exportarFichaPdf.ts), com `parseImport` em uma
cópia do documento. Não altera a ficha ativa nem o localStorage, e não inicia
impressão, navegação ou download. O gerador usa o template local
`public/ficha-de-personagem-dd-5e.pdf` e os seletores da edição 2014/2024.

`FichaOriginal.anexoId` mantém o JSON; `pdfAnexoId` aponta para o PDF gerado.
Ambos são salvos juntos. A modal principal abre o visualizador de PDF existente,
com páginas, zoom e download. Fichas antigas sem PDF são convertidas na primeira
abertura, sem aplicar o filtro mais restrito das novas importações. O PDF é
persistido e reutilizado; falhas oferecem nova tentativa. Não há regeneração
automática após alterações de metadados.

PDF textual usa PDF.js; imagens e PDFs digitalizados podem usar Tesseract local
em português e inglês. O reconhecimento é revisável, pode ser cancelado e preserva
campos já corrigidos manualmente. Retratos podem ser enviados ou recortados em PNG
separado, com até 1024 px no maior lado. URLs temporárias são liberadas na troca
de documento ou desmontagem.

`scripts/prepare-ocr.cjs` prepara `public/ocr` antes de start/build a partir das
dependências instaladas. Esses assets são gerados e ignorados pelo Git. O build
os exclui da ofuscação, e `build:verify` confere sua integridade. Documentos não
são enviados a serviços externos para reconhecimento.

## Combates e condições

Encontros persistidos têm pelo menos dois participantes. Preparação permite
instâncias existentes e avulsos; iniciar captura os PV atuais e máximos reais.
Uma instância só pode participar de um combate ativo; outras instâncias da mesma
ficha permanecem independentes. Vários combates podem ser preparados ou executados,
e alternar entre eles apenas muda a visualização.

O motor mantém o participante ativo por ID e os IDs já visitados na rodada.
Próximo turno encerra o atual e seleciona o próximo ainda não visitado; quando
todos foram visitados, inicia outra rodada. Reordenar conserva o turno ativo e o
progresso, sem consumir efeitos. A roleta apresenta cinco posições circulares;
repetições visuais não criam participantes ou aplicações adicionais.

O catálogo contém 77 opções em cinco categorias: 15 condições oficiais, dano
contínuo, efeitos negativos, positivos e outros marcadores. Inclui efeito
personalizado e exaustão de nível 0 a 6. São marcadores de acompanhamento, sem
dano, cura ou penalidades automáticas.

Cada aplicação tem ID próprio e pertence ao participante naquele combate.
A duração padrão conta turnos completos do alvo, no final do turno. Aplicar
durante seu turno ignora essa ocorrência parcial. A opção de início do turno
consome o contador na próxima entrada elegível do alvo. Duração manual não expira;
editar turnos restantes preserva o controle temporal. Turnos de outros alvos,
reordenação, reload e zero PV não removem nem consomem efeitos indevidamente.
Contagem, expiração e avanço são salvos na mesma operação transacional.

Encerrar exige escolher entre manter PV ou restaurar atuais **e máximos** capturados
na ativação. Restaurar não significa curar até o máximo. Snapshots legados ou
ambíguos não habilitam restauração: datas antigas iguais entre preparação e
ativação são tratadas conservadoramente como legado.

O histórico copia nomes, tipos, iniciativa, ordem, PV iniciais/finais, decisão,
datas e condições ainda ativas. PV finais representam o estado anterior à eventual
restauração. É somente leitura e continua consultável após remoção das fontes.
Instâncias vinculadas a preparados, ativos ou históricos incompletos não podem
ser removidas. Efeitos não são transferidos para encontros futuros.

## Backup e limites

`exportarBackup` gera ZIP; `lerBackup` valida sem gravar; `restaurarBackup` cria
uma campanha nova. O formato atual é **v6**, com leitor **v1–v6**. O manifesto
`MinhaFichaDnd/areaMestre` contém metadados e referências aos binários em `anexos/`.
CRC32 e SHA-256 verificam corrupção; WebCrypto exige HTTPS ou localhost.

A restauração remapeia IDs e referências de campanha, fichas, instâncias,
participantes, combates, roteiros, condições, layout e anexos, incluindo PDF gerado
e retrato. Identificadores históricos sem entidade viva também são preservados
por remapeamento. `origemJson.id` e o conteúdo do JSON original mantêm a proveniência.

| Limite | Valor |
| --- | --- |
| JSON importado | 5 MiB |
| Anexo binário | 20 MiB |
| ZIP de backup | 64 MiB |
| Total de anexos/conteúdo descompactado | 128 MiB |
| Manifesto | 4 MiB |
| Entradas no ZIP | 2.048 |
| Registros por coleção | 4.096 |

O backup é processado em memória e recusa arquivos acima dos limites. Quota do
navegador é independente desses valores. O leitor aceita o formato ZIP próprio,
com validação de caminhos, tamanhos e referências antes de restaurar.

## Verificação e limitações

Na raiz do projeto:

```sh
npm run typecheck
npm run lint
npm test -- --watchAll=false --runInBand
npm run build:verify
```

Os testes cobrem domínio, UI, IndexedDB, migrações, rollback, concorrência,
backup/restauração e compatibilidade 2014/2024. A geração de PDF usa o template
real nos testes de integração; a renderização de canvas da UI é simulada.
`build:verify` usa saída temporária e preserva um `build/` existente.

Reconhecimento de nome, PV e retratos em layouts complexos ou scans ruins pode
exigir ajuste manual. PDFs protegidos/corrompidos podem não abrir. O exportador
usa o mesmo template nas duas edições, exibe retratos separadamente e substitui
caracteres fora da cobertura da fonte. O JSON preserva o texto integral.

Testes de DOM não substituem revisão em navegador: conferir desktop/mobile,
zoom, foco, scroll, drag/resize e reabertura com dados persistidos.
