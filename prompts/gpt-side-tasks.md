# Side tasks for the GPT (Codex) chat

These run in parallel with Claude's work on the course. Each is chosen because a machine check or a reference implementation can confirm the result, so accuracy does not depend on judgement alone. Send one box at a time; wait for its report before the next.

**Shared rules for every task (include them each time):**

```
RULES FOR THIS TASK
- Work only in the Japanese folder. Claude is editing at the same time. Do NOT edit: content/units/*, content/packs/n5-*.json, content/packs/first-post.json, src/PhraseLesson.tsx, src/Watch.tsx, src/Route.tsx, src/LetterTasks.tsx, src/Study.tsx, src/App.tsx, src/phrase-lesson.css, src/watch.css, src/study-layout.css, e2e/practice.spec.ts, e2e/watch.spec.ts. If your task truly needs one of them, stop and tell me which line and why.
- Database identity stays shiori-japanese-v1. Additive Dexie migrations only. Never clear user data.
- Run before reporting: npx tsc --noEmit, npm test, npm run validate:content, npm run validate:jlpt, npx playwright test, npm run build. Report exact pass/fail counts.
- Record sources and licences (THIRD_PARTY_NOTICES.md, provenance files). Say plainly what was machine-checked and what was not.
- No live services, accounts, keys or deployment without asking me.
```

---

## Task 1: Check every word's reading against JMdict (machine-verified)

```
Goal: the content gate currently has JMdict readings for only 152 entries, so most words' kana readings are unchecked. Make it check every word in every pack.

1. Read scripts/fetch-sources.py and scripts/build-packs.ts to see how content/sources/jmdict-readings.json is produced and used (format: { "<written form>": ["<reading>", ...] }).
2. Download the current JMdict_e (EDRDG, CC BY-SA 4.0) with a script, not by hand. Extract readings for every written form that appears as a word "text" in content/packs/*.json, plus common variants. Keep the file small: only forms the course uses. Include kana-only words as their own readings.
3. Re-run npm run validate:content. For every "JMdict reading mismatch", do NOT change course content yourself: list them in output/jmdict-mismatches.md (word id, text, our kana, JMdict readings) so Claude can review. Particles (は read わ, を read お) and words whose app reading is deliberately contextual are expected; note them.
4. Make the script re-runnable (npm run sources:jmdict) so new units are checked automatically.
5. Update THIRD_PARTY_NOTICES.md and content/sources provenance (download URL, date, file hash).
Report: entries covered before/after, mismatches found (count + file), commands run.
```

## Task 2: Kanji reference pages and stroke order for the N5 units (machine-verified)

```
Goal: every kanji used in the course words gets a reference page and stroke-order data, validated against KANJIDIC2 and KanjiVG.

1. List every kanji character in the "text" of all words in content/packs/*.json (first-post and n5-*). Exclude ones already in first-post's kanji list.
2. For each, fetch the KanjiVG SVG (CC BY-SA 3.0) and write public/strokes/<codepoint>.json in the same format as the existing files (char, paths, source, license). Use the existing pipeline in scripts/fetch-sources.py if it does this; extend it rather than duplicating.
3. Create content/kanji/n5.json: [{ char, meaning, components, on, kun, words }]: meaning, on and kun FROM KANJIDIC2 (not from memory), readings separated by 、, words = ids of course words that contain the character. components: name the visible components only if KanjiVG/KANJIDIC2 data supports it; otherwise leave "".
4. Add a loader so these appear on Read → Kanji next to the existing ten (src/content.ts may merge them; do not edit the packs). The gate's KANJIDIC check (scripts/build-packs.ts) must also run on this file. Mnemonics are NOT part of this task.
5. Tests: a unit test that every kanji in course words has stroke data and a KANJIDIC-checked entry.
Report: kanji count, any characters missing from KanjiVG or KANJIDIC2, test results.
```

## Task 3: Cloud sync, ported from Kiyo (reference implementation exists)

```
Goal: years of progress must survive a lost browser. Port Kiyo's sync design to Shiori, built and tested locally with mocks. Do not connect a live project.

1. Read ../Chinese (read-only): its Supabase auth + sync code (src/auth.ts, src/sync.ts, src/sync-model.ts, src/sync-transport.ts, src/SyncPanel.tsx, supabase/migrations/202610040001_learning_sync.sql, supabase/tests, supabase/README.md, and its sync tests). Mirror the design: email-code/Google sign-in off until VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY exist; attempts, completions, media sessions, field sessions, saved lines (db.lines), JLPT plans/logs/runs are immutable or id-keyed records merged by id; profile last-write-wins; memories rebuilt deterministically from attempts (see importBackup in src/db.ts); offline queue; never sync audio or recordings; explicit consent before merging an existing guest record into an account.
2. Add the Supabase SQL migration with row-level security (each user reads/writes only their own rows) under supabase/.
3. Settings → "Account & cloud sync": replace the "planned" text with real controls that appear only when the env vars are set; otherwise keep the honest "not configured" message.
4. Tests: unit tests for merge (duplicate ids, two devices, out-of-order arrival), memory rebuild equals local, consent gate; e2e with a mocked Supabase client.
5. README: .env.example, exact setup steps for a free Supabase project, and a cost note. STOP before creating any project or entering keys; ask me.
Report: files added, test counts, and the steps I must do myself.
```

## Task 4: Independent review of Claude's N5 drafts (second opinion)

Send this after each batch of units lands (content/units/n5-u0X.json). A second model catching different mistakes is useful; it is not a native review.

```
Goal: an independent check of the N5 unit drafts. Review only; do not edit the files.

For each content/units/n5-uXX.json listed below, check:
- Naturalness: would a Japanese speaker say each dialogue line and example this way in this situation? Flag textbook-stiff or unnatural lines with a better alternative.
- Register: polite/casual consistency per speaker and situation.
- Readings: every {漢字|かな} pair correct for this context (e.g. 何 なん vs なに, 一日 ついたち vs いちにち).
- Answer keys: exactly one defensible answer per exercise; distractors clearly wrong in context but still real Japanese; true/false statements unambiguous.
- Letters: the sentences (word-id lists) read naturally once joined; the questions need the text to answer.
Write output/review-n5-uXX.md per unit: a table of issue | location (id) | severity (must fix / should fix / optional) | suggested fix. Be specific; no praise sections.
Units to review: [list them]
```
