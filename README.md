# Shiori · Japanese with Violetto

A personal, reading-led Japanese learning app. **Shiori (栞, bookmark) is the working brand**, with Koto and Shio as alternate names. Violetto is the confirmed companion name. The predominantly blue letter world with soft white paper, muted violet and ribbon-red details carries a 16-pose transparent character atlas and scalable SVG interface marks.


Current expansion: all twelve N5, twelve N4, sixteen N3, sixteen N2 and twelve N1 core units, plus twelve workplace-keigo scenarios and seventy-three vocabulary decks. There are **154 packs, 963 lessons, 8,777 word/phrase/name records (157 additional sound drills), 96 genre readings, 167 scenes and 2,013 kanji reference pages**. All five levels have ninety original written JLPT practice items. These records include inflected forms and chunks: they are not 8,777 independently mastered dictionary words. All content remains an AI-assisted draft awaiting native review. All local release checks pass: 183 unit tests, 31 Python source tests, 175 production browser tests plus eleven separately verified development fixtures, source/audio/preservation gates, build and real offline verification. Production rollout is the remaining step. See [release report](output/release-report.md) and output/course-progress.md.

Welcome now presents Violetto's playable greeting beside the Shiori logo, Google sign-in and guest entry directly. Owner-only sync and device-history consent are preserved. The hosted Cloudflare Access gate remains until the authorized final full-course deployment; local welcome changes do not bypass it.

## Run

Requires a current Node version supported by Vite 8 (Node 22.12+ or 24+).

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:5174. Start without an account. The development server is local to this computer. Chinese remains a separate project.

```powershell
npm run build
npm run preview
```

The production preview is http://127.0.0.1:5175. Its service worker installs the app shell, fonts, character and stroke data. Course levels and audio cache as used; Settings can save all shipped course text and audio for offline study. Development mode does not install the production offline worker.

**Keep the same browser and URL for your progress.** Browser storage belongs to an origin: localhost, 127.0.0.1, different ports and different browsers have separate data. Export a backup in Settings before moving, clearing browser storage or changing URLs. Import merges attempts and rebuilds review memories; it also preserves study logs, letter drafts and JLPT plans, source-study records and question attempts. Optional cloud sync (Google sign-in, Supabase) is set up for the hosted site; see supabase/README.md. Keep backups regardless. Microphone recordings and imported media files stay in memory and are not included in backups.

## What is here

The current visual system follows the latest blue-led preference: Prussian blue header and companion space, cool blue canvas, soft white paper, blue actions, muted violet correspondence accents, small ribbon-red details and tiny gold ornaments. Emerald remains for correct answers, known items and Violetto's brooch. Night post uses deep blue surfaces. The compact phone desk keeps the lesson action and Violetto visible together. DESIGN.md and .impeccable/design.json record the tokens and responsive rules; src/violet-theme.css implements the visual layer. The original kickoff palette and earlier purple prohibition are superseded by this preference.

- Three entry paths, adjustable daily plan, light Morning letter and dark Night post.
- Kana and sound lessons, phrase lessons, furigana, fading romaji, KanjiVG stroke replay and dictionary glosses.
- Letters with comprehension checks and reply drafts; separate reading, listening, recall, typing and politeness evidence with FSRS reviews.
- Bundled synthetic Japanese audio, local self-recording, scripted typed conversations and a five-step media practice ladder.
- Course library, real-world study journal, local progress and backup/restore.
- A source-led N5–N1 JLPT study room with sequential milestones, original draft checkpoints and short timed samples.

This is a substantial draft study course, **not a proficiency guarantee or a calibrated full JLPT preparation programme**. Current counts are above and in `output/content-inventory.json`; community source coverage and original practice have separate ledgers. Native review and broad real-world listening remain necessary. Neither self-recordings nor finishing lessons certifies fluency. Read [the detailed audit](AUDIT.md) and [teaching principles](PEDAGOGY.md).

## JLPT study room

Open `/#jlpt/N5` or choose JLPT in navigation. Each level, N5 through N1, has six sequential milestones: entry self-check, vocabulary and kanji, grammar, reading, external listening practice, then a timed sample. Choose your level directly; the entry checklist is self-report, not a placement test. A glasses-wearing teacher Violetto guides this room within the existing blue correspondence design.

The resource desk links Nihongo Sō-matome for N5–N1, Shin Kanzen Master for N4–N1, and official JLPT samples and practice workbooks. Study your own edition or the linked materials and record the unit/pages, minutes and reflection. Publisher lessons, questions and audio are not copied into the app, and assignments are Shiori's organisation rather than a textbook chapter mapping.

The app contains **450 original AI-assisted draft written questions**, ninety per level (sixty checkpoint and thirty sample items). Runs use two-question checkpoints or six-question timed samples (8, 9, 10, 12 and 14 minutes for N5 through N1). These short samples cover vocabulary, grammar and reading; listening uses external sources. Raw results do not predict an official JLPT score. No full-length calibrated mock exam or human language review is claimed.

