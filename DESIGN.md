---
name: Shiori — Japanese with Violetto
description: Violetto correspondence, a visible companion, and a little Japanese each day.
colors:
  paper: "#edf1f7"
  card: "#faf9f6"
  rule: "#cbd4e1"
  ink: "#1f2a44"
  ink-2: "#4a5470"
  ink-3: "#60677a"
  accent: "#23467a"
  accent-wash: "#dfe8f3"
  on-accent: "#fff"
  ribbon: "#a8323e"
  honey: "#c9a15a"
  navy: "#1f2a44"
  good: "#1f6b57"
  good-wash: "#e1eee8"
  brand-deep: "#172c49"
  brand-stage: "#274769"
  brand-on: "#f7f5f1"
  brand-soft: "#d6e2f0"
  brand-line: "#8298b2"
  brand-art: "#405e80"
  violet: "#5a5490"
  violet-wash: "#e9e3ef"
  metal: "#e2c07f"
  dark-paper: "#121b2e"
  dark-card: "#1a2540"
  dark-rule: "#2e3a58"
  dark-ink: "#f1f4f9"
  dark-ink-2: "#c8d4e5"
  dark-ink-3: "#aebdd0"
  dark-accent: "#9fc5ee"
  dark-accent-wash: "#233a56"
  dark-violet: "#c3bff0"
  dark-violet-wash: "#332b46"
  dark-on-accent: "#121b2e"
  dark-good: "#5fb79a"
  dark-good-wash: "#213e40"
  dark-ribbon: "#e0727c"
  dark-honey: "#e2c07f"
typography:
  display:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "clamp(40px, 4.7vw, 65px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.1
  body:
    fontFamily: '"Source Sans 3", sans-serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: '"Source Sans 3", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  japanese-reading:
    fontFamily: '"Noto Serif JP", serif'
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 2.5
  letter-meta:
    fontFamily: '"Courier Prime", monospace'
    fontSize: "10px"
    fontWeight: 400
    letterSpacing: "0.7px"
  today-display:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "clamp(40px, 4vw, 58px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  companion-name:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "27px"
    fontWeight: 500
    lineHeight: 1.2
  companion-japanese:
    fontFamily: '"Noto Serif JP", serif'
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.65
  companion-meaning:
    fontFamily: '"Source Sans 3", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  companion-reading:
    fontFamily: '"Source Sans 3", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  lesson-heading:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "clamp(34px, 3.5vw, 48px)"
    fontWeight: 500
    lineHeight: 1.12
  welcome-display:
    fontFamily: '"Cormorant Garamond", "Noto Serif JP", serif'
    fontSize: "52px"
    fontWeight: 500
    lineHeight: 1.04
  lesson-meta:
    fontFamily: '"Source Sans 3", sans-serif'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "8px"
  field: "5px"
  panel: "16px"
  path-current: "14px"
  portrait-arch: "100px 100px 12px 12px"
  bubble: "14px"
  notice: "6px"
  overlay: "12px"
  register: "20px"
  audio: "30px"
  seal: "50%"
spacing:
  compact: "8px"
  control-gap: "12px"
  action-gap: "16px"
  section-gap: "24px"
  panel: "30px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "11px 23px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 23px"
  button-audio:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.audio}"
    padding: "8px 14px"
  button-audio-hover:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
  field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 14px"
    width: "100%"
  register:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.register}"
    padding: "3px 10px"
  notice:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.notice}"
    padding: "18px 22px"
  letter-paper:
    backgroundColor: "{colors.card}"
    padding: "34px 40px"
  dialog:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.overlay}"
    padding: "30px"
  seal:
    backgroundColor: "{colors.ribbon}"
    textColor: "{colors.paper}"
    rounded: "{rounded.seal}"
    width: "84px"
    height: "84px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-secondary-hover:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
  companion-bubble:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "14px"
    width: "280px"
  today-lesson:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "0"
  postcard:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px 28px"
  button-welcome:
    backgroundColor: "{colors.brand-on}"
    textColor: "{colors.brand-deep}"
    rounded: "{rounded.control}"
    padding: "11px 23px"
    width: "100%"
  navigation-active:
    backgroundColor: "transparent"
    textColor: "{colors.brand-on}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 13px"
