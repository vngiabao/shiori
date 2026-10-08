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
categories={
 'welcome':(['composed','warm'],['welcome']),
 'correct':(['proud','composed','warm'],['proud','celebrate']),
 'retry':(['warm','precise'],['encourage','review']),
 'supported':(['warm','precise'],['hint','keepgoing']),
 'hint':(['precise','warm'],['hint','think']),
 'politeness':(['precise'],['politeness']),
 'complete':(['proud','reflective'],['levelup','proud']),
 'return':(['warm','composed'],['welcome','keepgoing']),
 'milestone':(['proud','composed'],['celebrate','proud']),
 'rest':(['reflective','warm'],['tea'])}
settings={
 'composed':{'speed':1.0,'intonation':.94,'pitch':-.015,'pauseScale':.96},
 'warm':{'speed':.99,'intonation':1.16,'pitch':-.015,'pauseScale':.98},
 'proud':{'speed':1.03,'intonation':1.45,'pitch':-.015,'pauseScale':.86},
 'precise':{'speed':1.01,'intonation':1.04,'pitch':-.015,'pauseScale':.92},
 'reflective':{'speed':.97,'intonation':.86,'pitch':-.015,'pauseScale':1.04}}
centres={'composed':-.25,'warm':.25,'proud':.5,'precise':0,'reflective':-.5}
previous=read('content/voices/teacher-provenance.json')
counts={};library=[];records=[]
with (root/'content/voices/reaction-lines.tsv').open(encoding='utf-8',newline='') as f:
    lines=list(csv.DictReader(f,delimiter='\t'))
assert len(lines)==100,len(lines)
assert len({voice.plain(l['ruby']) for l in lines})==100
for i,line in enumerate(lines):
    key=line['category'];n=counts.get(key,0);counts[key]=n+1
    moods,poses=categories[key];mood=moods[n%len(moods)]
    text=voice.plain(line['ruby']);reading=ruby_reading(line['ruby'])
    voice.readings[text]=reading
    delivery={**settings[mood],'semitones':centres[mood]}
    delivery['speed']=round(max(.96,min(1.04,delivery['speed']+[-.01,0,.01][n%3])),2)
    cached=next((r for r in previous['records'] if r['text']==text and r['readingInput']==reading and r['delivery']==delivery),None)
    row=cached if cached else voice.render(text,mood,delivery)
    item={'id':f'{key}-{n+1:02d}','category':key,'text':text,'reading':reading,
          'ruby':line['ruby'],'romaji':line['romaji'],'meaning':line['meaning'],
          'mood':mood,'pose':poses[n%len(poses)],'url':row['url'],
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
 'records':records,
 'historicalRecords':list(historical.values())})
print('Published 100 teacher lines. All lesson recordings preserved.',flush=True)
