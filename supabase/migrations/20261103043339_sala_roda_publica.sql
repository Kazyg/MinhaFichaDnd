-- Roda pública: somente referências a jogadores e monstros já revelados.
create or replace function public.sala_validar_visao(p jsonb, p_sala uuid) returns boolean
language plpgsql immutable set search_path = '' as $$
declare j jsonb; m jsonb; r jsonb; item jsonb; ids text[];
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
  if (p->'combate') - array['imagens','roda'] <> '{}'::jsonb or jsonb_typeof(p->'combate'->'imagens') is distinct from 'array' then return false; end if;
  if jsonb_array_length(p->'combate'->'imagens')>100 then return false; end if;
  for m in select value from jsonb_array_elements(p->'combate'->'imagens') loop
    if jsonb_typeof(m)<>'object' or m - array['id','retrato'] <> '{}'::jsonb then return false; end if;
    if not coalesce((m->>'id') ~ '^m[0-9]+$',false) or not public.sala_validar_arquivo(m->'retrato',p_sala,true) then return false; end if;
  end loop;
  if (p->'combate') ? 'roda' then
    r := p->'combate'->'roda';
    if jsonb_typeof(r) is distinct from 'object' or r - array['rodada','ordem','ativo'] <> '{}'::jsonb then return false; end if;
    if jsonb_typeof(r->'rodada') is distinct from 'number' or not coalesce((r->>'rodada') ~ '^[0-9]{1,16}$',false) then return false; end if;
    if (r->>'rodada')::numeric not between 1 and 9007199254740991 then return false; end if;
    if jsonb_typeof(r->'ordem') is distinct from 'array' then return false; end if;
    if jsonb_array_length(r->'ordem') > 130 then return false; end if;
    select array_agg(x->>'id') into ids from (
      select value x from jsonb_array_elements(p->'jogadores')
      union all select value x from jsonb_array_elements(p->'combate'->'imagens')
    ) publico;
    for item in select value from jsonb_array_elements(r->'ordem') loop
      if jsonb_typeof(item) <> 'string' or not coalesce((item #>> '{}') = any(ids),false) then return false; end if;
    end loop;
    if (select count(*) <> count(distinct value) from jsonb_array_elements(r->'ordem')) then return false; end if;
    if not (r ? 'ativo') then return false; end if;
    if r->'ativo' <> 'null'::jsonb and (jsonb_typeof(r->'ativo') <> 'string' or not (r->'ordem' @> jsonb_build_array(r->'ativo'))) then return false; end if;
  end if;
  return true;
end; $$;

