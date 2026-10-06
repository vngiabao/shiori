# Course build progress

Updated 2026-10-05. User scope: complete N4 → N3 → N2 → N1 → workplace keigo, then deploy to the existing Cloudflare Shiori site. Chinese stays read-only. Deployment is authorized after completion; do not ask again.

## Completed before course expansion

- 100 Violetto teacher reactions, restrained persona, native synthesis delivery variation; all text/pose/audio associations checked.
- Single-mora vowel repair, 814 Clear manifest keys, 98 speaker-specific dialogue takes. Vocabulary remains Clear.
- Claude's N5 review corrections verified in sources and rebuilt packs.
- Initial gate: 76 unit tests, content and JLPT checks passed. Full 34-test browser run in progress.

## Current checkpoint

21 installed packs: first-post, twelve N5 units and N4 units 1–8. 588 word records, 41 lessons, 18 legacy letters, eight new genre readings. No expansion pushed or deployed. Not a completed N4 course. All remain AI-assisted drafts awaiting native review.

Engine completed: backward-compatible multi-dialogue/multi-lesson compiler; reading/table/pair/literature/manga schemas and UI; speaker/register/compare tasks; scoped grammar formation/examples/mistake cards; grouped course map and Watch unit tags. All twelve N5 sources rebuild byte-for-byte. Coverage uses earlier-lesson vocabulary and explicit surface glosses; recycled references must occur in attached prose, scenes, tables or panels. A paired text cannot be tested before its lesson. Interrupted or failed scene playback is not counted as heard.

N5 gaps applied: two starter scenes and six factual questions; unit 6 letter asks writing your name in the book; letter cloze is grammar recall; seven role-play turns have accepted alternatives and mapped model/alternative audio. Learner model translations corrected. Source-backed N5 decks still pending.

N4 units 1–8 each contain 20 words, three notes, two scenes (6–7 lines), twelve practice exercises and four reading questions. Topics: café interview; birthday gifts; summer travel with bus table; recommendation request and apology email; reported news and class changes; lost property and regret; respectful host visit; modest office introduction. Actual recycling and coverage pass. Reviewed fixes in output/review-n4.md. A small explicit reviewed inflection list now counts conjugated vocabulary in natural scenes without guessing from shared kanji prefixes.

Current audio: 1,340 Clear text keys / 1,352 lesson-reaction records, 213 dialogue takes, 100 teacher messages, 20 legacy expressive takes; mappings, hashes, PCM and synthesis phonemes pass. Twelve cast roles configured with same-text auditions, including all seven later-course characters; cast phonemes and native ±0.5-semitone offsets pass. Eight roles currently occur in scenes. Existing vocabulary stays Clear. No DSP or fabricated accent. Human listening pending.

Checks: 86 unit tests pass; content/JLPT/audio gates, TypeScript and production build pass after unit 8. Reading/table previews, support toggles, course grouping and scenes tested at 1440/320px, no page overflow or axe violations; screenshots inspected. Full 36-browser-test run passed at the unit-4/cast checkpoint; the four updated reading/dialogue/cast browser tests pass after unit 8. Production offline opt-in download, cached teacher/dialogue/cast assets and reload/playback check passed. Choice/register task flow still deserves a dedicated later-level browser case before the final review.

Dictionary coverage: 365 subset forms, 351 matched records, 76 explicitly unverified, 157 excluded sound drills, four unverified names. All 290 course kanji have dictionary and vector stroke references. Advanced grammar cross-check still pending; merely opening Bunpro/JLPT Sensei is not verification. Pinned community CSVs contain 8,131 rows before deduplication, not 10,000 unique official JLPT words.

Sync model/backups accept optional saved-line unit tags. Additive supabase/migrations/202610050002_saved_line_unit.sql is NOT applied live yet; apply and verify before deploy, preserving owner auth and Kiyo data. Static per-kind allowlist and local round trips pass; production migration/two-device tests are separate.

Production precache 9.9MiB, audio excluded from initial install. Runtime audio capacity now derives from the shipped catalog plus a buffer rather than a fixed 3,000-clip ceiling. Main JS exceeds the 900KB warning; split level/deck data before full-course growth exceeds service-worker limits; do not suppress the warning.

Research opened: official GENKI third-edition syllabus (Japan Times publisher PDF), Bunpro primary grammar lists, Tanos data sharing permission (CC BY, version unspecified). Official syllabus shows two omissions in the outline: Genki lesson 20 also includes ～ないで; lesson 22 also includes ～のように/～のような. Add these to the corresponding unit inventories. No textbook examples copied.

## Exact next steps

1. Finish full browser run and passing first-batch checkpoint. Commit reviewed files only, never secrets. Avoid intermediate pushes until Cloudflare automatic-build behaviour is accounted for; deployment is for the completed scope.
2. Author N4 unit 9 (passive/てある/間に/adjective + する/てほしい; contractions), then units 10–12 and review the batch. Unit 10 must include のように/のような. Run source compiler → dictionary/strokes → npm run packs → Clear incremental render → dialogue incremental render → refresh-audio-pin.py → gates/audio/tests/build. --check validates but does not write generated packs: compile before rendering. Review notes already cover units 1–8; update after further fixes.
3. Finish N5/N4 source-backed decks and 60 checkpoint + 30 sample items per level; strict whole N4 review before N3. No bulk filler. N5 vocabulary deck still pending, not silently marked complete.
4. Finish advanced source cross-check. N3 sixteen two-lesson units, N2 sixteen two–three-lesson units, N1 twelve three-lesson units, keigo twelve scenarios, exact counts in prompts/gpt-course-continue.md. Update progress after passing batches.
5. Final offline/performance checks, additive unit-tag migration, push/deploy and live checks behind Cloudflare Access. Preserve existing Google auth and database identity. Deployment authorized by user after completion.

## Remaining acceptance

Human listening review, native language review and a two-device Google sync round trip are not certified by automated checks. Do not claim those passed.
