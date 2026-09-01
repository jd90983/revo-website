import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
app_store = "https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591"

replacements = [
    (
        "© 2024 Revo. All communication rights reserved",
        "© 2026 Revo. All communication rights reserved",
    ),
    (
        '<button class="btn-secondary" type="button">Login</button>',
        f'<a class="btn-secondary" href="{app_store}" target="_blank" rel="noopener noreferrer">Download for iPhone</a>',
    ),
    (
        '<button class="btn-login" type="button">Login</button>',
        f'<a class="btn-login" href="{app_store}" target="_blank" rel="noopener noreferrer">Download for iPhone</a>',
    ),
]

faq_block = """
            <!-- Contact Button -->
            <div class="faq-actions">
              <button class="btn-contact">Contact</button>
            </div>
"""

updated = 0
for path in sorted(root.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if path.name == "index.html" and faq_block in text:
        text = text.replace(faq_block, "\n")
    if text != original:
        path.write_text(text, encoding="utf-8")
        updated += 1

print(f"Updated {updated} files")