---

# Design System: Shiori — Japanese with Violetto

## Overview

**Creative North Star: "Violetto correspondence."**

Blue framing, a cool blue desk and soft white reading paper make Japanese study feel like correspondence shared with Violetto. Upright classical headings and airy Japanese Mincho retain the letter-world character. The latest user preference makes blue predominant, adds small ribbon-red details and permits muted violet correspondence accents. It supersedes the earlier emerald/ivory direction and blanket purple prohibition; the original kickoff remains character inspiration, not absolute palette authority.

Violetto is a visible study companion: prominent on arrival and Today, then quieter around active reading and retrieval. Her confirmed atlas, blonde braids, blue eyes, navy coat, ivory skirt, emerald brooch and red ribbons remain intact. Shiori / 栞 remains provisional. The visual revision preserves course content, persona, audio behavior and persistence identity (`shiori-japanese-v1`, `shiori-japanese`, `shiori-reply-`). The implementation is code-led; the direction is user-requested, but no pixel composition or new artwork was approved.

**Key Characteristics:**

- Blue brand planes and actions, cool paper, muted violet correspondence accents, ribbon-red details and tiny gold ornaments.
- A prominent, static-pose companion with contextual speech and an accessible voice action.
- Distinct desk, specimen, letter, listening and postmark surfaces, with Japanese leading during practice.
- Upright serif headings, practical sans-serif controls and honest learning evidence.

Structure follows `../SHARED-SPEC.md`. The 5 October 2026 Claude pass (user-approved) restored Violetto's Prussian-blue Today panel, replaced the bubble-collision layout with a task column plus companion column, added the kana-teaching desk and furigana/romaji companion lines, and applied the palette rule below. Today's heading is "Your next letter is ready."; page titles are plain nouns in Violetto's precise voice (Reading., Listening., Review., Progress.).

## Colors

The normative frontmatter mirrors semantic colors in `src/styles.css`; `src/violet-theme.css` supplies the brand composition and `src/study-layout.css`, imported last, owns focus mode, the kana desk, Violetto's bubble and panel, and Today. **One coloured plane per screen:** the Prussian header plus, on Today, Violetto's panel; everything else is paper, ink and jewellery-sized accents (ribbon red, emerald, gold, violet).

### Primary

- **Action blue — accent / accent-wash / on-accent:** primary actions, links, selected controls and support notices. The wash is pale blue in Morning letter and deep blue in Night post.
- **Prussian blue — brand-deep / navy:** the header and mobile navigation anchor the full interface.
- **Companion blue — brand-stage:** Violetto's Today panel and the welcome and correspondence-level panels. `brand-on` carries principal text and the desktop current-page underline, `brand-soft` furigana, romaji and supporting text, `brand-line` the arch outline and panel button border, `brand-art` the panel button hover. These brand-plane colors remain fixed across both themes.

### Secondary

- **Muted violet — violet / violet-wash:** a blue-violet (`#5a5490`, night `#c3bff0`) for correspondence accents outside Today; Today uses a ruled postmarks row instead of a coloured strip.
- **Emerald success — good / good-wash:** correct answers, positive verdicts and secure kana. These success tokens remain emerald and are distinct from blue interaction and support tokens. Violetto also retains her emerald brooch.
- **Ribbon red — ribbon:** postcard envelope details, wrong answers, errors and completion seals. Written feedback accompanies the color; desktop navigation no longer uses ribbon as its current-page marker.

### Tertiary

