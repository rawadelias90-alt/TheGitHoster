# Agent API Masterclass Premium Learning Redesign

## Goal
Transform the existing Agent API Masterclass into a premium, modern, self-paced AI academy and agent-building lab while preserving all current learning logic, simulations, bilingual behavior, persistence, and GitHub Pages compatibility.

## Product direction
The experience should feel like a focused SaaS learning product rather than a technical demo. The learning journey becomes: **Academy → Build → Run → Inspect → Design → Code → Master**. The learner should always understand where they are, what they are learning, what they have built, what happened during a run, and what skill to prove next.

## Visual system
- Keep a light, calm base with near-black text, white/warm-grey surfaces, and green as the main product accent.
- Keep semantic secondary colors only where they teach meaning: violet for agent/model, cyan for tools/MCP, orange for orchestration/warning, rose for block/failure.
- Use original local SVG assets and diagrams. Do not hotlink third-party images.
- Use thin borders, soft elevation, compact radii, strong typography, deliberate whitespace, subtle motion, and no decorative gradients or glassmorphism.
- Dark mode remains supported using neutral/slate surfaces.

## Learning Home
Upgrade the existing Learning Home into a premium welcome/continuation surface with:
- concise hero framing and primary CTA,
- overall mastery ring/progress,
- current blueprint summary,
- next recommended mission,
- latest run outcome,
- a visual learning path showing Learn, Build, Run, Inspect, and Master.

## Learn
- Make modules feel like a structured course instead of plain articles.
- Add module progress, concept category, expected outcome, and visual concept cues.
- Add compact “Key idea” and “Try next” learning blocks without changing lesson meaning.
- Keep RTL and mobile behavior intact.

## Builder
- Preserve Describe → Build, Blueprint, Visual/Configuration/JSON/Code mapping, Function Tool Designer, MCP training, approvals, guardrails, session, and structured output.
- Improve hierarchy so the natural-language intent is visually primary and technical configuration progressively reveals below it.
- Add a compact live “Agent architecture” visual that updates from Blueprint state.
- Strengthen selected/configured states and field-to-configuration mapping.

## Simulator
- Present runs as a clear Input → Execution → Output story.
- Make scenario selection and run controls feel like a lab console.
- Improve timeline readability and execution-state feedback.
- Add a compact run summary strip showing status, tools used, approvals, handoffs, and duration.
- Preserve simulated behavior and labels.

## Trace
- Make trace debugging easier to scan through hierarchy, status, duration, and selected-span teaching.
- Add a compact debugging checklist and stronger “Show in Builder” affordance where supported.

## Design / Orchestration
- Retain all existing designer interactions.
- Improve node visuals and add an explainer legend that mirrors current Agents SDK concepts: agents, tools, MCP servers, handoffs, guardrails, approvals, and final output.
- Keep all diagrams explicitly educational/simulated where applicable.

## Code Studio
- Preserve Blueprint synchronization and current verified SDK examples.
- Improve code workspace framing, tab hierarchy, copy actions, and change-diff visibility.
- Keep code horizontally scrollable inside its own panel only.

## Mastery
- Strengthen competency progression with achievement feedback, course path visibility, and recommended next mission.
- Preserve competency-based completion rules; do not revert to visit-based completion.

## Mobile
- Treat mobile as a primary layout.
- One primary learning task per viewport.
- Technical details collapse by default.
- Touch targets remain at least 44px.
- Bottom navigation remains compact and legible.
- No page-level horizontal overflow.

## Accessibility and motion
- Preserve keyboard navigation and focus-visible behavior.
- Respect `prefers-reduced-motion`.
- Maintain readable contrast in light and dark themes.
- Avoid motion that is required to understand state.

## Technical constraints
- Keep vanilla HTML, CSS, and JavaScript.
- Keep GitHub Pages static hosting with relative asset paths.
- No build step, API keys, secrets, external runtime dependencies, or live OpenAI calls.
- Existing IDs and public functions used by the current app should remain stable unless tests are updated deliberately.
- Existing localStorage keys must remain backward compatible.

## Visual research grounding
The redesign is informed by current OpenAI Agents SDK visualization concepts: agent graphs connect agents to tools, MCP servers, and handoffs; traces group spans for model generations, tools, guardrails, and handoffs. Learning-product benchmarking emphasizes prominent progress, clear continuation CTAs, modular course cards, and visible achievement feedback. Final assets remain original and local.

## Definition of done
- All existing core interactions still work.
- New visual assets load from local relative paths.
- JavaScript has no syntax errors.
- No duplicate IDs.
- Light/dark and English/Arabic work.
- Mobile widths have no page-level horizontal overflow.
- Learning Home, Builder, Simulator, Trace, Design, Code, and Mastery receive visible premium upgrades.
- GitHub Pages deploys successfully from the project folder.
