# Violetto: eight more poses for the interactive touches

Attach **`public/mascot/violetto-atlas.png`** to ChatGPT as the style reference, then send the prompt below. Save the result as **`violetto-atlas-2.png`** in `public/mascot/` (or just send it to Claude); Claude converts it to WebP, wires each pose and keeps the original as provenance.

What each pose is for:

| Pose | Used when |
|---|---|
| peek | You reveal romaji, a reading or the transcript: she covers her eyes and peeks through her fingers (today she sips tea with eyes closed). |
| bow | Keigo lessons, "thank you" moments, and greeting you by name after you type it on the welcome screen. |
| doze | You've been idle for a while, or come back after days away: she has nodded off at her desk. |
| stamp | The end of a lesson: she presses the 済 seal onto your letter (today the seal lands on its own). |
| startle | You poke her five times, or a fast-run streak breaks: a small surprised hop. |
| wave | Leaving a lesson, and the evening greeting on Today. |
| glance | She watches the pointer: a sideways glance used when you're far to one side of the screen. |
| point | She points at the next thing to do (an unopened letter, the Begin button). |

## Prompt (copy everything in the box)

```
Create a single game UI character sprite atlas, 4 columns by 2 rows, exactly eight evenly spaced cells, TRANSPARENT BACKGROUND. No text, labels, grid lines, symbols, watermarks or backdrop. Use the attached atlas as the strict style reference: the same character Violetto, the same chibi proportions (about 2.3 heads tall), the same head size, line weight, colours, cel shading and framing as that sheet, so the new cells can sit beside the old ones without any visible difference.

Same consistent character in every cell: petite slender chibi woman, small narrow face framed by honey-blonde bangs and braided side buns, red hair ribbons, large quietly expressive cyan blue eyes with half-lidded upper eyelids, tiny mouth, Prussian navy fitted cropped jacket, emerald oval brooch with silver frame and white cravat, ivory pleated skirt with brown stripes, brown ankle boots, silver mechanical hands. Crisp dark navy outlines, flat vector-like shapes with restrained one-step cel shading, no gradients, no plush or wide body, no huge round cheeks.

Each cell has exactly one complete full-body sprite, centered with generous transparent padding, identical head size, same baseline as the reference sheet, nothing crossing cell boundaries.

Row 1 left to right:
1. PEEK: both silver hands raised over her eyes, fingers slightly parted so one cyan eye peeks through, small embarrassed blush, standing straight.
2. BOW: a polite formal Japanese bow, upper body bent about 30 degrees forward, hands folded in front of her skirt, eyes closed, serene.
3. DOZE: sitting on the same wooden chair as the teacup pose, head resting on her folded arms on the same small round wooden table, eyes closed, peaceful, a single small sealed envelope on the table.
4. STAMP: standing, pressing a small wooden-handled red seal stamp down onto a letter held against her other palm, focused determined eyes.

Row 2 left to right:
5. STARTLE: a small surprised hop, both feet just off the ground, hands up near her shoulders, eyes wide, tiny open mouth, two small sweat marks like the flustered pose in the reference.
6. WAVE: one silver hand raised in a gentle wave, the other holding a sealed letter at her side, soft closed-mouth smile.
7. GLANCE: body facing forward but head and eyes turned to her left (viewer's right) in a curious sideways glance, hands clasped in front.
8. POINT: one arm extended pointing to her left (viewer's right) with the index finger, the other hand holding an open letter, helpful expression.

High resolution 2:1 atlas (for example 1254 x 627), each cell the same size as one cell of the reference sheet. Clean true alpha.
```

## If something comes back wrong

- **Proportions drift** (bigger head, rounder body): reply "Match the head-to-body ratio and line weight of the attached reference exactly; regenerate."
- **Background not transparent:** reply "Same image, transparent background, no backdrop."
- **Cells uneven:** reply "Keep exactly 4 by 2 equal cells, one centered sprite per cell, same baseline."
