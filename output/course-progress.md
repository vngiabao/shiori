# Course build progress

Updated 2026-10-05. User scope: complete N4 → N3 → N2 → N1 → workplace keigo, then deploy to the existing Cloudflare Shiori site. Chinese stays read-only. Deployment is authorized after completion; do not ask again.

## Completed before course expansion

- 100 Violetto teacher reactions, restrained persona, native synthesis delivery variation; all text/pose/audio associations checked.
- Single-mora vowel repair, 814 Clear manifest keys, 98 speaker-specific dialogue takes. Vocabulary remains Clear.
- Claude's N5 review corrections verified in sources and rebuilt packs.
- Initial gate: 76 unit tests, content and JLPT checks passed. Full 34-test browser run in progress.

## Current checkpoint

25 installed packs: first-post, twelve N5 units and all twelve N4 units. 668 word records, 45 lessons, 18 legacy letters and twelve genre readings. N4 contributes 240 word records, 36 notes, 24 scenes / 153 lines, twelve readings and 192 exercises. These are records, not 240 independent new lexical senses. No expansion pushed or deployed. N4 is NOT yet release-complete: decks and expanded assessments remain pending.

Engine completed at the earlier checkpoint: multiple dialogues/lessons; reading/table/pair/literature/manga schemas and UI; speaker/register/compare tasks; scoped grammar examples; course grouping; Watch unit tags; interruption-safe playback. Current layout, mascot, logo, auth and database identity retained. No Kiyo edits.

N5 gaps applied: starter scenes and factual questions; actionable unit 6 letter; letter cloze is grammar recall; seven role-play turns with accepted alternatives and mapped model/alternative audio. N5 source-backed decks remain pending.

N4 units 9–12 added: changed meeting room and affected events; presentation permission and feedback; personal practice routine; internship handover. All have twenty word records, three notes, two scenes and sixteen tasks including reading questions. Unit 12 email has twelve body sentences. Source/logic review is in output/review-n4.md. Grammar exposure and remaining direct-retrieval gaps are in output/n4-grammar-ledger.md.

Publisher re-check fixed two additional omissions: general humble お/ご action patterns in unit 8, and lesson 23 method noun ～方 (かた) in unit 11. Unit 10 explicitly covers all three causative-benefit viewpoints. Premature concessive ても removed before unit 11. Passive adverse-impact task added to unit 9. Source scenarios adapted to the existing internship story with the original grammar order; outline titles updated.

Audio: 1,591 Clear manifest keys / 1,603 lesson-reaction records, 263 dialogue takes, 100 teacher messages, twenty legacy expressive takes and twelve cast auditions. All five audio checker scripts pass: text mappings, hashes, PCM and synthesis phonemes. Vocabulary/drills remain Clear; speaker delivery stays the same Violetto voice. Native ±0.5-semitone pitch range retained. Human listening remains separate.

Checks after twelve units: TypeScript/build, 86 unit tests, seven dictionary tests, seven new vocabulary-audit tests, all audio checks, all 37 browser tests and production offline download/reload/playback pass. Register task test checks real task UI, intended audio route and scoring. Every dialogue/teacher/cast recording separately fetches and decodes. No missing mapping found. Main JS 1.53MB, precache about 9.85MiB; level/deck splitting remains required before full-course growth.

Dictionary: 432 subset forms; 426 matched course records, 81 explicitly unverified, 157 excluded sound drills, four unverified names. All 356 course kanji have dictionary/vector-stroke references. Structural checks do not certify native phrasing or current official JLPT membership.

Vocabulary-source audit: python scripts/audit_vocabulary_source.py reads all five pinned community CSVs and cached hash-pinned JMdict. N5: 674 matched rows, 41 patterns, three unmatched. N4: 600 matched, 31 patterns, 26 suru-form review cases, seven unmatched, one swapped/non-kana cell, two missing readings and one spelling/reading disagreement. Later-level source issues also reported. Parenthetical annotations do not become false pronunciation errors; alias candidates are not automatically called taught. Report output/vocabulary-source-audit.json is reproducible and ignored diagnostic data. Nothing was bulk-imported into decks. Raw CSV bytes are preserved with *.csv -text; source JSON/TSV and code use LF.

Local checkpoint before this batch: 17b0169. No intermediate push: Cloudflare may auto-deploy, and authorization is for completed scope. The passing twelve-unit checkpoint is saved with commit message "Complete N4 unit drafts and verify all dialogue audio"; use git log for its hash.

Sync: additive supabase/migrations/202610050002_saved_line_unit.sql still NOT applied live. Final deployment must verify it without auth changes or Kiyo data loss. Real two-device sync remains owner acceptance.

## Exact next steps

1. Curate N5/N4 source-backed vocabulary decks. Resolve source patterns, suru spelling/readings, missing/swapped cells, actual mismatches and aliases explicitly. Every new entry needs an original reviewed-context example and audio. The 8,131 source rows are not 10,000 unique official JLPT words. Do not create filler to reach a number.
2. Expand original N5/N4 banks to sixty checkpoint plus thirty distinct timed-sample items per level. Follow output/n4-grammar-ledger.md for missing retrieval functions. Existing bank has only sixty questions TOTAL across five levels; scripts/validate-jlpt.ts currently hard-codes those seed sizes and must be updated meaningfully. Re-review all answers, render any new spoken lines, run full gates, and close N4 Phase 5 only then.
3. Complete two-source advanced grammar cross-check before authoring N3. N3: sixteen two-lesson units; N2: sixteen two/three-lesson units; N1: twelve three-lesson units; keigo: twelve scenarios. Exact content/reading/audio/deck sizes are in prompts/gpt-course-continue.md. Review each level before starting the next.
4. Split course/deck data for performance; current warning is not suppressed. Final offline and responsive checks, additive unit-tag migration/security verification, push/deploy and live checks behind Cloudflare Access. Deployment already authorized after full completion; do not ask again.

## Remaining acceptance

Human listening review, native language review and a two-device Google sync round trip are not certified by automated checks. Do not claim those passed.
