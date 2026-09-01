import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
extensions = {".html", ".py", ".js", ".json", ".md"}

updated_files = []
for path in root.rglob("*"):
    if path.suffix not in extensions:
        continue
    if path.name == "rename_ind_to_industries.py":
        continue
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    if "ind.html" not in text:
        continue
    new_text = text.replace("ind.html", "industries.html")
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        updated_files.append(str(path.relative_to(root)))

print(f"Updated {len(updated_files)} files")
