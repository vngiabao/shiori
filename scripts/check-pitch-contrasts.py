"""Verify the actual WAV pitch direction, not merely different URL strings.

Autocorrelation is restricted to the approved voice's plausible pitch register.
This checks isolated vowel centres, not connected-speech accent correctness.
"""
import hashlib,json,math
from pathlib import Path
import numpy as np,soundfile as sf
root=Path(__file__).resolve().parent.parent
def read(p):return json.loads((root/p).read_text(encoding='utf8'))
manifest=read('src/generated/audio.json')
records={(r['text'],r['url']):r for r in read('content/voices/lesson-provenance.json')['records']}

def f0_in_window(pcm,sr,start,end):
    values=[];size=round(sr*.04);step=round(sr*.005)
    for at in range(round(start*sr),round(end*sr)-size+1,step):
        frame=pcm[at:at+size].copy()
        if np.sqrt(np.mean(frame**2))<.003:continue
        frame-=np.mean(frame)
        correlation=np.correlate(frame,frame,mode='full')[size-1:]
        low,high=round(sr/400),round(sr/160)
        peaks=[i for i in range(low+1,high-1) if correlation[i]>correlation[i-1] and correlation[i]>=correlation[i+1]]
        if not peaks:continue
        lag=max(peaks,key=lambda i:correlation[i])
        if correlation[lag]/correlation[0]<.55:continue
        # Fractional lag avoids rounding a three-semitone contrast to bins.
        left,mid,right=correlation[lag-1:lag+2]
        denominator=left-2*mid+right
        lag+=.5*(left-right)/denominator if abs(denominator)>1e-12 else 0
        values.append(sr/lag)
    assert len(values)>=3,('Too few voiced frames',start,end,values)
    return float(np.median(values))

report=[]
for entry in read('content/voices/pitch-contrasts.json')['entries']:
    r=records[(entry['text'],manifest[entry['text']])];q=r['query']
    assert r['lexicalContrast']==entry
    moras=[m for a in q['accent_phrases'] for m in a['moras']]
    assert [(m['text'],m['consonant'],m['vowel']) for m in moras]==[('ア',None,'a'),('メ','m','e')]
    path=root/'public'/r['url'].lstrip('/')
    assert hashlib.sha256(path.read_bytes()).hexdigest()==r['sha256']
    pcm,sr=sf.read(path);assert sr==24000
    at=q['pre_phoneme_length']/q['speed_scale'];hz=[]
    for mora in moras:
        at+=(mora['consonant_length'] or 0)/q['speed_scale']
        duration=mora['vowel_length']/q['speed_scale']
        hz.append(f0_in_window(pcm,sr,at+.01,at+duration-.005))
        at+=duration
    change=12*math.log2(hz[1]/hz[0])
    assert change<-2 if entry['pattern']=='HL' else change>2,(entry['text'],hz,change)
    report.append({'text':entry['text'],'pattern':entry['pattern'],'url':r['url'],
                   'vowelCentreHz':[round(v,2) for v in hz],'changeSemitones':round(change,2)})
assert len({r['url'] for r in report})==2
(root/'output/pitch-contrast-check.json').write_text(json.dumps({'examples':report,'waveformDirectionVerified':True,'method':'Voiced vowel-centre autocorrelation, 160–400 Hz. Not native listening certification.'},ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