Source study plus checkpoint completion unlocks the next milestone. Selection prefers unseen, then least-seen items in saved history; repetitions are disclosed. Sample selection stays balanced across three written sections. Completing a cycle does not require answering the entire bank; use unfamiliar external material to assess transfer. Answers and the sample's absolute deadline persist, so refreshing does not restart the timer. Settings backups include JLPT records, and older backups with the original item IDs remain accepted. The stable `shiori-japanese-v1` database adds JLPT tables in Dexie schema version 3; this is separate from the unchanged backup format version 1.

## Brand assets

Open `/brand/` on the running app to preview and download Shiori's folded bookmark-S and outlined serif wordmark. `public/brand/` contains primary, inverse and monochrome SVG marks, wordmarks and lockups; `public/icon.svg` is the app icon. The outlined artwork displays without a font dependency. See [asset usage and regeneration](public/brand/README.txt) and [font license](public/brand/FONT-LICENSE.txt).

## Violetto, voice and postmarks

Open `/#voice` to compare four retained local CosyVoice directions on the same Japanese lines (48 clips), plus the current VOICEVOX baseline. **Try in reactions** saves a preference and uses that audition for Violetto's recorded feedback only. Course words and sentences use the current VOICEVOX lesson renderer regardless of audition preference. The voice names describe acting targets; resemblance and pronunciation need listening review.

Words speak when you open their details or tap a letter gloss. Correct, supported and incorrect answers get distinct spoken reactions. Settings has separate controls for automatic reactions and word audio. Space replays the last audio; starting another clip stops the previous one.

`/#postmarks` contains correspondence levels, eight permanent postmarks and three daily assignments. They derive from saved learning events, survive backup/restore, and never certify language proficiency. Missing a day removes no postmarks. See PERSONA.md and prompts/violetto-voice.md for the voice, character and design contract.

To reproduce the retained auditions: run `scripts/prepare-violetto.py` with `.audio-py312/Scripts/python.exe`, then `scripts/generate-violetto.py` with the existing `../Chinese/.tts-env/Scripts/python.exe`. These older tools require the Kokoro/Misaki reference environment and the sibling CosyVoice installation/model; they write only to Japanese. `scripts/check-violetto-audio.py` checks decoding, peak, duration and hashes. The preparation script writes `src/generated/violetto-legacy-baseline.json`, preserving the current VOICEVOX baseline manifest.

## Grow the course

Use [the content authoring prompt](prompts/content-prompt.md), `src/types.ts` and the existing pack as the schema contract. Start by generating a prerequisite map and one small unit, then obtain independent language review.

```powershell
npm run author:context
npm run validate:content
npm run validate:jlpt
npm run packs
npm run audit:content
```

Save new packs in `content/packs/`. The build rejects invalid references, alignment, answer keys, source mismatches and unsupported JLPT claims. `output/author-context.json` contains course context, not learner data. `output/content-inventory.json` is the reproducible content count. `scripts/seed-content.ts` is an initial authoring utility: do not rerun it after manually improving the starter pack unless you also update that script.

Grammar explanations in the starter course are currently notes; open-ended writing and advanced professional modules need supported activity schemas and renderers before packs can teach them. The separate JLPT question runner supports short timed multiple-choice samples; a reviewed, full-length assessment bank remains future work. Author its data in `content/jlpt/`, with source and review status in `provenance.json`. `validate:jlpt` checks bank sizes, unique IDs, options and answer/explanation metadata, and runs during the build. It does not establish language quality or exam calibration. The app has no live AI conversation service.

## Audio and sources

The approved voice now has **20 additional expressive reaction clips**: two deliveries each for ten feedback lines, across welcome, reassurance, pride, precise teaching and reflection. New events alternate; replay repeats the same take. Open `/#voice` and use the expressive delivery buttons to compare. The active default is the same VOICEVOX speaker as lessons; selecting an older audition still affects reactions only. The 285 lesson audio mappings are unchanged by this update.

After preparing the existing runtime, regenerate just emotion variants with `.audio-py312/Scripts/python.exe scripts/generate-emotions.py`, then validate with `.audio-py312/Scripts/python.exe scripts/check-emotions.py`. Settings live in `content/voices/emotions.json`, detailed generation records in `content/voices/emotion-provenance.json`. Re-run this separate renderer after changing reaction wording. The generator never rebuilds pronunciation drills.

Current lesson audio uses **VOICEVOX Core 0.17.0, VVM 0.16.4 (`1.vvm`), style 14 — VOICEVOX:冥鳴ひまり**. The manifest has 285 text keys, plus 12 baseline reaction renders: 297 provenance records, with identical renders allowed to share a file. Output is uncompressed mono 24 kHz PCM WAV with content-hashed `vv2-` filenames. All 142 single-kana entries use explicit one-mora queries, voiced vowels with a 0.22-second vowel-length setting, and no interrogative upspeak. Standalone は teaches *ha*; the topic-particle word uses わ for playback.

