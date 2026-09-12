# Agent API Masterclass Premium Learning Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Agent API Masterclass into a premium SaaS-style AI learning academy and agent lab without breaking existing training functionality.

**Architecture:** Preserve the current static vanilla HTML/CSS/JS application and its stable IDs/state model. Add original SVG learning assets, new premium shell components, and progressive visual enhancements around the existing functional surfaces rather than rewriting core simulation logic.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, inline/local SVG assets, localStorage, GitHub Pages.

**Spec:** `agent-api-masterclass/docs/superpowers/specs/2026-09-12-agent-masterclass-premium-redesign.md`

## Global Constraints
- Preserve current functionality, bilingual English/Arabic and RTL, Light/Dark Mode, responsive behavior, local persistence, Builder, Blueprint, Simulator, Trace, Design, Code Studio, Missions, and competency-based Mastery.
- Keep the project static and GitHub Pages compatible with relative paths.
- No secrets, API keys, external runtime dependencies, or live OpenAI calls.
- Use original local visual assets; do not hotlink third-party imagery.
- Respect reduced-motion preferences and maintain touch targets of at least 44px.

---

### Task 1: Add regression harness and premium visual assets

**Files:**
- Create: `agent-api-masterclass/tests/smoke.js`
- Create: `agent-api-masterclass/assets/agent-network.svg`
- Create: `agent-api-masterclass/assets/trace-stack.svg`
- Create: `agent-api-masterclass/assets/learning-path.svg`

**Interfaces:**
- Consumes: current `index.html`, `styles.css`, `app.js`.
- Produces: local visual assets and a structural smoke test used by later tasks.

- [ ] Write structural smoke checks for required IDs, relative CSS/JS paths, local asset paths, duplicate IDs, and required navigation sections.
- [ ] Run the smoke test and verify it fails because the premium assets/references are not present yet.
- [ ] Add the three local SVG assets with accessible titles/descriptions and no scripts or external references.
- [ ] Run the smoke test again and verify the asset-level checks pass.

### Task 2: Upgrade the global shell and Learning Home

**Files:**
- Modify: `agent-api-masterclass/index.html`
- Modify: `agent-api-masterclass/styles.css`
- Modify: `agent-api-masterclass/app.js`

**Interfaces:**
- Consumes: existing navigation, `learning-home`, mastery state, Blueprint state, latest trace/run state.
- Produces: premium app shell, academy hero, learning path, progress ring, and continuation state.

- [ ] Add premium Learning Home markup using stable existing data hooks plus new non-conflicting IDs/classes.
- [ ] Add CSS for premium shell, hero, progress ring, learning path, responsive behavior, and dark theme.
- [ ] Add JS render helpers that derive hero/progress content from existing mastery/Blueprint/run state without creating a second source of truth.
- [ ] Run syntax and smoke checks.

### Task 3: Upgrade Learn and Builder learning flow

**Files:**
- Modify: `agent-api-masterclass/index.html`
- Modify: `agent-api-masterclass/styles.css`
- Modify: `agent-api-masterclass/app.js`

**Interfaces:**
- Consumes: `modulesData`, Builder/Blueprint state, existing Describe → Build controls.
- Produces: module metadata, premium lesson framing, and live architecture visual driven by Blueprint state.

- [ ] Extend module rendering with concept category, outcome, progress marker, and “Try next” cue derived from existing module order.
- [ ] Add Builder architecture snapshot markup and update function driven by `agentBlueprint`.
- [ ] Add premium CSS for course rail, lesson framing, Builder intent-first hierarchy, configured states, and mobile layout.
- [ ] Run syntax and smoke checks.

### Task 4: Upgrade Simulator, Trace, Design, and Code Studio

**Files:**
- Modify: `agent-api-masterclass/index.html`
- Modify: `agent-api-masterclass/styles.css`
- Modify: `agent-api-masterclass/app.js`

**Interfaces:**
- Consumes: simulation timeline/events, trace state, orchestration state, generated code state.
- Produces: lab-style run summary, improved trace teaching panel, concept legend, and code workspace framing.

- [ ] Add Simulator run-summary UI and update it from existing run state.
- [ ] Add Trace debugging checklist and selected-span teaching summary from existing trace data.
- [ ] Add Design legend based on agent/tool/MCP/handoff/guardrail/approval/output concepts.
- [ ] Add Code Studio workspace framing and visual diff emphasis without changing generated-code logic.
- [ ] Run syntax and smoke checks.

### Task 5: Upgrade Mastery, motion, mobile, and accessibility polish

**Files:**
- Modify: `agent-api-masterclass/styles.css`
- Modify: `agent-api-masterclass/app.js`
- Modify: `agent-api-masterclass/README.md`

**Interfaces:**
- Consumes: existing mission and mastery logic.
- Produces: stronger achievement feedback, recommended-next state, motion polish, updated documentation.

- [ ] Add mastery path visual and next-skill recommendation using existing competency rules.
- [ ] Add restrained transitions and micro-interactions guarded by `prefers-reduced-motion`.
- [ ] Verify mobile rules prevent page-level overflow and maintain 44px touch targets.
- [ ] Update README with premium experience, local assets, test command, and GitHub Pages preview path.
- [ ] Run all checks.

### Task 6: Browser regression and release verification

**Files:**
- Test: `agent-api-masterclass/tests/smoke.js`
- Test: rendered site in local static server/browser runtime.

**Interfaces:**
- Consumes: completed project.
- Produces: release evidence for GitHub commit and Pages verification.

- [ ] Run `node --check app.js` and `node tests/smoke.js`.
- [ ] Serve the project with a local static HTTP server and verify HTML/CSS/JS/assets return 200.
- [ ] Run browser interaction checks for navigation, theme, language/RTL, Describe→Build, simulation, trace, code, and mastery persistence.
- [ ] Check desktop and mobile viewport overflow.
- [ ] Commit the completed redesign locally.
- [ ] Apply the verified file changes to GitHub `main` and confirm the Pages build/deploy succeeds.
