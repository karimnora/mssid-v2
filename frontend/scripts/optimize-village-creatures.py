"""Technical WebP derivatives for 60-110px sprites. Originals remain untouched."""
from pathlib import Path
from PIL import Image
import hashlib, json
root=Path(__file__).resolve().parents[2]
source=root/'frontend/src/assets/design/home-v3/creatures'
out=source/'compact';out.mkdir(exist_ok=True)
rows=[]
for file in sorted(source.glob('*.webp')):
    image=Image.open(file).convert('RGBA')
    image.thumbnail((192,192),Image.Resampling.LANCZOS)
    target=out/file.name
    image.save(target,'WEBP',quality=82,method=6)
    rows.append({'file':file.name,'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'sourceBytes':file.stat().st_size,'bytes':target.stat().st_size,'width':image.width,'height':image.height})
report=root/'docs/design/v2-preparation-familles/creatures.json'
report.parent.mkdir(parents=True,exist_ok=True)
report.write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(sum(row['sourceBytes'] for row in rows),'->',sum(row['bytes'] for row in rows),'bytes')
