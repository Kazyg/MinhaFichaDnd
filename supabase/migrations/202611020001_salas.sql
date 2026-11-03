-- Sala online: somente a projeção pública chega ao banco. Campanhas privadas permanecem locais.
create table public.salas (
  id uuid primary key default gen_random_uuid(),
  dono uuid not null references auth.users(id) on delete cascade,
  campanha_local text not null check (length(campanha_local) between 1 and 200),
  aberta boolean not null default true,
  bloqueada boolean not null default false,
  revisao integer not null default 0,
  visao jsonb not null,
  atualizada_em timestamptz not null default now(),
  mestre_visto_em timestamptz not null default now(),
  unique(dono, campanha_local)
);
create table public.sala_config (
  sala uuid primary key references public.salas on delete cascade,
  convite text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  escolha jsonb not null default '{"jogadores":[],"combateId":null,"monstros":[]}'
);
create table public.sala_membros (
  sala uuid not null references public.salas on delete cascade,
  usuario uuid not null references auth.users on delete cascade,
  nome text not null check (length(trim(nome)) between 1 and 60),
  estado text not null default 'pendente' check (estado in ('pendente','aprovado','recusado','revogado')),
  visto_em timestamptz not null default now(),
  primary key(sala,usuario)
);
create index sala_membros_usuario on public.sala_membros(usuario,sala);
alter table public.salas enable row level security;
alter table public.sala_config enable row level security;
alter table public.sala_membros enable row level security;

-- Helpers não expõem registros; evitam recursão entre políticas de salas e membros.
create function public.sala_e_dono(p_sala uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.salas where id=p_sala and dono=auth.uid()
    and coalesce((auth.jwt()->>'is_anonymous')::boolean, false)=false);
