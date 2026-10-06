"""Rebuild Shiori's outlined SVG identity from its local OFL typeface.

Requires fontTools. No font is needed to display the exported logos.
The bookmark-S geometry is original; Cormorant supplies the letter outlines.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'brand'
OUT.mkdir(parents=True, exist_ok=True)
FONT = ROOT / 'node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff'
font = TTFont(FONT)
glyphs = font.getGlyphSet()

# A continuous folded strip: the lower terminal ends in a bookmark notch.
RIBBON_S = 'M82 24H48C31 24 22 33 22 46C22 60 32 68 48 68H63C70 68 74 71 74 77C74 83 69 87 62 87H29L37 95L29 103H62C81 103 92 93 92 77C92 61 81 52 64 52H48C42 52 39 49 39 45C39 41 43 39 49 39H82Z'

def mark(ink, violet, red, tile=False):
    back = '<rect width="112" height="112" rx="25" fill="#172c49"/>' if tile else ''
    # Optical centering leaves enough breathing room for launcher masks.
    return back + f'<g transform="translate(9 0) scale(.84)"><path d="{RIBBON_S}" fill="{ink}"/><path d="M64 52H48L67 68H83C79 60 73 55 64 52Z" fill="{violet}"/><path d="M72 17H84V43L78 38L72 43Z" fill="{red}"/></g>'

def letters(ink, violet):
    result = []
    x = 0
    for char in 'shiori':
        name = 'dotlessi' if char == 'i' else char
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(pen)
        result.append(f'<path transform="translate({x} 0)" d="{pen.getCommands()}" fill="{ink}"/>')
        if char == 'i':
            center = x + 132
            result.append(f'<path d="M{center-30} 578H{center+30}V472L{center} 495L{center-30} 472Z" fill="{violet}"/>')
        x += glyphs[name].width - 10
    return ''.join(result)

def svg(body, viewbox, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img"><title>{title}</title>{body}</svg>\n'

for variant, ink, violet, red in [
    ('', '#172c49', '#655080', '#a8323e'),
    ('-inverse', '#f7f5f1', '#ccb8e4', '#e0727c'),
    ('-mono', '#172c49', '#172c49', '#172c49'),
]:
    (OUT / f'shiori-mark{variant}.svg').write_text(svg(mark(ink, violet, red), '0 0 112 112', 'Shiori bookmark S'), encoding='utf-8', newline='\n')
    word = letters(ink, violet)
    (OUT / f'shiori-wordmark{variant}.svg').write_text(svg(f'<g transform="translate(2 67) scale(.1 -.1)">{word}</g>', '0 0 220 76', 'Shiori'), encoding='utf-8', newline='\n')
    lockup = f'<g transform="translate(0 2) scale(.72)">{mark(ink, violet, red)}</g><g transform="translate(91 67) scale(.09 -.09)">{word}</g>'
    (OUT / f'shiori-lockup{variant}.svg').write_text(svg(lockup, '0 0 290 84', 'Shiori'), encoding='utf-8', newline='\n')

(ROOT / 'public/icon.svg').write_text(svg(mark('#f7f5f1', '#ccb8e4', '#e0727c', True), '0 0 112 112', 'Shiori'), encoding='utf-8', newline='\n')
print('Wrote nine outlined SVG brand assets and the app icon.')
