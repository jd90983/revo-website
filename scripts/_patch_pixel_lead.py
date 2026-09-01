"""Remove submit Lead listener from pixel blocks; add Lead track on thank-you."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LISTENER = """document.addEventListener('submit', function (e) {
  if (e.target.closest && e.target.closest('.get-started-form-form')) {
    if (window.fbq) fbq('track', 'Lead');
  }
}, true);
"""
LEAD_SCRIPT = "<script>fbq('track', 'Lead');</script>"


def main() -> None:
    updated = []
    for path in ROOT.glob("*.html"):
        text = path.read_text(encoding="utf-8")
        if LISTENER not in text:
            continue
        new = text.replace(LISTENER, "")
        if path.name == "thank-you.html":
            marker = "<!-- End Meta Pixel Code -->"
            if LEAD_SCRIPT not in new:
                new = new.replace(marker, f"{marker}\n\n{LEAD_SCRIPT}", 1)
        path.write_text(new, encoding="utf-8")
        updated.append(path.name)
    print(f"Removed listener from {len(updated)} files")
    for name in sorted(updated):
        print(f"  {name}")


if __name__ == "__main__":
    main()
