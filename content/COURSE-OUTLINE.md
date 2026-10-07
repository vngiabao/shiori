# Shiori course outline: N5 → N1, media and keigo

Status updated 2026-10-07. All N5/N4/N3/N2/N1 core units and twelve workplace-keigo scenarios are authored and internally reviewed; native review is pending. Seventy-three vocabulary decks, 2,013 kanji references and ninety written JLPT items per level are installed. Every pinned community source row has an explicit exact/corrected/related/pattern/excluded disposition; related candidates are not certified independent targets. Final audio/full-course/offline/hosting verification is in progress before the authorized production deployment. Current inventory and exact next work: output/course-progress.md; reviews: output/review-*.md.

## 0. What the course is for

The mission (from `../SHIORI-DIRECTION.md` and the mission brief): understand anime, drama, YouTube and real people without subtitles; read manga, novels and articles; write messages; reach professional Japanese with correct keigo. JLPT N5 → N1 runs alongside and never drives the course.

So every level has five strands, not one:

| Strand | Where it lives | What it does |
|---|---|---|
| **Course units** | `content/units/`, Course | Situations, grammar in use, listening scenes, readings, practice. The spine. |
| **Vocabulary & kanji decks** | packs + Review | Fill the gap between the unit words and the level's full list, with SRS. |
| **Listening ladder** | units + Watch | Step from one clear voice to native-speed anime without subtitles. |
| **Extensive reading** | Reader | Graded and real texts at the right coverage (≥95% known). |
| **JLPT corner** | `content/jlpt/`, Exam | Exam formats, timed sections, book pathway. Already built; grows per level. |

Keigo is not left until after N1. It begins at N4 (unit 7) and is drilled at every level after that (§7).

## 1. Level targets (all approximate; JLPT has published no official lists since 2010)

| Level | Cumulative vocabulary | Cumulative kanji | Course units | New words per unit | Textbook spine to align with | Rough time at ~1 h/day |
|---|---|---|---|---|---|---|
| N5 | ~800 | ~100 | 12 (done) | 12–18 | Genki I L1–12 | 3–4 months |
| N4 | ~1,500 | ~300 | 12 | 18–24 | Genki II L13–23 | +5–6 months |
| N3 | ~3,700 | ~650 | 16 | 30–40 (split into 2 lessons) | Sō-matome N3 / Shin Kanzen Master N3 文法; Tobira for reading | +9–12 months |
| N2 | ~6,000 | ~1,000 | 16 | 40–50 (2–3 lessons) | Shin Kanzen Master N2 文法・読解 | +12 months |
| N1 | ~10,000 | ~2,000 | 12 | 50+ (3 lessons) | Shin Kanzen Master N1 文法・読解 | +15–24 months |

Vocabulary and kanji counts are the commonly cited community estimates; record the list you use and its licence (for example Jonathan Waller's JLPT lists, CC BY) in `content/sources/`. The course units teach a **core** (about 40% of each level's words) in context. Level decks (§7) cover the rest. N5 is the same: the 12 units teach about 180 course words; an N5 deck must fill the rest of the ~800.

## 2. Cast (one voice: Violetto, different deliveries per speaker in `content/voices/dialogue-speakers.json`)

Existing: **Yui** (bookshop, calm and kind), **Ren** (café, friendly, dry jokes), **Hana** (American classmate, cheerful), **佐藤先生 Satō-sensei** (teacher, warm but exact), **You** (Vietnamese university student).

To add, each with a stable personality and a speaker entry before any line is rendered (the renderer fails on an unknown speaker):

| From | Name | Who | Speech style it teaches |
|---|---|---|---|
| N4 | **健太 Kenta** | Ren's younger brother, university friend | Fast casual male speech: じゃん, って, ちゃう, なきゃ |
| N4 | **山本さん Yamamoto-san** | Host mother / landlady | Warm older-woman polite speech, some Kansai later |
| N4 (u8) | **森さん Mori-san** | Engineer at the internship company, dry | Office です/ます, technical vocabulary, understatement |
| N3 | **美咲 Misaki** | Kenta's friend, anime and manga fan | Youth speech, character speech (役割語) recognition |
| N2 | **石川課長 Ishikawa-kachō** | Section manager at work, sharp | Business keigo, indirect refusal, meetings |
| N2 | **大阪の田村さん Tamura-san** | Client from Osaka | Kansai-ben (recognition only) |
| N1 | **松本部長 Matsumoto-buchō** | Department head | Formal speeches, negotiation, written style |

The story moves: university year → part-time job at Ren's café (N4) → internship (N4 end) → job hunting and first job (N2) → work in a Japanese company (N1). The learner's life gives every grammar point a real place.

## 3. N4 — 12 units (Genki II L13–23)

Grammar per Genki II, 3rd edition. **Verify** each lesson's list against the official Genki II 3rd edition table of contents (Japan Times) before authoring. Situations and sentences are original. Never copy Genki dialogues or examples.

