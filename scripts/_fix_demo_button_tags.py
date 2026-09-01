"""Fix malformed button/link tags from book-demo migration."""
import re
from pathlib import Path

APP_STORE = "https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591"
LINK_ATTRS = f'href="{APP_STORE}" target="_blank" rel="noopener noreferrer"'
ROOT = Path(__file__).resolve().parent.parent
EXTENSIONS = {".html", ".py"}


def fix_content(content: str) -> str:
    # Restore Get Started buttons wrongly converted to anchors.
    content = re.sub(
        rf'<a class="(btn-primary-large|benefits-modern-btn-primary|ind-btn-primary)" {LINK_ATTRS}>Get Started</button>',
        r'<button class="\1" type="button">Get Started</button>',
        content,
    )

    # Simple broken secondary/outline buttons.
    for cls in (
        "btn-secondary-large",
        "benefits-modern-btn-secondary",
        "btn-outline-white",
        "transform-cta-btn-secondary",
    ):
        content = content.replace(
            f'<button class="{cls}" type="button">Download for iPhone</a>',
            f'<a class="{cls}" {LINK_ATTRS}>Download for iPhone</a>',
        )
        content = content.replace(
            f'<button class="{cls}">Download for iPhone</a>',
            f'<a class="{cls}" {LINK_ATTRS}>Download for iPhone</a>',
        )
        content = content.replace(
            f'<button type="button" class="{cls}">Download for iPhone</a>',
            f'<a class="{cls}" {LINK_ATTRS}>Download for iPhone</a>',
        )

    # Multiline industry secondary button.
    content = re.sub(
        r'<button class="ind-btn-secondary" type="button">\s*Download for iPhone\s*</a>',
        f'<a class="ind-btn-secondary" {LINK_ATTRS}>Download for iPhone</a>',
        content,
        flags=re.IGNORECASE,
    )

    # Link-style buttons with SVG arrow.
    content = re.sub(
        r'<button type="button" class="benefits-modern-btn-secondary benefits-modern-btn-link">\s*'
        r'Download for iPhone\s*'
        r'(<svg[\s\S]*?</svg>\s*)</a>',
        rf'<a class="benefits-modern-btn-secondary benefits-modern-btn-link" {LINK_ATTRS}>\n                  Download for iPhone\n                  \1</a>',
        content,
        flags=re.IGNORECASE,
    )

    # Tab panel mobile buttons that stayed as buttons but need links.
    content = content.replace(
        f'<a class="benefits-modern-btn-secondary" href="https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591" target="_blank" rel="noopener noreferrer">Download for iPhone</a>',
        f'<a class="benefits-modern-btn-secondary" {LINK_ATTRS}>Download for iPhone</a>',
    )

    return content


def main() -> None:
    updated = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in EXTENSIONS:
            continue
        if ".git" in path.parts:
            continue
        original = path.read_text(encoding="utf-8")
        new_content = fix_content(original)
        if new_content != original:
            path.write_text(new_content, encoding="utf-8")
            updated.append(str(path.relative_to(ROOT)))
    print(f"Fixed {len(updated)} files")
    for name in sorted(updated):
        print(f"  {name}")


if __name__ == "__main__":
    main()
