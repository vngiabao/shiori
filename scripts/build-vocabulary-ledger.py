"""Account for every pinned beginner source row without turning aliases into mastery."""
import csv,gzip,hashlib,json,sys
from pathlib import Path
from jmdict_sources import extract,reading_key
from audit_vocabulary_source import audit_row
ROOT=Path(__file__).resolve().parents[1]
def read(path):return json.loads((ROOT/path).read_text(encoding='utf8'))
def build():
 decisions=read('content/decks/coverage-decisions.json'); corrections=read('content/decks/source-decisions.json')
 provenance=read('content/sources/jlpt-vocabulary/provenance.json')
 words=[w for p in sorted((ROOT/'content/packs').glob('*.json')) for w in json.loads(p.read_text(encoding='utf8'))['words'] if not w['id'].startswith(('h-','k-','sound-'))]
 by_id={w['id']:w for w in words};rows=[];hashes={}
 for level in ['n5','n4']:
  path=ROOT/f'content/sources/jlpt-vocabulary/{level}.csv'; hashes[path.name]=hashlib.sha256(path.read_bytes()).hexdigest()
  assert hashes[path.name]==next(f['sha256'] for f in provenance['files'] if f['file']==path.name)
  with path.open(encoding='utf-8-sig',newline='') as stream: rows.extend({**r,'level':level,'sourceRow':i} for i,r in enumerate(csv.DictReader(stream),2))
 cache=ROOT/'.cache/JMdict_e.gz'; dictionary_hash=hashlib.sha256(cache.read_bytes()).hexdigest()
 assert dictionary_hash==read('content/sources/jmdict-provenance.json')['sha256']
 wanted={r['expression'] for r in rows}|{w.get('lemma',{}).get('text',w['text']) for w in words}
 with gzip.open(cache,'rb') as stream:lexicon,entries=extract(stream,wanted)
 result=[]
 for row in rows:
  key=f"{row['level']}:{row['sourceRow']}";audit=audit_row(row,lexicon,entries,words)
  item={**row,'dictionaryStatus':audit['status'],'independentMasteryEvidence':False}
  if key in corrections:
   decision=corrections[key];assert decision['original']=={k:row[k] for k in ['expression','reading']}
   selected=decision.get('selections',[decision.get('selected')]);ids=[]
   for pair in selected:
    assert reading_key(pair['kana']) in {reading_key(r) for r in lexicon.get(pair['text'],[])},key
    matches=[w['id'] for w in words if w['text']==pair['text'] and reading_key(w['kana'])==reading_key(pair['kana'])]
    assert matches,(key,pair);ids+=matches
   item.update(disposition='corrected-source-pair',courseIds=ids,decision=decision)
  elif audit['exactCourseForms']:
   item.update(disposition='exact-taught-form',courseIds=audit['exactCourseForms'])
  elif key in decisions['related']:
   wid=decisions['related'][key];assert wid in by_id,key
   assert set(entries.get(row['expression'],[]))&set(entries.get(by_id[wid].get('lemma',{}).get('text',by_id[wid]['text']),[])),key
   item.update(disposition='related-taught-form',courseIds=[wid],relatedForm={k:by_id[wid][k] for k in ['text','kana','meaning']},reason='Editorially selected related spelling or inflected form. The source target is not separately checked by this relation; do not count it as exact recognition or equivalent independent lexical knowledge.')
  elif audit['status']=='pattern':
   item.update(disposition='pattern-not-headword',courseIds=[],reason=decisions['patternPolicy'])
  elif key in decisions['excluded']:
   item.update(disposition='excluded-with-reason',courseIds=[],reason=decisions['excluded'][key])
  elif audit['status']=='suru-form-review':
   reading=row['reading'][:-2];matches=[w['id'] for w in words if w['text']==row['expression'] and reading_key(w['kana'])==reading_key(reading)]
   assert matches,('Unaccounted suru row',key)
   item.update(disposition='noun-with-suru-reading',courseIds=matches,reason='The raw noun is paired with a suru verb reading. Existing noun instruction is referenced explicitly; the complete suru expression is not independently counted.')
  else:raise ValueError(f'Unaccounted source row {key}: {row}')
  result.append(item)
 return {'scope':decisions['scope'],'csvSha256':hashes,'dictionarySha256':dictionary_hash,'rows':result}
if __name__=='__main__':
 result=build();path=ROOT/'content/sources/decks/beginner-coverage.json'
 text=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
 if '--check' in sys.argv: assert path.read_text(encoding='utf8')==text,'Stale beginner coverage ledger'
 else:path.write_text(text,encoding='utf8',newline='\n')
 from collections import Counter
 print(json.dumps({level:dict(Counter(r['disposition'] for r in result['rows'] if r['level']==level)) for level in ['n5','n4']},indent=2))