These are synthetic practice clips, not certified pronunciation, pitch accent or a measured match to Yui Ishikawa. `content/voices/lesson-provenance.json` records queries, settings, model and file hashes. `scripts/check-lesson-audio.py` checks every record's hash and signal and all 142 single-kana queries; results are in `output/lesson-audio-check.json`. Local Whisper small screened 56 longer clips (`output/pronunciation/lesson-review.asr.json`, `output/lesson-asr.log`). Some transcriptions remain ambiguous; machine screening does not replace native listening review. No API key is needed to use the app. Browser Japanese speech synthesis remains a fallback for text without a bundled clip and reports when no Japanese voice is installed.

To rebuild, use Python 3.12 in `.audio-py312`, the official Windows VOICEVOX Core wheel, and the official downloader. The downloader prompts for its terms interactively. With `.models/voicevox-download.exe` available, run:

```powershell
.audio-py312/Scripts/python.exe -m pip install https://github.com/VOICEVOX/voicevox_core/releases/download/0.17.0/voicevox_core-0.17.0-cp310-abi3-win_amd64.whl numpy soundfile
.models/voicevox-download.exe --exclude c-api --models-pattern 1.vvm --output .models/voicevox
npm run packs
.audio-py312/Scripts/python.exe scripts/generate-audio.py
.audio-py312/Scripts/python.exe scripts/check-lesson-audio.py
```

`generate-audio.py` delegates to `render-japanese-voice.py`. Keep the runtime and model versions recorded in provenance when reproducing a build; downloader defaults may change. Models and Python environments are build tools, not shipped app assets. Preserve the visible voice credit and consult the linked model and speaker terms in [third-party notices](THIRD_PARTY_NOTICES.md).

`scripts/fetch-sources.py` refreshes KanjiVG strokes and small JMdict/KANJIDIC2 reference subsets. See [third-party notices](THIRD_PARTY_NOTICES.md). Source validation is not native editorial review.

### Refresh dictionary checks after editing course packs

Run `npm run sources:jmdict` to download the current official JMdict_e and rebuild
the course-sized reading subset. It examines every word in every installed pack,
respects spelling-specific reading restrictions, and records the download date,
SHA-256, dictionary entry IDs and pack hashes. Python's standard library is enough.
`npm run sources:jmdict -- --cached` explicitly reuses the hash-pinned local download.
Download or parse failures exit unsuccessfully rather than claiming a refresh.

Run `npm run validate:content` afterward. Stale dictionary coverage or a mapped
reading mismatch fails the gate. Unmatched headwords remain explicitly unverified
in `output/jmdict-mismatches.md` and `content/sources/jmdict-coverage.json`; they
are not filled with guessed readings. Dictionary checks cannot certify names,
conjugated phrases, sentence naturalness, meaning or contextual pronunciation.
The importer never edits the course; send mismatch findings to its author.
`npm run test:sources` checks extraction restrictions and unknown-word handling.

## Verify

```powershell
npm test
npm run test:e2e
npm run build
```

Browser tests use installed Chrome and the development server at port 5174. They cover onboarding, a complete lesson, evidence separation, letters, conversations, settings, backups, WCAG automated checks and layout at desktop, tablet and phone widths. Automated accessibility checks do not replace assistive-technology or human language review.

Future priorities are in AUDIT.md: reviewed elementary content, unseen transfer tasks, diverse natural listening, real conversation and writing feedback, and durable sync. Keep learner data stable when changing the working brand.


## Reading practice and text desk

Read now includes three beginner practice stages (kana matching without romaji,
whole-word meaning, and sentence comprehension), using existing course vocabulary
plus 24 original sentence questions: eight practice and sixteen checkpoint items.
Questions prefer unseen IDs. Hints and furigana are recorded as support. Two
checkpoints at 7/8 independent answers at least a day apart suggest progression;
they do not certify mastery, a JLPT level, or karaoke pace. Optional response times
include choice-reading and pauses, not just Japanese decoding.

Text desk accepts pasted text and user-supplied `{漢字|かな}` readings, exact-text
cloze, a translation draft and a separate reference note. It does not transcribe,
synchronize music, infer readings or automatically translate/grade translations.
Explicitly save text before leaving. Dexie v5 adds readingRuns and textDrafts;
both travel in backups, and older backups remain importable. Newer saved text
wins on import. These exercises do not overwrite the existing spaced-review data.

Sentence content: `content/reading/sentences.json`, AI-assisted original draft,
not native-reviewed or copied from a textbook/song. Structural content checks are
in `tests/reading-path.test.ts`; run `npm test` as well as the regular content gate.

## Optional cloud sync

