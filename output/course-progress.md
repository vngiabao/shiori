# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. A separate backup branch may be pushed only after verifying that it cannot trigger a production deployment; otherwise keep local commits and record the uncertainty. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

66 installed packs: starter, twelve N5 units, twelve N4 units, sixteen N3 units, three N2 units, eighteen beginner decks and four N3 decks. Total 2,725 records including 157 drills; 2,568 dictionary/name/chunk records, 2,538 distinct written targets, 271 lessons and 1,169 kanji reference pages. Suggested first-pass metadata 3,593 minutes is not measured time. Eighteen legacy letters, thirty-four genre readings (8,610 Japanese characters), 81 scenes / 655 lines, 149 grammar notes. Zero human-reviewed packs.

N3 sixteen-unit core: thirty-two lessons / 512 new word records / 71 notes / thirty-two ten-line scenes / sixteen readings / 281 tasks. Unit 16 has 249 prose characters plus a timetable (306 together) and 18 tasks. N3 bank: sixty checkpoints + thirty samples. Four N3 decks add 400 source-checked words and 400 original examples across 52 lessons. Remaining N3 decks/final review and remaining N2/N1/keigo units/decks/banks NOT complete.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4/N3 each have sixty checkpoints and thirty samples; N2/N1 retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Twenty-two source-backed decks add 1,417 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 7,568 Clear keys / 7,580 synthesis records; 655 current dialogue takes, 125 historical takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Unit 3 adds 106 fully referenced WAVs. Earlier recordings, single-mora queries and pitch limits preserved. Signal checks do not certify perceived pronunciation.

Latest N3 editorial correction gates: TypeScript, 117 unit tests / 17 files, 24 Python source tests, content/dictionary/kanji/JLPT/ledger, five audio checks, preservation, sixteen focused N3 browser cases (an outdated reading-title fixture corrected and rerun), build and production offline playback pass. All 320 N3 scene recordings decode in browser. Saved themes/accessibility/readings/playback checked. Precache: 1,492 entries / 13,091.57 KiB. Logs output/n3-correction-*.log. Native language/listening review pending.

Latest full milestone gates (unit 12): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 52 browser tests; build; production offline reload/playback. All pass. Twelve N3 browser cases decode all 240 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 12 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u12-*.log. Precache 12,289.55 KiB / 1,341 entries, below 15 MB ceiling. Dedicated speaker retrieval test checks exact cast replay, feedback and progression. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews all sixteen N3 units and the written bank; final level review after decks. Human/native review pending.

## N2 core checkpoint — 2026-10-06

Unit 1: 44 restricted-JMdict-matched new spelling/reading pairs, two lessons, four three-example grammar notes, two twelve-line scenes, two original essays (453/479 characters) and twenty tasks. First-lesson reading avoids the second lesson’s newly taught contrasts. Forty-four headwords are genre study, not a requirement to speak every word in the scenes. Source brief content/sources/grammar/n2-u01.json; editorial review output/review-n2.md.

Content/dictionary/kanji/JLPT, all five audio checks, preservation, focused browser case with 24 WAV decodes and both readings in four viewport/theme combinations, build and real production offline playback pass. Earlier 7,197 Clear keys / 583 dialogue mappings unchanged, 125 historical takes retained; all 106 new WAVs mapped. Current precache 1,502 entries / 13,166.74 KiB. Logs output/n2-u01-*.log. One premature audio test ran while dialogue rendering was unfinished; after rendering, both audio mapping tests passed. Native review is pending.

Unit 2: forty new verified pairs, two lessons, four three-example notes, two twelve-line scenes, two essays (463/487 characters) and twenty tasks. Formation research and polarity/scope checks recorded in content/sources/grammar/n2-u02.json and output/review-n2.md. Believable first-shift advice and newsletter/film scheduling; no vocabulary padding. First-task vocabulary introduction repaired before final checks. TypeScript, 117 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT, five audio validators, preservation, focused browser playback/readings/themes/accessibility, build and real production offline pass. All 7,323 prior Clear mappings / 607 dialogue mappings preserved; 103 new WAVs mapped, 125 historical takes retained. Precache 1,519 entries / 13,255.21 KiB. Native review pending.

N2 unit 3 complete: 44 verified pairs, two lessons, four notes, 24 scene lines, two readings (510/535 characters) and twenty tasks. TypeScript, 117 unit tests, 24 Python source tests, all five audio checks, preservation, content/source/JLPT, focused browser, build and real production offline pass. All 7,442 prior Clear keys / 631 scene mappings intact; 106 new WAVs mapped; 125 historical takes retained. Precache 1,527 entries / 13,335.73 KiB. Native review pending. Next: research-backed N2 unit 4 arguing a point.

## Authoring correction — 2026-10-06

The user's latest correction supersedes the previous deck-first order and numerical recycling target. Natural conversation comes first: every line must fit the person, relationship and immediate situation. Never add unrelated vocabulary to reach a percentage. Count only actual, naturally used references; lower a unit's target explicitly with an editorial reason when necessary. No model/safety disclaimers or identity/evidence lectures in characters' dialogue or scene descriptions. Keep necessary scholarly limitations in review/source documentation. Use natural English contractions.

Casual speech units n3-u12/u13 and n2-u08/u14/u15 require repeated target forms at friend-chat density. Unit 12 repeatedly models じゃん, っけ, なきゃ, ちゃう, とく and てる. Unit 13 is a playful character-line guessing game. Vocabulary lists are supplementary study, not a quota for every conversation.

## Exact next steps

1. N3 naturalness correction complete: all 32 scenes reread, u12/u13 rewritten and 85 other lines corrected. Linked tasks/readings, incremental audio, old-asset preservation and review recorded; native review pending. N2 core units 1–3 now pass; continue directly with N2 core unit 4.
2. Finish and review N2 core units, then N1 core units, then twelve workplace-keigo scenarios BEFORE remaining N3/N2/N1 decks. Preserve the four completed N3 decks. Source-check grammar formations and review each level before starting the next.
3. Complete remaining source-backed vocabulary/kanji decks and written JLPT banks after the core. Raw pinned datasets remain unchanged. Full dictionary checks, examples, audio mappings and source dispositions are required; no filler or unsourced official-level claims.
4. Cloudflare inspected 2026-10-06: production branch main; preview-branch builds OFF; production command npx wrangler deploy. Safe backup destination course-build under these verified settings. Never push main until full completion. Re-check if settings change; no intermediate production deployment.
5. Final full-course gates, screenshots, additive saved-line-unit migration, push/deploy and live checks. Remove only Shiori's extra Access gate at the final complete deployment. Violetto welcome, guest access and owner-only Google sync remain; Kiyo stays untouched. supabase/migrations/202610050002_saved_line_unit.sql is not yet applied live.

## Commits and acceptance

e1ca818 N3 naturalness correction backed up successfully to private remote course-build, verified remote HEAD e1ca81833fa49560537899391496a75e9009bcb9. N2 unit 1 commit 43b7391 backed up to course-build and remote HEAD verified 43b7391f990937242b397e1c46f789c7a63ce2e9. N2 unit 2 commit 72011ad1992faae5151eea622cd7658113a3e0c9 backed up and remote course-build verified. Unit 3 is being committed; use git log -1 for its exact next preservation baseline. Push only course-build under verified preview-builds-OFF settings. Production remains older d90cce1 behind Access. Full expansion, final deploy/Access removal and owner login/two-device/native review are not complete.
