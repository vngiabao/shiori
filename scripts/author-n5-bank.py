"""Compile original elementary practice without changing historical item IDs.

Answer-first drafts are independently written from everyday situations, not
copied publisher questions. Level labels are editorial, not official mappings.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
# prompt, correct option, three distractors, explanation, focus, optional passage
VOCAB = [
 ('「友達」の読み方は？', 'ともだち', ['ともたち','どもだち','ともだじ'], '友達 is ともだち, a friend. The middle consonant is voiced だ.', 'Friend reading'),
 ('「学校」の読み方は？', 'がっこう', ['がこう','がっこ','かっこう'], '学校 is がっこう: small っ closes the first syllable, and こう has a long vowel.', 'School reading'),
 ('「電車」の読み方は？', 'でんしゃ', ['てんしゃ','でんしや','でんじゃ'], '電車 is でんしゃ, a train. しゃ uses the small ゃ.', 'Train reading'),
 ('「毎朝」の読み方は？', 'まいあさ', ['まいばん','まいにち','まいひる'], '毎朝 is まいあさ, every morning. 毎晩 and 毎日は different time expressions.', 'Morning reading'),
 ('「三人」の読み方は？', 'さんにん', ['さんじん','みっつ','さんひと'], '三人 is さんにん, three people. The irregular 一人 and 二人 do not make 三人 irregular.', 'People counter'),
 ('「七月」の読み方は？', 'しちがつ', ['なながつ','しちげつ','ななげつ'], 'The month 七月 is normally read しちがつ, July; month names use がつ.', 'Month reading'),
 ('これは＿＿です。字を書く時に使います。', '鉛筆', ['椅子','傘','靴'], 'A pencil, 鉛筆, is used for writing. The other objects are a chair, umbrella and shoes.', 'Writing tool'),
 ('雨ですから、＿＿を持っていきます。雨が体にかからないように使います。', '傘', ['時計','辞書','切符'], 'An umbrella, 傘, keeps rain off the body. The explicit purpose rules out the other objects.', 'Rain equipment'),
 ('この本は百ページです。あの本は五百ページです。あの本は＿＿です。ページの多さを言います。', '厚い', ['甘い','寒い','青い'], '厚い describes a thick book. The question asks about the number of pages, not its colour.', 'Book thickness'),
 ('水がほしいです。この＿＿に入れてください。水を飲む時に使います。', 'コップ', ['ノート','靴下','切符'], 'コップ is a drinking cup. The stated use, drinking water, distinguishes it from the other objects.', 'Drinking container'),
 ('友達に本を借りました。明日、その本を友達に＿＿。', '返します', ['起きます','泳ぎます','降ります'], '返す means return something. Here the borrowed book goes back to the friend.', 'Returning a loan'),
 ('図書館です。大きな声で話さないで、＿＿話してください。', '静かに', ['赤く','重く','丸く'], '静かに means quietly. It follows the instruction to avoid a loud voice.', 'Quiet manner'),
 ('＿＿で手紙を送ります。', '郵便局', ['台所','教室','お風呂'], 'The postal context selects 郵便局, a post office. The other places are not postal facilities.', 'Postal place'),
 ('「左」の反対はどれですか。', '右', ['上','下','中'], 'Left, 左, contrasts with right, 右. Up, down and inside are different directions.', 'Direction pair'),
 ('「買います」の辞書形はどれですか。', '買う', ['買い','買った','買って'], '買う is the dictionary form. 買います is its polite non-past form; the other options are different verb forms.', 'Buy dictionary form'),
 ('「お父さん」の意味は？', 'father', ['mother','older sister','younger brother'], 'お父さん means father, commonly in address or when referring to someone else’s father.', 'Family reference'),
 ('「朝ご飯」の意味は？', 'breakfast', ['lunch','dinner','a snack'], '朝ご飯 is the morning meal, breakfast. 昼ご飯 and 晩ご飯 name other meals.', 'Meal word'),
 ('「安い」の意味は？', 'inexpensive', ['expensive','far away','busy'], '安い means inexpensive or cheap in price. 高い can mean expensive.', 'Price adjective'),
]
GRAMMAR = [
 ('私は学生＿＿。丁寧に、自分について述べます。', 'です', ['でしたか','を','へ'], '学生です is a polite present identification. でしたか asks about the past; を and へ do not finish this statement.', 'Identification'),
 ('これは私＿＿本です。私が持っている本です。', 'の', ['へ','を','で'], 'の links the possessor 私 to 本. The context states that it is the speaker’s book.', 'Possession'),
 ('駅＿＿友達を待ちます。待つ場所を示します。', 'で', ['へ','を','から'], 'で marks the place where the action of waiting happens. へ indicates direction instead.', 'Action location'),
 ('机の上に本が＿＿。ものがあることを言います。', 'あります', ['います','いきます','のみます'], 'あります is used for the existence of an inanimate object, here a book. います is used for living people or animals.', 'Object existence'),
 ('庭に犬が＿＿。', 'います', ['あります','なります','します'], 'A dog is a living animal, so the existence verb is います.', 'Animal existence'),
 ('私は毎朝パン＿＿食べます。食べるものを示します。', 'を', ['に','へ','の'], 'を marks the direct object of 食べる: the food that is eaten.', 'Object particle'),
 ('月曜日に行きます。友達＿＿一緒に行きます。相手を示します。', 'と', ['の','を','へ'], 'と marks the companion in 友達と一緒に行きます, going together with a friend.', 'Companion'),
 ('昨日、映画を＿＿。過去の丁寧な形を選びます。', '見ました', ['見ます','見ません','見る'], '見ました is polite past affirmative. The question explicitly asks for polite past, not simply any form compatible with 昨日.', 'Polite past'),
 ('昨日は＿＿です。い形容詞「寒い」の過去形を選びます。', '寒かった', ['寒いでした','寒くでした','寒いだ'], 'い-adjective past is the stem + かった: 寒かったです. Do not attach でした to 寒い.', 'Adjective past'),
 ('この部屋は＿＿。「静か」の丁寧な否定を選びます。', '静かではありません', ['静かくないです','静かったです','静かいです'], '静か is a な-adjective. Its polite negative can be 静かではありません; it does not use くない.', 'Na-adjective negative'),
 ('昼ご飯を＿＿、学校へ行きます。食べるのて形を選びます。', '食べて', ['食べるて','食べたて','食べますて'], '食べる is an ichidan verb: remove る and add て, giving 食べて.', 'Te-form sequence'),
 ('ここで写真を撮って＿＿ですか。許可を求めます。', 'もいい', ['はいけない','いたい','いません'], 'て + もいいですか asks permission. てはいけない states prohibition instead.', 'Permission'),
 ('危ないですから、ここで走って＿＿。禁止を伝えます。', 'はいけません', ['もいいです','います','みました'], 'てはいけません prohibits the action. The question explicitly asks for a prohibition.', 'Prohibition'),
 ('今、何をしていますか。「本を＿＿。」読むのている形で答えます。', '読んでいます', ['読むています','読みています','読んています'], '読む changes to 読んで, followed by います. The voiced で is part of this godan te-form.', 'Ongoing action'),
 ('日曜日に映画を＿＿。友達を一緒に誘います。丁寧な誘いは？', '見ませんか', ['見ませんでした','見ないでください','見ましたか'], '見ませんか is a polite invitation. The alternatives deny past action, request not watching, or ask about past viewing.', 'Polite invitation'),
 ('この店はあの店＿＿安いです。比較の基準を示します。', 'より', ['まで','だけ','から'], 'より introduces the comparison standard: this shop is cheaper than that shop.', 'Comparison'),
 ('日本語の本を＿＿です。私の希望を言います。', '読みたい', ['読んでいた','読まないで','読まれた'], 'ます-stem + たい expresses the speaker’s wish: 読みたいです, I want to read.', 'Desire'),
 ('一度、京都へ＿＿ことがあります。経験を言います。', '行った', ['行く','行きます','行って'], 'Past plain form + ことがある expresses experience: 行ったことがあります.', 'Past experience'),
]
READING = [
 ('ユイはどこで待ちますか。','駅の前',['店の中','家の前','学校の中'],'Yui says 駅の前で待ちます. The afternoon time describes when, not another meeting place.','Meeting place','レンへ。明日、午後三時に会いましょう。私は駅の前で待ちます。雨でも行きます。ユイ'),
 ('何時まで勉強しましたか。','四時',['二時','三時','五時'],'The writer studied from two until four. Five is when the writer returned home.','End time','今日は二時から四時まで図書館で勉強しました。その後、パンを買いました。五時に家へ帰りました。'),
 ('火曜日に買えるのはどれですか。','パン',['魚','肉','花'],'On Tuesdays the shop sells bread only. Other listed foods belong to the Wednesday opening.','Shop restriction','この店は火曜日にはパンだけ売ります。魚と肉は水曜日に売ります。花は売りません。朝九時に開きます。'),
 ('誰のかばんですか。','ハナのかばん',['レンのかばん','ユイのかばん','先生のかばん'],'Hana identifies the black bag as hers. Ren’s bag is blue, and Yui has no bag in this description.','Possession contrast','黒いかばんはハナのです。レンのかばんは青いです。ユイは今日はかばんを持っていません。'),
 ('どの部屋に入りますか。','二番の部屋',['一番の部屋','三番の部屋','四番の部屋'],'The notice says the class is in room two. Room one is closed; three and four are not assigned.','Room notice','今日の日本語の授業は二番の部屋でします。一番の部屋には入らないでください。授業は十時からです。'),
 ('飲み物はいくらですか。','百五十円',['百円','二百円','三百円'],'お茶 is the drink, priced at 百五十円. The other amounts price food.','Price list','今日のメニューです。お茶は百五十円、パンは百円、おにぎりは二百円です。サンドイッチは三百円です。'),
 ('レンはなぜ歩きますか。','駅が近いから',['バスが安いから','雨が降っているから','車があるから'],'The station is close and takes five minutes on foot. Cheap bus fare and rain are not stated.','Reason','私の家から駅までは近いです。歩いて五分です。ですから、いつも歩きます。バスには乗りません。レン'),
 ('今日、図書館でできないことは？','本を借りること',['本を読むこと','中に入ること','机を使うこと'],'Reading and desk use are allowed, but borrowing is prohibited today. Returning borrowed books tomorrow is a separate instruction.','Library exception','今日は図書館の中で本を読んでもいいです。机も使ってください。でも、今日は本を借りてはいけません。借りた本は明日返してください。'),
 ('ハナが買ったものはどれですか。','赤いペン',['青いペン','黒いノート','白いかばん'],'Hana bought the red pen. She wanted the blue one but it was unavailable.','Wish versus purchase','青いペンがほしかったですが、店にはありませんでした。赤いペンがあったので、それを買いました。ハナ'),
 ('ユイは今何をしていますか。','手紙を書いています。',['もう寝ています。','本を読んでいます。','学校へ行っています。'],'今は手紙を書いています is the present action. Going to bed follows finishing it.','Current action','今は手紙を書いています。友達に送る手紙です。これが終わってから、寝ます。明日の朝は六時に起きます。ユイ'),
 ('犬はどこにいますか。','椅子の下',['机の上','椅子の上','庭の中'],'The dog is under the chair. The desk has books on it and no dog is in the garden.','Positions','部屋に犬がいます。椅子の下にいます。机の上には本があります。庭には何もいません。'),
 ('先生はいつ来ますか。','水曜日',['月曜日','火曜日','木曜日'],'The teacher comes Wednesday. Monday is today; Tuesday’s class is cancelled.','Days','今日は月曜日です。先生は今日、来ません。明日の授業は休みです。先生は水曜日に来ます。'),
 ('学校へ行く前に何をしますか。','朝ご飯を食べます。',['図書館で勉強します。','駅で友達に会います。','買い物をします。'],'Breakfast precedes school. The library is after class, and shopping is planned for tomorrow.','Sequence','朝ご飯を食べてから学校へ行きます。授業の後は図書館で勉強します。買い物は明日します。'),
 ('日曜日について正しいのは？','店は開いていません。',['店は九時から開いています。','昼だけ開いています。','夜だけ開いています。'],'The shop is closed on Sundays. The nine-to-five hours apply Monday to Saturday.','Opening days','この店は月曜日から土曜日まで、九時から五時まで開いています。日曜日は休みです。昼休みはありません。'),
 ('何を持っていきますか。','ノートと鉛筆',['ノートと本','本と鉛筆','ノートと辞書'],'The note requests a notebook and pencil; the book is supplied there. No dictionary is requested.','Required items','明日の授業にはノートと鉛筆を持ってきてください。本は学校にありますから、持ってこなくてもいいです。'),
 ('レンはどちらが好きですか。','お茶',['コーヒー','水','牛乳'],'Ren likes coffee too, but says tea is preferred. The question asks which is liked more.','Preference','私はコーヒーも好きですが、お茶のほうが好きです。朝はお茶を飲みます。夜は何も飲みません。レン'),
 ('家へ帰る時、何に乗りますか。','バス',['電車','自転車','タクシー'],'The writer went by bicycle but leaves it at a friend’s house and returns by bus.','Outbound versus return','今日は自転車で友達の家へ行きました。帰りは雨ですから、自転車を友達の家に置いて、バスで帰ります。'),
 ('友達は今日どこへ来ますか。','私の家',['映画館','図書館','公園'],'The friend comes to the writer’s home today. The film was watched yesterday, not at today’s meeting.','Past versus present','昨日、友達と映画を見ました。今日は友達が私の家へ来ます。一緒に昼ご飯を作ります。映画館には行きません。'),
]
EXAM_V = [
 ('「新聞」の読み方は？','しんぶん',['しんぷん','しんぼん','しんばん'],'新聞 is しんぶん, a newspaper. The final part is voiced ぶん.','Vocabulary · newspaper reading'),
 ('「八時」の読み方は？','はちじ',['はっじ','やじ','はちし'],'八時 is はちじ, eight o’clock. The counter is じ.','Vocabulary · hour reading'),
 ('「水曜日」の読み方は？','すいようび',['みずようび','すいよび','すいようにち'],'水曜日 is すいようび, Wednesday. The weekday suffix is ようび.','Vocabulary · weekday reading'),
 ('「お姉さん」の意味は？','older sister',['younger sister','older brother','grandmother'],'お姉さん refers to an older sister, usually in address or respectful reference.','Vocabulary · family word'),
 ('冷たい水を入れて、＿＿。のどがかわいています。','飲みます',['書きます','着ます','会います'],'Thirst motivates drinking: 水を飲みます. The other verbs do not describe drinking water.','Vocabulary · drink verb'),
 ('電車に乗ります。駅で＿＿を買います。乗るために必要です。','切符',['皿','花','靴下'],'A 切符 is a ticket for the journey. The question gives its purpose.','Vocabulary · travel object'),
 ('「遠い」の反対はどれですか。','近い',['高い','細い','長い'],'遠い, far, contrasts with 近い, near. The other adjectives describe height, thinness and length.','Vocabulary · distance contrast'),
 ('「聞きます」の辞書形はどれですか。','聞く',['聞き','聞いた','聞いて'],'聞く is the dictionary form of 聞きます. The other forms are a stem, past and te-form.','Vocabulary · hear dictionary form'),
]
EXAM_G = [
 ('このペンは私＿＿ではありません。誰の物かを言います。','の',['へ','を','で'],'の can stand for the possessed thing: 私の means mine.','Grammar · possession ellipsis'),
 ('母は今、台所＿＿います。存在する場所を示します。','に',['で','へ','を'],'に marks the location of existence with います. This is not a cooking-action sentence with で.','Grammar · living location'),
 ('昨日は＿＿です。「楽しい」の過去形を選びます。','楽しかった',['楽しいでした','楽しくでした','楽しいだ'],'The い-adjective past removes い and adds かった: 楽しかったです.','Grammar · adjective past'),
 ('明日、一緒に昼ご飯を＿＿。丁寧に誘います。','食べませんか',['食べませんでした','食べないでください','食べたことがあります'],'食べませんか invites someone to eat together. The alternatives are not invitations.','Grammar · meal invitation'),
 ('ここで待って＿＿。丁寧に待つよう頼みます。','ください',['いました','いますか','もいいですか'],'てください is a polite request to the listener. てもいいですか instead requests permission for the speaker.','Grammar · request'),
 ('私は昨日、学校へ＿＿。行くの丁寧な過去形を選びます。','行きました',['行います','行くでした','行っています'],'行きました is the polite past of 行く. 行います is a different verb, 行う.','Grammar · go past'),
 ('私はこの本を＿＿。まだ読んでいません。読む予定を言います。','読むつもりです',['読んだところです','読んでしまいました','読んでいるところです'],'読むつもりです expresses intention. The other options state completion or an ongoing reading, conflicting with まだ読んでいません.','Grammar · planned action'),
 ('これは＿＿本です。「おもしろい」で本を直接説明します。','おもしろい',['おもしろいな','おもしろくの','おもしろいの'],'An い-adjective modifies a noun directly: おもしろい本. It does not add な or の.','Grammar · adjective modifier'),
]
EXAM_R = [
 ('何を先にしますか。','駅で切符を買います。',['友達の家に行きます。','映画を見ます。','晩ご飯を作ります。'],'The ticket purchase precedes going to the friend’s home. The film is afterward; cooking is not mentioned.','Reading · order','今日は駅で切符を買ってから、友達の家へ行きます。その後、一緒に映画を見ます。晩ご飯は店で食べます。'),
 ('今日、返す物はどれですか。','辞書',['かばん','時計','自転車'],'The note asks for the dictionary today. The bag can wait until tomorrow. Other objects are not borrowed here.','Reading · different return days','昨日貸した辞書を今日返してください。かばんは明日でいいです。私は午後、学校にいます。学校で会いましょう。'),
 ('レンは何時に家を出ますか。','七時半',['七時','八時','八時半'],'Seven is getting up; half past seven is leaving home; eight is the class start.','Reading · schedule','私は七時に起きます。朝ご飯を食べて、七時半に家を出ます。学校の授業は八時からです。レン'),
 ('二つのパンはいくらですか。','二百円',['百円','三百円','四百円'],'One bread item costs 100 yen, so two cost 200. The tea price is a separate amount.','Reading · simple total','パンは一つ百円です。お茶は一つ百五十円です。パンは今日もあります。私はパンを二つ買います。'),
 ('どの本を読みますか。','短い本',['長い本','赤い本','新しい本'],'The writer chooses the short book because the long one is difficult. Colour and newness are not supplied.','Reading · stated choice','この長い本は難しいです。あの短い本はやさしいです。今日は短い本を読みます。長い本は来月読みたいです。'),
 ('ユイは明日どこで勉強しますか。','家',['図書館','学校','店'],'Tomorrow the library is closed, so Yui studies at home. The library was today’s study location.','Reading · day contrast','今日は図書館で勉強しました。明日は図書館が休みですから、家で勉強します。友達も私の家へ来ます。ユイ'),
 ('教室は何階ですか。','三階',['一階','二階','四階'],'The notice locates the classroom on the third floor. The reception on the first floor is a different destination.','Reading · floor distinction','受付は一階です。教室は三階です。エレベーターは使えませんから、階段で三階へ行ってください。'),
 ('今日の天気についてわかることは？','朝は雨でした。',['一日中晴れでした。','今も雨です。','夜は雪でした。'],'The text states morning rain and current clear weather. It supplies no night snow or all-day sunshine.','Reading · time and weather','朝は雨でしたが、今は晴れです。今日は傘を持ってきました。帰る時は、傘をかばんに入れます。'),
]

def compile_rows(rows, stage, prefix, start):
    result = []
    for n, row in enumerate(rows, start):
        prompt, right, wrong, explanation, focus, *passage = row
        position = (n - 1) % 4
        options = list(wrong)
        options.insert(position, right)
        question = dict(id=f'n5-{prefix}{n:02}', level='N5', stage=stage,
                        prompt=prompt, options=options, answer=position, explanation=explanation, focus=focus)
        if passage: question['passage'] = passage[0]
        if stage == 'exam': question['section'] = focus.split(' · ')[0].lower()
        result.append(question)
    return result

def main():
    path = ROOT / 'content/jlpt/questions.json'
    questions = json.loads(path.read_text(encoding='utf-8'))
    legacy = {f'n5-{prefix}{i}' for prefix, count in [('v',2),('g',2),('r',2),('e',6)] for i in range(1,count+1)}
    kept = [q for q in questions if q['level'] != 'N5' or q['id'] in legacy]
    for q in kept:
        if q['stage'] == 'exam' and 'section' not in q:
            q['section'] = 'reading' if q.get('passage') else 'vocabulary' if q['focus'] == 'Vocabulary' else 'grammar'
    result = kept + compile_rows(VOCAB,'vocabulary','v',3) + compile_rows(GRAMMAR,'grammar','g',3) + compile_rows(READING,'reading','r',3)
    result += compile_rows(EXAM_V + EXAM_G + EXAM_R,'exam','e',7)
    assert len([q for q in result if q['level']=='N5']) == 90
    assert len({q['id'] for q in result}) == len(result)
    path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    sizes_path = ROOT / 'content/jlpt/bank-sizes.json'
    sizes = json.loads(sizes_path.read_text(encoding='utf-8'))
    sizes['N5'] = dict(vocabulary=20,grammar=20,reading=20,exam=30)
    sizes_path.write_text(json.dumps(sizes,indent=2)+'\n',encoding='utf-8',newline='\n')
    print('N5 bank: 60 checkpoints + 30 separate sample items. Historical items retained.')

if __name__=='__main__': main()
