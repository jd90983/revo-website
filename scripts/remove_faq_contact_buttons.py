import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent

patterns = [
    re.compile(r"\n\s*<button class=\"ind-faq-contact-btn\" type=\"button\">Contact</button>"),
    re.compile(
        r"\n\s*<!-- Contact Button -->\s*\n\s*<div class=\"ser-faq-actions\">\s*\n\s*<button class=\"btn-contact\">Contact</button>\s*\n\s*</div>"
    ),
    re.compile(
        r"\n\s*<div class=\"ser-faq-actions\">\s*\n\s*<button class=\"btn-contact\">Contact</button>\s*\n\s*</div>"
    ),
    re.compile(r"\n\s*<button class=\"home-service-btn-contact\" type=\"button\">Contact</button>"),
]

updated = []
for path in sorted(root.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    original = text
    for pattern in patterns:
        text = pattern.sub("", text)
    if text != original:
        path.write_text(text, encoding="utf-8")
        updated.append(path.name)

print(f"Updated {len(updated)} files:")
for name in updated:
    print(f"  {name}")
