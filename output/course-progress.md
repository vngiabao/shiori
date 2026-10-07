# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. A separate backup branch may be pushed only after verifying that it cannot trigger a production deployment; otherwise keep local commits and record the uncertainty. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

77 installed packs: starter, twelve N5 units, twelve N4 units, sixteen N3 units, fourteen N2 units, eighteen beginner decks and four N3 decks. Total 3,212 records including 157 drills; 3,055 dictionary/name/chunk records, 3,025 distinct written targets, 293 lessons and 1,260 kanji reference pages. Suggested first-pass metadata 4,473 minutes is not measured time. Eighteen legacy letters, fifty-six genre readings (17,924 Japanese characters), 103 scenes / 933 lines, 195 grammar notes. Zero human-reviewed packs.

N3 sixteen-unit core: thirty-two lessons / 512 new word records / 71 notes / thirty-two ten-line scenes / sixteen readings / 281 tasks. Unit 16 has 249 prose characters plus a timetable (306 together) and 18 tasks. N3 bank: sixty checkpoints + thirty samples. Four N3 decks add 400 source-checked words and 400 original examples across 52 lessons. Remaining N3 decks/final review and remaining N2/N1/keigo units/decks/banks NOT complete.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4/N3 each have sixty checkpoints and thirty samples; N2/N1 retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Twenty-two source-backed decks add 1,417 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 8,983 Clear keys / 8,995 synthesis records; 933 current dialogue takes, 125 historical takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Unit 14 adds 114 fully referenced WAVs. Earlier recordings, single-mora queries and pitch limits preserved. Signal checks do not certify perceived pronunciation.

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

1. N3 naturalness correction complete: all 32 scenes reread, u12/u13 rewritten and 85 other lines corrected. Linked tasks/readings, incremental audio, old-asset preservation and review recorded; native review pending. N2 core units 1–14 now pass; continue directly with N2 core unit 15 youth/internet Japanese, with dated contextual recognition and natural peer chat.
2. Finish and review N2 core units, then N1 core units, then twelve workplace-keigo scenarios BEFORE remaining N3/N2/N1 decks. Preserve the four completed N3 decks. Source-check grammar formations and review each level before starting the next.
3. Complete remaining source-backed vocabulary/kanji decks and written JLPT banks after the core. Raw pinned datasets remain unchanged. Full dictionary checks, examples, audio mappings and source dispositions are required; no filler or unsourced official-level claims.
4. Cloudflare inspected 2026-10-06: production branch main; preview-branch builds OFF; production command npx wrangler deploy. Safe backup destination course-build under these verified settings. Never push main until full completion. Re-check if settings change; no intermediate production deployment.
5. Final full-course gates, screenshots, additive saved-line-unit migration, push/deploy and live checks. Remove only Shiori's extra Access gate at the final complete deployment. Violetto welcome, guest access and owner-only Google sync remain; Kiyo stays untouched. supabase/migrations/202610050002_saved_line_unit.sql is not yet applied live.

## Commits and acceptance

e1ca818 N3 naturalness correction backed up successfully to private remote course-build, verified remote HEAD e1ca81833fa49560537899391496a75e9009bcb9. N2 unit 1 commit 43b7391 backed up to course-build and remote HEAD verified 43b7391f990937242b397e1c46f789c7a63ce2e9. N2 unit 2 commit 72011ad1992faae5151eea622cd7658113a3e0c9 backed up and remote course-build verified. Unit 3 commit 925148aa5611b580d1fb1bc3b42b1fcc66ebffe8 backed up and remote course-build verified. Unit 4 commit bfd60410fdcb45fb71d72447acb45b5e6516ab24 backed up and remote course-build verified. Unit 5 commit a15d31e9e86b3fbe6ef0576164ed994ff1887353 backed up and exact remote course-build verified. Unit 6 commit 86dca72dcf879eb58172c2d5b92ec0758a0af57f backed up and exact remote course-build verified. Unit 7 commit aa0faefc3c475308606b3a6fec8ea4322a22c8ce backed up and exact course-build verified. Unit 8 commit 73146b60fb72144c68698f1dd81fdc2f977e11d5 backed up and exact remote course-build verified. Unit 9 commit dbe0a1798f97acaf131da9f8103da8678949abbf backed up and exact remote course-build verified. Unit 10 commit 4139ae8f93df2a86461c3172ce029269304d7ffd backed up and exact remote course-build verified. Unit 11 commit e1cbbbdeac035d2ec671a5edd60c53e7a3274da5 backed up and exact remote course-build verified. Unit 12 commit ad959c628031831b017336c2f61c8418d210d80f backed up and exact remote course-build verified. Unit 13 commits 89de3a8454f95132ea5e00177140112a318e5885 and inventory follow-up 47ed570915fafc2065a4d41ad05be51638866f1e backed up; exact remote course-build verified. Unit 14 is being committed; use git log -1 for the next preservation baseline. Push only course-build under verified preview-builds-OFF settings. Production remains older d90cce1 behind Access. Full expansion, final deploy/Access removal and owner login/two-device/native review are not complete.


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


