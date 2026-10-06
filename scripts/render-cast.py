"""A same-text audition for the course cast. One original Violetto voice, native synthesis only."""
import hashlib,importlib.util,json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('voice',root/'scripts/render-japanese-voice.py')
voice=importlib.util.module_from_spec(spec);spec.loader.exec_module(voice)
config=json.loads((root/'content/voices/dialogue-speakers.json').read_text(encoding='utf-8'))
text='今日はよろしくお願いします。予定を確認しましょう。'
reference=voice.render(text)
records=[]
for name,setting in config['speakers'].items():
    record=voice.render(text,setting['mood'],setting)
    records.append({**record,'speaker':name,'description':setting['description'],'delivery':setting})
def write(path,v): (root/path).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
write('src/generated/cast-auditions.json',[{k:r[k] for k in ['speaker','description','text','url','mood']} for r in records])
write('content/voices/cast-provenance.json',{'styleId':14,'configSha256':hashlib.sha256((root/'content/voices/dialogue-speakers.json').read_bytes()).hexdigest(),'reference':reference,'records':records,'humanListeningReviewed':False})
print(f'Published {len(records)} cast auditions.')
