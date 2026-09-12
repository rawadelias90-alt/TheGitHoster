# Agent API Masterclass

Interactive, bilingual educational lab for learning how OpenAI agents are described, configured, simulated, inspected, debugged, and represented in code.

## Purpose

This project is a self-contained training experience. It teaches current OpenAI Agents SDK and Responses API concepts while clearly labeling local simulations and training representations. It does not contain API keys, secrets, or live OpenAI credentials.

## Structure

- `index.html` — project entry point and page structure.
- `styles.css` — responsive visual system, Light/Dark Mode, RTL, Builder, Simulator, Trace, Design, Code Studio, and learning UI styles.
- `app.js` — bilingual content, local persistence, Blueprint synchronization, simulation logic, approvals, traces, orchestration, missions, and Code Studio behavior.
- `README.md` — project notes and preview instructions.

All project assets use relative paths so the site can be hosted from this folder without affecting other projects in the repository.

## Preview

### GitHub Pages

When GitHub Pages is serving the repository root from `main`, open:

`https://rawadelias90-alt.github.io/TheGitHoster/agent-api-masterclass/`

### Local preview

From the repository root, run any simple static server, for example:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/agent-api-masterclass/`

A static server is preferred over opening `index.html` directly because it more closely matches GitHub Pages behavior.

## Notes

- No build step is required.
- No secrets or API keys are required.
- Training state is stored locally in the browser where supported.
- The project is intentionally isolated from the sibling `administrative/` project.