## N2 unit 9 verified checkpoint

41 verified pairs, two lessons, four notes, 24 scene lines, two readings (416/413 characters), twenty tasks. Source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,226 earlier Clear keys / 785 scene mappings preserved, 105 new WAVs mapped, 125 historical takes retained. Unit 8 cloze-context regression also passes. Precache 1,570 entries / 13,782.85 KiB; offline report 2026-10-06T23:03:37.856Z. Strict review output/review-n2.md; native review pending. No production deployment.

Exact next: N2 unit 10 original narratives, past-event sequence, thought attribution, のだった and viewpoint in ていく/てくる. Primary IMABI Mood Marker のだ section on narrative のだった inspected; Bunpro ていく/てくる and Coto teacher explanation inspected. Meiji researcher bibliography found but full paper not yet inspected. These are earlier forms in advanced reading, not official N2 assignments. Continue N2/N1/keigo core before decks. Never rerun ignored u9 author/support/refine/checkpoint helpers over corrected sources.


## N2 unit 10 verified checkpoint

44 verified pairs, two lessons, four notes, 24 scene lines, two stories (457/467 characters), twenty tasks. All final source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,348 earlier Clear keys / 809 scene mappings preserved, 107 new WAVs mapped, 125 historical takes retained. Precache 1,586 entries / 13,866.38 KiB; offline report 2026-10-06T23:22:30.243Z. Strict review output/review-n2.md; native review pending. No production deployment.

Exact next: N2 unit 11 character impressions and current conditions, with contrasts among げ, っぽい, がち, 気味 and earlier やすい. Bunpro’s own pages and Maggie Sensei’s own げ / がち・気味 / っぽい / やすい lessons found; full formation sections for げ and がち・気味 inspected, remaining っぽい/やすい pages require detailed inspection before claiming their scope. IMABI candidate URL failed, and Tae Kim repeated browser opens timed out after initial metadata; do not claim detailed inspection of them. Candidate spelling/reading check output/select-n2-u11.py is read-only. Avoid duplicating 無愛想/不愛想 aliases. Continue N2/N1/keigo core before decks. Never rerun ignored u10 author/support/source/checkpoint helpers over corrected source.


## N2 unit 11 verified checkpoint

48 verified pairs, two lessons, five notes, 24 scene lines, two diaries (428/436 characters), twenty tasks. Final source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,474 earlier Clear keys / 833 scene mappings preserved, 116 new WAVs mapped, 125 historical takes retained. Precache 1,597 entries / 13,943.87 KiB; offline report 2026-10-06T23:39:52.087Z. Strict review output/review-n2.md; native review pending. No production deployment.

Exact next: N2 unit 12 report/documentary reading, をもとに, を通じて/を通して, をめぐって/をめぐる and をはじめ/をはじめとする. Primary formation research inspected: Bunpro own four pages (valid slugs を通じて-を通して and を巡って), Nihongo-bu n2-omotoni, N1et wotoosite, Tanosuke wohajimetoshite and Jepang own o-megutte lesson. Through/throughout overlap is explicit: N1et permits 一年を通して; do not force a binary answer from Bunpro’s stronger caution. Formal debate wording belongs in a report or quoted narration, not a casual friend’s everyday sentence. をはじめ is representative inclusion, not a guaranteed chronology. New/source-label assignments vary across publishers. Candidate selector output/select-n2-u12.py is read-only; 取材先/上映会 are not matched headwords in the cached subset. No unit 12 source authored yet. Continue N2/N1/keigo core before decks. Do not rerun ignored u11 author/finish/checkpoint helpers over final sources.


