# Grammar source verification

Checked 2026-10-05. These are sequencing references, not copied lessons or an official JLPT syllabus.

## N4

The [Japan Times third-edition GENKI syllabus](https://bookclub2.japantimes.co.jp/download/files/genki3/genki-3rd_syllabus_E.pdf), lessons 13–23, is the publisher source. The outline follows its sequence, with an original review unit 12. Two missing items were identified: lesson 20's negative-form + ないで and lesson 22's noun + のように / のような. They belong in Shiori units 8 and 10. The publisher's examples are not reproduced in the course.

Six lesson-13 functions are grouped into three teaching notes in unit 1: potential forms and frequency; connected reasons and visible appearance; trying an action and contextual なら. A note can cover related functions without removing them from practice.

Rechecked the publisher's lesson 20–23 inventory at the twelve-unit checkpoint. Unit 8 now includes general humble action patterns as well as special forms. Unit 10 explicitly covers all three causative-benefit viewpoints. Unit 11 was corrected to include how-to ～方 (かた); comparison 方 (ほう) did not satisfy that syllabus item. Original contexts in units 9–12 adapt the outline to the established office/practice story while retaining the grammar order. No publisher exercise or example was imported.

## N3–N1: verification in progress

Primary inventories opened: [Bunpro's grammar library](https://bunpro.jp/grammar_points) and the JLPT Sensei author inventories for [N3](https://jlptsensei.com/jlpt-n3-grammar-list/), [N2](https://jlptsensei.com/jlpt-n2-grammar-list/) and [N1](https://jlptsensei.com/jlpt-n1-grammar-list/). These are independent editorial mappings. Level labels can disagree, and the current JLPT does not publish a vocabulary/grammar specification. Each advanced unit still needs its row-by-row cross-check before authoring; opening an inventory is not completion of that audit.

Focused sequencing check during the deck batch: [Bunpro's ばかりでなく entry](https://bunpro.jp/grammar_points/ばかりでなく) and the [JLPT Sensei N3 inventory](https://jlptsensei.com/jlpt-n3-grammar-list/) both place that main form in their N3 material. Bunpro includes ばかりか as a variant; JLPT Sensei places it in N2, as does [MLC Japanese School's labelled N2 worksheet](https://www.mlcjapanese.co.jp/img/bakarika_n2_answer.pdf). This is a mapping disagreement, not an official boundary. Shiori's teaching choice is now ばかりでなく as the N3 u14 core and ばかりか as a written expansion at N2 u04. No publisher examples or questions are reproduced. This focused check does not complete the remaining advanced row audit.

## Vocabulary inventory

Pinned CSV files: `content/sources/jlpt-vocabulary/`, repository revision `1ad66734417aca9dbcca6b2d5ee440cb13ab3ba0`. Attribution: Jonathan Waller / Tanos, via chyyran/jlpt-anki-decks and jamsinclair/open-anki-jlpt-decks. Upstream permission is CC BY with version unspecified; repository code is MIT. The provenance file preserves separate source URLs and hashes.

The files contain 718 N5, 668 N4, 2,140 N3, 1,906 N2 and 2,699 N1 rows: 8,131 before deduplication. They do not establish a 10,000-word deck or official exam coverage. Additional sourced vocabulary is required for that target; do not create filler or falsely label those additions as official JLPT words. Individual headword/reading pairs must pass JMdict restriction checks before installation.

`python scripts/audit_vocabulary_source.py` audits all five pinned CSVs against the hash-pinned cached JMdict and writes `output/vocabulary-source-audit.json`. It preserves original cells and distinguishes prefixes/counters, missing or swapped reading cells, suru-form representations, unmatched phrases and actual spelling/reading disagreements. Shared dictionary entries are only alias candidates; they do not prove the same meaning was taught. No source meanings or examples are silently imported.

Initial audit: N5 has 674 matching rows, 41 patterns and three unmatched rows. N4 has 600 matching rows, 31 patterns, 26 suru-form representations requiring review, seven unmatched, one non-kana reading cell, two missing readings and one spelling/reading disagreement. The swapped いただく/頂く cell, empty ごらんになる/かまう readings, and 真中/まんなか spelling need editorial resolution before deck installation. These are source-data findings, not errors in installed course audio. Parenthetical '(する)' annotations are removed only for comparison and remain visible in the report. Seven focused tests cover these distinctions and reading restrictions.
