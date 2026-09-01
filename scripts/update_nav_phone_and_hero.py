import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
app_store = "https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591"

phone_pattern = re.compile(
    r'\n\s*<a href="tel:\+18445231919" class="btn-phone" aria-label="Call \(844\) 523-1919">\s*'
    r'<svg class="phone-icon"[^>]*>.*?</svg>\s*'
    r'<span class="phone-text">\(844\) 523-1919</span>\s*'
    r'</a>',
    re.DOTALL,
)

hero_old = (
    '<a class="btn-secondary-large" href="tel:+18445231919" '
    'aria-label="Call (844) 523-1919 to Download for iPhone">Download for iPhone</a>'
)
hero_new = (
    f'<a class="btn-secondary-large" href="{app_store}" target="_blank" '
    f'rel="noopener noreferrer">Download for iPhone</a>'
)

updated = []
for path in sorted(root.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    original = text
    text = phone_pattern.sub("", text)
    if path.name == "index.html":
        text = text.replace(hero_old, hero_new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        updated.append(path.name)

print(f"Updated {len(updated)} files")
