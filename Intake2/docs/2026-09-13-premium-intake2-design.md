# Intake2 Premium Intake Experience — Design Specification

Date: 2026-09-13
Status: Approved design direction, pending implementation-plan approval
Project: `Intake2`

## 1. Objective

Transform the existing Intake2 static prototype into a premium, interactive new-hire employment visa and work permit intake experience that is easier to understand, complete, validate, review, and submit.

The redesigned experience must:

- preserve the existing Intake2 front-end-only prototype boundary;
- preserve existing non-conflicting fields, guarded-submit simulation, in-memory draft behavior, retry protection, and GitHub Pages compatibility;
- use the supplied `Branching Logic Access Request 1(4).docx` and `Document Collection Form(2).pdf` as the authoritative business-logic source where they conflict with the current prototype;
- preserve all source fields, routes, document requirements, applicability notes, and branching instructions without silently inventing missing business rules;
- use no green anywhere in the interface or bundled visual assets;
- remain fully contained within the existing `Intake2/` folder and use only relative paths;
- contain no secrets, API keys, production identifiers, or live service integrations.

## 2. Source authority and conflict rules

### Primary source authority

The two supplied business documents define the target intake content and routing:

1. `Branching Logic Access Request 1(4).docx`
2. `Document Collection Form(2).pdf`

Where either source conflicts with the current Intake2 prototype, the supplied documents win.

### Current prototype preservation

Current Intake2 behavior is retained when it does not conflict with the supplied sources, including:

- browser-memory draft state;
- back/next navigation with retained entries;
- no server write before final Submit;
- multiple-file staging behavior;
- guarded submission state;
- simulated request ID creation only at Submit;
- retry reuse of the same simulated request ID;
- confirmation only after the simulated submission sequence succeeds;
- responsive and reduced-motion behavior;
- current-only fields that are not contradicted by the supplied sources, including Employment Start Date.

### No unsupported inference

The implementation must not invent route rules that are not supported by the supplied documents. In particular:

- do not retain the current prototype assumption that `Yes = Case A` and `No = Case B` unless the source explicitly establishes that mapping;
- the exact source question `STOP & CONFIRM – Does this request fall under CASE A or CASE B?` remains a Yes/No control;
- both answers continue to the Special Hire Case section because the branching schema states that all answers proceed to Section 9;
- all applicable service routes continue to Certificate of Equivalency & Education Details because the supplied branching schema routes Sections 5–9 to Section 10;
- do not hide or skip source-required fields based on assumptions not stated in the sources.

## 3. Recommended experience architecture

Use the approved adaptive guided-journey approach.

### User journey

1. Welcome / Start
2. Candidate Personal Information
3. Main Required Documents
4. Visa Type
5. Applicable Service Route
6. Certificate of Equivalency & Education Details
7. Additional Supporting Documents
8. Review & Readiness
9. Confirmation

The interface may present these as user-friendly progress labels while preserving the underlying source section names and field labels.

### Why this structure

The source form is long and highly conditional. Showing every possible document requirement at once would create unnecessary density. The adaptive journey should show the user only the route-specific block that applies after Service Type is selected, while keeping common sections consistent for every route.

## 4. Candidate Personal Information

Preserve and implement the supplied candidate fields:

1. Candidate Full Name
2. Nationality
3. Country of Birth
4. Mobilizing From
   - Overseas Hire
   - Local Hires
5. Unified Number (UID)
6. Last Working Date with Current Employer
7. Religion
   - preserve the source option set from the supplied form, including the listed Muslim, Christian, Hinduism, Buddhism, Baha'i, Sikhism, and Non-Religious values/variants;
8. Mother’s Name
9. Marital Status
   - Single
   - Married
   - Divorced
   - Widowed
10. Candidate’s Personal Email Address
11. Candidate’s Contact Number
12. Select Visa Sponsorship Location
   - AECOM Middle East Limited – Abu Dhabi
   - AECOM Middle East Limited – Dubai
   - AECOM Middle East Limited – Al Ain
   - AECOM Middle East Limited – DWC

