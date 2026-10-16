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

## Scoped banner and catalogue update: 17 October 2026 (Asia/Dubai)

- Source visual truth: `/workspace/scratch/b330fbaf616f/upload/image(20261016-221228).png` (942 x 207 pixels), requesting the banner logo on the left; `/workspace/scratch/b330fbaf616f/upload/image(20261016-205612).png` (414 x 264 pixels), the compact green-card style reference.
- Implementation evidence: `/workspace/scratch/guide-v2-entity-cards-1792189143672.jpg` (1225 x 841 screenshot pixels). Desktop browser viewport measured approximately 1239 x 851 CSS pixels; the screenshot has the browser's approximately 0.989 capture scale. Comparison crops use that scale and preserve aspect ratios. The source banner is a cropped reference rather than a full viewport; its red arrow is an annotation, not interface content.
- Full-view comparison: `/workspace/scratch/b330fbaf616f/qa-final/entity-cards-comparison.png` places both supplied references beside the live catalogue capture. Focused comparison: `/workspace/scratch/b330fbaf616f/qa-final/entity-cards-focused-comparison.png` shows a source tile, the implemented tile and the updated banner together. Different text, tile proportions and four desktop columns are intentional to fit service names and entity grouping.
- State: Explore services, All locations / All services, panels collapsed. Groups contain 7 Abu Dhabi, 6 Dubai, 7 Al Ain and 7 Dubai South (DWC) service tiles. Mainland GCC variants remain choices inside one GCC tile per entity.
- Fonts/typography: Playbook Arial body and Segoe UI controls preserved. White bold centered titles and compact descriptors wrap completely, matching the reference's hierarchy.
- Spacing/layout: logo aligns with the banner title's left edge; on mobile it remains above the title without overlap. Entity headings group compact tiles in four columns on desktop, two on tablet and one on mobile. Open tiles expand across the group width so service information stays readable.
- Colors/tokens: the existing #008768 flat green, white icons/type and 4px corners match the supplied green cards. No hover movement or shadows added.
- Image quality/assets: original skyline and AECOM logo preserved. The catalogue reuses the same licensed external Fluent document/person icons. All tile icons loaded successfully.
- Copy/content: service names, descriptors, outcomes, supporting details, actions and every route preserved. Entity names appear once as group headings instead of repeating on every tile. `services.js` remains unchanged.
- Interaction checks: entity/service filtering, keyboard Enter to expand, Mainland GCC status choices and navigation to the existing-UID service, mobile DWC GCC expansion and full-service navigation. Native details keep independent state. No desktop/mobile horizontal overflow. Application console errors: zero; unrelated browser-extension metadata errors excluded.
- Comparison history: the first catalogue pass used left-aligned text-only tiles. After comparing with the supplied small-card reference, tiles were changed to centered white icons/titles with a four-column desktop layout; the focused post-fix comparison confirms the requested style. No actionable P0/P1/P2 findings remain.
- Local checks: all 53 Node tests and the production build pass. Implementation commit: `8c9c162535302f8a0bf708570e82daecef4af54a`.
- Full regression passed: https://github.com/rawadelias90-alt/TheGitHoster/actions/runs/38974960291, including every catalogue route at desktop/mobile widths, existing UI, GCC sequence, selection summary, fonts, V2 interactions, PDF completeness and state restoration, and the production build.
- Deployment remains pending; the update is on `design/gro-site-refresh`.

## Final deployment adjustment: 17 October 2026 (Asia/Dubai)

- User requested the logo back on the banner's upper-right corner and deployment through the existing repository. The logo uses `right: 0` again; the compact green catalogue tiles and entity groups remain intact.
- All 53 local tests and the production build pass after this adjustment. The complete preceding browser/PDF regression passed in run 38974960291. No service rules or route content changed.
- Browser inspection confirms the logo's right edge aligns with the banner container. The earlier left-logo evidence records the previous iteration and is superseded by this explicit request.

