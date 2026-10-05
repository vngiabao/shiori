# ChatGPT prompts: Violetto pose fixes and Shiori brand

Paste one box at a time into ChatGPT (image generation). Attach the files listed under each box. Violetto's approved design is locked; these prompts change only the poses and assets named.

---

## Prompt 1: fix five poses in the atlas

Attach: `public/mascot/violetto-atlas.png` (the current atlas).

What's wrong today (seen at thumbnail size):
- **Ribbon side flips.** In row 1 and row 2 the red ribbon is on the viewer's right. In row 3 cells 1 and 3 and row 4 cell 4 it's on the viewer's left (mirrored art).
- **Row 1, cell 2 "listening"** reads as a wave or salute, not listening.
- **Row 3, cell 1 "quiet pride"**: folded arms read as stern or grumpy, which is wrong for Violetto's sincere persona.
- **Row 3, cell 3 "gentle correction"** looks almost the same as row 2, cell 3 "hint" (raised finger).
- **Row 1, cell 3 "speak"** and **row 2, cell 2 "think"** share one silhouette (hand near chest or chin).

```
Edit the attached 4×4 sprite atlas of my character Violetto. Keep EVERYTHING about her design exactly as it is: face, eye shape and colour, honey-blonde bangs and braided side buns, red hair ribbons, Prussian navy cropped jacket, emerald oval brooch with silver frame, white cravat, ivory pleated skirt with brown stripes, brown boots, silver mechanical hands, line weight, flat cel shading, chibi proportions (~2.3 heads), cell size, head size, baseline and transparent background. Do not restyle her.

Change only these cells:
1. Consistency: in EVERY cell the red ribbon and the braided bun must be on the same side as in row 1 (viewer's right). Un-mirror row 3 cell 1, row 3 cell 3 and row 4 cell 4.
2. Row 1, cell 2 (LISTEN): eyes softly closed, head tilted slightly, one gloved hand cupped behind her ear, other hand resting at her waist. Calm, attentive.
3. Row 1, cell 3 (SPEAK): facing slightly to the side, small open mouth mid-word, one hand extended palm-up toward the viewer as if offering the sentence.
4. Row 3, cell 1 (QUIET PRIDE): hands folded neatly in front of her skirt, a small closed-eye smile, a slight polite bow of the head. No folded arms.
5. Row 3, cell 3 (GENTLE CORRECTION): holding an open letter in one hand, pointing with a fountain pen at one line on it, eyebrows slightly concerned but kind.

All other cells must stay pixel-identical. Output the full atlas at the same resolution, transparent PNG, no text, no grid lines.
```

If ChatGPT drifts from the design, generate the five cells one at a time with the same wording and paste them into the atlas yourself.

---

## Prompt 2: one new pose (level up / postmark)

Attach the atlas as the style reference.

```
Using the attached sprite atlas as the exact character reference (same face, hair, ribbons, outfit, line weight, shading, proportions and head size), draw ONE new full-body sprite of Violetto: she presses a brass wax-seal stamp onto an envelope held in her other hand, a small red wax seal visible, eyes gently closed with a quiet satisfied smile. Transparent background, same framing and baseline as the atlas cells, square canvas, no text.
```

This is used for the "level up" or "milestone reached" moment. Kiyo has a level-up pose and Shiori has none.

---

## Prompt 2b: Teacher Violetto pose set (JLPT corner, mission brief 5d)

Attach: `public/mascot/violetto-teacher.png` (the approved teacher pose) **and** the atlas.

