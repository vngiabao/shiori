"""Render the authored teacher library and repair only targeted/missing clips.

Never regenerate course packs. Existing non-vowel lesson clips are preserved.
Run with .audio-py312/Scripts/python.exe scripts/render-teacher.py.
"""
import csv,hashlib,importlib.util,json,re
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
 'composed':{'speed':1.0,'intonation':.80,'pitch':-.015,'pauseScale':1.02},
 'warm':{'speed':.98,'intonation':.88,'pitch':-.015,'pauseScale':1.08},
 'proud':{'speed':1.02,'intonation':1.02,'pitch':-.015,'pauseScale':.98},
 'precise':{'speed':1.0,'intonation':.82,'pitch':-.015,'pauseScale':1.04},
 'reflective':{'speed':.97,'intonation':.78,'pitch':-.015,'pauseScale':1.12}}
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
    delivery={**settings[mood],'semitones':[-.5,-.25,0,.25,.5][n%5]}
    delivery['speed']=round(max(.96,min(1.04,delivery['speed']+[-.01,0,.01][n%3])),2)
    row=voice.render(text,mood,delivery)
    item={'id':f'{key}-{n+1:02d}','category':key,'text':text,'reading':reading,
          'ruby':line['ruby'],'romaji':line['romaji'],'meaning':line['meaning'],
          'mood':mood,'pose':poses[n%len(poses)],'url':row['url'],
          'seconds':row['seconds'],'sha256':row['sha256'],'delivery':delivery}
    library.append(item);records.append({**row,'id':item['id'],'delivery':delivery})
    print(f'Rendered teacher {i+1}/100: {item["id"]}',flush=True)
write('src/generated/violetto-teacher.json',library)
write('content/voices/teacher-provenance.json',{
 'createdAt':datetime.now(timezone.utc).isoformat(),'styleId':voice.style,
 'engine':'VOICEVOX Core 0.17.0','model':'VVM 0.16.4 / 1.vvm',
 'modelSha256':hashlib.sha256(voice.model_path.read_bytes()).hexdigest(),
 'credit':'VOICEVOX:冥鳴ひまり','humanListeningReviewed':False,
 'pitchMethod':'Native log-F0 centre offset, not playback resampling. Intonation contour may vary independently.',
 'implementationSource':'https://github.com/VOICEVOX/voicevox_core/blob/0.17.0/crates/voicevox_core/src/engine/talk/interpret_query.rs',
 'authorSha256':hashlib.sha256((root/'content/voices/reaction-lines.tsv').read_bytes()).hexdigest(),
 'records':records})
# Repair vowels and newly authored course lines without touching existing takes.
manifest=read('src/generated/audio.json');before=dict(manifest)
provenance=read('content/voices/lesson-provenance.json')
targets=set('あいうえおアイウエオ')|set(voice.texts)-set(manifest)
for text in sorted(targets):
    row=voice.render(text);manifest[text]=row['url']
    provenance['records']=[r for r in provenance['records'] if r['text']!=text]+[row]
    print('Repaired/mapped lesson:',text,flush=True)
assert all(manifest[t]==url for t,url in before.items() if t not in targets)
provenance['teacherPass']={'targets':sorted(targets),'nonTargetMappingsUnchanged':True,
                         'vowelSeconds':.30,'humanListeningReviewed':False}
write('src/generated/audio.json',manifest)
write('content/voices/lesson-provenance.json',provenance)
emotions=read('content/voices/emotion-provenance.json')
emotions['lessonManifestSha256']=hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()
write('content/voices/emotion-provenance.json',emotions)
print('Published 100 teacher lines; lesson mappings:',len(manifest),flush=True)
