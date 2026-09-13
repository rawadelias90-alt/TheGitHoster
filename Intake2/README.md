# Intake2

A standalone browser prototype of the documented **New Hire Intake** Power Apps journey.

## Purpose

Intake2 translates the sanitized logic recorded in `rawadelias90-alt/Intake-Power-Apps` and the approved source documents into a static GitHub Pages prototype for review and interaction. It is intentionally front-end only and does not connect to SharePoint, Power Automate, email, or any production service.

## Current experience

The prototype uses a nine-stage guided journey:

1. Start
2. Candidate Personal Information
3. Main Required Documents
4. Service Type
5. Route-Specific Requirements
6. Certificate of Equivalency & Education Details
7. Additional Supporting Documents
8. Review & Submission Readiness
9. Confirmation

The attached branching logic and document collection form are authoritative where they conflict with the earlier simplified prototype.

## Service routes

The prototype supports the six source-defined routes:

- Employment Visa & Work Permit
- Work Permit for Relative Visa Holders
- Work Permit for Golden Visa Holder
- Work Permit for Emirati National
- Work Permit for GCC National
- Work Permit for Diplomatic Passport Holder

Each route shows only the applicable route-specific requirements while preserving the shared candidate, baseline document, education/equivalency, additional-document, review, and confirmation stages.

## Structure

- `index.html` — entry point and guided application shell.
- `styles.css` — base responsive component styling.
- `approved-theme.css` — approved Welcome Screen visual language applied across all screens, including the soft-glass desktop readiness panel treatment.
- `requirements.js` — source-driven field, document, branching, route, and readiness rules.
- `script.js` — browser-memory draft state, rendering, navigation, validation, upload staging, review, guarded Submit simulation, and retry protection.
- `assets/` — local SVG hero and icon assets.
- `tests/` — source-rule and static UI contract checks.
- `docs/` — approved design and implementation plan.

All runtime paths are relative so the project can run correctly from the `Intake2/` GitHub Pages subfolder.

## Business-rule behavior

- One browser-memory draft is shared across the whole journey.
- Moving between screens does not create or persist a request record.
- Service Type selects the applicable source-defined route.
- Employment Visa & Work Permit retains the source `STOP & CONFIRM – Does this request fall under CASE A or CASE B?` Yes/No question without reinterpreting Yes as Case A or No as Case B.
- Both Employment answers continue to the documented Special Hire requirements.
- Relative Visa, Golden Visa, Emirati, GCC, and Diplomatic routes show their documented route-specific requirements.
- Every route continues to Certificate of Equivalency & Education Details, then Additional Supporting Documents.
- External Cover Passport applicability is driven by the documented sponsorship-location rule.
- Review shows section completion, missing required items, entered values/staged filenames, and Edit actions.
- Submit remains disabled until required information and documents for the active route are complete.
- The prototype creates one simulated request ID on Submit and reuses it on retry.
- Confirmation is shown only after the simulated guarded-submit sequence succeeds.

## Visual and responsive design

The approved Welcome Screen is the visual source of truth for the experience:

- editorial/minimal layout;
- Segoe UI system-first typography;
- white canvas with deep navy, muted blue, restrained violet and amber accents;
- no green styling;
- linear nine-step progress treatment;
- light borders and spacious hierarchy;
- desktop readiness information shown as a lightweight layered translucent / soft-glass panel rather than a heavy dashboard card;
- mobile forms use the same design system in a single-column responsive interpretation.

## Prototype boundaries

This site is for interaction and flow review only. It does **not**:

- write to the `Visa Requests` SharePoint list;
- upload to `NH_Documents`;
- run `New Hire Intake - Upload to NH Documents`;
- use local storage as persistent storage;
- send email;
- contain credentials, API keys, employee submissions, government identifiers, or production documents;
- prove the pending end-to-end UAT of the live Canvas app.

Uploaded files are represented as browser-session metadata for the prototype experience only.

## Accessibility and responsive behavior

The prototype uses semantic landmarks, labelled form controls, keyboard-operable controls, visible focus states, explicit text plus icons for status, live feedback regions, reduced-motion support, and responsive desktop/mobile layouts.

## Tests

From the repository root, run:

```bash
node Intake2/tests/requirements.test.js
node Intake2/tests/shell.test.js
node Intake2/tests/approved-theme.test.js
node --check Intake2/requirements.js
node --check Intake2/script.js
```

The route tests cover the six source service types, route mapping, shared Education/Equivalency continuation, and the documented External Cover Passport location rule. The approved-theme test checks the approved header/stepper/theme hooks and prevents the previous green palette from returning.

## Preview

With GitHub Pages serving the repository from the current branch/root configuration, open:

`https://rawadelias90-alt.github.io/TheGitHoster/Intake2/`

For local preview, serve the repository root with any static web server and open `Intake2/`. No build step or dependency installation is required.

## Asset provenance

The SVG illustration and icon sprite under `Intake2/assets/` are original project assets created for this prototype. They do not reproduce official UAE government marks, ministry logos, or national emblems.