```
Create a 4×2 sprite atlas (8 equal cells, transparent background, no text, labels or grid lines) of my character Violetto in her TEACHER look. Use the two attached images as the exact reference: same face, cyan eyes, honey-blonde bangs and braided bun on the viewer's right, red ribbon, Prussian navy cropped jacket, emerald oval brooch, white cravat, ivory pleated skirt, brown boots, silver mechanical hands, plus her teacher items: slim oval glasses, a closed dark folio and a fountain pen. Same chibi proportions (~2.3 heads), line weight, flat one-step cel shading, head size and baseline in every cell. Do not restyle her. She is composed, precise and kind: never angry or smug.

Row 1, left to right:
1. LECTURE: standing upright, fountain pen raised beside her face like a pointer, mouth slightly open mid-explanation.
2. ASSIGN: holding the folio out toward the viewer with both hands, a small polite nod.
3. CHECKING: reading a single sheet of paper held close, one hand adjusting her glasses.
4. TIMER START: holding an open brass pocket watch at chest height, eyes on the watch.
Row 2, left to right:
5. STERN FOCUS: arms folded over the closed folio, steady serious gaze at the viewer, face calm (not cross).
6. PASSED: a small approving nod with a faint closed-eye smile, folio tucked under one arm.
7. MISSED: calm expression, holding an open page and pointing with the pen to one line on it.
8. BREAK: seated on a small wooden chair with a teacup, glasses removed and held in her other hand, relaxed eyes.

Each sprite is one complete full-body figure, centered with generous transparent padding, no crossing cell boundaries. Silhouettes must be distinct from each other at 64 px.
```

Save the generation prompt next to the art as `violetto-teacher-atlas.prompt.txt`, as the existing teacher pose does. The mission brief says to STOP before installing new Violetto art, so review the poses yourself first.

---

## Prompt 3: Shiori brand set

Attach: `public/brand/shiori-mark.svg` exported to PNG, `public/brand/shiori-lockup.svg` exported to PNG, and the atlas (for the portrait).

Recommended system (the same structure as Kiyo's):
- **Favicon 16/32:** the existing bookmark-S mark. A face can't be read that small.
- **App icon 180/192/512/1024:** a Violetto portrait tile (head and shoulders: eyes, bangs, ribbon), the twin of Kiyo's Sayo portrait tile.
- **Wordmark:** keep the current lowercase "shiori" with bookmark dots.
- **Hero / OG 1200×630:** Violetto holding a sealed letter beside the wordmark.

```
Design an app icon for "Shiori", a Japanese-learning app whose companion is Violetto (attached atlas: use her exact face, hair, red ribbon and jacket; do not restyle her). Square 1024×1024 tile, Prussian navy background (#1b2d4a) with a very subtle paper texture, a tight head-and-shoulders crop of Violetto in 3/4 view: cyan eyes, honey-blonde bangs, braided bun and red ribbon clearly visible, emerald brooch just at the bottom edge. Keep a 10% safe margin all round so it survives circular and rounded-square masks. It must still read at 60 px: simple shapes, strong eye contrast, no small details, no text, no border.
```

```
Create a 1200×630 social/OG image for "Shiori". Left 55%: Violetto (exact design from the attached atlas, full body, chibi, not restyled) standing and holding out a cream envelope with a red wax seal. Right: the attached "shiori" wordmark in soft white, and beneath it in small text: "Japanese, one letter at a time." Background: Prussian navy #1b2d4a with a faint ivory paper grain and one thin gold rule. Calm, elegant, not busy. Leave the wordmark exactly as supplied.
```

After generating: trim to one shared frame, export to WebP for the app (keep the PNG originals), save each prompt next to its file as `.prompt.txt`, and update `public/brand/README.txt`. Run a trademark search before any public launch.

---

## Prompt 4 (optional): a Violetto line for each new moment

Paste into a text chat, not image generation.

```
Violetto is a composed, precise, sincere letter-writer (Violet Evergarden-inspired) who teaches Japanese. Her own speech is natural polite Japanese: never scolding, never gushing. Write one short line (≤14 characters of Japanese where possible) for each moment below, as: Japanese | kana reading | natural English | pose | voice mood (clear teaching / composed welcome / warm reassurance / restrained pride / precise correction / reflective rest).
Moments: listen, speak, quiet pride, gentle correction, milestone reached, mission passed, mission partly passed, coming back after a week away, subtitle-free clip finished, keigo used correctly.
Teacher moments (JLPT corner, "lecture" mood: slower, firm, polite です/ます): entering the study hall, mock exam started, five minutes left, section below its minimum, all sections at or above minimum (do not say "passed"), returning to a weak area, exam day approaching.
Avoid guilt, exclamation-heavy praise and anything implying JLPT level or fluency.
```

Put the results in `content/voices/violetto.json` (the persona file), then render the audio with the existing VOICEVOX pipeline.
