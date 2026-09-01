"""Fix malformed megamenu footer buttons that break navbar DOM."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BROKEN = (
    '<a class="megamenu-footer-button" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" '
    'target="_blank" rel="noopener noreferrer">See More Industries</button>'
)
FIXED = (
    '<button class="megamenu-footer-button" type="button" '
    "onclick=\"window.location.href='industries.html'\">See More Industries</button>"
)


def main() -> None:
    updated = []
    for path in ROOT.glob("*.html"):
        text = path.read_text(encoding="utf-8")
        if BROKEN not in text:
            continue
        path.write_text(text.replace(BROKEN, FIXED), encoding="utf-8")
        updated.append(path.name)
    print(f"Fixed {len(updated)} files")
    for name in sorted(updated):
        print(f"  {name}")


if __name__ == "__main__":
    main()