The hosted app uses the shared Supabase project with Google-only owner sign-in.
Setup and isolation checks are documented in `supabase/README.md`. The additive
saved-line unit-tag migration was applied on 7 October 2026; its constraint and
enabled/forced row-level security were verified. With no env
configuration, no cloud client is started. Personal text is excluded unless
separately enabled. Dexie v6 preserves the existing v5 reading/text stores.

## Expanded reference checks

JMdict audit counts now exclude 157 kana drill records and list four names
separately. Optional lemma metadata never certifies a complete inflected phrase.
`lemmaStatus` checks the base spelling/reading; `lemmaReadingRelationship` only
records a mechanically matching kanji-bearing stem where it can be established.
The course's 2,013 kanji reference pages have KANJIDIC2-backed references and KanjiVG
stroke data. New reference entries are in `content/kanji/n5.json`; the existing
Read → Kanji surface loads them without a design change. Refresh with
`python scripts/fetch-sources.py --kanji-only --cached`. Source hashes/revisions live in
content/sources provenance files and each stroke file. New components are left
empty rather than inventing etymology. Historical JLPT fields are not used.


## Historical build notes

The dated checkpoints below describe earlier stages, not the current inventory. The current summary and output/course-progress.md take precedence.

### N3 editorial correction, 6 October 2026

All thirty-two N3 scenes were reread after the user found stiff vocabulary padding. Units 12–13 now use ordinary peer contractions and a playful character guessing game; 125 Japanese lines across the core were revised, with linked tasks and natural English translations. Passing checks had not established naturalness. Per-unit recycling exceptions have explicit editorial reasons and still require actual referenced forms. Details and verification are in output/review-n3.md; exact remaining work is in output/course-progress.md. All earlier Clear audio, unchanged dialogue takes and replaced-take history are preserved; all 254 new WAVs mapped. Native review pending. Finish N2/N1/workplace-keigo core before remaining decks; production waits for the full expansion.

N2 core has started: units 1–16 add thirty-two lessons, thirty-two original genre readings and 406 scene lines, with preserved design and earlier recordings. It is an AI-assisted draft; the complete N2/N1/keigo expansion and final deployment remain unfinished.


N1 unit 1 adds 54 original source-checked pairs, three lessons, four notes, 39 scene lines, two original readings (1062/1120 characters) and twenty tasks. Sources and review: content/sources/grammar/n1-u01.json / output/review-n1.md. Formation references are consulted, never copied as lesson prose. Current inventory: 80 packs, 3,354 records, 300 lessons, 208 notes, 110 scenes / 1,028 lines, 62 readings / 21,795 characters and 1,292 kanji pages. All prior audio and reference bytes preserved; all 151 new WAVs mapped, including two indexed superseded takes. Native review and the rest of N1/keigo/decks/final deploy remain unfinished. Precache 14,424.09 KiB; production offline verification 2026-10-07T02:05:25.761Z.


N1 unit 2 adds 54 source-checked pairs, three lessons, four notes, 39 scene lines, two original readings (1096/1067 characters) and twenty tasks. Formation brief: content/sources/grammar/n1-u02.json; editorial/audio review: output/review-n1.md. All prior audio preserved; 151 new WAVs mapped (147 active / four indexed archived). Current: 81 packs / 3,408 records / 303 lessons / 212 notes / 113 scenes (1,067 lines) / 64 readings (23,958 characters) / 1,316 runtime kanji pages. Precache 14,553.94 KiB; real offline verification 2026-10-07T02:28:41.187Z. Native review, remaining N1/keigo/decks and final deployment are unfinished. No publisher example, exam item or real voice recording was imported.

N1 unit 3 adds 54 restricted-JMdict-verified pairs, three lessons, five notes, 39 scene lines, two original readings (1077/1050 characters) and twenty tasks. Source brief: content/sources/grammar/n1-u03.json; review: output/review-n1.md. All earlier recordings/reference bytes preserved; all 147 new WAVs mapped. Current: 82 packs / 3,462 records / 306 lessons / 217 notes / 116 scenes (1,106 lines) / 66 readings (26,085 characters) / 1,326 runtime kanji pages; 9,721 Clear keys / 9,733 synthesis records / 1,106 scene takes / 131 historical takes. Final TypeScript, 121 unit tests / 18 files, 24 Python tests, content/dictionary/ledger/JLPT294, five audio validators, preservation, focused browser, build and real offline playback pass. Precache 1,689 entries / 14,657.87 KiB; offline 2026-10-07T02:56:41.069Z. Native review, remaining N1/keigo/decks and final deploy remain unfinished. No publisher prose or voice recording imported.


## N1 unit 4 verified checkpoint