- **Warm metal — metal:** high-contrast fine accents and focus outlines on Prussian blue planes.
- **Honey gold — honey:** fine postal highlights drawn from Violetto's hair and antique metal details. Avoid gold body text on light paper.

### Neutral

- **Cool blue desk — paper:** the light canvas; its dark counterpart is deep navy.
- **Reading paper — card:** soft white lesson and reading surfaces; blue paper in Night post.
- **Fine rule — rule:** field boundaries, reading divisions and separators.
- **Prussian ink — ink / ink-2 / ink-3:** primary reading, supporting explanations and metadata, with lighter counterparts in Night post.

**The Color Has a Job Rule.** Blue identifies the app and its actions; muted violet marks correspondence; emerald marks successful learning; ribbon marks small postal details, errors or seals. Support reveals do not become success merely because they have a colored background.

The root's `data-theme="dark"` switches semantic tokens to the frontmatter's `dark-` counterparts. Theme choice is stored in the profile and defaults to light. Use CSS variables so component behavior remains coherent in both themes; brand-plane text uses its own soft white and pale blue foregrounds.

## Typography

**Display Font:** Cormorant Garamond with Noto Serif JP and serif fallbacks. **Body Font:** Source Sans 3 with sans-serif fallback. **Japanese Font:** Noto Serif JP. **Letter Accent:** Courier Prime with monospace fallback. All are self-hosted through `@fontsource`; Cormorant and Source Sans load 400/500/600, Noto Serif JP and Courier Prime load 400. Font synthesis is disabled.

The aliases `--font-display`, `--font-japanese` and `--font-ui` retain these families. The frontmatter records base and recurring surface roles, not an enforced universal type ratio. Upright headings contrast with practical UI labels; paragraphs are capped at 70ch. Japanese reading has generous line height and semantic ruby at 0.4em. Romaji remains removable support, and decorative typewriter marks never substitute for instructional text.

Today's heading is `clamp(40px, 4vw, 56px)` (38px phone); the lesson title `clamp(34px, 3.4vw, 46px)`; the manuscript glyph 150px (120px tablet and phone). Focus-task headings are `clamp(30px, 3vw, 40px)` (28px phone) with no eyebrow. Kana meeting: 248px stroke sheet, 56px romaji in the display face, 17px memory aid. Quiz glyph prompts are 96px (80px phone). Violetto's lines are Mincho with furigana over kanji only (ruby at 0.5em) and a romaji line instead of a second all-kana line: 21px in the Today panel, 18px in the lesson bubble, 22px in reaction lines. `body` uses lining numerals so Cormorant figures read as 1 and 0, not I and O.

Welcome retains 52px display type, then 38px at 767px and 40px at 360px. Its form heading is 44px on desktop and 36px at 767px. General page headings retain their existing responsive roles. These are surface hierarchies, not a universal type ratio; the broader Batch E typography pass is deferred.

Reading letters retain the 28px Japanese role, increasing to 30px in the tablet reader before using 25px and 2.7 line height on phones. UI metadata commonly uses 12–16px beneath the 17px body role; do not claim all text has a 17px minimum.

**The Language First Rule.** Preserve readable Japanese, ruby spacing and explanation hierarchy before allocating space to companion art, stamps or metadata.

## Layout

The centered main shell is capped at 1256px. At desktop size its padding is 38px 38px 80px; horizontal padding reduces to 30px at 1100px. The header is 78px, becoming 68px at 600px. The recurring spacing values in frontmatter are observed literals, not an enforced spacing-variable scale.

Today: a 340px Violetto panel spans the right column (300px on tablets); the introduction and lead lesson stack on the left with a 40px by 56px gap. On phones the order is introduction, lead lesson, then the compact panel (96px arched portrait beside her line).

The lead lesson sits directly on the page: a 300px manuscript square (quartered by faint guides, first kana inside, romaji cue below) beside the title, a plain metadata line (lesson n of m, kind, minutes; no eyebrow), the purpose, a kana preview row and Begin lesson / Hear it. No card surrounds it.