| Unit | Title | Genki II | Grammar | Mission / can-do | Listening ladder step | Reading |
|---|---|---|---|---|---|---|
| n4-u01 | Can you work here? | L13 | potential verbs, 〜し, 〜そうです (looks), 〜てみる, なら, 一週間に三回 | Interview for the part-time job at Ren's café: say what you can and can't do | Clear, one speaker per turn | Job notice (情報検索: hours, pay, conditions) |
| n4-u02 | Hana's birthday | L14 | ほしい, かもしれません, あげる/くれる/もらう, 〜たらどうですか, number + も, number + しか〜ない | Choose and give a present; say who gave what to whom | Clear | LINE thread planning the present |
| n4-u03 | Summer plans | L15 | volitional, volitional + と思っています, 〜ておく, relative clauses (noun modification) | Plan a trip; say what you'll prepare | Clear, slightly faster | Travel guide page with a table |
| n4-u04 | A favour from Sensei | L16 | てあげる/てくれる/てもらう, 〜ていただけませんか, 〜といい, 〜時, 〜てすみませんでした | Ask Satō-sensei for a recommendation letter; apologise for being late | Clear | Email to a teacher (first formal email) |
| n4-u05 | I heard that… | L17 | 〜そうです (hearsay), 〜って, 〜たら, 〜なくてもいいです, 〜みたいです, 〜前に / 〜てから | Pass on news about Kenta; plan steps in order | **Ladder 2**: natural speed, casual って | Short news-style notice |
| n4-u06 | Oops | L18 | transitive/intransitive pairs, 〜てしまう (and ちゃう), 〜と, 〜ながら, 〜ばよかったです | Report something broken or lost; express regret | Natural speed, ちゃう/じゃう | Lost-property notice |
| n4-u07 | Dinner at the Yamamotos' | L19 | honorific verbs (いらっしゃる, 召し上がる, おっしゃる…), giving respect, 〜てくれてありがとう, 〜てよかったです, 〜はずです | Visit a home; speak respectfully to an older host | Two speakers, polite | Thank-you letter to a host family |
| n4-u08 | First day at the office | L20 | humble/extra-modest (参る, いたす, おる, 申す), embedded questions, 〜という, 〜やすい/〜にくい, 〜ないで | Introduce yourself at the internship; answer the phone basics | Office polite, Mori-san | Company orientation sheet |
| n4-u09 | A changed meeting room | L21 | passive (incl. suffering passive), 〜てある, 〜間に, adjective + する, 〜てほしい | Report an affected event and deliberate prepared state | **Ladder 3**: casual contractions てる, とく, なきゃ | Room-change notice |
| n4-u10 | Let me try the presentation | L22 | causative, causative + てあげる/てくれる, verb stem + なさい, 〜ば, 〜のに, 〜のように/〜のような | Talk about what you were made / allowed to do | Casual, two friends | Presentation practice guide |
| n4-u11 | Choosing a better practice routine | L23 | causative-passive, 〜ても, 〜ことにする, 〜ことにしている, 〜まで, ます-stem + 方 (かた) | Make resolutions; explain how to do something | Casual, overlapping turns | Practice diary |
| n4-u12 | The internship handover (capstone) | review | mixed | Confirm deadlines, request a check, return materials and reflect | Two scenes, one with no transcript until the end | Final-week email (12 body sentences) |

Per N4 unit: 18–24 new words; 3 grammar notes; 2 scenes (6–10 lines each); 10–12 exercises; one reading with 3–4 tasks; ≥30% recycled words from the previous three units.

## 4. N3 — 16 units (function-based)

From N3 there is no single textbook spine. Build the grammar list from **two independent sources**, for example Shin Kanzen Master N3 文法 contents plus one community list (Bunpro, JLPT Sensei or Tanos), and record both. Each unit splits into two lessons (15–20 words each).

| Unit | Title | Grammar cluster | Media / skill focus |
|---|---|---|---|
| n3-u01 | Getting better at it | ようになる, ようにする, ように (purpose), ために vs ように | Vlog-style monologue |
| n3-u02 | Just now, about to | たばかり, ところ (ているところ, たところ, るところ), 〜うちに | Phone call in progress |
| n3-u03 | Looks like, seems, apparently | そう / よう / らしい / みたい contrasted; っぽい (appearance/characteristic) | Gossip scene with Misaki |
| n3-u04 | It must be, it should be | はず, わけ, べき, に違いない | Detective-style anime scene (original) |
| n3-u05 | About, for, towards | について, に対して, にとって, によって | Opinion message |
| n3-u06 | Decisions | ことになる, ことにする, ことはない, ことだ | Team meeting at the café |
| n3-u07 | If and when | と / ば / たら / なら in contrast | Giving directions and advice |
| n3-u08 | Even though | ても, のに, くせに, ながらも (concessive; contrast with simultaneous-action ながら) | Argument between friends |
| n3-u09 | Thanks to, because of | おかげで, せいで, ため(に) cause, から/ので review | News-lite report |
| n3-u10 | Whenever, while, and recurring tendencies | たびに, 間に/間, 最中に, うちに; がち / 気味 contrasted | Story told in the past; routine diary |
| n3-u11 | Let me do it | させてください, させていただく, causative/passive review in real use | Workplace requests |
| n3-u12 | **Anime casual speech** | ちゃう/じゃう, とく, てる, なきゃ/なくちゃ, っけ, じゃん, かな, の? (rising) | Ladder 4: contractions at speed, no transcript first |
| n3-u13 | **Character speech (役割語)** | ぜ, ぞ, わ, のだ, かしら, じゃ (old man), ござる (recognition only) | Who is speaking? (anime archetypes) |
| n3-u14 | Not only… but also | ばかりでなく, だけでなく, ほど, くらい, さえ | Product review; stronger written ばかりか revisited at N2 u04 |
| n3-u15 | **Reading manga** | onomatopoeia (擬音語・擬態語), dropped particles, exclamations, furigana-less panels | Original manga-style panels (text + description) |
| n3-u16 | Capstone: a week of news | mixed + 情報検索 | NHK News Web Easy–style original article + table |

