# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. A separate backup branch may be pushed only after verifying that it cannot trigger a production deployment; otherwise keep local commits and record the uncertainty. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

63 installed packs: starter, twelve N5 units, twelve N4 units, sixteen N3 units, eighteen beginner decks and four N3 decks. Total 2,597 records including 157 drills; 2,440 dictionary/name/chunk records, 2,410 distinct written targets, 265 lessons and 1,136 kanji reference pages. Suggested first-pass metadata 3,353 minutes is not measured time. Eighteen legacy letters, twenty-eight genre readings (5,683 Japanese characters), 75 scenes / 583 lines, 137 grammar notes. Zero human-reviewed packs.

N3 sixteen-unit core: thirty-two lessons / 512 new word records / 71 notes / thirty-two ten-line scenes / sixteen readings / 281 tasks. Unit 16 has 249 prose characters plus a timetable (306 together) and 18 tasks. N3 bank: sixty checkpoints + thirty samples. Four N3 decks add 400 source-checked words and 400 original examples across 52 lessons. Remaining N3 decks/final review and all N2/N1/keigo units/decks/banks NOT complete.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4/N3 each have sixty checkpoints and thirty samples; N2/N1 retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Twenty-two source-backed decks add 1,417 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 7,197 Clear keys / 7,209 synthesis records; 583 current dialogue takes, 125 historical replaced takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Baseline 04996d2's 7,068 Clear keys and recordings are unchanged; 458 unchanged dialogue mappings preserved, 125 authorised revised scene lines correctly mapped. All 254 new WAVs referenced. Kana phonemes and native ±0.5-semitone settings retained; signal checks do not certify perceived pronunciation.

Latest N3 editorial correction gates: TypeScript, 117 unit tests / 17 files, 24 Python source tests, content/dictionary/kanji/JLPT/ledger, five audio checks, preservation, sixteen focused N3 browser cases (an outdated reading-title fixture corrected and rerun), build and production offline playback pass. All 320 N3 scene recordings decode in browser. Saved themes/accessibility/readings/playback checked. Precache: 1,492 entries / 13,091.57 KiB. Logs output/n3-correction-*.log. Native language/listening review pending.

Latest full milestone gates (unit 12): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 52 browser tests; build; production offline reload/playback. All pass. Twelve N3 browser cases decode all 240 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 12 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u12-*.log. Precache 12,289.55 KiB / 1,341 entries, below 15 MB ceiling. Dedicated speaker retrieval test checks exact cast replay, feedback and progression. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews all sixteen N3 units and the written bank; final level review after decks. Human/native review pending.

## Authoring correction — 2026-10-06

The user's latest correction supersedes the previous deck-first order and numerical recycling target. Natural conversation comes first: every line must fit the person, relationship and immediate situation. Never add unrelated vocabulary to reach a percentage. Count only actual, naturally used references; lower a unit's target explicitly with an editorial reason when necessary. No model/safety disclaimers or identity/evidence lectures in characters' dialogue or scene descriptions. Keep necessary scholarly limitations in review/source documentation. Use natural English contractions.

Casual speech units n3-u12/u13 and n2-u08/u14/u15 require repeated target forms at friend-chat density. Unit 12 repeatedly models じゃん, っけ, なきゃ, ちゃう, とく and てる. Unit 13 is a playful character-line guessing game. Vocabulary lists are supplementary study, not a quota for every conversation.

## Exact next steps

1. N3 naturalness correction complete: all 32 scenes reread, u12/u13 rewritten and 85 other lines corrected. Linked tasks/readings, incremental audio, old-asset preservation and review recorded; native review pending. Continue directly with N2 core unit 1.
2. Finish and review N2 core units, then N1 core units, then twelve workplace-keigo scenarios BEFORE remaining N3/N2/N1 decks. Preserve the four completed N3 decks. Source-check grammar formations and review each level before starting the next.
3. Complete remaining source-backed vocabulary/kanji decks and written JLPT banks after the core. Raw pinned datasets remain unchanged. Full dictionary checks, examples, audio mappings and source dispositions are required; no filler or unsourced official-level claims.
4. Cloudflare inspected 2026-10-06: production branch main; preview-branch builds OFF; production command npx wrangler deploy. Safe backup destination course-build under these verified settings. Never push main until full completion. Re-check if settings change; no intermediate production deployment.
5. Final full-course gates, screenshots, additive saved-line-unit migration, push/deploy and live checks. Remove only Shiori's extra Access gate at the final complete deployment. Violetto welcome, guest access and owner-only Google sync remain; Kiyo stays untouched. supabase/migrations/202610050002_saved_line_unit.sql is not yet applied live.

## Commits and acceptance

04996d2 preceding local commit (sixteen N3 units / bank / four decks). The naturalness correction is being committed with this file; git log -1 gives its actual hash. Use actual HEAD as the next preservation baseline. Back up to course-build after this commit; report the actual push result separately. Production remains older d90cce1 behind Access. Full expansion, final deploy/Access removal and owner login/two-device/native review are not complete.
