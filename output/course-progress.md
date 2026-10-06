# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. A separate backup branch may be pushed only after verifying that it cannot trigger a production deployment; otherwise keep local commits and record the uncertainty. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

71 installed packs: starter, twelve N5 units, twelve N4 units, sixteen N3 units, eight N2 units, eighteen beginner decks and four N3 decks. Total 2,947 records including 157 drills; 2,790 dictionary/name/chunk records, 2,760 distinct written targets, 281 lessons and 1,202 kanji reference pages. Suggested first-pass metadata 3,993 minutes is not measured time. Eighteen legacy letters, forty-four genre readings (12,825 Japanese characters), 91 scenes / 785 lines, 170 grammar notes. Zero human-reviewed packs.

N3 sixteen-unit core: thirty-two lessons / 512 new word records / 71 notes / thirty-two ten-line scenes / sixteen readings / 281 tasks. Unit 16 has 249 prose characters plus a timetable (306 together) and 18 tasks. N3 bank: sixty checkpoints + thirty samples. Four N3 decks add 400 source-checked words and 400 original examples across 52 lessons. Remaining N3 decks/final review and remaining N2/N1/keigo units/decks/banks NOT complete.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4/N3 each have sixty checkpoints and thirty samples; N2/N1 retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Twenty-two source-backed decks add 1,417 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 8,226 Clear keys / 8,238 synthesis records; 785 current dialogue takes, 125 historical takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Unit 8 adds 130 fully referenced WAVs. Earlier recordings, single-mora queries and pitch limits preserved. Signal checks do not certify perceived pronunciation.

Latest N3 editorial correction gates: TypeScript, 117 unit tests / 17 files, 24 Python source tests, content/dictionary/kanji/JLPT/ledger, five audio checks, preservation, sixteen focused N3 browser cases (an outdated reading-title fixture corrected and rerun), build and production offline playback pass. All 320 N3 scene recordings decode in browser. Saved themes/accessibility/readings/playback checked. Precache: 1,492 entries / 13,091.57 KiB. Logs output/n3-correction-*.log. Native language/listening review pending.

Latest full milestone gates (unit 12): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 52 browser tests; build; production offline reload/playback. All pass. Twelve N3 browser cases decode all 240 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 12 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u12-*.log. Precache 12,289.55 KiB / 1,341 entries, below 15 MB ceiling. Dedicated speaker retrieval test checks exact cast replay, feedback and progression. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews all sixteen N3 units and the written bank; final level review after decks. Human/native review pending.

## N2 core checkpoint — 2026-10-06

Unit 1: 44 restricted-JMdict-matched new spelling/reading pairs, two lessons, four three-example grammar notes, two twelve-line scenes, two original essays (453/479 characters) and twenty tasks. First-lesson reading avoids the second lesson’s newly taught contrasts. Forty-four headwords are genre study, not a requirement to speak every word in the scenes. Source brief content/sources/grammar/n2-u01.json; editorial review output/review-n2.md.

Content/dictionary/kanji/JLPT, all five audio checks, preservation, focused browser case with 24 WAV decodes and both readings in four viewport/theme combinations, build and real production offline playback pass. Earlier 7,197 Clear keys / 583 dialogue mappings unchanged, 125 historical takes retained; all 106 new WAVs mapped. Current precache 1,502 entries / 13,166.74 KiB. Logs output/n2-u01-*.log. One premature audio test ran while dialogue rendering was unfinished; after rendering, both audio mapping tests passed. Native review is pending.

Unit 2: forty new verified pairs, two lessons, four three-example notes, two twelve-line scenes, two essays (463/487 characters) and twenty tasks. Formation research and polarity/scope checks recorded in content/sources/grammar/n2-u02.json and output/review-n2.md. Believable first-shift advice and newsletter/film scheduling; no vocabulary padding. First-task vocabulary introduction repaired before final checks. TypeScript, 117 unit tests, 24 Python source tests, content/dictionary/kanji/JLPT, five audio validators, preservation, focused browser playback/readings/themes/accessibility, build and real production offline pass. All 7,323 prior Clear mappings / 607 dialogue mappings preserved; 103 new WAVs mapped, 125 historical takes retained. Precache 1,519 entries / 13,255.21 KiB. Native review pending.

N2 unit 3 complete: 44 verified pairs, two lessons, four notes, 24 scene lines, two readings (510/535 characters) and twenty tasks. TypeScript, 117 unit tests, 24 Python source tests, all five audio checks, preservation, content/source/JLPT, focused browser, build and real production offline pass. All 7,442 prior Clear keys / 631 scene mappings intact; 106 new WAVs mapped; 125 historical takes retained. Precache 1,527 entries / 13,335.73 KiB. Native review pending. Unit 4 is complete; its review and gates follow below.

