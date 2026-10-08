"""Preserve old recordings; permit mappings to change only for changed scene inputs."""
import argparse,hashlib,json,re,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('--base',default='HEAD')
parser.add_argument('--voice-refresh',action='store_true',help='Audit the explicitly authorized teacher/cast refresh and the two sourced pitch examples; preserve all historical bytes.')
args=parser.parse_args()
def old(path):return json.loads(subprocess.check_output(['git','show',f'{args.base}:{path}'],cwd=root))
def now(path):return json.loads((root/path).read_text(encoding='utf-8'))
def digest(url):return hashlib.sha256((root/'public'/url.lstrip('/')).read_bytes()).hexdigest()
def signature(r):return json.dumps(r,sort_keys=True,ensure_ascii=False)
def plain(t):return re.sub(r'\{([^|{}]+)\|[^{}]+\}',r'\1',t)
before=old('src/generated/audio.json');after=now('src/generated/audio.json')
allowed={e['text'] for e in now('content/voices/pitch-contrasts.json')['entries']} if args.voice_refresh else set()
changed_clear=[k for k,v in before.items() if after.get(k)!=v]
assert set(changed_clear)<=allowed,('Unauthorized Clear mapping changed',changed_clear)
assert all(k in after for k in before),'Historical Clear key removed'
records=now('content/voices/lesson-provenance.json')['records'];recordset=set(map(signature,records))
for row in old('content/voices/lesson-provenance.json')['records']:
 assert signature(row) in recordset and digest(row['url'])==row['sha256'],('Historical Clear recording changed',row['text'])
dialogue=now('content/voices/dialogue-provenance.json');current=dialogue['records'];history=dialogue.get('historicalRecords',[])
allrows=set(map(signature,current+history))
if args.voice_refresh:
 for name in ['teacher','cast']:
  latestvoice=now(f'content/voices/{name}-provenance.json')
  priorvoice=old(f'content/voices/{name}-provenance.json')
  retained=set(map(signature,latestvoice['records']+latestvoice.get('historicalRecords',[])))
  for row in priorvoice['records']+priorvoice.get('historicalRecords',[]):
   assert signature(row) in retained and digest(row['url'])==row['sha256'],('Historical voice changed',name,row.get('id',row.get('speaker')))
for row in old('content/voices/dialogue-provenance.json')['records']+old('content/voices/dialogue-provenance.json').get('historicalRecords',[]):
 assert signature(row) in allrows and digest(row['url'])==row['sha256'],('Historical dialogue recording changed',row['dialogue'],row['index'])
def scenes(packs):return {d['id']:d for p in packs for d in p.get('dialogues',[])}
prior=scenes(old('src/generated/packs.json'));latest=scenes(now('src/generated/packs.json'))
maps=now('src/generated/dialogue-voices.json');revised=[];unchanged=0
oldrows={(r['dialogue'],r['index']):r for r in old('content/voices/dialogue-provenance.json')['records']}
newrows={(r['dialogue'],r['index']):r for r in current}
delivery_revisions=[]
for scene,takes in old('src/generated/dialogue-voices.json').items():
 assert scene in latest and len(latest[scene]['lines'])==len(takes),('Historical scene removed',scene)
 for i,take in enumerate(takes):
  a,b=prior[scene]['lines'][i],latest[scene]['lines'][i]
  same=(plain(a['line']),a['speaker'],prior[scene].get('speed'))==(plain(b['line']),b['speaker'],latest[scene].get('speed'))
  if same:
   if maps[scene][i]==take:unchanged+=1
   else:
    assert args.voice_refresh,('Unchanged scene mapping changed',scene,i)
    arow,brow=oldrows[(scene,i)],newrows[(scene,i)]
    assert arow['delivery']!=brow['delivery'] or arow['clearUrl']!=brow['clearUrl'],('Unexplained voice revision',scene,i)
    assert (arow['text'],arow['speaker'])==(brow['text'],brow['speaker'])
    delivery_revisions.append({'scene':scene,'index':i,'speaker':brow['speaker']})
  else:
   new=maps[scene][i]
   assert new['text']==plain(b['line']) and new['speaker']==b['speaker'],('Revised scene mis-mapped',scene,i)
   revised.append({'scene':scene,'index':i,'before':take['text'],'after':new['text']})
kanji=old('content/sources/kanjidic2.json');latestkanji=now('content/sources/kanjidic2.json')
assert kanji['source']==latestkanji['source']
chars={c['literal']:c for c in latestkanji['characters']}
assert all(chars[c['literal']]==c for c in kanji['characters'])
object_format=subprocess.check_output(['git','rev-parse','--show-object-format'],cwd=root).decode().strip()
for item in subprocess.check_output(['git','ls-tree','-r',args.base,'public/strokes'],cwd=root).decode().splitlines():
 metadata,name=item.split('\t',1);expected=metadata.split()[2]
 data=(root/name).read_bytes()
 actual=hashlib.new(object_format,b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
 assert actual==expected,('Historical stroke bytes changed',name)
urls=set()
def collect(v):
 if isinstance(v,str) and v.startswith('/audio/'):urls.add(v)
 elif isinstance(v,dict):
  for x in v.values():collect(x)
 elif isinstance(v,list):
  for x in v:collect(x)
for name in ['audio','violetto-baseline','violetto-auditions','violetto-emotions','violetto-teacher','dialogue-voices','cast-auditions']:collect(now(f'src/generated/{name}.json'))
active_urls=set(urls)
# Superseded speaker takes remain explicitly indexed and hash-checked in history.
# They are intentional archived recordings, not unreferenced loose WAVs.
collect(history)
if args.voice_refresh:
 collect(now('content/voices/teacher-provenance.json').get('historicalRecords',[]))
 collect(records)
 # Same-text cast references and superseded teacher takes remain auditable.
 collect(now('content/voices/cast-provenance.json'))
files=subprocess.check_output(['git','ls-files','--others','--exclude-standard','public/audio'],cwd=root).decode().splitlines()
assert all('/'+name.removeprefix('public/') in urls for name in files),'New orphan audio'
report={'base':args.base,'oldClearKeysPreserved':len(before)-len(changed_clear),'authorizedLexicalCorrections':changed_clear,'unchangedDialogueMappingsPreserved':unchanged,'revisedDialogueMappings':revised,'authorizedDeliveryRevisions':delivery_revisions,'historicalDialogueRecords':len(history),'newWavsMapped':len(files),'newWavsActive':sum('/'+name.removeprefix('public/') in active_urls for name in files),'newWavsArchived':sum('/'+name.removeprefix('public/') not in active_urls for name in files),'oldKanjiAndStrokesUnchanged':True}
(root/'output/course-preservation-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f"Preserved {len(before)-len(changed_clear)} Clear mappings; {len(changed_clear)} lexical corrections, {len(delivery_revisions)} authorized delivery revisions, {len(revised)} scene-text revisions. {len(history)} historical takes retained. All {len(files)} new WAVs referenced.")
