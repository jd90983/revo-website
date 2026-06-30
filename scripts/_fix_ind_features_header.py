from pathlib import Path

p = Path(__file__).resolve().parents[1] / "ind.html"
t = p.read_text(encoding="utf-8")
needle = (
    "              </div>\n"
    "            </div>\n"
    "          </motion>\n"
    "          <div class=\"products_wr products_wr--tabs\">\n"
    "            <div class=\"products-content products-content--tabs\">\n"
    "              <div class=\"products-left\">\n"
    "                <div class=\"products-tabs\" role=\"tablist\" aria-label=\"Features\">"
)
replacement = (
    "            </div>\n"
    "          </div>\n"
    "          <div class=\"products_wr products_wr--tabs\">\n"
    "            <div class=\"products-content products-content--tabs\">\n"
    "              <div class=\"products-left\">\n"
    "                <div class=\"products-tabs\" role=\"tablist\" aria-label=\"Features\">"
)
needle = needle.replace("</motion>", "</div>")
idx = t.find('<p class="ser-tagline">Features</p>')
sub = t[idx:]
pos = sub.find(needle)
if pos == -1:
    raise SystemExit("needle not found")
t = t[: idx + pos] + replacement + t[idx + pos + len(needle) :]
p.write_text(t, encoding="utf-8")
print("ok")
