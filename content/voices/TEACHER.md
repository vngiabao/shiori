# Violetto's teacher voice

The approved voice is retained: VOICEVOX Core 0.17.0, VVM 0.16.4, style 14.
There are 100 original teacher messages across ten contexts and five acted
moods, alongside Clear pronunciation delivery: six modes altogether.
The research and the distinction between canon and teacher adaptations are
in [VIOLETTO-RESEARCH.md](VIOLETTO-RESEARCH.md). Wording and translations are
AI-assisted drafts, not quotations or a claim to reproduce an actor's voice.

Violetto is formal, attentive and politely literal. Her later empathy and
emotional growth inform this teacher: joy can be audible and sincere without
becoming noisy. Corrections name what to try, and humour concerns her own
teaching duties. A correct answer is not proof of mastery; supported answers
remain explicitly supported. Returning after an absence attracts no guilt.

## Reactions

The source is `reaction-lines.tsv`; the personality brief is
`teacher-persona.json`. This refresh rewrites 58 messages. Of the final 100,
57 recordings are at most 2.5 seconds, 40 are between 2.5 and 4.5 seconds,
and three are longer. The mean falls from 3.38 to 2.44 seconds.
Brief praise such as お見事です！ has room alongside thoughtful longer guidance.

Each context shuffles without repetition until its bag is exhausted and
avoids repeating the previous bag's last message. Bubble, translation,
existing pose and recording share the same selection. Replay preserves it;
muting speech still varies the written message. Artwork and layout remain.

Native query controls shape delivery before synthesis. Global pitch-centre
offsets stay within ±0.5 semitone, native pace scales within 0.96–1.04, and
intonation within 0.86–1.45. Proud delivery uses a livelier contour and shorter
pauses; reflective delivery leaves more space. These controls do not stretch
or pitch-shift finished WAV files. The approved timbre remains the same.

The ten hiragana/katakana vowel clips are unchanged in this refresh: exactly
one explicitly voiced mora, no consonant or suffix, with a 0.30-second vowel
segment. These pronunciation targets are not randomly acted. Query, signal
and mapping checks cannot establish how a human hears every vowel.

## Dialogue speakers and difficulty

All 1,695 installed dialogue lines have speaker-specific takes. Twelve roles
use the same style-14 voice. Yui has a brighter centre (+0.5 semitone), quicker
phrasing and shorter pauses; You has a lower centre (-0.5 semitone), more
deliberate phrasing and longer pauses. Every role keeps its established cast
identity in `dialogue-speakers.json`.

Authored scene speed now multiplies the speaker's base pace instead of
replacing it. Final native scene speed is bounded to 0.96–1.25. Difficulty
therefore changes tempo without discarding speaker differences. This is a
perceptual delivery aid, not a second voice model or a proficiency score.

`src/dialogueAudio.ts` resolves dialogue ID and line index while checking
speaker and text together. Lesson scenes, replays and Watch course samples
use these takes. Vocabulary and drill targets remain in Clear mode.

## Lexical pitch contrasts

Tokyo Japanese rain 雨 and candy 飴 have explicitly separate pronunciation
queries and files. Rain drops after its first mora; candy has no lexical
downstep. The isolated examples use high–low and low–high contours; sentence
context can change the starting height. See `pitch-contrasts.json` and the
Japan Foundation source cited in the research brief.

Each vowel segment lasts 0.18 seconds before native synthesis. Measured
vowel-centre F0 falls about 4.46 semitones in the rain WAV and rises about
4.11 semitones in the candy WAV. These lexical contours are independent of
the ±0.5-semitone emotional pitch-centre limit. Tapping either written word
also selects its own recording instead of collapsing both onto あめ.

## Reproduction and validation

Use the local `.audio-py312/Scripts/python.exe` interpreter with:

    scripts/render-pitch-contrasts.py
    scripts/render-teacher.py
    scripts/render-dialogues.py --incremental
    scripts/render-cast.py
    scripts/check-pitch-contrasts.py
    scripts/check-teacher.py
    scripts/check-dialogues.py
    scripts/check-cast.py
    scripts/check-lesson-audio.py
    scripts/check-emotions.py
    scripts/check-course-preservation.py --base c7366e3 --voice-refresh

Then run the TypeScript, unit, audio-mapping and production build checks,
and browser tests for teacher messages, cast, dialogue, pitch and navigation.
The preservation comparison intentionally uses the pre-refresh commit.

Content-addressed WAV URLs retain old recordings for previously cached
clients. Current and historical records remain in provenance. The lesson
manifest changes only the two authorised pitch contrasts; other Clear
recordings remain byte-identical. Every installed word, dialogue, practice
sentence and complete reading must have a real mapped file.

Audio caches on first playback, with an optional full offline download;
this refresh does not add up-front audio precaching. Hashes, decoding,
phoneme sequences and native controls are machine checked. Human listening
review remains separate from those checks.
