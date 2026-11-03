# Sala online — implantação e funcionamento

O frontend continua na Vercel. O domínio pode permanecer na Hostinger. O serviço
de salas usa Supabase Auth, Postgres/Re​altime e Storage privado. A campanha
completa permanece no IndexedDB do navegador do mestre; este recurso não é um
backup da campanha nem uma migração para armazenamento integral na nuvem.

## Ativação (necessária antes de uso entre dispositivos)

1. Criar um projeto Supabase na conta responsável pelo site. Conferir os limites
   e custos atuais do plano antes de habilitar acesso público.
2. No SQL Editor, executar uma vez
   `supabase/migrations/202611020001_salas.sql`. O arquivo cria tabelas, funções,
   políticas de acesso, bucket privado e inscrição no Realtime.
3. Em Authentication, habilitar Anonymous Sign-ins. Mestres e jogadores recebem
   automaticamente uma identidade individual, persistida pelo Supabase Auth no
   navegador. O fluxo não exige e-mail, SMTP ou redirecionamento de login.
4. Aplicar também a migração incremental
   `supabase/migrations/20261103035941_salas_sem_email.sql`.
   Ela preserva registros, convites e donos existentes; sessões antigas por
   e-mail continuam válidas. Não repetir a migração inicial em banco existente.
5. Na Vercel, definir `REACT_APP_SUPABASE_URL` e
   `REACT_APP_SUPABASE_ANON_KEY` com a URL e chave **pública** (publishable ou anon).
   Nunca colocar chave secret/service_role no React. Para uso local, copiar
   `.env.example` para `.env.local` e preencher os valores públicos.
6. Gerar um novo build/deploy na Vercel. As variáveis são incorporadas no build.
   `vercel.json` mantém a abertura direta de `/sala` e das rotas existentes.
7. Fazer a validação remota abaixo antes de divulgar os convites.

As migrações devem preceder o deploy do frontend. Sem as variáveis, o botão informa que a sala ainda não foi ativada;
o restante da Área do Mestre continua funcionando.

## Uso

- Abrir campanha → aguardar o preparo automático → Copiar link na própria Área do Mestre.
- A criação é idempotente por identidade e ID da campanha. Reabrir reutiliza sala e convite; salas encerradas só reabrem por ação explícita no painel.
- Marcar as instâncias dos jogadores e aplicar o compartilhamento. Todos os
  aprovados veem suas fichas e PV. Só o mestre muda dados.
- Para JSON antigo sem PDF, abrir a ficha na campanha uma vez para gerar o PDF.
  O JSON original nunca é enviado. PDF/imagem de personagem é compartilhado por
  inteiro: selecione apenas documentos que o grupo pode ler.
- Selecionar o combate e marcar os retratos a revelar. É possível fazer isso
  enquanto o encontro está preparado: aparecem ao iniciar e somem ao encerrar.
  Abrir outro combate no workspace privado não muda a escolha da sala.
- Copiar o link e aprovar as solicitações por nome. Nome não prova identidade:
  aprovar apenas as entradas esperadas do grupo.
- Aprovar visitantes é independente de bloquear novas solicitações. Renovar
  convite invalida o anterior e recusa pedidos pendentes, mantendo aprovados.
- Remover participante bloqueia consultas futuras. Encerrar revoga todos os
  participantes; reabrir gera novo convite e exige novas aprovações.
- O painel pode ficar fechado: a sincronização continua enquanto a campanha está
  aberta no navegador. Trocar campanha/fechar a página interrompe a presença do
  mestre; os jogadores mantêm acesso ao último estado da sala aberta.
- Mudanças são enviadas depois da confirmação do salvamento local. Em falha, o
  cabeçalho mostra atenção; use Sincronizar agora. Em conflito com outra aba,
  recarregue as opções salvas antes de continuar. Não há mesclagem silenciosa.

## Fronteira de privacidade

`prepararPublicacao` constrói uma estrutura nova com lista permitida de campos.
Não recebe nem transmite roteiros, estatísticas, nome privado de monstro,
iniciativa, condições, histórico, layout ou documentos de monstro.

