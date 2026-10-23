# Bill-to-Action Reconciliation Ledger

Private editorial companion; not approved or published. Prepared October 23, 2026.

Use this worksheet with the guide. **All completed entries below are fictional**, including the office, contract, records, invoices, authorizations and dollar amounts. They demonstrate arithmetic, not actual customer results. No accounts were changed. All amounts are USD before tax; tax and a tax-inclusive total are unknown/not modeled, not zero.

## A. Blank reusable ledger

### 1. Evidence register

| Field | Your evidence / unresolved question |
|---|---|
| Account and invoice reference | |
| Usage period, time zone, invoice issue date | |
| Applicable rate sheet and effective version | |
| Billing unit and eligible activities | |
| Rounding increment and level: activity, call, day or period | |
| Allowance, reset and excess-usage rule | |
| Base, recurring add-ons and separate task charges | |
| One-time charges and credit references | |
| Activity export coverage and completeness | |
| Approved changes and effective dates | |
| Tax/other components outside the current calculation | |
| Evidence owner and provider contact | |

A blank or missing field means **unknown**, not zero. Use authorized records and pseudonymous activity IDs. Do not include unnecessary customer details.

### 2. Invoice-to-activity reconciliation

| Invoice line | Evidence references | Applicable rule | Supported amount / unknown | Invoiced amount | Difference | Explanation or missing evidence | Owner / response / status |
|---|---|---|---:|---:|---:|---|---|
| | | | | | | | |

Apply rounding at its documented level before applying the allowance. Do not call a partial evidence subtotal the amount owed. Keep a discrepancy open until its evidence supports a conclusion.

### 3. Cost-change bridge

| Component | Prior period, rule and amount | Comparison period, rule and amount | Workload or scope changed? | Recurring / one-time / unknown | Evidence |
|---|---|---|---|---|---|
| Base and plan | | | | | |
| Usage and allowance | | | | | |
| Optional recurring charges | | | | | |
| One-time fees | | | | | |
| Credits | | | | | |
| Tax / other | | | | | |

Explain each difference separately. Distinguish an observed change from a same-workload model. Do not attribute all of a lower invoice to a plan change when demand or one-time items also changed.

### 4. Proposed action comparison

| Candidate action | Same-workload model / assumptions | Scope retained and evidence | Modeled difference | Overlap with another action | Approver / decision |
|---|---|---|---:|---|---|
| | | | | | |

Treat mutually exclusive plans as alternatives. An included feature cannot create an additional removal saving if it has no separate removable charge.

### 5. Approval and next-invoice verification

| Check | Record |
|---|---|
| Selected action and approval evidence | |
| Effective date and authorized implementer | |
| Expected cost, period, workload and assumptions | |
| Change actually implemented / reference | |
| Next invoice and complete activity evidence | |
| Observed cost and unresolved variance | |
| Required coverage, intake and handoff checks | |
| Realized result, limitations and follow-up owner | |

Use **not requested**, **not started**, **not available** or **unverified** when appropriate. Do not fill future observations with model outputs.

## B. Completed fictional audit: Cedar Example Plumbing

This is a nonexistent demonstration business. Its September audit is deliberately incomplete. The contract and supporting documents below are invented, not copies of a provider's terms.

### 1. Evidence register

