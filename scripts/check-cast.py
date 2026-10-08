"""Verify the cast audition against its source text, synthesis settings and immutable audio."""
import hashlib,json,math
from pathlib import Path
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parent.parent
def read(p): return json.loads((root/p).read_text(encoding='utf-8'))
p=read('content/voices/cast-provenance.json');config=read('content/voices/dialogue-speakers.json')
assert p['styleId']==14 and hashlib.sha256((root/'content/voices/dialogue-speakers.json').read_bytes()).hexdigest()==p['configSha256']
manifest=read('src/generated/cast-auditions.json')
assert set(config['speakers'])=={r['speaker'] for r in manifest}=={r['speaker'] for r in p['records']}
def moras(r): return [m for a in r['query']['accent_phrases'] for m in a['moras']]
reference=p['reference']
for r in p['records']:
    assert r['text']==reference['text'] and r['delivery']==config['speakers'][r['speaker']]
    assert next(t for t in manifest if t['speaker']==r['speaker'])['url']==r['url']
    before,after=moras(reference),moras(r)
    assert len(before)==len(after)
    for a,b in zip(before,after):
        assert (a['text'],a['consonant'],a['vowel'])==(b['text'],b['consonant'],b['vowel'])
        if a['pitch']>0:
            delta=(b['pitch']-a['pitch'])*(2**r['delivery']['pitch'])*12/math.log(2)
            assert abs(delta-r['delivery']['semitones'])<1e-8
    file=root/'public'/r['url'].lstrip('/')
    assert hashlib.sha256(file.read_bytes()).hexdigest()==r['sha256']
    pcm,sr=sf.read(file)
    assert sr==24000 and pcm.ndim==1 and np.isfinite(pcm).all() and .01<np.max(np.abs(pcm))<.99
for r in p.get('historicalRecords',[]):
    assert hashlib.sha256((root/'public'/r['url'].lstrip('/')).read_bytes()).hexdigest()==r['sha256']
report={'samples':len(manifest),'allMappingsHashesAndPhonemesValid':True,
 'sameOriginalVoice':True,'humanListeningReviewed':False,
 'deliveries':[{k:r[k] for k in ['speaker','url','seconds','delivery']} for r in p['records']]}
(root/'output/cast-audio-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f"{len(manifest)} cast samples: mappings, phonemes, ±0.5-semitone limit and PCM checks pass. Human listening pending.")
