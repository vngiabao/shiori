# Course build progress

Updated 2026-10-06. Authorized scope: N4 → N3 → N2 → N1 → twelve workplace-keigo scenarios, then deploy to shiori.gbaonvo.com. Chinese stays read-only. Preserve design, auth, database identity and recordings. No intermediate push because Cloudflare may auto-deploy. Final deploy and removal of Shiori's extra Access gate authorized after completion.

## Current checkpoint

54 installed packs: first-post, twelve N5 units, twelve N4 units, seven N5 decks (489 records), eleven N4 decks (528 records), and N3 units 1–11. Total 2,037 records including 157 drills; 1,880 dictionary/name/chunk records, 1,850 distinct written targets, 203 lessons, 980 kanji reference pages. Suggested first-pass metadata 2,637 minutes is not measured time. Eighteen legacy letters, twenty-three genre readings (4,356 Japanese characters), 65 scenes / 483 lines, 112 grammar notes. Zero human-reviewed packs.

N3 first eleven units: twenty-two lessons / 352 new word records / 46 notes / twenty-two ten-line scenes / eleven readings / 191 tasks. Unit 11 has a 242-character email and 18 tasks. Remaining five N3 units and all N2/N1/keigo units NOT authored. Full advanced decks and banks NOT done.

N4 core: 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings, 192 tasks. Review output/review-n4.md; retrieval output/n4-grammar-ledger.md. N5/N4 each have sixty checkpoints and thirty samples; advanced levels retain twelve seeds each. Rotation preserves old IDs/answers/runs/backups. Completion is not mastery or exam readiness.

Eighteen source-backed decks add 1,017 form records with original examples and Clear audio. Beginner ledger: 1,386 raw rows = 1,221 exact, 43 related, 35 corrected, five noun/suru, 71 attached-pattern and eleven excluded. None establishes mastery. Attached patterns are not headword instruction. Raw CSV unchanged. Related dictionary IDs are candidates, not proof of same sense.

Engine: multi-scene/multi-lesson units, bound grammar; reading/table/pair/literature/manga; speaker/register/compare tasks; recycling; level grouping; Watch tags; interrupted playback. N5 gaps/review completed. Database shiori-japanese-v1 unchanged. Static level chunks still load together: independent cache reuse, not on-demand loading. Future level downloads/precache budget still need work.

Audio: 5,471 Clear keys / 5,483 synthesis records; 483 dialogue takes, 100 teacher messages, twenty expressive takes and twelve cast samples. Every earlier record/scene from 4f3f495 unchanged (5,366 keys / 5,378 records, 463 dialogues, 967 dictionary references/strokes). Ninety-three new WAV files mapped. Kana phonemes and native ±0.5-semitone settings retained. Signal/synthesis checks are not native listening certification. Unit 11 type/unit/source/content/audio/preservation/browser cases 6/9/10/11/build/offline gates pass. Precache 1,334 entries / 12,224.98 KiB, below 15 MB. Yamamoto role labels corrected in 6/9/10 without changing recordings; unit 11 uses Mori.

Latest full milestone gates (unit 9): TypeScript; 112 tests / 17 files; 24 Python source tests; content/JMdict/kanji/JLPT; five audio validators; preservation; beginner ledger/aliases; all 48 browser tests; build; production offline reload/playback. All pass. Nine N3 browser cases decode all 180 N3 scene recordings and check lesson-specific grammar/playback/reading support. Unit 9 screenshots 375/1440 in saved light/dark themes generated; light 1440 and dark 375 inspected. Logs output/n3-u09-*.log. Precache 12,089.45 KiB / 1,313 entries, below 15 MB ceiling. Welcome checks at 320/375/768/1440 in both themes pass.

Each completed N3 unit has a form-specific two-source brief in content/sources/grammar/. Level disagreements and instructional bridges remain explicit. Grammar inventories output/grammar-inventories.json are pointers, not semantic verification. output/review-n3.md reviews units 1–11 only. Human/native review pending.

## Exact next steps

1. Finish source brief and author n3-u12: common contractions ちゃう/じゃう, とく/どく, てる/でる, なきゃ/なくちゃ, memory っけ, wondering かな, affirmative じゃん and explanatory questions の. Two lessons / 32 new pairs / five notes / two ten-line scenes / 200–400-character message / 14–18 tasks including speaker recognition. Unit 12 research begun, source brief NOT yet saved. Sources read: Bunpro てしまう・ちゃう, なくちゃ・なきゃ, ておく, っけ, かな; matching Sensei pages; Japonin natural-japanese-contractions by Chiho Kamioka; NikoNikoJapanese 2025/09/17/minna-japanese-intermediate-colloquial; MaggieSensei 2020/06/11/casual-japanese-how-to-use-じゃん-jan; Tae Kim casual.html and explanatory-question pages. Need complete secondary source for じゃん/no? and precise っけ examples before authoring. Units 1–11 complete locally; next full milestone after unit 12. Finish all N3 units/decks/banks before N2/N1 and keigo.
2. Form-specific source checks before each advanced unit. Preserve historical WAV/query records/strokes and refresh manifest pins only after preservation. Full source row/deck semantic audit unfinished.
3. Local welcome committed: Violetto greeting, Shiori branding, Google and guest in Kiyo's paired structure. No auth/profile/consent reset. Cloudflare Access still intercepts hosted app. User confirmed removing Shiori's extra Access gate ONLY at final complete deployment. Google sync remains owner-only; Kiyo stays untouched. Local lacks production variables; production Cloudflare has them.
4. Final course gates/screenshots, additive saved-line-unit migration, push/deploy/live checks. supabase/migrations/202610050002_saved_line_unit.sql NOT applied live. Full-course deploy authorized; don't deploy incomplete expansion early.

## Commits and acceptance

4f3f495 preceding local commit (N3 unit 10). Unit 11 is being committed with this file; git log -1 gives its actual hash afterward. Use actual Git HEAD as the next preservation baseline. No expansion pushed/deployed. Live older d90cce1 behind Access. Owner Google login, two-device sync and native language/listening reviews not certified.
