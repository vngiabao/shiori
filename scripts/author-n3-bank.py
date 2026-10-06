"""Compile original, answer-first N3 practice; preserve all historical items.

These short written tasks supplement external official listening/full exams.
Community level estimates and internal checks are not native editorial approval
or psychometric calibration. No publisher passages/questions are reproduced.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
# prompt, correct option, three distractors, explanation, focus, optional passage
VOCAB=[
('記事の見出しを読みました。「見出し」の読み方は？','みだし',['みでし','けんだし','みいだし'],'見出し is みだし, a headline or heading. The compound is not read けんだし.','Headline reading'),
('参加するには条件があります。「条件」の読み方は？','じょうけん',['じょけん','じょうかん','ちょうけん'],'条件 is じょうけん: a condition. Keep the long vowel in じょう.','Condition reading'),
('雨で服が濡れました。「濡れました」の読み方は？','ぬれました',['なれました','ねれました','ふれました'],'濡れる is ぬれる, become wet. The past polite form is ぬれました.','Wet-state reading'),
('友達に相談しました。「相談」の読み方は？','そうだん',['しょうだん','そうたん','そうなん'],'相談 is そうだん: consultation or discussing a problem with someone.','Consultation reading'),
('この会場の定員は三十人です。「定員」の読み方は？','ていいん',['ていにん','じょういん','ていえん'],'定員 is ていいん, the capacity or maximum admitted number, not observed attendance.','Capacity reading'),
('資料の余白にメモを書きました。「余白」の読み方は？','よはく',['よびゃく','よばく','よしろ'],'余白 is よはく: blank space or a margin.','Margin reading'),
('この機械には保証が付きます。「保証」の読み方は？','ほしょう',['ほそう','ほじょう','ほしゅう'],'保証 is ほしょう, a guarantee or warranty. Keep しょう rather than しゅう.','Warranty reading'),
('聞いた話と自分の感想を（　）書きました。同じものとして扱っていません。','分けて',['集めて','消して','借りて'],'分けて means separating them. The next sentence explicitly denies treating report and impression as the same thing.','Separate report and impression'),
('予定を忘れないように、手帳に（　）しました。','記録',['故障','返品','沈黙'],'記録 is a record. A notebook is used to record the arrangement; the other nouns do not name that act.','Record in context'),
('今日は電車が止まっています。移動に（　）かかるので、早く出ます。','時間が',['涙が','衣装が','余白が'],'時間がかかる means takes time. The extra travel time explains leaving early.','Travel-time expression'),
('箱を開けていない商品なら、店に（　）できます。店の規則を確認してください。','返品',['取材','朗読','主催'],'返品 means return a purchased product. The sentence states the shop’s condition; it is not a universal return policy.','Product-return context'),
('この表の「合計」は何を表しますか。','全部を合わせた数',['一番小さい数だけ','一人当たりの料金','前の日の時刻'],'合計 is the sum or total, not a minimum, a per-person charge or a date.','Total paraphrase'),
('「前日」はどの日ですか。','ある日の一日前',['ある日の一日後','ある日と同じ日','ある日の一週間後'],'前日 is the preceding day relative to the stated date. 翌日 is the following day.','Relative-day paraphrase'),
('「じっと見る」に最も近いのはどれですか。','目を動かさず、注意して見る',['声を出して読む','何度も走って行く','見ないで眠る'],'In this verb combination, じっと見る means looking steadily or intently. Other uses of じっと need their own context.','Mimetic in context'),
('「修理」を自然に使っている文はどれですか。','壊れた時計を修理してもらいました。',['名前を修理して自己紹介しました。','雨の音を修理して聞きました。','三人を修理して四人にしました。'],'修理 concerns repairing a broken object or equipment. A broken clock supplies the appropriate object.','Repair usage'),
('「応募」を自然に使っている文はどれですか。','募集を見て、アルバイトに応募しました。',['窓を応募して風を入れました。','昼ご飯を応募して食べました。','電車を応募して駅に着きました。'],'応募する means apply in response to recruitment or an offer; a job advertisement provides that context.','Application usage'),
('「沈黙」に最も近いのはどれですか。','話さず、黙っていること',['急いで話すこと','大声で笑うこと','人に質問すること'],'沈黙 is silence or remaining silent. It does not tell us by itself why someone is quiet.','Silence paraphrase'),
('二つの製品を比べます。「比べます」の読み方は？','くらべます',['ならべます','えらべます','しらべます'],'比べる is くらべる, compare. 並べる, 選ぶ and 調べる describe different actions.','Comparison reading'),
]
GRAMMAR=[
('形の練習：可能の変化を「ようになった」で表す。漢字を（　）ようになった。','読める',['読んで','読みます','読めて'],'Potential plain 読める attaches to ようになった to describe becoming able to read. The prompt explicitly requests this form.','Ability change'),
('形の練習：自分の目的を「ために」で表す。資料を（　）ために図書館へ行った。','探す',['探して','探します','探せ'],'The deliberate purpose construction takes the dictionary form 探す before ために.','Purpose formation'),
('形の練習：今、作業の途中です。「ているところ」で表す。本を（　）ところです。','読んでいる',['読みます','読んだ','読む'],'読んでいるところ locates the action while it is in progress. The requested stage rules out just-finished or about-to forms.','Action in progress'),
('形の練習：先生から聞いた名詞の情報を「そうです」で伝える。明日は休み（　）そうです。','だ',['な','に','を'],'A reported noun predicate retains だ: 休みだそうです. This is hearsay, not appearance-stem そう.','Reported noun'),
('形の練習：な形容詞「静かだ」に「はず」を付ける。この部屋は静か（　）はずです。','な',['だ','に','を'],'A na-adjective uses な before はず: 静かなはず. This tests attachment, not a guarantee of actual quietness.','Expectation attachment'),
('形の練習：名詞の話題を「について」で表す。新しい計画（　）話します。','について',['をついて','についた','がついて'],'Noun + について marks the topic of discussion. The named form avoids treating equivalent topic expressions as exclusive.','Topic formation'),
('形の練習：「にとって」で立場を示す。初めて読む人（　）、この説明は役に立つ。','にとって',['をとって','がとって','でとって'],'人にとって presents that person’s viewpoint. It is not physical taking with を取って.','Viewpoint attachment'),
('形の練習：決定を「ことになった」で表す。来月から（　）ことになりました。','働く',['働いて','働きます','働いたら'],'The resulting arrangement takes a dictionary or negative verb before ことになる. The past decision does not prove work has already begun.','Arrangement formation'),
('昨日返したので、今は同じ資料を返す必要がありません。「必要がない」に合うのは？','返すことはありません。',['返してはいけません。','返したことがありません。','返さなければなりません。'],'Here ことはない reassures there is no need. Prohibition, lack of past experience and obligation are different.','No need versus prohibition'),
('形の練習：「ば」で条件を作る。静かに聞くなら、「聞く」は（　）になる。','聞けば',['聞くば','聞きば','聞けたば'],'聞く is godan; its e-row base 聞け combines with ば. This tests the named conditional form.','Godan conditional'),
('形の練習：残念な逆接を「のに」で表す。十分に（　）のに、試験では思い出せなかった。','練習した',['練習して','練習します','練習し'],'Past plain 練習した attaches to のに. The sentence contrasts preparation with an unexpected inability to recall.','Concessive attachment'),
('形の練習：名詞の原因を「せいで」で示す。交通事故（　）せいで、到着が遅れた。','の',['な','だ','に'],'Nouns take の before せいで. The sentence attributes a negative result to the accident; it does not prove personal blame.','Cause attachment'),
('形の練習：毎回の出来事を「たびに」で表す。新しい本を（　）たびに、感想を書く。','読む',['読んで','読みます','読め'],'Dictionary 読む attaches to たびに for each occurrence. This is not a single continuous reading interval.','Recurrence formation'),
('形の練習：「がち」で繰り返し起きることを表す。忙しいと、予定を（　）がちだ。','忘れ',['忘れる','忘れた','忘れて'],'がち attaches to a verb masu stem, here 忘れ. It describes a tendency, not a permanent identity or a diagnosis.','Tendency stem'),
('形の練習：自分が読む許可を求める。「読ませてください」の意味は？','私が読んでもよいかというお願い',['相手に必ず読めという命令','私が読むことの禁止','相手がもう読んだという報告'],'The speaker asks to be allowed to read. The causee/actor is the speaker, not an order that the listener read.','Permission actor'),
('「読んじゃった」を普通の長い形にすると？','読んでしまった',['読んでおいた','読んでいる','読まなかった'],'じゃった contracts でしまった here. It can convey completion, with regret depending on context.','Completion contraction'),
('「読んどく」を普通の長い形にすると？','読んでおく',['読んでしまう','読んでいる','読んでみる'],'どく contracts でおく for preparation. It does not express an ongoing state or merely trying.','Preparation contraction'),
('形の練習：より少ないことを「ほど…ない」で表す。AはB（　）重くない。','ほど',['だけで','さえで','ばかりで'],'AはBほど重くない says A is not as heavy as B. The prompt fixes the negative-comparison pattern.','Negative comparison'),
]
READING=[
('ミナさんは次に何をしますか。','確認した範囲を分けて報告します。',['全部問題ないと報告します。','一度も開いていないと報告します。','残りのページを捨てます。'],'Only pages one through five were checked. Mina will report that scope while reserving judgment on the rest.','Reading · evidence scope','ミナさんは新しい資料の一ページから五ページまでを確認した。そこでは数字の間違いは見つからなかったが、六ページ以降はまだ見ていない。「前半は確認済み、後半は未確認」と分けて報告することにした。確認していない部分まで正しいと言うつもりはない。'),
('来週の会はいつ始まりますか。','午後三時',['午後二時','午後四時','午前十一時'],'The notice changes only the room. The previous three-o’clock start remains, while the new room opens at two.','Reading · changed and retained details','来週の読書会は二階の部屋を使う予定でしたが、修理のため三階に変更になりました。開始時刻は予定どおり午後三時です。新しい部屋は二時から開いています。早く来た方は自由に本を読めますが、説明が始まるまでは資料を持ち出さないでください。'),
('ケンさんについて、確かに書かれていることは？','要約を読んだが、記事全部は読んでいません。',['記事を全部読み終えました。','一度も記事に触れていません。','記事は途中でなくなりました。'],'Ken’s correction narrows his claim from reading the article to reading its summary. The whole text is still unread.','Reading · corrected claim','「あの記事、もう読んだ？」と聞かれ、ケンさんは「読んだよ」と答えた。しかし、その後「正確には要約だけ。本文はまだ」と言い直した。話し相手は、感想を聞くのは本文を読んだ後にしようと言った。ケンさんは今夜、残りを読むつもりだ。'),
('筆者が最も大切だと考えているのは？','回数だけでなく、目的に合う練習かを考えること',['毎日同じ速さで読めば必ず上達すること','読めない字をすべて飛ばすこと','本は一度しか読まないこと'],'The writer values purposeful practice and checking where reading becomes difficult, rather than counting repetitions alone.','Reading · main point','以前は同じページを十回読むだけで満足していた。今は回数よりも、どこで止まり、何が読めなかったかを記録している。文字を見てすぐ音にできるようになりたいなら、その目的に合う練習が必要だと思う。回数を増やすだけでは、苦手な箇所に気づけないこともある。'),
('火曜日までにする必要があるのは？','参加するかどうかを連絡すること',['資料を全部返すこと','会場に到着すること','会の感想を書くこと'],'The Tuesday deadline is for attendance confirmation. Materials come Wednesday and the meeting is Thursday.','Reading · deadline','木曜日の説明会に参加したい人は、火曜日の午後六時までに受付へ連絡してください。資料は水曜日にメールで送ります。当日は印刷せず、画面で見てもかまいません。参加できなくなった場合も連絡が必要です。返信がないと資料を送れないので、忘れないようにしてください。'),
('筆者が途中で再生を止めた理由は？','聞き取れなかった一文を確認するため',['作品が嫌いになったため','全員が帰ったため','字幕が消えたため'],'The writer pauses to check one missed line, then returns to the same scene. No dislike or subtitle failure is reported.','Reading · purpose','昨日、短い映画を日本語字幕で見た。最初は止めずに見るつもりだったが、一文だけどうしても聞き取れず、再生を止めた。字幕と音を比べてから同じ場面をもう一度聞いた。その後は最後まで見た。止めた回数より、次には何が聞こえるようになったかを残しておこうと思う。'),
('昨夜のタロウさんの行動は？','雨の中、傘を持って帰りました。',['晴れるまで会社で待ちました。','傘を忘れて家に戻りました。','雨が降る前に帰宅しました。'],'He returned while it was raining, with an umbrella. The expectation of improvement did not match the weather.','Reading · expectation and outcome','天気予報では夜には雨がやむはずだった。しかし、タロウさんが会社を出る時にも降っていた。机の横に置いておいた傘を持って、そのまま帰った。「予報だけを見て傘を家に置いてこなくてよかった」と思った。家に着いてからも、窓の外では雨の音がしていた。'),
('アンさんが決めたことは？','相談してから、どの仕事に応募するか決めます。',['今朝すでに二社で働き始めました。','どの会社にも応募しません。','時給だけを見て仕事を選びました。'],'An has postponed the choice until asking about duties and hours. Looking at advertisements is not an application or employment.','Reading · choice not yet made','アンさんは二つの求人を見つけた。一つは時給が高いが夜遅くまで働く。もう一つは家に近いが、仕事内容がまだよく分からない。どちらに応募するかは、店に相談してから決めることにした。今朝は広告を保存しただけで、まだ応募していない。'),
('この商品の試用について、わかることは？','室内で十分間だけ試しました。',['屋外でも一日試しました。','一か月間ずっと使いました。','ほかの製品より絶対に優れています。'],'The stated test scope is ten minutes indoors. The writer withholds judgment about outdoor conditions and general superiority.','Reading · bounded trial','新しいイヤホンを店内で十分間試した。小さい音でも話が聞きやすかったが、静かな室内での感想だ。外ではまだ使っていないので、電車の音の中でも同じように聞こえるとは言えない。購入は来週、必要な条件をもう一度確認してから決めたい。'),
('借りた道具はいつ返しますか。','練習が終わってから、部屋を出る前に',['練習が始まる前だけ','翌週のいつでも','自宅で使い終わってから'],'Tools are returned after practice but before departure. Borrowing for the room does not grant take-home permission.','Reading · action sequence','練習用の道具は、受付で名前を確認した後に借りられます。部屋の中でだけ使ってください。練習が終わったら、帰る前に受付へ返します。道具を使わない人は借りる必要はありません。初めて参加する方は、使い方を説明しますので開始十分前に来てください。'),
('しーんという文字はこの場面で何を表していますか。','誰も話さなくなった静かな状態',['主人公が自分の名前を言う声','雨が激しく降る音','扉を強く閉める音'],'The printed effect accompanies a silent panel; it is not a character’s spoken name. The next scene does not identify the silence’s cause.','Reading · printed effect','漫画の二つ目のコマには、三人が立っている絵と「しーん」という文字がある。吹き出しはない。前のコマでは質問が出たが、ここでは誰も答えていない。次のコマでは別の人が部屋に入ってくる。三人がなぜ黙ったのかは、そのページだけでは分からない。'),
('筆者は何を変えましたか。','新しい本を読むたびに、同じ記録欄を使います。',['感想を書かず、すべて消します。','毎回違う人に全部読んでもらいます。','難しい本だけを一日に十冊読みます。'],'The writer keeps consistent fields for each new book, making earlier and later reading easier to compare.','Reading · recurring practice','本を読み終えるたびに感想を書いていたが、書く項目は毎回違っていた。そこで、題名、読むのにかかった時間、分からなかった箇所の三つを同じ欄に残すことにした。長い感想が書けない日もあるが、同じ項目なら前の記録と比べやすい。'),
('受付の案内によると、写真を撮ってよいのは？','撮影可の表示がある場所だけ',['建物の中ならどこでも','人の名前がある資料だけ','表示がない場所だけ'],'The sign explicitly limits photography to marked areas. The permission to read records is not permission to photograph them.','Reading · permission scope','展示の資料は自由に読めます。ただし、写真は「撮影可」の表示がある場所だけでお願いします。名前が載った記録は撮影できません。質問がある時は受付で確認してください。館内で読める資料でも、外へ持ち出したり、人に配ったりすることはできません。'),
('来月の開催について、わかることは？','日程はまだ決まっていません。',['今月と同じ日に決まりました。','中止が決定しています。','昨日すでに終わりました。'],'The organiser will consider the next date later. A successful past event does not establish the next meeting date.','Reading · unresolved future','今月の読書会には十五人が参加し、予定した本を最後まで読んだ。主催者は、次回も開きたいと話したが、来月の日程はまだ決めていない。部屋を予約できるか確認した後、参加者に相談するそうだ。今月うまくいったことと、次回が決まっていることは別だ。'),
('去年の人数について、正しいのは？','一昨年より五人増えました。',['一昨年より五人減りました。','今年の定員と必ず同じです。','今年の参加はすでに三十五人です。'],'Last year’s 35 exceeds the year-before 30 by five. This year’s capacity of 20 is a different future quantity.','Reading · quantity and date','地域の会の来場者は、一昨年が三十人、去年が三十五人だった。今年の講座の定員は二十人だが、申し込みはまだ始まっていない。担当者は、過去の来場者数と今年の定員を同じ表に載せる時、見出しを分けることにした。定員だけでは今年の参加者数は分からない。'),
('ミキさんが言いたいことは？','直した後の確認がまだ必要です。',['一度直せば、確認はいりません。','原稿は最初から完成していました。','間違いは一つも直していません。'],'Miki corrected the identified mistake but has not checked whether the revision created another problem. Repair is not the final verification.','Reading · correction and checking','原稿の間違いを見つけ、すぐ直した。友達は「もう大丈夫だね」と言ったが、ミキさんは「直した箇所をもう一度確認してから出したい」と答えた。直す時に別の行が変わっていないかは、まだ見ていないからだ。修正したことと、修正後を確認したことは分けて考えている。'),
('筆者はどんな説明を望んでいますか。','判断の根拠も示す説明',['結果だけを大きな字で書く説明','全員が同じだと決める説明','確認できない原因を言い切る説明'],'The writer wants the grounds and limits behind a conclusion, so the reader can judge it.','Reading · grounds','説明を読む時、結論だけでなく、なぜそう言えるのかも知りたい。三人に聞いた結果なら、三人の意見だと書いてほしい。全員の考えだとまとめられると、根拠が分からなくなる。どこまで確認したのかが示されていれば、自分でもその説明を判断しやすい。'),
('午前中だけ参加でき、料金を払いたくない人に合うのは？','九時からの自由展示',['午後一時からの有料講座','午後三時からの予約相談','夕方の有料発表会'],'The only morning and free activity is the exhibition. The alternatives fail the time or cost requirements.','Reading · information retrieval','土曜日の自由展示は九時から十二時までで無料です。講座は午後一時から二時、五百円で前日までに申し込みが必要です。予約相談は午後三時、発表会は夕方六時から千円です。展示を見るだけなら申し込みはいりません。講座と相談には定員があるので、受付に確認してください。'),
]
EXAM_V=[
('施設は駅の隣にあります。「施設」の読み方は？','しせつ',['しせっ','せしつ','しぜつ'],'施設 is しせつ, a facility. It is not the reversed sequence せしつ.','Vocabulary · facility reading'),
('合計は四十人でした。「合計」の読み方は？','ごうけい',['こうけい','ごうかい','がっけい'],'合計 is ごうけい: the total. Both components retain their standard compound reading.','Vocabulary · total reading'),
('頭が少し痛いので、今日は＿＿帰ります。普段より早く休みたいです。','早めに',['詳しく','静寂に','有料に'],'早めに means on the early side, matching the explicitly earlier departure. The stated headache does not establish any diagnosis.','Vocabulary · earlier timing'),
('三日前より人数が少なくなりました。この変化は？','減少',['増加','先着','取材'],'減少 is a decrease; 増加 is the opposite. Here the compared quantity and dates are explicit.','Vocabulary · decrease'),
('「主催」に合う使い方はどれですか。','大学が読書会を主催します。',['机が鉛筆を主催します。','傘を主催して雨を止めます。','資料を主催して紙に書きます。'],'A university can organise a reading event. The other options do not give an organising agent and event.','Vocabulary · organiser usage'),
('「内訳」は何を示しますか。','全体を分けた各部分の内容',['明日の天気だけ','会場への最短の道','次の人の名前だけ'],'内訳 is an itemised breakdown, such as counts by morning and afternoon within a total.','Vocabulary · breakdown paraphrase'),
('駅で友達を見つけて、＿＿笑いました。','にっこり',['しーん','ざあざあ','がたがた'],'にっこり笑う describes a smile. The other effects do not describe that action in this sentence.','Vocabulary · smile combination'),
('仕事の求人に応募しました。「応募」の読み方は？','おうぼ',['おぼう','おうほ','おうもう'],'応募 is おうぼ: applying or entering in response to an offer. Preserve the long initial おう.','Vocabulary · application reading'),
]
EXAM_G=[
('形の練習：「ところ」で直前を表す。これから資料を（　）ところです。','読む',['読んだ','読んでいる','読んでいた'],'Dictionary 読むところ locates the action just before starting. The other stages conflict with the requested direct-before meaning.','Grammar · about to act'),
('「見ちゃった」を普通の長い形にすると？','見てしまった',['見ておいた','見ている','見なかった'],'ちゃった contracts てしまった. Preparatory, ongoing and negative forms mean different things.','Grammar · te contraction'),
('形の練習：「気味」を付ける。最近、少し（　）気味です。','疲れ',['疲れる','疲れた','疲れて'],'気味 attaches to a masu stem, here 疲れ, to describe a slight state. This is formation practice rather than a diagnosis.','Grammar · slight state'),
('形の練習：名詞「先生」のような様子を「っぽい」で表す。（　）話し方だ。','先生っぽい',['先生っぽくな','先生だっぽい','先生のっぽい'],'Noun + っぽい produces an i-adjective. This perceived trait does not establish that the person is actually a teacher.','Grammar · likeness attachment'),
('形の練習：名詞による恩恵を「おかげで」で表す。友達（　）おかげで、道が分かった。','の',['な','だ','に'],'A noun takes の before おかげで. The positive outcome is learning the route with the friend’s help.','Grammar · benefit attachment'),
('「昨日、待たされた」は誰の経験ですか。','話し手が待つようにさせられた。',['話し手が相手を待たせた。','話し手が待つ許可を出した。','話し手が誰にも待たず帰った。'],'待たされた is the contracted godan causative-passive of 待つ: the speaker was made to wait. It is not causative 待たせた.','Grammar · causative-passive actor'),
('形の練習：名詞の反復を「たびに」で表す。会議（　）たびに、要点を残します。','の',['な','だ','を'],'A noun takes の before たびに. The action occurs each time a meeting takes place.','Grammar · noun recurrence'),
('形の練習：締め切りを「までに」で示す。金曜日の五時（　）提出してください。','までに',['からに','の間で','よりに'],'までに gives the completion deadline. This is not a continuous interval or a start time.','Grammar · completion deadline'),
]
EXAM_R=[
('筆者が変えようとしていることは？','読んだ冊数だけでなく、読めなかった箇所を残すこと',['読んだ本を全部捨てること','毎日本の題名だけを忘れること','知らない字を二度と見ないこと'],'The writer keeps the quantity record but adds specific obstacles so practice can be better directed.','Reading · purpose of record','毎月、読んだ本の冊数を数えていた。しかし、数が増えても、同じ漢字で止まることが多かった。そこで今月から、分からなかった箇所も記録することにした。冊数を残すのをやめるわけではない。何を練習すれば読みやすくなるかを考えるために、別の情報を加えるのだ。'),
('予定どおりなのはどれですか。','開始時刻',['会場','資料を配る日','申込期限'],'Only the start remains at four. The venue, materials date and deadline were changed explicitly.','Reading · update retrieval','来週の説明会について変更があります。会場は本館から別館に、資料を配る日は月曜日から火曜日になりました。申し込みの期限は水曜日の正午に延びました。開始時刻は変更せず、金曜日の午後四時です。以前の案内を持っている方は、変更した三つの点を確認してください。'),
('金曜日の時点で確かに行われたのは？','会場の予約',['土曜日の朗読会','来月の同じ会','参加者全員の来場'],'The hall was reserved Wednesday. The reading event is still tomorrow and the next meeting is undecided.','Reading · past and future','水曜日、主催者は土曜日の朗読会のために会場を予約した。金曜日の今日、参加者に確認メールを送っている。明日は十時に始まる予定だが、まだ全員が来ると決まったわけではない。来月も開くかどうかは、今回の後に相談するそうだ。'),
('写真について案内が認めていることは？','自分の作品だけ撮影すること',['ほかの人の作品を全部撮ること','名前のある記録を撮ること','すべてを外へ配ること'],'The notice explicitly permits photographing one’s own work and excludes others’ work and named records.','Reading · limited permission','今日の作業で作った自分の作品は写真を撮ってもかまいません。ただし、ほかの人の作品と、名前が載っている記録は撮影しないでください。使った道具は最後に返します。作品は持ち帰れますが、記録はこの部屋に残します。分からない場合は担当者に確認してください。'),
('昨年の午後の人数は午前と比べてどうでしたか。','十人少なかった。',['十人多かった。','同じだった。','今年の定員と比べて五人多かった。'],'Morning 25 minus afternoon 15 is ten. The current capacity of 12 is separate and cannot answer the past morning/afternoon comparison.','Reading · comparison','昨年の展示には午前二十五人、午後十五人が来た。合計は四十人だった。今年は別の部屋で講座も開くことになり、その定員は十二人である。まだ応募が始まっていないため、今年何人が来るかは分からない。人数を比べる時は、どの年のどの活動かを確認してほしい。'),
('ナオさんが資料をもう一度読むのはなぜですか。','要約に書かれていない条件を確かめるため',['本文を初めて書き直すため','資料が全部なくなったため','友達の名前を消すため'],'Nao found that the summary omitted a condition. She will check the original text rather than assuming the brief account covers everything.','Reading · reason to reread','友達が資料を短くまとめてくれたので、ナオさんは最初、その要約だけで十分だと思った。ところが、本文を見ると、申し込める人についての条件があった。要約にはその部分がない。ナオさんは、応募する前に本文をもう一度読み、条件を確認することにした。'),
('三人の意見について、筆者の考えに合うのは？','三人にとって便利でも、全員に同じとは限らない。',['三人が使えれば全員に便利だ。','便利だと言った人は一人もいない。','利用者全員にすでに聞いた。'],'Three positive responses support only those three viewpoints; the writer explicitly avoids extending them to everyone.','Reading · survey scope','新しい予約の方法について、三人の利用者に聞いた。三人とも「以前より便利だ」と答えた。ただし、ほかの人にはまだ聞いていない。担当者は、便利だという声があったことを報告しながら、全員が同じように考えているとは書かなかった。今後は別の利用者にも聞きたいという。'),
('土曜日の午前十一時に、申し込みなしで利用できるのは？','無料展示',['有料講座','予約相談','日曜日の朗読会'],'The free exhibit runs 10–12 Saturday with no application. The lecture requires prior application, consultation is afternoon, and there is no Sunday event.','Reading · schedule and prerequisites','土曜日は無料展示を十時から十二時まで開きます。申し込みはいりません。有料講座は十一時からですが、金曜日までに応募した方だけが参加できます。予約相談は午後二時、定員五人です。日曜日は会場を閉めます。展示だけを見る方は、当日受付で名前を伝えてください。'),
]

def compile_rows(rows,stage,letter,start):
    result=[]
    for n,row in enumerate(rows,start):
        prompt,right,wrong,explanation,focus,*passage=row
        assert len(wrong)==3 and len(set([right]+wrong))==4
        answer=(n-1)%4; options=list(wrong);options.insert(answer,right)
        q=dict(id=f'n3-{letter}{n:02}',level='N3',stage=stage,prompt=prompt,options=options,answer=answer,explanation=explanation,focus=focus)
        if passage:q['passage']=passage[0]
        if stage=='exam':q['section']=focus.split(' · ')[0].lower()
        result.append(q)
    return result

def main():
    assert all(len(rows)==18 for rows in [VOCAB,GRAMMAR,READING])
    assert all(len(rows)==8 for rows in [EXAM_V,EXAM_G,EXAM_R])
    p=ROOT/'content/jlpt/questions.json';original=json.loads(p.read_text(encoding='utf-8'))
    legacy={f'n3-{k}{i}' for k,count in [('v',2),('g',2),('r',2),('e',6)]for i in range(1,count+1)}
    kept=[q for q in original if q['level']!='N3' or q['id'] in legacy]
    result=kept+compile_rows(VOCAB,'vocabulary','v',3)+compile_rows(GRAMMAR,'grammar','g',3)+compile_rows(READING,'reading','r',3)+compile_rows(EXAM_V+EXAM_G+EXAM_R,'exam','e',7)
    assert len([q for q in result if q['level']=='N3'])==90
    assert all(next(q for q in result if q['id']==old['id'])==old for old in original if old['level']!='N3' or old['id'] in legacy)
    p.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    p=ROOT/'content/jlpt/bank-sizes.json';sizes=json.loads(p.read_text(encoding='utf-8'));sizes['N3']=dict(vocabulary=20,grammar=20,reading=20,exam=30);p.write_text(json.dumps(sizes,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('N3: 60 checkpoints + 30 distinct samples; historical items unchanged.')
if __name__=='__main__':main()