N1 unit 4: 54 source-checked pairs, three lessons, four notes, 39 scene lines, two original editorials (955/1013 characters) and twenty tasks, including two heard replies. Final TypeScript, 121 unit tests / 18 files, 24 Python tests, content/dictionary/JLPT294/ledger, five audio validators and preservation pass. All 9,721 earlier Clear keys and 1,106 earlier scene mappings preserved; all 142 new WAVs mapped; 131 historical takes retained. Current 9,879 Clear keys / 9,891 synthesis records / 1,145 scene takes / 1,330 runtime kanji pages. Focused browser decoded all 39 scene files and checked all three note sets, both readings at 375/1440 in saved light/dark themes, axe and overflow; detail screenshots inspected. Production build and real offline playback pass: 1,693 entries / 14,756.67 KiB; offline verification 2026-10-07T03:34:18.609Z. Queries checked, not native intonation. Native review pending; no production deployment.

Exact next: N1 unit 5 negotiation keigo. Relevant formation sections inspected: Bunpro and J-nihongo n1-index-b5fbac6b4f を前提に; Bunpro and Nihongo-bu n1-demosashitsukaenai ても差し支えない; MLC business_japanese and JapanesePod101 upper-intermediate S4 lesson 5 conditional requests/restated confirmation; Culture Agency keigo chapter3 actor/permission/request distinctions. Use an original client negotiation with explicit proposal, conditions, permission actor, deadline and corrected understanding; do not treat a question or silence as completed agreement. Guessed J-nihongo/NihongoNET URLs failed and are not evidence. N1 then twelve keigo cores BEFORE remaining decks. Static level chunks still load together; implement actual on-demand delivery before larger deck expansion/cap breach. Never rerun ignored author-n1-u04.py over corrected canonical sources.


## N1 unit 5 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original readings (874/879 characters), twenty tasks. Final TypeScript, 121 unit tests / 18 files, 24 Python tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. All 9,879 prior Clear keys and 1,145 earlier scene mappings preserved; all 141 new WAVs referenced; 131 historical takes retained. Current 10,035 Clear keys / 10,047 synthesis records / 1,184 scene takes / 1,337 kanji references. Browser decodes all 39 scene WAVs, checks three lesson-specific note sets, replay, both readings at 375/1440 in saved light/dark themes, axe and overflow; detail screenshots inspected. Production build and real offline playback pass: 1,701 entries / 14,865.84 KiB; offline 2026-10-07T03:57:23.610Z. Native review pending; no production deployment.

Exact next: implement actual on-demand course delivery/cache before further expansion crosses the 15 MiB install cap, retaining course access, saved progress and prior audio. Then N1 unit 6 speeches/ceremonies: research precise opening, thanks, toast and closing forms using primary authored sources before drafting. Finish N1 and twelve keigo cores before remaining decks. Never rerun ignored author-n1-u05.py or refine-n1-u05.py over canonical corrections.


## On-demand course delivery verified checkpoint (7 October 2026)

Course text now loads by level on demand, with earlier levels loaded before a later lesson opens. A metadata-only library shows the whole authored pathway without fetching its advanced text. Returning completion/attempt/memory IDs restore the required level without rewriting progress; browsing all-content shelves loads their full contents. Watch constructs its practice sample after content arrives. Tooling audits still read the full validated aggregate rather than the browser's currently loaded subset.

The existing Settings offline-download action saves course text plus every mapped clip. Hashed same-origin course cache lookups ignore the Origin Vary header so downloaded files work for module imports as well as ordinary fetches. Failed imports offer a reload that retains data; leaving during a pending request cannot open an old lesson later. No IndexedDB schema, auth, visuals, course prose or recording bytes changed. Precache: 1,692 entries / 12,112.16 KiB (previous 14,865.84 KiB); a build guard rejects installs over 15 MiB. Advanced text caches independently after use. Development mode explains that offline saving requires the built app.

Passed: TypeScript, 121 unit tests / 18 files, full content/dictionary check, preservation of all 10,035 Clear keys / 1,184 scene mappings / 131 historical takes with zero new WAVs, 64 existing-screen browser checks, five new loading cases in both development and production, and focused N1-u05 / N3-u12 browser checks. Loading cases cover no advanced initial download, prerequisite loading, failed-import recovery, cancellation, and unchanged returning progress; failure layouts inspected at 375/1440 with axe/overflow checks. Real production offline report: 2026-10-07T04:36:22.771Z, all fifteen course chunks cached, N1 lesson opens, reactions/dialogue/deck examples play and JLPT teacher loads with zero page errors. No production deploy.

Exact next: N1 unit 6 speeches/ceremonies, then remaining N1 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deploy. The preliminary author helper output/author-n1-u06.py is NOT canonical or executed yet: inspect/correct it before authoring. Primary formation sections inspected: MLC business_japanese; Culture Agency keigo chapter2; Bunpro ながらも; Zexy cheers.html authored ceremony guide (its wedding-specific rules are not applied universally). A small original client exhibition continues unit 5's agreed booklet delivery; keep public openings/thanks and closing scope clear. Native review remains pending. Never rerun ignored finalized unit author/refinement helpers.