$$;
create function public.sala_pode_ler(p_sala uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.sala_e_dono(p_sala) or exists (
    select 1 from public.salas s join public.sala_membros m on m.sala=s.id
    where s.id=p_sala and s.aberta and m.usuario=auth.uid() and m.estado='aprovado');
$$;
create policy sala_leitura on public.salas for select to authenticated using (public.sala_pode_ler(id));
create policy config_privada on public.sala_config for select to authenticated using (public.sala_e_dono(sala));
create policy membros_leitura on public.sala_membros for select to authenticated using (usuario=auth.uid() or public.sala_e_dono(sala));
revoke all on public.salas, public.sala_config, public.sala_membros from anon, authenticated;
grant select on public.salas, public.sala_config, public.sala_membros to authenticated;

create function public.sala_criar(p_campanha text, p_nome text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,true) then raise exception 'Entre como mestre.'; end if;
  if length(trim(p_nome)) not between 1 and 200 then raise exception 'Nome inválido.'; end if;
  select id into v_id from public.salas where dono=auth.uid() and campanha_local=p_campanha;
  if v_id is not null then return v_id; end if;
  if (select count(*) from public.salas where dono=auth.uid()) >= 20 then raise exception 'Limite de 20 salas por mestre.'; end if;
  insert into public.salas(dono,campanha_local,visao) values(auth.uid(),p_campanha,
    jsonb_build_object('nome',p_nome,'jogadores','[]'::jsonb,'combate',null)) returning id into v_id;
  insert into public.sala_config(sala) values(v_id);
  return v_id;
end; $$;

create function public.sala_pedir_entrada(p_convite text, p_nome text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Identifique-se para entrar.'; end if;
  if length(trim(p_nome)) not between 1 and 60 then raise exception 'Informe um nome de até 60 caracteres.'; end if;
  select s.id into v_id from public.salas s join public.sala_config c on c.sala=s.id
    where c.convite=p_convite and s.aberta and not s.bloqueada for update of s;
  if v_id is null then raise exception 'Convite indisponível ou novas entradas bloqueadas.'; end if;
  if (select count(*) from public.sala_membros where sala=v_id) >= 100 and
     not exists(select 1 from public.sala_membros where sala=v_id and usuario=auth.uid()) then raise exception 'Sala sem vagas para novas solicitações.'; end if;
  insert into public.sala_membros(sala,usuario,nome) values(v_id,auth.uid(),trim(p_nome)) on conflict do nothing;
  return v_id;
end; $$;

-- Caminhos de arquivos são content-addressed, privados e exclusivos desta sala.
create function public.sala_validar_arquivo(p jsonb, p_sala uuid, p_retrato boolean) returns boolean
language plpgsql immutable set search_path = '' as $$
begin
  if p='null'::jsonb then return true; end if;
  if p is null or jsonb_typeof(p)<>'object' then return false; end if;
  if p - array['id','mime','nome'] <> '{}'::jsonb then return false; end if;
  return coalesce(jsonb_typeof(p->'id')='string' and (p->>'id') ~ ('^' || p_sala::text || '/[a-f0-9]{64}$')
    and jsonb_typeof(p->'nome')='string' and p->>'nome' in ('Retrato','Ficha do grupo')
    and (p->>'mime' in ('image/png','image/jpeg','image/webp','image/gif') or (not p_retrato and p->>'mime'='application/pdf')),false);
end; $$;
create function public.sala_validar_visao(p jsonb, p_sala uuid) returns boolean
language plpgsql immutable set search_path = '' as $$
declare j jsonb; m jsonb;
begin
  if p is null or jsonb_typeof(p)<>'object' then return false; end if;
  if p - array['nome','jogadores','combate'] <> '{}'::jsonb or
     jsonb_typeof(p->'nome') is distinct from 'string' or length(p->>'nome') not between 1 and 200 or
     jsonb_typeof(p->'jogadores') is distinct from 'array' then return false; end if;
  if jsonb_array_length(p->'jogadores')>30 then return false; end if;
  for j in select value from jsonb_array_elements(p->'jogadores') loop
    if jsonb_typeof(j)<>'object' or j - array['id','nome','pv','ficha','retrato'] <> '{}'::jsonb then return false; end if;
    if not coalesce((j->>'id') ~ '^j[0-9]+$' and jsonb_typeof(j->'nome')='string' and length(j->>'nome') between 1 and 200,false) then return false; end if;
    if jsonb_typeof(j->'pv') is distinct from 'object' then return false; end if;
    if (j->'pv') - array['atuais','maximos'] <> '{}'::jsonb then return false; end if;
    if not coalesce((j->'pv'->>'atuais') ~ '^[0-9]{1,9}$' and (j->'pv'->>'maximos') ~ '^[0-9]{1,9}$',false) then return false; end if;
    if (j->'pv'->>'atuais')::integer > (j->'pv'->>'maximos')::integer then return false; end if;
    if not public.sala_validar_arquivo(j->'ficha',p_sala,false) or not public.sala_validar_arquivo(j->'retrato',p_sala,true) then return false; end if;
  end loop;
  if p->'combate'='null'::jsonb then return true; end if;
  if jsonb_typeof(p->'combate') is distinct from 'object' then return false; end if;
  if (p->'combate') - 'imagens' <> '{}'::jsonb or jsonb_typeof(p->'combate'->'imagens') is distinct from 'array' then return false; end if;
  if jsonb_array_length(p->'combate'->'imagens')>100 then return false; end if;
  for m in select value from jsonb_array_elements(p->'combate'->'imagens') loop
    if jsonb_typeof(m)<>'object' or m - array['id','retrato'] <> '{}'::jsonb then return false; end if;
    if not coalesce((m->>'id') ~ '^m[0-9]+$',false) or not public.sala_validar_arquivo(m->'retrato',p_sala,true) then return false; end if;
  end loop;
  return true;
end; $$;

create function public.sala_publicar(p_sala uuid, p_revisao integer, p_visao jsonb, p_escolha jsonb) returns integer
language plpgsql security definer set search_path = '' as $$
declare v_revisao integer;
begin
  if not public.sala_e_dono(p_sala) then raise exception 'Apenas o mestre pode publicar.'; end if;
  select revisao into v_revisao from public.salas where id=p_sala and aberta for update;
  if v_revisao is null then raise exception 'Sala encerrada.'; end if;
  if v_revisao<>p_revisao then raise exception 'A sala mudou em outra aba. Reabra o painel antes de continuar.'; end if;
  if not public.sala_validar_visao(p_visao,p_sala) or octet_length(p_visao::text)>200000 then raise exception 'Publicação inválida: campos privados ou limites excedidos.'; end if;
  if p_escolha is null or jsonb_typeof(p_escolha)<>'object' or octet_length(p_escolha::text)>20000 then raise exception 'Seleção inválida.'; end if;
  update public.salas set visao=p_visao,revisao=revisao+1,atualizada_em=now(),mestre_visto_em=now() where id=p_sala;
  update public.sala_config set escolha=p_escolha where sala=p_sala;
  return v_revisao+1;
end; $$;

create function public.sala_comando(p_sala uuid, p_acao text, p_usuario uuid default null) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.sala_e_dono(p_sala) then raise exception 'Apenas o mestre pode administrar.'; end if;
  perform 1 from public.salas where id=p_sala for update;
  if p_acao in ('aprovar','recusar','revogar') then
    if p_acao='aprovar' and not exists(select 1 from public.salas where id=p_sala and aberta) then raise exception 'Sala encerrada.'; end if;
    update public.sala_membros set estado=case p_acao when 'aprovar' then 'aprovado' when 'recusar' then 'recusado' else 'revogado' end where sala=p_sala and usuario=p_usuario;
  elsif p_acao in ('bloquear','desbloquear') then
    update public.salas set bloqueada=(p_acao='bloquear') where id=p_sala;
  elsif p_acao in ('encerrar','reabrir') then
    update public.salas set aberta=(p_acao='reabrir'),revisao=revisao+1 where id=p_sala;
    update public.sala_membros set estado='revogado' where sala=p_sala;
    update public.sala_config set convite=replace(gen_random_uuid()::text || gen_random_uuid()::text,'-','') where sala=p_sala;
  elsif p_acao='renovar' then
    update public.sala_config set convite=replace(gen_random_uuid()::text || gen_random_uuid()::text,'-','') where sala=p_sala;
    update public.sala_membros set estado='recusado' where sala=p_sala and estado='pendente';
  else raise exception 'Ação desconhecida.';
  end if;
end; $$;
create function public.sala_presenca(p_sala uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if public.sala_e_dono(p_sala) then update public.salas set mestre_visto_em=now() where id=p_sala and aberta;
  else update public.sala_membros set visto_em=now() where sala=p_sala and usuario=auth.uid() and estado in ('pendente','aprovado'); end if;
end; $$;

create function public.sala_arquivo_permitido(p_nome text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.salas s where split_part(p_nome,'/',1)=s.id::text and
    (public.sala_e_dono(s.id) or (public.sala_pode_ler(s.id) and exists (
      select 1 from jsonb_path_query(s.visao, '$.**.id') as ids(valor) where ids.valor=to_jsonb(p_nome)))));
$$;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('sala-arquivos','sala-arquivos',false,20971520,array['application/pdf','image/png','image/jpeg','image/webp','image/gif']);
create policy sala_arquivo_leitura on storage.objects for select to authenticated
using (bucket_id='sala-arquivos' and public.sala_arquivo_permitido(name));
create policy sala_arquivo_envio on storage.objects for insert to authenticated
with check (bucket_id='sala-arquivos' and exists(select 1 from public.salas s where s.id::text=split_part(name,'/',1) and public.sala_e_dono(s.id))
  and name ~ '^[a-f0-9-]{36}/[a-f0-9]{64}$');
create policy sala_arquivo_exclusao on storage.objects for delete to authenticated
using (bucket_id='sala-arquivos' and exists(select 1 from public.salas s where s.id::text=split_part(name,'/',1) and public.sala_e_dono(s.id)));

-- Funções são invocáveis apenas com sessão autenticada (inclusive visitante anônimo).
revoke all on function public.sala_e_dono(uuid), public.sala_pode_ler(uuid), public.sala_criar(text,text), public.sala_pedir_entrada(text,text), public.sala_validar_arquivo(jsonb,uuid,boolean), public.sala_validar_visao(jsonb,uuid), public.sala_publicar(uuid,integer,jsonb,jsonb), public.sala_comando(uuid,text,uuid), public.sala_presenca(uuid), public.sala_arquivo_permitido(text) from public,anon;
grant execute on function public.sala_e_dono(uuid), public.sala_pode_ler(uuid), public.sala_criar(text,text), public.sala_pedir_entrada(text,text), public.sala_publicar(uuid,integer,jsonb,jsonb), public.sala_comando(uuid,text,uuid), public.sala_presenca(uuid), public.sala_arquivo_permitido(text) to authenticated;

-- Clientes fazem releitura autorizada em cada evento, sem confiar no payload do canal.
alter publication supabase_realtime add table public.salas, public.sala_membros;
