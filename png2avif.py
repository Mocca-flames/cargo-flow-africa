#!/usr/bin/env python3
"""
Bulk PNG -> AVIF converter.

- Walks <root> recursively (default: ./public)
- Converts each .png to .avif in the SAME folder, SAME base name (a.png -> a.avif)
- Validates the AVIF, and only if it is smaller moves the original PNG to the archive
  (archive mirrors the folder structure; default: <root>/../png_archive, outside web root)
- Writes avif_manifest.json and AVIF_MIGRATION_PROMPT.md next to the archive

Requires: avifenc (libavif >= 1.0)
  Ubuntu/Debian: sudo apt install libavif-bin
  macOS:         brew install libavif
  Windows:       winget install libavif   (or grab avifenc.exe from the libavif releases)

Usage:
  python3 png2avif.py --dry-run
  python3 png2avif.py public
  python3 png2avif.py public -q 65 --qalpha 85
  python3 png2avif.py public --skip "favicon*" "og-*" "hero-keep*"
"""
import argparse
import fnmatch
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

# Files that must usually stay PNG (social previews, icons, PWA, etc.)
DEFAULT_SKIP = [
    "favicon*", "apple-touch-icon*", "android-chrome*", "mstile*", "safari-pinned*",
    "og-*", "og_*", "opengraph*", "twitter-card*", "icon-192*", "icon-512*",
]
IGNORED_DIRS = {"node_modules", ".git", ".dart_tool", ".next", "dist", "build"}


def human(n: float) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f}{unit}" if unit == "B" else f"{n:.1f}{unit}"
        n /= 1024


