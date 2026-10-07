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

def read_authored_rows(path, deck, policy_path):
    authored = [re.split(r'\|(?![^{}]*\})',line) for line in path.read_text(encoding='utf-8').splitlines() if line.strip()]
    tail = json.loads(policy_path.read_text(encoding='utf-8')).get(deck) if policy_path.exists() else None
    expected = tail['count'] if tail else 100
    assert isinstance(expected, int) and not isinstance(expected, bool) and 1 <= expected <= 100, 'Invalid deck size policy'
    assert not tail or tail.get('reason'), 'A shorter final batch needs an editorial reason'
    assert len(authored)==expected and all(len(row)==6 for row in authored), f'Deck needs {expected} authored rows'
    assert len({row[0] for row in authored})==expected, 'Duplicate source row'
    return authored, tail

def verify_source_pair(record, text, reading, correction=None):
    if correction is not None:
        assert correction.get('reason') and len(correction['reason']) > 20, 'Source correction needs a review reason'
        assert correction['original'] == {k: record[k] for k in ['expression','reading']}, 'Source correction is stale'
        approved = correction.get('selections', [correction.get('selected')])
        assert {'text': text, 'kana': reading} in approved, 'Source correction does not approve this pair'
        return
    assert text in [s.strip() for s in record['expression'].split(';')], ('Source spelling differs',text)
    assert reading_key(reading) in {reading_key(r) for r in reading_alternatives(record['reading'])}, ('Source reading differs',text,reading)

def verify_course_aliases(text, reading, aliases, decisions):
    if not aliases:
        return None
    decision = next((d for d in decisions if d.get('selected') == {'text': text, 'kana': reading}), None)
    assert decision and len(decision.get('reason','')) > 20, ('Potential already-taught alias: review explicitly rather than silently duplicate',text,aliases)
    assert sorted(decision.get('courseAliases',[])) == sorted(aliases), ('Course alias review is stale',text,aliases)
    return decision

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
    # Last batches stop at the reviewed inventory boundary instead of padding
    # the course with duplicated or obsolete forms to reach one hundred.
    policy_path = ROOT / 'content/decks/tail-batches.json'
    authored, tail = read_authored_rows(path, deck, policy_path)
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
    corrections_path = ROOT / 'content/decks/source-decisions.json'
    corrections = json.loads(corrections_path.read_text(encoding='utf-8')) if corrections_path.exists() else {}
    used_decisions = []
    for source_row, ruby, romaji, meaning, example, translation in authored:
        source_row = int(source_row)
        record = rows[source_row]
        text, reading = plain(ruby), kana(ruby)
        correction = corrections.get(f'{level}:{source_row}')
        verify_source_pair(record, text, reading, correction)
        assert reading_key(reading) in {reading_key(r) for r in lexicon.get(text,[])}, (source_row,'JMdict mismatch',text,reading)
        assert (text, reading_key(reading)) not in selected_pairs, ('Duplicate deck spelling/reading',text)
        alias_forms = {selected_entries[e] for e in entry_ids[text] if e in selected_entries}
        for prior in alias_forms:
            decision = next((d for d in decisions if set(d.get('forms',[])) == {prior,text} and d.get('reason')),None)
            assert decision, ('Potential within-deck alias: review before inclusion',text,prior)
            used_decisions.append(decision)
        selected_pairs.add((text, reading_key(reading)))
        selected_entries.update({entry: text for entry in entry_ids[text]})
        assert not any(w['text']==text and reading_key(w['kana'])==reading_key(reading) for w in earlier), ('Already taught',text)
        aliases = [w['id'] for w in earlier if set(entry_ids.get(text,[])) & set(entry_ids.get(w.get('lemma',{}).get('text',w['text']),[]))]
        decision = verify_course_aliases(text, reading, aliases, decisions)
        if decision:
            used_decisions.append(decision)
        assert RUBY.sub('',ruby).count('{')==0 and RUBY.sub('',example).count('{')==0, 'Malformed ruby'
        assert re.search('[一-鿿]',kana(example)) is None, ('Unglossed example kanji',example)
        assert example.rstrip('」』').endswith('。') and len(plain(example))>5 and translation.strip(), ('Incomplete example',text)
        word_id = f'{deck}-w-{source_row:04}'
        url = f"https://github.com/jamsinclair/open-anki-jlpt-decks/blob/{provenance['revision']}/src/{level}.csv#L{source_row}"
        register = ('formal' if text in ['かしこまりました','御覧','信ずる','存じる','足る','通ずる','申し上げる','差し上げる','おいでになる','ご存じ','拝見','頂く','いただく','お目に掛かる'] or (text=='私' and reading=='わたくし') else 'casual' if text in ['あっち','そっち','どっち','こっち','パパ','君','やる','みんな','うまい','食う','けち','お前','馬鹿','何で','ちょうだい','ママ','おはよう','御免','こないだ','しょうがない','すまない']
                    else 'polite' if text in ['御無沙汰','ごめんください','ご苦労様','おかけください','おかげさまで','お気の毒に','お邪魔します','お待たせしました','構いません','あちら','そちら','どちら','どなた','いかが','お手洗い','お宅','お嬢さん','よろしい','お子さん','皆さん','お見舞い','方々'] else 'neutral')
        words.append(dict(id=word_id,text=text,kana=reading,romaji=romaji,meaning=meaning,register=register,
                          example=plain(example),exampleRuby=example,exampleMeaning=translation,pitch=None,jlpt=None,
                          parts=parts(ruby),source=url))
        references.append(dict(id=word_id,sourceRow=source_row,original=record,selected=dict(text=text,kana=reading),
                               dictionaryEntryIds=entry_ids[text],exampleStatus='Original AI-assisted draft; not dictionary-verified naturalness',
                               **({'sourceCorrection':correction} if correction else {})))
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
            exclusion='Exact spelling/reading duplicates excluded. Shared JMdict entry candidates require explicit, pair- and course-ID-pinned editorial decisions; they do not prove equivalent taught senses.',
            aliasDecisions=used_decisions,words=references,**({'tailBatch':tail} if tail else {})))
    print(f'{deck}: {len(words)} dictionary-checked words, {len(words)} authored examples, {len(lessons)} small lessons; community alignment only.')

if __name__=='__main__':
    main()