## Authoring correction — 2026-10-06

The user's latest correction supersedes the previous deck-first order and numerical recycling target. Natural conversation comes first: every line must fit the person, relationship and immediate situation. Never add unrelated vocabulary to reach a percentage. Count only actual, naturally used references; lower a unit's target explicitly with an editorial reason when necessary. No model/safety disclaimers or identity/evidence lectures in characters' dialogue or scene descriptions. Keep necessary scholarly limitations in review/source documentation. Use natural English contractions.

Casual speech units n3-u12/u13 and n2-u08/u14/u15 require repeated target forms at friend-chat density. Unit 12 repeatedly models じゃん, っけ, なきゃ, ちゃう, とく and てる. Unit 13 is a playful character-line guessing game. Vocabulary lists are supplementary study, not a quota for every conversation.

## Exact next steps

1. N3 naturalness correction complete: all 32 scenes reread, u12/u13 rewritten and 85 other lines corrected. Linked tasks/readings, incremental audio, old-asset preservation and review recorded; native review pending. N2 core units 1–8 now pass; continue directly with N2 core unit 9 contextual refusal.
2. Finish and review N2 core units, then N1 core units, then twelve workplace-keigo scenarios BEFORE remaining N3/N2/N1 decks. Preserve the four completed N3 decks. Source-check grammar formations and review each level before starting the next.
3. Complete remaining source-backed vocabulary/kanji decks and written JLPT banks after the core. Raw pinned datasets remain unchanged. Full dictionary checks, examples, audio mappings and source dispositions are required; no filler or unsourced official-level claims.
4. Cloudflare inspected 2026-10-06: production branch main; preview-branch builds OFF; production command npx wrangler deploy. Safe backup destination course-build under these verified settings. Never push main until full completion. Re-check if settings change; no intermediate production deployment.
5. Final full-course gates, screenshots, additive saved-line-unit migration, push/deploy and live checks. Remove only Shiori's extra Access gate at the final complete deployment. Violetto welcome, guest access and owner-only Google sync remain; Kiyo stays untouched. supabase/migrations/202610050002_saved_line_unit.sql is not yet applied live.

## Commits and acceptance

e1ca818 N3 naturalness correction backed up successfully to private remote course-build, verified remote HEAD e1ca81833fa49560537899391496a75e9009bcb9. N2 unit 1 commit 43b7391 backed up to course-build and remote HEAD verified 43b7391f990937242b397e1c46f789c7a63ce2e9. N2 unit 2 commit 72011ad1992faae5151eea622cd7658113a3e0c9 backed up and remote course-build verified. Unit 3 commit 925148aa5611b580d1fb1bc3b42b1fcc66ebffe8 backed up and remote course-build verified. Unit 4 commit bfd60410fdcb45fb71d72447acb45b5e6516ab24 backed up and remote course-build verified. Unit 5 commit a15d31e9e86b3fbe6ef0576164ed994ff1887353 backed up and exact remote course-build verified. Unit 6 commit 86dca72dcf879eb58172c2d5b92ec0758a0af57f backed up and exact remote course-build verified. Unit 7 commit aa0faefc3c475308606b3a6fec8ea4322a22c8ce backed up and exact course-build verified. Unit 8 is being committed; use git log -1 for the next preservation baseline. Push only course-build under verified preview-builds-OFF settings. Production remains older d90cce1 behind Access. Full expansion, final deploy/Access removal and owner login/two-device/native review are not complete.


## N2 unit 4 verified checkpoint

45 verified pairs, two lessons, five three-example notes, 24 scene lines, two essays (422/449 characters), twenty tasks. All final source/audio/browser/build/offline gates pass: 117 unit tests, 24 Python tests, five audio validators; all 7,568 prior Clear keys / 655 dialogue mappings preserved, 112 new WAVs mapped and 125 historical takes retained. Precache 1,540 entries / 13,421.34 KiB; production offline report 2026-10-06T21:17:30.900Z. Specific fee/venue naturalness corrections and eight-percent recycling exception recorded in output/review-n2.md. Native review pending. Logs output/n2-u04-*.log. No production deployment.

Unit 5 research and final verification now complete; its next checkpoint follows. Do not rerun ignored author/support helpers over corrected source files.


## N2 unit 5 verified checkpoint

