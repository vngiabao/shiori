"""Create local Japanese synthetic reference and provisional character lines."""
import json, hashlib
from pathlib import Path
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro
from misaki.ja import JAG2P
root=Path(__file__).resolve().parent.parent
roster=json.loads((root/'content/voices/violetto.json').read_text(encoding='utf-8'))
out=root/'public/voice-auditions';out.mkdir(exist_ok=True)
opts=ort.SessionOptions();opts.intra_op_num_threads=2;opts.inter_op_num_threads=1
session=ort.InferenceSession(str(root/'.models/kokoro-v1.0.int8.onnx'),sess_options=opts,providers=['CPUExecutionProvider'])
model=Kokoro.from_session(session,str(root/'.models/voices-v1.0.bin'));g2p=JAG2P()
def synth(text,path):
    if not path.exists():
        pcm,sr=model.create(g2p(text),voice='jf_alpha',speed=1.0,is_phonemes=True)
        sf.write(path,pcm,sr,subtype='PCM_16')
    return {'url':'/voice-auditions/'+path.name,'seconds':sf.info(path).duration,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
synth(roster['anchorText'],out/'synthetic-anchor.wav')
assets={}
for key,line in roster['lines'].items():
    assets[key]=synth(line['text'],out/f'baseline-{key}.wav')
    print('Baseline',key,flush=True)
(root/'src/generated/violetto-legacy-baseline.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
