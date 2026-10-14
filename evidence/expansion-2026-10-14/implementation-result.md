# Implementation cut — 14 genuinely new pages

The measured twenty-query shortlist was critically reviewed rather than turned into twenty overlapping URLs. Fourteen scoped pages are now final-content drafts in `seo/shared/data/landing-pages.json`; the twenty earlier unsupported prompt-led drafts are withdrawn. The existing ten approved pages and their publication reviews were preserved. Plumbing and after-hours were not counted. Six additional distinct topics remain necessary to reach twenty.

## Visual review

Interactive local preview: http://127.0.0.1:8765/ai-answering-service/ai-call-summary

Side-by-side desktop/mobile comparison: http://127.0.0.1:8765/visual-review/comparison.html

Persistent comparison artifact: `../representative-qa/comparison.html`; desktop comparison image: `../representative-qa/comparison-desktop.png`. These are actual local-render screenshots, not a mockup. The current approved after-hours page is the reference. Preview routes are in a disposable copy with explicit LOCAL PREVIEW ONLY status; those approvals were not copied into the repository. The loopback preview is GET-only with noindex/nofollow and outbound QA requests blocked.

## Editorial decisions

`editorial-decisions.csv/json/md` contains exact keywords, observed volume/KD, intent, related tracked prompt, page kind, proposed clean URL and retained/merged/deferred reason. `implementation-matrix.json` adds the closest existing owner and draft implementation state. T-Mobile and Verizon retain distinct provider-specific methods; AT&T, iPhone, deactivation and porting are grouped as context in the general forwarding guide. PAYG is not a separate page because billing models already belong to the existing cost guide. Call screening is deferred because its observed mixed consumer intent and existing qualification ownership do not yet justify another business page.

The text-back page compares an alternative workflow and explicitly does not attribute an automatic missed-call SMS trigger to Revo. Transfer pages do not infer a warm-transfer modality from the published transfer feature. Recording and transcription pages refer to higher-tier pricing and do not invent retention/security guarantees. No fictional customers, prices, results or testimonials were added.

## Semrush registration blocker

The user explicitly authorized adding twenty discovered keywords and natural missing prompts. No Chrome/CUA control tool is available in this execution environment now; discovery returned no browser/computer control method. No Semrush API or connector was used as a substitute. Therefore no additions were made, no after-count is claimed and Chrome personal remains free.

Last observed counts were 277 Website keywords and 53 ChatGPT prompts. All twenty exact candidate keywords were absent from that observed keyword list. The current prompt capacity and intent duplicates must be rechecked in Chrome before any write. `semrush-registration-status.json` preserves the exact pending twenty-keyword list and truthful state. No prompt additions or duplicates-omitted result is fabricated.

## Validation and release

Eighteen tests pass, including fourteen unique active draft guides excluded from public routes, no forms/acquisition controls, valid anchors and template approval hashes. Normal build/type checking passes: ten existing approved guides, eleven public routes, all thirty-four unpublished records absent, 448 original files preserved, 392 internal links resolved. The disposable preview builds twenty-four guides / twenty-five routes, with 923 internal links resolved. Fixture end-to-end passes add/approval, draft exclusion, catalog growth and withdrawal cleanup. Browser QA results are in `../retained-14-qa/results.json`.

An initial QA pass exposed clicks made before consent UI state settled. The cookie-settings button now waits for client initialization; QA waits for the previous dialog to close before reopening. The final fresh-context browser pass completed all 28 cases with zero failures: each of the fourteen routes at 1440 and 390 pixels, successful consent reopening and FAQ, one h1/main, no forms, no overflow, no JavaScript errors and the expected clean www canonical.

No push, PR, merge or remote deploy has occurred. Production publication remains held for the parent-coordinated visual review. The previously completed 308 redirect was not touched in this phase. Asana was not touched.
