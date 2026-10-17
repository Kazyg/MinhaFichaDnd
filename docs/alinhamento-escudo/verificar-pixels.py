"""Check actual screenshot pixels, independently of Canvas text metrics.

Usage: python docs/alinhamento-escudo/verificar-pixels.py [after|before]
Pillow is required. A failure exits nonzero; before is expected to fail.
"""
from collections import deque
import json
from pathlib import Path
import sys
from PIL import Image


def measure(image):
    width, height = image.size
    raw = image.convert('RGB').tobytes()
    pixels = list(zip(raw[0::3], raw[1::3], raw[2::3]))
    # The orange outline is separate from both the dark background and white ink.
    outline = [r > 150 and r > g * 1.5 and g > b * 1.4 for r, g, b in pixels]
    exterior = set()
    queue = deque()

    def visit(i):
        if i not in exterior and not outline[i]:
            exterior.add(i)
            queue.append(i)

    for x in range(width):
        visit(x)
        visit((height - 1) * width + x)
    for y in range(height):
        visit(y * width)
        visit(y * width + width - 1)
    while queue:
        i = queue.popleft()
        x, y = i % width, i // width
        for valid, neighbor in [(x > 0, i - 1), (x < width - 1, i + 1), (y > 0, i - width), (y < height - 1, i + width)]:
            if valid:
                visit(neighbor)
    interior = [i for i in range(len(pixels)) if not outline[i] and i not in exterior]
    if not interior:
        raise ValueError('No closed shield outline found')
    center = [sum(i % width + .5 for i in interior) / len(interior), sum(i // width + .5 for i in interior) / len(interior)]
    ink = [i for i in interior if min(pixels[i]) > 160 and max(pixels[i]) - min(pixels[i]) < 20]
    if not ink:
        raise ValueError('No numeral ink inside shield')
    bounds = [min(i % width for i in ink), min(i // width for i in ink), max(i % width for i in ink) + 1, max(i // width for i in ink) + 1]
    ink_center = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2]
    return center, bounds, ink_center


folder = Path(__file__).resolve().parent / (sys.argv[1] if len(sys.argv) > 1 else 'after')
data = json.loads((folder / 'result.json').read_text(encoding='utf-8'))
checks = []
for case in data['checks']:
    scenario = case.get('scenario') or ('mobile-' if case['viewport']['width'] < 768 else 'desktop-') + str(case['viewport']['width'])
    filename = case.get('screenshot') or f"{scenario}-{case['value']}-escudo.png"
    with Image.open(folder / filename) as image:
        center, bounds, ink_center = measure(image)
    dpr = case['viewport']['dpr']
    delta = [(ink_center[axis] - center[axis]) / dpr for axis in (0, 1)]
    checks.append(dict(screenshot=filename, value=case['value'], shieldInteriorCentroid=center, inkBounds=bounds, inkCenter=ink_center, deltaCssPixels=delta, passed=all(abs(v) <= 1 for v in delta)))
report = dict(method='Orange outline flood fill + white numeral ink bounding box; no Canvas metrics', toleranceCssPixels=1, checks=checks, passed=bool(checks) and all(c['passed'] for c in checks))
(folder / 'pixels.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(dict(passed=report['passed'], cases=len(checks), maxDeviationCssPixels=max(abs(v) for c in checks for v in c['deltaCssPixels']), failures=[c for c in checks if not c['passed']]), indent=2))
sys.exit(0 if report['passed'] else 1)
