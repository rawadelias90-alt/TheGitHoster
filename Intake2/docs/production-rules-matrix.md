# Intake2 Production Rules Matrix

**Status:** Approved Stage 1 baseline  
**Purpose:** Canonical business-rule source for the production Intake2 implementation.

## Terminology

| Technical term | User-facing term |
|---|---|
| Route | Onboarding Path |
| Route ID | Path ID |
| Route Register | Onboarding Path Overview |
| Route Steps | Path Steps and Dependencies |

## Request ID

Production requests use one identifier only: `REQ-########`.

## Entities

| Entity | Group |
|---|---|
| AECOM Middle East Limited – Abu Dhabi | Mainland |
| AECOM Middle East Limited – Dubai | Mainland |
| AECOM Middle East Limited – Al Ain | Mainland |
| AECOM Dubai South / DWC | Free Zone |

## Services

| Service | Hire status |
|---|---|
| Employment Visa & Work Permit | Local / Overseas |
| Work Permit for Relative Visa Holders | Local |
| Work Permit for Golden Visa Holder | Local |
| Work Permit for Emirati National | Local |
| Work Permit for GCC National | Local |

Diplomatic Passport is excluded from the production Intake2 service list.

## Core Documents

| Document | Rule |
|---|---|
| Passport Copy | Required |
| Candidate Photograph | Required |
| Signed AECOM Offer / Contract | Required |
| Education Certificate attested by MoFA UAE | Required only for applicable skilled cases |
| Police Clearance Certificate | Where applicable |
| Emirates ID | Where applicable |
| Current UAE Visa / Residency | Where applicable |
| External Cover Passport | Required for Dubai and AECOM Dubai South / DWC |

## Education / Equivalency

When the education requirement applies:

- Equivalency / Educational Verification available → upload Certificate of Equivalency / Educational Verification.
- Equivalency / Educational Verification not available → upload Award / Education Details document.

## Existing Visa Documents

### Relative Visa

- Sponsor Passport Copy — Required
- Sponsor Residence Visa — Required
- Sponsor Emirates ID — Required
- Sponsor NOC — Required

### Golden Visa

- Golden Visa Copy — Required

## Emirati / GCC Documents

| Document | Emirati | GCC |
|---|---|---|
| National ID | Required | Required |
| Family Book | Required | Not applicable |
| Medical at Intake2 | Not requested | Not requested |

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

Required at Intake2:

- Home-country National ID

Later process steps, not Intake2 uploads:

- Home-country Medical
- UAE Embassy process

## Additional Supporting Documents

Optional, placed before Review. Multiple files allowed.

## File Rules

- Allowed: PDF, JPG, JPEG, PNG
- Maximum: 10 MB per file
- One file per defined document slot
- Multiple files allowed only for Additional Supporting Documents

## Approved Onboarding Paths

| Path ID | Onboarding Path |
|---|---|
| EVW-MNL-LOCAL | Employment Visa & Work Permit – Mainland – Local Hire |
| EVW-MNL-OVERSEAS | Employment Visa & Work Permit – Mainland – Overseas Hire |
| EVW-MNL-OVERSEAS-SH | Employment Visa & Work Permit – Mainland – Overseas Special Hire |
| EVW-DWC-LOCAL | Employment Visa & Work Permit – AECOM Dubai South / DWC – Local Hire |
| EVW-DWC-OVERSEAS | Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Hire |
| EVW-DWC-OVERSEAS-SH | Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Special Hire |
| WP-MNL-GOLDEN | Golden Visa Work Permit – Mainland |
| WP-DWC-GOLDEN | Golden Visa Work Permit – AECOM Dubai South / DWC |
| WP-MNL-RELATIVE | Relative Visa Work Permit – Mainland |
| WP-DWC-RELATIVE | Relative Visa Work Permit – AECOM Dubai South / DWC |
| WP-MNL-EMIRATI | Emirati National Work Permit – Mainland |
| WP-DWC-EMIRATI | Emirati National Work Permit – AECOM Dubai South / DWC |
| WP-MNL-GCC | GCC National Work Permit – Mainland |
| WP-DWC-GCC | GCC National Work Permit – AECOM Dubai South / DWC |

## Stage 1 Boundary

This matrix is the approved production baseline. The current prototype runtime still uses `requirements.js`; Stage 3 will make that runtime engine consume this canonical rule source. Stage 2 will apply the approved user-facing terminology while simplifying the journey structure.
