# Sources and assets

## Japanese reference data

- **JMdict and KANJIDIC2**, Electronic Dictionary Research and Development Group (EDRDG). Data licensed CC BY-SA 4.0. Project: https://www.edrdg.org/ . Machine-readable distribution: https://github.com/scriptin/jmdict-simplified . The local subsets retain only matched course forms and ten character entries. Release URL and version are recorded in `content/sources/*provenance.json`. Current course readings are checked against these subsets; unlisted forms do not gain source verification merely by passing syntax checks.
- **KanjiVG**, Ulrich Apel and contributors, CC BY-SA 3.0. https://kanjivg.tagaini.net/ and https://github.com/KanjiVG/kanjivg . `public/strokes/*.json` adapts original SVG stroke paths into JSON for interactive rendering; stroke geometry is preserved. These derived path assets remain CC BY-SA 3.0.
- No Tatoeba sentences or current JLPT level list have been imported. All shipped lesson/letter prose is an AI-assisted original draft awaiting human language review. No official current JLPT vocabulary syllabus is claimed.

## Current JMdict reading subset

`content/sources/jmdict-readings.json` is extracted from the official EDRDG
JMdict_e at https://www.edrdg.org/pub/Nihongo/JMdict_e.gz by
`scripts/jmdict_sources.py`. Copyright James William Breen and the Electronic
Dictionary Research and Development Group; derived dictionary data remains
CC BY-SA 4.0. Documentation: https://www.edrdg.org/jmdict/j_jmdict.html ; licence:
https://www.edrdg.org/edrdg/licence.html . `jmdict-provenance.json` records the
download date, source SHA-256, subset hash and course pack hashes; entry IDs and
unmatched course items appear in `jmdict-coverage.json`. Rebuild using
`npm run sources:jmdict`. This official-XML pipeline supersedes the earlier
jmdict-simplified subset for JMdict only; KANJIDIC2 provenance is unchanged.
Only dictionary-supported spelling/reading pairs are represented. Matching
does not certify contextual meaning or natural Japanese.

## JLPT study resources and original questions

- **Nihongo Sō-matome**, ASK Publishing: https://ask-books.com/somatome/ . The app links the catalogue and selected N5–N1 book pages for study access and edition information.
- **Shin Kanzen Master**, 3A Network: https://www.3anet.co.jp/np/list.html?series_id=4 . The app links the N4–N1 series catalogue; it does not offer a Shin Kanzen N5 plan.
- **Official JLPT samples and practice workbooks**, Japan Foundation / JEES: https://www.jlpt.jp/e/samples/forlearners.html and https://www.jlpt.jp/e/samples/sampleindex.html . These are external resources, including listening practice. The official test-section page is linked for scope, not as the basis for Shiori's short timers.
- No publisher textbook text, questions, scans or audio have been ingested into the JLPT bank. Its 60 questions and pathway assignments are original AI-assisted drafts, not publisher-derived lessons or official test items. Sources, access-check date, scope and lack of human editorial review are recorded in `content/jlpt/provenance.json`; level assignments are editorial estimates. A source link does not imply endorsement or permission to reproduce its contents.

## Audio

- Twenty additional reaction deliveries use the same **VOICEVOX:冥鳴ひまり** style 14 speaker as the approved lesson voice. They vary synthesis prosody only; `content/voices/emotion-provenance.json` contains settings, exact text, queries and hashes. The voice credit and existing VOICEVOX model/library attribution also apply to these clips.

- **VOICEVOX:冥鳴ひまり** is the current lesson and baseline-reaction voice credit, also displayed on the app's voice page. Rendering uses VOICEVOX Core 0.17.0 and VOICEVOX VVM 0.16.4 (`1.vvm`, style 14). Official projects: https://github.com/VOICEVOX/voicevox_core and https://github.com/VOICEVOX/voicevox_vvm . Speaker terms: https://meimeihimari.wixsite.com/himari/terms-of-use . Preserve the attribution and observe the applicable engine, model and speaker terms; the engine's license alone does not replace the speaker terms. Queries, rendering settings and model/audio hashes are in `content/voices/lesson-provenance.json`. These synthetic clips do not claim an authenticated character or performer voice.

