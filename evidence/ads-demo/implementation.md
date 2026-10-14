# Revo paid traffic landing

Base: main 9ccbb5a (PR55). Isolated checkout and branch feat/ads-ai-receptionist. No changes to existing public pages, SEO registry, forms/API or pSEO guards.

## Inspected live references (2026-10-14)
- https://www.fonio.cc/en-us#book-demo: hero / six benefit cards / three plan cards / testimonials / dark live-call conversion block / FAQ. Actual book-demo requests first and last name, business email, phone, company and daily call volume; CTA Try the AI call now. It is not a scheduling calendar. Adopted sequence, repeated primary CTA, restrained navigation, dark final conversion block and FAQ; copied no text, claims, testimonials or branding.
- https://www.revoapp.ai/: actual Get Started moves to the shared contact form, with name, phone, email, industry and weekly call volume. No submission made.
- https://www.revoapp.ai/pricing.html: own script/hours/rules, call dashboard summaries, booking; Crew/Fleet team transfers. Landing avoids numerical prices and uncertain performance claims. It links to current pricing.
- User-authorized https://api.leadconnectorhq.com/widget/bookings/revo-free-calls-10-minutes: visible title Revo Free Calls — Get Started with Jorge, duration 10 min, Select Date & Time and timezone picker. This authorized booking destination supersedes initial contact recommendation.
- Official iframe support: https://help.gohighlevel.com/support/solutions/articles/48000982201-embedding-highlevel-calendars-using-html-code

## Conversion and privacy
Book a demo anchors to #book-demo. Visitor chooses Open booking calendar; only then is the iframe loaded. Native link fallback works without JavaScript. No reservation, date selection or contact submission made. Standard five UTMs (up to 200 characters) pass to iframe/fallback; arbitrary parameters and identifiers do not. URL forwarding tested, provider-side booking attribution has not been verified. No new tracking service or pixel. Existing HOME head instrumentation and consent-gated TikTok definition retained, GTM noscript retained. Existing cookie-settings anchor retained.

## SEO
One static marketing landing outside the guarded editorial pSEO namespace at /ai-receptionist-demo, with non-SEO rewrite to its HTML. Root marketing pages are already supported by build-site. noindex, follow intentionally keeps paid acquisition copy out of organic index, and sitemap is untouched. Canonical points to the eventual clean production URL; no production deploy or merge. Preview host must also return its platform noindex header.

## QA
Existing build validates registry and route generation, compiles static site, runs 18 tests and verifies all public output hashes/internal links. Responsive browser checks at 320,390,768,1440: no horizontal overflow; all section opacity 1; all text and headings have explicit contrasting colors; H1 Inter, body Lexend Deca. Header and repeated CTA lead to #book-demo; iframe shows actual authorized calendar; native audio control uses existing /audio/sample-home-services.mp3. No fake testimonials or metrics. Real browser FontFaceSet status loaded; document.fonts.check returned true for 700 42px Inter and 400 16px Lexend Deca. H1 contrast white 19.70:1 and orange 8.15:1. FAQ opens natively; one H1, English document language and noindex metadata verified.

Final QA limitation: after remote screenshot showed content being hidden despite loaded DOM/CSS, all ads-prefixed classes were renamed to rd-prefixed classes to avoid cosmetic ad-block filters. Local responsive QA applies to the identical styled composition before class renaming. User then forbade Chrome personal; no further personal-browser actions occurred. Final remote visual review remains pending, HTTP checks and project tests are completed.
