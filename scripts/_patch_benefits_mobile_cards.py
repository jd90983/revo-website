import re
from pathlib import Path

CARDS = [
    {
        "product": "always-on-availability",
        "title": "Always-on availability",
        "description": "Never miss a call—or a customer. Revo answers instantly, day or night, with a natural, human-like voice. While you work, drive, or sleep, your business stays fully responsive.",
        "image": "images/services/always_on_availability.webp",
        "alt": "Always-on availability",
    },
    {
        "product": "smart-call-management",
        "title": "Smart Call Management",
        "description": "Every call handled. Every detail captured. Revo filters spam, prioritizes real customers, and manages multiple calls at once. No double bookings, no missed opportunities—just organized, efficient communication.",
        "image": "images/services/smart_call_management.webp",
        "alt": "Smart Call Management",
    },
    {
        "product": "assign-jobs-specialist",
        "title": "Assign Jobs to the Specialist",
        "description": "The right job, to the right person—automatically. Revo routes requests based on your workflow, availability, and service type. Your team stays focused, and your clients get faster, better service.",
        "image": "images/services/assign_jobs_to_the_specialist.webp",
        "alt": "Assign Jobs to the Specialist",
    },
]

BUTTON_PATTERN = re.compile(
    r'(<button type="button" class="products-item(?: active)?" data-product="{product}"[^>]*>)(.*?)(</button>)',
    re.DOTALL,
)


def inner_html(card: dict) -> str:
    return f"""                    <div class="products-item-header">
                      <span class="products-item-indicator" aria-hidden="true"></span>
                      <h3 class="products-title">{card["title"]}</h3>
                    </div>
                    <div class="products-description">
                      <p>{card["description"]}</p>
                    </div>
                    <div class="products-actions">
                      <button type="button" class="benefits-modern-btn-secondary">Book a Demo</button>
                    </div>
                    <div class="products-item-media">
                      <img src="{card["image"]}" alt="{card["alt"]}" width="600" height="600" loading="lazy" />
                    </div>
"""


def patch_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    for card in CARDS:
        pattern = BUTTON_PATTERN.pattern.format(product=card["product"])
        regex = re.compile(pattern, re.DOTALL)
        match = regex.search(text)
        if not match:
            raise ValueError(f"Button not found for {card['product']} in {path}")
        replacement = match.group(1) + "\n" + inner_html(card) + "\n                  " + match.group(3)
        text = text[: match.start()] + replacement + text[match.end() :]
    path.write_text(text, encoding="utf-8")
    print(f"Patched {path}")


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    for name in ("ser.html", "industries.html"):
        patch_file(root / name)