## 5. N2 — 16 units (genre-based)

| Unit | Title | Grammar / skill | Media / genre |
|---|---|---|---|
| n2-u01 | Written style | である / だ style, 〜ものの, 〜にもかかわらず | Short essay |
| n2-u02 | Generalisations | ものだ, ことだ, わけではない, わけにはいかない | Advice column |
| n2-u03 | On the occasion of | に際して, にあたって, に限らず, に限って | Formal notice / announcement |
| n2-u04 | Arguing a point | と言える, ざるを得ない, に過ぎない, に違いない, ばかりか | Opinion essay (主張理解) |
| n2-u05 | Reading the news | によると, とみられる, を受けて, に伴い | News article (original) |
| n2-u06 | **Business email keigo** | お〜する, ご〜いたす, させていただく, いただけますでしょうか | Emails: request, confirm, apologise |
| n2-u07 | **Phone and meetings** | keigo in speech, 〜でございます, 恐れ入りますが | Phone call with Ishikawa-kachō |
| n2-u08 | Natural conversation | あいづち (へえ, なるほど, そうなんだ), fillers (えっと, なんか, まあ), omission | Ladder 5: natural speed, overlaps |
| n2-u09 | Saying no without saying no | indirect refusal (ちょっと…, 考えておきます), 〜かねる, 〜ないこともない | Drama scene |
| n2-u10 | Novels | narrative past, inner monologue, 〜のだった, 〜ていく/〜てくる | Original short story |
| n2-u11 | Describing impressions precisely | げ; っぽい, がち, 気味, 〜やすい review and contrast | Character descriptions |
| n2-u12 | Based on, through, around | をもとに, を通じて, をめぐって, をはじめ | Report / documentary narration |
| n2-u13 | Comparing views (統合理解) | two opinions on one topic | Two short essays, compare tasks |
| n2-u14 | **Kansai-ben** | や, へん, めっちゃ, ほんま, おおきに, 〜はる (recognition) | Tamura-san; anime Kansai characters |
| n2-u15 | **Youth and internet Japanese** | ガチ, やばい, 〜すぎ, ワンチャン, 草 (recognition, dated) | Social posts (original) |
| n2-u16 | Capstone: the job interview | mixed keigo + listening | Interview with Ishikawa-kachō |

## 6. N1 — 12 units (literary, formal, professional)

| Unit | Title | Content |
|---|---|---|
| n1-u01 | Literary expressions I | 〜んばかり, 〜をものともせず, 〜ならでは, 〜たりとも |
| n1-u02 | Literary expressions II | 〜まじき, 〜ともなると, 〜に至っては, 〜をもって |
| n1-u03 | Classical remnants | 〜ぬ, 〜ざる, 〜べからず, 〜ごとし (recognition; set phrases) |
| n1-u04 | Editorials | 社説-style argument, hedging, concession chains |
| n1-u05 | Negotiation keigo | proposals, conditions, polite pressure, closing |
| n1-u06 | Speeches and ceremonies | 挨拶, toasts, formal openings (本日はお忙しい中…) |
| n1-u07 | **Period drama (時代劇)** | 拙者, ござる, 〜でござる, 〜じゃ, 候 (recognition only) |
| n1-u08 | Literature I | Public-domain excerpt from 青空文庫 (e.g. Akutagawa, Natsume Sōseki), with glosses |
| n1-u09 | Literature II | Second public-domain author; narrative style analysis |
| n1-u10 | Commentary listening | Ladder 6: discussion programme, several speakers, no transcript |
| n1-u11 | Academic Japanese | Abstracts, definitions, citing (〜とされる, 〜と考えられる) |
| n1-u12 | Capstone: a week at work | Report, meeting, apology to a client, farewell speech |

Literature: use only texts that 青空文庫 lists as public domain, record the URL and the author's death year, and gloss them. Do not use modern copyrighted novels, manga or anime scripts. Media strands use the learner's own files in Watch.

## 7. Parallel tracks (all levels)

**Keigo track.** Keigo appears at N4 u07–u08, N3 u11, N2 u06–u07 + u16, and N1 u05–u06 + u12. After N1, a stand-alone **Keigo at work** module has 12 scenarios: reception, phone, email, meeting, request, refusal, apology, negotiation, presentation, interview, visiting a client, and seasonal greetings. Every keigo unit includes a "say it three ways" task (casual / です・ます / keigo) and a "which fits this situation?" task.