44 verified pairs, two lessons, four three-example notes, 24 scene lines, two news readings (422/414 characters), twenty tasks. Final source/audio/browser/build/offline gates pass: 117 unit tests, 24 Python tests, five audio validators; all 7,701 prior Clear keys / 679 dialogue mappings preserved, 109 new WAVs mapped and 125 historical takes retained. Precache 1,544 entries / 13,491.66 KiB; offline report 2026-10-06T21:43:20.941Z. Editorial corrections in output/review-n2.md. Native review pending. Logs output/n2-u05-*.log. No production deployment.

Unit 6 research and all final gates are complete; verified checkpoint follows. Do not rerun ignored author/support helpers over corrected sources.


## N2 unit 6 verified checkpoint

44 new verified pairs, two lessons, four three-example notes, 24 scene lines, two emails (444/435 characters), twenty tasks. Final source/audio/browser/build/offline gates pass: 117 unit tests, 24 Python tests, five audio validators; all 7,830 earlier Clear keys / 703 dialogue mappings preserved, 109 new WAVs mapped and 125 historical takes retained. Precache 1,553 entries / 13,568.45 KiB; offline report 2026-10-06T21:59:11.400Z. Review output/review-n2.md. Native review pending. Logs output/n2-u06-*.log. No production deployment.

Exact next: N2 unit 7 phone and meetings. Preliminary sources inspected: MLC Business Dialogue No.03/04 (internal availability, external own-side colleague references and callback choice), Bunpro でございます (formal copula distinct from existence), Culture Agency official 敬語の指針 page 46 (external references to own boss, context exceptions) and request-preface guidance. ASK TM_L5S2.pdf search result was found, but open was blocked by 403; do not claim its contents inspected. Build form-specific two-source briefs; maintain ordinary internal speech and purposeful external calls. No unit 7 source authored yet. Continue N2, N1 and keigo core before remaining decks. Never rerun ignored author/support-n2-u06 helpers over final source.


## N2 unit 7 verified checkpoint

45 new verified pairs, two lessons, four three-example notes, 26 scene lines, two readings (410/406 characters), twenty tasks. Final source/audio/browser/build/offline gates pass: 117 unit tests, 24 Python tests, five audio validators; all 7,959 earlier Clear keys / 727 scene mappings preserved, 110 new WAVs mapped and 125 historical takes retained. Precache 1,556 entries / 13,638.23 KiB; offline report 2026-10-06T22:16:03.833Z. Review output/review-n2.md. Native review pending. Logs output/n2-u07-*.log. Browser exact playback timeout now accommodates longer sequences without weakening mappings. No production deployment.

Exact next: N2 unit 8 natural conversation. Primary research inspected: NINJAL own conversation-corpus roundtable (aizuchi timing, fillers and contractions), KAKEN project 11780161 own investigator abstract (えっと/なんか/まあ functions, limited corpus), Japan Foundation tushin49_p06-07.pdf (particle omission is register-dependent and not arbitrary; inserting responses alone does not make dialogue natural), Bunpro なんか/なんて (filler versus low-evaluation particle), JF 200908 bookshelf (ellipsis depends on context). TUFS records/7248 failed 429; do not claim inspected. Existing dialogue playback inserts 380 ms serial gaps and cannot overlap lines. Extend and test supported timing before claiming overlap practice; preserve old recordings and default behavior. Continue N2, N1 and keigo core before decks. Do not rerun ignored author/support helpers over final sources.


## N2 unit 8 verified checkpoint

44 new verified pairs, two lessons, four notes, 32 scene lines, two readings (412/401 characters), twenty tasks. Source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,088 earlier Clear keys / 753 scene mappings preserved, 130 new WAVs mapped, 125 historical takes retained. Four brief overlaps now contain nonquiet signal and do not clip. New optional clock-scheduled dialogue timing leaves untimed scenes unchanged; interruption and missing-file checks pass. Precache 1,561 entries / 13,709.73 KiB; offline report 2026-10-06T22:42:30.691Z. Strict review output/review-n2.md. Native review pending. Logs output/n2-u08-*.log. No production deployment.

Exact next: N2 unit 9 contextual refusal, formal stem + かねる and qualified ないこともない. Primary sources inspected: Bunpro かねる/ないことはない, IMABI Potential IV, JF language/202107 and Bangkok Akiko3_bunpoo382002.pdf, investigator paper 07TRIKTIMA.pdf on refusal interaction (limited sample, not universal cultural rule). Irodori Bengali PDF and Tae Kim link failed open; not claimed inspected. Continue N2/N1/keigo core before decks. Do not rerun ignored u8 author/support/refine/checkpoint helpers over final source.