- **Fun-CosyVoice3-0.5B-2512**, FunAudioLLM / QwenAudio, Apache 2.0 model and inference project. https://github.com/QwenAudio/CosyVoice and https://huggingface.co/FunAudioLLM/Fun-CosyVoice3-0.5B-2512 . Auditions use model revision `29e01c4e8d000f4bcd70751be16fa94bf3d85a18`, the already installed sibling runtime, and newly generated Kokoro Japanese reference speech. All four candidate anchors and 48 acting samples are synthetic. Per-clip instructions, seeds, reference hashes and audio hashes are recorded in `content/voices/audition-provenance.json`.

- **Kokoro-82M**, hexgrad, model Apache 2.0: https://huggingface.co/hexgrad/Kokoro-82M . Local Japanese voice `jf_alpha` supplied the earlier practice clips and the synthetic references retained for the CosyVoice auditions. It is no longer the current lesson renderer.
- **kokoro-onnx**, thewh1teagle, MIT: https://github.com/thewh1teagle/kokoro-onnx . ONNX/voice assets from its `model-files-v1.0` release.
- **Misaki**, hexgrad, Apache 2.0: https://github.com/hexgrad/misaki . The earlier Kokoro pipeline and retained audition-reference tooling use Japanese grapheme-to-phoneme preprocessing with the pinned 0.7.4 package and its dependencies; the current VOICEVOX renderer uses Open JTalk through VOICEVOX Core.

## Visuals and fonts

- Current Shiori branding uses the user-approved reserved writing logo (2026-10-05), originally generated with the built-in image generation tool and traced into actual SVG paths using VTracer 0.6.12 (MIT/Apache-2.0). The vector conversion retains the selected character and illustrated lettering, with background removal, theme variants and tiny face details restored. Source and prompts: `output/shiori-signature-concept-v2/`; reproducible converter: `scripts/build-signature-brand.py`; provenance: `public/brand/signature-provenance.json`. The SVG icon is a crop of the same vector character. No bitmap or font is embedded in these SVGs. The earlier Cormorant/bookmark identity below is retained as legacy artwork.

- Violetto is a newly generated 16-pose transparent PNG atlas inspired by the user's Violet Evergarden/chibi reference screenshots. It is not a vector file. The exact prompt is in `public/mascot/violetto-atlas.prompt.txt` and PNG metadata. Source generated using the image generation tool on 2026-10-04. User-supplied reference screenshots were not bundled as app artwork.
- The separate `public/mascot/violetto-teacher.png` is a generated transparent full-body teacher pose using the existing atlas as its identity/style reference, with glasses, folio and pen. It was generated with the image generation tool for the JLPT room on 2026-10-04. Its prompt is in `public/mascot/violetto-teacher.prompt.txt` and embedded PNG metadata. It is raster artwork and has no recorded human asset review.
- Shiori's folded bookmark-S, violet fold, red ribbon and bookmark-shaped wordmark dots are original SVG geometry. The lowercase wordmark letter outlines are adapted from Cormorant Garamond 600 (The Cormorant Project Authors), under the SIL Open Font License 1.1. The bundled attribution and full license are in `public/brand/FONT-LICENSE.txt`; `scripts/build-brand.py` derives outlines from the local Fontsource WOFF. UI icons use Phosphor Icons (MIT), https://phosphoricons.com/ .
- Locally bundled fonts: Cormorant Garamond, Courier Prime, Noto Serif JP and Source Sans 3 via Fontsource, under the SIL Open Font License. Package license files remain in node_modules; see https://fontsource.org/ .
- React, Vite, Dexie, ts-fsrs and other dependencies retain their respective package licenses. This notice does not replace the dependency license files.

Reading-path sentence bank (`content/reading/sentences.json`): 24 original
AI-assisted Japanese comprehension items authored for Shiori, October 2026.
Not native-reviewed; no textbook, lyric, or examination text was reproduced.
Kana and word drills reuse the existing course and its existing provenance.
Learner-pasted text and translations retain their own source provenance.

