"""Render speaker-specific dialogue assets without changing Clear-mode audio."""
import argparse,hashlib,importlib.util,json,sys
sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime,timezone
from pathlib import Path
root=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('voice',root/'scripts/render-japanese-voice.py')
voice=importlib.util.module_from_spec(spec);spec.loader.exec_module(voice)
def read(path):return json.loads((root/path).read_text(encoding='utf-8'))
def write(path,value):(root/path).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
pin=hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()
config=read('content/voices/dialogue-speakers.json')
original=read('content/voices/lesson-provenance.json')['records']
clear=read('src/generated/audio.json')
indexed={(r['text'],r['url']):r for r in original}
parser=argparse.ArgumentParser();parser.add_argument('--incremental',action='store_true');args=parser.parse_args()
previous=read('content/voices/dialogue-provenance.json') if args.incremental else {}
old=previous.get('records',[])
manifest={};records=[];count=0
for pack in voice.packs:
    for dialogue in pack.get('dialogues',[]):
        takes=[]
        for i,line in enumerate(dialogue['lines']):
            text=voice.plain(line['line']);speaker=line['speaker']
            setting={**config['speakers'][speaker]}
            if dialogue.get('speed') is not None:setting['speed']=dialogue['speed']
            baseline=indexed[(text,clear[text])]
            voice.readings[text]=baseline['readingInput']
            cached=next((r for r in old if r['dialogue']==dialogue['id'] and r['index']==i and r['text']==text and r['speaker']==speaker and r['delivery']==setting and r['clearUrl']==clear[text]),None)
            row=cached if cached else voice.render(text,setting['mood'],setting)
            phonemes=lambda q:[(m['text'],m['consonant'],m['vowel']) for a in q['accent_phrases'] for m in a['moras']]
            assert phonemes(row['query'])==phonemes(baseline['query']),(dialogue['id'],i)
            take={k:row[k] for k in ['text','url','seconds','sha256','mood']}
            take.update(speaker=speaker,index=i)
            takes.append(take)
            records.append({**row,'dialogue':dialogue['id'],'index':i,'speaker':speaker,'delivery':setting,'clearUrl':clear[text]})
            count+=1;print(f'Rendered dialogue {count}: {dialogue["id"]}/{i} ({speaker})',flush=True)
        manifest[dialogue['id']]=takes
assert hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()==pin
write('src/generated/dialogue-voices.json',manifest)
current_signatures={json.dumps(r,sort_keys=True,ensure_ascii=False) for r in records}
historical={json.dumps(r,sort_keys=True,ensure_ascii=False):r for r in previous.get('historicalRecords',[])+old if json.dumps(r,sort_keys=True,ensure_ascii=False) not in current_signatures}
write('content/voices/dialogue-provenance.json',{
 'createdAt':datetime.now(timezone.utc).isoformat(),'engine':'VOICEVOX Core 0.17.0',
 'styleId':voice.style,'modelSha256':hashlib.sha256(voice.model_path.read_bytes()).hexdigest(),
 'credit':'VOICEVOX:冥鳴ひまり','lessonManifestSha256':pin,
 'configSha256':hashlib.sha256((root/'content/voices/dialogue-speakers.json').read_bytes()).hexdigest(),
 'humanListeningReviewed':False,'records':records,'historicalRecords':list(historical.values())})
print(f'Published {count} dialogue takes. Clear audio unchanged.',flush=True)
