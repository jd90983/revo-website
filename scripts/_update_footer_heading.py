from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OLD = "Stay ahead with Revo's latest AI communication insights"
NEW = "Never miss a call. Revo keeps your business connected 24/7."

updated = 0
for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    if OLD not in text:
        continue
    path.write_text(text.replace(OLD, NEW), encoding="utf-8")
    updated += 1
print(updated)
