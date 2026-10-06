"""Reproduce short-utterance errors without modifying shipped audio."""
import json, os
from pathlib import Path
import soundfile as sf
import onnxruntime as ort
from kokoro_onnx import Kokoro
from misaki.ja import JAG2P
root=Path(__file__).resolve().parent.parent
out=root/'output/pronunciation'; out.mkdir(exist_ok=True)
g=JAG2P(); records=[]
opts=ort.SessionOptions(); opts.intra_op_num_threads=2; opts.inter_op_num_threads=1
for precision in ['int8','full']:
    path=root/'.models'/('kokoro-v1.0.int8.onnx' if precision=='int8' else 'kokoro-v1.0.onnx')
    model=Kokoro.from_session(ort.InferenceSession(str(path),sess_options=opts,providers=['CPUExecutionProvider']),str(root/'.models/voices-v1.0.bin'))
    for i,text in enumerate(['あ','い','う','え','お','あい','あ。','い。','あ、い。','か','き','こんにちは。','切手を二枚お願いします。明日、手紙を出します。']):
        pcm,sr=model.create(g(text),voice='jf_alpha',speed=1,is_phonemes=True)
        target=out/f'{precision}-{i:02}.wav';sf.write(target,pcm,sr)
        records.append({'text':text,'phonemes':g(text),'precision':precision,'path':str(target),'seconds':len(pcm)/sr})
        print(precision,text,round(len(pcm)/sr,2),flush=True)
(out/'probes.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