October 2026 extension: KANJIDIC2 reference subset now covers all 800 kanji in
installed course words; provenance records its pinned release URL and archive
SHA-256. New reference glosses/readings are copied from that subset. KanjiVG
stroke files record the upstream Git commit and individual SVG SHA-256; license
CC BY-SA 3.0, copyright Ulrich Apel and contributors. No mnemonic/etymology
claims were added. See content/sources/kanjivg-provenance.json and
kanjidic2-provenance.json. JMdict lemma checks reuse the hash-pinned EDRDG source
recorded in jmdict-provenance.json; personal names are explicitly unverified.

Supabase JavaScript SDK (@supabase/supabase-js): MIT license. Sync architecture
adapted from this workspace's Chinese/Kiyo project. The hosted site shares a
Supabase project with Kiyo using isolated Shiori tables; see supabase/README.md.

Violetto teacher library (October 2026): 100 original AI-assisted Japanese
messages in `content/voices/reaction-lines.tsv`, with furigana, romaji and English
translations. Character direction: `content/voices/teacher-persona.json`.
Rendered locally with VOICEVOX Core 0.17.0, VVM 0.16.4, style 14;
credit VOICEVOX:冥鳴ひまり. Source queries, delivery settings, model hash and
individual WAV hashes: `content/voices/teacher-provenance.json`.
No new mascot artwork was created for this pass. Native listening review
remains pending; signal/phoneme checks are not pronunciation certification.

Course dialogue deliveries: 283 speaker-specific takes rendered locally in the
same VOICEVOX:冥鳴ひまり voice. Wording and Clear-mode recordings are unchanged.
Character settings: `content/voices/dialogue-speakers.json`; recording queries,
model and WAV hashes: `content/voices/dialogue-provenance.json`. The deliveries
are acting directions, not measured emotion labels. Native listening review
remains pending.

Vocabulary source inventory (five N5 and six N4 decks installed, 941 form records): Jonathan Waller / Tanos, shared under CC BY, version unspecified at the origin. CSV mirror: jamsinclair/open-anki-jlpt-decks, via chyyran/jlpt-anki-decks, revision 1ad66734417aca9dbcca6b2d5ee440cb13ab3ba0. Repository MIT license is preserved at content/sources/jlpt-vocabulary/LICENSE; it does not replace upstream data attribution. Original permission: https://www.tanos.co.uk/jlpt/sharing/. File URLs and SHA-256 values are in the accompanying provenance.json. Community level assignments are not official JLPT lists. Selected source rows, original cells, restricted JMdict entry IDs and original example-draft hashes are recorded in content/sources/decks/. English meanings and contextual examples are original AI-assisted authoring, awaiting native review. No dictionary/exam example sentences are copied into new course units.

## Beginner source ledger, 6 October 2026

Eighteen vocabulary decks contain 1,017 original contextual records. Raw CSV bytes are unchanged. The beginner ledger accounts for every N5/N4 row and explicitly distinguishes inflected/orthographic relations, corrected or split source cells, attached patterns and exclusions. Source repairs still require restricted JMdict pairs; they do not certify original examples. `scripts/build-vocabulary-ledger.py --check` checks this ledger against the installed packs and pinned sources. Current character references cover 831 kanji; prior dictionary and stroke bytes are preserved. No new third-party lesson prose or audio was imported.

## N3 unit 1, 6 October 2026

Thirty-two original word/example records, four teaching notes, twenty scene lines, a diary and sixteen tasks are AI-assisted drafts. Bunpro and JLPT Sensei are sequencing/formation references linked in content/sources/grammar/n3-u01.json; their examples and prose were not imported. Fourteen additional kanji references use the existing pinned KANJIDIC2 archive and KanjiVG commit. Ninety new waveform files are mapped; every earlier recording/query remains unchanged. Reference and signal checks do not certify naturalness, perceived emotion or pronunciation.
