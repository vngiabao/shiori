# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy authorized after completion.

## Current checkpoint

44 installed packs: first-post, twelve N5 units, twelve N4 units, seven N5 decks (489 records), eleven N4 decks (528 records), and N3 unit 1. Total 1,717 records including 157 drills; 1,560 dictionary/name/chunk records, 1,530 distinct written targets, 183 lessons, 831 kanji pages. Suggested first-pass metadata 2,037 minutes is not measured time. Eighteen legacy letters, thirteen genre readings (2,042 Japanese characters), 45 scenes / 283 lines, seventy grammar notes. Zero human-reviewed packs. N3 unit 1: two lessons, 32 words, four notes, two ten-line scenes, one 215-character diary, sixteen tasks. Other N3/N2/N1/keigo units NOT authored.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4 each have sixty checkpoints and thirty samples; advanced levels retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Eighteen source-backed decks add 1,017 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Exact cells/reasons/tails pinned; raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense. See scripts/build-vocabulary-deck.py and scripts/build-vocabulary-ledger.py.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 4,467 Clear keys / 4,479 synthesis records; 283 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Every earlier record and scene mapping from 21c044e unchanged (4,367 keys / 4,379 records, 263 dialogues, 817 references/strokes). Ninety new WAV files mapped. Kana phonemes and native ±0.5-semitone settings retained. Incremental rendering; refresh pin only after preservation. Signal checks are not native listening certification.

Latest gates: TypeScript; 112 tests / 17 files; content/JMdict/kanji; five audio validators; preservation; beginner ledger; build; production offline reload/playback; N3 lesson/diary browser case pass. Diary screenshots 375/1440 both persisted themes inspected. Logs output/n3-u01-*.log. Precache 11,536.24 KiB / 1,184 entries. Earlier browser suite 38/39; stale welcome expectation corrected, focused rerun passed. Eight fresh welcome sizes/themes pass axe, overflow, greeting playback and guest start.

N3 source audit content/sources/grammar/n3-u01.json: two-source formation checks. ようになる/ようにする are N4-mapped bridges missing from core; purpose ように mapping disagrees; cause ために deferred. Original sentences only. Unit 2 source brief content/sources/grammar/n3-u02.json checked, unit not authored. Full advanced row audit unfinished; inventory acquisition isn't semantic verification. output/review-n3.md reviews unit 1 only.

## Exact next steps

1. Checkpoint/commit N3 unit 1 without pushing, then author n3-u02 from formation brief/outline. Two lessons, 30–40 new forms, two 8–12-line scenes, 200–400-character reading, 14–18 tasks. Review temporal-stage keys: たところ/たばかり must not compete when both fit. Preserve audio/refs, run gates. Finish remaining N3 units/decks/banks before N2, then N1 and twelve keigo scenarios.
2. Form-specific two-source checks before each remaining advanced unit. Full Bunpro/paginated Sensei inventory pointers: output/grammar-inventories.json. Outline corrections recorded; media/Kansai/internet are supplemental, not official requirements.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest directly in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. Earlier user confirmation to remove this gate remains unanswered; hold until answer. Kiyo untouched.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Google auth/Kiyo tables unchanged. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

21c044e latest local commit (beginner ledger/welcome). N3 unit 1 about to be checkpointed. No expansion pushed/deployed. Live older d90cce1 behind Access. Owner Google login, two-device sync and native language/listening reviews not certified. Keep this file current for continuation.
