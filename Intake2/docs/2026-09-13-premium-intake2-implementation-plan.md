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
