# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

49 installed packs: first-post, twelve N5 units, twelve N4 units, seven N5 decks (489 records), eleven N4 decks (528 records), and N3 units 1–6. Total 1,877 records including 157 drills; 1,720 dictionary/name/chunk records, 1,690 distinct written targets, 193 lessons, 915 kanji reference pages. Suggested first-pass metadata 2,337 minutes is not measured time. Eighteen legacy letters, eighteen genre readings (3,200 Japanese characters), 55 scenes / 383 lines, 91 grammar notes. Zero human-reviewed packs.

N3 first six units: twelve lessons / 192 new word records / 25 notes / twelve ten-line scenes / six readings of 215, 262, 226, 231, 214 and 225 characters / 101 tasks (16+16+18+18+16+17). Unit 6 separates decisions from completed actions, unnecessary calls from prohibitions, and requested supervisor advice from generic orders. Remaining ten N3 units and all N2/N1/keigo units NOT authored. Full advanced decks and banks NOT done.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4 each have sixty checkpoints and thirty samples; advanced levels retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Eighteen source-backed decks add 1,017 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 4,970 Clear keys / 4,982 synthesis records; 383 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Every earlier record and scene mapping from b22f844 unchanged (4,873 keys / 4,885 records, 363 dialogues, 903 dictionary references/strokes). Eighty-five new WAV files mapped. Kana phonemes and native ±0.5-semitone settings retained. Signal/synthesis checks are not native listening certification. Incremental renderer refreshed dialogue pin after final Clear additions, then preservation and all audio checks passed.

Latest full milestone gates: TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 45 browser tests; build; production offline reload/playback. All pass. Six N3 browser cases decode all 120 scene recordings and check lesson-specific grammar/playback/reading support. Unit 6 screenshots 375/1440 in saved light/dark themes inspected. Logs output/n3-u06-*.log. Precache 11,878.58 KiB / 1,268 entries, below 15 MB ceiling. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews units 1–6 only. Human/native review pending.

## Exact next steps

1. Author n3-u07: conditional contrast と/ば/たら/なら, directions/advice. All four are N4-tagged bridges/retrieval: N4 u01 なら, u05 たら, u06 と/regretば, u10 broaderば. Two lessons, 30–40 new forms, two 8–12-line scenes, 200–400-character guide and 14–18 tasks. Source attachments checked against Bunpro and JLPT Sensei; Wasabi teacher comparison checks overlap, request restrictions and chronological differences. Do not turn overlapping choices into ambiguous answer keys. Finish remaining N3 units/decks/banks before N2/N1 and keigo. Next full milestone after unit 9.
2. Form-specific source checks before each advanced unit. Preserve historical WAV/query records/strokes and refresh manifest pins only after preservation. Full source row/deck semantic audit unfinished.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. User confirmed removing Shiori's extra Access gate ONLY at final complete deployment. Google sync remains owner-only; Kiyo stays untouched. Local lacks production variables; production Cloudflare has them.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

b22f844 preceding local commit (N3 unit 5). Unit 6 is being committed with this file; git log -1 gives its actual hash afterward. Use actual Git HEAD as the next preservation baseline. No expansion pushed/deployed. Live older d90cce1 behind Access. Owner Google login, two-device sync and native language/listening reviews not certified.
