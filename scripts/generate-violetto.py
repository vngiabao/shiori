"""Japanese CosyVoice auditions using the existing sibling runtime, without modifying it.
Run with Chinese/.tts-env/Scripts/python.exe. No external API or person recording.
"""
import os
os.environ['HF_HUB_OFFLINE']='1';os.environ['TOKENIZERS_PARALLELISM']='false'
import sys,json,hashlib,time
from pathlib import Path
from datetime import datetime,timezone
root=Path(__file__).resolve().parent.parent
sibling=root.parent/'Chinese'
sys.path[:0]=[str(sibling/'.tts'),str(sibling/'.tts/third_party/Matcha-TTS')]
import numpy as np
import soundfile as sf
import torch
import pyloudnorm as pyln
from cosyvoice.cli.cosyvoice import AutoModel
roster=json.loads((root/'content/voices/violetto.json').read_text(encoding='utf-8'))
out=root/'public/voice-auditions';out.mkdir(exist_ok=True)
torch.set_num_threads(4)
if not torch.cuda.is_available():raise RuntimeError('CUDA is required for this audition renderer.')
model_dir=sibling/'.models/Fun-CosyVoice3-0.5B-2512'
model=AutoModel(model_dir=str(model_dir),fp16=False)
def synth(name,text,direction,reference,seed):
    path=out/(name+'.wav')
    instruction='You are a helpful assistant. '+direction+'<|endofprompt|>'
    if not path.exists():
        torch.manual_seed(seed);torch.cuda.manual_seed_all(seed)
        parts=list(model.inference_instruct2(text,instruction,str(reference),stream=False,speed=1.0,text_frontend=False))
        pcm=torch.cat([x['tts_speech'].cpu() for x in parts],dim=1).squeeze().numpy()
        if not np.isfinite(pcm).all() or np.max(np.abs(pcm))<.005:raise ValueError(name+' invalid audio')
        nz=np.flatnonzero(np.abs(pcm)>.005);pad=int(.08*model.sample_rate)
        pcm=pcm[max(0,nz[0]-pad):min(len(pcm),nz[-1]+pad)]
        duration=len(pcm)/model.sample_rate
        if not .25<duration<max(12,len(text)*.9):raise ValueError(name+' suspicious duration '+str(duration))
        meter=pyln.Meter(model.sample_rate,block_size=min(.4,duration/2))
        pcm=pyln.normalize.loudness(pcm,meter.integrated_loudness(pcm),-16)
        pcm*=min(1,.98/np.max(np.abs(pcm)))
        sf.write(path,pcm,model.sample_rate,subtype='PCM_16')
    print('READY',name,round(sf.info(path).duration,2),flush=True)
    return {'url':'/voice-auditions/'+path.name,'text':text,'seconds':sf.info(path).duration,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'instruction':instruction,'seed':seed,'speed':1.0,'pitchShift':0,'referenceSha256':hashlib.sha256(reference.read_bytes()).hexdigest()}
manifest={'model':'Fun-CosyVoice3-0.5B-2512','generatedAt':datetime.now(timezone.utc).isoformat(),'status':'Audition; timbre, pronunciation and acting await listening review.','reference':'Locally generated Kokoro jf_alpha Japanese speech. No performer recording.','candidates':[]}
manifest['modelRevision']=json.loads((model_dir/'revision.json').read_text(encoding='utf-8'))
for candidate in roster['candidates']:
    cid=candidate['id'];base=synth(cid+'-anchor',roster['anchorText'],candidate['instruction'],out/'synthetic-anchor.wav',candidate['seed'])
    reference=out/(cid+'-anchor.wav');lines={}
    for i,(key,line) in enumerate(roster['lines'].items()):
        direction=candidate['instruction']+' '+roster['moods'][line['mood']]
        lines[key]=synth(cid+'-'+key,line['text'],direction,reference,candidate['seed']+100+i)
    manifest['candidates'].append({'id':cid,'name':candidate['name'],'description':candidate['description'],'base':base,'lines':lines})
    (root/'src/generated/violetto-auditions.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
    (root/'content/voices/audition-provenance.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('All four auditions ready. No full-course voice has been selected.',flush=True)
