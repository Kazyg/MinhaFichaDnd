-- Migração aditiva: mantém donos, campanhas, convites, escolhas e membros existentes.
-- Autenticação anônima tem um auth.uid() individual; nunca equivale ao papel anon.
create or replace function public.sala_e_dono(p_sala uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.salas where id=p_sala and dono=auth.uid());
$$;

create or replace function public.sala_criar(p_campanha text, p_nome text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid; v_dono uuid := auth.uid();
begin
  if v_dono is null then raise exception 'Identifique-se para criar uma sala.'; end if;
  if p_campanha is null or length(trim(p_campanha)) not between 1 and 200 then raise exception 'Campanha inválida.'; end if;
  if p_nome is null or length(trim(p_nome)) not between 1 and 200 then raise exception 'Nome inválido.'; end if;
  -- Serializa criação por dono: protege a unicidade e o limite entre campanhas/abas.
  perform pg_advisory_xact_lock(hashtextextended(v_dono::text, 0));
  select id into v_id from public.salas where dono=v_dono and campanha_local=p_campanha;
  if v_id is not null then return v_id; end if;
  if (select count(*) from public.salas where dono=v_dono) >= 20 then raise exception 'Limite de 20 salas por mestre.'; end if;
  insert into public.salas(dono,campanha_local,visao) values(v_dono,p_campanha,
    jsonb_build_object('nome',trim(p_nome),'jogadores','[]'::jsonb,'combate',null)) returning id into v_id;
  insert into public.sala_config(sala) values(v_id);
  return v_id;
end; $$;

revoke all on function public.sala_e_dono(uuid), public.sala_criar(text,text) from public,anon;
grant execute on function public.sala_e_dono(uuid), public.sala_criar(text,text) to authenticated;
