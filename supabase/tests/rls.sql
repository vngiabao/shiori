-- LOCAL Supabase only. Run after the migration as postgres with ON_ERROR_STOP=1.
-- Every fixture, temporary grant and deletion is rolled back.
begin;
insert into auth.users(id) values
  ('00000000-0000-4000-8000-0000000000a1'),
  ('00000000-0000-4000-8000-0000000000b2');
insert into public.shiori_sync_state(user_id) select id from auth.users
  where id in ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000b2');
insert into public.shiori_learning_records(user_id,kind,id,schema_version,payload)
  select user_id,'profiles','local',1,'{"id":"local"}'::jsonb from public.shiori_sync_state
  where user_id in ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000b2');
-- Temporary grants isolate the RLS policy check from the production write denial.
grant insert, update, delete on public.shiori_sync_state, public.shiori_learning_records to authenticated;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000000a1',true);
do $$
declare s jsonb; changed integer;
begin
  if (select count(*) from public.shiori_sync_state) <> 1 then raise exception 'State read isolation failed'; end if;
  if (select count(*) from public.shiori_learning_records) <> 1 then raise exception 'Record read isolation failed'; end if;
  update public.shiori_learning_records set payload = '{"id":"local","name":"intruder"}'
    where user_id = '00000000-0000-4000-8000-0000000000b2';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cross-user update succeeded'; end if;
  delete from public.shiori_sync_state where user_id = '00000000-0000-4000-8000-0000000000b2';
  get diagnostics changed = row_count;
  if changed <> 0 then raise exception 'Cross-user state deletion succeeded'; end if;
  begin
    insert into public.shiori_learning_records values
      ('00000000-0000-4000-8000-0000000000b2','attempts','intruder',1,'{"id":"intruder"}');
    raise exception 'Cross-user insertion succeeded';
  exception when insufficient_privilege then null;
  end;
  s := public.shiori_sync_pull();
  if jsonb_array_length(s->'rows') <> 1 then raise exception 'RPC read isolation failed'; end if;
  begin
    perform public.shiori_sync_push(null,null,'[]',false);
    raise exception 'Null revision bypass succeeded';
  exception when raise_exception then
    if sqlerrm <> 'sync_conflict' then raise; end if;
  end;
  perform public.shiori_sync_delete();
  if (select count(*) from public.shiori_learning_records) <> 0 then raise exception 'Own deletion failed'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000000b2',true);
do $$ begin
  if (select count(*) from public.shiori_learning_records) <> 1 then raise exception 'Other local records were changed'; end if;
  if (select deleted from public.shiori_sync_state) then raise exception 'Other local state was changed'; end if;
end $$;
reset role;
set local role anon;
select set_config('request.jwt.claim.sub','',true);
do $$ begin
  begin
    perform * from public.shiori_learning_records;
    raise exception 'Anonymous table read succeeded';
  exception when insufficient_privilege then null; end;
  begin
    perform public.shiori_sync_pull();
    raise exception 'Anonymous RPC succeeded';
  exception when insufficient_privilege then null; end;
end $$;
rollback;