Retain current non-conflicting Employment Start Date as an additional Intake2 field.

### Field guidance to preserve

Use source guidance as inline helper text rather than long paragraphs. Examples include:

- Candidate Full Name should match the verified passport copy.
- Nationality guidance should use country/nationality wording as shown in the source.
- Mother’s Name should match the passport where applicable.
- Contact number guidance should show home-country and local UAE formatting examples.

## 5. Main Required Documents

Create a structured document checklist with one card/row per source requirement:

1. Passport_copy
2. MOHRE_Verified_Photo
3. Education certificate attested by MoFA in the UAE
4. Police Clearance Certificate (PCC)
5. Emirates_ID_Copy
6. Visa_Residency_Copy
7. External_Cover_Passport
8. Offer of Employment

### Document UX

Each document requirement should show:

- exact source label;
- required/applicable state;
- short source-derived helper text;
- accepted file types where specified;
- file-count limit where specified;
- single-file size limit where specified;
- staged-file name and size;
- replace/remove action;
- completion state shown with icon + text, not color alone.

### Applicability guidance

Preserve source applicability notes, including:

- Emirates ID Copy: if applicable;
- Visa Residency Copy: if applicable;
- External Cover Passport: required only for AECOM Dubai & DWC candidates;
- Education certificate note regarding UAE MoFA attestation and the source consequence if not attested;
- Offer of Employment: signed AECOM contract;
- MOHRE Verified Photo: use the same photo verified by MOHRE.

Do not invent additional applicability rules.

## 6. Visa Type and branching

The Service Type control must use the exact six routes in the source:

1. Employment Visa & Work Permit
2. Work Permit for Relative Visa Holders
3. Work Permit for Golden Visa Holder
4. Work Permit for Emirati National
5. Work Permit for GCC National
6. Work Permit for Diplomatic Passport Holder

Selecting a service should immediately update a compact `Your route` preview showing the sections/documents that will follow.

The current generic `Other / non-EV service` option must be removed because it conflicts with the authoritative source choices.

## 7. Route-specific requirements

### Employment Visa & Work Permit

Show the source IMPORTANT NOTE with a concise visual callout containing the Case A and Case B criteria from the supplied PDF, without changing the criteria text or inventing a Yes/No-to-case mapping.

Then ask exactly:

`STOP & CONFIRM – Does this request fall under CASE A or CASE B?`

Options:

- Yes
- No

Both answers proceed to the source Special Hire Case requirements:

- Copy of the National ID Card issued in Home Country
- Confirmation that the candidate has been informed of the requirement to complete the medical test in the home country — Yes
- Confirmation that following issuance of the medical results the candidate is required to submit the original passport to the UAE Embassy in the home country — Yes

### Work Permit for Relative Visa Holders

Require the source route documents:

- Sponsor's passport copy
- Sponsor's residence visa
- Sponsor's Emirates ID
- NOC letter

Preserve the NOC note that it is from the current visa sponsor.

### Work Permit for Golden Visa Holder

Require:

- Copy of Golden Visa

### Work Permit for Emirati National

Show the Section 7 route requirements:

- Family book
- Medical test result
- National ID

### Work Permit for GCC National

Use the same Section 7 requirements because the branching schema routes both Emirati National and GCC National to Section 7:

- Family book
- Medical test result
- National ID

Preserve any source applicability notes shown in the supplied form, including that Family Book is for Emirati candidates only; do not invent a replacement GCC-specific document.

### Work Permit for Diplomatic Passport Holder

Require:

- NOC Letter
- Approval from Embassy

Preserve source applicability wording where shown.

## 8. Certificate of Equivalency & Education Details

After each applicable route, show:

1. Is Certificate of Equivalency Available?
   - Yes
   - No
2. Upload the Education Details Form
3. Upload Certificate of Equivalency

