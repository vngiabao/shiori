import json,pathlib,sys
p=pathlib.Path(__file__).resolve().parents[1]
files=sorted((p/'content/units').glob('n5-u*.json'))
for f in files[int(sys.argv[1])-1:int(sys.argv[2])]:
 d=json.loads(f.read_text(encoding='utf-8'));print('\nUNIT',d['id'])
 print('WORDS',json.dumps(d['words'],ensure_ascii=False))
 for g in d['grammar']:print('GRAMMAR',json.dumps(g,ensure_ascii=False))
 print('DIALOGUE',json.dumps(d['dialogue'],ensure_ascii=False))
 for x in d['exercises']:print('TASK',json.dumps(x,ensure_ascii=False))
 wm={w['id']:w['text'] for f2 in (p/'content/packs').glob('*.json') for w in json.loads(f2.read_text(encoding='utf-8'))['words']}
 letter=d['letter'].copy();letter['rendered']='。'.join(''.join(wm[x] for x in line) for line in letter['sentences'])+'。';print('LETTER',json.dumps(letter,ensure_ascii=False))