## N1 unit 6 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original programme/diary passages (1,022/1,061 prose characters, plus a five-row timetable) and twenty tasks. All five contextual speech readings pin their inspected mora sequences in content/voices/pronunciation-readings.json; the audio validator checks them. Corrected 中→なか, 試そう→ためそう and authored 御礼→おれい without altering any earlier recording. All 10,035 earlier Clear keys / 1,184 scene mappings / 131 historical takes preserved; all 135 new WAVs mapped. Current 10,185 Clear keys / 10,197 synthesis records / 1,223 scene takes / 1,347 kanji pages. Inventory: 85 packs / 3,624 records / 315 lessons / 229 notes / 125 scenes / 72 readings (31,954 characters).

Final TypeScript, 121 unit tests / 18 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused browser decodes all 39 scene WAVs, checks three note sets/replay and both readings at 375/1440 in saved light/dark themes with axe/overflow; detail screenshots inspected. Production build and real offline reload/playback pass: 1,702 entries / 12,151.62 KiB; offline 2026-10-07T05:03:50.232Z. An unfinished-render test, stale dev-server public-file cache and build-triggered hot-reload test interruption were resolved before the final successful checks. Native review pending; no production deployment.

Exact next: N1 unit 7 period-drama recognition, then units 8–12 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deployment. Relevant primary authored sections inspected: Japan Foundation 201302 role-language research and 201101 anime/manga teaching, IMABI copula variants, Fukui Prefectural Archives 611944.pdf (full text and rendered page), and Shogakukan’s actual 御座る entry republished by Kotobank. IMABI honorifics-IV returned 429; its search snippet is not inspected evidence. Recognise 拙者/でござる/じゃ and selected 候 writing in a concrete original story, without treating fiction as a full historical transcript or teaching these as workplace speech. Do not add model/identity cautions to dialogue. No unit 7 authored yet. Never rerun output/author-n1-u06.py over the corrected source.


## N1 unit 7 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original readings (948/981 characters) and twenty tasks. Actual queries corrected historical 候/奉願候 read-outs, 殿→との, 銭→ぜに and long vowels in 書状/草履; thirteen exact U7 keys pin full mora sequences. All 10,185 earlier Clear keys / 1,223 scene mappings / 131 historical takes preserved; all 143 new WAVs mapped. Current 10,342 Clear keys / 10,354 synthesis records / 1,262 scene takes / 1,364 kanji pages. Inventory: 86 packs / 3,678 records / 318 lessons / 233 notes / 128 scenes / 74 readings (33,883 characters).

Final TypeScript, 121 unit tests / 18 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 scene WAVs, checks three note sets/replay and both readings at 375/1440 in saved light/dark themes with axe/overflow; corrected detail screenshots inspected. Build and real offline reload/playback pass: 1,719 entries / 12,199.06 KiB; offline 2026-10-07T05:41:45.305Z. Screenshot inspection caught a first-paragraph departure-plan/answer mismatch; canonical annotated prose now agrees with tomorrow-morning departure, then the final build/browser/offline checks were rerun. Native review pending; no production deployment.

Exact next: N1 unit 8 literature, then units 9–12 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deploy. Sōseki’s 吾輩は猫である card, author dates and actual XHTML retrieved through aozora-renewal.cloud; official aozora.gr.jp requests failed. Select three consecutive painting-story paragraphs (924 characters), preserve source prose exactly, add supported readings/glosses and original commentary/questions. Do not imply the friend’s quoted art-history claim is independently established. Primary formation research: Bunpro とみえる and authored Japanese-language-education tomieru; IMABI やら plus Shogakukan 大辞泉 やら republished by Kotobank; quotation from IMABI/Tae Kim; literary copula source still needs full corroboration. No unit 8 authored yet. Never rerun ignored finalized author helpers, particularly output/author-n1-u07.py.


## N1 unit 8 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, a pinned 924-character Sōseki source excerpt and 1,018-character original commentary, twenty tasks. Source wording and original ruby survive added support and pack compilation, checked by tests/literature-source.test.ts. Six exact pronunciation overrides correct contextual 甘く→うまく, 一行→いちぎょう, 嘲ける→あざける and 並べ→ならべ. All 10,342 prior Clear keys / 1,262 scene mappings / 131 historical takes preserved; all 144 new WAVs mapped and active. Current 10,501 Clear keys / 10,513 synthesis records / 1,301 scene takes / 1,382 kanji pages. Inventory: 87 packs / 3,732 records / 321 lessons / 237 notes / 131 scenes / 76 readings (35,825 characters).

Final TypeScript, 122 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs and checks three lesson note sets/replay and both readings at 375/1440 in saved light/dark themes with axe/overflow; detail screenshots inspected. Build and real offline reload/playback pass: 1,737 entries / 12,247.80 KiB; offline 2026-10-07T06:16:21.889Z. Native review pending; no production deployment.

