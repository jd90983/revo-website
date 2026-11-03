# November 3: five approved reception articles

Base: `47cece985a79b1ef3c354b10106eb278b90ac220`. Batch: `2026-11-03-five-approved-reception-guides`.

The owner approved the five supplied article texts for implementation and testing on November 3, 2026. The reviewed document SHA256 is `65d9a527871b0bbc63aacb3fffc6f6317650ab26abaf778050b48499d563b003`. Only the approved public article blocks and their title/description/route metadata are retained in `five-approved-public-copy.txt`. The private research, editorial appendix and additional candidates are excluded.

All five Markdown article bodies, titles, descriptions and source links are preserved byte for byte. The existing workflow components render the approved introduction, Markdown sections, semantic tables and static FAQ text. Existing content-only component CTAs remain: Compare plans, Read the guide, and the approved article links to /pricing. No component, pricing module, form, acquisition configuration, consent code or original public HTML was changed.

## Disclosed implementation adjustment

Newo's proposed eyebrow, `Published terms, not a performance rating`, contained 41 characters; the existing component contract permits at most 40. The implemented eyebrow is `Published terms, no performance rating` (38 characters). This is a metadata length adjustment with the same meaning, not a change to the approved article. It is disclosed for final PR review and was not previously approved verbatim. The immutable draft batch's provenance contains a 37-character counting typo; the live registry's provenance corrects that to 38. Neither the metadata guard nor the previously approved source file was changed.

## Review and local validation

This is an automated implementation/self-review against the owner's approved copy, not an additional independent human review, customer interview or product test. The five review hashes bind the exact implemented records; all five retain `review.releaseApproval: pending`. Production remains blocked until the exact PR receives specific owner approval. No PR approval or merge is authorized here.

- All 379 earlier registry records remain identical as JSON objects; 384 total records, 355 approved and 29 withdrawn.
- All 419 existing rewrites and 424 redirects remain; five of each are added. Existing non-guide Vercel rules remain unchanged.
- 46 unit/integration tests passed. Added checks enforce all five approved article bodies, descriptions, Markdown hashes, section completeness, source destinations, semantic table headers, content-only CTAs, and the production approval boundary.
- Full integrated build passed, preserving 463 original public files and existing API source. Output verification resolved 19,664 internal links and verified canonical/indexability, sitemap, navigation and the ten project routing rules.
- Fixture end-to-end passed: sixth page, excluded draft, index growth and withdrawal cleanup.
- Built sitemap contains 407 URLs, five more than the 402-URL production baseline.
- Isolated local headless browser QA passed for all five routes at 1440x1000 and 390x844. Checked exact H1/description/canonical, one main/H1, no forms or horizontal overflow, source/CTA rendering, semantic table headers, basic link/image accessibility, keyboard focus, mobile navigation, consent reopening, missing assets and JavaScript errors. Screenshots were inspected at both sizes. This is scoped browser/semantic QA, not a comprehensive accessibility certification.

Remote GitHub CI and protected Vercel Preview status are reported separately in the PR. Local QA is not represented as authenticated remote Preview QA. The user's Chrome session was not used. No POST, live lead, checkout or external form submission was performed.

## After separately approved publication

Following specific approval of the final PR/commit, use the protected merge flow and verify the real production deployment and all five URLs. Only then add deduplicated records to the existing inventory. The runbook also requires a release-record follow-up commit using the actual merge SHA and deployment ID. Any separate documentary PR must be explicitly authorized for creation and then specifically approved before merging. No release record, inventory rows or sitemap submission is included here.
