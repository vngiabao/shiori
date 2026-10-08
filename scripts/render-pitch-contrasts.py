"""Replace only the two verified lexical examples; preserve all historic WAVs."""
import hashlib,importlib.util,json,sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('voice',root/'scripts/render-japanese-voice.py')
voice=importlib.util.module_from_spec(spec);spec.loader.exec_module(voice)
path=root/'src/generated/audio.json'
manifest=json.loads(path.read_text(encoding='utf8'));before=dict(manifest)
provpath=root/'content/voices/lesson-provenance.json'
prov=json.loads(provpath.read_text(encoding='utf8'))
for text in voice.contrasts:
    row=voice.render(text)
    manifest[text]=row['url']
    if not any(r['text']==text and r['url']==row['url'] for r in prov['records']):prov['records'].append(row)
    print(text, row['url'], row['seconds'])
assert all(manifest[t]==url for t,url in before.items() if t not in voice.contrasts)
path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf8',newline='\n')
provpath.write_text(json.dumps(prov,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8',newline='\n')
