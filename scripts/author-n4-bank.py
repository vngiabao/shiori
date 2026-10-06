"""Install original N4 practice items; preserve the twelve historical IDs.

Authored answer-first tuples are rotated when compiled. These are AI-assisted
drafts, not publisher questions, official level assignments or calibrated exams.
Run from the project folder. Re-running replaces only this script's new items.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# prompt, correct option, three distractors, explanation, focus, optional passage
VOCAB = [
 ('面接は金曜日です。「面接」の読み方は？', 'めんせつ', ['めんぜつ','めいせつ','めんさつ'], '面接 is めんせつ, an interview. The second part is せつ, not さつ.', 'Interview reading'),
 ('この仕事の時給は千二百円です。「時給」の読み方は？', 'じきゅう', ['じきょう','じっきゅう','じきゆう'], '時給 is じきゅう: pay per hour. Keep the small ゅ and the long う.', 'Pay reading'),
 ('電車が遅れたので、駅で三十分＿＿。', '待ちました', ['借りました','閉めました','消しました'], 'The delayed train gives a reason to wait at the station: 待ちました.', 'Waiting in context'),
 ('来週の旅行の前に、ホテルを＿＿。', '予約します', ['説明します','運転します','練習します'], '予約する means make a reservation. A hotel is reserved before the trip.', 'Reservation in context'),
 ('この本は難しいですが、あの本は＿＿です。あの本を先に読みます。', '簡単', ['残念','特別','危険'], 'The contrast is between difficult and easy. 簡単 means easy or simple.', 'Difficulty contrast'),
 ('試験の結果を聞いて、安心しました。「安心」の読み方は？', 'あんしん', ['あんじん','あんせん','あんにん'], '安心 is あんしん: relief or peace of mind. The sentence describes relief after hearing the result.', 'Relief reading'),
 ('森さんが机を部屋の外へ＿＿。机はもう部屋にありません。', '運びました', ['飾りました','磨きました','調べました'], '運ぶ means carry or transport. The desk was moved outside, not merely decorated or checked.', 'Transport verb'),
 ('窓は開いています。「開いて」の読み方は？', 'あいて', ['かけて','かいて','おいて'], 'For the intransitive あく reading, 開いて is あいて. 開ける is the transitive verb. Another valid reading, ひらいて, is deliberately not a distractor.', 'Open-state reading'),
 ('この店では現金だけ使えます。「現金」の読み方は？', 'げんきん', ['げんぎん','けんきん','げんこん'], '現金 is げんきん, cash. The statement rules out other payment methods at this shop.', 'Cash reading'),
 ('昼休みは一時間です。その＿＿に郵便局へ行きました。', '間', ['音','色','形'], '間 is the interval in which the trip took place: during the one-hour lunch break.', 'Time interval'),
 ('「まず、名前を書いてください。それから番号を書いてください。」どちらを先に書きますか。', '名前', ['番号','電話','住所'], 'まず marks the first action. The name is written before the number.', 'Sequence words'),
 ('大きな声は出さないでください。ここでは＿＿話してください。', '静かに', ['自由に','急に','特別に'], '静かに means quietly. It directly follows the request not to use a loud voice.', 'Quiet manner'),
 ('この箱は軽いです。「軽い」の読み方は？', 'かるい', ['くらい','からい','かたい'], '軽い is かるい, light in weight. 暗い is くらい; 辛い is からい; 硬い is かたい.', 'Weight reading'),
 ('会議が終わった後で、机の上を＿＿。ごみはごみ箱に入れました。', '片付けました', ['間違えました','知らせました','通いました'], '片付ける means tidy up. Putting rubbish in the bin is part of tidying the desk.', 'Tidying action'),
 ('玄関で靴を脱いでください。「玄関」の読み方は？', 'げんかん', ['げんけん','げんがん','けんかん'], '玄関 is げんかん: the entrance area. The request is to remove shoes there.', 'Entrance reading'),
 ('説明は短かったので、もう少し＿＿聞きたいです。', '詳しく', ['早く','丸く','低く'], '詳しく means in more detail. The speaker wants fuller information after a short explanation.', 'Detailed explanation'),
 ('この階段は急なので、＿＿です。手すりを使ってください。', '危険', ['親切','元気','便利'], '危険 means dangerous. The steep stairs motivate the warning to use the handrail.', 'Safety context'),
 ('今月は予定が多くて忙しいです。「予定」の読み方は？', 'よてい', ['よやく','やくそく','よけい'], '予定 is よてい, a plan or schedule. 予約 is a reservation, and 約束 is a promise or arrangement.', 'Schedule reading'),
]
GRAMMAR = [
 ('友達に旅行先を勧めます。「京都へ行く＿＿、この地図を持っていくといいよ。」', 'なら', ['のに','間に','までに'], 'なら takes up the proposed trip: if Kyoto is where you are going, this map is useful. のに would require a contrasting continuation.', 'u01 contextual なら'),
 ('皿の上のケーキを見て、食べる前に言います。「おいし＿＿ですね。」', 'そう', ['だそう','たい','よう'], 'An い-adjective stem plus そう describes visible appearance: おいしそう. Hearsay would be おいしいそう, with the final い retained.', 'u01 appearance そう'),
 ('三人の会議だと思っていましたが、来たのは二十人でした。「二十人＿＿来ました。」驚きを表す助詞は？', 'も', ['しか','ずつ','だけ'], 'Number + も expresses a surprisingly large amount. しか needs a negative predicate; だけ expresses only, not this requested surprise.', 'u02 number も'),
 ('私は花さんから本を受け取りました。私の立場から、同じ出来事を言います。「花さんが私に本を＿＿。」', 'くれました', ['あげました','もらいました','借りました'], 'くれる describes someone giving to the speaker. あげる does not take the speaker as recipient in this ordinary viewpoint; もらう would make Hana the recipient.', 'u02 gift viewpoint'),
 ('友達が「今、何をする？」と聞きました。その場で決めて誘います。「一緒に映画を＿＿。」', '見よう', ['見た','見ていた','見てある'], '見よう is the volitional invitation decided now. The alternatives report past action or a prepared state rather than inviting the friend.', 'u03 spontaneous volition'),
 ('来月の計画は先週決めました。その計画を話します。「毎朝走ろうと＿＿。」', '思っています', ['思いませんでした','言われました','見られました'], 'Volitional + と思っています expresses an intention held over time. The context explicitly says the plan was already made last week.', 'u03 maintained intention'),
 ('花さんの言葉は「明日は休みです」でした。友達へ、その知らせを伝えます。「花さんは、明日は休みだ＿＿。」引用の助詞は？', 'って', ['まで','しか','より'], 'って marks this conversational quotation. The alternatives mark a limit, restrictive negative or comparison, not the reported statement.', 'u05 conversational quotation'),
 ('食べ終わってから皿を洗います。「ご飯を食べ＿＿、皿を洗ってください。」', 'たら', ['ながら','ても','ないで'], 'The たら form can mark completion before the next action. ながら makes the actions simultaneous; ないで skips eating; ても is concessive.', 'u05 completion condition'),
 ('先生に、私が明日資料を届けると伝えます。自分の行為を低くする言い方は？', '明日、資料をお届けします。', ['明日、資料をお届けになります。','明日、資料を届けてください。','明日、資料を届けていただきます。'], 'お + ます-stem + する humbles the speaker’s delivery. お届けになる respects someone else’s action; the other choices request or receive a delivery.', 'u08 general humble action'),
 ('会社の名前を初めて説明します。「『青葉』＿＿会社で働いています。」', 'という', ['にくい','ながら','までに'], 'NというN names something: a company called Aoba. The other forms do not link a name to the company noun.', 'u08 naming という'),
 ('文字が小さすぎます。「この説明書は読み＿＿です。」読みにくさを表す形は？', 'にくい', ['やすい','たい','そう'], 'ます-stem + にくい means difficult to do. 読みやすい means easy to read and contradicts the explicitly requested difficulty.', 'u08 difficulty にくい'),
 ('友達の「何してる？」に、今していることを答えます。くだけた「読んでいる」は？', '読んでる', ['読んどく','読まなきゃ','読んじゃった'], '読んでいる contracts to 読んでる, an ongoing action. 読んどく is preparation, 読まなきゃ obligation, and 読んじゃった completion.', 'u09 ongoing contraction'),
 ('返す日は今日です。友達に「返さなければならない」とくだけて言います。「今日、返さ＿＿。」', 'なきゃ', ['なくて','ないで','なかった'], '返さなきゃ contracts 返さなければ, with the obligation understood in this casual statement. The other choices do not convey the requested obligation.', 'u09 obligation contraction'),
 ('先輩の私は、練習したがっている後輩に部屋を使う許可を与えました。「後輩に部屋を使わせて＿＿。」私が与える側です。', 'あげました', ['くれました','もらいました','いただきました'], 'Causative + てあげる presents permission given by the speaker. てくれる and てもらう would present a benefit received by the speaker instead.', 'u10 permission given'),
 ('私は発表の練習をしたかったです。森さんが練習する許可をくれました。「森さんは私に練習させて＿＿。」', 'くれました', ['あげました','もらいました','いただきました'], '森さん is the giver and 私 is the beneficiary, so 練習させてくれました. もらう would need the speaker as the subject receiving permission.', 'u10 permission received'),
 ('先生が生徒に、やや強く指示します。「もう一度、名前を＿＿。」ます形の語幹＋なさいを選びます。', '書きなさい', ['書いてもいいです','書かなくてもいいです','書いてもらえますか'], '書きなさい uses the ます-stem 書き plus なさい. It is a firm instruction from teacher to pupil, not a form to use toward a superior.', 'u10 firm なさい instruction'),
 ('「あの先生と同じように話したい」です。「あの先生＿＿、ゆっくり話してみます。」', 'のように', ['のような','ような','をように'], 'Nのように modifies an action or manner: speak like that teacher. Nのような instead modifies a following noun.', 'u10 manner resemblance'),
 ('この字をどう書くか教えてほしいです。「この字の＿＿を教えてください。」', '書き方', ['書いた方','書く方','書いて方'], 'ます-stem + 方（かた）makes a how-to noun: 書き方. The object becomes この字の; this is not the comparative 方（ほう）.', 'u11 method noun 方'),
]
READING = [
 ('何時に集まりますか。','九時半',['九時','十時','十時半'],'The change is to the meeting time: 九時半. Ten is the original departure time, not the new assembly time.','Changed assembly','明日の旅行は十時に出発します。集合は九時の予定でしたが、九時半に変わりました。駅の前に集まってください。'),
 ('荷物はどうしますか。','受付に預けます。',['教室に持って入ります。','家に送ります。','先生に渡します。'],'The notice says large bags cannot enter and must be left at reception. The classroom is not the storage place.','Entry condition','見学する方へ。大きな荷物は教室に持って入れません。受付に預けてください。見学が終わったら、受付で受け取れます。'),
 ('花さんは何を先にしますか。','家で資料を印刷します。',['店でレンに会います。','学校で昼ご飯を食べます。','駅で電車を待ちます。'],'Hana cannot print at school and plans to print at home before going to the shop. Ren waits at the shop.','Action order','レンへ。学校のプリンターが使えないので、家で資料を印刷してから店へ行きます。少し遅れますが、店で待っていてください。花'),
 ('今日、借りられるのはどれですか。','二階の本',['一階の雑誌','一階の新聞','受付のパソコン'],'The notice allows second-floor books. The magazines and newspapers may only be read inside. No laptop lending is stated.','Loan restriction','一階の雑誌と新聞は、館内で読んでください。家へ持って帰れません。二階の本は今日も借りられます。返す日は受付で確かめてください。'),
 ('ユイは何を決めましたか。','金曜日は残業しないこと',['毎日残業すること','金曜日に映画を見ること','友達と駅で会うこと'],'Yui decided not to work overtime on Fridays. The text gives no film or meeting arrangement.','Personal decision','今月は疲れる日が多かったです。そこで、金曜日は残業しないことにしました。仕事が終わったら、家でゆっくり休みたいです。ユイ'),
 ('森さんは学生に何をさせましたか。','短い説明をもう一度言わせました。',['長い資料を全部読ませました。','会議室を掃除させました。','電話をかけさせました。'],'The student practised a short explanation again. The text explicitly says the whole document was not read aloud.','Teacher feedback','学生の説明が聞こえにくかったので、森さんは学生に短い説明をもう一度言わせました。資料を全部読む練習ではありませんでした。その後、学生は質問に答えました。'),
 ('届かなかった人はどうしますか。','今日中に事務室へ連絡します。',['明日まで待ちます。','郵便局へ行きます。','資料を捨てます。'],'People who did not receive the document must contact the office today. Wednesday describes the original sending date.','Conditional instruction','資料は水曜日に送りました。まだ届いていない方は、今日中に事務室へ連絡してください。届いた方は、来週の説明会に持ってきてください。'),
 ('いつ薬を飲みますか。','食事が終わった後',['食事の前','食べている間','寝る直前だけ'],'This fictional label states 食事が終わった後. This is reading practice, not advice on taking any real medication.','Read a fictional label','練習用の薬のラベル：一日二回、朝と夜の食事が終わった後に飲んでください。飲み方がわからない時は、薬局で聞いてください。'),
 ('客はどこへ行きますか。','二階の二番の窓口',['一階の一番の窓口','一階の二番の窓口','二階の一番の窓口'],'The clerk directs the visitor to second-floor counter two. Counter one is closed today.','Location correction','一番の窓口は今日は休みです。住所を変えたい方は、二階の二番の窓口へお越しください。必要な書類は、その窓口で説明します。'),
 ('レンはどうして歩いて帰りましたか。','最後のバスに乗れなかったから',['友達と話したかったから','雨が降っていたから','駅が閉まっていたから'],'Ren missed the last bus by a minute, so walked. Conversation was on the walk, not the reason for choosing it.','Cause and sequence','バス停に着いたのは十一時一分でした。最後のバスは十一時に出てしまいました。タクシー代が足りなかったので、友達と話しながら歩いて帰りました。レン'),
 ('何を明日までにしますか。','申込書を出します。',['参加費を払います。','道具を返します。','練習に来ます。'],'Only the application form is due tomorrow. Payment is due the following week; practice starts the week after that.','Separate deadlines','テニスの練習に参加したい方は、明日までに申込書を出してください。参加費は来週、受付で払ってください。練習は再来週からです。'),
 ('今、店にあるのはどれですか。','小さい箱',['大きい箱','赤い袋','青い袋'],'Only the small boxes remain. Large boxes are expected tomorrow, not currently available. Bags are not mentioned.','Stock versus plan','大きい箱は全部売れてしまいました。今は小さい箱だけあります。大きい箱は明日届く予定ですが、時間はまだわかりません。'),
 ('客は誰から地図を受け取りますか。','受付の人',['先生','運転手','店長'],'The receptionist hands out maps. The teacher arrives later and no driver or shop manager appears.','Respectful role','先生はまだいらっしゃいません。先に教室へ行きたい方には、受付で地図をお渡しします。受付の人にお名前をお伝えください。'),
 ('読みにくかったのは何ですか。','説明書',['メニュー','地図','手紙'],'The small print makes the manual hard to read. After consulting the shop, the writer learns how to use the device.','Difficulty and repair','新しい機械を買いましたが、説明書の字が小さくて読みにくかったです。店に電話をしたら、使い方を教えてくれました。今は自分で使えます。'),
 ('ユイはなぜ休みましたか。','熱があったから',['雨が降ったから','会議が中止になったから','電話が壊れたから'],'The fever is the stated reason. Rain is explicitly contrasted with it as a reason that would not stop attendance.','Contrast in reasons','昨日は雨でしたが、雨でも学校へ行くつもりでした。しかし、朝、熱が出たので休みました。先生には電話で連絡しました。ユイ'),
 ('部屋について正しいのはどれですか。','説明会のために机が並べてあります。',['誰も準備していません。','説明会はもう終わりました。','窓は全部開いています。'],'並べてあります reports the prepared desk arrangement. It does not say the event is finished or that windows are open.','Prepared state','明日の説明会のために、机が並べてあります。窓は閉まっています。資料は明日の朝、受付の机に置く予定です。'),
 ('ハナは友達に何をしてほしいですか。','始まる時間を知らせてほしいです。',['場所を予約してほしいです。','授業を休んでほしいです。','切符を買ってほしいです。'],'Hana already knows the location. She asks for the unknown starting time, not a booking or ticket.','Known versus unknown','場所はわかったけれど、始まる時間がわかりません。授業が終わるのは四時です。時間が決まったら、知らせてほしいです。ハナ'),
 ('書いた人について正しいのはどれですか。','毎晩、短い日記を書くことにしています。',['長い日記を一度だけ書きました。','昨日から日記をやめました。','毎朝、友達の日記を読みます。'],'The writer maintains a nightly short-diary routine. A long diary was tiring, which prompted the change.','Maintained routine','長い日記を書くのは疲れるので、毎晩、三文だけ書くことにしています。昨日も三文書きました。短くても、毎日続けたいです。'),
]
EXAM_V = [
 ('工場を見学しました。「見学」の読み方は？','けんがく',['けんかく','けいがく','みがく'],'見学 is けんがく: visiting to observe and learn. It is not the ordinary verb 見る.','Vocabulary · compound reading'),
 ('忘れ物をしないように、出かける前にかばんの中を＿＿。','確かめます',['壊します','捨てます','交換します'],'確かめる means check or make sure. Checking the contents helps prevent forgetting something.','Vocabulary · checking'),
 ('帰り道を教えてもらいました。「帰り道」の読み方は？','かえりみち',['かえりどう','かえみち','きりみち'],'帰り道 is かえりみち, the way home. The stem 帰り is followed by 道（みち）.','Vocabulary · route reading'),
 ('電車が混んでいて座れませんでした。「混んで」の読み方は？','こんで',['くんで','かんで','まぜんで'],'混む is こむ, to be crowded, so 混んで is こんで. It is different from 混ぜる, mix.','Vocabulary · crowd reading'),
 ('この公園は夜八時に＿＿。八時から中に入れません。','閉まります',['開きます','始まります','集まります'],'閉まる means close. The second sentence says people cannot enter after eight, confirming closure.','Vocabulary · intransitive closure'),
 ('彼女は病院で働く看護師です。「看護師」の読み方は？','かんごし',['かんこうし','かんこし','けんごし'],'看護師 is かんごし, a nurse. The middle element is voiced ご.','Vocabulary · occupation reading'),
 ('店長はとても親切です。「親切」の読み方は？','しんせつ',['しんぜつ','しんさい','おやきり'],'親切 is しんせつ, kind or helpful. This compound is not read by joining the everyday readings of its characters.','Vocabulary · kindness reading'),
 ('長い間使ったペンが壊れたので、新しいペンを＿＿。','買いました',['貸しました','渡しました','返しました'],'Buying a new pen replaces the broken one. The other verbs describe lending, handing over or returning, rather than acquiring a new replacement.','Vocabulary · replacement'),
]
EXAM_G = [
 ('花さんは辛い物が食べられません。「辛く＿＿、花さんも食べられます。」辛くない場合を言います。','なければ',['ても','なると','しながら'],'辛くなければ is the negative conditional: if it is not spicy. The context requests that condition, not concession or becoming spicy.','Grammar · negative condition'),
 ('私は先生に作文を見てもらいました。先生の行為を尊敬して言います。「先生が作文を＿＿。」','ご覧になりました',['拝見しました','見せました','お見せしました'],'ご覧になる respects the teacher’s act of looking. 拝見する humbles the speaker’s viewing; 見せる means show rather than look.','Grammar · respectful actor'),
 ('私は先生に会う前に資料を準備します。「会う前に資料を用意して＿＿。」','おきます',['います','あります','しまいました'],'ておく marks advance preparation. The prompt states this future preparation, not an ongoing state or an already completed past event.','Grammar · advance preparation'),
 ('傘を持ってこなかったので、雨で困りました。自分が持ってこなかったことを後悔する言い方は？','持ってくればよかった',['持ってこなくてもいい','持ってきてほしい','持ってきてある'],'持ってくればよかった regrets not bringing the umbrella. The alternatives express permission, a wish about another action or a prepared state.','Grammar · regret'),
 ('親が子どもを走らせました。子どもの立場で、させられたことを言います。「私は親に＿＿。」','走らされました',['走らせました','走らせてあげました','走らせてくれました'],'走らされる is the common shortened causative-passive of 走る. The other choices make the speaker cause or allow someone else’s running.','Grammar · causative passive'),
 ('私は毎日九時＿＿働きます。それから家に帰ります。終わる時刻を表す助詞は？','まで',['までに','にだけ','から'],'まで marks the endpoint of continued work. までに marks a deadline by which an event must happen.','Grammar · endpoint'),
 ('会議は二時です。今一時です。開始前の完成を指示します。「二時＿＿資料を印刷してください。」','までに',['まで','から','の間'],'までに gives the completion deadline before the meeting. まで would describe continuing the activity until that time.','Grammar · deadline'),
 ('母に似た声です。名詞「声」を説明します。「母＿＿声ですね。」','のような',['のように','ように','みたいに'],'Nのような modifies a noun. のように and みたいに modify an action or manner, not the noun in this sentence.','Grammar · noun resemblance'),
]
EXAM_R = [
 ('どの時間に行けば、説明を聞けますか。','午後一時',['午前十時','午前十一時','午後三時'],'The explanatory session starts at one and lasts thirty minutes. Ten is opening time; neither eleven nor three is the stated session time.','Reading · event time','店は午前十時から午後六時まで開いています。新しい道具の使い方を説明する時間は、午後一時から三十分です。予約はいりません。'),
 ('レンが連絡するのはいつですか。','結果がわかった時',['申込みの前','電話を買った時','来年の春'],'Ren promises to contact Hana when the result is known. Next week is the expected result date, not a fixed contact hour.','Reading · conditional contact','花へ。昨日、アルバイトの面接を受けました。結果は来週わかるそうです。わかったら、すぐ連絡します。今日は授業の後で家に帰ります。レン'),
 ('ハナは何を借りましたか。','傘',['本','自転車','かばん'],'Hana received an umbrella loan from Yui because she had forgotten her own. Returning it tomorrow is a plan, not a completed return.','Reading · receiving viewpoint','雨が降っていたのに、傘を忘れてしまいました。ユイに傘を貸してもらいました。ユイは「この傘を使っていい」と言ってくれました。明日返すつもりです。ハナ'),
 ('地図はどこにありますか。','受付の机',['入り口の壁','二階の教室','先生のかばん'],'The map is placed on the reception desk. The wall carries a timetable, a different item.','Reading · two locations','地図は受付の机に置いてあります。入り口の壁には時間割が貼ってあります。教室がわからない方は、受付で地図を取ってください。'),
 ('今日は何をしなくてもいいですか。','教室の掃除',['試験を受けること','資料を持ってくること','名前を書くこと'],'The cancelled class removes the need to clean today. The message still asks learners to write their names on the next lesson’s materials.','Reading · exception','今日の授業は休みですから、教室を掃除しなくてもいいです。次の授業には、名前を書いた資料を持ってきてください。試験の日は変わりません。'),
 ('ユイは今どうしていますか。','短い本を読んでいます。',['長い本をもう読み終わりました。','本を全部捨てました。','友達に本を貸しています。'],'読んでる expresses the current reading of a short book. The wish to try a longer one is a future intention, not a completed reading.','Reading · contraction and intention','友達へ。今は短い本を読んでるよ。長い本はまだ難しいけど、来月は読んでみようと思ってる。読み終わったら感想を送るね。ユイ'),
 ('森さんは何を頼んでいますか。','遅れる時に知らせること',['今日の会議を休むこと','資料を今すぐ返すこと','駅に車を置くこと'],'Mori requests notice if the visitor will be late. Bringing materials and the two o’clock start are separate instructions.','Reading · conditional request','明日は二時からお待ちしています。資料をお持ちください。遅れる場合は、受付に知らせていただけませんか。受付は一時から開いています。森'),
 ('この案内からわかるのはどれですか。','練習を始める前に、道具を借りられます。',['道具は家に持って帰れます。','練習の後だけ道具を借りられます。','受付では名前を聞かれません。'],'Equipment can be borrowed before practice starts. It must be returned before departure, and the name is required at reception.','Reading · equipment procedure','練習が始まる前に、受付で道具を借りられます。借りる時は名前を言ってください。帰る前に、受付へ返してください。家に持って帰らないでください。'),
]

def compile_rows(rows, stage, letter, start):
    result = []
    for n, row in enumerate(rows, start):
        prompt, right, wrong, explanation, focus, *passage = row
        index = (n - 1) % 4
        options = list(wrong)
        options.insert(index, right)
        question = dict(id=f'n4-{letter}{n:02}', level='N4', stage=stage,
                        prompt=prompt, options=options, answer=index,
                        explanation=explanation, focus=focus)
        if passage:
            question['passage'] = passage[0]
        if stage == 'exam':
            question['section'] = focus.split(' · ')[0].lower()
        result.append(question)
    return result

def main():
    path = ROOT / 'content/jlpt/questions.json'
    original = json.loads(path.read_text(encoding='utf-8'))
    legacy_ids = {f'n4-{prefix}{i}' for prefix, count in [('v',2),('g',2),('r',2),('e',6)] for i in range(1,count+1)}
    kept = [q for q in original if q['level'] != 'N4' or q['id'] in legacy_ids]
    for q in kept:
        if q['stage'] == 'exam':
            q['section'] = 'reading' if q.get('passage') else 'vocabulary' if q['focus'] == 'Vocabulary' else 'grammar'
    result = kept + compile_rows(VOCAB,'vocabulary','v',3) + compile_rows(GRAMMAR,'grammar','g',3) + compile_rows(READING,'reading','r',3)
    result += compile_rows(EXAM_V + EXAM_G + EXAM_R,'exam','e',7)
    assert len([q for q in result if q['level']=='N4']) == 90
    assert len({q['id'] for q in result}) == len(result)
    path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('N4 bank: 60 checkpoints + 30 separate sample items. Historical items retained.')

if __name__ == '__main__':
    main()
