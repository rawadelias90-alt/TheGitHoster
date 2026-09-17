# Intake2 Production Rules Matrix

**Status:** Approved Stage 1 baseline — synced to Project Source dated 17 September 2026  
**Purpose:** Canonical rules source for the production Intake2 implementation.

The Project Source is the authority for business journey and document requirements. Intake2-only technical decisions such as `REQ-########`, upload limits, and UI terminology are recorded separately as implementation decisions.

## Intake2 Preconditions

- Client Approval is required before Intake 2 for all new-hire service paths.
- Intake 1 is path-specific and must be complete where the Project Source requires it.
- Intake 2 is the formal trigger for GRO processing.

## Terminology — Intake2 implementation decision

| Technical term | User-facing term |
|---|---|
| Route | Onboarding Path |
| Route ID | Path ID |
| Route Register | Onboarding Path Overview |
| Route Steps | Path Steps and Dependencies |

## Request ID — Intake2 implementation decision

Production requests use one identifier only: `REQ-########`.

## Entities

| Entity | Group |
|---|---|
| AECOM Abu Dhabi | Mainland |
| AECOM Dubai | Mainland |
| AECOM Al Ain | Mainland |
| AECOM Dubai South / DWC | Free Zone |

## Main Service Groups

| Service group | When it applies |
|---|---|
| Employment Visa and Work Permit | Candidate requires an AECOM-sponsored employment visa and work permit |
| Work Permit | Candidate already holds valid UAE residency, such as Golden Visa or Relative / Family Visa |
| Emirati and GCC National Work Permit | Candidate is an Emirati or GCC national |

Diplomatic Passport Service is excluded from the current operational journey.

### Intake2 service variants

| Intake2 service | Service group | Hire status |
|---|---|---|
| Employment Visa & Work Permit | Employment Visa and Work Permit | Local / Overseas |
| Work Permit for Relative Visa Holders | Work Permit | UAE resident |
| Work Permit for Golden Visa Holder | Work Permit | UAE resident |
| Work Permit for Emirati National | Emirati and GCC National Work Permit | Local |
| Work Permit for GCC National | Emirati and GCC National Work Permit | Local |

Existing Visa Work Permit cases are UAE-resident cases and are not treated as Overseas Hire cases.

## Pre-Hire Readiness Fields

The production intake logic must support the following readiness information where applicable:

- Candidate Full Name — required and must match passport
- Nationality — required
- Country of Birth — required
- Hire Status — required for Employment Visa and Work Permit cases
- Sponsoring Entity — required
- Service — required
- Current UAE Visa / Residency — where applicable
- Unified Number — where available
- Last Working Date — where applicable
- Personal Email — required
- Contact Number — required
- Skilled Status — confirm where applicable
- Special Hire Status — check for applicable Overseas Employment Visa cases
- Expected Joining Date — required
- Candidate Actions — confirm where applicable

## Core Documents

| Document | Rule |
|---|---|
| Passport Copy | Required |
| Candidate Photograph | Required |
| Signed AECOM Offer / Contract | Required |
| Education Certificate | Required for applicable skilled classifications |
| Educational Verification / Equivalency | Required where available and applicable |
| Award or Education Details Document | Required where candidate has an Education Certificate but no verification / equivalency |
| Police Clearance Certificate | Where requested or applicable |
| Emirates ID | Where applicable |
| Current UAE Visa / Residency | Where applicable |
| External Cover Passport | Dubai Mainland and AECOM Dubai South / DWC, where applicable |
| Home-country National ID | Applicable Overseas Special Hire cases |

External Cover Passport does not apply to Abu Dhabi or Al Ain.

## Education / Equivalency

Education Certificate is required only for applicable skilled classifications.

Where an Education Certificate is provided:

- Educational Verification / Certificate of Equivalency available → upload the available verification / equivalency document.
- Verification / equivalency unavailable → upload the applicable Award or Education Details document.

Education verification is separate from Intake 1.

## Existing Visa Documents

### Relative / Family Visa

Where applicable, Mobilisation collects:

