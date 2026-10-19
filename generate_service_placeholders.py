#!/usr/bin/env python3
"""Generate 5 vertical placeholder WebP images (1080×1920) for the Services section."""

import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow not found. Run: pip install Pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).parent
OUTPUT = ROOT / "public" / "images" / "services"
WIDTH, HEIGHT = 1080, 1920

SERVICES = [
    ("01", "Border &\nCustoms", "#11263c"),
    ("02", "Live\nTracking", "#1a2e24"),
    ("03", "Cargo\nSecurity", "#2c1f14"),
    ("04", "Accountable\nContact", "#1a1f3c"),
    ("05", "Digital\nPaperwork", "#3c1f28"),
]

def get_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if os.path.isfile(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    font = get_font(80)

    for idx, (num, label, bg) in enumerate(SERVICES, start=1):
        img = Image.new("RGB", (WIDTH, HEIGHT), bg)
        draw = ImageDraw.Draw(img)

        text = f"{num}\n{label}"
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        x = (WIDTH - w) // 2
        y = (HEIGHT - h) // 2

        draw.text((x, y), text, fill="#f8f4eb", font=font)

        out = OUTPUT / f"s{idx}.webp"
        img.save(str(out), "WEBP", quality=80)
        print(f"[OK] {out.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