def encode(src: Path, dst_part: Path, q: int, qalpha: int, speed: int) -> bool:
    cmd = [
        "avifenc", "-q", str(q), "--qalpha", str(qalpha),
        "-s", str(speed), "-j", "all", str(src), str(dst_part),
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(f"    avifenc error: {r.stderr.strip()[:300]}")
        return False
    return dst_part.exists() and dst_part.stat().st_size > 0


def valid_avif(path: Path) -> bool:
    if not shutil.which("avifdec"):
        return path.stat().st_size > 0
    r = subprocess.run(["avifdec", "--info", str(path)], capture_output=True, text=True)
    return r.returncode == 0


def build_prompt(root: Path, web_base: Path, archive: Path, converted: list, skipped: list) -> str:
    conv_lines = "\n".join(
        f"- {c['web_old']} -> {c['web_new']}  ({human(c['old_size'])} -> {human(c['new_size'])})"
        for c in converted
    ) or "- (none)"
    skip_lines = "\n".join(f"- {s['web_old']}  [{s['reason']}]" for s in skipped) or "- (none)"
    return f"""TASK: Update this codebase after a bulk PNG -> AVIF image migration.

CONTEXT
- Images under `{root.as_posix()}` (web root `{web_base.as_posix()}` is served as `/`, so paths below are web paths like `/images/hero/a.png`) were converted from .png to .avif.
- Each converted file is in the SAME folder with the SAME base name; ONLY the extension changed (a.png -> a.avif).
- The original PNGs were moved to `{archive.as_posix()}` (outside the web root). Never reference, modify or re-add files from that folder.
- ONLY the files listed under CONVERTED changed. Every other image, including those under KEPT AS PNG, must keep its current reference.

RULES
1. Search the whole project (exclude node_modules, .git, build/dist/.next/.dart_tool output, lockfiles and the archive folder) for every reference to each converted file. Match all forms: full path, root-relative ("/images/x.png"), relative ("./x.png", "../images/x.png"), and bare filename.
2. Replace `.png` with `.avif` for converted files only. Preserve case, query strings and hash fragments. Do not touch unrelated code or formatting (minimal diff).
3. Check all file types: html, css/scss/sass/less, js/jsx/ts/tsx, vue/svelte/astro, md/mdx, json, yaml/yml, php, blade/twig/ejs/hbs, dart + pubspec.yaml asset entries, xml, service-worker precache lists, sitemaps, framework configs (next/vite/webpack/nuxt/astro), and any data files or seed content that stores image paths.
4. Dynamic references: look for template strings, concatenation (`${{name}}.png`, "img/" + id + ".png"), arrays/maps of filenames, and DB/CMS/JSON content. Fix when the pattern is clear; if uncertain, do NOT guess, list it in the report.
5. Keep as PNG (do not switch to AVIF), and tell me if any of these point to a converted file so I can copy the PNG back from the archive: og:image, twitter:image, schema.org/JSON-LD image, favicons, apple-touch-icon, PWA manifest icons, email templates, RSS/feeds, native app icons, and anything consumed by platforms or tools without AVIF support (WhatsApp/Facebook/LinkedIn previews, many email clients).
6. Update MIME/type hints: `type="image/png"` -> `type="image/avif"` on <source>, <link rel="preload" as="image"> and similar, for converted files only. Confirm the server/CDN serves .avif as `image/avif` (nginx mime.types, Apache AddType, Netlify/Vercel/Cloudflare headers).
7. Framework image optimizers (next/image, etc.): make sure config allows AVIF and static imports still resolve.
8. Browser support: AVIF is fine for all current browsers. If the project targets older ones (e.g. Safari < 16), do not add fallbacks silently, flag it in the report.
9. Verify when done:
   a. grep for any remaining reference to a converted `.png` path -> should be zero except intentional cases from rule 5.
   b. every `.avif` path referenced in the code exists on disk.
   c. run the project's build/lint/tests and report the result.

DELIVERABLE
- Files changed + number of replacements per file.
- Dynamic/uncertain references that need my decision.
- References intentionally left as PNG, and which archive files I need to copy back.
- References to files that do not exist on disk.

CONVERTED ({len(converted)}):
{conv_lines}

KEPT AS PNG / NOT CONVERTED ({len(skipped)}):
{skip_lines}
"""


def main() -> int:
    ap = argparse.ArgumentParser(description="Bulk PNG -> AVIF with archive + agent prompt")
    ap.add_argument("root", nargs="?", default="public", help="images root (default: public)")
    ap.add_argument("--archive", help="archive dir (default: <project>/png_archive, outside public/)")
    ap.add_argument("--web-root", help="dir served as '/' (default: nearest parent named 'public', else root)")
    ap.add_argument("-q", "--quality", type=int, default=70, help="colour quality 0-100 (default 70)")
    ap.add_argument("--qalpha", type=int, default=90, help="alpha quality 0-100 (default 90)")
    ap.add_argument("-s", "--speed", type=int, default=4, help="0 slowest/best .. 10 fastest (default 4)")
    ap.add_argument("--skip", nargs="*", default=DEFAULT_SKIP, help="filename globs to leave as PNG")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"root not found: {root}")
        return 1
    web_base = Path(args.web_root).resolve() if args.web_root else next(
        (p for p in [root, *root.parents] if p.name.lower() == "public"), root)
    archive = Path(args.archive).resolve() if args.archive else web_base.parent / "png_archive"
    out_dir = archive.parent

    if not args.dry_run and not shutil.which("avifenc"):
        print("avifenc not found. Install libavif (apt install libavif-bin | brew install libavif).")
        return 1

    pngs = []
    for dirpath, dirnames, filenames in os.walk(root):
        dp = Path(dirpath).resolve()
        dirnames[:] = [d for d in dirnames if d not in IGNORED_DIRS and (dp / d).resolve() != archive]
        for f in filenames:
            if f.lower().endswith(".png"):
                pngs.append(dp / f)
    pngs.sort()

    converted, skipped = [], []
    total_old = total_new = 0
    print(f"{len(pngs)} PNG files found under {root}\n")

    for i, src in enumerate(pngs, 1):
        rel = src.relative_to(root)
        web_old = "/" + src.relative_to(web_base).as_posix()
        dst = src.with_suffix(".avif")
        web_new = "/" + dst.relative_to(web_base).as_posix()
        tag = f"[{i}/{len(pngs)}] {rel}"

        if any(fnmatch.fnmatch(src.name.lower(), p.lower()) for p in args.skip):
            print(f"{tag}  SKIP (protected name)")
            skipped.append({"web_old": web_old, "reason": "protected name, keep PNG"})
            continue
        if dst.exists():
            print(f"{tag}  SKIP (.avif already exists)")
            skipped.append({"web_old": web_old, "reason": ".avif with same name already exists, untouched"})
            continue
        if args.dry_run:
            print(f"{tag}  would convert ({human(src.stat().st_size)})")
            continue

        part = dst.with_name(dst.name + ".part")
        old_size = src.stat().st_size
        ok = encode(src, part, args.quality, args.qalpha, args.speed)
        if not ok or not valid_avif(part):
            part.unlink(missing_ok=True)
            print(f"{tag}  FAILED, PNG left in place")
            skipped.append({"web_old": web_old, "reason": "conversion failed, keep PNG"})
            continue

        new_size = part.stat().st_size
        if new_size >= old_size:
            part.unlink(missing_ok=True)
            print(f"{tag}  SKIP (avif not smaller: {human(old_size)} -> {human(new_size)})")
            skipped.append({"web_old": web_old, "reason": "AVIF not smaller, keep PNG"})
            continue

        os.replace(part, dst)
        arch_path = archive / rel
        arch_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(arch_path))

        total_old += old_size
        total_new += new_size
        pct = 100 - new_size * 100 / old_size
        print(f"{tag}  {human(old_size)} -> {human(new_size)}  (-{pct:.0f}%)")
        converted.append({
            "web_old": web_old, "web_new": web_new,
            "old_size": old_size, "new_size": new_size,
            "archived_to": str(arch_path),
        })

    if args.dry_run:
        print("\ndry run, nothing changed")
        return 0

    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "avif_manifest.json").write_text(
        json.dumps({"converted": converted, "skipped": skipped}, indent=2), encoding="utf-8")
    prompt = build_prompt(root, web_base, archive, converted, skipped)
    prompt_path = out_dir / "AVIF_MIGRATION_PROMPT.md"
    prompt_path.write_text(prompt, encoding="utf-8")

    saved = total_old - total_new
    print("\n----")
    print(f"converted: {len(converted)}   skipped: {len(skipped)}")
    if total_old:
        print(f"{human(total_old)} -> {human(total_new)}  saved {human(saved)} (-{saved * 100 / total_old:.0f}%)")
    print(f"archive : {archive}")
    print(f"manifest: {out_dir / 'avif_manifest.json'}")
    print(f"prompt  : {prompt_path}  <- paste this to your agent")
    return 0


if __name__ == "__main__":
    sys.exit(main())