Exact next: N1 unit 9 Literature II, then units 10–12 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deploy. Candidate Miyazawa Kenji 注文の多い料理店, new-spelling card43754/file43754_17659.html; actual author/card inspected through aozora-renewal.cloud. Full text and formation corroboration still need inspection. Preserve a consecutive source excerpt and its ruby, teach evidence-supported interpretation, receiver/agent and narrative explanation. Never rerun output/author-n1-u08.py or support-n1-u08.py over finalized canonical sources.


## N1 unit 9 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, a pinned 1,098-character Miyazawa source excerpt and 1,051-character original commentary, twenty tasks. Source prose/ruby survives added support and compilation; exact raw/selection hashes are pinned. Corrected contextual 山猫軒→やまねこけん, 地の文→じのぶん and その後→そのあと through three new exact-key pronunciation inputs. All 10,501 prior Clear keys / 1,301 scene mappings / 131 historical takes preserved; all 147 new WAVs referenced. Current 10,658 Clear keys / 10,670 synthesis records / 1,340 scene takes / 1,396 kanji pages. Inventory: 88 packs / 3,786 pack records / 324 lessons / 241 notes / 134 scenes / 78 readings (37,974 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs, checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. Production build and real offline reload/playback pass: 1,751 entries / 12,290.24 KiB. Native review pending; no production deployment.

Exact next: N1 unit 10 commentary listening, then units 11–12 and twelve workplace-keigo cores BEFORE remaining decks/JLPT expansion and final deployment. Primary authored formation sections inspected for にしたところで (Bunpro/mainichi-nonbiri), を踏まえて and に即して (Bunpro/NihongoNET), ないとも限らない (NihongokyoshiNET and Sanshusha publisher errata, attachment-table screenshot still to inspect). Use a concrete original library-hours discussion with distinct speakers, evidence versus proposals and final qualified positions. Community tags vary; no official syllabus claim. Never rerun finalized output/author-n1-u09.py; it predates canonical ruby/gloss/schema/editorial corrections.


## N1 unit 10 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original readings (957/926 characters), twenty tasks. The discussion keeps five-o’clock closing, proposed Wednesday seven-o’clock trials, response counts, unchanged two-person staffing and unapproved next steps distinct. Eight exact new keys correct 聴取’s contracted シュ, long-o vowels in 恒常的/繁忙, contextual 仕事の後→あと and 読み違える→よみちがえる. All 10,658 prior Clear keys / 1,340 scene mappings / 131 historical takes preserved; all 143 new WAVs referenced and active. Current 10,816 Clear keys / 10,828 synthesis records / 1,379 scene takes / 1,404 kanji pages. Inventory: 89 packs / 3,840 pack records / 327 lessons / 245 notes / 137 scenes / 80 readings (39,857 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs, checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. Production build and real offline reload/playback pass: 1,759 entries / 12,325.50 KiB; offline 2026-10-07T07:18:28.304Z. Native review pending; no production deployment.

Exact next: N1 unit 11 academic reading, then unit 12 and twelve workplace-keigo cores BEFORE remaining decks/JLPT expansion and final deployment. Independently authored formation sections inspected: definitional とは (Mainichi/NihongokyoshiNET), とされる/とされている (Bunpro/Mainichi), に基づく/いて/いた (Bunpro/Nihongo-arekore), と考えられる (Bunpro plus Keio’s authored report-writing guide). Community labels vary. Bunpro’s とは page concerns surprise, not the selected definition; its universal objectivity/subjectivity contrast is not adopted. Full J-STAGE paper could not be reliably opened and is not relied on. Ignored output/author-n1-u11.py is prepared but not yet executed successfully; inspect it rather than claim content complete. Never rerun finalized U10 author/refinement helpers over the corrected source.


## N1 unit 11 verified checkpoint

