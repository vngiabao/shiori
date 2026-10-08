"""Audit every teacher mapping, phoneme sequence and native pitch offset."""
import csv,hashlib,importlib.util,json,math,re
from pathlib import Path
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('voice',root/'scripts/render-japanese-voice.py')
voice=importlib.util.module_from_spec(spec);spec.loader.exec_module(voice)
def read(path):return json.loads((root/path).read_text(encoding='utf-8'))
p=read('content/voices/teacher-provenance.json');lines=read('src/generated/violetto-teacher.json')
assert p['styleId']==14 and p['modelSha256']==hashlib.sha256(voice.model_path.read_bytes()).hexdigest()
assert p['authorSha256']==hashlib.sha256((root/'content/voices/reaction-lines.tsv').read_bytes()).hexdigest()
assert p['rosterSha256']==hashlib.sha256((root/'content/voices/teacher-roster.json').read_bytes()).hexdigest()
roster=read('content/voices/teacher-roster.json')['moods']
with (root/'content/voices/reaction-lines.tsv').open(encoding='utf-8',newline='') as f:
    authored=list(csv.DictReader(f,delimiter='\t'))
assert len(lines)==len(p['records'])==100
assert len({l['text'] for l in lines})==len({l['id'] for l in lines})==100
indexed={r['id']:r for r in p['records']}
for line,author in zip(lines,authored):
    r=indexed[line['id']];d=line['delivery'];q=r['query']
    assert line['text']==r['text'] and line['reading']==r['readingInput']
    assert voice.plain(line['ruby'])==line['text']
    assert re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\2',line['ruby'])==line['reading']
    assert not re.search('[{}|]',line['reading'])
    assert line['url']==r['url'] and line['sha256']==r['sha256']
    assert line['mood']==author['mood'] and line['pose']==author['pose']
    assert d=={**{k:v for k,v in roster[line['mood']].items() if k!='description'},'speed':float(author['speed'])}
    assert q['intonation_scale']==d['intonation']
    if line['category'] in ('retry','supported','hint','politeness','rest'):
        assert line['mood']!='proud'
    assert .96<=d['speed']<=1.04 and abs(d['semitones'])<=.5
    assert q['speed_scale']==d['speed'] and q['pitch_scale']==-.015
    baseline=voice.s.create_audio_query(line['reading'],voice.style)
    original=[m for a in baseline.accent_phrases for m in a.moras]
    moras=[m for a in q['accent_phrases'] for m in a['moras']]
    assert [(m.text,m.consonant,m.vowel) for m in original]==[(m['text'],m['consonant'],m['vowel']) for m in moras]
    for before,after in zip(original,moras):
        if before.pitch>0:
            shift=(after['pitch']-before.pitch)*(2**q['pitch_scale'])*12/math.log(2)
            assert abs(shift-d['semitones'])<.0001,(line['id'],shift)
    path=root/'public'/line['url'].lstrip('/')
    assert hashlib.sha256(path.read_bytes()).hexdigest()==line['sha256']
    pcm,sr=sf.read(path)
    assert sr==24000 and pcm.ndim==1 and np.isfinite(pcm).all()
    assert .01<np.max(np.abs(pcm))<.99
    assert abs(len(pcm)/sr-line['seconds'])<1/sr
for r in p.get('historicalRecords',[]):
    assert hashlib.sha256((root/'public'/r['url'].lstrip('/')).read_bytes()).hexdigest()==r['sha256']
lengths={'short':sum(l['seconds']<=2.5 for l in lines),
         'medium':sum(2.5<l['seconds']<=4.5 for l in lines),
         'long':sum(l['seconds']>4.5 for l in lines)}
assert lengths['short']>=25 and lengths['medium']>=15 and lengths['long']>=1,lengths
assert max(l['delivery']['intonation'] for l in lines)-min(l['delivery']['intonation'] for l in lines)>=.5
report={'teacherSentences':len(lines),'categories':sorted({l['category'] for l in lines}),
 'moods':sorted({l['mood'] for l in lines}),'allMappingsAndHashesValid':True,
 'nativePhonemeSequencesUnchanged':True,'pitchCentreSemitones':[-.5,.5],
 'authoredMoodPoseAndPaceMatch':True,
 'speedScale':[min(l['delivery']['speed'] for l in lines),max(l['delivery']['speed'] for l in lines)],
 'durationMix':lengths,'secondsRange':[min(l['seconds'] for l in lines),max(l['seconds'] for l in lines)],
 'historicalRecordingsPreserved':len(p.get('historicalRecords',[])),
 'humanListeningReviewed':False}
(root/'output/teacher-audio-check.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8', newline='\n')
print(json.dumps(report,indent=2))
