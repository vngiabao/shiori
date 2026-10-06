import json,hashlib
from pathlib import Path
import numpy as np
import soundfile as sf
root=Path(__file__).resolve().parent.parent
manifest=json.loads((root/'src/generated/violetto-auditions.json').read_text(encoding='utf-8'))
results=[]
for candidate in manifest['candidates']:
    for name,record in candidate['lines'].items():
        path=root/'public'/record['url'].lstrip('/')
        audio,sr=sf.read(path)
        assert audio.ndim==1 and sr==24000
        assert np.isfinite(audio).all() and .25<len(audio)/sr<30
        assert .01<float(np.max(np.abs(audio)))<.99
        assert hashlib.sha256(path.read_bytes()).hexdigest()==record['sha256']
        results.append({'voice':candidate['id'],'line':name,'duration':round(len(audio)/sr,3),'peak':round(float(np.max(np.abs(audio))),4),'bytes':path.stat().st_size})
(root/'output/voice-audio-check.json').write_text(json.dumps({'checked':len(results),'totalBytes':sum(r['bytes'] for r in results),'checks':'Mono 24kHz decoding, finite non-silent signal, duration, peak ceiling, SHA-256. Does not certify pronunciation or similarity.','results':results},indent=2),encoding='utf-8', newline='\n')
print('Passed',len(results),'audition clips;',round(sum(r['bytes'] for r in results)/1048576,2),'MiB')