52 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original academic readings (1,051/1,015 characters), twenty tasks. The fictional classroom investigation keeps twelve volunteers, ten complete pairs, 38/26-second medians, seven/eight correct answers, source-attributed policy, fixed order and an uncompleted follow-up distinct. Contextual ruby corrected 指す, 役割, 読み方, 表, 行って, 足して, number compounds and 全く. Seven exact new pronunciation inputs pin full inspected mora sequences; earlier recordings are unchanged. All 10,816 prior Clear keys / 1,379 scene mappings / 131 historical takes preserved; all 141 new WAVs referenced. Current 10,970 Clear keys / 10,982 synthesis records / 1,418 scene takes / 1,414 kanji references. Inventory: 90 packs / 3,892 pack records / 330 lessons / 249 notes / 140 scenes / 82 readings (41,923 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs and checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. Build and real offline reload/playback pass: 1,769 entries / 12,364.16 KiB; offline 2026-10-07T07:41:56.829Z. An early mapping test ran before dialogue rendering finished and failed as expected; the final complete suite passes. Native review pending; no production deployment.

Exact next: N1 unit 12 work capstone, then whole N1 core reread and twelve workplace-keigo cores BEFORE remaining decks/JLPT expansion and final deploy. Outline: report, meeting, client apology and farewell. Primary authored sections inspected for own-side いたす, お/ご…申し上げる, considerate requests and continuing/past gratitude: Culture Agency keigo chapters2–4, Bunpro いたす and MLC’s Business Japanese page. MLC guessed keigo.html failed; MyNavi page did not expose the searched relevant text, so neither is claimed as inspected formation evidence. N1-u12 vocabulary selector has 85 unused restricted matches but no unit source yet. Never rerun finalized U11 author/refinement helpers over its canonical corrections.


## N1 core complete / unit 12 verified checkpoint

All twelve N1 core units are authored: 644 new restricted-JMdict pairs, 36 lessons, 49 notes, 468 scene lines, 24 readings and 240 tasks. Unit 12 adds 52 pairs, three lessons, four notes, 39 lines, two original readings (1,215/1,158 characters) and twenty tasks. All 10,970 prior Clear keys / 1,418 scene mappings / 131 historical takes preserved; all 142 new WAVs referenced. Current 11,125 Clear keys / 11,137 synthesis records / 1,457 scene takes / 1,419 kanji pages. Inventory: 91 packs / 3,944 records / 333 lessons / 253 notes / 143 scenes / 84 readings (44,300 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python tests, source/content/ledger/JLPT294, five audio validators, preservation, build and real offline playback pass. U10 and U12 production browser cases pass; U12 decodes 39 WAVs, checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. A last lookup-only correction changes 間 in the handover to あいだ, matching its existing ruby; final build/offline rerun passes. Precache 1,774 entries / 12,398.04 KiB; offline 2026-10-07T08:13:17.698Z. Native review pending; no production deployment.

Whole N1 editorial reread covered all 36 scenes, all 24 reading texts and 240 task prompts/correct answers. U10's city library is explicitly different from U4's trial library. U12 specifies next month's different exhibition and the current booklet, so the completed U5–6 exhibition is not silently repeated. Mori's transfer to sales retains a continuing relationship. Completed sends, approvals and handovers remain separate from planned first use of the checking procedure. Contextual 本日中/旧版 query corrections add two exact keys and do not change older recordings. Detailed earlier unit reviews remain in output/review-n1.md; this is an author/editor pass, not an independent native certification.

Exact next: twelve workplace-keigo core scenarios BEFORE remaining source-backed N3/N2/N1 decks and JLPT expansion, then final deploy. Start keigo-u01 reception: guest いらっしゃる, own-side おります/参ります, directed 伺う and selected お待ちください. Full relevant Culture Agency chapter2 and Bunpro いらっしゃる / MLC Business Japanese inspected; selected requests corroborated in Culture Agency chapter3. Do not adopt Bunpro's overly restrictive ご～ください generalisation. Twenty–thirty unused restricted pairs, one lesson, three three-example notes, two 8–14-line scenes, one document and 12–14 tasks including three styles and listener-specific register. No keigo source authored yet. Never rerun finalized U12 author/refine helpers over canonical corrections.


## Workplace-keigo U1–9 verified checkpoint — 2026-10-07

Nine scenarios: 188 new restricted-JMdict pairs, nine lessons, twenty-seven notes / eighty-one examples, eighteen scenes / 178 lines, nine documents and 126 contextual tasks. U7–9 add apology, negotiation and presentation. The delayed twenty copies are received explicitly before the next job; a reduced-budget sample does not imply an order; presentation questions and Friday-five reply stay separate from Monday order approval. Actual 五分 duration is pinned to ごふん, not ごぶ. Precise reading/gloss fixes are canonical; do not rerun ignored author helpers.

Final TypeScript, 125 unit tests / nineteen files, 24 Python tests, source/content/dictionary/ledger/JLPT294, five audio validators, preservation, U7–9 focused browser cases, production build and real offline playback pass. Theme checks now require the saved light/dark value before and after reload; screenshots remain in the existing design. All 11,559 earlier Clear keys / 1,575 prior scene mappings from 907c030 are unchanged; all 216 new WAVs referenced; 132 historical takes retained. Current 11,775 Clear keys / 11,787 synthesis records / 1,635 dialogue takes. Precache 1,786 entries / 12,525.66 KiB; offline 2026-10-07T10:21:54.719Z, eighteen chunks / 100 teacher clips / 2,855 deck audio URLs / twenty-two examples played. No production deployment; native listening/editor review pending.

Exact next: U10 interview and U11 client visit are authored but NOT compiled/verified. Finish U10, then U11 and U12 seasonal greetings, before remaining N3/N2/N1 decks and N2/N1 JLPT banks, whole-course checks and the authorised final deploy. Keep design, auth, database and old recordings; backup only course-build, never main before completion.