| Field | Fictional entry |
|---|---|
| Account / invoice | EXAMPLE-OFFICE / INV-SEP |
| Usage period | September 1–30, 2026 inclusive; UTC |
| Invoice issue date | October 1, 2026 |
| Rate sheet | FICTIONAL-A-v1; effective September 1 |
| Period | One calendar month; no proration or rollover in this model |
| Base | $40 per calendar month |
| Included allowance | 10 billable minutes per period |
| Excess rate | $2 per billable minute above the allowance; partial minutes charged proportionally |
| Eligible activity | Recorded incoming calls, callback work, account updates and transfer attempts, each as a separately identified activity |
| Rounding | Each eligible activity rounds upward to the next 30 seconds; exact multiples are unchanged; sum rounded seconds, then apply the allowance once |
| Other usage charges | No separate transfer surcharge or minimum beyond the rounding rule in this fictional model |
| Report add-on | $8 per calendar month, separately optional; fictional authorization ADDON-1 |
| Setup | $12 once; fictional authorization SETUP-1 |
| Credit | −$5 once; fictional note CREDIT-1 |
| Export | AUDIT-8 contains the eight records below; completeness not confirmed |
| Invoice's reported usage | 15 billable minutes; supporting activity partly missing |
| Tax | Not modeled; tax-inclusive total unknown |
| Evidence owner | Fictional office billing reviewer; no real person assigned |

### 2. Available activity evidence

| Activity | Type | Raw seconds | Rounded billable seconds | Billable minutes |
|---|---|---:|---:|---:|
| A01 | Incoming call | 89 | 90 | 1.5 |
| A02 | Incoming call | 181 | 210 | 3.5 |
| A03 | Callback work | 31 | 60 | 1.0 |
| A04 | Account update | 61 | 90 | 1.5 |
| A05 | Transfer attempt | 46 | 60 | 1.0 |
| A06 | Incoming call | 119 | 120 | 2.0 |
| A07 | Account update | 91 | 120 | 2.0 |
| A08 | Incoming call | 59 | 60 | 1.0 |
| **Total available** | | **677** | **810** | **13.5** |

Supported excess usage: max(13.5 − 10, 0) = 3.5 minutes; 3.5 × $2 = **$7**. This uses only available records. The invoice instead states 15 minutes: max(15 − 10, 0) × $2 = **$10**.

Incorrect aggregation method for this contract: round 677 raw seconds once to 690 seconds = 11.5 minutes. Correct method: round each activity first = 13.5 minutes. A real contract may specify a different rule; do not import this fictional one.

### 3. Reconciliation

| Invoice line | Evidence | Supported amount | Invoice amount | Invoice minus supported | Finding |
|---|---|---:|---:|---:|---|
| Base | FICTIONAL-A-v1 | $40 | $40 | $0 | Matched |
| Excess usage | AUDIT-8 and FICTIONAL-A-v1 | $7 | $10 | $3 | Unexplained; missing support for 1.5 reported billable minutes |
| Report add-on | ADDON-1 | $8 | $8 | $0 | Matched |
| Setup | SETUP-1 | $12 | $12 | $0 | Matched one-time charge |
| Credit | CREDIT-1 | −$5 | −$5 | $0 | Matched one-time credit |
| **Pretax subtotal** | | **$62** | **$65** | **$3** | **Open; not a proven overcharge** |

**Provider question, not a submitted request:** Identify the activities supporting the remaining 1.5 billable minutes, including duration and rounding. Evidence owner: fictional billing reviewer. Response: **not received**. Corrected invoice: **not available**. Credit due: **unknown**. The supported subtotal is not the complete established amount owed.

### 4. One-time-item bridge—not observed savings

Use the invoice's **unverified reported quantity of 15 minutes** only for this arithmetic illustration. This bridge does not resolve the incomplete export.

| Component | Fictional current invoice | Modeled later period: same quantity/terms, no one-time items |
|---|---:|---:|
| Base | $40 | $40 |
| Usage based on 15 reported minutes | $10 | $10 |
| Report | $8 | $8 |
| Setup | $12 | $0 |
| One-time credit | −$5 | $0 |
| **Pretax subtotal** | **$65** | **$58** |

Difference: **$7**, entirely explained by removing $12 setup while the $5 credit also ends. Recurring components remain **$58**. This is a model, not a later invoice, recurring improvement or realized saving. Tax remains outside both columns.

## C. Separate complete synthetic plan-comparison workload

