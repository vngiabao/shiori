"""Fetch reference subsets and stroke paths for every installed course pack."""
import argparse, hashlib, gzip, json, re, urllib.request, xml.etree.ElementTree as ET, zipfile
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
root = Path(__file__).resolve().parent.parent
packs = [json.loads(p.read_text(encoding='utf-8')) for p in sorted((root/'content/packs').glob('*.json'))]
pack = {'words': [w for p in packs for w in p['words']], 'kanji': [k for p in packs for k in p['kanji']]}
cache=root/'.cache'; cache.mkdir(exist_ok=True)
out=root/'content/sources'; out.mkdir(exist_ok=True)
def fetch(url, target):
    if not target.exists():
        with urllib.request.urlopen(url,timeout=90) as r: target.write_bytes(r.read())
    return target
def jmdict():
    # Shared with npm run sources:jmdict; failures propagate instead of silently
    # preserving an obsolete, apparently verified subset.
    from jmdict_sources import refresh
    refresh()

def kanjidic():
    try:
        release=json.load(urllib.request.urlopen('https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest'))
        asset=next(a for a in release['assets'] if a['name'].startswith('kanjidic2-en-') and a['name'].endswith('.json.zip'))
        file=fetch(asset['browser_download_url'],cache/asset['name'])
        with zipfile.ZipFile(file) as z:data=json.loads(z.read(z.namelist()[0]))
        wanted={c for w in pack['words'] for c in w['text'] if '\u4e00' <= c <= '\u9fff'}
        found=[e for e in data['characters'] if e['literal'] in wanted]
        (out/'kanjidic2.json').write_text(json.dumps({'source':asset['browser_download_url'],'license':'CC-BY-SA-4.0','characters':found},ensure_ascii=False,indent=2),encoding='utf-8', newline='\n')
        (out/'kanjidic2-provenance.json').write_text(json.dumps({'release':release['tag_name'],'url':asset['browser_download_url'],'upstream':'EDRDG KANJIDIC2','license':'CC-BY-SA-4.0','sha256':hashlib.sha256(file.read_bytes()).hexdigest()},indent=2),encoding='utf-8', newline='\n')
        print('KANJIDIC2:',len(found),'characters checked',flush=True)
    except Exception as e: raise RuntimeError('KANJIDIC2 unavailable; no verified coverage can be claimed') from e
chars=set(''.join(w['text'] for w in pack['words'] if w['id'].startswith(('h-','k-'))))|{c for w in pack['words'] for c in w['text'] if '\u4e00' <= c <= '\u9fff'}
stroke_dir=root/'public/strokes'; stroke_dir.mkdir(parents=True,exist_ok=True)
kanjivg_revision = None
def stroke(c):
    name=f'{ord(c):05x}'
    try:
        file=fetch(f'https://raw.githubusercontent.com/KanjiVG/kanjivg/{kanjivg_revision}/kanji/{name}.svg',cache/f'{kanjivg_revision}-{name}.svg')
        tree=ET.fromstring(file.read_text(encoding='utf-8'))
        paths=[e.attrib['d'] for e in tree.iter() if e.tag.endswith('path') and 'd' in e.attrib]
        if not paths: return False
        (stroke_dir/f'{name}.json').write_text(json.dumps({'char':c,'paths':paths,'source':'KanjiVG / Ulrich Apel','license':'CC-BY-SA-3.0','revision':kanjivg_revision,'sha256':hashlib.sha256(file.read_bytes()).hexdigest()}),encoding='utf-8', newline='\n')
        return True
    except Exception:return False

def references():
    data=json.loads((out/'kanjidic2.json').read_text(encoding='utf-8'))
    existing={k['char'] for k in pack['kanji']}
    entries=[]
    for c in data['characters']:
        if c['literal'] in existing: continue
        groups=c['readingMeaning']['groups']
        readings=[r for g in groups for r in g['readings']]
        entries.append({'char':c['literal'], 'meaning':'; '.join(m['value'] for g in groups for m in g['meanings'] if m['lang']=='en'),
          'components':'', 'on':'、'.join(r['value'] for r in readings if r['type']=='ja_on'),
          'kun':'、'.join(r['value'].replace('.','').replace('-','') for r in readings if r['type']=='ja_kun'),
          'words':[w['id'] for w in pack['words'] if c['literal'] in w['text']]})
    dest=root/'content/kanji/n5.json';dest.parent.mkdir(exist_ok=True)
    dest.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
    (out/'kanjivg-provenance.json').write_text(json.dumps({'revision':kanjivg_revision,'license':'CC-BY-SA-3.0','url':f'https://github.com/KanjiVG/kanjivg/tree/{kanjivg_revision}/kanji','scope':'SVG stroke paths; no component mnemonics inferred'},indent=2),encoding='utf-8', newline='\n')
    print('New kanji reference entries:',len(entries),flush=True)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--kanji-only',action='store_true');args=parser.parse_args()
    kanjivg_revision=json.load(urllib.request.urlopen('https://api.github.com/repos/KanjiVG/kanjivg/commits/master'))['sha']
    with ThreadPoolExecutor(max_workers=10) as pool:
        job=None if args.kanji_only else pool.submit(jmdict)
        kanji_job=pool.submit(kanjidic)
        failures=[c for c,ok in zip(sorted(chars),pool.map(stroke,sorted(chars))) if not ok]
        kanji_job.result()
        if job: job.result()
    if failures: raise RuntimeError('Missing KanjiVG data: '+''.join(failures))
    references()
