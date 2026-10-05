"""Validate same-speaker delivery variety and unchanged learning audio."""
import json,hashlib
from pathlib import Path
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parent.parent
p=json.loads((root/'content/voices/emotion-provenance.json').read_text(encoding='utf-8'))
original=json.loads((root/'content/voices/lesson-provenance.json').read_text(encoding='utf-8'))
roster=json.loads((root/'content/voices/violetto.json').read_text(encoding='utf-8'))
manifest=json.loads((root/'src/generated/violetto-emotions.json').read_text(encoding='utf-8'))
assert hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()==p['lessonManifestSha256']
assert p['styleId']==14
def phonemes(q):return [(m['text'],m['consonant'],m['vowel']) for a in q['accent_phrases'] for m in a['moras']]
for r in p['records']:
    assert r['text']==roster['lines'][r['reaction']]['text']
    baseline=next(x for x in original['records'] if x['text']==r['text'])
    assert phonemes(r['query'])==phonemes(baseline['query'])
    path=root/'public'/r['url'].lstrip('/')
    assert hashlib.sha256(path.read_bytes()).hexdigest()==r['sha256']
    pcm,sr=sf.read(path)
    assert pcm.ndim==1 and sr==24000 and np.isfinite(pcm).all()
    assert .01<np.max(np.abs(pcm))<.99
    assert .75<r['seconds']/baseline['seconds']<1.3
for key,takes in manifest.items():
    assert len(takes)==(1 if roster['lines'][key]['mood']=='clear' else 2)
    assert len({t['url'] for t in takes})==len(takes)
report={'expressiveClips':len(p['records']),'sameSpeaker':True,'allSpokenTextMatches':True,'phonemeSequencesUnchanged':True,'approvedLessonManifestUnchanged':True,'signalAndHashChecks':True,'perceptualReview':'Delivery labels are targets, not a measured emotion or similarity score.'}
(root/'output/emotion-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
