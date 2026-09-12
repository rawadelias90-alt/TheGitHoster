# Agent API Masterclass

Premium, bilingual learning lab for understanding how OpenAI agents are described, configured, simulated, inspected, debugged, and represented in code.

## Purpose

Agent API Masterclass is a self-paced educational environment built around current OpenAI Agents SDK and Responses API concepts. It combines plain-language lessons with a visual Builder, local execution simulations, trace inspection, orchestration design, Code Studio, guided missions, and competency-based mastery.

The experience is intentionally safe and self-contained. Local simulations and simplified configuration shapes are labeled as simulations or training representations. No API keys, secrets, or live OpenAI credentials are included.

## Learning experience

The platform follows a simple progression:

`Learn → Build → Run → Inspect → Master`

Key areas include:

- Learning Home with current Blueprint, latest run, next mission, and mastery progress.
- Beginner-friendly Describe → Build onboarding.
- Visual Agent Builder with synchronized configuration, JSON, and SDK code.
- Function Tool, MCP, approval, guardrail, session, handoff, and structured-output training.
- Input → Execution → Output simulator with failure scenarios and human approval flows.
- Trace Inspector designed to teach debugging rather than only expose payloads.
- Orchestration and guardrail design laboratory.
- Guided learning mode, missions, knowledge checks, and competency-based progression.
- English/Arabic support, RTL, Light/Dark Mode, local persistence, and mobile-first layouts.

## Project structure

- `index.html` — project entry point and semantic page structure.
- `styles.css` — responsive visual system, themes, RTL, learning layouts, Builder, Simulator, Trace, Design, Code Studio, and Mastery UI.
- `app.js` — bilingual content, local persistence, Blueprint synchronization, simulations, approvals, traces, orchestration, missions, and Code Studio behavior.
- `assets/` — original local SVG learning graphics used by the Academy, agent architecture, trace, and learning-path views.
- `tests/smoke.js` — lightweight structural regression checks for the static GitHub Pages build.
- `docs/superpowers/` — approved redesign specification and implementation plan.
- `README.md` — project purpose, structure, preview, and validation notes.

All runtime assets use relative paths so this project remains isolated from the sibling `administrative/` project and can be served from its own GitHub Pages folder path.

## Preview

### GitHub Pages

When GitHub Pages serves the repository root from `main`, open:

`https://rawadelias90-alt.github.io/TheGitHoster/agent-api-masterclass/`

### Local preview

From the repository root:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/agent-api-masterclass/`

A local static server is preferred over opening `index.html` directly because it more closely matches GitHub Pages behavior.

## Validation

From `agent-api-masterclass/` run:

```bash
node --check app.js
node tests/smoke.js
```

The release QC also checks browser interactions, English/Arabic direction changes, Light/Dark Mode, local Blueprint synchronization, simulated approvals and traces, mobile overflow, relative assets, and GitHub Pages deployment.

## Design notes

- The premium interface is an original design, not a replica of OpenAI Platform or another learning product.
- Agent-network and trace visuals are original training diagrams informed by current Agents SDK concepts such as agents, tools, MCP servers, handoffs, guardrails, approvals, and trace spans.
- No external runtime libraries or hotlinked visual assets are required.
- No build step is required.
- Training state is stored locally in the browser where supported.
