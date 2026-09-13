# Premium Intake2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `Intake2` as the approved premium, adaptive visa and work-permit intake while preserving its front-end-only prototype boundary.

**Architecture:** Keep the project framework-free and GitHub Pages compatible. Put source-driven field, route, document, and readiness rules in `requirements.js`; keep browser state, rendering, navigation, validation, upload staging, review, and guarded-submit simulation in `script.js`. Keep visual assets local under `assets/`.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, browser File API, Node built-in `assert`, local SVG assets, GitHub Pages.

**Spec:** `Intake2/docs/2026-09-13-premium-intake2-design.md`

## Global Constraints

- Attached Branching Logic and Document Collection Form are authoritative where they conflict with the current prototype.
- Preserve non-conflicting in-memory draft, no pre-submit persistence, guarded submit, retry-ID reuse, and confirmation-on-success behavior.
- No green in runtime styles or assets.
- All files stay under `Intake2/`; relative paths only.
- No frameworks, secrets, API keys, SharePoint/Power Automate/email calls, production identifiers, or local-storage persistence.
- Preserve every source field, service choice, route requirement, helper note, and confirmed branch. Do not invent unsupported rules.
- Keep the exact source Yes/No STOP & CONFIRM question; both answers continue to Special Hire requirements.
- Every service route continues to Education/Equivalency, Additional Supporting Documents, Review, and Confirmation.
- Preserve existing non-conflicting Employment Start Date.

## Target files

```text
Intake2/
  index.html
  styles.css
  requirements.js
  script.js
  README.md
  assets/mobility-hero.svg
  assets/icon-sprite.svg
  tests/requirements.test.js
  docs/2026-09-13-premium-intake2-design.md
  docs/2026-09-13-premium-intake2-implementation-plan.md
```

## Task 1: Requirements model

**Files:** Create `requirements.js` and `tests/requirements.test.js`.

- [ ] Write failing tests for the six exact service types, route IDs, External Cover Passport applicability, and common Education/Equivalency requirements.
- [ ] Implement a browser/CommonJS `IntakeRequirements` API containing source field metadata, baseline documents, route documents, common education requirements, additional documents, and pure readiness helpers.
- [ ] Run `node Intake2/tests/requirements.test.js` and `node --check Intake2/requirements.js`; both must pass.
- [ ] Commit `feat: model Intake2 source requirements`.

## Task 2: Guided shell

**Files:** Modify `index.html`.

- [ ] Add a failing static check for `./requirements.js` loading before `./script.js` and for the new progress, screen-host, readiness, live-region, test-tools, and submit anchors.
- [ ] Replace the fixed six-screen markup with the approved adaptive shell: header, nine-stage progress, welcome hero, form host, readiness panel, route/status live regions, review tools disclosure, confirmation host, and prototype footer.
- [ ] Use semantic landmarks/headings and relative asset paths only.
- [ ] Re-run the shell check and commit `feat: rebuild Intake2 guided shell`.

## Task 3: Workflow, branching, validation, and review

**Files:** Replace `script.js`.

- [ ] Use one in-memory draft with candidate, mainDocuments, service, route, education, additionalDocuments, submittedRequest, and isSubmitting sections.
- [ ] Render controls from requirements metadata and preserve entries on Back/Next and validation failure.
- [ ] Add inline required/email errors with accessible error linkage.
- [ ] Render baseline document upload cards with exact labels, source guidance, applicability, file guidance, staged file details, and remove/replace actions.
- [ ] Implement the six source service choices and live route preview.
- [ ] Confirm before clearing existing route-only data when Service Type changes; preserve common data.
- [ ] Employment route: source IMPORTANT NOTE, exact Yes/No STOP & CONFIRM question, no Yes/No-to-case reinterpretation, then all source Special Hire requirements.
- [ ] Implement Relative, Golden, Emirati, GCC, and Diplomatic route requirements exactly from the approved spec.
- [ ] After every route, render Equivalency availability, Education Details Form, Certificate of Equivalency, then Additional Supporting Documents.
- [ ] Add live readiness totals, missing-item counts, action-required/ready status, and review groups with Edit actions.
- [ ] Preserve guarded submit, simulated failure, retry with same request ID, and success-only confirmation.
- [ ] Run syntax/logic tests and commit `feat: implement Intake2 adaptive workflow`.

## Task 4: Premium no-green design

**Files:** Replace `styles.css`; create `assets/mobility-hero.svg` and `assets/icon-sprite.svg`.

- [ ] Use only near-black, white, cool gray, deep navy, blue, violet, amber, and red runtime tokens.
- [ ] Build desktop form + sticky readiness layout and mobile single-column/sticky-progress layout with 44px+ touch targets.
- [ ] Style completion with blue/navy/violet plus icon/text; warning with amber; error with red.
- [ ] Add subtle 150–220ms transitions and full reduced-motion fallback.
- [ ] Create original local SVG hero and icon assets without official government marks.
- [ ] Scan runtime files for old green tokens/values and remove all intentional green styling.
- [ ] Commit `feat: apply premium Intake2 visual system`.

## Task 5: Documentation

**Files:** Modify `README.md`.

- [ ] Document source authority, nine-stage journey, six service routes, prototype boundary, file structure, local assets, accessibility, tests, and GitHub Pages preview path.
- [ ] Record asset provenance and confirm no secrets/live integrations.
- [ ] Commit `docs: update Intake2 premium experience guide`.

## Task 6: Final QC

- [ ] Run requirements tests and JS syntax checks.
- [ ] Complete one synthetic browser path for each service type.
- [ ] Test both Employment STOP & CONFIRM answers and verify both continue to Special Hire requirements.
- [ ] Verify External Cover Passport applicability for Dubai, DWC, Abu Dhabi, and Al Ain.
- [ ] Verify every route reaches Education/Equivalency and Additional Supporting Documents.
- [ ] Test route-change stale-data protection, review missing counts/Edit links, and guarded-submit retry ID reuse.
- [ ] Test keyboard navigation, visible focus, associated errors, live announcements, reduced motion, and no color-only states.
- [ ] Test 390px, 768px, and 1440px layouts for clipping/overflow/usability.
- [ ] Verify all runtime references are relative with no CDN/external fetch.
- [ ] Compare implementation base/head and confirm changes remain entirely under `Intake2/`.
- [ ] Fix defects, repeat affected checks, and commit QC fixes only if needed.

## Self-review

- Spec coverage: all approved source fields, documents, routes, branching, education/additional steps, readiness review, validation, draft retention, no-green design, local visuals, accessibility, mobile/desktop behavior, documentation, and GitHub Pages QC are mapped to tasks.
- Placeholder scan: no TBD/TODO or undefined implementation responsibility remains.
- Interface consistency: `requirements.js` is the business-rule API; `script.js` is the runtime state/UI layer; shared names are consistent across model, UI, review, and tests.