Scenario PLAN-20 is a new fictional calendar-month workload, **not missing evidence for INV-SEP**. All ten eligible records below are complete for this scenario. They use the same 30-second per-activity rounding rule on both fictional plans.

| Activity | Type | Raw seconds | Rounded seconds | Billable minutes |
|---|---|---:|---:|---:|
| S01 | Incoming call | 89 | 90 | 1.5 |
| S02 | Incoming call | 181 | 210 | 3.5 |
| S03 | Callback work | 31 | 60 | 1.0 |
| S04 | Account update | 61 | 90 | 1.5 |
| S05 | Transfer attempt | 46 | 60 | 1.0 |
| S06 | Incoming call | 119 | 120 | 2.0 |
| S07 | Account update | 91 | 120 | 2.0 |
| S08 | Incoming call | 59 | 60 | 1.0 |
| S09 | Incoming call | 181 | 210 | 3.5 |
| S10 | Incoming call | 179 | 180 | 3.0 |
| **Total scenario** | | **1,037** | **1,200** | **20.0** |

### Fictional eligible offers

| Term | FICTIONAL-A-v1 | FICTIONAL-B-v1 |
|---|---|---|
| Base per calendar month | $40 | $52 |
| Included billable minutes per period | 10 | 25 |
| Excess billable-minute rate | $2 | $1.50 |
| Rounding / eligible activities | Defined above | Identical to A |
| Report feature | Optional $8 recurring add-on | Same report included in base; no separate refundable/removable charge |
| Required answering coverage/tasks | Same, assumed solely for this model | Same, assumed solely for this model |
| Switching/implementation fee | Not applicable | Assumed none in this model; real quote must confirm |
| Tax | Not modeled | Not modeled |

This is a fictional eligibility and scope assumption, not evidence of offers available to any real business.

### Same-workload recurring comparison

| Option | Base | Excess minutes × rate | Separately billed report | Pretax recurring cost | Reduction vs A with report |
|---|---:|---:|---:|---:|---:|
| A, report retained | $40 | 10 × $2 = $20 | $8 | **$68** | $0 |
| A, report removed if approved and unnecessary | $40 | 10 × $2 = $20 | $0 | **$60** | **$8 modeled** |
| B, report included | $52 | 0 × $1.50 = $0 | $0 | **$52** | **$16 modeled** |
| B, bundled report not used | $52 | 0 × $1.50 = $0 | $0 | **$52** | **$16 modeled** |

The last two rows cost the same. Do **not** add the $8 add-on removal to the $16 plan difference: B already absorbs that separate charge. A calculation of $24 savings would double-count it. At a separate hypothetical 10-minute period, A with report is **$48**, while B is **$52**, so B costs **$4 more**. Neither case establishes a universal best plan.

The $3 audit variance, the $7 one-time bridge and the $16 plan scenario are **different quantities**. They must not be added together as savings. The audit variance is unresolved; the bridge changes one-time items; the plan model uses a different workload.

## D. Fictional decision and verification record

| Field | Status |
|---|---|
| Immediate proposed action | Request missing activity evidence; no allegation of overcharge |
| Plan candidate | B for further evaluation only, using PLAN-20 assumptions |
| Report removal | Alternative on A only, requiring confirmation it is unnecessary and approval |
| Actual selected plan | None |
| Approval | Not requested |
| Authorized change / effective date | None / not set |
| Implementation | Not started |
| Current audit resolution | Unverified; provider response not received |
| Next actual invoice | Not available |
| Actual complete next-period workload | Not available |
| Observed recurring reduction | Unverified |
| Actual tax-inclusive result | Unknown |
| Intake, coverage and handoff outcome checks | Not run |
| Next step | Resolve evidence and scope; obtain authorization before any change |

Machine-readable fictional inputs are in `worked-example.json`. `validate_ledger.py` recomputes the arithmetic using integer seconds and cents, checks the distinctions between audit, model and observation, and writes `validation-report.json`. Passing arithmetic does not validate a provider's real contract or prove savings.
