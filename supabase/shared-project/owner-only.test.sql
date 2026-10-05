-- Administrator test; every fixture and mutation is rolled back.
begin;
insert into auth.users(id) values
 ('00000000-0000-4000-8000-0000000000a1'),('00000000-0000-4000-8000-0000000000b2');
insert into public.kiyo_sync_state(user_id) values ('00000000-0000-4000-8000-0000000000a1'),('00000000-0000-4000-8000-0000000000b2');
insert into public.shiori_sync_state(user_id) values ('00000000-0000-4000-8000-0000000000a1'),('00000000-0000-4000-8000-0000000000b2');
insert into public.kiyo_learning_records select user_id,'profiles','learner',1,'{"id":"learner"}'::jsonb from public.kiyo_sync_state where user_id in ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000b2');
insert into public.shiori_learning_records select user_id,'profiles','local',1,'{"id":"local"}'::jsonb from public.shiori_sync_state where user_id in ('00000000-0000-4000-8000-0000000000a1','00000000-0000-4000-8000-0000000000b2');
do $$ begin
 if public.learning_owner_signup('{"user":{"email":"gbao.n.vo@gmail.com","app_metadata":{"provider":"google"}}}') <> '{}'::jsonb then raise exception 'Owner signup rejected'; end if;
 if public.learning_owner_signup('{"user":{"email":"other@example.test","app_metadata":{"provider":"google"}}}')->'error' is null then raise exception 'Other email signup allowed'; end if;
 if public.learning_owner_signup('{"user":{"email":"gbao.n.vo@gmail.com","app_metadata":{"provider":"email"}}}')->'error' is null then raise exception 'Email signup allowed'; end if;
 if public.learning_owner_signup('{}')->'error' is null then raise exception 'Empty signup allowed'; end if;
end $$;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-0000000000a1","email":"gbao.n.vo@gmail.com","app_metadata":{"provider":"google"}}',true);
do $$ declare s jsonb; begin
 if (select count(*) from public.kiyo_learning_records) <> 1 or (select count(*) from public.shiori_learning_records) <> 1 then raise exception 'Owner row isolation failed'; end if;
 s := public.kiyo_sync_pull();
 if jsonb_array_length(s->'rows') <> 1 then raise exception 'Kiyo pull failed'; end if;
 perform public.kiyo_sync_push((s->>'revision')::bigint,(s->>'epoch')::uuid,'[]',false);
 s := public.shiori_sync_pull();
 if jsonb_array_length(s->'rows') <> 1 then raise exception 'Shiori pull failed'; end if;
 perform public.shiori_sync_push((s->>'revision')::bigint,(s->>'epoch')::uuid,'[]',false);
 perform public.kiyo_sync_delete();
 if (select count(*) from public.shiori_learning_records) <> 1 or (select deleted from public.shiori_sync_state) then raise exception 'Kiyo delete touched Shiori'; end if;
 perform public.shiori_sync_delete();
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-0000000000b2","email":"other@example.test","app_metadata":{"provider":"google"},"user_metadata":{"email":"gbao.n.vo@gmail.com"}}',true);
do $$ declare fn text; begin
 if (select count(*) from public.kiyo_learning_records) <> 0 or (select count(*) from public.shiori_learning_records) <> 0 then raise exception 'Non-owner table access succeeded'; end if;
 foreach fn in array array['kiyo_sync_pull','shiori_sync_pull','kiyo_sync_delete','shiori_sync_delete'] loop
  begin execute format('select public.%I()',fn); raise exception 'Non-owner RPC allowed: %',fn;
  exception when raise_exception then if sqlerrm <> 'owner_google_required' then raise; end if; end;
 end loop;
 foreach fn in array array['kiyo_sync_push','shiori_sync_push'] loop
  begin execute format('select public.%I(null,null,''[]''::jsonb,false)',fn); raise exception 'Non-owner push allowed';
  exception when raise_exception then if sqlerrm <> 'owner_google_required' then raise; end if; end;
 end loop;
end $$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-0000000000a1","email":"gbao.n.vo@gmail.com","app_metadata":{"provider":"email"}}',true);
do $$ begin
 if public.learning_owner_allowed() then raise exception 'Wrong provider allowed'; end if;
 if (select count(*) from public.kiyo_sync_state) <> 0 then raise exception 'Wrong provider read allowed'; end if;
 begin perform public.shiori_sync_pull(); raise exception 'Wrong provider RPC allowed';
 exception when raise_exception then if sqlerrm <> 'owner_google_required' then raise; end if; end;
end $$;
reset role;
do $$ begin
 if (select count(*) from public.kiyo_learning_records where user_id='00000000-0000-4000-8000-0000000000b2') <> 1 or (select count(*) from public.shiori_learning_records where user_id='00000000-0000-4000-8000-0000000000b2') <> 1 then raise exception 'Other user data changed'; end if;
 if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname in ('kiyo_learning_records','kiyo_sync_state','shiori_learning_records','shiori_sync_state') and (not c.relrowsecurity or not c.relforcerowsecurity)) then raise exception 'RLS not forced'; end if;
end $$;
set local role anon;
do $$ begin
 begin perform public.kiyo_sync_pull(); raise exception 'Anonymous RPC allowed'; exception when insufficient_privilege then null; end;
 begin perform * from public.shiori_learning_records; raise exception 'Anonymous table allowed'; exception when insufficient_privilege then null; end;
end $$;
rollback;
select 'PASS: Google owner only; both app RPCs; row isolation; separate deletion; fixtures rolled back' as result;