## Inset Abu Dhabi banner: 17 October 2026 (Asia/Dubai)

- Visual reference: `/workspace/scratch/b330fbaf616f/upload/image(20261016-223920).png` (1791 x 429 pixels). Only its centered rounded banner treatment is in scope; its Playbook wording and page body are not replacements for this guide.
- Image source: `/AECOM material/GRO Banner - Abu Dhabi.png`, materialized from the specified AECOM material folder. The 2172 x 724 image is copied unchanged into `assets/abu-dhabi-banner.png`; SHA256 `c9e6648b97e6a229096d2edb1139dcfb5b95f75f3ccf7ca730f695318c043875`.
- Browser evidence: `/workspace/scratch/new-hire-abu-dhabi-banner-1792190967322.jpg` (1239 x 851 pixels, matching the desktop CSS viewport at density 1). Full-view comparison: `/workspace/scratch/b330fbaf616f/qa-final/abu-dhabi-banner-comparison.png`; focused comparison: `/workspace/scratch/b330fbaf616f/qa-final/abu-dhabi-banner-focused.png`. Both compare the source and rendered implementation together; focused crops are normalized to 980px wide. The reference banner is approximately 980 x 327; the implementation is intentionally shorter at 980 x 220 as requested.
- Layout/spacing: 980px maximum width, centered white side margins, 24px top margin and 18px rounded corners. Mobile uses 16px side margins and 14px corners, with a 210px minimum height. Logo remains upper right; text does not overlap it. No desktop/mobile horizontal overflow.
- Fonts/colors/assets: existing Playbook Arial/Segoe UI typography and white text retained. The supplied Abu Dhabi image provides the approved teal treatment, with a crop preserving the skyline. Original image quality is retained; no generated or replacement artwork is used.
- Copy/content: guide title, subtitle, all service information and grouped green cards remain intact. Only banner presentation and the expected image in the existing browser regression changed.
- Checks: all 53 local tests and production build pass. Cloud browser verifies the 1239 x 851 desktop view and 390 x 844 mobile view, plus catalogue entry and all four entity groups. No application console errors; unrelated extension metadata errors excluded. No actionable P0/P1/P2 findings in the first visual comparison; no further visual iteration required.

## UAE map banner and welcome actions: 17 October 2026 (Asia/Dubai)

- Visual sources: attached `image(20261016-225650).png` (2048 x 705) for the banner artwork and annotated `image(20261016-225859).png` (1502 x 582) for the welcome layout. The red line is an alignment annotation, not interface content.
- The supplied image is copied unchanged to `assets/uae-map-banner.png`; SHA256 `dfbcc1bd0e61402f394aae6994e442df9580e7970cdf579218315178146b3a3b`. Its embedded AECOM logo remains upper right; the previous separate logo is removed to avoid duplication. Right/top cropping keeps the embedded logo visible on mobile. A restrained lower gradient improves white-text contrast.
- Full comparison board: `/workspace/scratch/b330fbaf616f/guide-prototype/qa-final/map-banner-actions-comparison.png` contains both sources and both browser views together. Sources and captures retain their aspect ratios; the board scales them to a 680px maximum width. Desktop evidence: `/workspace/scratch/new-hire-map-actions-desktop-1792192017.jpg`, 1239 x 851 screenshot pixels matching its CSS viewport. Mobile evidence: `/workspace/scratch/new-hire-map-actions-mobile-1792192017.jpg`, 1225 x 841 screenshot pixels at approximately 0.989 capture scale, containing a 390 x 844 CSS-pixel iframe.
- Layout: banner stays centered at a maximum 980 x 220px with rounded corners. Welcome buttons align with its left edge, 20px beneath it. The duplicate visible title beneath the banner is removed. The banner title is now the accessible welcome heading and receives focus when returning home. Mobile buttons stack without horizontal overflow.
- Typography/colors: existing Playbook Arial and Segoe UI settings, flat #008768 controls, restrained borders and white page background preserved. Title/subtitle remain legible without overlap or truncation. All service rules, copy and grouped catalogue cards are unchanged.
- Browser checks: desktop guided entry and return-home heading focus; mobile Explore all services opens the catalogue with all four entity groups; 390px layout has no horizontal overflow. No application console errors; unrelated extension metadata errors excluded.
- Regression follow-up: the first workflow stopped at an older landing-page assertion that expected the removed separate logo. Updated that existing check to verify the new branded banner asset; the rendered logo remains part of the supplied artwork.
- Comparison history: initial mobile inspection found white title text crossing a brighter map area. Added the lower gradient, inspected both views again, and confirmed readable text with no actionable P0/P1/P2 findings. All 53 Node tests and the production build pass. The existing browser asset/heading assertion was updated for the new artwork and single welcome heading.