The implementation must not reuse the current prototype rule that only Case B sees Certificate of Equivalency. The attached branching schema sends all routes to this section.

Preserve the source upload guidance:

- Education Details Form: Word file where specified;
- Certificate of Equivalency: scanned copy where specified.

Do not invent hide/show logic based on the Yes/No equivalency answer unless the source explicitly supports it.

## 9. Additional Supporting Documents

Show the final optional/additional source upload area:

- Upload Additional Supporting Documents

Preserve the source purpose statement that this area is for additional supporting documents if required, along with the documented file-count/type guidance.

## 10. Review & Submission Readiness

Replace the current plain review grid with a readiness-focused review page.

### Review sections

- Candidate Information
- Main Required Documents
- Selected Service Route
- Route-Specific Requirements
- Education / Equivalency
- Additional Supporting Documents

Each section must show:

- completion indicator;
- missing required items count;
- `Edit` action returning directly to the relevant step;
- entered values or staged filenames;
- applicability notes where relevant.

### Readiness summary

A top summary card should show:

- selected service type;
- current route;
- completed required fields / total required fields;
- completed required documents / total required documents;
- missing items count;
- `Ready to submit` or `Action required` status.

Submit remains disabled while required data for the active route is missing or invalid.

Retain the current guarded-submit simulation and retry test control, but visually move prototype-only test controls away from the normal user path, for example inside a small `Prototype test tools` disclosure.

## 11. Validation behavior

Validation must be clear, contextual, and non-destructive.

### Rules

- validate required controls before moving forward;
- show inline error text beside the affected control;
- show a short top-level error summary only when multiple fields are incomplete;
- keep user-entered values intact after validation failure;
- mark invalid controls with icon, text, and border treatment rather than color alone;
- validate email format and required selections using browser-safe front-end rules;
- use conditional requiredness only where the source explicitly establishes applicability;
- re-calculate route completion whenever Service Type, Sponsorship Location, or an applicability-driving field changes;
- when a route changes, remove stale route-only staged data from the active submission state only after a clear confirmation if the user had already added information to that route.

## 12. Draft and state model

Maintain one in-memory draft state with explicit sections:

- `candidate`
- `mainDocuments`
- `service`
- `route`
- `education`
- `additionalDocuments`
- `submittedRequest`
- `isSubmitting`

No SharePoint, Power Automate, email, API, local storage, or network write is introduced as part of this prototype redesign.

Document File objects or safe metadata may remain staged in browser memory only for the active session.

## 13. Visual design system

### Color direction

No green is permitted.

Use a restrained professional palette such as:

- Ink / near-black: primary text
- White: primary surfaces
- Cool gray: secondary surfaces and borders
- Deep navy: primary brand/action color
- Clear blue: active progress and links
- Violet: secondary accent and route visualization
- Warm amber/orange: warnings, special notes, and attention states
- Red: errors only

Success states should use navy/blue/violet treatment with a check icon and explicit text rather than green.

### Typography

Use a clean system-first stack centered on Segoe UI for compatibility with the Microsoft/AECOM work context.

### Components

- spacious white cards with thin cool-gray borders;
- 10–14px corner radii, not oversized pill-heavy UI;
- strong page title and short supporting copy;
- compact labels and source-derived helper text;
- segmented/radio-card controls for short option sets;
- native select/searchable-style presentation for long option sets such as Religion;
- document cards with simple file-state icons;
- route preview card after Service Type selection;
- sticky desktop readiness panel where space permits;
- sticky compact mobile progress bar.

## 14. Professional visual assets

All runtime assets must be stored locally under `Intake2/assets/` and referenced with relative paths.

Recommended asset set:

- abstract UAE employment mobility hero illustration using passport/document/work-permit/route motifs;
- local SVG icon set for candidate, passport, document, route, education, review, warning, upload, complete, and edit states;
- subtle document/workflow background geometry;
- small branch/route diagram used on the Service Type step.