Focused lessons, review and JLPT samples hide site navigation. A 60px top bar holds Leave, centred title and count; a 3px accent progress rule follows. On desktop the body is a grid: a task column up to 720px and a 200px companion column with a 56px gap. Violetto (140px) is sticky at the top of her column and her reaction bubble appears directly beneath her, tail pointing up, so she never covers an answer and no collision measurement is needed. Below 1100px she moves into normal flow after the task (96px tablet, 64px phone) with the bubble to her left. The verdict sheet is fixed to the bottom. JLPT samples retain their teacher artwork and timed sample behaviour.

Daily plan and letterbox use a secondary two-column layout on wide screens, stacking at 900px and below. Welcome pairs a Prussian blue illustrated letter with the entry form, stacking at 767px. Its phone portrait area compacts to 155px and a pale “Begin with Violetto” action appears directly after the title. This action and the original start action both open the name form and move focus into the name field. Introductory prose and the signature remain available; decorative 言葉 stays on one line. Reading retains a spacious letter and glossary/reply structure; lesson, listening, voice audition and postmark album have task-specific compositions. None is a mandate to copy Today's board everywhere.

At 850px the desktop links give way to a fixed bottom bar for Today, Read, Listen, Speak and More, with safe-area padding and footer clearance. At 900px selected reading words can open a nearby fixed meaning panel with listening and dismiss controls. At 600px main padding is 26px 20px 50px; at 360px the side padding is 16px. Review widths of 1440, 768 and 375px are evidence viewports, not CSS breakpoints. The older 1500px top-padding rule is superseded by the final theme. The focus shell has its own spacing and phone rules at 767px.

## Elevation & Depth

Tonal planes establish most depth: a cool blue desk, soft white reading sheet and Prussian blue companion. A diffuse blue ambient shadow lifts reading paper and transient surfaces, with the darker counterpart in Night post. Today's lesson, manuscript specimen and ruled reading teaser stay flat; Violetto's panel is a flat tonal plane. The reaction bubble uses `0 8px 24px #07152b14`; the verdict sheet `0 -10px 30px #07152b10`.

## Shapes

The current character-led design uses `control` corners for main actions and `panel` corners for Violetto's Today panel and the retained welcome, postcard and album containers. Fields and icon controls retain the smaller `field` corners, notices use `notice`, and dialogs/More use `overlay`. Reaction bubbles use 14px corners. Reading sheets, the manuscript square and the stroke sheet stay rectangular.

Violetto's portrait sits in an open arch (half-width upper corners, no bottom edge) drawn in `brand-line` inside her panel, echoed by circular seals. The current learning stop uses the `path-current` shape. These exceptions are assigned to actual component roles.

## Components

### Buttons

Primary actions use blue, readable on-accent text, semibold UI type, a 49px minimum height and 11px 23px padding. Today’s lesson actions have a 48px minimum height with 16px text on desktop; phones use 10px 16px padding and 15px text. The compact welcome quick-start reverses the brand-plane colors: brand-on background with brand-deep text. Hover changes the main fill to ink and foreground to paper; secondary hover uses the accent wash and accent text. The inherited brightness filter remains 1.08 for enabled buttons. Background and transform transitions use 160ms with the shared ease-out curve.

Focus uses a 2px accent outline with 5px offset; Prussian blue brand planes substitute metal. Pointer press scales buttons to 0.97, while keyboard focus plus active suppresses it. Disabled primary buttons keep full opacity with an accent-wash fill and ink-3 text, so they read as waiting rather than broken. Text actions ordinarily have a 44px minimum height.

### Audio and language support

