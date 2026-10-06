"""Audit pinned community vocabulary spellings/readings against cached JMdict.

Read-only with respect to course content. A dictionary entry can contain several
senses: a shared entry id is only an alias candidate, never proof of taught
meaning, naturalness, current JLPT membership, or mastery. No generated examples.
"""
import csv
import gzip
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

from jmdict_sources import extract, reading_key

ROOT = Path(__file__).resolve().parents[1]


def alternatives(value):
    return list(dict.fromkeys(x.strip() for x in value.split(';') if x.strip()))


def is_pattern(value):
    return bool(re.search(r'[～〜~…]', value))


def reading_alternatives(value):
    # The CSV embeds editorial annotations such as "(する)" in a reading
    # cell. Preserve the original cell in the report; parentheses are not
    # pronounced as part of the headword. This is not conjugation inference.
    return alternatives(re.sub(r'\([^)]*\)|（[^）]*）', '', value))


def audit_row(row, lexicon, entry_ids, taught):
    forms, readings = alternatives(row['expression']), reading_alternatives(row['reading'])
    pairs = [(text, kana) for text in forms for kana in readings
             if reading_key(kana) in {reading_key(r) for r in lexicon.get(text, [])}]
    suru_candidate = any(kana.endswith('する') and not text.endswith('する') and
                         reading_key(kana[:-2]) in {reading_key(r) for r in lexicon.get(text, [])}
                         for text in forms for kana in readings)
    status = ('pattern' if any(is_pattern(x) for x in forms+readings) else
              'missing-reading' if not readings else
              'non-kana-reading' if any(re.search('[一-鿿]', x) for x in readings) else
              'matched' if pairs else
              'suru-form-review' if suru_candidate else
              'reading-mismatch' if any(x in lexicon for x in forms) else 'unmatched')
    entries = {e for text, _ in pairs for e in entry_ids.get(text, [])}
    exact = [w['id'] for w in taught if (w['text'], w['kana']) in pairs]
    # Different spellings/conjugated course forms require editorial comparison.
    alias_candidates = [w['id'] for w in taught if w['id'] not in exact and
                        entries.intersection(entry_ids.get(w.get('lemma', {}).get('text', w['text']), []))]
    return {**row, 'status': status, 'normalizedReadings': readings,
            'dictionaryPairs': [{'text': text, 'kana': kana} for text, kana in pairs],
            'dictionaryEntryIds': sorted(entries),
            'exactCourseForms': exact, 'courseAliasCandidates': alias_candidates,
            'dictionaryReadings': {text: lexicon[text] for text in forms if text in lexicon}}


def main():
    folder = ROOT / 'content/sources/jlpt-vocabulary'
    rows = []
    csv_hashes = {}
    for level in ['n5', 'n4', 'n3', 'n2', 'n1']:
        source = folder / f'{level}.csv'
        csv_hashes[source.name] = hashlib.sha256(source.read_bytes()).hexdigest()
        with source.open(encoding='utf-8-sig', newline='') as f:
            rows += [{**r, 'level': level, 'sourceRow': i} for i, r in enumerate(csv.DictReader(f), 2)]
    # The course's regular dictionary audit already pins this download.
    cache = ROOT / '.cache/JMdict_e.gz'
    dictionary_hash = hashlib.sha256(cache.read_bytes()).hexdigest()
    pin = json.loads((ROOT / 'content/sources/jmdict-provenance.json').read_text(encoding='utf-8'))
    if dictionary_hash != pin['sha256']:
        raise ValueError('Cached JMdict differs from the existing source pin')
    taught = [w for path in sorted((ROOT / 'content/packs').glob('*.json'))
              for w in json.loads(path.read_text(encoding='utf-8'))['words']
              if not w['id'].startswith(('h-', 'k-', 'sound-'))]
    wanted = {f for row in rows for f in alternatives(row['expression']) if not is_pattern(f)}
    wanted.update(w.get('lemma', {}).get('text', w['text']) for w in taught)
    with gzip.open(cache, 'rb') as stream:
        lexicon, entries = extract(stream, wanted)
    checked = [audit_row(r, lexicon, entries, taught) for r in rows]
    counts = {level: dict(Counter(r['status'] for r in checked if r['level'] == level))
              for level in ['n5', 'n4', 'n3', 'n2', 'n1']}
    result = {
        'scope': 'Spelling/reading restrictions only. Alias candidates and source meanings require editorial review. Community level labels are not an official JLPT specification.',
        'dictionary': {'source': pin['url'] if 'url' in pin else 'https://www.edrdg.org/pub/Nihongo/JMdict_e.gz',
                       'sha256': dictionary_hash, 'licence': 'CC-BY-SA-4.0'},
        'csvSha256': csv_hashes, 'counts': counts, 'rows': checked,
    }
    out = ROOT / 'output/vocabulary-source-audit.json'
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps({'counts': counts, 'output': str(out)}, indent=2))


if __name__ == '__main__':
    main()