## Location banners for selected services: 17 October 2026 (Asia/Dubai)

- Scope: the approved location-banner plan applies to the full selected service view reached through either the guided journey or catalogue. The homepage retains its UAE map artwork, title and welcome buttons. Compact entity-grouped catalogue tiles and all service rules remain unchanged.
- Source images: the current `GRO Banner - Abu Dhabi.png`, `GRO Banner - Dubai.png`, `GRO Banner - Dubai South.png` and `GRO Banner - Al Ain.png` from `/AECOM material/`. Images are copied unchanged, with no generated replacements. They have no embedded logos; the existing white AECOM logo is used once in the service banner's upper right. Dimensions are 2172 x 724, except Dubai South at 2170 x 725.
- Asset SHA256: Abu Dhabi `c9e6648b97e6a229096d2edb1139dcfb5b95f75f3ccf7ca730f695318c043875`; Dubai `f8a2ad1c29642953b5331a93f926bb29ae009197a6eba541c190019d2e54821a`; Dubai South `df9444858e6adee15debaa3f98176cf133ea44ba5ef72f16f2dc84c3af265191`; Al Ain `362dbbd6a36736b2c19058ee9bd6dc94b3fb53f9e83fee4306370a2859c395d4`.
- Combined source/implementation comparison: `/workspace/scratch/b330fbaf616f/qa-final/location-banners-comparison.png` shows all four sources with corresponding desktop and mobile component crops, preserving aspect ratios. Desktop full-view captures are `/workspace/scratch/location-banner-ad-desktop-1792193077.jpg`, `location-banner-dubai-final-1792193077.jpg`, `location-banner-dwc-final-1792193077.jpg` and `location-banner-alain-desktop-1792193077.jpg`. Mobile captures use `ad-mobile-final`, `dubai-mobile`, `dwc-mobile` and `alain-mobile` with the same prefix/suffix.
- Capture geometry: desktop viewport 1239 x 851 CSS pixels, document width 1225px after its vertical scrollbar; screenshots 1225 x 841px at approximately 0.989 capture scale. Mobile uses a 390 x 844 CSS-pixel iframe, with 376px document width after its scrollbar. Source art is a standalone image, so comparison focuses on artwork, crop and approved banner treatment rather than treating source pixels as an entire UI screenshot.
- Typography/colors/layout: Playbook Arial and Segoe UI remain unchanged. Rounded 220px desktop and minimum 230px mobile service banners use white title/location text and the existing contrast-overlay treatment. Title and location are editable UI text; descriptive metadata, Change selection and Print remain below the image. The global UAE banner is hidden in result mode and restored in the other views. No duplicate main banner appears in a service view.
- Interaction review: all four entities selected in the guided journey; repeated Change selection updates the artwork correctly. Desktop Dubai and Dubai South, plus mobile Dubai South, opened from the catalogue. Home navigation restores the original welcome banner and both entry buttons. All four mobile crops were inspected, including the longer Relative / Family Visa Work Permit title. No horizontal overflow, clipping of text or overlap with the logo. Application console errors: zero; extension metadata errors excluded.
- Print: decorative location artwork, overlay and logo are hidden in print CSS, while the service title and location stay black on white. Existing PDF regression now also checks the service title/location. Existing catalogue regression checks the banner and location for every route at desktop/mobile widths.
- Comparison history: the first Dubai crop cut the Burj Khalifa tip, and narrow metadata wrapped its separator onto a new line. Adjusted desktop focal positions for Dubai and Dubai South, and removed the mobile separator while keeping all metadata. Re-inspected final crops and full views. No actionable P0/P1/P2 findings remain.
- Local verification: all 53 Node tests and the production build pass; no service content or rules changed. Full browser/PDF regression is the release check.