Retratos de monstro usam exclusivamente `imagemAnexoId` separado do documento
original. Imagens são rasterizadas novamente antes do upload dos retratos para
remover metadados. Sem retrato há apenas um símbolo neutro.

O banco valida novamente os campos da projeção. Apenas o dono autenticado, identificado por `auth.uid() = salas.dono`,
pode escrever por funções controladas. Visitantes não podem se aprovar
ou publicar, mesmo usando a API diretamente. RLS também protege arquivos e
consulta se cada caminho ainda está referenciado na publicação atual. Não são
geradas URLs públicas nem assinadas com validade independente da aprovação.

Revogação é detectada por evento e por releitura a cada cinco segundos. Arquivos
baixados e dados já vistos não podem ser apagados do dispositivo de outra pessoa.
Sem rede, a tela mantém a última visão com aviso, até poder confirmar o acesso.

## Limites e operação

- 20 salas por mestre; 100 identidades solicitantes por sala; 30 personagens e
  100 retratos de monstros por publicação; 20 MiB por arquivo e 100 MiB selecionados
  no cliente. Revisar limites conforme uso real.
- Mestre e visitante dependem da sessão persistida do navegador. Ao limpar os dados ou trocar
  de dispositivo, o jogador pede nova aprovação; o mestre não recupera a
  administração da sala antiga automaticamente. O ID da campanha e o convite
  nunca permitem assumir sua propriedade. As campanhas no IndexedDB não são
  modificadas por esta refatoração; exportações não carregam tokens de sessão.
- O armazenamento usa hash de conteúdo para não reenviar arquivos iguais. Arquivos
  antigos deixam de ser acessíveis aos visitantes, mas continuam armazenados;
  monitorar uso e remover arquivos órfãos pelo administrador, após conferir que
  não aparecem em nenhuma `salas.visao`. Não remover o bucket nem arquivos em uso.
- Configurar os rate limits de Auth e acompanhar abuso de entradas anônimas.
  O formulário atual não integra CAPTCHA: se o habilitar no Supabase, integrar o
  desafio e passar `captchaToken` antes de disponibilizar o login aos visitantes.
- Não excluir identidades anônimas donas de salas em rotinas de limpeza:
  sua remoção pode apagar as salas por cascata. Revisar salas abandonadas e
  pedidos recusados separadamente. Não há painel de exclusão definitivo nesta
  versão; encerrar a sala controla o acesso, mas não apaga seus arquivos.
- Realtime entrega eventos; releituras autorizadas recuperam o estado e servem
  também de fallback. Indicador de presença expira após 60 segundos.

## Verificação

```sh
npm run test:salas
npm test -- --watchAll=false --runInBand
npm run lint
npm run typecheck
npm run build:verify
```

`test:salas` executa a migração e as políticas reais em PostgreSQL embutido
(PGlite), simulando os esquemas de Auth/Storage. Confere visitante pendente,
aprovação, escrita negada, campos secretos negados, revisão obsoleta, arquivo
removido, outro mestre, convite renovado, bloqueio, revogação e encerramento.
Isso não substitui verificar Supabase Auth/Storage/Re​altime no projeto real.

Validação remota: um navegador de mestre e outro de jogador, preferencialmente
também celular. Confirmar entrada sem cadastro, aprovação, leitura das fichas,
mudanças de PV, preparação/início/fim do combate, ausência de dados secretos no
tráfego, tentativa direta de escrita/arquivo privado, renovação, revogação,
desconexão e retorno. Verificar entrega do e-mail, limites e funcionamento com
HTTPS. Nada deve ser considerado publicado apenas porque os testes locais passam.

Referências: [Auth anônimo](https://supabase.com/docs/guides/auth/auth-anonymous),
[login por e-mail](https://supabase.com/docs/guides/auth/auth-email-passwordless),
[Storage com RLS](https://supabase.com/docs/guides/storage/security/access-control),
[Realtime](https://supabase.com/docs/guides/realtime/postgres-changes).
