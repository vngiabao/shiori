"""Preserve old recordings; permit mappings to change only for changed scene inputs."""
import argparse,hashlib,json,re,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser();parser.add_argument('--base',default='HEAD');args=parser.parse_args()
def old(path):return json.loads(subprocess.check_output(['git','show',f'{args.base}:{path}'],cwd=root))
def now(path):return json.loads((root/path).read_text(encoding='utf-8'))
def digest(url):return hashlib.sha256((root/'public'/url.lstrip('/')).read_bytes()).hexdigest()
def signature(r):return json.dumps(r,sort_keys=True,ensure_ascii=False)
def plain(t):return re.sub(r'\{([^|{}]+)\|[^{}]+\}',r'\1',t)
before=old('src/generated/audio.json');after=now('src/generated/audio.json')
assert all(after.get(k)==v for k,v in before.items()),'Historical Clear mapping changed'
records=now('content/voices/lesson-provenance.json')['records'];recordset=set(map(signature,records))
for row in old('content/voices/lesson-provenance.json')['records']:
 assert signature(row) in recordset and digest(row['url'])==row['sha256'],('Historical Clear recording changed',row['text'])
dialogue=now('content/voices/dialogue-provenance.json');current=dialogue['records'];history=dialogue.get('historicalRecords',[])
allrows=set(map(signature,current+history))
for row in old('content/voices/dialogue-provenance.json')['records']+old('content/voices/dialogue-provenance.json').get('historicalRecords',[]):
 assert signature(row) in allrows and digest(row['url'])==row['sha256'],('Historical dialogue recording changed',row['dialogue'],row['index'])
def scenes(packs):return {d['id']:d for p in packs for d in p.get('dialogues',[])}
prior=scenes(old('src/generated/packs.json'));latest=scenes(now('src/generated/packs.json'))
maps=now('src/generated/dialogue-voices.json');revised=[];unchanged=0
for scene,takes in old('src/generated/dialogue-voices.json').items():
 assert scene in latest and len(latest[scene]['lines'])==len(takes),('Historical scene removed',scene)
 for i,take in enumerate(takes):
  a,b=prior[scene]['lines'][i],latest[scene]['lines'][i]
  same=(plain(a['line']),a['speaker'],prior[scene].get('speed'))==(plain(b['line']),b['speaker'],latest[scene].get('speed'))
  if same:
   assert maps[scene][i]==take,('Unchanged scene mapping changed',scene,i)
   unchanged+=1
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
files=subprocess.check_output(['git','ls-files','--others','--exclude-standard','public/audio'],cwd=root).decode().splitlines()
assert all('/'+name.removeprefix('public/') in urls for name in files),'New orphan audio'
report={'base':args.base,'oldClearKeysPreserved':len(before),'unchangedDialogueMappingsPreserved':unchanged,'revisedDialogueMappings':revised,'historicalDialogueRecords':len(history),'newWavsMapped':len(files),'oldKanjiAndStrokesUnchanged':True}
(root/'output/course-preservation-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f"Preserved {len(before)} Clear keys and {unchanged} unchanged dialogue mappings; {len(revised)} authorised scene revisions correctly mapped, {len(history)} historical takes retained. All {len(files)} new WAVs referenced.")
