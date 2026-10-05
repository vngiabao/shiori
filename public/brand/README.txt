SHIORI IDENTITY ASSETS

CURRENT APPROVED IDENTITY — 2026-10-05
shiori-signature.svg             Reserved Violetto writing over shiori, blue text
shiori-signature-inverse.svg     Same artwork, warm-white text for dark surfaces
shiori-violetto-icon.svg         Same face cropped into the app tile
signature-provenance.json        Source, trace settings and finishing notes

These are genuine vector paths, not PNGs embedded in SVG. The approved source
is output/shiori-signature-concept-v2/shiori-signature.png. The original image
generation prompts are next to it. scripts/build-signature-brand.py traces the
source using Python 3.12 + vtracer==0.6.12, removes its background, restores the
tiny neutral mouth/eye glints, and exports light/inverse SVGs plus the app icon.
Keep the source and generation settings for reproducibility. Curves approximate
the approved raster; they are not original hand-drawn vector source files.

The shared Brand component uses the signature: 124px wide in the desktop header,
112px on phones; Welcome uses 174px / 140px. Headers accommodate its taller
proportions. The navy header always uses warm-white lettering; Welcome and the
loading state switch variants with the theme. The same-face SVG icon is used by
the browser and PWA manifest. Preview and download at /brand/.

LEGACY BOOKMARK IDENTITY (kept for reference, no longer used by Brand)
The instructions below describe only the earlier bookmark assets. Running the
legacy build-brand.py does not regenerate or overwrite the current signature.

Shiori (栞) means bookmark. The original S is a continuous folded strip with a
bookmark notch. Its violet fold and small red ribbon echo the correspondence
world and Violetto's character details. Both i dots repeat the bookmark shape.
Kiyo's meaningful symbol-and-wordmark pairing informed the approach; Shiori's
symbol geometry is original.

FILES
shiori-mark.svg                 Standalone bookmark-S symbol
shiori-wordmark.svg             Outlined lowercase Shiori lettering
shiori-lockup.svg               Symbol and wordmark together
Each has -inverse.svg and -mono.svg variants (nine SVGs total).
../icon.svg                    Inverse symbol on a rounded Prussian blue tile
index.html                     Preview and download page, served at /brand/
FONT-LICENSE.txt               Cormorant copyright and SIL OFL 1.1 license

COLOR AND USE
Primary: Prussian blue #172c49, violet #655080, ribbon red #a8323e.
Inverse: soft white #f7f5f1, violet #ccb8e4, ribbon red #e0727c.
Monochrome: all geometry uses Prussian blue #172c49.
Use primary on light backgrounds and inverse on deep blue or dark backgrounds.
Use monochrome for single-color reproduction. Preserve aspect ratios and the
supplied shapes: do not distort, rotate, crop, add effects or rebuild the text.

Keep clear space around the visible artwork of at least one S stem height,
measured as the thickness of the S's straight upper horizontal stroke at the
chosen scale. Minimum digital lockup width: 144px. Minimum standalone mark
width: 16px; at that size the silhouette is the principal recognition cue.
The app uses lockups at 174px normally, 208px on Welcome and 152px on phones.

REGENERATE
From the Japanese project root, with npm dependencies already installed:

    python -m pip install fontTools brotli
    python scripts/build-brand.py

The generator requires fontTools and reads:
node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff
It writes all nine brand SVGs and public/icon.svg. It does not create the
preview page or documentation. Output lettering consists entirely of vector
paths, so displaying the logos requires no installed or downloaded font.

ATTRIBUTION
Letter outlines are adapted from Cormorant Garamond 600, Copyright 2015 The
Cormorant Project Authors (github.com/CatharsisFonts/Cormorant), licensed under
the SIL Open Font License 1.1. The bookmark-S and bookmark dots are original
geometry. Keep FONT-LICENSE.txt with this asset pack.
