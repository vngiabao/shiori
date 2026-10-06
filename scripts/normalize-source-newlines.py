"""Keep hashed JSON/TSV identical on Windows and Git's LF checkout.

Also make Path.write_text provenance writers explicitly emit LF. Binary models,
audio and downloaded archives are never rewritten.
"""
import ast,subprocess
from pathlib import Path
root=Path(__file__).resolve().parent.parent
for name in subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0'):
    if not name or Path(name).suffix not in ('.json','.tsv'): continue
    path=(root/name).resolve()
    assert path.is_relative_to(root)
    data=path.read_bytes()
    normalized=data.replace(b'\r\n',b'\n')
    if data!=normalized:path.write_bytes(normalized)
for path in (root/'scripts').glob('*.py'):
    if path.name==Path(__file__).name:continue
    data=path.read_bytes().replace(b'\r\n',b'\n')
    tree=ast.parse(data)
    lines=data.splitlines(keepends=True)
    starts=[0]
    for line in lines:starts.append(starts[-1]+len(line))
    offsets=[]
    for node in ast.walk(tree):
        if isinstance(node,ast.Call) and isinstance(node.func,ast.Attribute) and node.func.attr=='write_text' and not any(k.arg=='newline' for k in node.keywords):
            offsets.append(starts[node.end_lineno-1]+node.end_col_offset-1)
    for offset in sorted(offsets,reverse=True):
        assert data[offset:offset+1]==b')'
        data=data[:offset]+b", newline='\\n'"+data[offset:]
    ast.parse(data)
    if data!=path.read_bytes():path.write_bytes(data)
print('Tracked JSON/TSV and Python text writers use LF; binary assets untouched.')
