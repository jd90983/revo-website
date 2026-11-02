# QA of the combined PR

## Scope and environment

Chrome rendered the static build locally, using a read-only server bound to `127.0.0.1:8766`. The server maps clean paths to the built HTML and the recorded legacy aliases; it does not execute API/POST handlers. This is browser QA of the build, **not proof of authenticated Preview hosting behavior**.

The protected Preview for commit `923f498c09ff438d423dd685d005bce4b5e8167c` was READY at `revo-website-patgpdt2f-group-u.vercel.app` and Vercel matched the SHA. Chrome redirected to Vercel login; continuing with GitHub also required login. No credentials were entered, bypass tokens generated or protection settings changed. A Vercel login tab remains for the owner. Subsequent industry/CTA fixes in this PR require the new Preview to be checked after authentication is available.

## Browser findings

The five selected pages, the three new guides and all 19 corrected industries rendered in desktop (1440x900, plus initial Pricing at the existing larger viewport) and mobile (390x844). DOM/layout checks found one H1, the intended production canonical, no document-level horizontal overflow, and no broken visible image elements. Representative screenshots were visually reviewed; every route was checked in the rendered DOM at both sizes.

The first desktop review found the three new guides' approved primary CTA labels clipped by an inherited fixed width/nowrap rule. Scoped `data-reviewed-cta` wrapping fixed this. The same exact approved labels were then visibly complete in desktop and mobile, and their element scroll widths no longer exceeded their client widths. Source-copy tests still preserve the approved v0 words.

All five demo CTAs navigated to `/ai-receptionist-demo#book-demo`. After the destination finished its smooth anchor scroll, the booking section was visible below the fixed header. Its LeadConnector iframe remained unloaded; the calendar was not opened and no reservation was made. Keyboard navigation on Pricing visibly focused the CTA with a 2px orange outline. The CTA has dark text `rgb(10,11,12)` on white; this was a targeted CTA contrast check, not a full-site WCAG certification.

All 19 corrected industries had zero rendered testimonial quote elements and zero outcome counter elements. Tiling rendered with that spelling while retaining canonical `/industry_tilling`. The scoped form loaded, its fields remained empty, and the existing Get Started button moved focus to `firstName` after its animation. No form was submitted. The unsupported 12,000+ customer claim was absent from the scoped form.

One `loadTemplate is not defined` error was captured during rapid navigation away from an industry page. A stable revisit loaded the scoped form correctly and did not add another error; the focus test succeeded. This transient observation is retained rather than claiming an entirely error-free browser log.

AnswerMTI's four-column price table rendered with the approved amounts and a labeled, horizontally scrollable region on mobile; the document itself did not overflow. The three guides retained their approved Pricing and Hear a Sample destinations.

The browser-rendered sitemap contained 395 distinct URLs, zero `.html` entries and all three new guides. The local legacy alias for `industry_small_business.html` resolved to the clean path; production's 308 rule is unchanged and checked in configuration. Search Console/Bing were not resubmitted or asked to index.

## Measurement and limits

Unit/integration tests exercise consent denied/missing, GPC, blocked storage, exact path fields and click deduplication. They ensure the click script never writes a campaign or emits a lead/trial event. The browser verified the actual link flow; delivery/receipt in GA4 or GTM was not inspected, and a click is not a lead or confirmed booking. No real lead, reservation, trial or checkout was created.

Build validation, route checks, the 43-test suite, static release verification and publication/draft/withdrawal fixtures pass locally. Final remote CI/Preview results are recorded on the PR for its final SHA. Production release still requires owner approval of the exact PR; the pending automated snippet review cannot authorize production.