The outlined audio pill pairs an icon with a visible label and uses accent wash on hover. Playback errors appear nearby in ribbon. Selecting a word highlights it and reveals a gloss without silently counting as unaided retrieval. **Stroke order** (`Stroke`, KanjiVG centre-lines) draws each stroke along its own path with WAAPI `stroke-dashoffset` (about 7ms per unit of length, minimum 240ms, 160ms between strokes, eased in-out) over a pale ghost of the finished character on a quartered manuscript square, with ribbon-red start numbers. It plays automatically when a kana is first met and on demand from "Watch the strokes"; reduced motion shows the finished character. This is instructional motion, separate from decorative UI feedback.

### Paper, notices and chips

Today’s next lesson has a transparent, ruled manuscript specimen and a clear lesson action. Its plan rows use plain serif numerals, retain the minute selector, duration and arrows, and sit beside a ruled reading teaser and stats. Stats include the human goal, correspondence level, optional streak, review due, distinct single-character kana/kanji recalled unaided and linked postmarks count; no separate correspondence strip remains. Reading paper remains rectangular with spacious padding and semantic ruby. The postcard uses a rounded accent-wash surface with typewriter metadata, blue Japanese and a ribbon-red envelope detail. Register chips identify actual language register; support notices use the accent wash with blue emphasis. Positive verdicts and secure kana use emerald success tokens, with separate written feedback.

### Inputs and dialogs

Fields use reading-paper fill, a fine rule border, 12px 14px padding and a 48px minimum height. Textareas begin at 120px and resize vertically. Labels precede fields; caret, checkbox and radio accent use blue. Native dialogs use reading-paper fill, overlay corners, a maximum width of `min(550px, calc(100vw - 30px))` and a 90vh cap. Preserve Escape/backdrop dismissal, restored focus and a named close action.

### Navigation

The Prussian blue desktop header orders Today, Course library, Read, Listen, Speak, JLPT, Practice, Media and Progress. Its current destination uses a 2px soft-white underline over transparent fill; links remain 44px high. More, Search and Settings remain on the right, with the profile initial in Settings. At 851–1250px the destination links occupy a second header row to preserve space. The phone bar contains Today, Courses, Read, Listen, Speak and More, with Japanese labels 今日 / 授業 / 読む / 聴く / 話す / ⋯. Courses opens the same Course library page, with its N5–N1 and keigo filters. More is available on both desktop and phone, containing JLPT, Practice, Media, Progress, Letters, Beyond the course, Dictionary, Settings, Violetto, Postmark collection and Violetto's voice. Its scrollable paper panel closes on a route selection, outside click or Escape; Escape restores focus to the trigger. The existing phone active-state treatment is retained. Lessons, review and active JLPT samples suppress both navigation surfaces. Preserve the skip link, named icon actions and pressed states for reading controls; those controls are button groups, not incomplete tabs.

### Focus tasks and verdicts

Choices are numbered 1–4. Selection is separate from Check; number keys select and Enter checks or continues in lessons and review. Text answers use 58px minimum rows; kana and recall choices use a four-column glyph grid, changing to two columns on phones. JLPT samples use number keys to record selections and Enter to advance or submit, preserving their exam scoring flow.

Lesson feedback is a fixed paper sheet at the bottom: a 3px top edge in emerald (right) or ribbon (not quite), a filled state icon, "Right." or "Not quite.", one evidence line (unaided, or which support was shown) and Continue. Wrong answers also show the correct answer and a replay action. The inner width is 976px. A 200ms entrance becomes opacity-only under reduced motion. Kana lessons alternate sight to sound and sound to sight (hear, then pick the kana); the second is stored as listening evidence. Wrong options come from the same kind of item, look-alikes first (あ is tested against お and め).

### Shiori identity

The user approved the reserved Violetto writing logo on 2026-10-05. A composed chibi Violetto writes a short fountain-pen flourish beside the substantial lowercase serif shiori wordmark. Preserve the neutral mouth, restrained eyes, blonde braid, navy coat, red ribbon and exactly two mechanical hands. `public/brand/shiori-signature.svg` contains actual traced vector paths, with no embedded raster or font. Its inverse changes the lettering to warm white while preserving character colors. The icon uses the same vector face. The old bookmark-S identity remains archived, not active.

