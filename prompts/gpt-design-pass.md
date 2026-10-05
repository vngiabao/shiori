# Prompt for the Japanese (GPT) chat: design, navigation and layout pass

Paste the box. It replaces the earlier audit reply's plan: the design pass now comes BEFORE the JLPT corner, and there is no second voice.

```
CHANGE OF PLAN (from me, after a Claude audit of both apps)

1) Priority: design, navigation and layout first. Pause the JLPT-corner work (keep anything already drafted). Do this design pass now, then return to the JLPT corner.

2) One voice only. Ignore the earlier "second VOICEVOX speaker for 聴解" suggestion. Everything, including JLPT listening dialogues, is Violetto's single voice with different moods. In dialogues, name the speaker in the script and on screen (「店員：」「田中：」), and write items so the answer comes from the words, not from telling voices apart.

3) The standard: read ../SHARED-SPEC.md fully (also ../SHIORI-DIRECTION.md sections 3–4). It describes a shared structure for Shiori and its sibling Kiyo (../Chinese). Look at Kiyo's current Today and lesson screens for reference (../Chinese/src/App.tsx, LessonPlayer.tsx, Mascot.tsx, mascot.css), but keep Shiori's own theme, fonts, ornaments, Violetto art and persona. Share structure, not skin. Don't change Violetto's artwork or the database identity shiori-japanese-v1.

4) Batches, in this order. After each batch: tsc, unit tests, content gate, JLPT gate, browser tests with axe, build; then screenshots at 1440/768/375/320 in Morning letter AND Night post. Look at them next to Kiyo's matching screen.

Batch A: Navigation (SHARED-SPEC §1)
- Desktop order: Today · Read · Listen · Speak · JLPT · Practice · Media · Progress. The current page gets a 2px soft-white underline instead of the filled pill. Move the profile initial into Settings.
- Phone tab bar: Today · Read · Listen · Speak · More (Speak is missing today; JLPT moves into More with Practice, Media, Progress, Dictionary, Violetto, Settings). Small Japanese labels under the icons: 今日 読む 聴く 話す ⋯.

Batch B: Lesson focus mode + verdict bar + Violetto bubble (SHARED-SPEC §2–4)
- Hide the site header and nav in lessons, review and exam samples. Use a 60px top bar: "✕ Leave" | lesson title | "3 / 10", with a 3px progress rule underneath.
- Task column 720–760px, starting about 16vh from the top. Eyebrow (FIND / LISTEN / READ / SAY / BUILD / CHOOSE THE REGISTER) + serif heading.
- Choices numbered 1–4 (not A–D); number keys select, Enter checks/continues.
- Remove the big green feedback panel. Add a fixed bottom verdict bar: icon + "Right." / "Not quite." + one evidence line ("Recalled without help." / "Furigana was shown, so this counts as supported.") + the correct answer and replay when wrong + Continue on the right.
- Violetto in the right gutter, at most 48px from the column, 132px tall (96 tablet, 56 phone), feet just above the verdict bar. Reactions appear in a speech bubble: Japanese line (20px Mincho) / kana reading (14px, always shown) / English (14px, at least 4.5:1 contrast) / "Hear Violetto" (44px target). The bubble only appears on reactions and clears on Continue. While idle she has her neutral pose and no bubble. On a phone the bubble collapses to one line; tap it to expand.
- Pose must match the moment. Never use the folded-arms pose for a correct answer (that's what shows now on "Which sound is this?"). Use the celebrate / quiet-delight / letter poses instead.
- Remove the "Violetto" typewriter caption under her.

Batch C: Today (SHARED-SPEC §5)
- Replace the Prussian Violetto panel. Violetto stands on the page at 200px desktop / 140 tablet / 96 phone, inside a 1px gold-hairline arch with no fill, with the same bubble to her left. Keep at least 24px clearance below the header.
- Lead lesson like Kiyo's: a 340–360px square specimen on 原稿用紙 manuscript squares (first kana large, English cue small) directly on the page. Beside it: eyebrow, title, one-line purpose, a kana preview row (か き く け こ), then Begin lesson + Hear it. No card inside a card.
- Remove the lilac correspondence strip. Postmarks become one row in the stats table ("Postmarks · 2 of 8 →"), with a milestone row (human goal, e.g. "First Contact") at the top of that table.
- Plan rows: plain serif numerals (no circles), keep minutes, the → arrows and the 20-min selector.
- Copy: no more than one "little" per screen. Replace "A little Japanese, a little closer." / "A little time, well spent." / "A little reading, a little listening…" with precise lines in Violetto's voice. Propose them to me first in the report.

Batch D: Violetto page (SHARED-SPEC §6)
- /#voice becomes the Violetto page, modelled on Kiyo's Sayo page: hero headline, short persona paragraph, large selected pose with bubble + "Hear this line", then "Her moods": all poses with their line and label, selectable, with "Download this pose".
- Move the voice auditions, VOICEVOX naming, baseline/restore controls and provenance notes to Settings → Voice.

Batch E: Colour and polish (SHARED-SPEC §7)
- Tokens: accent #244f7c → #23467a; violet #655080 → #5a5490; dark-violet #ccb8e4 → #c3bff0. Re-check contrast in both themes.
- One coloured plane per screen (the header, or the verdict bar while it shows). Emerald only on the chosen correct answer and the verdict bar.
- Cormorant only at 22px and above; smaller labels use the UI font.
- Fix the skip link so it appears top-left only on focus.

5) Update DESIGN.md (frontmatter + prose) and the .impeccable sidecar to match, and add "Follows ../SHARED-SPEC.md" to AGENTS.md.

STOP after Batch C. Show me side-by-side screenshots (Shiori vs Kiyo) of Today and a lesson step with a correct and a wrong answer, at 1440 and 375, plus your proposed copy lines. Then wait for my OK before D and E.
```