Avoid official UAE government marks, ministry logos, national-emblem imitation, or visuals that could imply the prototype is an official government service.

Use appropriately licensed open-source vectors/icons or original locally created SVG assets. Record any third-party attribution/license in the Intake2 README if used.

## 15. Motion and micro-interactions

Use subtle, functional motion only:

- 150–220ms screen/section transitions;
- conditional-field reveal/collapse;
- progress completion animation;
- upload-card state transition;
- readiness count updates;
- button loading state on Submit.

Respect `prefers-reduced-motion` and keep all motion optional to comprehension.

## 16. Responsive behavior

### Desktop

- max content width around 1180–1240px;
- main form column plus optional compact readiness/route panel;
- two-column field layout only where fields remain readable;
- progress navigation visible without horizontal scrolling.

### Mobile

- single-column form;
- sticky compact progress indicator;
- touch targets at least 44px high;
- route/readiness panel collapses into a summary card;
- upload controls remain full-width;
- primary Next/Submit action stays easy to reach;
- no dense two-column review rows.

## 17. Accessibility

Target WCAG 2.2 AA behavior where practical for the static prototype.

Requirements:

- semantic headings and landmarks;
- explicit labels for all form controls;
- keyboard-operable controls;
- visible focus states;
- no color-only meaning;
- sufficient contrast;
- `aria-live` for status/submission feedback;
- error text linked to controls where appropriate;
- reduced-motion support;
- meaningful button names;
- route changes announced where appropriate.

## 18. File architecture

Keep all implementation files under `Intake2/`.

Expected structure:

```text
Intake2/
  index.html
  styles.css
  script.js
  README.md
  assets/
    ...local svg/image assets...
  docs/
    2026-09-13-premium-intake2-design.md
```

The existing three-file runtime architecture may remain if it stays maintainable. If JavaScript becomes too large, split only when needed into focused relative modules inside `Intake2/`; do not introduce a framework or build tool solely for this redesign.

## 19. Testing strategy

### Functional route tests

Test at least one complete path for each source Service Type:

- Employment Visa & Work Permit
- Relative Visa Holder
- Golden Visa Holder
- Emirati National
- GCC National
- Diplomatic Passport Holder

For Employment Visa & Work Permit, test both Yes and No answers to the source STOP & CONFIRM question and confirm both continue according to the supplied branching schema.

### Validation tests

Verify:

- required candidate fields;
- required main documents;
- sponsorship-location applicability for External Cover Passport;
- route-specific document requirements;
- education/equivalency section availability for every route;
- missing-item count;
- Submit disabled until ready;
- invalid email handling;
- back/forward draft retention;
- route-change stale-data protection;
- duplicate-submit protection;
- simulated upload-failure retry reuses request ID.

### UX/QC tests

Verify:

- no green pixels/styles/assets are intentionally used;
- desktop layout;
- mobile layout;
- keyboard navigation;
- focus visibility;
- reduced motion;
- GitHub Pages relative paths;
- no external secrets/API keys;
- no production calls;
- no changes outside `Intake2/`.

## 20. Definition of done

Implementation is complete when:

1. every supplied candidate field is represented;
2. every supplied baseline document is represented;
3. all six source Service Types are implemented;
4. every source route reaches the correct route-specific requirements;
5. Employment Visa & Work Permit includes the source IMPORTANT NOTE, Yes/No STOP & CONFIRM control, and Special Hire requirements;
6. Certificate of Equivalency & Education Details is reachable for all source routes as documented;
7. Additional Supporting Documents is included;
8. review/readiness accurately reflects the active route and missing requirements;
9. existing non-conflicting prototype behavior is preserved;
10. no green is used;
11. mobile and desktop experiences are responsive and accessible;
12. all files remain inside `Intake2/` and use relative paths;
13. no secrets/API keys/live production integrations are introduced;
14. the site works from the existing GitHub Pages folder URL;
15. README documents structure, logic source, asset attribution if applicable, preview instructions, and prototype boundaries.
