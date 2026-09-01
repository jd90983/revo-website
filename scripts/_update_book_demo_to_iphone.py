"""Convert Download for iPhone buttons to Download for iPhone App Store links."""
import re
from pathlib import Path

APP_STORE = "https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591"
LINK_ATTRS = f'href="{APP_STORE}" target="_blank" rel="noopener noreferrer"'
ROOT = Path(__file__).resolve().parent.parent
EXTENSIONS = {".html", ".css", ".py"}


def convert_demo_buttons(content: str) -> str:
    def replace_button(match: re.Match) -> str:
        attrs = match.group(1)
        inner = match.group(2)
        class_match = re.search(r'class="([^"]*)"', attrs)
        if not class_match:
            return match.group(0)
        classes = class_match.group(1)
        inner_new = re.sub(r"Download for iPhone", "Download for iPhone", inner, flags=re.IGNORECASE)
        return f'<a class="{classes}" {LINK_ATTRS}>{inner_new}</a>'

    pattern = re.compile(
        r"<button([^>]*)>([\s\S]*?Download for iPhone[\s\S]*?)</button>",
        re.IGNORECASE,
    )
    return pattern.sub(replace_button, content)


def update_content(content: str) -> str:
    content = convert_demo_buttons(content)
    content = re.sub(
        r'(<a[^>]*href=")#("[^>]*>[\s\S]*?)Download for iPhone',
        rf'\1{APP_STORE}\2Download for iPhone',
        content,
        flags=re.IGNORECASE,
    )
    content = re.sub(r"Download for iPhone", "Download for iPhone", content, flags=re.IGNORECASE)
    content = re.sub(r"Download for iPhone", "Download for iPhone", content, flags=re.IGNORECASE)
    return content


def main() -> None:
    updated = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in EXTENSIONS:
            continue
        if ".git" in path.parts:
            continue
        original = path.read_text(encoding="utf-8")
        new_content = update_content(original)
        if new_content != original:
            path.write_text(new_content, encoding="utf-8")
            updated.append(str(path.relative_to(ROOT)))
    print(f"Updated {len(updated)} files")
    for name in sorted(updated):
        print(f"  {name}")


if __name__ == "__main__":
    main()