**Listening ladder** (`src/Route.tsx` already shows the six stages on Listen). The units feed it in this order:

1. One clear speaker (N5).
2. Natural speed, casual って (N4 u05).
3. Contractions (N4 u09).
4. Anime casual speech at speed (N3 u12–13).
5. Natural conversation with overlaps (N2 u08).
6. Multi-speaker commentary with no transcript (N1 u10).

From N4 onwards, every unit ends with a **Watch task**: "watch 10 minutes of your own show with Japanese subtitles and save 5 lines that use this unit's grammar". Lines saved in Watch are recorded as evidence, not scored.

**Level decks.** For each level there is a vocabulary deck and a kanji deck with the words not taught in units. Decks are authored as packs like `n4-vocab-01` (100 words each), with one example sentence each, JMdict-checked readings, the JLPT level from the recorded list, and audio. They are reviewed with the same per-skill memory as everything else.

**Extensive reading.** Use free graded readers (for example the NPO Tadoku free readers, if their licence allows linking) and NHK News Web Easy, linked rather than copied. Add original graded stories in the Reader at each level's coverage.

**JLPT corner.** Grow the bank per level to ≥60 checkpoint items + 30 sample items per mode (target in the mission brief). Each new course level adds its JLPT checkpoint items at the same time.

## 8. Engine changes needed before each level

| Needed by | Change | Why |
|---|---|---|
| N4 | `build-unit.ts`: more than one scene and more than one reading per unit; new prefixes (`n4-uNN-w-…`) | N4 units have 2 scenes |
| N4 | Readings that are not built from word ids: `Reading { id, lesson, title, genre, paragraphs (ruby), glosses[], table? }` with a coverage check (known + glossed ≥ 95%) | Letters built only from word ids don't scale past N4 |
| N4 | Grammar notes gain optional `examples[]`, `mistake`, `formation` fields (additive) | One example per note is too thin from N4 |
| N4 | Recycling check: ≥30% of words in scenes and exercises come from the previous three units | Keeps old words alive |
| N4 | New cast speakers in `dialogue-speakers.json` | The renderer fails on unknown speakers |
| N4 | Course map groups units by level (N5 / N4 / …) | 24+ units in one list is unreadable |
| N3 | Units split into 2–3 lessons, `lessons[]` in the draft | 30–40 words per unit |
| N3 | Natural-speed rendering option per scene (`speed: 1.1–1.25`) | Listening ladder steps 2–4 |
| N3 | Exercise `"speaker"` question type: who said this line (character speech) | n3-u13 |
| N2 | Two-text reading with comparison tasks (統合理解) | n2-u13 |
| N2 | "Three ways" register exercise as a first-class type (casual / polite / keigo) | Keigo track |
| N1 | Long reading with paragraph-level glosses and a public-domain provenance field | Literature units |

## 9. Quality bar for every unit (from the N5 review)

User correction, 6 October 2026: finish and review the N2, N1 and workplace-keigo core before the remaining N3/N2/N1 decks. Preserve the four completed N3 decks. Believable conversation takes priority over the 30% recycling target: use a documented per-unit exception rather than padding lines. Casual/media units repeatedly use their target forms in ordinary peer conversation; no model/safety disclaimers in scenes. N3 units 12–13 and other affected scenes have an editorial correction recorded in output/review-n3.md. Passing structural checks did not establish their earlier naturalness.

Must-fix before deploy:
- Every scored question has exactly one defensible answer.
- No scored claim the text doesn't state.
- Formation rules are complete (e.g. て→た **and** で→だ).
- Distractors are grammatical and wrong in context, unless the task says it tests form.
- The style asked for (plain / polite / keigo) is stated in the task, not assumed.

Should-fix:
- Gap-fills on readings are labelled grammar practice.
- Translations match the Japanese tense and aspect.
- Scene notes explain what is happening.

The status stays "AI-assisted draft" until a person reviews it.

Research update (6 October 2026): n3-u06 retrieves ことにする from N4 units 11/12 and fully teaches the arrangement/result bridge ことになる. Both publishers disagree N3/N4 on these forms. Advisory ことだ is N3-tagged by Bunpro and N2-tagged by JLPT Sensei; introduce supported use here and retrieve in n2-u02, without claiming an official level. Form-specific brief: content/sources/grammar/n3-u06.json.

Research update (6 October 2026): n3-u07 contrasts N4 conditional retrieval (と/ば/たら/なら). n3-u08 form brief verifies the concessive のに-despite page separately from purpose のに. ても/のに are N4 bridges; くせに/ながらも are N3-tagged by both selected publishers. All tags are editorial.


## N1 unit 5 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original readings (874/879 characters), twenty tasks. Final TypeScript, 121 unit tests / 18 files, 24 Python tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. All 9,879 prior Clear keys and 1,145 earlier scene mappings preserved; all 141 new WAVs referenced; 131 historical takes retained. Current 10,035 Clear keys / 10,047 synthesis records / 1,184 scene takes / 1,337 kanji references. Browser decodes all 39 scene WAVs, checks three lesson-specific note sets, replay, both readings at 375/1440 in saved light/dark themes, axe and overflow; detail screenshots inspected. Production build and real offline playback pass: 1,701 entries / 14,865.84 KiB; offline 2026-10-07T03:57:23.610Z. Native review pending; no production deployment.

