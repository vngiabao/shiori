# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. User resumed the interrupted run and reaffirmed deployment on completion. Chinese stays read-only. Do not change design, auth or database identity. No intermediate push because Cloudflare may auto-deploy. No extra approval for final deploy.

## Current checkpoint

36 installed packs: first-post, twelve N5 units, twelve N4 units, five N5 vocabulary decks (455 records) and six N4 decks (486 records). Total 1,609 word records including 157 drills; 1,452 dictionary/name/chunk records, 1,433 distinct written targets, 168 lessons and 800 kanji pages. Suggested first-pass metadata 1,873 minutes, not measured learning time. Eighteen legacy letters, twelve genre readings, 43 scenes / 263 lines, 66 grammar notes. N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings and 192 exercises. Zero human-reviewed packs. N3/N2/N1/keigo units are NOT authored. N4 Phase 5 remains open for source-row accounting and final review.

Eleven source-backed decks add 941 form records with original ruby/English examples and Clear audio. Standard packs have 100 rows; documented tails are 55 N5, 66 N4 and 20 N4 noun/suru corrections. Exact raw/selected source cells and rationales are pinned, with restricted JMdict pairs still required. Raw CSV unchanged. Definitions/examples remain original AI-assisted drafts. Related forms may share senses; candidate shared entry IDs do NOT prove taught coverage. Read scripts/build-vocabulary-deck.py and content/decks/tail-batches.json, source-decisions.json, alias-decisions.json.

Completed engine: multi-scene/multi-lesson units; reading/table/pair/literature/manga schemas and UI; speaker/register/compare exercises; grammar examples; recycling; course grouping; Watch unit tags; safe interrupted playback. N5 gaps: scenes, actionable u06 letter, grammar-recall cloze label, seven role-play turns with alternatives/audio. Design, SVG mascot/logo, Violetto one voice and IndexedDB identity preserved. N5/N4 each have ninety assessment items (sixty checkpoints, thirty separate samples); advanced levels retain twelve seeds each. Two/six-item runs rotate unseen then least-seen IDs. Historical IDs, options, answers and backups retained. Completion is not mastery or exam readiness.

N4 review fixes: u08 general humble action patterns and ないで; u10 all three causative-benefit viewpoints and のよう; u11 method 方 (かた); premature concessive ても removed; passive affected-event retrieval added. Reviews in output/review-n4.md, grammar retrieval in output/n4-grammar-ledger.md.

Audio: 4,196 Clear keys / 4,208 synthesis records; 263 dialogue takes, 100 teacher messages, twenty expressive takes, twelve cast auditions. All 3,246 Clear URLs / 3,258 records from e10eb52, 263 dialogues and 653 previous kanji/stroke records are unchanged. All 683 new WAV files mapped. Kana phonemes and native ±0.5-semitone delivery retained. Use renderers --incremental, guard native exit codes, refresh manifest pin after preservation checks. Human listening remains acceptance.

Latest gates: TypeScript, 104 unit tests / 16 files, 22 Python tests, both content gates, all five audio validators, full 39-browser suite, build and production offline cache/reload/playback pass. Logs output/course-split-*.log and output/n4suru-source-tests.log. Static level chunks reduce main JS to 342.75 kB / 107.85 kB gzip; precache 11,397.66 KiB. All course data still loads together; this is independent cache reuse, not on-demand level loading. Future precache budget/optional level downloads remain required for full-course growth.

Dictionary: 1,373 subset forms; 1,367 matched records, 81 explicitly unverified chunks/inflections, four unverified names, 157 excluded drills. All 800 kanji have pinned KANJIDIC2/KanjiVG pages; no fake page for 々. Refresh cached sources deliberately, never silently update upstream.

Raw audit: N5 607 exact, 65 alias candidates, 40 patterns, three unmatched, three matched-but-excluded. N4 552 exact, 42 aliases, 31 patterns, 26 noun/suru cases, seven unmatched, six excluded, two missing readings, one swapped cell, one disagreement. Twenty suru rows now have explicit corrected noun records but raw audit keeps original status; five nouns already taught, 心配 needs sense review. Some alias candidates are homonyms with different meanings/readings. No candidate automatically counts as covered. Audit from pinned community CSV/JMdict, never edit raw CSV. Source has 8,131 rows, not 10,000 unique official words.

## Exact next steps

1. Finish N5/N4 source accounting: review aliases by selected reading/sense, add missing useful forms with explicit rationale/examples/audio, resolve swapped いただく/頂く, missing ごらんになる/かまう and 真中 spelling. Patterns/counters and obsolete rows need taught references or exclusions. Preserve honest coverage.
2. Close N4 Phase 5 consolidated review and gates before N3 authorship. Existing twelve core units/ninety-item bank pass; don't replace with seeds or reset progress.
3. Complete advanced grammar two-source row audit (Bunpro and paginated JLPT Sensei lists). Existing corrections: N3 u14 ばかりでなく / N2 u04 ばかりか; N3 u08 ながらも; N3 introduces っぽい/がち/気味 and N2 reviews with げ. Earlier grammar in advanced outline is contrast/retrieval; character speech/Kansai/internet are supplemental recognition. Opening a list isn't verification of all rows.
4. Author/review sequentially: sixteen N3 two-lesson units; sixteen N2 two/three-lesson units; twelve N1 three-lesson units; twelve keigo scenarios. Exact specs in prompts/gpt-course-continue.md. Finish each level's decks, references, banks and Phase 5 before next. No filler as advanced curriculum.
5. Final checks/screenshots, additive saved-line-unit migration, push/deploy and live verification behind Access. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live yet. Do not alter Google auth or Kiyo tables. Deploy already authorized after whole scope.

## Checkpoints and acceptance

e10eb52 was the prior six-deck commit. The current eleven-deck/data-split batch passes and is ready to commit; use git log for later checkpoint. Expansion is not pushed/deployed. Owner Google sign-in, two-device sync round trip and native language/listening reviews are not certified. Keep this file current for automatic continuation.
