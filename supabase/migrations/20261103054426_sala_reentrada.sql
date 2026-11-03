-- Uma nova tentativa requer aprovação, mesmo para a mesma identidade e nome.
alter table public.sala_membros add column pedido_versao integer not null default 1;

create or replace function public.sala_pedir_entrada(p_convite text, p_nome text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Identifique-se para entrar.'; end if;
  if p_nome is null or length(trim(p_nome)) not between 1 and 60 then raise exception 'Informe um nome de até 60 caracteres.'; end if;
  select s.id into v_id from public.salas s join public.sala_config c on c.sala=s.id
    where c.convite=p_convite and s.aberta and not s.bloqueada for update of s;
  if v_id is null then raise exception 'Convite indisponível ou novas entradas bloqueadas.'; end if;
  if (select count(*) from public.sala_membros where sala=v_id) >= 100 and
     not exists(select 1 from public.sala_membros where sala=v_id and usuario=auth.uid()) then raise exception 'Sala sem vagas para novas solicitações.'; end if;
  insert into public.sala_membros(sala,usuario,nome) values(v_id,auth.uid(),trim(p_nome)) on conflict (sala,usuario) do update
    set nome=excluded.nome, estado='pendente', visto_em=now(),
        pedido_versao=public.sala_membros.pedido_versao+1
    where public.sala_membros.estado in ('revogado','recusado');
  return v_id;
end; $$;

revoke all on function public.sala_pedir_entrada(text,text) from public, anon;
grant execute on function public.sala_pedir_entrada(text,text) to authenticated;