`Brand` links to Today with the accessible name “Shiori home”; its two decorative images select one visible lockup through theme and header styles. Use primary on light paper and inverse in the Prussian blue header and dark theme. The logo is 124px wide in the 100px desktop header and 112px in the 90px phone header. Welcome uses 174px / 140px next to the entry headline, without a separate header. Intrinsic dimensions preserve its proportions. The browser and PWA use `shiori-violetto-icon.svg`. Usage, tracing provenance and regeneration instructions live in `public/brand/README.txt`; preview and downloads are at `/brand/`. This branding integration preserves Claude’s latest study layout.

### Welcome entry

The first-run welcome uses Kiyo’s paired entry structure with Shiori’s blue and ivory identity. A composed Violetto and a bordered speech bubble occupy the left; the approved writing logo, “Every word, a little closer,” direct Google sign-in and guest entry occupy the right. The existing playable greeting, SVG logo, character atlas, owner restriction and explicit sync-history consent remain. On phones the greeting and smaller mascot precede the entry panel. Returning local profiles keep their existing route; onboarding does not reset data. Cloudflare Access is a separate hosted gate and remains unchanged until the user confirms its removal. No new mascot pose or audio asset was introduced for this layout.

### Violetto and postmarks

The existing 4×4 atlas at `/mascot/violetto-atlas.png` supplies 16 named poses through `Mascot`. It remains a static pose system. Today gives Violetto her Prussian-blue panel: name and 言葉を届ける, the arched portrait (links to her page), her line with furigana, romaji, English and "Hear Violetto". During lessons she reads while you meet a kana, listens during a question, then celebrates (unaided correct), offers a hint (supported) or encourages (incorrect). The folded-arms pose is never used for a correct answer.

The bubble presents Japanese with furigana, a romaji line, English and a 44px "Hear Violetto" action. Phones show one Japanese line and expand to reveal the rest. Lines live in `content/voices/violetto.json` with `ruby` (`{漢字|かんじ}` markup) and `romaji` beside the original `text` and `reading`, which still drive the audio checks. One voice serves every context, including named dialogue parts in JLPT listening.

Welcome retains its Prussian blue letter panel. Only a fine pointer nudges Today's portrait (-4px, -2deg, 230ms). Reduced motion disables decorative transforms and turns the verdict and bubble entrances into fades; the stroke drawing shows the finished character instead.

Postmarks represent actual saved activity and permanent collected rewards. Today shows their linked count in the ruled stats; the album retains its companion-blue level panel, metal numerals and blue earned postmarks. These are correspondence rewards, never proficiency certificates. The existing `#voice` audition page and Settings routes are retained pending Batch D. A voice audition choice is a preview preference and does not imply course audio regeneration.

## Do's and Don'ts

### Do:

- **Do** use semantic theme tokens and inspect both Morning letter and Night post.
- **Do** make the predominantly blue letter world and Violetto visible at arrival while keeping Japanese primary during practice.
- **Do** retain the established font families, upright headings, airy Mincho and small typewriter accents.
- **Do** preserve keyboard focus, nearby gloss feedback and usable phone study controls.
- **Do** update this file and its sidecar together from the final CSS cascade and rendered evidence.
- **Do** treat Violetto as confirmed and Shiori as provisional, preserving course, persona and persistence truth.

### Don't:

- **Don't** restore emerald primary actions or treat the earlier ban on purple as current guidance; blue leads, with restrained red and muted violet accents.
- **Don't** replace distinct learning surfaces with uniform card grids, decorative scores or marketing sections.
- **Don't** let companion art, postal ornament or continuous animation obstruct reading and retrieval.
- **Don't** present guided answers, correspondence levels, completion counts or roadmap labels as proven fluency.
- **Don't** describe this code-led design as an approved image composition or the working app name as settled.
