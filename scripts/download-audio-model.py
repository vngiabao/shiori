import urllib.request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
root=Path(__file__).resolve().parent.parent/'.models'
root.mkdir(exist_ok=True)
def fetch(name):
    target=root/name
    if not target.exists():
        urllib.request.urlretrieve('https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/'+name,target)
    print(name, target.stat().st_size,flush=True)
with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(fetch,['kokoro-v1.0.int8.onnx','voices-v1.0.bin']))
