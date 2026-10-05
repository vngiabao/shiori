"""Check every shipped pronunciation query and lossless audio artifact."""
import hashlib,json
from pathlib import Path
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parent.parent
p=json.loads((root/'content/voices/lesson-provenance.json').read_text(encoding='utf-8'))
m=json.loads((root/'src/generated/audio.json').read_text(encoding='utf-8'))
records=p['records'];indexed={r['url']:r for r in records}
assert set(m.values())<=set(indexed)
single=0
for r in records:
    path=root/'public'/r['url'].lstrip('/')
    assert hashlib.sha256(path.read_bytes()).hexdigest()==r['sha256']
    pcm,sr=sf.read(path)
    assert sr==24000 and pcm.ndim==1 and np.isfinite(pcm).all()
    assert .01<float(np.max(np.abs(pcm)))<.99
    assert abs(len(pcm)/sr-r['seconds'])<1/sr
    if r['singleMora']:
        phrases=r['query']['accent_phrases']
        assert len(phrases)==1 and len(phrases[0]['moras'])==1
        mora=phrases[0]['moras'][0]
        assert mora['vowel'] in ['a','i','u','e','o','N']
        assert mora['vowel_length']==.22 and not phrases[0]['is_interrogative']
        assert .35<r['seconds']<.7
        single+=1
for text,vowel in [('あ','a'),('い','i'),('う','u'),('え','e'),('お','o')]:
    r=indexed[m[text]]
    mora=r['query']['accent_phrases'][0]['moras'][0]
    assert mora['vowel']==vowel and mora['consonant'] is None
for text in ['あい','あ、い。','あ い']:
    moras=[x for p in indexed[m[text]]['query']['accent_phrases'] for x in p['moras']]
    assert [x['vowel'] for x in moras]==['a','i'],(text,moras)
    assert all(x['consonant'] is None for x in moras)
report={'clips':len(records),'manifestKeys':len(m),'singleKana':single,'pcmDecode':True,'contentHashes':True,'singleMoraQueries':True,'noExtraPhonemesInVowels':True,'reviewLimit':'Signal and synthesis-query checks do not certify perceived pronunciation or acting similarity. ASR and human listening are separate.'}
(root/'output/lesson-audio-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
