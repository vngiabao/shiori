"""Add same-speaker reaction deliveries without touching approved lesson audio."""
import importlib.util,json,hashlib
from pathlib import Path
from datetime import datetime,timezone
root=Path(__file__).resolve().parent.parent
before=hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()
spec=importlib.util.spec_from_file_location('japanese_renderer',Path(__file__).with_name('render-japanese-voice.py'))
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
config=json.loads((root/'content/voices/emotions.json').read_text(encoding='utf-8'))
baseline=json.loads((root/'src/generated/violetto-baseline.json').read_text(encoding='utf-8'))
manifest={};records=[]
for key,line in r.roster['lines'].items():
    if line['mood']=='clear':
        manifest[key]=[{**baseline[key],'name':'Clear lesson speech','text':line['text'],'mood':'clear'}]
        continue
    takes=[]
    for settings in config['moods'][line['mood']]['takes']:
        row=r.render(line['text'],line['mood'],settings)
        records.append({**row,'reaction':key,'delivery':settings})
        takes.append({**{k:row[k] for k in ['url','seconds','sha256','text','mood']},'name':settings['name']})
        print(key,settings['name'],round(row['seconds'],2),flush=True)
    assert len({t['sha256'] for t in takes})==2,key
    manifest[key]=takes
assert before==hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()
(root/'src/generated/violetto-emotions.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'content/voices/emotion-provenance.json').write_text(json.dumps({'generatedAt':datetime.now(timezone.utc).isoformat(),'engine':'VOICEVOX Core 0.17.0','model':'VVM 0.16.4 / 1.vvm','styleId':14,'credit':config['voice'],'lessonManifestSha256':before,'humanListeningReviewed':False,'records':records},ensure_ascii=False,indent=2),encoding='utf-8')
print('Published',len(records),'expressive reaction clips; approved lesson manifest unchanged.',flush=True)
