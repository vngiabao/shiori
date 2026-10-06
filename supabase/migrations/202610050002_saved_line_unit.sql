-- Add optional unit tags without deleting or rewriting any learning record.
-- Apply to the shared Shiori project before deploying the course extension.
begin;
alter table public.shiori_learning_records drop constraint learning_payload_keys;
alter table public.shiori_learning_records add constraint learning_payload_keys check (
  payload - case kind
    when 'attempts' then array['id','at','itemId','skill','correct','support','source']
    when 'completions' then array['id','at','canDo']
    when 'media' then array['id','at','clip','phase','transcript','lines','revealed','followed']
    when 'fieldSessions' then array['id','at','kind','minutes','title','support','note','feedback']
    when 'lines' then array['id','at','clip','start','end','text','note','unit']
    when 'jlptPlans' then array['id','cycle','source','targetDate']
    when 'jlptLogs' then array['id','level','cycle','stage','source','unit','minutes','notes','at','checks']
    when 'jlptRuns' then array['id','level','cycle','stage','questionIds','answers','started','deadline','submitted','aborted']
    when 'readingRuns' then array['id','at','stage','checkpoint','responses']
    when 'textDrafts' then array['id','at','title','text','blank','translation','reference']
    when 'profiles' then array['id','name','path','minutes','created','theme','romaji','streak','furigana','updatedAt','updatedBy']
  end = '{}'::jsonb
);
commit;