## N2 unit 12 verified checkpoint

44 verified pairs, two lessons, four notes, 24 scene lines, two original articles (404/419 characters), twenty tasks. All final source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,609 earlier Clear keys / 857 scene mappings preserved, 105 new WAVs mapped, 125 historical takes retained. Precache 1,602 entries / 14,012.29 KiB; offline report 2026-10-06T23:58:56.109Z. Strict review output/review-n2.md; native review pending. No production deployment.

Exact next: N2 unit 13 comparing two opinions on a shared topic, with paired reading and actual compare tasks. Preliminary primary research inspected: JLPT official testsections.html and n2.pdf (multiple texts about 600 characters total; this course’s two 400–800-character readings are extended supported practice, not claimed as an exact exam reproduction). Bunpro and IMABI own 一方で / 反面 and むしろ sections; Bunpro 点 and Meshclass という点で. Restrict grammatical comparisons to contextual meaning or explicit attachment; 一方で and 反面 can overlap. Bunpro’s stronger positive/negative caution differs from IMABI’s examples, so do not impose it universally. という点で identifies the comparison aspect, not unlimited agreement. No unit 13 source authored yet. Continue N2/N1/keigo core before remaining decks. Do not rerun ignored u12 author/finish/checkpoint helpers over its corrected source.


## N2 unit 13 verified checkpoint

44 verified pairs, two lessons, four notes, 24 scene lines, two essays (413/413 characters), twenty tasks including four paired comparisons. Final source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,733 earlier Clear keys / 881 scene mappings preserved, 107 new WAVs mapped, 125 historical takes retained. Both essays replay no narrated paragraphs; the scene recordings decode and play exactly. Four comparison answers record supported work when furigana is shown. Precache 1,611 entries / 14,088.11 KiB; offline report 2026-10-07T00:15:44.912Z. Strict review output/review-n2.md; native review pending. Logs output/n2-u13-*.log. No production deployment.

Exact next: N2 unit 14 Kansai forms, repeatedly used in plausible Tamura conversations and original messages, with recognition rather than a universal dialect-conjugation score. Primary research inspected: Japan Foundation 201107 teaching hint (regional variation, copula/negation/lexical examples), Kansai University's tsina/haru.htm (はる register and attachment), kansaiben.com grammar index and JALT2007 J077.pdf relevant sections (authors' self-study method and non-uniform negative/region/age forms). The dedicated kansaiben.com honorific page initially failed open; index is inspected but full form-specific grammar pages still need inspection before authoring. Do not claim the standard synthesis engine certifies Kansai accent. No unit 14 authored yet. Continue N2/N1/keigo core before remaining decks. Never rerun ignored u13 author/finish helpers over the final source.


## N2 unit 14 verified checkpoint

44 verified pairs, two lessons, four notes, 28 scene lines, two original readings (416/417 characters), twenty tasks. Final source/audio/browser/build/offline gates pass: 121 unit tests, 24 Python tests, five audio validators; all 8,859 earlier Clear keys / 905 scene mappings preserved, 114 new WAVs mapped, 125 historical takes retained. Selected negative/respectful mora sequences verified; regional accent and native naturalness remain unreviewed. Both original readings pass guided coverage and viewport/theme checks, with detail screenshots inspected. Precache 1,620 entries / 14,161.47 KiB; offline report 2026-10-07T00:39:03.263Z. Strict review output/review-n2.md. Logs output/n2-u14-*.log. No production deployment.

Exact next: N2 unit 15 youth/internet Japanese, repeated target forms in ordinary Kenta/Misaki peer chat and original posts. Date usage notes and distinguish interpretation in these contexts from a universal popularity claim. Preliminary sources found: Bunpro's own すぎる formation page; Maggie Sensei's タメ口/ヤバい lesson through its tag index (full lesson still needs inspection); primary interview with Sanseido compiler in Shueisha 20241201-125292 (age/context variation, not the full meaning inventory); Sanseido 2026 archive search result, but full open failed 502. Search-only YabaiDict/RAW Japan/KanaDojo are not yet inspected evidence. Need form-specific two-source briefs before authoring. No unit 15 authored yet. Continue N2, N1 and keigo core before remaining decks. Never rerun ignored u14 author helper over final source. On-demand level loading remains necessary before much larger full-course delivery; existing level chunks still load together.
