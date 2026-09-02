"""Add App Store click listener to Meta Pixel blocks in root HTML pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LISTENER = """document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href*="apps.apple.com"]');
  if (a && window.fbq) fbq('trackCustom', 'AppStoreClick');
}, true);
"""
MARKER = "fbq('track', 'PageView');\n"
HERO_ONCLICK = ' onclick="if(window.fbq)fbq(\'trackCustom\',\'AppStoreClick\');"'


def main() -> None:
    updated = []
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if MARKER not in text or LISTENER in text:
            continue
        new = text.replace(MARKER, MARKER + LISTENER, 1)
        if path.name == "index.html":
            new = new.replace(HERO_ONCLICK, "")
        if new != text:
            path.write_text(new, encoding="utf-8")
            updated.append(path.name)
    print(f"Added listener in {len(updated)} files")
    for name in updated:
        print(f"  {name}")


if __name__ == "__main__":
    main()
