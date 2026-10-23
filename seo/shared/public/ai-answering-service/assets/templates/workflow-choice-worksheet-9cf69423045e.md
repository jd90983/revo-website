# AI workflow-choice worksheet

Original editorial planning aid. No software connection, automatic score or verified performance claim. Complete one card per candidate task; keep real customer details out of shared copies. The examples are fictional planning decisions and have not been run as tests.

## Blank card

| Field | Your entry |
|---|---|
| Task / workflow type | |
| Observed bottleneck and evidence reference | |
| Non-AI alternative | |
| Authoritative input source and version | |
| Unknown, incomplete or conflicting data | |
| Expected output | |
| Permitted action during the test | |
| Actions explicitly not permitted | |
| Consequence of an incorrect output | |
| Human reviewer and exception owner | |
| Written acceptance conditions | |
| Manual fallback / pending-work handling | |
| Pre-test decision: test, revise or defer | |
| Actual evidence and correction effort | Not yet tested |
| Post-test decision and reviewer/date | Not yet tested |

**Choosing among cards:** First resolve missing source authority, missing reviewers or unclear permissions. Among the remaining candidates, select one with a demonstrated recurring problem and a result the reviewer can check. Do not add fields into a numerical ranking. Keep an inexpensive non-AI alternative in the comparison.

## Worked selection: choose one task, defer the unready alternative

These are fictional pre-test decisions, not tested outcomes. The two offices face different problems; the table does not rank their value against each other.

| Office / candidate | Source readiness | Review and authority | Decision and reason |
|---|---|---|---|
| A / capture a service request | Fictional current service list and caller statements available; omissions can be marked | Office manager can compare the output; test limited to internal requests | Test capture only against a revised intake script; the stated bottleneck is incomplete requests |
| A / automatic booking | Supported record-writing behavior and recovery unresolved | Appointment-write authority not established | Defer; a capture test cannot establish booking permissions or success |
| B / draft a shorter service description | Approved fictional text and exclusions available | Owner can review facts; no sending or publication permitted | Test draft generation against reusable templates; the stated bottleneck is repeated rewriting |
| B / analyze request patterns | Dataset does not yet distinguish new requests from repeat contacts | Reviewer cannot validate counts until units are defined | Defer; first define and clean the dataset rather than treating an AI answer as evidence |

## Fictional completed card A: service-request capture

| Field | Fictional entry |
|---|---|
| Task / workflow type | Collect a plumbing request for office review / capture and conversation |
| Observed bottleneck and evidence reference | Assumed scenario: office repeatedly needs to recover callback details. No real operating sample is supplied; verify this problem before a real adoption decision. |
| Non-AI alternative | Revised intake script or required fields in a request form |
| Authoritative input source and version | Fictional service list v1 and synthetic caller statements; current office-reviewed instructions control |
| Unknown, incomplete or conflicting data | Callback number may be absent; conflicting service-area versions require office review |
| Expected output | Stated request plus supplied return number; missing information marked explicitly |
| Permitted action during the test | Produce an internal test request from a fictional conversation |
| Actions explicitly not permitted | Live customer routing; diagnosis; repair quote; appointment confirmation; customer-record writes |
| Consequence of an incorrect output | In real use, a wrong number could misdirect follow-up and an invented promise could mislead a caller |
| Human reviewer and exception owner | Office manager, fictional role; a real reviewer must be assigned before use |
| Written acceptance conditions | Preserve the stated request and supplied number; mark absent data; identify source conflicts; do not diagnose, quote or confirm a visit |
| Manual fallback / pending-work handling | Return to the approved intake script; reviewer handles unresolved test cases before any real routing decision |
| Pre-test decision: test, revise or defer | Eligible for a fictional capture-only test, not authorized for production |
| Actual evidence and correction effort | Not yet tested; no measured result |
| Post-test decision and reviewer/date | Not yet tested |

## Fictional completed card B: service-description drafting

| Field | Fictional entry |
|---|---|
| Task / workflow type | Shorten an approved cleaning-service description / draft generation |
| Observed bottleneck and evidence reference | Assumed scenario: owner repeatedly rewrites approved text. No real time log is supplied; verify the repetition before a real adoption decision. |
| Non-AI alternative | Approved short-and-long description templates |
| Authoritative input source and version | Fictional owner-approved service description v1; no customer data needed |
| Unknown, incomplete or conflicting data | No approved price or guarantee; an older description may conflict with v1 |
| Expected output | Unpublished shorter description preserving services and exclusions |
| Permitted action during the test | Produce a draft for owner review |
| Actions explicitly not permitted | Publication; campaign sending; invented discount or guarantee; price changes; customer-data access |
| Consequence of an incorrect output | In real use, an added service or promise could misrepresent the offer if published |
| Human reviewer and exception owner | Business owner, fictional role; a real reviewer must be assigned before use |
| Written acceptance conditions | Preserve approved service scope and exclusions; invent no price or guarantee; surface conflicts; output remains an unpublished draft |
| Manual fallback / pending-work handling | Discard the draft and use approved text; owner reviews any pending drafts before publication |
| Pre-test decision: test, revise or defer | Eligible for a fictional draft-only test, not permission to publish |
| Actual evidence and correction effort | Not yet tested; no measured result |
| Post-test decision and reviewer/date | Not yet tested |

## Test record: complete only after running a case

Repeat this record for the normal, missing-data, outdated/conflicting-source and outside-scope cases. Define expected behavior before the run; do not mark an expected behavior as observed evidence.

| Field | Entry |
|---|---|
| Workflow card / case identifier | |
| Input and approved-source version | |
| Expected behavior written before run | |
| Actual output or authorized evidence reference | Not yet tested |
| Difference from expected behavior | Not yet tested |
| Staff review and correction time actually observed | Not measured |
| Unresolved exception and owner | |
| Reviewer / review date | |
| Decision within existing scope | Not yet tested |

Passing these examples would support further evaluation, not prove production reliability or authorize an expanded task. Choose live-use requirements separately for the actual tool and workflow.
