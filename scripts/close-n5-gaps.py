"""Apply the two missing starter scenes idempotently; generated N5 units use build-unit."""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
path=root/'content/packs/first-post.json'
p=json.loads(path.read_text(encoding='utf-8'))
scenes=[
 {'id':'d-counting','lesson':'phrase-6','title':'Counting together','scene':'Hana practises counting aloud with Yui. Listen for the groups of numbers, not English translations.', 'lines':[
  {'speaker':'Hana','line':'ユイさん、ゆっくりお{願|ねが}いします。','romaji':'Yui-san, yukkuri onegai shimasu.','meaning':'Yui, slowly, please.'},
  {'speaker':'Yui','line':'{一|いち}、{二|に}、{三|さん}。','romaji':'Ichi, ni, san.','meaning':'One, two, three.'},
  {'speaker':'Hana','line':'{三|さん}ですか。','romaji':'San desu ka.','meaning':'Three?'},
  {'speaker':'Yui','line':'はい。{四|よん}、{五|ご}、{六|ろく}。','romaji':'Hai. Yon, go, roku.','meaning':'Yes. Four, five, six.'},
  {'speaker':'Hana','line':'もう{一度|いちど}お{願|ねが}いします。','romaji':'Mō ichido onegai shimasu.','meaning':'Once more, please.'},
  {'speaker':'Yui','line':'{七|なな}、{八|はち}、{九|きゅう}、{十|じゅう}。','romaji':'Nana, hachi, kyū, jū.','meaning':'Seven, eight, nine, ten.'}]},
 {'id':'d-permission','lesson':'phrase-7','title':'A book on a rainy day','scene':'You ask Yui to read a book at the bookshop. She offers a sweet while it rains outside.', 'lines':[
  {'speaker':'You','line':'すみません。この{本|ほん}、{読|よ}んでもいいですか。','romaji':'Sumimasen. Kono hon, yonde mo ii desu ka.','meaning':'Excuse me. May I read this book?'},
  {'speaker':'Yui','line':'はい、どうぞ。','romaji':'Hai, dōzo.','meaning':'Yes, please do.'},
  {'speaker':'You','line':'ありがとうございます。やさしい{本|ほん}ですか。','romaji':'Arigatō gozaimasu. Yasashii hon desu ka.','meaning':'Thank you. Is it an easy book?'},
  {'speaker':'Yui','line':'はい、やさしいです。','romaji':'Hai, yasashii desu.','meaning':'Yes, it is easy.'},
  {'speaker':'You','line':'{今日|きょう}は{雨|あめ}ですね。','romaji':'Kyō wa ame desu ne.','meaning':'It is raining today, right?'},
  {'speaker':'Yui','line':'はい。{飴|あめ}もどうぞ。','romaji':'Hai. Ame mo dōzo.','meaning':'Yes. Have a sweet too.'}]}]
tasks=[
 ('count-last','phrase-6','d-counting','What is the last number Yui says?',['Ten','Six','Three'],'Yui ends the final turn with 十, ten.',['ten']),
 ('count-first','phrase-6','d-counting','Which group does Yui say first?',['One, two, three','Four, five, six','Seven, eight, nine'],'The first group is 一、二、三.',['one','two','three']),
 ('count-request','phrase-6','d-counting','What does Hana ask after the four–five–six group?',['Say it once more','Stop speaking','Read a book'],'もう一度お願いします is a request to say it again.',['again']),
 ('permission-object','phrase-7','d-permission','What do you ask permission to do?',['Read the book','Leave the shop','Drink coffee'],'この本、読んでもいいですか asks permission to read this book.',['may-read']),
 ('permission-gift','phrase-7','d-permission','What does Yui offer at the end?',['A sweet','An umbrella','A letter'],'飴もどうぞ is an offer of a sweet. 雨 in the previous turn refers to rain.',['candy']),
 ('permission-level','phrase-7','d-permission','How does Yui describe the book?',['Easy','Very expensive','Difficult'],'やさしいです confirms that it is easy.',['kind'])]
ids={d['id'] for d in scenes}
p['dialogues']=[d for d in p['dialogues'] if d['id'] not in ids]+scenes
new=[]
for i,(id,lesson,dialogue,prompt,options,explain,words) in enumerate(tasks):
 answer=i%3;rotated=options[1:];rotated.insert(answer,options[0])
 new.append({'id':'x-'+id,'lesson':lesson,'dialogue':dialogue,'type':'dialogue','skill':'listening','prompt':prompt,'options':rotated,'answer':answer,'explain':explain,'words':words})
newids={x['id'] for x in new}
p['exercises']=[x for x in p['exercises'] if x['id'] not in newids]+new
variants={
 ('meet-yui',0): ('はじめまして。よろしくお願いします。', '^はじめまして[。、 ]*よろしく(お願いします|おねがいします)[。！!]*$'),
 ('meet-yui',1): ('こちらこそ、よろしくお願いします。', '^こちらこそ[、, ]*よろしく(お願いします|おねがいします)[。！!]*$'),
 ('tea-ren',0): ('レンさん、こんにちは。', '^レンさん[、, ]*こんにちは[。！!]*$'),
 ('tea-ren',1): ('お茶をください。', '^(お茶|おちゃ)(を)?ください[。！!]*$'),
 ('tea-ren',2): ('どうもありがとうございます。', '^どうもありがとうございます[。！!]*$'),
 ('slow-hana',0): ('よくわかりません。', '^(すみません[、, ]*)?よくわかりません[。！!]*$'),
 ('slow-hana',1): ('もう一度言ってください。', '^もう(一度|いちど)(言って|いって)ください[。！!]*$')
}
for roleplay in p['roleplays']:
 for i,turn in enumerate(roleplay['turns']):
  alternative,pattern=variants[(roleplay['id'],i)]
  turn['alternatives']=[alternative]
  if pattern not in turn['accept']:turn['accept'].append(pattern)
  if roleplay['id']=='tea-ren' and i==0:
   turn['accept']=[a for a in turn['accept'] if 'よろしく' not in a]
  meanings={'meet-yui':['Nice to meet you.','I look forward to getting to know you.'],'tea-ren':['Hello.','Tea, please.','Thank you.'],'slow-hana':['I do not understand.','Once more, please.']}
  turn['exampleMeaning']=meanings[roleplay['id']][i]
path.write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')

# Replace the deictic "write here" instruction in the classroom letter with an
# action the learner can perform before class: write their name in their book.
unit=root/'content/units/n5-u06.json'
d=json.loads(unit.read_text(encoding='utf-8'))
d['letter']['sentences'][-1]=['book','n5-u03-w-ni','name','wo','n5-u06-w-kaite']
unit.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
print('Two starter scenes, six scene questions and the unit-6 instruction updated.')
