"""Verify speaker mappings, signal integrity and untouched Clear recordings."""
import hashlib,json,math
from pathlib import Path
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parent.parent
def read(path):return json.loads((root/path).read_text(encoding='utf-8'))
p=read('content/voices/dialogue-provenance.json')
manifest=read('src/generated/dialogue-voices.json')
config=read('content/voices/dialogue-speakers.json')
assert p['styleId']==14
assert hashlib.sha256((root/'src/generated/audio.json').read_bytes()).hexdigest()==p['lessonManifestSha256']
assert hashlib.sha256((root/'content/voices/dialogue-speakers.json').read_bytes()).hexdigest()==p['configSha256']
clear={(r['text'],r['url']):r for r in read('content/voices/lesson-provenance.json')['records']}
records={(r['dialogue'],r['index']):r for r in p['records']}
count=0
for pack in read('src/generated/packs.json'):
    for d in pack.get('dialogues',[]):
        assert len(d['lines'])==len(manifest[d['id']])
        for i,line in enumerate(d['lines']):
            import re
            text=re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\1',line['line'])
            take=manifest[d['id']][i];row=records[(d['id'],i)]
            assert take['text']==row['text']==text
            assert take['speaker']==row['speaker']==line['speaker'] and take['index']==i
            setting={**config['speakers'][line['speaker']]}
            if d.get('speed') is not None:setting['speed']=d['speed']
            assert row['delivery']==setting and take['mood']==setting['mood']
            baseline=clear[(text,row['clearUrl'])]
            assert row['readingInput']==baseline['readingInput']
            flatten=lambda q:[m for a in q['accent_phrases'] for m in a['moras']]
            before,after=flatten(baseline['query']),flatten(row['query'])
            assert len(before)==len(after)
            for a,b in zip(before,after):
                assert (a['text'],a['consonant'],a['vowel'])==(b['text'],b['consonant'],b['vowel'])
                if a['pitch']>0:
                    shift=(b['pitch']-a['pitch'])*2**row['query']['pitch_scale']*12/math.log(2)
                    assert abs(shift-setting['semitones'])<.0001
            assert abs(setting['semitones'])<=.5 and .96<=setting['speed']<=1.25
            assert row['query']['speed_scale']==setting['speed']
            path=root/'public'/take['url'].lstrip('/')
            assert take['url']==row['url'] and take['sha256']==row['sha256']==hashlib.sha256(path.read_bytes()).hexdigest()
            pcm,sr=sf.read(path)
            assert sr==24000 and pcm.ndim==1 and np.isfinite(pcm).all()
            assert .01<np.max(np.abs(pcm))<.99 and abs(len(pcm)/sr-take['seconds'])<1/sr
            count+=1
assert count==len(records)
report={'dialogueTakes':count,'speakers':sorted({r['speaker'] for r in p['records']}),'configuredSpeakers':list(config['speakers']),
 'allSpeakerTextMappingsValid':True,'phonemeSequencesUnchanged':True,
 'clearLessonManifestUnchanged':True,'signalAndHashesValid':True,'humanListeningReviewed':False}
(root/'output/dialogue-audio-check.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8', newline='\n')
print(json.dumps(report,indent=2))