- Sponsor Passport Copy
- Sponsor Residence Visa
- Sponsor Emirates ID
- Sponsor No Objection Certificate

These are conditional in Intake2 rather than universally mandatory.

### Golden Visa

The current Project Source does not define a separate mandatory Golden Visa upload. Current UAE residency evidence remains covered by the core `Current UAE Visa / Residency` rule where applicable.

## Emirati / GCC Documents

| Document | Emirati | GCC |
|---|---|---|
| National ID | Required | Required |
| Family Book | Required | Not applicable |
| Medical at Intake2 | Not requested | Not requested |

Medical is completed after Work Permit approval.

## Special Hire

Special Hire applies only to Overseas Employment Visa & Work Permit cases.

### Mainland

Applicable entities: Abu Dhabi and Al Ain.

Applicable nationalities:

- India
- Pakistan
- Egypt
- Sri Lanka

### AECOM Dubai South / DWC

Applicable nationalities:

- Egypt
- Sri Lanka

### Intake2 document rule

Required at the initial Intake2 stage:

- Home-country National ID

Later process steps, not initial Intake2 uploads:

- Home-country Medical
- UAE Embassy process

## Intake 1 Applicability

| Path | Intake 1 |
|---|---|
| Mainland Employment Visa & Work Permit — Local | Yes |
| Mainland Employment Visa & Work Permit — Overseas | Yes |
| Mainland Employment Visa & Work Permit — Overseas Special Hire | Yes |
| AECOM Dubai South / DWC Employment Visa & Work Permit | No |
| Mainland Golden Visa Work Permit | Yes |
| Mainland Relative Visa Work Permit | Yes |
| AECOM Dubai South / DWC Golden Visa Work Permit | No |
| AECOM Dubai South / DWC Relative Visa Work Permit | No |
| Emirati National Work Permit | No |
| GCC National Work Permit | No |

## Additional Supporting Documents — Intake2 implementation decision

Optional, placed before Review. Multiple files allowed.

## File Rules — Intake2 implementation decision

- Allowed: PDF, JPG, JPEG, PNG
- Maximum: 10 MB per file
- One file per defined document slot
- Multiple files allowed only for Additional Supporting Documents

## Approved Onboarding Paths

| Path ID | Onboarding Path | Hire status | Intake 1 |
|---|---|---|---|
| EVW-MNL-LOCAL | Employment Visa & Work Permit – Mainland – Local Hire | Local | Yes |
| EVW-MNL-OVERSEAS | Employment Visa & Work Permit – Mainland – Overseas Hire | Overseas | Yes |
| EVW-MNL-OVERSEAS-SH | Employment Visa & Work Permit – Mainland – Overseas Special Hire | Overseas | Yes |
| EVW-DWC-LOCAL | Employment Visa & Work Permit – AECOM Dubai South / DWC – Local Hire | Local | No |
| EVW-DWC-OVERSEAS | Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Hire | Overseas | No |
| EVW-DWC-OVERSEAS-SH | Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Special Hire | Overseas | No |
| WP-MNL-GOLDEN | Golden Visa Work Permit – Mainland | UAE resident | Yes |
| WP-DWC-GOLDEN | Golden Visa Work Permit – AECOM Dubai South / DWC | UAE resident | No |
| WP-MNL-RELATIVE | Relative Visa Work Permit – Mainland | UAE resident | Yes |
| WP-DWC-RELATIVE | Relative Visa Work Permit – AECOM Dubai South / DWC | UAE resident | No |
| WP-MNL-EMIRATI | Emirati National Work Permit – Mainland | Local | No |
| WP-DWC-EMIRATI | Emirati National Work Permit – AECOM Dubai South / DWC | Local | No |
| WP-MNL-GCC | GCC National Work Permit – Mainland | Local | No |
| WP-DWC-GCC | GCC National Work Permit – AECOM Dubai South / DWC | Local | No |

## Stage 1 Boundary

This matrix is the source-synced production baseline. The current prototype runtime still uses `requirements.js`; Stage 3 will make the runtime rules engine consume this canonical source. Stage 2 will simplify the journey structure and apply the approved user-facing terminology without changing the business rules established here.
