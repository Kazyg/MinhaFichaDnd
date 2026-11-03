-- Encerrar reserva o próximo convite; reabrir mantém esse mesmo link.
create or replace function public.sala_comando(p_sala uuid, p_acao text, p_usuario uuid default null) returns void
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
    if p_acao='encerrar' then
    update public.sala_config set convite=replace(gen_random_uuid()::text || gen_random_uuid()::text,'-','') where sala=p_sala;
    end if;
  elsif p_acao='renovar' then
    update public.sala_config set convite=replace(gen_random_uuid()::text || gen_random_uuid()::text,'-','') where sala=p_sala;
    update public.sala_membros set estado='recusado' where sala=p_sala and estado='pendente';
  else raise exception 'Ação desconhecida.';
  end if;
end; $$;
