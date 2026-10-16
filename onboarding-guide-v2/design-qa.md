# New Hire Guide V2 design QA

Review date: 16 October 2026. Selected design: revised option 2.

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
- Beforeprint/afterprint expansion and exact restoration, repeated beforeprint events, and suppressed-dialog fallback are covered by automated DOM integration tests. The cloud browser suppresses the native print dialog; clicking Print in that browser restores the original browsing state, verified directly. GitHub Chromium PDF checks passed; all four rendered pages were visually inspected, with short sections and the Completion heading kept together with their text.
- Validation: 53 Node tests and the Vite production build pass. All Python browser regressions passed in GitHub Actions: selection summary, existing guide UI, GCC contracts, the complete catalogue at desktop/mobile widths, fonts, V2 keyboard interactions, nested navigation, reduced motion, PDF completeness and print-state restoration. Application console errors: zero.
- Verified implementation commit: `e6394b56072c0346a45209c0b634797b55ed759a`. Successful run: https://github.com/rawadelias90-alt/TheGitHoster/actions/runs/38972051285. The `guide-v2-review-captures` artifact includes desktop/mobile captures, the generated PDF and browser-check results.

## Findings and comparison history

1. Review found native button/summary destinations received tabindex=-1 after navigation. Added a failing keyboard regression test, fixed the focus handler, and verified passing tests.
2. Review found duplicate root scroll padding plus target scroll margins. Removed the root padding, preserving the established single target offset and the existing browser assertions.
3. Review identified missing accessible descriptions on flipped controls. Added a failing test, wired the revealed copy as the button description, and verified passing tests.
4. Cloud browser suppression of window.print initially left all panels expanded. Added a failing regression, restored state when print returns outside print media, and verified the behavior in the cloud browser.
5. Full-view and focused comparisons after fixes show no actionable P0/P1/P2 visual findings. Supplied banner, requested font change, compact Fluent icons and complete source wording are intentional deviations from the illustrative mock.
6. PDF QA found a case-sensitive heading assertion and a Completion heading split from its paragraph. Normalized extracted text for visual uppercase styling, kept short print sections together, added a pagination regression and visually confirmed the corrected PDF.

## Branch status

- Published to `design/gro-site-refresh` after user approval. Browser regression, PDF completeness and pagination verification are complete.
- No merge to main or live-site publishing settings changed.

final result: passed