Exact next: implement actual on-demand course delivery/cache before further expansion crosses the 15 MiB install cap, retaining course access, saved progress and prior audio. Then N1 unit 6 speeches/ceremonies: research precise opening, thanks, toast and closing forms using primary authored sources before drafting. Finish N1 and twelve keigo cores before remaining decks. Never rerun ignored author-n1-u05.py or refine-n1-u05.py over canonical corrections.


## On-demand course delivery verified checkpoint (7 October 2026)

Course text now loads by level on demand, with earlier levels loaded before a later lesson opens. A metadata-only library shows the whole authored pathway without fetching its advanced text. Returning completion/attempt/memory IDs restore the required level without rewriting progress; browsing all-content shelves loads their full contents. Watch constructs its practice sample after content arrives. Tooling audits still read the full validated aggregate rather than the browser's currently loaded subset.

The existing Settings offline-download action saves course text plus every mapped clip. Hashed same-origin course cache lookups ignore the Origin Vary header so downloaded files work for module imports as well as ordinary fetches. Failed imports offer a reload that retains data; leaving during a pending request cannot open an old lesson later. No IndexedDB schema, auth, visuals, course prose or recording bytes changed. Precache: 1,692 entries / 12,112.16 KiB (previous 14,865.84 KiB); a build guard rejects installs over 15 MiB. Advanced text caches independently after use. Development mode explains that offline saving requires the built app.

Passed: TypeScript, 121 unit tests / 18 files, full content/dictionary check, preservation of all 10,035 Clear keys / 1,184 scene mappings / 131 historical takes with zero new WAVs, 64 existing-screen browser checks, five new loading cases in both development and production, and focused N1-u05 / N3-u12 browser checks. Loading cases cover no advanced initial download, prerequisite loading, failed-import recovery, cancellation, and unchanged returning progress; failure layouts inspected at 375/1440 with axe/overflow checks. Real production offline report: 2026-10-07T04:36:22.771Z, all fifteen course chunks cached, N1 lesson opens, reactions/dialogue/deck examples play and JLPT teacher loads with zero page errors. No production deploy.

Exact next: N1 unit 6 speeches/ceremonies, then remaining N1 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deploy. The preliminary author helper output/author-n1-u06.py is NOT canonical or executed yet: inspect/correct it before authoring. Primary formation sections inspected: MLC business_japanese; Culture Agency keigo chapter2; Bunpro ながらも; Zexy cheers.html authored ceremony guide (its wedding-specific rules are not applied universally). A small original client exhibition continues unit 5's agreed booklet delivery; keep public openings/thanks and closing scope clear. Native review remains pending. Never rerun ignored finalized unit author/refinement helpers.


## N1 unit 6 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original programme/diary passages (1,022/1,061 prose characters, plus a five-row timetable) and twenty tasks. All five contextual speech readings pin their inspected mora sequences in content/voices/pronunciation-readings.json; the audio validator checks them. Corrected 中→なか, 試そう→ためそう and authored 御礼→おれい without altering any earlier recording. All 10,035 earlier Clear keys / 1,184 scene mappings / 131 historical takes preserved; all 135 new WAVs mapped. Current 10,185 Clear keys / 10,197 synthesis records / 1,223 scene takes / 1,347 kanji pages. Inventory: 85 packs / 3,624 records / 315 lessons / 229 notes / 125 scenes / 72 readings (31,954 characters).

Final TypeScript, 121 unit tests / 18 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused browser decodes all 39 scene WAVs, checks three note sets/replay and both readings at 375/1440 in saved light/dark themes with axe/overflow; detail screenshots inspected. Production build and real offline reload/playback pass: 1,702 entries / 12,151.62 KiB; offline 2026-10-07T05:03:50.232Z. An unfinished-render test, stale dev-server public-file cache and build-triggered hot-reload test interruption were resolved before the final successful checks. Native review pending; no production deployment.

Exact next: N1 unit 7 period-drama recognition, then units 8–12 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deployment. Relevant primary authored sections inspected: Japan Foundation 201302 role-language research and 201101 anime/manga teaching, IMABI copula variants, Fukui Prefectural Archives 611944.pdf (full text and rendered page), and Shogakukan’s actual 御座る entry republished by Kotobank. IMABI honorifics-IV returned 429; its search snippet is not inspected evidence. Recognise 拙者/でござる/じゃ and selected 候 writing in a concrete original story, without treating fiction as a full historical transcript or teaching these as workplace speech. Do not add model/identity cautions to dialogue. No unit 7 authored yet. Never rerun output/author-n1-u06.py over the corrected source.


