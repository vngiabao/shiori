# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

51 installed packs: first-post, twelve N5 units, twelve N4 units, seven N5 decks (489 records), eleven N4 decks (528 records), and N3 units 1–8. Total 1,941 records including 157 drills; 1,784 dictionary/name/chunk records, 1,754 distinct written targets, 197 lessons, 943 kanji reference pages. Suggested first-pass metadata 2,457 minutes is not measured time. Eighteen legacy letters, twenty genre readings (3,651 Japanese characters), 59 scenes / 423 lines, 99 grammar notes. Zero human-reviewed packs.

N3 first eight units: sixteen lessons / 256 new word records / 33 notes / sixteen ten-line scenes / eight readings / 137 tasks. Unit 8 has a 220-character diary and 18 tasks; contrast, accusation and repair distinguish observations from private intentions. Remaining eight N3 units and all N2/N1/keigo units NOT authored. Full advanced decks and banks NOT done.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4 each have sixty checkpoints and thirty samples; advanced levels retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Eighteen source-backed decks add 1,017 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 5,169 Clear keys / 5,181 synthesis records; 423 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Every earlier record/scene from 14075db unchanged (5,071 keys / 5,083 records, 403 dialogues, 929 dictionary references/strokes). Eighty-seven new WAV files mapped. Kana phonemes and native ±0.5-semitone settings retained. Signal/synthesis checks are not native listening certification. Unit 8 type/unit/content/source/JLPT/audio/preservation/focused-browser/build/production-offline gates pass; native review pending. Precache 1,296 entries / 12,017.19 KiB, below 15 MB.

Latest full milestone gates: TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 45 browser tests; build; production offline reload/playback. All pass. Six N3 browser cases decode all 120 scene recordings and check lesson-specific grammar/playback/reading support. Unit 6 screenshots 375/1440 in saved light/dark themes inspected. Logs output/n3-u06-*.log. Precache 11,878.58 KiB / 1,268 entries, below 15 MB ceiling. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews units 1–8 only. Human/native review pending.

## Exact next steps

1. Author n3-u09 from checked content/sources/grammar/n3-u09.json: appreciative おかげで, undesirable/blaming せいで, causal ため(に), and から/ので retrieval. Stance is not proof of causation; purpose ため already taught u01. Two lessons, 32 new pairs, four complete notes, two ten-line scenes, 200–400-character original news-lite report and 14–18 tasks. Preserve Saturday gathering success. Unit 8 complete locally. Finish N3 units/decks/banks before N2/N1 and keigo. Full milestone after unit 9.
2. Form-specific source checks before each advanced unit. Preserve historical WAV/query records/strokes and refresh manifest pins only after preservation. Full source row/deck semantic audit unfinished.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. User confirmed removing Shiori's extra Access gate ONLY at final complete deployment. Google sync remains owner-only; Kiyo stays untouched. Local lacks production variables; production Cloudflare has them.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

14075db preceding local commit (N3 unit 7). Unit 8 is being committed with this file; git log -1 gives its actual hash afterward. Use actual Git HEAD as the next preservation baseline. No expansion pushed/deployed. Live older d90cce1 behind Access. Owner Google login, two-device sync and native language/listening reviews not certified.
