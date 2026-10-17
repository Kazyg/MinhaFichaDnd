"""Measure the shield's interior without confusing its centroid with its bounds.

Run from any directory with Python and Pillow installed::

    python docs/alinhamento-escudo/medir-geometria.py

The script only reads the PNG and writes JSON to stdout. Coordinates refer to the
original image; bounds are half-open and each pixel contributes at its center
(x + 0.5, y + 0.5). The orange outline separates the enclosed transparent interior
from the transparent exterior, found by a four-connected flood fill. Several
alpha thresholds show how little antialiasing affects the measured centroid.
"""

from __future__ import annotations

import argparse
from collections import deque
import json
from pathlib import Path

try:
    from PIL import Image
except ImportError as error:
    raise SystemExit("Pillow is required: python -m pip install Pillow") from error


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_IMAGE = REPOSITORY_ROOT / "src" / "imagens" / "icon_ac.png"


def interior_measurement(alpha: bytes, width: int, height: int, threshold: int) -> dict:
    outline = bytearray(value > threshold for value in alpha)
    exterior = bytearray(width * height)
    pending: deque[int] = deque()

    def visit(index: int) -> None:
        if not outline[index] and not exterior[index]:
            exterior[index] = 1
            pending.append(index)

    # Starting at every image edge also works if the outline touches an edge.
    for x in range(width):
        visit(x)
        visit((height - 1) * width + x)
    for y in range(height):
        visit(y * width)
        visit(y * width + width - 1)

    while pending:
        index = pending.popleft()
        x, y = index % width, index // width
        if x > 0:
            visit(index - 1)
        if x + 1 < width:
            visit(index + 1)
        if y > 0:
            visit(index - width)
        if y + 1 < height:
            visit(index + width)

    interior = [
        index for index in range(width * height)
        if not outline[index] and not exterior[index]
    ]
    if not interior:
        raise ValueError(f"No enclosed transparent interior at alpha > {threshold}")

    xs = [index % width for index in interior]
    ys = [index // width for index in interior]
    bounds = [min(xs), min(ys), max(xs) + 1, max(ys) + 1]
    centroid_x = sum(x + 0.5 for x in xs) / len(interior)
    centroid_y = sum(y + 0.5 for y in ys) / len(interior)
    return {
        "outline_alpha_greater_than": threshold,
        "interior_pixel_count": len(interior),
        "interior_bounds": bounds,
        "interior_bounds_center": [
            (bounds[0] + bounds[2]) / 2,
            (bounds[1] + bounds[3]) / 2,
        ],
        "interior_area_centroid": [centroid_x, centroid_y],
        "interior_area_centroid_percent": [
            100 * centroid_x / width,
            100 * centroid_y / height,
        ],
        "centroid_minus_image_center": [
            centroid_x - width / 2,
            centroid_y - height / 2,
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", nargs="?", type=Path, default=DEFAULT_IMAGE)
    parser.add_argument(
        "--threshold", type=int, action="append", choices=range(256),
        metavar="0..255", help="Repeat to override default alpha thresholds.",
    )
    args = parser.parse_args()

    with Image.open(args.image) as source:
        image = source.convert("RGBA")
    width, height = image.size
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds is None:
        raise SystemExit("The image is fully transparent.")

    result = {
        "image": args.image.name,
        "dimensions": [width, height],
        "image_center": [width / 2, height / 2],
        "visible_alpha_bounds": list(bounds),
        "visible_alpha_bounds_center": [
            (bounds[0] + bounds[2]) / 2,
            (bounds[1] + bounds[3]) / 2,
        ],
        "measurements": [
            interior_measurement(alpha.tobytes(), width, height, threshold)
            for threshold in (args.threshold or [0, 64, 128, 192, 254])
        ],
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
