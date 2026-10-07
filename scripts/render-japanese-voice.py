"""Render auditable Japanese lesson audio locally. Run with .audio-py312.

VOICEVOX Core 0.17.0, VVM 0.16.4, 冥鳴ひまり normal (14).
Single kana use explicit one-mora queries: no text-model completion, suffix,
interrogative rise, vowel devoicing or character acting in pronunciation drills.
URLs include renderer settings and PCM content to invalidate old cached clips.
"""
import argparse,hashlib,io,json,re,math
from dataclasses import asdict
from datetime import datetime,timezone
from pathlib import Path
import numpy as np
import soundfile as sf
from voicevox_core.blocking import Onnxruntime,OpenJtalk,Synthesizer,VoiceModelFile

root=Path(__file__).resolve().parent.parent
base=root/'.models/voicevox'
out=root/'public/audio';out.mkdir(exist_ok=True)
model_path=base/'models/vvms/1.vvm'
style=14
s=Synthesizer(Onnxruntime.load_once(filename=str(base/'onnxruntime/lib'/Onnxruntime.LIB_RECOMMENDED_VERSIONED_FILENAME)),OpenJtalk(str(base/'dict/open_jtalk_dic_utf_8-1.11')),acceleration_mode='CPU',cpu_num_threads=4)
with VoiceModelFile.open(str(model_path)) as model:s.load_voice_model(model)

