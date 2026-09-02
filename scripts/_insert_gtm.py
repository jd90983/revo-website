"""Insert Google Tag Manager into root HTML pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GTM_ID = "GTM-PFJBFLVF"

GTM_HEAD = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PFJBFLVF');</script>
<!-- End Google Tag Manager -->
"""

GTM_BODY = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PFJBFLVF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
"""

NOINDEX = '<meta name="robots" content="noindex">'

VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1.0">'


def insert_gtm(text: str, filename: str) -> str:
    if GTM_ID in text:
        return text

    if VIEWPORT not in text:
        raise ValueError(f"{filename}: viewport meta tag not found")

    head_insert = f"{VIEWPORT}\n{GTM_HEAD}"
    if filename == "thank-you.html":
        head_insert += f"\n{NOINDEX}"
    text = text.replace(VIEWPORT, head_insert, 1)

    body_match = re.search(r"<body[^>]*>", text)
    if not body_match:
        raise ValueError(f"{filename}: <body> tag not found")

    body_tag = body_match.group(0)
    text = text.replace(body_tag, f"{body_tag}\n{GTM_BODY}", 1)
    return text


def main() -> None:
    inserted = []
    skipped = []
    errors = []

    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if GTM_ID in text:
            skipped.append(path.name)
            continue
        try:
            new_text = insert_gtm(text, path.name)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            inserted.append(path.name)

    print(f"Inserted: {len(inserted)}")
    print(f"Skipped (already had GTM): {len(skipped)}")
    if errors:
        print("Errors:")
        for err in errors:
            print(f"  {err}")
    for name in inserted:
        print(f"  {name}")


if __name__ == "__main__":
    main()
