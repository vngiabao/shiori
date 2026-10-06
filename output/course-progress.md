# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

63 installed packs: starter, twelve N5 units, twelve N4 units, sixteen N3 units, eighteen beginner decks and four N3 decks. Total 2,597 records including 157 drills; 2,440 dictionary/name/chunk records, 2,410 distinct written targets, 265 lessons and 1,136 kanji reference pages. Suggested first-pass metadata 3,353 minutes is not measured time. Eighteen legacy letters, twenty-eight genre readings (5,664 Japanese characters), 75 scenes / 583 lines, 137 grammar notes. Zero human-reviewed packs.

N3 sixteen-unit core: thirty-two lessons / 512 new word records / 71 notes / thirty-two ten-line scenes / sixteen readings / 281 tasks. Unit 16 has 249 prose characters plus a timetable (306 together) and 18 tasks. N3 bank: sixty checkpoints + thirty samples. Four N3 decks add 400 source-checked words and 400 original examples across 52 lessons. Remaining N3 decks/final review and all N2/N1/keigo units/decks/banks NOT complete.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4/N3 each have sixty checkpoints and thirty samples; N2/N1 retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Twenty-two source-backed decks add 1,417 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 7,068 Clear keys / 7,080 synthesis records; 583 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. All earlier HEAD 162df1b records/scenes/strokes unchanged. All 859 new WAVs mapped. Kana phonemes and native ±0.5-semitone settings retained; signal checks do not certify perceived pronunciation.

Latest unit-16 / N3 decks 01–04 gates: TypeScript, 116 unit tests / 17 files, 24 Python source tests, content/dictionary/kanji/JLPT/ledger, five audio checks, preservation, build and production offline reload/playback pass. Full browser run: 77 passed through deck 03; four focused cases after deck 04 pass all four N3 deck interactions, every deck-04 recording decode, unit-16 timetable keyboard scrolling/themes/axe and N4 table reader. Deck audio tests now decode every mapped clip in bounded per-deck cases instead of one growing timeout. Light 1440 / dark 375 unit-16 screenshots inspected. Final precache: 13,093.17 KiB / 1,492 entries. Offline verification caches 2,855 deck URLs and plays one example from all 22 installed decks; all teacher/dialogue/cast clips remain included. Logs output/n3-u16-decks-*.log and output/n3-deck04-*.log.

Latest full milestone gates (unit 12): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 52 browser tests; build; production offline reload/playback. All pass. Twelve N3 browser cases decode all 240 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 12 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u12-*.log. Precache 12,289.55 KiB / 1,341 entries, below 15 MB ceiling. Dedicated speaker retrieval test checks exact cast replay, feedback and progression. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews all sixteen N3 units and the written bank; final level review after decks. Human/native review pending.

## Exact next steps

1. Continue N3 deck 05 and later batches. Run python scripts/audit_vocabulary_source.py after each installed deck; choose 100 clean unused N3 pairs, exclude earlier exact targets/course alias candidates/shared dictionary entries, author individual original meanings/examples in six-column LF text, compile with scripts/build-vocabulary-deck.py, refresh dictionary/kanji/packs and render incrementally. Raw N3 rows include unmatched annotations (79, 247, 1155, 1737), patterns (1157, 1249, 2101) and a 唯 reading mismatch (1415); review explicitly, never suppress. Keep the raw pinned CSV unchanged. Complete source-backed cumulative N3 coverage and strict whole-level review before N2/N1/keigo.
2. Form-specific source checks before each advanced unit. Preserve historical WAV/query records/strokes and refresh manifest pins only after preservation. Full source row/deck semantic audit unfinished.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. User confirmed removing Shiori's extra Access gate ONLY at final complete deployment. Google sync remains owner-only; Kiyo stays untouched. Local lacks production variables; production Cloudflare has them.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

162df1b preceding local commit (unit 15). Unit 16, N3 bank, four N3 decks and focused table/audio-test fixes are being committed with this file; git log -1 gives the actual hash afterward. Use actual HEAD as the next preservation baseline. No expansion pushed/deployed. Live older d90cce1 behind Access. Deployment/removal of only Shiori's Access gate is authorized after FULL completion, not this checkpoint. Owner login, two-device sync and native language/listening reviews not certified.
