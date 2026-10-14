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

Historical QA: after an early remote screenshot showed hidden content despite loaded DOM/CSS, ads-prefixed classes were renamed to rd-prefixed classes. User then forbade Chrome personal and its use stopped. Subsequent final QA used isolated headless Chromium, as explicitly requested. Exact5498eca archive passed landing checks but showed calendar clipping at320. This was corrected in d09f52e and verified again at all four widths from its exact archive.

Final user positioning clarification applied: H1, subtitle, title/description, demo and footer explicitly target home service businesses. Broad small-business search intent is qualified to home-service crews and six trades; Revo is the answering provider, not the field-service company.

Final preview: https://revo-website-aepn8c2no-group-u.vercel.app/ai-receptionist-demo (deployment source commit5498eca, READY). Existing Vercel authentication protection retained. Local full build18tests pass; final remote build also passes18tests and output verification. Final authenticated HTTP verification is recorded in final-preview.json.

## Final isolated QA
Exact git archive d09f52e tested in Chromium headless with fresh nonpersistent contexts. Product HTML/CSS/JS SHA256 hashes match git show; report.json includes the hashes and sourceHashMatch=true. Widths320/390/768/1440 passed, fonts loaded, correct H1/copy/classes, all sections visible, CTA anchor, reservation section, calendar after explicit open,10min visible, five-UTM forwarding, native FAQ and zero page errors. At320 iframe now fills320px and all seven calendar columns are visible. No dates/times selected, no contact details entered, no booking submitted. POST requests were blocked; only existing Google analytics hosts attempted them. Browser contexts/process closed after QA. Screenshots and report are in final-qa/. Full project build and18tests pass.

## Personal Chrome audit
Personal Chrome was used earlier for the initial Fonio inspection, live Revo HOME/pricing and authorized calendar inspection, initial local QA, and the first remote preview check. This occurred after an advance commentary saying IAB was unavailable and Chrome would be used, but without an explicit approval to occupy personal Chrome. The notice did not replace authorization; proceeding was an error. Its use stopped immediately on receipt of the later “No tocar Chrome personal” instruction. All subsequent browser QA was isolated headless Chromium, with no personal profile. Exact absolute timestamps of the earlier UI calls were not recorded; the sequence above is the transcript-supported chronology.
