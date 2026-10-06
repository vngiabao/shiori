"""Advance the manifest pin only after every preserved expressive clip passes its hash and phoneme checks."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
path=root/'content/voices/emotion-provenance.json'
p=json.loads(path.read_text(encoding='utf-8'))
baseline=json.loads((root/'content/voices/lesson-provenance.json').read_text(encoding='utf-8'))['records']
def phones(q): return [(m['text'],m['consonant'],m['vowel']) for a in q['accent_phrases'] for m in a['moras']]
for r in p['records']:
    assert hashlib.sha256((root/'public'/r['url'].lstrip('/')).read_bytes()).hexdigest()==r['sha256']
    assert any(b['text']==r['text'] and phones(b['query'])==phones(r['query']) for b in baseline)
p['lessonManifestSha256']=hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()
path.write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
print('Preserved expressive audio verified; lesson manifest pin refreshed.')
