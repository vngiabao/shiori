"""Rebuild a course-sized JMdict_e subset and account for every course word.

No course edits, guessed readings, conjugation inference, or name-dictionary
claims. re_restr and re_nokanji are respected; kana headwords map to themselves.
"""
import re
import argparse
from collections import Counter
from datetime import datetime, timezone
import gzip
import hashlib
import json
from pathlib import Path
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://www.edrdg.org/pub/Nihongo/JMdict_e.gz'

def reading_key(text):
    return ''.join(chr(ord(c)-0x60) if '\u30a1' <= c <= '\u30f6' else c
                   for c in unicodedata.normalize('NFKC', text))

def extract(stream, wanted):
    found, evidence = {}, {}
    for _, entry in ET.iterparse(stream, events=('end',)):
        if entry.tag != 'entry':
            continue
        forms = [k.text for k in entry.findall('k_ele/keb')]
        sequence = entry.findtext('ent_seq')
        for elem in entry.findall('r_ele'):
            reading = elem.findtext('reb')
            if not reading:
                continue
            allowed = set(elem.findall('re_restr'))
            restrictions = {r.text for r in allowed}
            written = [] if elem.find('re_nokanji') is not None else [
                f for f in forms if not restrictions or f in restrictions]
            for form in [reading, *written]:
                if form in wanted:
                    found.setdefault(form, set()).add(reading)
                    evidence.setdefault(form, set()).add(sequence)
        entry.clear()
    return ({k: sorted(v) for k,v in sorted(found.items())},
            {k: sorted(v) for k,v in sorted(evidence.items())})

def classify(word, lexicon):
    if word.get('id','').startswith(('h-','k-','sound-')): return 'excluded-drill'
    if word.get('id') in ('yui','ren','hana','n5-u01-w-sato'): return 'name-unverified'
    readings = lexicon.get(word['text'])
    if readings is None:
        return 'unmatched'
    return 'matched' if reading_key(word['kana']) in {reading_key(r) for r in readings} else 'mismatch'

def json_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix+'.tmp')
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    temporary.replace(path)

