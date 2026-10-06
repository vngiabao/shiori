import json
from dataclasses import asdict
from pathlib import Path
from voicevox_core.blocking import Onnxruntime,OpenJtalk,Synthesizer,VoiceModelFile
root=Path(__file__).resolve().parent.parent
base=root/'.models/voicevox'
s=Synthesizer(Onnxruntime.load_once(filename=str(base/'onnxruntime/lib'/Onnxruntime.LIB_RECOMMENDED_VERSIONED_FILENAME)),OpenJtalk(str(base/'dict/open_jtalk_dic_utf_8-1.11')),acceleration_mode='CPU',cpu_num_threads=4)
out=root/'output/pronunciation';out.mkdir(exist_ok=True)
for name in ['1','6']:
    with VoiceModelFile.open(str(base/f'models/vvms/{name}.vvm')) as m:s.load_voice_model(m)
rows=[]
for style in [14,29]:
    for i,text in enumerate(['あ','い','う','え','お','あい','あ、い。','か','き','こんにちは。','切手を二枚お願いします。明日、手紙を出します。','お待ちしておりました。始めましょう。','おばさん。おばあさん。きて。きって。']):
        if len(text)==1:
            katakana=chr(ord(text)+96)
            q=s.create_audio_query_from_kana(katakana+"'",style)
            for p in q.accent_phrases:
                for mora in p.moras:
                    mora.vowel=mora.vowel.lower();mora.vowel_length=.18
                    if mora.consonant_length is not None:mora.consonant_length=.08
        else:q=s.create_audio_query(text,style)
        q.speed_scale=1.02;q.intonation_scale=.85;q.pitch_scale=-.015;q.pre_phoneme_length=.08;q.post_phoneme_length=.12
        target=out/f'voicevox-{style}-{i:02}.wav';target.write_bytes(s.synthesis(q,style))
        rows.append({'precision':f'voicevox-{style}','text':text,'path':str(target),'query':asdict(q)})
        print(style,text,flush=True)
(out/'voicevox.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