## Corrected artwork fitting: 17 October 2026 (Asia/Dubai)

- User review sources: `image(20261016-234249).png` (1670 x 344, Dubai South), `image(20261016-234319).png` (1427 x 372, Dubai), `image(20261016-234345).png` (1431 x 365, Al Ain) and `image(20261016-234412).png` (1395 x 297, Abu Dhabi). This correction supersedes the previous conclusion that the cropped Dubai, Dubai South and Al Ain artwork was acceptable.
- Cause: approximately 3:1 image assets were enlarged with cover into a roughly 6:1 desktop header. Position changes preserved one landmark edge while cutting other important portions. The approved Abu Dhabi composition is explicitly protected.
- Corrected desktop/tablet: the three affected images keep their natural proportions and fit against the right edge, at 660 x 220px for Dubai/Al Ain and approximately 658 x 220px for Dubai South. The left image edge fades into the existing teal background. The full Burj Khalifa and skyline base, Dubai South building and Al Ain stadium/foreground remain visible. Existing banner dimensions, type and upper-right logo remain intact.
- Corrected mobile: at 760px and below, the complete artwork sits above the service location/title in the same rounded teal card. Image height follows its original aspect ratio; the title block grows with its content. Abu Dhabi continues to use its prior mobile composition.
- Before/after comparison: `/workspace/scratch/b330fbaf616f/qa-final/banner-fit-before-after.png` presents all four supplied screenshots beside the corrected desktop and mobile banners. Supplied references are viewport crops, scaled proportionally; implementation component crops are normalized while retaining their aspect ratios. Tablet evidence: `/workspace/scratch/b330fbaf616f/qa-final/banner-fit-tablet-review.png`. All final captures were inspected with matching service title/location states; earlier captures showing an unpainted transition were replaced.
- Capture geometry: desktop viewport 1239 x 851 CSS pixels; final screenshot 1225 x 841 pixels at approximately 0.989 capture scale. Mobile iframe 390 x 844 CSS pixels; tablet iframe 900 x 900. Actual content widths exclude each frame's vertical scrollbar. Screenshots live under `/workspace/scratch/banner-fit-*-1792195200.jpg`.
- Protected surfaces: the Abu Dhabi desktop banner crop has a mean pixel difference of 0.0 against the previous implementation capture. Its fitting remains cover on desktop/tablet/mobile. The homepage UAE map banner and its entry actions were checked after returning home and remain unchanged. All original artwork bytes, app markup, service content and business rules are unchanged.
- Interaction/quality: all four locations switched correctly; every image loaded; no horizontal overflow at desktop, tablet or mobile sizes. Service titles, location labels and logos remain legible. Existing Playbook fonts, controls, entity grouping and green cards remain intact. No application console errors; browser-extension metadata errors excluded. Print hides decorative images and blend layers and removes mobile title padding, preserving the service title/location on white.
- Iteration: the first fitted desktop pass left a visible image-edge seam. Replaced the whole-banner blend with an image-local fade and reviewed the corrected full views and combined comparison. The final images show complete landmarks without a hard seam. No actionable P0/P1/P2 findings remain.
- Verification: all 53 Node tests passed; final production build and whitespace checks passed. The existing full browser/PDF regression is the release check.

final result: passed