def refresh(use_cache=False):
    folder = ROOT/'content/sources'
    cache = ROOT/'.cache/JMdict_e.gz'
    cache.parent.mkdir(exist_ok=True)
    if not use_cache:
        # A fresh download is intentional: the upstream filename is mutable.
        with urllib.request.urlopen(URL, timeout=90) as response:
            archive = response.read()
        gzip.decompress(archive)  # Validate before replacing the cached source.
        cache.write_bytes(archive)
        json_write(cache.with_suffix('.download.json'), {
            'url': URL, 'downloadedAt': datetime.now(timezone.utc).isoformat(),
            'sha256': hashlib.sha256(archive).hexdigest()})
    if not cache.exists() or not cache.with_suffix('.download.json').exists():
        raise RuntimeError('No pinned download; run without --cached first.')
    downloaded = json.loads(cache.with_suffix('.download.json').read_text(encoding='utf-8'))
    if hashlib.sha256(cache.read_bytes()).hexdigest() != downloaded['sha256']:
        raise RuntimeError('Cached JMdict hash differs from download record.')
    files = sorted((ROOT/'content/packs').glob('*.json'))
    snapshots = {f.name: f.read_bytes() for f in files}
    words = [dict(w, pack=f.name) for f in files
             for w in json.loads(snapshots[f.name])['words']]
    before_path = folder/'jmdict-readings.json'
    before = json.loads(before_path.read_text(encoding='utf-8')) if before_path.exists() else {}
    # NFKC variants cover width differences without inventing spelling aliases.
    wanted = {w['text'] for w in words if not w['id'].startswith(('h-','k-','sound-')) and w['id'] not in ('yui','ren','hana','n5-u01-w-sato')}
    wanted |= {w['lemma']['text'] for w in words if w.get('lemma')}
    wanted |= {unicodedata.normalize('NFKC', f) for f in wanted}
    with gzip.open(cache, 'rb') as stream:
        lexicon, evidence = extract(stream, wanted)
    for w in words:
        variant = unicodedata.normalize('NFKC', w['text'])
        if w['text'] not in lexicon and variant in lexicon:
            lexicon[w['text']] = lexicon[variant]
            evidence[w['text']] = evidence[variant]
    if not lexicon:
        raise RuntimeError('Empty extract; existing subset was not replaced.')
    rows = [dict(pack=w['pack'], id=w['id'], text=w['text'], kana=w['kana'],
                 status=classify(w, lexicon), dictionaryReadings=lexicon.get(w['text'], []),
                 entryIds=evidence.get(w['text'], [])) for w in words]
    for w,row in zip(words,rows):
        lemma = w.get('lemma')
        if not lemma: continue
        row['lemma'] = lemma
        row['lemmaStatus'] = classify(lemma, lexicon)
        row['lemmaReadingRelationship'] = 'not-established'
        # Only the dictionary's kanji-bearing stem is checked here. Inflection,
        # grammar, meaning and the entire phrase remain outside this proof.
        suffix = re.search(r'[ぁ-ゖー]*$', lemma['text']).group()
        stem = lemma['text'][:-len(suffix)] if suffix else lemma['text']
        reading = lemma['kana'][:-len(suffix)] if suffix and lemma['kana'].endswith(suffix) else lemma['kana']
        parts = [part for part in w.get('parts',[]) if re.search('[一-鿿]',part['text'])]
        if row['lemmaStatus']=='matched' and len(parts)==1 and parts[0]['text']==stem and reading_key(parts[0].get('reading',''))==reading_key(reading):
            row['lemmaReadingRelationship']='kanji-stem-matched'
    counts = dict(Counter(row['status'] for row in rows))
    coverage = {'totalWords':len(rows), 'uniqueForms':len({w['text'] for w in words}),
                'counts':counts, 'words':rows}
    json_write(folder/'jmdict-readings.json', lexicon)
    json_write(folder/'jmdict-coverage.json', coverage)
    subset_hash = hashlib.sha256((folder/'jmdict-readings.json').read_bytes()).hexdigest()
    provenance = {**downloaded, 'upstream':'EDRDG JMdict_e', 'license':'CC-BY-SA-4.0',
        'documentation':'https://www.edrdg.org/jmdict/j_jmdict.html',
        'licenseUrl':'https://www.edrdg.org/edrdg/licence.html',
        'extractedAt':datetime.now(timezone.utc).isoformat(), 'subsetSha256':subset_hash,
        'sourcePackHashes':{name:hashlib.sha256(data).hexdigest() for name,data in snapshots.items()},
        'readingRestrictionsRespected':True, 'kanaComparison':'NFKC and katakana-to-hiragana only',
        'scope':'Dictionary spelling/reading pairs only; not meaning, pronunciation in context, grammar or naturalness',
        'previousSubsetForms':len(before), 'subsetForms':len(lexicon),
        'previousWordsWithDictionaryForm':sum(w['text'] in before for w in words),
        **{k:v for k,v in coverage.items() if k!='words'}}
    json_write(folder/'jmdict-provenance.json', provenance)
    report = ['# JMdict reading audit', '',
        f"Source: {URL} (downloaded {downloaded['downloadedAt']}).", '',
        f"Subset: {len(before)} → {len(lexicon)} forms. Every one of {len(rows)} course word records was examined.",
        f"Results: {counts.get('matched',0)} matched; {counts.get('mismatch',0)} mismatched; {counts.get('unmatched',0)} unmatched.", '',
        'Matched means only that a dictionary spelling/reading pair exists. Unmatched does not mean incorrect: inflected forms and phrases may be absent from JMdict. Drills and names are counted separately. Course wording and readings were unchanged; optional lemma metadata was added.', '',
        f"Kanji-bearing course records directly matched: {sum(r['status']=='matched' and bool(re.search('[一-鿿]',r['text'])) for r in rows)}. Additional course kanji stems supported through a matching lemma: {sum(r.get('lemmaReadingRelationship')=='kanji-stem-matched' and r['status']!='matched' for r in rows)}. Stem evidence does not verify the full inflected form.", '',
        '## Reading mismatches', '']
    for row in rows:
        if row['status'] == 'mismatch':
            note = (' Contextual particle pronunciation; review in its sentence.'
                    if row['text'] in ('は','へ','を') else ' Requires content-author review.')
            report += [f"- `{row['id']}` ({row['pack']}): **{row['text']}** — course `{row['kana']}`; JMdict: {' / '.join(row['dictionaryReadings'])}.{note}"]
    if not counts.get('mismatch'):
        report += ['No mismatches among dictionary-mapped forms.']
    report += ['', '## Unmatched forms — explicitly unverified', '']
    for row in rows:
        if row['status'] == 'unmatched':
            report += [f"- `{row['id']}` ({row['pack']}): {row['text']} — `{row['kana']}`."]
    report += ['', '## Lemma evidence (not full-form verification)', '']
    for row in rows:
        if row.get('lemma'): report += [f"- `{row['id']}`: lemma {row['lemma']['text']} / {row['lemma']['kana']} — {row['lemmaStatus']}; course relationship: {row['lemmaReadingRelationship']}."]
    report += ['', '## Excluded drills and names', f"Drills: {counts.get('excluded-drill',0)}; names listed separately, not verified with JMnedict: {counts.get('name-unverified',0)}."]
    report += [f"- `{r['id']}`: {r['text']} / {r['kana']} — name, unverified." for r in rows if r['status']=='name-unverified']
    report += ['', 'Re-run `npm run sources:jmdict` after new packs. `--cached` explicitly reuses the hash-pinned download. Kana-only dictionary headwords retain their own reading; unknown kana is never inserted as dictionary evidence.', '']
    destination = ROOT/'output/jmdict-mismatches.md'
    destination.parent.mkdir(exist_ok=True)
    destination.write_text('\n'.join(report), encoding='utf-8')
    print(f'JMdict: {len(before)} -> {len(lexicon)} forms; {len(rows)} word records; {counts}', flush=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cached', action='store_true')
    refresh(parser.parse_args().cached)
