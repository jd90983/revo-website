from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OLD = (
    '        <a class="btn-secondary" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" '
    'target="_blank" rel="noopener noreferrer">Download for iPhone</a>\n'
    '        <button class="btn-primary" type="button">Get Started</button>'
)
NEW = (
    '        <button class="btn-primary" type="button">Get Started</button>\n'
    '        <a class="btn-secondary" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" '
    'target="_blank" rel="noopener noreferrer">Download for iPhone</a>'
)

updated = []
for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    if OLD not in text:
        continue
    path.write_text(text.replace(OLD, NEW), encoding="utf-8")
    updated.append(path.name)

print(f"Updated {len(updated)} files")
