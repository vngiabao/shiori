"""Small reviewed corrections to the first N4 batch; preserve stable item ids."""
import hashlib,json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
def read(p): return json.loads((root/p).read_text(encoding='utf-8'))
def write(p,v): (root/p).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8', newline='\n')
p=read('content/units/n4-u01.json')
x=next(x for x in p['exercises'] if x['id']=='n4-u01-x-bus')
x.update(type='cloze',skill='recall',context='Try taking the bus once to find out what the journey is like.',line='バスに{乗|の}って＿＿。',options=['みます','あります','なります','います'],answer=0,explain='The て-form + みる means trying an action to see what it is like: 乗ってみます. The bus is available in the scene.',words=['n5-u10-w-basu'])
x.pop('dialogue',None);x.pop('prompt',None)
write('content/units/n4-u01.json',p)
p=read('content/units/n4-u02.json')
line=p['dialogues'][1]['lines'][4]
line.update(line='{私|わたし}もその{財布|さいふ}が{欲|ほ}しいです。{今度|こんど}、ほかのアルバイトを{探|さが}します。{時給|じきゅう}はもっと{高|たか}いほうがいいです。',romaji='Watashi mo sono saifu ga hoshii desu. Kondo, hoka no arubaito o sagashimasu. Jikyū wa motto takai hō ga ii desu.',meaning="I'd like that wallet too. Next time I'll look for another part-time job. I'd prefer higher hourly pay.")
next(x for x in p['exercises'] if x['id']=='n4-u02-x-pay')['explain']='時給はもっと高いほうがいいです states a preference for higher hourly pay.'
write('content/units/n4-u02.json',p)
