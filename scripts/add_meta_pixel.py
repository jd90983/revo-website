import pathlib

root = pathlib.Path(__file__).resolve().parent.parent

pixel = """
  <!-- Meta Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '2435811520564771');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=2435811520564771&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Meta Pixel Code -->"""

marker = '  <meta name="viewport" content="width=device-width, initial-scale=1.0">'

updated = []
for path in sorted(root.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    if "Meta Pixel Code" in text:
        continue
    if marker not in text or "<head>" not in text:
        print("SKIP", path.name)
        continue
    path.write_text(text.replace(marker, marker + pixel, 1), encoding="utf-8")
    updated.append(path.name)

print(f"Updated {len(updated)} files")