packs=json.loads((root/'src/generated/packs.json').read_text(encoding='utf-8'))
roster=json.loads((root/'content/voices/violetto.json').read_text(encoding='utf-8'))
lookup={w['id']:w for p in packs for w in p['words']}
readings={}
texts={'ようこそ。','こんにちは。お茶をお願いします。ありがとうございます。','あい','あ、い。','あ い','あ、い','あ。い。う。え。お。','おばさん。おばあさん。きて。きって。'}
for p in packs:
    for w in p['words']:
        texts.update([w['text'],w['kana']])
        if w.get('exampleRuby'):
            texts.add(w['example'])
            # The authored ruby gives a context-specific reading. No guessing
            # from the headword's reading or another inflected form.
            readings[w['example']]=re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\2',w['exampleRuby'])
        # A single written kana has its alphabet sound. Particles are selected
        # by word ID in the app rather than overriding this shared text key.
        if len(w['text'])>1:readings[w['text']]=w['kana']
    for g in p['grammar']:
        texts.add(g['example'])
        for x in g.get('examples',[]):texts.add(re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\1',x['ja']))
    for r in p['roleplays']:
        for t in r['turns']:
            texts.update([t['line'],t['example'],*t.get('alternatives',[])])
    for l in p['letters']:
        chunks=[];last=0
        for stop in l['paragraphs']+[len(l['tokens'])]:
            if stop>last:chunks.append(''.join(lookup[i]['text'] for i in l['tokens'][last:stop])+'。')
            last=stop
        texts.add(''.join(chunks))
for line in roster['lines'].values():texts.add(line['text'])
# Practice: dialogue lines, heard replies and every completed practice sentence.
# Ruby markup {漢字|かな} is stripped to the written line, which keys the manifest.
def plain(s):return re.sub(r'\{([^|{}]+)\|([^|{}]+)\}',r'\1',s)
for p in packs:
    for d in p.get('dialogues',[]):
        for l in d['lines']:texts.add(plain(l['line']))
    for x in p.get('exercises',[]):
        if x['type']=='reply':texts.add(plain(x['line']))
        if x['type'] in ('choice','register','compare') and x.get('line'):texts.add(plain(x['line']))
        if x['type']=='cloze':texts.add(plain(x['line'].replace('＿＿',x['options'][x['answer']])))
        if x['type']=='order':texts.add(plain(''.join(x['tiles'])))

def katakana(text):
    return ''.join(chr(ord(c)+96) if 'ぁ'<=c<='ゖ' else c for c in text)

# Explicit context-specific speech readings supplement the text analyser.
# Written text remains the manifest key; no global kanji substitution is made.
reading_path=root/'content/voices/pronunciation-readings.json'
if reading_path.exists():
    reading_overrides=json.loads(reading_path.read_text(encoding='utf-8'))
    for entry in reading_overrides['entries']:
        assert entry['text'] in texts and entry['readingInput'] and entry['reason']
        readings[entry['text']]=entry['readingInput']

records=[]
def render(text,mood='clear',delivery=None):
    single=bool(re.fullmatch('[ぁ-ゖァ-ヶ]',text))
    if single:
        kana=katakana(text)
        # Modern standard Japanese mergers; the strict query parser uses ジ/ズ/オ.
        kana={'ヂ':'ジ','ヅ':'ズ','ヲ':'オ'}.get(kana,kana)
        q=s.create_audio_query_from_kana(kana+"'",style)
        assert len(q.accent_phrases)==1 and len(q.accent_phrases[0].moras)==1,text
        mora=q.accent_phrases[0].moras[0]
        mora.vowel=mora.vowel.lower() if mora.vowel!='N' else 'N'
        # Vowels have no consonant onset: give the steady vowel enough room to
        # be heard without lengthening other kana or adding a carrier phrase.
        mora.vowel_length=.30 if kana in 'アイウエオ' else .22
        if mora.consonant_length is not None:mora.consonant_length=.08
    else:
        q=s.create_audio_query(readings.get(text,text),style)
    q.speed_scale=1.02 if mood=='clear' else 1.0
    q.intonation_scale={'clear':.9,'composed':.78,'warm':.85,'proud':.95,'precise':.82,'reflective':.75}.get(mood,.85)
    q.pitch_scale=-.015
    q.pre_phoneme_length=.08;q.post_phoneme_length=.12
    if delivery is not None:
        if single or mood=='clear':raise ValueError('Expressive settings cannot alter pronunciation drills')
        q.speed_scale=delivery['speed']
        q.intonation_scale=delivery['intonation']
        q.pitch_scale=delivery['pitch']
        if 'semitones' in delivery:
            assert abs(delivery['semitones'])<=.5
            # Core 0.17 multiplies log-F0 by 2**pitch_scale, then centres
            # intonation around its mean. Add an offset BEFORE that multiplier
            # so the resulting log-F0 centre moves exactly this many semitones.
            delta=math.log(2)*delivery['semitones']/12/(2**q.pitch_scale)
            for phrase in q.accent_phrases:
                for mora in phrase.moras:
                    if mora.pitch>0:mora.pitch+=delta
        for phrase in q.accent_phrases:
            if phrase.pause_mora:
                if isinstance(phrase.pause_mora,dict):
                    phrase.pause_mora['vowel_length']*=delivery['pauseScale']
                else:phrase.pause_mora.vowel_length*=delivery['pauseScale']
    pcm,sr=sf.read(io.BytesIO(s.synthesis(q,style,enable_interrogative_upspeak=False)))
    assert np.isfinite(pcm).all() and np.max(np.abs(pcm))>.01,text
    peak=float(np.max(np.abs(pcm)))
    pcm*=min(1,.96/peak)
    # Lossless PCM preserves tiny kana onsets and endings; do not time-stretch.
    buffer=io.BytesIO();sf.write(buffer,pcm,sr,format='WAV',subtype='PCM_16')
    payload=buffer.getvalue();digest=hashlib.sha256(payload).hexdigest()
    name='vv2-'+digest[:20]+'.wav';(out/name).write_bytes(payload)
    row={'text':text,'readingInput':readings.get(text,text),'mood':mood,'singleMora':single,'url':'/audio/'+name,'seconds':len(pcm)/sr,'sha256':digest,'query':asdict(q)}
    records.append(row)
    return row

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--incremental',action='store_true');args=parser.parse_args()
    manifest=json.loads((root/'src/generated/audio.json').read_text(encoding='utf-8')) if args.incremental else {}
    old=json.loads((root/'content/voices/lesson-provenance.json').read_text(encoding='utf-8')) if args.incremental else None
    if old:
        assert old['modelSha256']==hashlib.sha256(model_path.read_bytes()).hexdigest()
        records.extend(old['records'])
    for i,text in enumerate(sorted(texts)):
        if text in manifest:
            assert any(r['text']==text and r['url']==manifest[text] for r in records),text
            continue
        row=render(text);manifest[text]=row['url']
        if i%25==0:print('Rendered',i+1,'/',len(texts),flush=True)
    baseline=json.loads((root/'src/generated/violetto-baseline.json').read_text(encoding='utf-8')) if args.incremental else {key:render(line['text'],line['mood']) for key,line in roster['lines'].items()}
    provenance={'version':2,'createdAt':datetime.now(timezone.utc).isoformat(),'engine':'VOICEVOX Core 0.17.0','model':'VVM 0.16.4 / 1.vvm','modelSha256':hashlib.sha256(model_path.read_bytes()).hexdigest(),'styleId':style,'credit':'VOICEVOX:冥鳴ひまり','source':'https://github.com/VOICEVOX/voicevox_core','direction':'Clear female middle register, restrained intonation, precise short vowels; composed Violetto performance direction. Not a measured match to Yui Ishikawa.','checks':'Explicit one-mora kana query, vowel voicing, fixed short duration, PCM decoding, peak, query and content hashes. ASR is screening only, not listening certification.','humanListeningReviewed':False,'records':records}
    (root/'src/generated/audio.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
    (root/'src/generated/violetto-baseline.json').write_text(json.dumps({k:{f:v[f] for f in ['url','seconds','sha256']} for k,v in baseline.items()},ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
    (root/'content/voices/lesson-provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
    print('Published',len(manifest),'lesson clips +',len(baseline),'reactions',flush=True)
