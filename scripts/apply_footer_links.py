import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
snippet = (root / "snippets" / "footer-links.html").read_text(encoding="utf-8").rstrip()
pattern = re.compile(
    r"        <!-- Links -->\r?\n        <div class=\"footer-links\">.*?</div>\r?\n      </div>\r?\n\r?\n      <!-- Bottom bar -->",
    re.S,
)
replacement = f"{snippet}\n      </div>\n\n      <!-- Bottom bar -->"

count = 0
for path in root.glob("*.html"):
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        content = path.read_text(encoding="cp1252")
    if 'class="footer-links"' not in content:
        continue
    updated = pattern.sub(replacement, content)
    if updated != content:
        path.write_text(updated, encoding="utf-8", newline="\n")
        count += 1

print(f"Updated {count} files")
