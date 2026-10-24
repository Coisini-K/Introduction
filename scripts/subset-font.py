"""Regenerate the self-hosted site font: pip install 'fonttools[woff]'"""

from pathlib import Path
from urllib.request import urlretrieve

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssc/"
CACHE = ROOT / "tmp" / "fonts"
OUTPUT = ROOT / "src" / "assets" / "fonts"
LICENSE = ROOT / "public" / "fonts" / "OFL-NotoSansSC.txt"

CACHE.mkdir(parents=True, exist_ok=True)
OUTPUT.mkdir(parents=True, exist_ok=True)
LICENSE.parent.mkdir(parents=True, exist_ok=True)
source = CACHE / "NotoSansSC-variable.ttf"
if not source.exists():
    urlretrieve(SOURCE_URL + "NotoSansSC%5Bwght%5D.ttf", source)
if not LICENSE.exists():
    urlretrieve(SOURCE_URL + "OFL.txt", LICENSE)

characters = set(range(0x20, 0x100)) | set(range(0x2000, 0x2070))
for path in [ROOT / "index.html", *sorted((ROOT / "src").rglob("*"))]:
    if path.suffix in {".html", ".vue", ".js", ".css"}:
        characters.update(map(ord, path.read_text(encoding="utf-8")))

font = TTFont(source, recalcTimestamp=False)
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=characters)
subsetter.subset(font)
font.flavor = "woff2"
target = OUTPUT / "noto-sans-sc-resume.woff2"
font.save(target)
print(f"Saved {target.name}: {target.stat().st_size:,} bytes")
