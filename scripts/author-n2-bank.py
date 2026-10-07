"""Original N2 written practice, internally reviewed 2026-10-07; native review pending.
Historical IDs/options/answers must remain byte-equivalent as objects.
Supplemental short tasks, not calibrated exams or official level assignments.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
# prompt, correct option, three distractors, explanation, focus, optional passage
VOCAB=[
('資料の概要をまとめました。「概要」の読み方は？','がいよう',['かいよう','がいよ','がいゆう'],'概要 is がいよう, an outline or overview. Both がい and よう are retained.','Overview reading'),
('期限を延長しました。「延長」の読み方は？','えんちょう',['えんじょう','いんちょう','えんしょう'],'延長 is えんちょう, extension. It is not 炎上 or 院長.','Extension reading'),
('申請書を提出してください。「申請」の読み方は？','しんせい',['しんしょう','もうせい','しんぜい'],'申請 is しんせい, an application or request for authorisation.','Application reading'),
('静かな環境で働きたい。「環境」の読み方は？','かんきょう',['かんぎょう','かんけい','かんこう'],'環境 is かんきょう, environment. 関係 and 観光 are different words.','Environment reading'),
('料金には税金が含まれます。「含まれます」の読み方は？','ふくまれます',['ふくめます','つつまれます','ふまれます'],'含まれる is ふくまれる, be included; 含める is a different verb form.','Included reading'),
('相手の提案を承認しました。「承認」の読み方は？','しょうにん',['しょうねん','じょうにん','せいにん'],'承認 is しょうにん, approval or recognition. Keep しょう and にん.','Approval reading'),
('議論の根拠を確認しました。「根拠」の読み方は？','こんきょ',['こんこ','ねきょ','こんぎょ'],'根拠 is こんきょ, a basis or grounds for an argument.','Grounds reading'),
('複数の案を比較します。「比較」の読み方は？','ひかく',['びかく','ひこう','ひがく'],'比較 is ひかく, comparison; the first consonant is h, not b.','Comparison reading'),
('この変更の影響を調べます。「影響」の読み方は？','えいきょう',['えいこう','えきょう','えいぎょう'],'影響 is えいきょう, influence or an effect. 営業 is えいぎょう.','Effect reading'),
('施設の維持に費用がかかる。「維持」の読み方は？','いじ',['いち','ゆいじ','いし'],'維持 is いじ, maintenance or keeping something in its existing state.','Maintenance reading'),
('会議で意見が分かれたので、結論は次回に（　）した。','持ち越すことに',['見落とすことに','乗り越えることに','取り戻すことに'],'持ち越す postpones an unresolved matter to a later occasion. 次回 and the divided opinions supply the context.','Carry-over collocation'),
('新しい案には賛成です。ただし、費用について一つ（　）があります。予算を超えないか心配です。','懸念',['歓迎','恩恵','承認'],'懸念 means concern. The following sentence specifies worry about exceeding the budget.','Concern in context'),
('話し合いの前に、参加者へ資料を（　）した。全員に一部ずつ渡した。','配布',['廃止','中断','採用'],'配布 is distribution. The second sentence makes giving each participant a copy explicit.','Distribution context'),
('人数ではなく、一人一人の話を詳しく聞く調査をした。「詳しく」に近いのは？','細かいところまで',['急いで終わらせて','順序を逆にして','同じ言葉だけで'],'詳しく concerns detail, not speed, reverse order or verbatim repetition.','Detail paraphrase'),
('この文では、調査の「対象」を十代の利用者に限っている。「対象」とは？','調べる相手や範囲',['調査を終える時刻','使う紙の厚さ','必ず得られる答え'],'Here 対象 names the people or scope studied, not a time, material or guaranteed conclusion.','Target in context'),
('「手間を省く」に最も近い意味は？','作業に必要な労力を減らす',['仕事の人数を必ず増やす','完成した物をすべて捨てる','費用を知らせない'],'手間 is the effort or work involved; 省く omits or reduces it. It does not necessarily change staffing.','Effort collocation'),
('「見直す」を自然に使った文はどれですか。','結果が悪かったので、計画を見直しました。',['駅まで見直して、電車に乗りました。','コップを見直して、お茶を飲みました。','弟を見直して、三人にしました。'],'In this sentence, 見直す means reconsider or review the plan because the result was poor.','Review usage'),
('「補う」を自然に使った文はどれですか。','不足している説明を、図で補いました。',['予定の時刻を補って、遅れました。','窓を補って、景色を見ました。','食事を補って、皿を洗いました。'],'補う fills a lack. The missing explanation is supplemented with a diagram.','Supplement usage'),
]
GRAMMAR=[
('形の練習：「に際して」で行事と注意を結ぶ。会場を（　）に際して、利用規則を確認した。','予約する',['予約したの','予約して','予約します'],'Dictionary verb + に際して: 予約するに際して. The final past tense does not change this attachment.','Occasion attachment'),
('形の練習：「にあたって」で準備を述べる。店の開店（　）、スタッフ全員で打ち合わせた。','にあたって',['をあたって','のあたって','があたって'],'Event noun + にあたって attaches directly. Similar occasion expressions may overlap; this prompt requests the named construction.','Undertaking attachment'),
('形の練習：「に限らず」で範囲を広げる。学生（　）、社会人も参加できます。','に限らず',['を限らず','が限らず','の限らず'],'Noun + に限らず includes cases beyond the noun, here working adults as well as students.','Inclusive scope'),
('形の練習：「かねる」で難しい対応を丁重に断る。今すぐのお返事は（　）かねます。','いたし',['いたす','いたした','いたして'],'Verb masu stem + かねる: いたし + かねます. Here the speaker politely says an immediate answer is difficult.','Polite difficulty stem'),
('形の練習：「ないこともない」で可能性を控えめに認める。時間を変えれば、参加（　）こともない。','できない',['できなく','できず','できます'],'Negative plain できない + こともない cautiously admits participation may be possible. It is not a commitment.','Qualified possibility'),
('形の練習：「をもとにした」で名詞を修飾する。昔の写真（　）映像です。','をもとにした',['をもとにしての','をもとにするの','をもとに'],'をもとにした modifies 映像. This asks for the named source-material modifier, not an exclusive choice among equivalent source expressions.','Source modifier'),
('形の練習：「をめぐる」で名詞を修飾する。跡地の利用（　）議論が続いている。','をめぐる',['をめぐって','をめぐりの','をめぐるの'],'Noun + をめぐる modifies 議論. をめぐって can connect to a predicate but is not the requested noun modifier here.','Issue modifier'),
('形の練習：「を通じて」で仲介を示す。友人（　）、その先生に連絡した。','を通じて',['に通じて','が通じて','の通じて'],'Noun + を通じて marks the intermediary, here a friend. The named form avoids a false contrast with を通して.','Intermediary attachment'),
('形の練習：な形容詞「便利だ」を「一方で」に付ける。この道具は便利（　）一方で、手入れに時間がかかる。','な',['だ','に','を'],'A na-adjective uses な before 一方で: 便利な一方で. The two clauses discuss different aspects.','Na-adjective contrast'),
('形の練習：「に応じて」で条件に合わせた変化を示す。参加人数（　）、部屋の広さを変える。','に応じて',['を応じて','が応じて','の応じて'],'Noun + に応じて means according to or in response to that condition; the room changes with the number.','Condition-responsive change'),
('形の練習：「だけに」で理由と結果を強く結ぶ。準備に時間を（　）だけに、中止が残念だ。','かけた',['かけて','かけます','かけたら'],'Plain past かけた attaches to だけに. The preparation effort makes the disappointment particularly strong.','Reason attachment'),
('形の練習：名詞「初めて」を「にしては」に付ける。初めて（　）、とても上手にできた。','にしては',['をしては','がしては','のしては'],'Noun + にしては compares the result with what that circumstance might suggest.','Against-expectation attachment'),
('形の練習：「わけにはいかない」で状況上の制約を述べる。約束したので、途中で（　）わけにはいかない。','帰る',['帰って','帰ります','帰り'],'Dictionary verb + わけにはいかない: leaving is constrained by the promise, not stated to be physically impossible.','Situational constraint'),
('形の練習：「にすぎない」で限定する。これは私個人の感想（　）。','にすぎません',['をすぎません','がすぎません','のすぎません'],'Noun + にすぎない limits the statement to a personal impression. It does not deny having that impression.','Limitation attachment'),
('形の練習：「かどうか」で疑問を文に組み込む。この案が実現できる（　）、調べている。','かどうか',['をどうか','がどうか','のどうか'],'A plain predicate + かどうか embeds whether the proposal is feasible. The investigation has not yet resolved it.','Embedded uncertainty'),
('顧客に、自分が資料を見たことを伝える。最も合う文は？','資料を拝見しました。',['資料をご覧になりました。','資料をお読みになってください。','資料をご覧になりますか。'],'拝見 is the speaker’s own humble act of looking. The other forms refer to or request the respected listener’s action.','Keigo actor'),
('社外の人に、自分の会社の部長が不在だと伝える。適切なのは？','部長の松本は、ただいま席を外しております。',['松本部長様は、ただいまいらっしゃいません。','部長の松本様は、ただいまいらっしゃいません。','部長の松本は、ただいま席を外してくださいます。'],'In this external own-company reference, use the role plus name without elevating the own-side colleague; おります is suitable for the speaker’s side.','External own-side reference'),
('面接で相手の会社を指す。通常の話し言葉に合うのは？','御社',['弊社','当社','自社'],'御社 addresses the listener’s company in the stated spoken interview. 弊社, 当社 and 自社 refer to one’s own company.','Spoken company reference'),
]
EXAM_V=[
('担当業務を引き継ぎます。「引き継ぎます」の読み方は？','ひきつぎます',['ひきづきます','いんきつぎます','ひきすぎます'],'引き継ぐ is ひきつぐ, take over or hand over a responsibility.','Vocabulary · handover reading'),
('計画を再検討します。「再検討」の読み方は？','さいけんとう',['ざいけんとう','さいげんとう','さいけんどう'],'再検討 is さいけんとう, reconsideration.','Vocabulary · reconsideration reading'),
('品物の品質を確認した。「品質」の読み方は？','ひんしつ',['ひんじつ','しなしつ','ひんせつ'],'品質 is ひんしつ, the quality of the goods. The second part is しつ, not じつ or せつ.','Vocabulary · quality reading'),
('次の案内は、予定が（　）次第お送りします。まだ日程を決めている途中です。','確定し',['通勤し','返品し','退職し'],'確定する means be settled or finalised; the schedule is still being decided.','Vocabulary · finalising a schedule'),
('会場が使えなくなったため、別の場所を（　）しています。まだ一つに決めていません。','検討',['断定','放置','承認'],'検討 means consider or examine. The explicit lack of a decision rules out treating the place as already approved.','Vocabulary · consideration'),
('同じ内容を二度書いていたので、重複する部分を削った。「重複する」に近いのは？','同じことが重なっている',['内容がすべて反対である','文字が一つもない','時刻だけが違っている'],'重複 describes duplication or overlap; here the same content appears twice.','Vocabulary · duplication paraphrase'),
('「負担」を自然に使った文はどれですか。','一人に仕事が集中し、その人の負担が増えました。',['部屋の負担を開けて、外へ出ました。','予定を負担して、手帳に書きました。','飲み物を負担して、コップに入れました。'],'負担 is a burden. Concentrating work on one person increases that person’s burden.','Vocabulary · burden usage'),
('「手順」とは、この説明で何を指しますか。まず受付、次に支払い、最後に受け取りです。','作業を行う順番',['商品の色','利用者の気持ち','建物の高さ'],'手順 refers to the sequence of steps, explicitly reception, payment and collection here.','Vocabulary · procedure meaning'),
]
EXAM_G=[
('形の練習：「末に」で長い検討の結果を示す。何度も（　）末に、延期を決めた。','話し合った',['話し合って','話し合います','話し合ったら'],'Verb past + 末に gives the result reached after that process.','Grammar · result after deliberation'),
('形の練習：「にかかわらず」で条件の不問を示す。経験の有無（　）、応募できます。','にかかわらず',['をかかわらず','がかかわらず','のかかわらず'],'Noun + にかかわらず removes the stated condition as a restriction.','Grammar · regardless of experience'),
('形の練習：「わけではない」で全面的な否定を避ける。全部の内容が（　）わけではないが、大事な点は理解した。','分かった',['分かって','分かります','分かり'],'Plain 分かった attaches to わけではない. The sentence denies complete understanding while retaining the important points.','Grammar · partial understanding'),
('形の練習：「に伴って」で同時に進む変化を示す。利用者の増加（　）、待ち時間も長くなった。','に伴って',['を伴っての','が伴って','の伴って'],'増加に伴って means along with the increase. を伴って would require a different sentence structure.','Grammar · accompanying change'),
('形の練習：「たところ」で試した結果を示す。設定を変えて（　）ところ、音が聞こえるようになった。','みた',['みて','みます','みれば'],'Past みた + ところ introduces the result observed after trying.','Grammar · discovered result'),
('形の練習：「ことなく」で否定した動作を結ぶ。彼は一度も（　）ことなく、説明を最後まで聞いた。','話す',['話して','話します','話さなく'],'Dictionary verb + ことなく means without doing that act; he listened without speaking.','Grammar · without doing'),
('取引先に、自分が明日訪問すると伝える。適切なのは？','明日、伺います。',['明日、いらっしゃいます。','明日、お越しになります。','明日、お見えになります。'],'伺う can express the speaker’s respectful visit to the client. The other choices elevate the visiting person.','Grammar · visiting actor'),
('形の練習：「ものではない」で安易な一般化を否定する。一度の失敗で、その人の能力を（　）ものではない。','決める',['決めて','決めます','決めたら'],'Dictionary 決める + ものではない advises against judging ability from a single failure.','Grammar · reject hasty judgment'),
]
READING=[
('筆者が朝に練習する曲を変えた理由は？','限られた時間で難しい部分を練習するため',['全部の曲を忘れたため','夜の練習を完全にやめるため','短い曲だけが好きになったため'],'The writer isolates difficult passages to make a short morning session useful; whole pieces are still played at night.','Practice priorities','仕事に出る前の十分間、好きな曲を最初から弾いていた。しかし、途中で時間切れになり、後半の苦手なところまで進めない日が多かった。そこで朝は、難しい二小節だけを繰り返すことにした。曲全体は夜に弾く。短い時間でも、練習する場所を先に決めておけば、ただ途中まで弾くより役に立つ。朝の十分間を長くする必要はなかった。'),
('この案内によると、予約済みの人は何をする必要がありますか。','利用日前日までに新しい入口を確認する',['全員予約を取り直す','当日の入口で追加料金を払う','西側の入口だけを使う'],'Existing bookings remain valid. The notice asks users to check the new east entrance by the previous day; it does not impose a new fee.','Notice action','来月から会議室への入口を変更します。工事中の西側入口は使えませんので、東側入口からお入りください。すでにいただいた予約は有効で、取り直す必要はありません。ただし、東側への行き方を知らない方は、利用日の前日までにウェブサイトの地図をご確認ください。室内の設備と利用料金には変更がありません。'),
('筆者は借りた本について、どのように考えていますか。','読み切れなくても、気になった箇所から学べる',['最後まで読まなければ何も残らない','借りた本はすべて買うべきだ','読んだページ数だけが大切だ'],'The writer rejects treating an unfinished book as wasted time and values useful passages encountered.','Value of partial reading','借りた本を最後まで読めないと、以前は時間を無駄にした気がした。今は、途中で読むのをやめても、気になった一節をノートに残す。後日、その一節が別の本を理解する助けになることがある。もちろん、最後まで読む楽しさもある。ただ、読み終えたかどうかだけで、本から何を得たかを決める必要はないと思う。'),
('メールの送り手が求めているのは？','開催日と参加費の確認結果を今日中に返す',['写真の差し替えも今日中に終える','すべての文章を書き直す','完成した原稿をもう一度送る'],'The immediate request is checking the two figures. Replacing photographs can wait until tomorrow; publication waits for checking.','Email priority','原稿をお送りいただき、ありがとうございます。写真の差し替えについては、明日でも間に合います。先に、本文にある開催日と参加費の二つの数字をご確認いただけますか。掲載する前に正しい内容を確定したいので、数字についてだけ本日中にご返信ください。ほかの文章を書き直していただく必要はありません。確認後、こちらで修正します。'),
('AとBに共通する考えは？','情報を見つけることと理解することは同じではない',['検索はすべてやめるべきだ','辞書を見れば必ず覚えられる','知らない言葉は無視すればよい'],'A distinguishes finding an answer from explaining it; B distinguishes obtaining a definition from understanding a sentence. Both separate retrieval and understanding.','Integrated viewpoints','【A】検索すれば答えがすぐ見つかる。しかし、見つけた答えを自分の言葉で説明できるとは限らない。私は、答えを読む前に、自分がどこで困ったかを書くようにしている。\n【B】知らない言葉を辞書で調べることは大切だ。ただ、その意味をコピーしただけで、読んでいた文が分かるとは限らない。意味を確かめたら、元の文に戻って読み直す必要がある。'),
('店が今回の変更で優先したことは？','利用者が入りやすい時間帯を用意すること',['毎日できるだけ長く開けること','すべての利用者に同じ時刻を指定すること','昼休みをなくすこと'],'The shop chooses a once-weekly early opening based on access, rather than extending every day or dictating one time for all.','Service decision','ある店は営業時間を延ばす案を考えていたが、利用者に聞くと、夕方より朝に寄りたいという声が多かった。そこで、閉店を遅くする代わりに、週に一日だけ開店を早めることにした。毎日長く開けるのではなく、必要とされる時間を選んだのである。まず一か月試し、実際の利用状況を見てから続けるかどうかを決める。'),
('筆者が写真を残す方法を変えた目的は？','あとでどこで撮ったか思い出せるようにする',['写真の数を必ず減らす','文字だけで旅行を記録する','撮った写真を全部公開する'],'Adding location and a brief reason helps retrieve memories later. The passage does not require fewer photographs or public posting.','Record purpose','旅行先で多くの写真を撮っても、数年たつと、どこで撮ったのか分からなくなることがあった。そこで最近は、その日のうちに場所と短い一言を写真に添えている。上手な文章でなくてもよい。「この角を曲がったら海が見えた」と書いておくだけで、後から景色だけでなく、その時の気持ちも思い出しやすくなる。写真を撮る枚数は変えていない。'),
('参加者が当日持ってくるものは？','修理したい物と、あればその説明書',['完成した作品だけ','会場の工具を自宅から借りてきた物','新品の部品を必ず二つ'],'The object is required; its instruction booklet is requested only if available. Tools are provided, and repair may not be possible.','Conditional requirements','修理を試してみる会を土曜日に開きます。直したい物を一つお持ちください。説明書をお持ちの方は、それもご持参ください。工具はこちらで用意します。部品が必要になった場合は、次の方法を一緒に考えますので、先に買う必要はありません。すべての物を当日直せるとは限りませんが、状態を確認し、できる作業を試します。'),
('筆者が昼休みに外へ出るようになったのは？','午後の仕事に戻る前に気分を切り替えるため',['仕事の量を必ず半分にするため','職場で食事を取れなくなったため','運動の記録を毎日増やすため'],'A brief change of surroundings helps the writer reset before afternoon work; it does not guarantee reduced workload or require exercise tracking.','Personal routine','忙しい日は、昼休みも机に向かっていた。そのほうが仕事が進むと思っていたのだ。ところが、午後になると同じ文を何度も読み直し、かえって時間がかかっていた。今は昼食の後、十分だけ外へ出る。歩く速さや距離を測るわけではない。外の空気に触れてから戻ると、午前中の作業から気持ちを切り替えやすい。'),
('AとBの意見の違いは？','Aは公開前の整理を、Bは話してからの整理を重視する',['Aは質問を禁止し、Bは記録を禁止する','Aは何も準備せず、Bは一切話さない','二人とも完成した案だけを話すべきだと言う'],'A values ordering ideas before presenting them; B uses conversation to discover what needs clarification. Neither prohibits preparation or questions.','Compare working methods','【A】案を人に説明する前に、要点を三つにまとめている。まだ迷っていることも、どこが未定かを整理してから話したほうが、相手が質問しやすいと思う。\n【B】私は、考えがまとまらない時こそ人に話す。相手の質問を聞いて、自分が説明できていない部分に気付くことがある。その後で、要点を整理して書き直す。'),
('案内で返却が必要なのは？','受付で借りた名札',['自分が作った作品','持参したノート','会場で配られた案内紙'],'The badge is loaned and must be returned at the exit; the work may be taken home. The notebook is brought by the participant.','Borrowed versus owned','工作教室に参加する方は、受付で名札を受け取ってください。作品はお持ち帰りいただけますが、名札は貸出用ですので、帰る際に出口の箱へお戻しください。案内紙は持ち帰ってもかまいません。作業の内容を記録したい方は、ご自分のノートをご持参ください。道具の使い方は開始時に説明します。'),
('変更後も以前と同じなのは？','申し込みの締め切り',['集合場所','開始時刻','配布方法'],'Only the application deadline remains Wednesday at noon; meeting place, start time and distribution method all change.','Updated information','来週の見学会について変更をお知らせします。集合場所は駅前から施設の入口に、開始は十時から十時半になりました。資料は当日配る代わりに、前日にメールで送ります。申し込みの締め切りは、これまでの案内どおり水曜日の正午です。以前の案内を保存している方は、集合場所と開始時刻を特にご確認ください。'),
('筆者が料理の手順を紙に書いた理由は？','画面を触らずに次の作業を確認するため',['材料を買う量を二倍にするため','動画の作り方を批判するため','すべての料理を同じ味にするため'],'The paper solves the practical problem of touching the screen with wet hands. The writer still uses the video to learn unfamiliar motions.','Practical adaptation','料理の動画を見ながら作ると、手が濡れたまま画面を触らなければならないことがある。それが不便で、最近は作る前に手順を短く紙に書いている。知らない切り方などは、先に動画で確かめる。料理中は紙を見れば次の作業が分かるので、何度も動画を止める必要がない。動画を使わなくなったのではなく、使う場面を分けたのである。'),
('この調査について、本文が述べているのは？','回答した人では、新しい表示を好む人が多かった',['利用者全員が新しい表示を選んだ','古い表示を選んだ人は一人もいない','すべての利用者に質問し終えた'],'Most respondents preferred the new display; nonrespondents and those preferring the old one are explicitly present.','Survey scope','新しい案内表示について、会場で利用者四十人に質問した。三十人は新しい表示、七人は以前の表示を選び、三人はどちらでもよいと答えた。担当者は、新しい表示を選んだ人が多かったと報告した。ただし、会場に来なかった利用者には聞いていないため、全員の好みが分かったとは書かなかった。今後は別の日にも意見を聞く予定だ。'),
('筆者が失敗の記録に加えたのは？','やり直す時に何を変えるか',['失敗した相手の名前だけ','自分への悪口','成功したことを消す方法'],'The new entry links a difficulty to a concrete next attempt. The writer still records successes and avoids stopping at self-criticism.','Reflective practice','作業がうまくいかないと、以前は「自分は苦手だ」とだけノートに書いていた。読み返しても、次にどうすればよいか分からない。そこで今は、止まった箇所と、やり直す時に変えることを書くようにした。うまくいった工夫も残す。失敗を忘れるためではなく、同じところで止まらないための記録にしたい。'),
('図書館の担当者が提案した試行は？','来月の水曜日だけ閉館を一時間遅らせる',['毎日閉館を二時間遅くする','利用者の意見を一切聞かない','今の開館時間をすべて廃止する'],'The proposed trial closes one hour later on Wednesdays next month. It is not yet decided; the conditional plan also records use and staff workload.','Proposal versus decision','図書館では、閉館を遅くしてほしいという意見が出ている。しかし、毎日時間を延ばすには人員が足りない。担当者は、来月の水曜日だけ一時間遅く閉める案を出した。まだ決定ではないが、実施できれば、利用者数と職員の負担を記録するという。その結果を見て、時間を延ばす日を増やすか、元に戻すかを相談する。'),
('このメールで、送り手がまだ約束していないのは？','追加分を無料で作ること',['追加料金を確認すること','金曜日までに返信すること','元の注文を進めること'],'The original order continues, and the price check/reply deadline are promised; making the extra copies free is explicitly unconfirmed.','Commitment boundaries','ご注文の五十部は、予定どおり進めております。追加の十部については、同じ用紙を用意できるか、また追加料金がいくらになるかを確認中です。確認結果は金曜日までにご連絡いたします。追加分を無料でお作りできるかは、現時点ではお約束できません。料金をご確認いただいてから、追加するかどうかをお決めください。'),
('筆者の考えに最も近いのは？','便利な仕組みでも、必要な時に人が相談に乗れることが大切だ',['説明書は全部なくすべきだ','質問する人はサービスを使えない','機械が便利なら人の対応は不要だ'],'The writer values the self-service mechanism while keeping human help available when the instructions do not resolve a problem.','Main claim','予約を自分で変更できる仕組みは便利だ。電話を待たずに済み、担当者の仕事も減るだろう。ただ、説明を読んでも分からない人や、表示にない事情を相談したい人はいる。仕組みが便利になったからこそ、困った時に人へつながる道も残しておきたい。すべてを人が対応する必要はないが、相談の入口までなくしてよいとは思わない。'),
]
EXAM_R=[
('予約者が金曜日までに送るのは？','参加人数',['全員の感想','完成した作品','当日の写真'],'Only headcount is due Friday. Names are checked on arrival; photos are optional after the workshop.','Reading · deadline retrieval','来週の教室をご予約の方は、金曜日までに参加人数をお知らせください。名前は当日受付で確認しますので、今お送りいただく必要はありません。作品はその日に作り、お持ち帰りいただけます。写真を送る場合は教室が終わってからで結構ですが、送らなくても参加できます。人数の変更があれば、受付へご連絡ください。'),
('筆者が本の選び方を変えた目的は？','読み続けやすい本を自分で確かめるため',['評判のよい本を一切読まないため','毎月同じ本だけを買うため','難しい本の名前を集めるため'],'The writer samples the text to check personal readability; recommendations remain useful, but are not the only criterion.','Reading · selection purpose','評判のよい本なら自分も読みたくなると思っていた。しかし、買っても最初の数ページで止まることがあった。今は、勧められた本でも先に本文を少し読む。言葉の難しさだけでなく、先が気になるかどうかを確かめるのだ。人の感想は参考になるが、読み続けられるかは、実際に読んでみないと分からない。'),
('AとBがどちらも認めているのは？','道具を使っても、その使い方を考える必要がある',['便利な道具は仕事を必ず増やす','すべての作業を手で行うべきだ','道具を導入すれば問題は全部解決する'],'A addresses whether saved time is protected; B addresses whether the tool fits the task. Both require decisions about use rather than automatic benefit.','Reading · common position','【A】新しい道具で作業が速くなっても、空いた時間に別の作業を入れれば忙しさは減らない。何に時間を使うかを決めることが大切だ。\n【B】便利だと評判の道具でも、私の仕事に合うとは限らない。導入する前に、今どこで困っていて、その道具が何を変えるかを確かめたい。'),
('二つの意見の違いとして正しいのは？','Aは先に計画し、Bは少し試してから計画を直す',['Aは途中の変更を禁止し、Bは計画を作らない','Aは人に相談せず、Bは全部人に任せる','二人とも、最初から結果が分かると言う'],'A begins with priorities and a plan; B uses a small trial to revise one. Neither treats planning or adjustment as useless.','Reading · contrasting sequence','【A】大きな作業に取りかかる前に、必要なことを並べて順番を決める。途中で変更することはあるが、最初の計画があれば、何を変えたかも分かりやすい。\n【B】経験のない作業では、最初から細かい計画を立てるのが難しい。私はまず小さく試し、かかった時間や困った点を見てから、計画を直している。'),
('土曜日の十三時に、予約なしで利用できるのは？','展示を見ること',['相談室で相談すること','午前の工作教室に参加すること','閉館後に資料を借りること'],'The exhibit runs 10–16 without booking. Consultation requires a reservation and the workshop ends at noon.','Reading · schedule and access','土曜日の展示は十時から十六時まで、予約なしでご覧いただけます。工作教室は十時から十二時までで、金曜日までの申し込みが必要です。相談室は十三時から十五時まで開きますが、事前予約の方のみ利用できます。資料の貸出窓口は十四時に閉めます。建物全体の閉館は十六時です。'),
('筆者が最も伝えたいことは？','読み手に必要な情報から、説明の順序を考えるべきだ',['詳しい説明は必ず短くすべきだ','自分が調べた順番で全部話すべきだ','読み手の質問は最後まで聞いてはいけない'],'The writer bases order on what the reader needs, rather than simply the research process or brevity at any cost.','Reading · main claim','調べたことを説明する時、私は調べた順番に書いていた。しかし、読む人は、その順番を知りたいわけではない。まず結論が必要な人もいれば、方法を知りたい人もいる。詳しく書くことと、分かりやすく書くことは同じではない。誰が何のために読むかを考えてから、情報を並べ直す必要がある。'),
('今回の返事で確かに決まったことは？','見本を来週水曜日に送ること',['追加の注文を正式に受けること','料金を半額にすること','今月中に全部を納品すること'],'The sample date is definite. Price and delivery are still under consideration, and an extra order waits for later approval.','Reading · confirmed action','先ほどのご相談について、見本は来週水曜日にお送りすることになりました。追加の注文については、見本をご覧いただいてからお決めください。料金と納期は現在確認しており、見本と一緒にご案内する予定です。今月中の納品や値引きは、まだお約束できません。見本を送る日だけ、先に確定した形になります。'),
('担当者が利用記録を取る理由は？','希望する声と実際の利用を比べるため',['利用者全員の意見をすでに知ったため','開館を遅くすることが決定したため','試行の結果を公表しないため'],'The trial checks whether expressed demand becomes actual use; neither wider opinion nor continuation has been established.','Reading · evaluating a trial','夜も利用したいという声を受け、施設は一か月だけ金曜日の閉館を遅くした。担当者は人数と利用時間を記録している。希望した人が実際に来るか、別の人も利用するかを確かめたいからだ。期間が終わってから結果をまとめ、職員の負担も含めて続けるか相談する。希望があっただけで、毎週続けると決めたわけではない。'),
]

def compile_rows(rows,stage,letter,start):
 result=[]
 for n,row in enumerate(rows,start):
  prompt,right,wrong,explanation,focus,*passage=row
  assert len(wrong)==3 and len(set([right]+wrong))==4
  answer=(n-1)%4;options=list(wrong);options.insert(answer,right)
  q=dict(id=f'n2-{letter}{n:02}',level='N2',stage=stage,prompt=prompt,options=options,answer=answer,explanation=explanation,focus=focus)
  if passage:q['passage']=passage[0]
  if stage=='exam':q['section']=focus.split(' · ')[0].lower()
  result.append(q)
 return result

def main():
 assert all(len(rows)==18 for rows in [VOCAB,GRAMMAR,READING])
 assert all(len(rows)==8 for rows in [EXAM_V,EXAM_G,EXAM_R])
 p=ROOT/'content/jlpt/questions.json';original=json.loads(p.read_text(encoding='utf8'))
 assert len([q for q in original if q['level']=='N2'])==12,'Do not overwrite reviewed expansion'
 result=original+compile_rows(VOCAB,'vocabulary','v',3)+compile_rows(GRAMMAR,'grammar','g',3)+compile_rows(READING,'reading','r',3)+compile_rows(EXAM_V+EXAM_G+EXAM_R,'exam','e',7)
 assert len([q for q in result if q['level']=='N2'])==90
 assert all(next(q for q in result if q['id']==old['id'])==old for old in original)
 p.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
 p=ROOT/'content/jlpt/bank-sizes.json';sizes=json.loads(p.read_text(encoding='utf8'));sizes['N2']=dict(vocabulary=20,grammar=20,reading=20,exam=30);p.write_text(json.dumps(sizes,indent=2)+'\n',encoding='utf8',newline='\n')
 print('N2: 60 checkpoints + 30 distinct written samples; all historical items preserved.')
if __name__=='__main__':main()
