"""Trace the user-approved logo into real SVG paths (no embedded raster).

Requires Python 3.12 and vtracer==0.6.12. The 0.6.15 Windows/Python 3.14
binding crashed during conversion; this version is the verified build tool.
"""
from pathlib import Path
import copy
import json
import xml.etree.ElementTree as ET
import vtracer

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'output/shiori-signature-concept-v2/shiori-signature.png'
OUT = ROOT / 'public/brand'
TRACE = ROOT / 'output/shiori-signature-concept-v2/trace.svg'
SETTINGS = dict(colormode='color', hierarchical='cutout', mode='spline',
                filter_speckle=1, color_precision=6, layer_difference=4,
                corner_threshold=60, length_threshold=2.0,
                splice_threshold=45, path_precision=2)
vtracer.convert_image_to_svg_py(str(SOURCE), str(TRACE), **SETTINGS)
ET.register_namespace('', 'http://www.w3.org/2000/svg')
NS = '{http://www.w3.org/2000/svg}'
paths = list(ET.parse(TRACE).getroot())
# These two pale-blue regions are the exterior background and the o counter.
# Cutout tracing preserves holes; removing them makes the SVG transparent.
paths = [p for p in paths if p.get('fill') not in {'#EBF3F9', '#ECF3FA'}]
# Restore the source's tiny expression details that color clustering discards.
# Coordinates are in the approved 1536 x 1024 source, not a redesigned face.
paths.append(ET.Element(NS+'path', {'d':'M625 443.5 H633', 'fill':'none',
    'stroke':'#a36c50', 'stroke-width':'2', 'stroke-linecap':'round'}))
for cx, cy in ((569, 405), (693, 396)):
    paths.append(ET.Element(NS+'path', {'d':f'M{cx-5} {cy} a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0', 'fill':'#f7f5f1'}))
# Verified blue-only regions: six letters, two i dots, and the pen flourish.
LETTER_COLORS = {'#1F4274', '#1F4375', '#1E4274', '#204476', '#244B7C', '#2C5081'}

def lockup(inverse=False):
    root = ET.Element(NS+'svg', {'viewBox': '160 75 1230 825',
        'width': '1230', 'height': '825', 'role': 'img'})
    ET.SubElement(root, NS+'title').text = 'Shiori — Violetto writing'
    ET.SubElement(root, NS+'desc').text = 'Approved character and lettering traced into scalable vector paths.'
    for original in paths:
        p = copy.deepcopy(original)
        if p.get('fill') in LETTER_COLORS:
            p.set('fill', '#f7f5f1' if inverse else '#23467a')
        root.append(p)
    return root

for inverse in (False, True):
    suffix = '-inverse' if inverse else ''
    ET.ElementTree(lockup(inverse)).write(OUT / f'shiori-signature{suffix}.svg', encoding='utf-8', xml_declaration=True)

# The tiny app mark uses the same approved face, not a separately redrawn pose.
icon = ET.Element(NS+'svg', {'viewBox':'0 0 512 512', 'width':'512', 'height':'512'})
ET.SubElement(icon, NS+'title').text = 'Shiori'
defs = ET.SubElement(icon, NS+'defs')
clip = ET.SubElement(defs, NS+'clipPath', {'id':'tile'})
ET.SubElement(clip, NS+'rect', {'width':'512','height':'512','rx':'96'})
group = ET.SubElement(icon, NS+'g', {'clip-path':'url(#tile)'})
ET.SubElement(group, NS+'rect', {'width':'512','height':'512','fill':'#172c49'})
portrait = ET.SubElement(group, NS+'svg', {'x':'16','y':'24','width':'480','height':'488',
    'viewBox':'390 80 540 549', 'overflow':'hidden'})
for p in paths:
    portrait.append(copy.deepcopy(p))
ET.ElementTree(icon).write(OUT/'shiori-violetto-icon.svg', encoding='utf-8', xml_declaration=True)
(OUT/'signature-provenance.json').write_text(json.dumps({
    'approvedSource': str(SOURCE.relative_to(ROOT)).replace('\\','/'),
    'originalMedium': 'Built-in image generation; user approved reserved writing pose on 2026-10-05',
    'sourcePrompts': 'output/shiori-signature-concept-v2/prompts.json',
    'conversion': 'VTracer 0.6.12, cubic Bezier paths, no embedded raster or external font',
    'settings': SETTINGS, 'pathsPerLockup': len(paths),
    'finishing': 'Remove two background regions; restore tiny neutral mouth and eye glints; unify lettering blue; inverse lettering warm white; cropped viewBox; same-face vector app icon',
}, indent=2)+'\n', encoding='utf-8')
print(f'Created two transparent lockups ({len(paths)} paths each) and a vector app icon.')
