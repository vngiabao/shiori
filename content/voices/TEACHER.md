# Violetto's teacher voice

The current approved voice now performs 100 distinct messages, across ten
contexts and five restrained moods. The authoring script is
`reaction-lines.tsv`; the personality brief is `teacher-persona.json`.
Japanese wording, readings and translations are AI-assisted drafts.

She is reserved, dutiful and politely literal. Praise is quiet; corrections
are patient and exact. Humour concerns her own teaching duties, never the
learner's ability. Supported answers remain explicitly supported. She does
not announce mastery from a correct answer or guilt the learner for absence.

The app shuffles each context's messages without repetition until the bag
is exhausted and avoids repeating the final message at the next bag boundary.
The bubble, translated line, pose and recording use the same selection.
Manual replay preserves it. Muting speech still varies the written message.
Older voice auditions retain their original script to preserve audio/text
agreement. Existing artwork and the app's layout are retained.

Rendering uses native VOICEVOX queries, not pitch shifting or stretching a
finished recording. Global pitch-centre offsets are within ±0.5 semitone;
native speed scales are 0.96–1.03. Intonation changes the contour separately
from that centre offset. The conversion follows the pinned Core 0.17
`interpret_query.rs` implementation. See teacher-provenance.json.

The ten hiragana/katakana vowel clips use exactly one explicitly voiced
mora, no consonant or suffix, with a 0.30-second vowel segment and normal
leading/trailing silence. Other kana remain at 0.22 seconds. This change
gives an isolated vowel more audible steady sound; it does not establish
that a listener will perceive every vowel as correct. They are not
randomized or acted, since these are pronunciation targets.

Reproduce locally:

    .audio-py312/Scripts/python.exe scripts/render-teacher.py
    .audio-py312/Scripts/python.exe scripts/check-teacher.py
    .audio-py312/Scripts/python.exe scripts/check-lesson-audio.py
    .audio-py312/Scripts/python.exe scripts/check-emotions.py
    npm run validate:audio

The renderer preserves existing non-target lesson mappings and fills any
missing course lines. The audio mapping gate is part of every production
build: all bundled URLs must resolve to real WAV files, and every installed
course word, dialogue, practice sentence and complete letter needs a mapping.
The optional offline download includes the new library; clips otherwise
cache on first playback. No increase to up-front audio precaching.

In the voice page, explore all 100 messages and audition the five vowels.
File hashes, PCM decoding and native query checks passed during generation.
Human listening review is still pending.

## Dialogue speakers

The 98 installed dialogue lines also have separate speaker-specific takes.
Ren uses Warm, Satō uses Composed, Hana a restrained brighter delivery, Yui
gentle Warm, and You an even Composed delivery. Settings are consistent per
speaker in `dialogue-speakers.json`; all use the same style-14 voice. Global
pitch-centre offsets range from -0.35 to +0.4 semitone and native speed scales
from 0.98 to 1.03. No wording or Clear-mode recording is replaced.

`src/dialogueAudio.ts` resolves by dialogue ID and line index, checking speaker
and text together. Lesson scenes, conversation replays and Watch's course
samples use these takes. Vocabulary, drill targets and isolated exercise
sentences retain Clear mode. Offline downloads include every dialogue take.

Render with `scripts/render-dialogues.py` and verify with
`scripts/check-dialogues.py`, using the same `.audio-py312` Python. The checker
pins the unchanged Clear manifest, validates all speaker/text/URL mappings,
compares phoneme sequences, and decodes and hashes every recording. Listening
review is still separate from those machine checks.
