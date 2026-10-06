"""Compile an explicitly authored vocabulary deck against pinned source data.

No generated definitions/examples, automatic conjugation or JLPT-level guessing.
The input has source-row | ruby | romaji | meaning | example-ruby | translation.
Every spelling/reading pair must match JMdict's reading restrictions; potentially
already taught dictionary aliases require a separate editorial decision.
"""
import csv
import gzip
import hashlib
import json
import re
import sys
from pathlib import Path
from jmdict_sources import extract, reading_key
from audit_vocabulary_source import reading_alternatives

ROOT = Path(__file__).resolve().parents[1]
RUBY = re.compile(r'\{([^|{}]+)\|([^|{}]+)\}')

def plain(text):
    return RUBY.sub(r'\1', text)

def kana(text):
    return RUBY.sub(r'\2', text)

def parts(text):
    return [dict(text=m.group(1),reading=m.group(2)) if (m:=RUBY.fullmatch(piece)) else dict(text=piece)
            for piece in re.split(r'(\{[^|{}]+\|[^|{}]+\})',text) if piece]

def write(path, value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

def main():
    path = ROOT / (sys.argv[1] if len(sys.argv)>1 else 'content/decks/n5-vocab-01.txt')
    deck = path.stem
    level = deck[:2]
    provenance = json.loads((ROOT/'content/sources/jlpt-vocabulary/provenance.json').read_text(encoding='utf-8'))
    pin = next(p for p in provenance['files'] if p['file']==f'{level}.csv')
    source = ROOT / f'content/sources/jlpt-vocabulary/{level}.csv'
    assert hashlib.sha256(source.read_bytes()).hexdigest()==pin['sha256'], 'Source CSV differs from pin'
    with source.open(encoding='utf-8-sig',newline='') as stream:
        rows = dict(enumerate(csv.DictReader(stream),2))
    authored = [re.split(r'\|(?![^{}]*\})',line) for line in path.read_text(encoding='utf-8').splitlines() if line.strip()]
    assert len(authored)==100 and all(len(row)==6 for row in authored), 'A complete deck needs 100 authored rows'
    assert len({row[0] for row in authored})==100, 'Duplicate source row'
    earlier = [w for p in (ROOT/'content/packs').glob('*.json') if p.stem!=deck
               for w in json.loads(p.read_text(encoding='utf-8'))['words'] if not w['id'].startswith(('h-','k-','sound-'))]
    wanted = {plain(row[1]) for row in authored}|{w.get('lemma',{}).get('text',w['text']) for w in earlier}
    dictionary_pin = json.loads((ROOT/'content/sources/jmdict-provenance.json').read_text(encoding='utf-8'))
    archive = ROOT / '.cache/JMdict_e.gz'
    dictionary_hash = hashlib.sha256(archive.read_bytes()).hexdigest()
    assert dictionary_hash==dictionary_pin['sha256'], 'Cached dictionary differs from pin'
    with gzip.open(archive,'rb') as stream:
        lexicon, entry_ids = extract(stream,wanted)
    words, references = [], []
    selected_pairs, selected_entries = set(), {}
    decisions_path = ROOT / 'content/decks/alias-decisions.json'
    decisions = json.loads(decisions_path.read_text(encoding='utf-8')).get(deck, [])
    used_decisions = []
    for source_row, ruby, romaji, meaning, example, translation in authored:
        source_row = int(source_row)
        record = rows[source_row]
        text, reading = plain(ruby), kana(ruby)
        assert text in [s.strip() for s in record['expression'].split(';')], (source_row,'Source spelling differs',text)
        assert reading_key(reading) in {reading_key(r) for r in reading_alternatives(record['reading'])}, (source_row,'Source reading differs',text,reading)
        assert reading_key(reading) in {reading_key(r) for r in lexicon.get(text,[])}, (source_row,'JMdict mismatch',text,reading)
        assert (text, reading_key(reading)) not in selected_pairs, ('Duplicate deck spelling/reading',text)
        alias_forms = {selected_entries[e] for e in entry_ids[text] if e in selected_entries}
        for prior in alias_forms:
            decision = next((d for d in decisions if set(d['forms']) == {prior,text} and d.get('reason')),None)
            assert decision, ('Potential within-deck alias: review before inclusion',text,prior)
            used_decisions.append(decision)
        selected_pairs.add((text, reading_key(reading)))
        selected_entries.update({entry: text for entry in entry_ids[text]})
        assert not any(w['text']==text and reading_key(w['kana'])==reading_key(reading) for w in earlier), ('Already taught',text)
        aliases = [w['id'] for w in earlier if set(entry_ids.get(text,[])) & set(entry_ids.get(w.get('lemma',{}).get('text',w['text']),[]))]
        assert not aliases, ('Potential already-taught alias: review explicitly rather than silently duplicate',text,aliases)
        assert RUBY.sub('',ruby).count('{')==0 and RUBY.sub('',example).count('{')==0, 'Malformed ruby'
        assert re.search('[一-鿿]',kana(example)) is None, ('Unglossed example kanji',example)
        assert example.rstrip('」』').endswith('。') and len(plain(example))>5 and translation.strip(), ('Incomplete example',text)
        word_id = f'{deck}-w-{source_row:04}'
        url = f"https://github.com/jamsinclair/open-anki-jlpt-decks/blob/{provenance['revision']}/src/{level}.csv#L{source_row}"
        register = ('formal' if text in ['申し上げる','差し上げる','おいでになる'] else 'casual' if text in ['あっち','そっち','どっち','パパ']
                    else 'polite' if text in ['あちら','そちら','どちら','どなた','いかが','お手洗い','お宅','お嬢さん','よろしい'] else 'neutral')
        words.append(dict(id=word_id,text=text,kana=reading,romaji=romaji,meaning=meaning,register=register,
                          example=plain(example),exampleRuby=example,exampleMeaning=translation,pitch=None,jlpt=None,
                          parts=parts(ruby),source=url))
        references.append(dict(id=word_id,sourceRow=source_row,original=record,selected=dict(text=text,kana=reading),
                               dictionaryEntryIds=entry_ids[text],exampleStatus='Original AI-assisted draft; not dictionary-verified naturalness'))
    lessons = [dict(id=f'{deck}-lesson-{i//8+1}',title=f'{level.upper()} vocabulary · Set {i//8+1}',
                    description='Community-list words with original examples. Reading and listening recognition are tracked separately.',
                    kind='phrase',words=[w['id'] for w in words[i:i+8]],
                    canDo='Recognise these written words and their Clear voice readings.',minutes=8)
               for i in range(0,len(words),8)]
    pack = dict(id=deck,version=1,status='AI-assisted draft',category='vocabulary',title=f'{level.upper()} vocabulary · Deck {int(deck[-2:])}',
                words=words,lessons=lessons,letters=[],roleplays=[],grammar=[],kanji=[],exercises=[])
    write(ROOT/f'content/packs/{deck}.json',pack)
    reference_folder = ROOT/'content/sources/decks'
    reference_folder.mkdir(exist_ok=True)
    write(reference_folder/f'{deck}.json',dict(deck=deck,communityLevel=level.upper(),officialJLPTList=False,
            source=pin,origin=provenance['dataOrigin'],licence=provenance['dataLicence'],
            dictionarySha256=dictionary_hash,sourceDraftSha256=hashlib.sha256(path.read_bytes()).hexdigest(),
            exclusion='Exact spelling/reading and shared JMdict entry candidates excluded against other installed content. Within-deck candidates require explicit editorial decisions.',
            aliasDecisions=used_decisions,words=references))
    print(f'{deck}: {len(words)} dictionary-checked words, 100 authored examples, {len(lessons)} small lessons; community alignment only.')

if __name__=='__main__':
    main()
