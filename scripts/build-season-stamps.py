"""Cut the twelve GPT-drawn season stamps out of their grey backdrop and pack
them into the 4 x 3 sprite the daily post uses (January first, row by row).

    py -X utf8 scripts/build-season-stamps.py

Reads assets/generated/season-stamps.png (the untouched original) and writes
public/post/season-stamps.webp. Each stamp is found by the transparent gaps
between stamps, cropped to its own pixels and scaled into a 176 x 220 cell.
"""

from collections import deque

import numpy as np
from PIL import Image, ImageFilter

SOURCE = "assets/generated/season-stamps.png"
TARGET = "public/post/season-stamps.webp"
CELL_W, CELL_H = 176, 220

src = Image.open(SOURCE).convert("RGB")
a = np.asarray(src).astype(int)
H, W, _ = a.shape
hi, lo = a.max(2), a.min(2)
# The backdrop is a neutral grey vignette; stamp edges are ivory or navy.
grey = ((hi - lo) <= 22) & (hi <= 228) & (hi >= 40)

# Flood the backdrop from the border so grey inside a stamp is never touched.
bg = np.zeros((H, W), bool)
queue = deque()
for x in range(W):
    for y in (0, H - 1):
        if grey[y, x]:
            bg[y, x] = True
            queue.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if grey[y, x]:
            bg[y, x] = True
            queue.append((y, x))
while queue:
    y, x = queue.popleft()
    for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
        if 0 <= ny < H and 0 <= nx < W and not bg[ny, nx] and grey[ny, nx]:
            bg[ny, nx] = True
            queue.append((ny, nx))

alpha = (
    Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    .filter(ImageFilter.MinFilter(3))
    .filter(ImageFilter.GaussianBlur(0.6))
)
rgba = src.copy()
rgba.putalpha(alpha)
opaque = np.asarray(alpha) > 128


def runs(profile, n):
    """The n widest stretches of opaque columns or rows, in order."""
    found, start = [], None
    for i, on in enumerate(profile > 4):
        if on and start is None:
            start = i
        if not on and start is not None:
            found.append((start, i))
            start = None
    if start is not None:
        found.append((start, len(profile)))
    return sorted(sorted(found, key=lambda r: r[1] - r[0], reverse=True)[:n])


columns, rows = runs(opaque.sum(0), 4), runs(opaque.sum(1), 3)
sheet = Image.new("RGBA", (CELL_W * 4, CELL_H * 3), (0, 0, 0, 0))
for r, (y0, y1) in enumerate(rows):
    for c, (x0, x1) in enumerate(columns):
        stamp = rgba.crop((x0, y0, x1, y1))
        ys, xs = np.where(np.asarray(stamp.split()[3]) > 128)
        stamp = stamp.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
        stamp = stamp.resize((CELL_W - 8, CELL_H - 8), Image.LANCZOS)
        sheet.paste(stamp, (c * CELL_W + 4, r * CELL_H + 4), stamp)
sheet.save(TARGET, "WEBP", quality=88, method=6)
print(f"wrote {TARGET}")
