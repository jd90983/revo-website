#!/usr/bin/env python3
"""Builds home-draft.html (Home v3 draft from Figma) from scripts/home-v3/body.html.

The <head> tracking blocks (opt-out guard, GTM, Meta pixel, TikTok definition) and the interactive
app demo are copied from index.html so the draft keeps exactly what the live home page has.
Run: python3 scripts/home-v3/build.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
index = (ROOT / 'index.html').read_text()
body = (ROOT / 'scripts/home-v3/body.html').read_text()
A = '/images/home-v3/'
APP_STORE = 'https://apps.apple.com/us/app/revo-ai-receptionist/id6768915591'


def between(text, start, end, include_end=True):
    i = text.index(start)
    j = text.index(end, i) + (len(end) if include_end else 0)
    return text[i:j]


head_top = between(index, '<!-- Privacy opt-out / GPC', '<!-- End Google Tag Manager -->')
meta_pixel = between(index, '<!-- Meta Pixel Code -->', '<!-- End Meta Pixel Code -->')
tiktok = between(index, '<!-- TikTok Pixel', '<!-- End TikTok Pixel -->')
gtm_noscript = between(index, '<noscript><iframe src="https://www.googletagmanager.com/ns.html', '</noscript>')

# Interactive app demo (phone + app UI) from the live home page, without its "Try the demo" callout
demo = between(index, '<div class="rv-phone-stage">', '<div class="rv-demo__after">', include_end=False)
demo = demo.rstrip()
assert demo.endswith('</div>')
demo = demo[: demo.rfind('</div>')].rstrip()  # drop the closing tag of .rv-phone-wrap
demo_phone = ('<div class="rv-phone-wrap hv3-explore__phone">' + demo +
              f'\n<img class="hv3-demo-frame" src="{A}phone-frame.webp" alt="" aria-hidden="true">\n</div>')


def phone(w, screen, label):
    aria = f' role="img" aria-label="{label}"' if label else ' aria-hidden="true"'
    return (f'<div class="hv3-phone" style="--w:{w}"{aria}><div class="hv3-phone__screen">'
            f'<div class="hv3-phone__bar"><span class="hv3-phone__time">9:41</span><img class="hv3-phone__icons" src="{A}ios-status.svg" alt=""></div>'
            f'<div class="hv3-phone__app"><img src="{A}{screen}" alt="" loading="lazy"></div></div>'
            f'<img class="hv3-phone__frame" src="{A}phone-frame.webp" alt="" loading="lazy"></div>')


badges = ('<div class="hv3-badges">'
          f'<a class="hv3-badge hv3-badge--apple" href="{APP_STORE}" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">'
          f'<img class="b1" src="{A}appstore-bg.svg" alt=""><img class="b2" src="{A}appstore-border.svg" alt="">'
          f'<img class="b3" src="{A}appstore-apple.svg" alt=""><img class="b4" src="{A}appstore-text.svg" alt=""><img class="b5" src="{A}appstore-top.svg" alt=""></a>'
          f'<span class="hv3-badge hv3-badge--google" role="img" aria-label="Google Play: Android app coming soon" title="Android app coming soon"><img src="{A}google-play.png" alt=""></span>'
          '</div>')

wave_on = [3, 11, 15, 15, 11, 6, 3, 3, 7, 13, 17]
wave_off = [17, 14, 6, 9, 17, 20, 20, 16, 10, 3, 5, 5, 3, 8, 10]
wave = ''.join(f'<i style="height:{h}px"></i>' for h in wave_on) + ''.join(f'<i class="off" style="height:{h}px"></i>' for h in wave_off)

TRADES = [
    # key, name, banner/photo, quote, steps  (copy from the Figma "Trade Showcase" variants)
    ('flame', 'HVAC', 'hear-banner-hvac.webp', 'trade-hvac.webp', '“It’s 30 degrees out and our furnace just quit.”',
     ['Flags a no-heat emergency', 'Collects the address', 'Books the first open slot']),
    ('droplet', 'Plumbing', 'trade-plumbing.webp', 'trade-plumbing.webp', '“There’s water coming through the kitchen ceiling.”',
     ['Treats it as an active leak', 'Gets the address', 'Sends it to your on-call plumber']),
    ('key', 'Locksmith', 'trade-locksmith.webp', 'trade-locksmith.webp', '“I’m locked out of my house and it’s 11 PM.”',
     ['Confirms the address', 'Quotes your after-hours rate', 'Dispatches the closest tech']),
    ('roof', 'Roofing', 'trade-roofing.webp', 'trade-roofing.webp', '“A storm took some shingles off. Can someone look?”',
     ['Collects the address', 'Collects the damage details', 'Books an inspection']),
    ('leaf', 'Landscaping', 'trade-landscaping.webp', 'trade-landscaping.webp', '“Can I get a quote for weekly mowing and spring cleanup?”',
     ['Qualifies the lead: lot size, services and timing', 'Books an on-site estimate']),
    ('wind', 'Air Duct Cleaning', 'trade-air-duct-cleaning.webp', 'trade-air-duct-cleaning.webp', '“How much to clean the ducts in a 3-bedroom house?”',
     ['Shares your price range', 'Asks about vents and pets', 'Books the visit']),
]


def esc(s):
    return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')


hear_trades = ''.join(
    f'<button class="hv3-trade-btn" type="button" aria-pressed="{"true" if i == 0 else "false"}" data-name="{n}" data-banner="{A}{banner}">'
    f'<span class="hv3-trade-btn__icon"><img class="off" src="{A}strip-icon-{k}.svg" alt=""><img class="on" src="{A}strip-icon-{k}.svg" alt=""></span>{n}</button>'
    for i, (k, n, banner, _p, _q, _s) in enumerate(TRADES))

pick_trades = ''.join(
    f'<button class="hv3-pick__btn" type="button" aria-pressed="{"true" if i == 0 else "false"}" data-photo="{A}{p}" data-quote="{esc(q)}" data-steps="{esc(json.dumps(s, ensure_ascii=False))}">'
    f'<span class="ic"><img class="off" src="{A}strip-icon-{k}.svg" alt=""><img class="on" src="{A}strip-icon-{k}.svg" alt=""></span>'
    f'<span class="l">{n}</span><span class="go"><img src="{A}trades-icon-arrow.svg" alt=""></span></button>'
    for i, (k, n, _b, p, q, s) in enumerate(TRADES))
# Selected state: the same trade icon in white (CSS filter), as in the Figma selected variant.


def card(m):
    title, mask, screen, w, dx, top, rot, tip = m.group(1).split(':', 7)
    w = int(w)
    style = f'--w:{w}px;--rot:{rot}deg;left:calc(50% + {dx}px - {w / 2}px);top:{top}px;transform:rotate({rot}deg)'
    ph = phone(f'{w}px', screen, '').replace('class="hv3-phone" style="--w:%dpx"' % w, f'class="hv3-phone" style="{style}"')
    return (f'<article class="hv3-card"><div class="hv3-card__crop" style="--mask:url(\'{A}{mask}\')">{ph}</div>'
            f'<button class="hv3-info" type="button" aria-expanded="false" aria-label="About {title}">i<span class="hv3-tip" role="tooltip">{tip}</span></button>'
            f'<div class="hv3-card__title"><h3>{title}</h3><span class="hv3-go" aria-hidden="true"><img src="{A}showcase-icon-arrow.svg" alt=""></span></div></article>')


review = ('<div class="hv3-review"><div class="hv3-review__top"><span class="hv3-review__avatar"></span><span class="hv3-review__logo"></span></div>'
          '<div class="hv3-review__stars">☆☆☆☆☆</div><div class="hv3-review__q">“</div>'
          '<div class="hv3-review__line"></div><div class="hv3-review__line"></div><div class="hv3-review__line"></div><div class="hv3-review__line short"></div>'
          '<div class="hv3-review__name"><div><i></i><i></i></div></div></div>')

out = body
out = re.sub(r'\{\{PHONE:([^:]+):([^:]+):([^}]*)\}\}', lambda m: phone(m.group(1), m.group(2), m.group(3)), out)
out = re.sub(r'\{\{CARD:([^}]+)\}\}', card, out)
out = (out.replace('{{WAVE}}', wave).replace('{{BADGES}}', badges).replace('{{HEAR_TRADES}}', hear_trades)
       .replace('{{PICK_TRADES}}', pick_trades).replace('{{REVIEWS}}', review * 3).replace('{{DEMO_PHONE}}', demo_phone))
assert '{{' not in out, re.findall(r'\{\{[^}]*\}\}', out)[:3]

html = f'''<!DOCTYPE html>
<html lang="en" data-revo-chat-theme="v3">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
{head_top}

  <title>Revo Home v3 (draft)</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="Draft of the new Revo home page for internal review.">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend+Deca:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/interactive-demo.css">
  <link rel="stylesheet" href="/css/home-v3.css">

{meta_pixel}

{tiktok}
</head>
<body class="hv3">
<!-- Google Tag Manager (noscript) -->
{gtm_noscript}
<!-- End Google Tag Manager (noscript) -->
{out}
<script src="/js/hear-sample-config.js" defer></script>
<script src="/js/interactive-demo.js" defer></script>
<script src="/js/home-v3.js" defer></script>
<!-- AGENT-26 Revo web chat (opt-in widget) -->
<script src="/js/revo-chat.js" defer></script>
</body>
</html>
'''
(ROOT / 'home-draft.html').write_text(html)
print('wrote home-draft.html', len(html))
