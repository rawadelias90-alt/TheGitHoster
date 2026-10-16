# New Hire Guide V2 design QA

Review date: 17 October 2026. Selected design: revised option 2.

## Visual evidence

- Source visual truth: `/workspace/scratch/b330fbaf616f/generated_images/exec-f738e87f-8000-42a3-a444-f11e1c6f7a93.png`.
- Supplied banner: `assets/dubai-skyline-banner.png`; byte-identical to the user attachment.
- Browser-rendered full-view comparison: `/tmp/guide-v2-qa/full-comparison-final.png` in the cloud browser filesystem.
- Focused tile comparison: `/tmp/guide-v2-qa/card-comparison.png` in the cloud browser filesystem.
- Mobile rendered evidence: `/tmp/guide-v2-qa/mobile-flipped.png` in the cloud browser filesystem.
- Desktop comparison uses the source image and live implementation together. Both content frames are 1487 x 1058 CSS pixels at density 1, displayed at the same 0.42 scale. Focused tile comparison uses unscaled crops from those same frames. Mobile iframe viewport is 390 x 844 CSS pixels, density 1.
- Matching comparison state: Dubai local Employment Visa, all overview cards closed, Documents open and Pre-Hire Readiness closed. The initial reading state opens Pre-Hire Readiness.

## Required fidelity surfaces

- Typography: Arial body and Segoe UI controls match the supplied Playbook code. Their size and weight intentionally replace the mock's AECOM Sans-like type. Text remains readable and wraps without truncation.
- Spacing/layout: full-width service details, horizontal desktop journey navigation, three equal flat tiles, two-column documents, independent expandable rows. Mobile stacks tiles and uses a collapsible journey menu. No horizontal overflow at 390px.
- Colors: flat tile color #008768 sampled from the supplied GRO quick-links reference. White surfaces, dark text, restrained dividers; no hover lift or shadows.
- Assets: original supplied skyline is sharp and correctly cropped; supplied repository AECOM logo remains legible. Icons are external, unmodified Microsoft Fluent SVG assets with license included. Their compact size is consistent with the GRO quick-link reference.
- Copy/content: services.js is byte-unchanged from current main. Every catalogue case retains every GRO step, required/conditional documents and candidate actions. Complete source wording is preserved instead of the mock's shortened illustrative list.

## Interaction evidence

- Cloud browser: guided selection, desktop horizontal navigation, keyboard Enter and click flips, three cards staying open independently, mobile 390px layout, expanding nested journey targets, mobile menu closing after navigation, and visible Print control checked.
- Expanded cards expose their explanatory copy through aria-describedby. Native focusable controls retain keyboard Tab access after journey navigation.
- No application console errors observed. Browser extension metadata errors are unrelated to guide code.
- Beforeprint/afterprint expansion and exact restoration, repeated beforeprint events, and suppressed-dialog fallback are covered by automated DOM integration tests. The cloud browser suppresses the native print dialog; clicking Print in that browser restores the original browsing state, verified directly. Native printed/PDF pagination still requires the prepared GitHub browser regression or a normal desktop print preview.
- Local validation: 53 Node tests pass; Vite production build passes with all required static assets. Existing browser regression scripts were adapted to expand content for legacy visible-content assertions. Full Python browser/PDF regression is prepared but was not run locally.

## Findings and comparison history

1. Review found native button/summary destinations received tabindex=-1 after navigation. Added a failing keyboard regression test, fixed the focus handler, and verified passing tests.
2. Review found duplicate root scroll padding plus target scroll margins. Removed the root padding, preserving the established single target offset and the existing browser assertions.
3. Review identified missing accessible descriptions on flipped controls. Added a failing test, wired the revealed copy as the button description, and verified passing tests.
4. Cloud browser suppression of window.print initially left all panels expanded. Added a failing regression, restored state when print returns outside print media, and verified the behavior in the cloud browser.
5. Full-view and focused comparisons after fixes show no actionable P0/P1/P2 visual findings. Supplied banner, requested font change, compact Fluent icons and complete source wording are intentional deviations from the illustrative mock.

## Remaining verification

- Run the GitHub browser regression, including PDF completeness and pagination, after the branch can be pushed.
- No merge to main or live-site publishing settings changed.

final result: passed
