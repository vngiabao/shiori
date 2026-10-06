# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

56 installed packs: starter, twelve N5 units, twelve N4 units, eighteen beginner decks and N3 units 1–13. Total 2,101 records including 157 drills; 1,944 dictionary/name/chunk records, 1,914 distinct written targets, 207 lessons and 1,004 kanji reference pages. Suggested first-pass metadata 2,757 minutes is not measured time. Eighteen legacy letters, twenty-five genre readings (4,818 Japanese characters), 69 scenes / 523 lines, 122 grammar notes. Zero human-reviewed packs.

N3 first thirteen units: twenty-six lessons / 416 new word records / 56 notes / twenty-six ten-line scenes / thirteen readings / 227 tasks. Unit 13 has a 214-character message and 18 tasks. Remaining three N3 units and all N2/N1/keigo units NOT authored. Advanced decks and banks NOT done.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4 each have sixty checkpoints and thirty samples; advanced levels retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Eighteen source-backed decks add 1,017 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 5,680 Clear keys / 5,692 synthesis records; 523 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. All earlier HEAD 23207d3 records/scenes/strokes unchanged. All 95 new WAVs mapped. Kana phonemes and native ±0.5-semitone settings retained; signal checks do not certify perceived pronunciation.

Latest unit-13 gates: TypeScript, 112 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT/ledger, five audio checks, preservation, focused browser decode/playback/themes/accessibility, build and production offline playback passed. Light 1440 / dark 375 inspected. Precache 12,365.60 KiB / 1,358 entries. Full browser milestone remains unit 12; next after unit 15.

Latest full milestone gates (unit 12): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 52 browser tests; build; production offline reload/playback. All pass. Twelve N3 browser cases decode all 240 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 12 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u12-*.log. Precache 12,289.55 KiB / 1,341 entries, below 15 MB ceiling. Dedicated speaker retrieval test checks exact cast replay, feedback and progression. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews units 1–13 only. Human/native review pending.

## Exact next steps

1. Author n3-u14 product review: additive ばかりでなく/だけでなく, degree ほど/くらい, negative comparisons, unexpected/minimal さえ and sufficient-condition さえ〜ば. Two independent primary sources per group researched; 36 new dictionary candidates preflighted. Save source brief, author 32 words, five notes, two scenes, reading and 14–18 tasks. Then units 15–16, full N3 decks/banks and strict level review before N2/N1/keigo.
2. Form-specific source checks before each advanced unit. Preserve historical WAV/query records/strokes and refresh manifest pins only after preservation. Full source row/deck semantic audit unfinished.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. User confirmed removing Shiori's extra Access gate ONLY at final complete deployment. Google sync remains owner-only; Kiyo stays untouched. Local lacks production variables; production Cloudflare has them.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

23207d3 preceding local commit (unit 12). Unit 13 is being committed with this file; git log -1 gives its actual hash afterward. Use actual HEAD as preservation baseline. No expansion pushed/deployed. Live older d90cce1 behind Access. Owner login, two-device sync and native language/listening reviews not certified.
