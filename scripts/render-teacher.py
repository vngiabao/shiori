"""Render only the authored teacher library with native delivery controls.

Never regenerate course packs or lesson recordings.
Run with .audio-py312/Scripts/python.exe scripts/render-teacher.py.
"""
import csv,hashlib,importlib.util,json,re,sys
sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime,timezone
from pathlib import Path
root=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('voice',root/'scripts/render-japanese-voice.py')
voice=importlib.util.module_from_spec(spec);spec.loader.exec_module(voice)
def read(path):return json.loads((root/path).read_text(encoding='utf-8'))
def write(path,value):
    options={'separators':(',',':')} if path=='content/voices/lesson-provenance.json' else {'indent':2}
    (root/path).write_text(json.dumps(value,ensure_ascii=False,**options)+'\n',encoding='utf-8', newline='\n')
def ruby_reading(text):return re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\2',text)
roster=read('content/voices/teacher-roster.json')
settings=roster['moods']
previous=read('content/voices/teacher-provenance.json')
counts={};library=[];records=[]
with (root/'content/voices/reaction-lines.tsv').open(encoding='utf-8',newline='') as f:
    lines=list(csv.DictReader(f,delimiter='\t'))
assert len(lines)==100,len(lines)
assert len({voice.plain(l['ruby']) for l in lines})==100
for i,line in enumerate(lines):
    key=line['category'];n=counts.get(key,0);counts[key]=n+1
    mood=line['mood'];pose=line['pose']
    text=voice.plain(line['ruby']);reading=ruby_reading(line['ruby'])
    voice.readings[text]=reading
    delivery={k:v for k,v in settings[mood].items() if k!='description'}
    delivery['speed']=float(line['speed'])
    assert .96<=delivery['speed']<=1.04 and abs(delivery['semitones'])<=.5
    cached=next((r for r in previous['records'] if r['text']==text and r['readingInput']==reading and r['delivery']==delivery),None)
    row=cached if cached else voice.render(text,mood,delivery)
    item={'id':f'{key}-{n+1:02d}','category':key,'text':text,'reading':reading,
          'ruby':line['ruby'],'romaji':line['romaji'],'meaning':line['meaning'],
          'mood':mood,'pose':pose,'url':row['url'],
          'seconds':row['seconds'],'sha256':row['sha256'],'delivery':delivery}
    library.append(item);records.append({**row,'id':item['id'],'delivery':delivery})
    print(f'Rendered teacher {i+1}/100: {item["id"]}',flush=True)
write('src/generated/violetto-teacher.json',library)
current_signatures={json.dumps(r,sort_keys=True,ensure_ascii=False) for r in records}
historical={json.dumps(r,sort_keys=True,ensure_ascii=False):r for r in previous.get('historicalRecords',[])+previous['records'] if json.dumps(r,sort_keys=True,ensure_ascii=False) not in current_signatures}
write('content/voices/teacher-provenance.json',{
 'createdAt':datetime.now(timezone.utc).isoformat(),'styleId':voice.style,
 'engine':'VOICEVOX Core 0.17.0','model':'VVM 0.16.4 / 1.vvm',
 'modelSha256':hashlib.sha256(voice.model_path.read_bytes()).hexdigest(),
 'credit':'VOICEVOX:冥鳴ひまり','humanListeningReviewed':False,
 'pitchMethod':'Native log-F0 centre offset, not playback resampling. Intonation contour may vary independently.',
 'implementationSource':'https://github.com/VOICEVOX/voicevox_core/blob/0.17.0/crates/voicevox_core/src/engine/talk/interpret_query.rs',
 'authorSha256':hashlib.sha256((root/'content/voices/reaction-lines.tsv').read_bytes()).hexdigest(),
 'rosterSha256':hashlib.sha256((root/'content/voices/teacher-roster.json').read_bytes()).hexdigest(),
 'records':records,
 'historicalRecords':list(historical.values())})
print('Published 100 teacher lines. All lesson recordings preserved.',flush=True)
