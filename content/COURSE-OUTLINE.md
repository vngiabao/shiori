# Shiori course outline: N5 → N1, media and keigo

Status updated 2026-10-06. The N5 and N4 core courses are authored, with seven N5 decks (489 records) and eleven N4 decks (528 records), twenty-two decks total including four N3 decks (400 original contextual records). All 1,386 raw beginner rows have explicit dispositions, not an exhaustive taught-vocabulary claim: related forms, attached patterns and exclusions remain visible. N5/N4/N3 each have sixty checkpoints and thirty samples. N4 content/source/audio gates pass; native review remains pending. N3 units 1–16 are authored as thirty-two lessons with original scenes/readings and form-specific source reviews. Units 4/5 distinguish conviction from confirmed evidence, and individual viewpoints from survey scope. N3 deck expansion and the final N3 level review are unfinished. N2 core units 1–16 and the whole N2 core reread are complete; N1 units 1–3 are verified as nine lessons and six original literary/editorial readings; N1 units 4–12 and twelve workplace-keigo scenarios remain to author and verify sequentially. Build prompts: prompts/gpt-course-build.md and prompts/gpt-course-continue.md. Exact checkpoint and remaining work: output/course-progress.md.

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
