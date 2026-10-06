"""Independent local ASR screening; not a substitute for native listening review."""
import json,sys
from pathlib import Path
import whisper,numpy as np,soundfile as sf,torch
from scipy.signal import resample_poly
root=Path(__file__).resolve().parent.parent
torch.set_num_threads(4)
model=whisper.load_model('small',download_root=str(root/'.models/whisper'))
records=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
for row in records:
    pcm,sr=sf.read(row['path']);pcm=pcm.mean(axis=1) if pcm.ndim>1 else pcm
    pcm=resample_poly(pcm,16000,sr).astype(np.float32)
    result=model.transcribe(pcm,language='ja',task='transcribe',temperature=0,condition_on_previous_text=False,fp16=torch.cuda.is_available())
    row['asr']=result['text'];print(row.get('precision',''),row['text'],'=>',row['asr'],flush=True)
Path(sys.argv[1]).with_suffix('.asr.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
