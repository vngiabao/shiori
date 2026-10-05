-- Shared Kiyo + Shiori project: apply AFTER both base sync migrations.
-- Restricts browser access using verified JWT claims, never user_metadata.
begin;
create or replace function public.learning_owner_allowed() returns boolean
language sql stable set search_path = '' as $$
  select coalesce(auth.uid() is not null
    and lower(auth.jwt()->>'email') = 'gbao.n.vo@gmail.com'
    and auth.jwt()->'app_metadata'->>'provider' = 'google', false)
$$;
revoke all on function public.learning_owner_allowed() from public, anon;
grant execute on function public.learning_owner_allowed() to authenticated;

create or replace function public.learning_owner_signup(event jsonb) returns jsonb
language plpgsql set search_path = '' as $$
begin
  if lower(coalesce(event->'user'->>'email','')) = 'gbao.n.vo@gmail.com'
    and event->'user'->'app_metadata'->>'provider' = 'google' then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error',jsonb_build_object('http_code',403,
    'message','This private learning account is restricted to its owner using Google.'));
end $$;
revoke all on function public.learning_owner_signup(jsonb) from public, anon, authenticated;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.learning_owner_signup(jsonb) to supabase_auth_admin;

-- Restrictive policies combine with each app's existing own-user policies.
do $$ declare tbl text; begin
  foreach tbl in array array['kiyo_sync_state','kiyo_learning_records','shiori_sync_state','shiori_learning_records'] loop
    if not exists (select 1 from pg_policies where schemaname='public' and tablename=tbl and policyname='google_owner_only') then
      execute format('create policy google_owner_only on public.%I as restrictive for all to authenticated using ((select public.learning_owner_allowed())) with check ((select public.learning_owner_allowed()))',tbl);
    end if;
  end loop;
end $$;

-- Definer RPCs bypass table RLS: gate their entry points too. Only these six
-- existing reviewed sync functions may be changed; no signatures/grants change.
do $$ declare fn regprocedure; definition text; begin
  for fn in select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in
      ('kiyo_sync_pull','kiyo_sync_push','kiyo_sync_delete','shiori_sync_pull','shiori_sync_push','shiori_sync_delete') loop
    definition := pg_get_functiondef(fn);
    if position('public.learning_owner_allowed()' in definition) = 0 then
      if position('  if learner is null' in definition) = 0 then
        raise exception 'Unexpected sync function body: %',fn;
      end if;
      definition := replace(definition,'  if learner is null',
        E'  if not public.learning_owner_allowed() then raise exception ''owner_google_required''; end if;\n  if learner is null');
      execute definition;
    end if;
  end loop;
  if (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in
      ('kiyo_sync_pull','kiyo_sync_push','kiyo_sync_delete','shiori_sync_pull','shiori_sync_push','shiori_sync_delete')) <> 6 then
    raise exception 'Both app migrations must be installed first';
  end if;
end $$;
commit;
-- Then select learning_owner_signup in Auth > Hooks > Before User Created.
