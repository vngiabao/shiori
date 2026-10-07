"""Account for advanced source rows without treating dictionary aliases as mastery.

Build one finished level at a time. Exact and corrected pairs are checked against
the pinned dictionary. Related candidates are explicitly *not* semantic coverage.
No source CSV, course word, or existing learner record is changed.
"""
import argparse
import csv
import gzip
import hashlib
import json
from collections import Counter
from pathlib import Path

from audit_vocabulary_source import alternatives, audit_row
from jmdict_sources import extract, reading_key

ROOT = Path(__file__).resolve().parents[1]


def read(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def corrected_ids(row, correction, words, lexicon):
    assert correction["original"] == {k: row[k] for k in ["expression", "reading"]}, "Stale source correction"
    assert correction.get("reason"), "Correction requires a reason"
    ids = []
    for pair in correction.get("selections", [correction.get("selected")]):
        assert reading_key(pair["kana"]) in {reading_key(k) for k in lexicon.get(pair["text"], [])}, "Unsupported corrected reading"
        matches = [w["id"] for w in words if w["text"] == pair["text"] and reading_key(w["kana"]) == reading_key(pair["kana"])]
        assert matches, "Corrected source pair has not been taught"
        ids.extend(matches)
    return ids


def reviewed_disposition(row, audit, decisions):
    """Reviewed non-headwords are accounting gaps, never taught vocabulary."""
    key = f"{row['level']}:{row['sourceRow']}"
    policy = decisions.get('patternPolicies', {}).get(row['level'])
    if audit['status'] == 'pattern' and policy:
        assert len(policy) > 40, 'Pattern policy requires a review reason'
        return dict(disposition='attached-pattern-not-headword', courseIds=[],
                    sourceTargetSeparatelyTested=False, reason=policy)
    decision = decisions.get('excluded', {}).get(key)
    if decision:
        assert decision['original'] == {k: row[k] for k in ['expression', 'reading']}, 'Stale exclusion'
        assert decision['dictionaryStatus'] == audit['status'], 'Changed exclusion status'
        assert len(decision['reason']) > 40, 'Exclusion requires a review reason'
        return dict(disposition='excluded-compositional-expression', courseIds=[],
                    sourceTargetSeparatelyTested=False, reason=decision['reason'])
    return None


def build(level):
    source = ROOT / f"content/sources/jlpt-vocabulary/{level}.csv"
    pin = read("content/sources/jlpt-vocabulary/provenance.json")
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    assert digest == next(x["sha256"] for x in pin["files"] if x["file"] == source.name)
    with source.open(encoding="utf-8-sig", newline="") as f:
        rows = [dict(r, level=level, sourceRow=i) for i, r in enumerate(csv.DictReader(f), 2)]
    words = [w for p in sorted((ROOT / "content/packs").glob("*.json"))
             for w in json.loads(p.read_text(encoding="utf-8"))["words"]
             if not w["id"].startswith(("h-", "k-", "sound-"))]
    corrections = read("content/decks/source-decisions.json")
    decisions = read("content/decks/advanced-coverage-decisions.json")
    cache = ROOT / ".cache/JMdict_e.gz"
    dictionary_hash = hashlib.sha256(cache.read_bytes()).hexdigest()
    assert dictionary_hash == read("content/sources/jmdict-provenance.json")["sha256"]
    wanted = {f for r in rows for f in alternatives(r["expression"])}
    wanted.update(w.get("lemma", {}).get("text", w["text"]) for w in words)
    with gzip.open(cache, "rb") as f:
        lexicon, entries = extract(f, wanted)
    result = []
    for row in rows:
        key = f"{level}:{row['sourceRow']}"
        audit = audit_row(row, lexicon, entries, words)
        item = dict(row, dictionaryStatus=audit["status"], independentMasteryEvidence=False)
        if key in corrections:
            decision = corrections[key]
            item.update(disposition="corrected-source-pair", courseIds=corrected_ids(row, decision, words, lexicon), decision=decision)
        elif audit["exactCourseForms"]:
            item.update(disposition="exact-taught-form", courseIds=audit["exactCourseForms"])
        elif audit["courseAliasCandidates"]:
            item.update(disposition="candidate-related-forms", courseIds=audit["courseAliasCandidates"],
                        sourceTargetSeparatelyTested=False,
                        reason="Pinned dictionary entry overlap only. A related spelling, inflection or homonym may have a different sense. This cross-reference does not certify source meaning, exact written-form recognition, independent vocabulary coverage or mastery.")
        elif (reviewed := reviewed_disposition(row, audit, decisions)):
            item.update(reviewed)
        else:
            raise ValueError(f"Unaccounted source row {key}: {row}")
        result.append(item)
    return dict(communityLevel=level.upper(), officialJLPTList=False,
                scope="Every raw source row is accounted for. Exact, corrected, candidate-related, attached-pattern and excluded expressions are distinct; none establishes mastery. Candidate-related rows are unverified for semantic equivalence and exact recognition. Pattern/exclusion dispositions do not assert that those targets are taught or tested.",
                csvSha256=digest, dictionarySha256=dictionary_hash, rows=result)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--level", choices=["n3", "n2", "n1"], required=True)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    result = build(args.level)
    path = ROOT / f"content/sources/decks/{args.level}-coverage.json"
    text = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.check:
        assert path.read_text(encoding="utf-8") == text, "Stale advanced coverage ledger"
    else:
        path.write_text(text, encoding="utf-8", newline="\n")
    print(json.dumps(dict(Counter(r["disposition"] for r in result["rows"])), indent=2))
