# Violetto: characterization and performance research

Researched 7 October 2026. This is a teaching adaptation informed by official
material, with original Japanese reaction wording. It is not an episode
transcript, a collection of copied dialogue or a measured recreation of an
actor's voice. The approved Shiori timbre remains VOICEVOX:冥鳴ひまり, style 14.

## What the primary material actually supports

The film's [official character biography](https://violet-evergarden.jp/character/)
describes a former soldier who becomes a letter writer to understand the
meaning of love. Working with other people's feelings changes her. Duty and
precise language are a starting point; emotional growth is central to her
character. A teacher adaptation should preserve her attentiveness to what a
person is trying to communicate, rather than merely decorating generic praise
with postal vocabulary.

The [official World Tour report](https://tv.violet-evergarden.jp/special/worldtour/)
records both Yui Ishikawa's account of the first episode's limited emotional
understanding and the artists' intention to show gradual growth through
delicate performance and expression. Ishikawa also describes revising an
initially more emotional performance for the early story. That direction is
about where the story starts, not a requirement that every later version of
Violet remain flat. For Shiori, small visible and audible changes should
communicate attention, relief, pleasure and resolve without constant dramatic
acting.

Producer Shinichirō Hatta's [official film interview](https://violet-evergarden.jp/special/interview/)
contrasts her earlier tendency to act without understanding her feelings with
her later ability to consider other people's feelings before acting. He also
connects her understanding of herself to stronger emotion. Shiori therefore
uses a later, more empathetic interpretation: controlled speech with genuine
feeling when there is a reason for it. Everyday instructional feedback should
not borrow the emotional scale of the film's climactic scenes.

Kana Akatsuki's [official anniversary interview](https://www.kyotoanimation.co.jp/books/violet/special/10th/interview01/)
discusses human emotional ambiguity, the effort to move toward something good,
and the different kinds of love that bring the story together. This supports
an adaptation built around patient understanding rather than infallible
authority. The author also discusses varying the rhythm and stiffness of
different stories. That is a writing observation, not an acoustic specification
for the anime voice; no precise pitch or speed numbers are inferred from it.

## The teacher we are adapting

Violetto is diligent, attentive, formal and occasionally very literal. She
wants the learner's words to reach their meaning. She follows the evidence,
offers a correction directly and takes satisfaction in a carefully found
answer. When she is pleased, it should be audible. When she is concerned, she
becomes gentler, not disappointed in the learner. Brief self-directed humour
may reveal that she is still learning how to teach and express herself.

These are design inferences for a Japanese tutor, not claims that Violet has
this profession in canon. The app does not introduce invented biography,
romantic dependence, military discipline for mistakes or a lecture about
emotion after every answer.

## Language and length

Use polite Japanese as the default, with occasional short elliptical clauses
that remain respectful. A routine acknowledgement can be a single clause.
An arrival, difficult moment or completed session can earn a fuller sentence.
Respectful does not mean every line needs an auxiliary instruction, an apology
or a ceremonial ending.

Original examples in the authored library:

- Delight: `お見事です！` — brief, engaged praise, then composure.
- Confirmation: `ええ、正解です。` — assured and conversational.
- Correction: `もう一度。` — calm firmness with room for the learner to think.
- Reassurance: `大丈夫。直せます。` — useful help rather than pity.
- Assistance: `次は、助けなしで。` — acknowledges the supported context.
- Return: `お帰りなさい。` — welcoming, without guilt about an absence.

These examples were written for Shiori; they are not attributed as quotations
from the show. Longer retained messages provide reflection and a little postal
imagery. English translations use natural contractions rather than repeated
"Let us". General reactions do not invent a specific error, pronounce a learner
fluent, or claim that one supported answer proves mastery.

## Six deliveries, one identity

Clear remains the pronunciation and vocabulary target. The reaction library
uses five expressive directions, for six overall modes:

- **Composed:** confident, attentive, an economical acknowledgement.
- **Warm:** audible reassurance and welcome, softer connected phrasing.
- **Proud:** a brief, brighter burst of pleasure; a larger melodic range and
  quicker pauses, still using formal wording.
- **Precise:** direct teacher focus; crisp distinctions without scolding.
- **Reflective:** thoughtful and unhurried, mainly for rest and closing.

Native reaction pace stays within 0.96–1.04. Emotional pitch-centre offsets
stay within ±0.5 semitone. A semitone measures pitch, not speed. Intonation
range is a separate control: proud delivery can have a more expressive contour
without moving the entire voice far from its usual register. The pinned
[VOICEVOX Core implementation](https://github.com/VOICEVOX/voicevox_core/blob/0.17.0/crates/voicevox_core/src/engine/talk/interpret_query.rs)
transforms log-F0; the renderer converts centre offsets accordingly. Pauses,
intonation and cadence are changed before synthesis. Finished WAVs are not
pitch shifted or time stretched, and playback remains at rate 1.

VOICEVOX's normal style is not an emotion-conditioned character actor. These
controls give measurable prosodic variety, but cannot certify perceived joy,
an exact fictional-character match or native pronunciation. The audition page
lets the owner hear the actual results. No actor recordings were used.

## Dialogue roles and difficulty

The same timbre performs all twelve roles. Yui has a brighter centre, a larger
pitch range, brisk connected clauses and shorter pauses. You has a lower
centre, a smaller range and a more deliberate cadence. Their centre offsets
are +0.5 and -0.5 semitone respectively, not different voices. Ren, Hana,
Satō and the later cast have consistent separate delivery settings.

Scene difficulty multiplies each role's cadence; it must not overwrite it.
An authored 1.2 scene therefore keeps the ratio between Yui and You while
making both faster. The final native speed is bounded at 1.25. Existing
authored N3–N1 scene speeds remain authoritative. Vocabulary and isolated
drills do not inherit a character's delivery. Names remain visible: these
subtle changes help tracking but do not guarantee listeners can identify
twelve people solely by ear.

## Lexical accent is not emotional pitch

The [Japan Foundation's accent explanation](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/research/202503.html)
describes Tokyo `雨` with a drop after the first mora and `飴` with no lexical
drop. Isolated examples commonly show high–low and low–high contours. The
article also explains why absolute high/low patterns vary in connected speech:
the drop is the important lexical feature.

The previous synthesized examples both rose within あめ, despite different
files and accent metadata. The replacement uses explicit two-mora queries
and opposite pitch targets before synthesis, with equal, steady vowel segments
and the voice's mean pitch preserved. Both the Listen comparison and tapped words use
their written lexical keys, rather than collapsing to a shared あめ recording.
This is a source-informed isolated illustration, not a pronunciation score
or a claim that every あめ in every sentence must follow the drawn steps.

## Art and integrity

The Chinese app's `sayo-direction.json`, `generate-sayo-range.py` and
`voice-task-mapping.md` were inspected as local implementation references.
Useful patterns are one stable identity, separate clear drill delivery,
different dialogue moods and complete task-to-audio coverage. Sayo's dry
teasing, dramatic register jumps and finished-audio resampling are not Violetto's
performance direction. Shiori uses named role settings and native query
controls, retaining its approved Japanese model rather than importing that
Mandarin voice pipeline.

Use the established welcome, proud, celebrate, encourage, review, hint,
think, politeness, levelup, keepgoing and tea poses. These already support
the intended contexts; this pass does not need new artwork or stronger
continuous animation. Preserve the approved vector artwork and layout.

Every selected message owns its text, ruby, translation, mood, pose and WAV
mapping. Replay keeps that selection. Dialogue assets resolve by scene ID,
line index, text and speaker. New WAV URLs are content hashes; all historical
files remain unchanged. Coverage, hashes, phonemes, decoded audio and pitch
direction can be checked mechanically. Human perception and naturalness
remain separate checks, and are not reported as passed merely because a
render completed.