## N1 unit 7 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original readings (948/981 characters) and twenty tasks. Actual queries corrected historical 候/奉願候 read-outs, 殿→との, 銭→ぜに and long vowels in 書状/草履; thirteen exact U7 keys pin full mora sequences. All 10,185 earlier Clear keys / 1,223 scene mappings / 131 historical takes preserved; all 143 new WAVs mapped. Current 10,342 Clear keys / 10,354 synthesis records / 1,262 scene takes / 1,364 kanji pages. Inventory: 86 packs / 3,678 records / 318 lessons / 233 notes / 128 scenes / 74 readings (33,883 characters).

Final TypeScript, 121 unit tests / 18 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 scene WAVs, checks three note sets/replay and both readings at 375/1440 in saved light/dark themes with axe/overflow; corrected detail screenshots inspected. Build and real offline reload/playback pass: 1,719 entries / 12,199.06 KiB; offline 2026-10-07T05:41:45.305Z. Screenshot inspection caught a first-paragraph departure-plan/answer mismatch; canonical annotated prose now agrees with tomorrow-morning departure, then the final build/browser/offline checks were rerun. Native review pending; no production deployment.

Exact next: N1 unit 8 literature, then units 9–12 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deploy. Sōseki’s 吾輩は猫である card, author dates and actual XHTML retrieved through aozora-renewal.cloud; official aozora.gr.jp requests failed. Select three consecutive painting-story paragraphs (924 characters), preserve source prose exactly, add supported readings/glosses and original commentary/questions. Do not imply the friend’s quoted art-history claim is independently established. Primary formation research: Bunpro とみえる and authored Japanese-language-education tomieru; IMABI やら plus Shogakukan 大辞泉 やら republished by Kotobank; quotation from IMABI/Tae Kim; literary copula source still needs full corroboration. No unit 8 authored yet. Never rerun ignored finalized author helpers, particularly output/author-n1-u07.py.


## N1 unit 8 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, a pinned 924-character Sōseki source excerpt and 1,018-character original commentary, twenty tasks. Source wording and original ruby survive added support and pack compilation, checked by tests/literature-source.test.ts. Six exact pronunciation overrides correct contextual 甘く→うまく, 一行→いちぎょう, 嘲ける→あざける and 並べ→ならべ. All 10,342 prior Clear keys / 1,262 scene mappings / 131 historical takes preserved; all 144 new WAVs mapped and active. Current 10,501 Clear keys / 10,513 synthesis records / 1,301 scene takes / 1,382 kanji pages. Inventory: 87 packs / 3,732 records / 321 lessons / 237 notes / 131 scenes / 76 readings (35,825 characters).

Final TypeScript, 122 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs and checks three lesson note sets/replay and both readings at 375/1440 in saved light/dark themes with axe/overflow; detail screenshots inspected. Build and real offline reload/playback pass: 1,737 entries / 12,247.80 KiB; offline 2026-10-07T06:16:21.889Z. Native review pending; no production deployment.

Exact next: N1 unit 9 Literature II, then units 10–12 and twelve keigo cores BEFORE remaining decks/JLPT expansion and final deploy. Candidate Miyazawa Kenji 注文の多い料理店, new-spelling card43754/file43754_17659.html; actual author/card inspected through aozora-renewal.cloud. Full text and formation corroboration still need inspection. Preserve a consecutive source excerpt and its ruby, teach evidence-supported interpretation, receiver/agent and narrative explanation. Never rerun output/author-n1-u08.py or support-n1-u08.py over finalized canonical sources.


## N1 unit 9 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, a pinned 1,098-character Miyazawa source excerpt and 1,051-character original commentary, twenty tasks. Source prose/ruby survives added support and compilation; exact raw/selection hashes are pinned. Corrected contextual 山猫軒→やまねこけん, 地の文→じのぶん and その後→そのあと through three new exact-key pronunciation inputs. All 10,501 prior Clear keys / 1,301 scene mappings / 131 historical takes preserved; all 147 new WAVs referenced. Current 10,658 Clear keys / 10,670 synthesis records / 1,340 scene takes / 1,396 kanji pages. Inventory: 88 packs / 3,786 pack records / 324 lessons / 241 notes / 134 scenes / 78 readings (37,974 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs, checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. Production build and real offline reload/playback pass: 1,751 entries / 12,290.24 KiB. Native review pending; no production deployment.

Exact next: N1 unit 10 commentary listening, then units 11–12 and twelve workplace-keigo cores BEFORE remaining decks/JLPT expansion and final deployment. Primary authored formation sections inspected for にしたところで (Bunpro/mainichi-nonbiri), を踏まえて and に即して (Bunpro/NihongoNET), ないとも限らない (NihongokyoshiNET and Sanshusha publisher errata, attachment-table screenshot still to inspect). Use a concrete original library-hours discussion with distinct speakers, evidence versus proposals and final qualified positions. Community tags vary; no official syllabus claim. Never rerun finalized output/author-n1-u09.py; it predates canonical ruby/gloss/schema/editorial corrections.


## N1 unit 10 verified checkpoint

