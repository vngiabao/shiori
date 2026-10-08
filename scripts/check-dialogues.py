"""Verify speaker mappings, signal integrity and untouched Clear recordings."""
import hashlib,json,math
from pathlib import Path
from voice_delivery import scene_delivery
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
overlaps=[]
for pack in read('src/generated/packs.json'):
    for d in pack.get('dialogues',[]):
        assert len(d['lines'])==len(manifest[d['id']])
        for i,line in enumerate(d['lines']):
            import re
            text=re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\1',line['line'])
            take=manifest[d['id']][i];row=records[(d['id'],i)]
            assert take['text']==row['text']==text
            assert take['speaker']==row['speaker']==line['speaker'] and take['index']==i
            setting=scene_delivery(config['speakers'][line['speaker']],d)
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
            gap=line.get('gapAfterMs',380)
            if gap<0:
                assert i+1<len(d['lines']) and line['speaker']!=d['lines'][i+1]['speaker']
                next_pcm,next_sr=sf.read(root/'public'/manifest[d['id']][i+1]['url'].lstrip('/'))
                active=np.flatnonzero(np.abs(pcm)>.001)
                next_active=np.flatnonzero(np.abs(next_pcm)>.001)
                assert len(active) and len(next_active) and next_sr==sr
                signal_overlap=-gap-(len(pcm)-active[-1])/sr*1000-next_active[0]/sr*1000
                assert signal_overlap>=20, ('Overlap is only silence',d['id'],i,signal_overlap)
                samples=round(-gap/1000*sr)
                combined_peak=float(np.max(np.abs(pcm[-samples:]+next_pcm[:samples])))
                assert combined_peak<.99, ('Overlapping signals clip',d['id'],i,combined_peak)
                overlaps.append({'dialogue':d['id'],'index':i,'signalWindowOverlapMs':round(signal_overlap,2),'combinedPeak':round(combined_peak,4)})
            count+=1
assert count==len(records)
for row in p.get('historicalRecords',[]):
    path=root/'public'/row['url'].lstrip('/')
    assert hashlib.sha256(path.read_bytes()).hexdigest()==row['sha256'], ('Historical dialogue changed',row['dialogue'],row['index'])
report={'dialogueTakes':count,'speakers':sorted({r['speaker'] for r in p['records']}),'configuredSpeakers':list(config['speakers']),
 'allSpeakerTextMappingsValid':True,'phonemeSequencesUnchanged':True,
 'clearLessonManifestMatchesRenderPin':True,'signalAndHashesValid':True,'timedOverlaps':overlaps,
 'overlapCheck':'Amplitude windows above 0.001, not phonemic or native listening review.', 'humanListeningReviewed':False}
(root/'output/dialogue-audio-check.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8', newline='\n')
print(json.dumps(report,indent=2))
