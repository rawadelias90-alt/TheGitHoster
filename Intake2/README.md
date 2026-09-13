# Intake2

A standalone browser prototype for the UAE New Hire employment visa and work permit intake journey.

## Purpose

Intake2 converts the approved branching logic and document-collection requirements into a guided static web experience for review and interaction. The supplied Branching Logic and Document Collection Form are the business-logic source of truth where they conflict with the earlier simplified prototype.

The site is intentionally front-end only. It does not connect to SharePoint, Power Automate, email, or any production service.

## Current journey

1. Start / Welcome
2. Candidate Personal Information
3. Main Required Documents
4. Select Service Type
5. Route-specific Requirements
6. Certificate of Equivalency & Education Details
7. Additional Supporting Documents
8. Review & Submission Readiness
9. Confirmation

## Service routes

- Employment Visa & Work Permit
- Work Permit for Relative Visa Holders
- Work Permit for Golden Visa Holder
- Work Permit for Emirati National
- Work Permit for GCC National
- Work Permit for Diplomatic Passport Holder

For Employment Visa & Work Permit, the source CASE A / CASE B note and exact Yes/No `STOP & CONFIRM` question are preserved. Both answers continue to the Special Hire requirements because the supplied branching schema does not define a Yes-to-Case-A / No-to-Case-B mapping.

All service routes continue through Education / Equivalency and Additional Supporting Documents before Review.

## Project structure

- `index.html` — semantic shell, approved header, nine-stage stepper, Welcome screen, workflow shell, readiness panel, confirmation screen.
- `styles.css` — base responsive component styling.
- `approved-theme.css` — approved Welcome Screen design language applied consistently across desktop and mobile screens, including the translucent desktop information-panel treatment.
- `requirements.js` — source-driven fields, service routes, document rules, applicability rules, and readiness calculations.
- `script.js` — in-memory draft state, rendering, branching, validation, file staging, review/edit flow, guarded Submit simulation, and retry-ID protection.
- `assets/mobility-hero.svg` — local layered mobility/document hero artwork.
- `assets/icon-sprite.svg` — local interface icons.
- `tests/requirements.test.js` — source-rule and route tests.
- `tests/shell.test.js` — structural shell checks.
- `tests/approved-theme.test.js` — approved visual-contract and no-green checks.
- `docs/2026-09-13-premium-intake2-design.md` — approved design specification.
- `docs/2026-09-13-premium-intake2-implementation-plan.md` — staged implementation plan.

All runtime references use relative paths so the project can be served from the repository subfolder.

## Visual system

The approved Welcome Screen is the visual source of truth for all Intake2 screens:

- white, editorial/minimal canvas;
- near-black and deep navy typography/actions;
- restrained blue, violet, amber and warm neutral accents;
- no green;
- thin cool-gray borders and minimal card weight;
- editorial nine-stage progress treatment;
- subtle layered/translucent desktop readiness panels instead of heavy dashboard cards;
- responsive mobile interpretation of the same system rather than a separate mobile style.

The hero and icons are local original SVG assets. No external image or icon CDN is required.

## Prototype behavior

- One in-memory draft is retained while moving backward and forward.
- No request record or document upload occurs before Submit.
- Files are staged as browser-side metadata only for the current session.
- Required fields/documents are calculated from the active service route and confirmed applicability rules.
- Review shows completion state, missing items, and Edit links back to the relevant step.
- Submit remains guarded while the request is incomplete or already submitting.
- One simulated request ID is created on Submit and reused if the simulated document upload fails and the user retries.
- Confirmation appears only after the simulated submission sequence succeeds.

## Prototype boundaries

This site does **not**:

- write to the `Visa Requests` SharePoint list;
- upload to `NH_Documents`;
- run the `New Hire Intake - Upload to NH Documents` Power Automate flow;
- send email;
- contain credentials, API keys, employee submissions, government identifiers, or production documents;
- persist draft data to local storage;
- prove end-to-end UAT of the live Canvas app.

## Accessibility and responsive behavior

The prototype uses semantic landmarks/headings, explicit labels, keyboard-operable controls, visible focus states, inline validation, live status regions, non-color-only state indicators, reduced-motion support, and responsive layouts. Mobile uses the same approved design language with compact top progress and a single-column form flow.

## Tests

From the repository root:

```bash
node Intake2/tests/requirements.test.js
node Intake2/tests/shell.test.js
node Intake2/tests/approved-theme.test.js
node --check Intake2/requirements.js
node --check Intake2/script.js
```

## Preview

When GitHub Pages serves the repository from the current branch/root configuration, open:

`https://rawadelias90-alt.github.io/TheGitHoster/Intake2/`

For local preview, serve the repository root with any static web server and open `Intake2/index.html`. No build step or dependency installation is required.
