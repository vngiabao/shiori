# Japanese project continuation

Work only in this Japanese folder unless the user asks otherwise; Chinese is a read-only reference sibling. The user confirmed Violetto as mascot. Shiori is the provisional app brand. Read PRODUCT.md, DESIGN.md, PEDAGOGY.md and AUDIT.md before changing direction.

Follows ../SHARED-SPEC.md. Share learning-screen structure with Kiyo while preserving Shiori's artwork, voice, typography and identity. Batches A–C of prompts/gpt-design-pass.md are the current review checkpoint; wait for the user's OK before D/E.

- Preserve the antique letter world, chibi character proportions, accessible light/dark themes and reduced-motion support.
- Keep the IndexedDB database identity `shiori-japanese-v1` stable. Use additive versioned migrations. Never clear user data to fix a schema or rename the brand.
- Evidence is per skill. Hints, shown answers, furigana and transcripts are supported work. Self-report and recordings are not objective language scores. Completion is not mastery and roadmap steps are not proficiency certificates.
- Treat content/packs as source; src/generated is compiled output. Run the content gate, relevant unit/browser tests and build after changes. Do not regenerate first-post from the seed script over human edits.
- JMdict and KANJIDIC2 validate supported readings, not sentence naturalness. Historical KANJIDIC JLPT numbers must never become current N5–N1 mappings. Community mappings need explicit provenance. Human review and AI checks must be distinguished.
- Extend activity schemas and UI before authoring unsupported activity types. Avoid bulk filler presented as an advanced curriculum.
- Local media and recordings must not be uploaded without an explicit product feature and user action. No cloud sync or AI service is configured yet; never imply otherwise.
- Keep source and asset provenance, THIRD_PARTY_NOTICES and the content inventory current. Mascot generation prompt is next to its atlas and embedded in PNG metadata.
- The user authorized publishing this project to https://github.com/vngiabao/shiori. Hosted web deployment and live cloud-service configuration remain separate from the repository push.
- Kana teaching notes (memory aids, look-alikes, kanji origins, study tips) live in `content/kana/notes.json` and render through `src/kana.ts` and `src/KanaAid.tsx`. They are an AI-assisted draft: mnemonics are labelled memory aids, never history; origins need human review.
- Violetto's lines carry `ruby` (`{漢字|かんじ}`, furigana over kanji only) and `romaji` next to `text`/`reading` in `content/voices/violetto.json`. The user prefers furigana plus romaji over a second all-kana line. Keep `text`/`reading` unchanged; audio checks use them.
- Structure follows ../SHARED-SPEC.md. `src/study-layout.css` (imported last) owns focus mode, the kana desk, Violetto's bubble and Today panel; edit it rather than adding another override layer. One voice only: Violetto, with moods.
- N5 course: `content/units/n5-uNN.json` is the authoring source (words as {漢字|かな} ruby, letters as sentences of word ids). Build each with `npx tsx scripts/build-unit.ts content/units/n5-uNN.json`, which writes `content/packs/n5-uNN.json` and rotates answer positions; never hand-edit those generated packs. Plan and cast: `content/packs/PLAN-n5.md`. All units are AI-assisted drafts awaiting native review.
- Phrase lessons and review run in `src/PhraseLesson.tsx` (meet → scene → exercises → spaced word checks; mixed review via `buildReviewSteps`). Exercise types and their validator live in `src/types.ts` and `src/packs.ts` (`validatePractice`).
- Watch (`src/Watch.tsx`, route #media) plays the learner's own video plus a Japanese .srt/.vtt (parsed in `src/subtitles.ts`); saved lines are `db.lines` (Dexie v4) and are in backups. Files are never uploaded. The route to subtitle-free viewing is `src/Route.tsx` on Listen.
- After rendering audio (`.audio-py312/Scripts/python.exe scripts/render-japanese-voice.py`), update `lessonManifestSha256` in `content/voices/emotion-provenance.json` once you have confirmed old clips are unchanged (file names are content hashes); `scripts/check-emotions.py` pins it.
- Side tasks for the GPT chat, with a do-not-touch list: `prompts/gpt-side-tasks.md`.
