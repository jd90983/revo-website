# Combined SEO proposal — November 2, 2026

This branch is a review proposal. A separate approval of the exact PR/commit is required before merge or production publication. No sitemap submission, indexing request, lead submission, checkout, price or funnel configuration change is part of this proposal.

## Review provenance

`approved-copy-v0.txt` is the exact owner-approved version 0 of the three new articles, SHA-256 `951e1127e8c0fa0c4b3d8900c7e104bf0d018032e306207d2f850ee68937962d`. Its original draft header is retained as historical source text. Content approval was received November 2, 2026 at 19:34:22 UTC; release approval is separate. The new records preserve the titles, descriptions, article text and primary/secondary CTA wording; Markdown adds presentation only. AnswerMTI's exact 161-character description has a literal exception to the usual 160-character internal limit.

The three existing guide snippets were prepared under the owner's authorization to prepare the combined PR. Their review records explicitly name **Codex automated implementation review**, with owner approval of the exact PR still pending. These are not represented as a new human editorial review. These records carry `review.releaseApproval: "pending"`; a production build is blocked until the owner approves the exact PR and a human review record replaces the pending technical proposal. Local/Preview builds are permitted for review. All editorial hashes are recalculated; stale review hashes are rejected by the existing validator.

## Industry decisions

The sitemap adds 13 existing, canonical, indexable destinations after removing unsupported numerical outcomes, unverifiable named testimonials and autonomous learning/estimation claims from those destinations. Their intake examples describe information to collect, rather than asserting measured results or automatic job acceptance. The shared existing lead form remains functionally unchanged; a scoped copy replaces its unsupported customer-count/growth promotional copy. Other pages keep their existing form template.

Added suffixes under `/industry_`: alarm_security, carpet_cleaning, chimney_sweep, computer_repair, junk_removal, lawn_care, maid_cleaning, pool_services, pressure_washing, property_maintenance, solar_installation, window_cleaning, tilling.

`/industry_tilling` is retained as the canonical URL; visible wording is corrected to **Tiling**, matching the tile-installation content. No new URL or redirect is invented.

Six omissions remain intentional pending separate editorial/product review: building_construction_trades, construction and general_contracting need differentiated intent; franchises, marketing_media_advertising and real_estate_property_management need scope review. No content on those six pages is changed. The five existing noindex conversion/utility pages remain excluded.

The resulting built sitemap contains 389 URLs: 373 existing + 13 reviewed industries + 3 approved guides. Acceptance by a search engine is not evidence of indexation.

## Conversion measurement

Only the five requested hero CTAs link to `/ai-receptionist-demo#book-demo`. The three new guides retain their approved pricing/sample CTAs. `seo_cta_click` records only controlled `page_path`, `cta_location`, `destination` and sanitized GA page context after stored analytics consent, unless GPC is enabled. It never appends internal UTMs, stores a new campaign or emits a lead/booking/trial event. Consent not granted or unavailable means no click event. Static pages do not gain a new consent-management interface in this PR; reporting therefore covers consent already recorded by the site's existing choices and an available analytics sink.

Booking confirmation/CRM attribution is outside this change: opening the calendar does not prove a booked appointment. Trial discount duration remains unresolved; this proposal neither changes its terms nor repeats a duration promise in metadata.
