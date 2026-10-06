# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

52 installed packs: first-post, twelve N5 units, twelve N4 units, seven N5 decks (489 records), eleven N4 decks (528 records), and N3 units 1–9. Total 1,973 records including 157 drills; 1,816 dictionary/name/chunk records, 1,786 distinct written targets, 199 lessons, 959 kanji reference pages. Suggested first-pass metadata 2,517 minutes is not measured time. Eighteen legacy letters, twenty-one genre readings (3,896 Japanese characters), 61 scenes / 443 lines, 103 grammar notes. Zero human-reviewed packs.

N3 first nine units: eighteen lessons / 288 new word records / 37 notes / eighteen ten-line scenes / nine readings / 155 tasks. Unit 9 has a 245-character fictional report and 18 tasks. Remaining seven N3 units and all N2/N1/keigo units NOT authored. Full advanced decks and banks NOT done.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4 each have sixty checkpoints and thirty samples; advanced levels retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Eighteen source-backed decks add 1,017 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 5,266 Clear keys / 5,278 synthesis records; 443 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Every earlier record/scene from 6bc73c0 unchanged (5,169 keys / 5,181 records, 423 dialogues, 943 dictionary references/strokes). Eighty-five new WAV files mapped. Kana phonemes and native ±0.5-semitone settings retained. Signal/synthesis checks are not native listening certification.

Latest full milestone gates (unit 9): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 48 browser tests; build; production offline reload/playback. All pass. Nine N3 browser cases decode all 180 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 9 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u09-*.log. Precache 12,089.45 KiB / 1,313 entries, below 15 MB ceiling. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews units 1–9 only. Human/native review pending.

## Exact next steps

1. Finish authoring n3-u10 from checked content/sources/grammar/n3-u10.json. Ignored output/author-n3-u10.py has rows, five notes and two scenes; reading/tasks/write step not complete and helper not executed. Teach たびに, 間/間に/最中, retrieve うちに, contrast がち/気味 without artificial synonym exclusivity. Two lessons, 32 new pairs, two ten-line scenes, 200–400-character diary and 14–18 tasks. Unit 9 complete locally. Finish N3 units/decks/banks before N2/N1 and keigo. Next full milestone after unit 12.
2. Form-specific source checks before each advanced unit. Preserve historical WAV/query records/strokes and refresh manifest pins only after preservation. Full source row/deck semantic audit unfinished.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. User confirmed removing Shiori's extra Access gate ONLY at final complete deployment. Google sync remains owner-only; Kiyo stays untouched. Local lacks production variables; production Cloudflare has them.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

6bc73c0 preceding local commit (N3 unit 8). Unit 9 is being committed with this file; git log -1 gives its actual hash afterward. Use actual Git HEAD as the next preservation baseline. No expansion pushed/deployed. Live older d90cce1 behind Access. Owner Google login, two-device sync and native language/listening reviews not certified.
