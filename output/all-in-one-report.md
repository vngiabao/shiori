# Shiori: approved side tasks A–E

Historical checkpoint from 5 October 2026. For the completed N5–N1 release, deployed versions and remaining live acceptance steps, use [the current release report](release-report.md) and [course progress](course-progress.md). The older counts and pending setup statements below are not current status.

Date: 2026-10-05. Local improvements only. Existing visual identity, learning-screen layout and voice assets retained. No hosted account, project, credentials or deployment was created.

## A — dictionary evidence

Added optional lemma metadata without changing course wording or readings. Source units use an additive `lemmas` map because their words are compact tuples; the builder passes each entry to the generated Word's `lemma` field. N5 packs were rebuilt through the builder. Kana drills are excluded; names are listed separately, not presented as dictionary-verified words.

Of 428 course word records:

- 157 are excluded sound/kana drills.
- 201 surface spelling/reading pairs match JMdict; 124 of those contain kanji.
- 66 surface forms remain unmatched; absence from the dictionary is not an error.
- 4 names are explicitly unverified: ユイ, レン, ハナ, 佐藤.
- 0 mapped surface readings disagree with the dictionary.
- All 45 added lemmas match JMdict. For 39 additional course records, the kanji stem's reading also mechanically matches the lemma. This does **not** validate the entire inflected phrase.
- Six course-to-lemma relationships remain mechanically unestablished: `read`, `drink`, `go`, `wait`, `may-read`, `n5-u06-w-kite`. The last has 来る/来て's changing reading; the others use combined parts that the conservative matcher does not split.

Thus 124 kanji-bearing records have direct surface evidence, plus 39 with narrower stem evidence. Do not report all 163 as completely verified inflected words. The subset contains 222 forms after removing drill/name-only matches and adding base forms (previous subset: 295).

Evidence: [reading audit](jmdict-mismatches.md), `content/sources/jmdict-coverage.json`, hash-pinned provenance and `scripts/test_jmdict_sources.py`.

## B — kanji reference coverage

All **167 distinct kanji in installed course word text** now have reference entries and stroke data: 10 existing entries plus 157 new entries. Missing KanjiVG characters: **0**. Missing KANJIDIC2 characters: **0**.

New meanings/on/kun readings come from the pinned KANJIDIC2 subset. KanjiVG files record the upstream commit and SVG hashes. New component fields stay empty where no checked component explanation was supplied. No invented etymology or current JLPT mapping was added. The filename `content/kanji/n5.json` describes this course bundle, not an official N5 kanji list.

The existing Read → Kanji screen loads the additions through `src/content.ts`; `src/Study.tsx` and its design were untouched. Content checks now fail if any course kanji lacks a source-backed reference or stroke paths.

## C — local cloud-sync groundwork

Ported Kiyo's consent/revision/transport approach to Shiori's own schemas. Settings uses existing components and spacing. Without configuration, sign-in remains unavailable and the app honestly reports local storage.

Additive Dexie **v6** adds sync state; v5 was already occupied by reading runs/text drafts. Database identity remains `shiori-japanese-v1`. Default sync scope includes learning attempts, completions, media session metadata, JLPT plans/runs, reading runs and core profile preferences. Personal-text opt-in separately adds saved lines, text-desk passages/translations, field notes and JLPT logs. Audio/video/recording bytes never sync; voice preferences and unsaved recovery drafts stay local.

Local records form a durable offline queue. Tested retry retains evidence without duplicate upload. Consent persists, account ownership is checked, cloud deletion pauses old devices, and review memories are deterministically rebuilt from attempts. Mutable-record tie-breaks are deterministic, not a semantic merge of conflicting edits; clock-based fields depend on device clocks.

The RLS migration, isolation script, setup instructions and `.env.example` are present. **Real Postgres/RLS execution and live email/Google authentication remain unverified.** No Supabase CLI or psql was available, and Docker's daemon was not running. Static SQL tests and mocked RPC tests cannot establish production isolation. Do not treat this as an already working cloud backup.

Design evidence: [sync design check](sync-design-check.md). Setup and limitations: [Supabase README](../supabase/README.md).

## D — course review

[review-n5.md](review-n5.md) contains one issue table per unit, plus first-post and the new reading bank. It records **10 must-fix rows**, chiefly ambiguous answer keys, assertions unsupported by passages and the omitted で→だ past-form rule. Suggested fixes are ready for the course author; **they were not applied**, as requested for this read-only review. The review is AI-assisted, not native-speaker certification.

All 24 new reading-path sentences were inspected; no concrete language/key defect was identified. Repeated familiar questions still cannot prove unseen-reading transfer or karaoke speed. The app remains a foundation plus practice tools, not a complete zero-to-N2/N1 curriculum.

Refreshed `output/content-inventory.json`: 13 packs, 33 lessons, 18 letters, 271 non-drill word/chunk records, 30 grammar notes, 167 kanji references and 504 suggested first-pass minutes. These are installed-content counts, not proficiency claims or unique vocabulary certifications. Zero packs have native-reviewed status.

## Validation checkpoints

Final outcomes after fixing failures introduced during implementation:

- **A:** TypeScript pass; 63/63 unit tests; 7/7 Python source tests; content gate pass; JLPT gate pass; 29/29 browser tests; build pass.
- **B:** TypeScript pass; 65/65 unit tests; content gate pass; JLPT gate pass; 29/29 browser tests; build pass.
- **C:** TypeScript pass; 72/72 unit tests; content gate pass; JLPT gate pass; 30/30 browser tests; build pass.
- **D:** TypeScript pass; 72/72 unit tests; 7/7 Python source tests; content gate pass; JLPT gate pass; 30/30 browser tests; build pass. The network-retry test now also verifies successful retry and no duplicate re-upload.
- **E:** TypeScript pass; 72/72 unit tests; content gate pass; JLPT gate pass; 30/30 browser tests; build pass. Logs: `part-e-browser.log` and `part-e-build.log`.

The content gate covers 13 packs / 428 entries / 33 lessons / 18 letters and all 167 course kanji. The JLPT gate covers five pathways and 60 original questions; it does not certify full JLPT coverage. Browser tests include mocked cloud consent, persisted refusal, optional text, sign-out, mobile fit and accessibility. Live SQL isolation/auth/network behavior is outside these pass counts.

## Steps remaining for you to enable Supabase

1. Follow `supabase/README.md` to start a **local** Supabase stack with Docker/CLI. Apply `supabase/migrations/202610050001_learning_sync.sql` to its database.
2. Run `supabase/tests/rls.sql` against that local database as administrator with `psql --set ON_ERROR_STOP=1 --file supabase/tests/rls.sql` and the local connection parameters. It rolls back its fixtures. Resolve every failure before using hosted sync.
3. When ready, create your own Supabase project and review its current plan/usage limits. Apply the tested migration, and verify isolation on the intended environment before trusting it with progress.
4. Copy `.env.example` to `.env.local`; set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the project URL and public anon/publishable key. Never use a service-role key in browser configuration.
5. Enable email Auth and include `{{ .Token }}` in its Magic Link email template. Set site URL/allowed redirect to `http://127.0.0.1:5174`. Google additionally needs its own OAuth provider configuration; keep its secret in Supabase provider settings.
6. Restart Vite, sign in from Settings, and explicitly choose to add this device's progress. Personal text remains off unless you enable it. Test two browser profiles, offline edits, reconnection and backups before relying on sync.

Continue exporting local backups meanwhile. Source attribution and licenses are in `THIRD_PARTY_NOTICES.md` and the source provenance files.