54 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original readings (957/926 characters), twenty tasks. The discussion keeps five-o’clock closing, proposed Wednesday seven-o’clock trials, response counts, unchanged two-person staffing and unapproved next steps distinct. Eight exact new keys correct 聴取’s contracted シュ, long-o vowels in 恒常的/繁忙, contextual 仕事の後→あと and 読み違える→よみちがえる. All 10,658 prior Clear keys / 1,340 scene mappings / 131 historical takes preserved; all 143 new WAVs referenced and active. Current 10,816 Clear keys / 10,828 synthesis records / 1,379 scene takes / 1,404 kanji pages. Inventory: 89 packs / 3,840 pack records / 327 lessons / 245 notes / 137 scenes / 80 readings (39,857 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs, checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. Production build and real offline reload/playback pass: 1,759 entries / 12,325.50 KiB; offline 2026-10-07T07:18:28.304Z. Native review pending; no production deployment.

Exact next: N1 unit 11 academic reading, then unit 12 and twelve workplace-keigo cores BEFORE remaining decks/JLPT expansion and final deployment. Independently authored formation sections inspected: definitional とは (Mainichi/NihongokyoshiNET), とされる/とされている (Bunpro/Mainichi), に基づく/いて/いた (Bunpro/Nihongo-arekore), と考えられる (Bunpro plus Keio’s authored report-writing guide). Community labels vary. Bunpro’s とは page concerns surprise, not the selected definition; its universal objectivity/subjectivity contrast is not adopted. Full J-STAGE paper could not be reliably opened and is not relied on. Ignored output/author-n1-u11.py is prepared but not yet executed successfully; inspect it rather than claim content complete. Never rerun finalized U10 author/refinement helpers over the corrected source.


## N1 unit 11 verified checkpoint

52 restricted-JMdict pairs, three lessons, four notes, 39 scene lines, two original academic readings (1,051/1,015 characters), twenty tasks. The fictional classroom investigation keeps twelve volunteers, ten complete pairs, 38/26-second medians, seven/eight correct answers, source-attributed policy, fixed order and an uncompleted follow-up distinct. Contextual ruby corrected 指す, 役割, 読み方, 表, 行って, 足して, number compounds and 全く. Seven exact new pronunciation inputs pin full inspected mora sequences; earlier recordings are unchanged. All 10,816 prior Clear keys / 1,379 scene mappings / 131 historical takes preserved; all 141 new WAVs referenced. Current 10,970 Clear keys / 10,982 synthesis records / 1,418 scene takes / 1,414 kanji references. Inventory: 90 packs / 3,892 pack records / 330 lessons / 249 notes / 140 scenes / 82 readings (41,923 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python source tests, content/dictionary/ledger/JLPT294, five audio validators and preservation pass. Focused production browser decodes all 39 WAVs and checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. Build and real offline reload/playback pass: 1,769 entries / 12,364.16 KiB; offline 2026-10-07T07:41:56.829Z. An early mapping test ran before dialogue rendering finished and failed as expected; the final complete suite passes. Native review pending; no production deployment.

Exact next: N1 unit 12 work capstone, then whole N1 core reread and twelve workplace-keigo cores BEFORE remaining decks/JLPT expansion and final deploy. Outline: report, meeting, client apology and farewell. Primary authored sections inspected for own-side いたす, お/ご…申し上げる, considerate requests and continuing/past gratitude: Culture Agency keigo chapters2–4, Bunpro いたす and MLC’s Business Japanese page. MLC guessed keigo.html failed; MyNavi page did not expose the searched relevant text, so neither is claimed as inspected formation evidence. N1-u12 vocabulary selector has 85 unused restricted matches but no unit source yet. Never rerun finalized U11 author/refinement helpers over its canonical corrections.


## N1 core complete / unit 12 verified checkpoint

All twelve N1 core units are authored: 644 new restricted-JMdict pairs, 36 lessons, 49 notes, 468 scene lines, 24 readings and 240 tasks. Unit 12 adds 52 pairs, three lessons, four notes, 39 lines, two original readings (1,215/1,158 characters) and twenty tasks. All 10,970 prior Clear keys / 1,418 scene mappings / 131 historical takes preserved; all 142 new WAVs referenced. Current 11,125 Clear keys / 11,137 synthesis records / 1,457 scene takes / 1,419 kanji pages. Inventory: 91 packs / 3,944 records / 333 lessons / 253 notes / 143 scenes / 84 readings (44,300 characters).

Final TypeScript, 123 unit tests / 19 files, 24 Python tests, source/content/ledger/JLPT294, five audio validators, preservation, build and real offline playback pass. U10 and U12 production browser cases pass; U12 decodes 39 WAVs, checks three note sets/replay and both readings at 375/1440 in light/dark with axe/overflow; detail screenshots inspected. A last lookup-only correction changes 間 in the handover to あいだ, matching its existing ruby; final build/offline rerun passes. Precache 1,774 entries / 12,398.04 KiB; offline 2026-10-07T08:13:17.698Z. Native review pending; no production deployment.

Whole N1 editorial reread covered all 36 scenes, all 24 reading texts and 240 task prompts/correct answers. U10's city library is explicitly different from U4's trial library. U12 specifies next month's different exhibition and the current booklet, so the completed U5–6 exhibition is not silently repeated. Mori's transfer to sales retains a continuing relationship. Completed sends, approvals and handovers remain separate from planned first use of the checking procedure. Contextual 本日中/旧版 query corrections add two exact keys and do not change older recordings. Detailed earlier unit reviews remain in output/review-n1.md; this is an author/editor pass, not an independent native certification.

Exact next: twelve workplace-keigo core scenarios BEFORE remaining source-backed N3/N2/N1 decks and JLPT expansion, then final deploy. Start keigo-u01 reception: guest いらっしゃる, own-side おります/参ります, directed 伺う and selected お待ちください. Full relevant Culture Agency chapter2 and Bunpro いらっしゃる / MLC Business Japanese inspected; selected requests corroborated in Culture Agency chapter3. Do not adopt Bunpro's overly restrictive ご～ください generalisation. Twenty–thirty unused restricted pairs, one lesson, three three-example notes, two 8–14-line scenes, one document and 12–14 tasks including three styles and listener-specific register. No keigo source authored yet. Never rerun finalized U12 author/refine helpers over canonical corrections.


## Workplace-keigo U1–9 verified checkpoint — 2026-10-07

Nine scenarios: 188 new restricted-JMdict pairs, nine lessons, twenty-seven notes / eighty-one examples, eighteen scenes / 178 lines, nine documents and 126 contextual tasks. U7–9 add apology, negotiation and presentation. The delayed twenty copies are received explicitly before the next job; a reduced-budget sample does not imply an order; presentation questions and Friday-five reply stay separate from Monday order approval. Actual 五分 duration is pinned to ごふん, not ごぶ. Precise reading/gloss fixes are canonical; do not rerun ignored author helpers.

Final TypeScript, 125 unit tests / nineteen files, 24 Python tests, source/content/dictionary/ledger/JLPT294, five audio validators, preservation, U7–9 focused browser cases, production build and real offline playback pass. Theme checks now require the saved light/dark value before and after reload; screenshots remain in the existing design. All 11,559 earlier Clear keys / 1,575 prior scene mappings from 907c030 are unchanged; all 216 new WAVs referenced; 132 historical takes retained. Current 11,775 Clear keys / 11,787 synthesis records / 1,635 dialogue takes. Precache 1,786 entries / 12,525.66 KiB; offline 2026-10-07T10:21:54.719Z, eighteen chunks / 100 teacher clips / 2,855 deck audio URLs / twenty-two examples played. No production deployment; native listening/editor review pending.

Exact next: U10 interview and U11 client visit are authored but NOT compiled/verified. Finish U10, then U11 and U12 seasonal greetings, before remaining N3/N2/N1 decks and N2/N1 JLPT banks, whole-course checks and the authorised final deploy. Keep design, auth, database and old recordings; backup only course-build, never main before completion.


## All twelve workplace-keigo scenarios verified — 2026-10-07

All core units N5/N4/N3/N2/N1 and all twelve workplace scenarios are authored and internally checked; native review remains pending. Keigo adds 248 restricted-JMdict spelling/reading pairs, twelve lessons, 36 notes / 108 examples, 24 scenes / 238 lines, twelve documents and 168 contextual tasks. The last scenarios cover interviews, client visits and seasonal greetings without implying a job offer, an approved extra order or a decided future price.

Final TypeScript, 128 unit tests / twenty files, 24 Python tests, content/dictionary/ledger/JLPT294, five audio validators, full twelve-scenario browser checks and final U11/U12 reruns pass. Phone/desktop reading viewport screenshots inspected. Preserved all 11,775 earlier Clear keys and 1,635 unchanged dialogue mappings from 1982b33; all 210 new WAVs referenced, 133 historical takes retained. Current 11,984 Clear keys / 11,996 synthesis records / 1,695 scene takes. Single-mora kana still passes no-extra-phoneme checks; native/perceptual review is separate.

Offline saving now recovers from a failed connection: the button re-enables, finished batches settle before retry, downloaded clips remain, brief connection failures retry, and missing files/storage failures are reported. Three meaningful regression tests cover transient retry, missing-file recovery/batch settlement and storage exhaustion. Real production-preview test interrupted the download, retried it, then reloaded and played recordings offline. Report 2026-10-07T11:08:55.434Z: nineteen cached course chunks, 100 teacher clips, 1,695 scene clips, 2,855 deck audio URLs, twenty-two deck examples played. Install precache 1,791 entries / 12,572.50 KiB, below 15 MiB. Logs output/keigo-core-retry-gates.log, keigo-core-source-audio.log, keigo-core-final-preservation.log. Design, owner auth and database identity unchanged; no production deploy.

Current inventory: 103 packs / 4,192 entries / 345 lessons / 289 notes / 167 scenes / 96 genre readings (46,620 characters) / 1,435 kanji references. These are authored records, not learned vocabulary or proficiency evidence.

Exact next: finish remaining source-backed N3/N2/N1 vocabulary/kanji decks and N2/N1 written banks, final cross-course review/checks, then the already-authorised migration, push/deploy and removal of only Shiori's Access gate. Draft n3-vocab-05.txt and its small compiler register additions are NOT yet installed or verified. Preserve design, auth, data and old audio; backup only course-build before completion, never main. Native listening/editor review and the owner's two-device sync test remain separate.
