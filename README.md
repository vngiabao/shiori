# Shiori · Japanese with Violetto

A personal, reading-led Japanese learning app. **Shiori (栞, bookmark) is the working brand**, with Koto and Shio as alternate names. Violetto is the confirmed companion name. The predominantly blue letter world with soft white paper, muted violet and ribbon-red details carries a 16-pose transparent character atlas and scalable SVG interface marks.


Current local expansion checkpoint: twelve N5 and twelve N4 units, the starter pack, eighteen vocabulary decks (1,017 form records) and N3 units 1–10: 53 packs / 201 lessons / 2,005 entries including 157 drills. N3 adds twenty lessons, 320 word records, 42 grammar notes, twenty scenes / 200 lines, ten original readings and 173 tasks. Both beginner levels have sixty checkpoints and thirty distinct samples. The remaining N3–N1 units, advanced decks/banks and workplace keigo are unfinished. All new target/example/scene audio is mapped; prior clips, 100 teacher messages, design, auth and progress are preserved. Content remains an AI-assisted draft awaiting native review. See output/course-progress.md. This expansion is not pushed or deployed.

Welcome now presents Violetto's playable greeting beside the Shiori logo, Google sign-in and guest entry directly. Owner-only sync and device-history consent are preserved. The hosted Cloudflare Access gate remains unchanged pending the user's confirmation; local welcome changes do not bypass it.

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

The production preview is http://127.0.0.1:5175. Its service worker caches the shipped course, fonts, character, stroke data and audio after the initial online load. Development mode does not install the production offline worker.

**Keep the same browser and URL for your progress.** Browser storage belongs to an origin: localhost, 127.0.0.1, different ports and different browsers have separate data. Export a backup in Settings before moving, clearing browser storage or changing URLs. Import merges attempts and rebuilds review memories; it also preserves study logs, letter drafts and JLPT plans, source-study records and question attempts. Optional cloud sync (Google sign-in, Supabase) is set up for the hosted site; see supabase/README.md. Keep backups regardless. Microphone recordings and imported media files stay in memory and are not included in backups.

## What is here

The current visual system follows the latest blue-led preference: Prussian blue header and companion space, cool blue canvas, soft white paper, blue actions, muted violet correspondence accents, small ribbon-red details and tiny gold ornaments. Emerald remains for correct answers, known items and Violetto's brooch. Night post uses deep blue surfaces. The compact phone desk keeps the lesson action and Violetto visible together. DESIGN.md and .impeccable/design.json record the tokens and responsive rules; src/violet-theme.css implements the visual layer. The original kickoff palette and earlier purple prohibition are superseded by this preference.

- Three entry paths, adjustable daily plan, light Morning letter and dark Night post.
- Kana and sound lessons, phrase lessons, furigana, fading romaji, KanjiVG stroke replay and dictionary glosses.
- Letters with comprehension checks and reply drafts; separate reading, listening, recall, typing and politeness evidence with FSRS reviews.
- Bundled synthetic Japanese audio, local self-recording, scripted typed conversations and a five-step media practice ladder.
- Course library, real-world study journal, local progress and backup/restore.
- A source-led N5–N1 JLPT study room with sequential milestones, original draft checkpoints and short timed samples.

This is a tested study app, **not a complete JLPT course**. Current local counts are above and in `output/content-inventory.json`; the original 21-lesson seed has been expanded. Higher-level roadmap steps still describe future work. Neither self-recordings nor finishing lessons certifies fluency. Read [the detailed audit](AUDIT.md) and [teaching principles](PEDAGOGY.md).

## JLPT study room

Open `/#jlpt/N5` or choose JLPT in navigation. Each level, N5 through N1, has six sequential milestones: entry self-check, vocabulary and kanji, grammar, reading, external listening practice, then a timed sample. Choose your level directly; the entry checklist is self-report, not a placement test. A glasses-wearing teacher Violetto guides this room within the existing blue correspondence design.

The resource desk links Nihongo Sō-matome for N5–N1, Shin Kanzen Master for N4–N1, and official JLPT samples and practice workbooks. Study your own edition or the linked materials and record the unit/pages, minutes and reflection. Publisher lessons, questions and audio are not copied into the app, and assignments are Shiori's organisation rather than a textbook chapter mapping.

The app contains **216 original AI-assisted draft questions**. N5 and N4 each have sixty checkpoint items and thirty distinct sample items; N3–N1 retain twelve seed questions each. Each run still uses a two-question checkpoint or six-question timed sample (8, 9, 10, 12 and 14 minutes for N5 through N1). These short samples cover vocabulary, grammar and reading; listening uses external sources. Raw results and answer explanations do not predict an official JLPT score. Content has not received human language review, and level assignments are editorial estimates.

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
saved-line unit-tag migration is still local and must be verified before the
course expansion deploy. With no env
configuration, no cloud client is started. Personal text is excluded unless
separately enabled. Dexie v6 preserves the existing v5 reading/text stores.

## Expanded reference checks

JMdict audit counts now exclude 157 kana drill records and list four names
separately. Optional lemma metadata never certifies a complete inflected phrase.
`lemmaStatus` checks the base spelling/reading; `lemmaReadingRelationship` only
records a mechanically matching kanji-bearing stem where it can be established.
The course's 800 distinct kanji have KANJIDIC2-backed references and KanjiVG
stroke data. New reference entries are in `content/kanji/n5.json`; the existing
Read → Kanji surface loads them without a design change. Refresh with
`python scripts/fetch-sources.py --kanji-only --cached`. Source hashes/revisions live in
content/sources provenance files and each stroke file. New components are left
empty rather than inventing etymology. Historical JLPT fields are not used.
