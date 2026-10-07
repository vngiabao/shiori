import json,re
from pathlib import Path
order=['first-post']+[f'{l}-u{n:02}' for l,total in [('n5',12),('n4',12),('n3',16),('n2',16),('n1',12),('keigo',12)] for n in range(1,total+1)]
packs=[json.loads(Path(f'content/packs/{i}.json').read_text(encoding='utf8')) for i in order]
plain=lambda t:re.sub(r'\{([^|{}]+)\|[^{}]+\}',r'\1',t)
rows=[]
for p in packs:
 lessons=[l['id'] for l in p['lessons']]
 for g in p['grammar']:
  scope=g.get('lessons',lessons)
  assert scope and all(l in lessons for l in scope),g['id']
  bound=[x for x in p.get('exercises',[]) if x.get('lesson') in scope]
  rows.append({'id':g['id'],'title':g['title'],'firstTeachingUnit':p['id'],'firstTeachingLesson':min(scope,key=lessons.index) if g.get('formation') else None,'teachingLessons':scope,'firstBoundTask':bound[0]['id'] if bound and g.get('formation') else None,'formation':g.get('formation'),'examples':g.get('examples',[]),'scope':'Explicit note/lesson binding, not an automatic parser of every grammatical construction in prose.'})
expected=json.loads(Path('output/content-inventory.json').read_text(encoding='utf8'))['grammarNotes']
assert len(rows)==expected,(len(rows),expected)
result={'grammarNotes':rows,'units':order,'scope':'Every note has a valid teaching scope. PhraseLesson presents bound notes that carry a formation rule before scenes and scored exercises; legacy seed notes without formation are reference-only. Source-pack validation checks future word references and paired-reading order. This ledger records the earliest explicit teaching and first task within that scope; it does not certify that every incidental construction was previously taught. Per-level editorial reviews supply the separate naturalness/story assessment.','nativeReviewed':False}
Path('output/course-continuity.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8',newline='\n')
print(len(rows),'grammar-note scopes checked across',len(packs),'core packs')
