# Intake2

A standalone browser prototype of the documented **New Hire Intake** Power Apps journey.

## Purpose

Intake2 translates the sanitized logic recorded in `rawadelias90-alt/Intake-Power-Apps` into a static GitHub Pages prototype for review and interaction. It is intentionally front-end only and does not connect to SharePoint, Power Automate, email, or any production service.

## Structure

- `index.html` — entry point and six-stage intake UI.
- `styles.css` — responsive styling and layout.
- `script.js` — shared draft state, branching, validation, document staging, review, guarded Submit simulation, and retry protection.
- `README.md` — project notes and preview instructions.

All paths are relative so the project can run from its repository subfolder.

## Implemented flow

1. Start / Welcome
2. Candidate Details
3. Visa Details
4. Documents
5. Review
6. Confirmation

### Core logic mirrored from the Power Apps documentation

- Candidate, Visa, Documents, and Review use one shared in-memory draft.
- Moving between screens does not create or persist a request record.
- **Special Hire Case** appears only when Service Type is **Employment Visa & Work Permit**.
- **Case A** = Special Hire Case `Yes`.
- **Case B** = Special Hire Case `No`.
- There is no Standard case.
- **Certificate of Equivalency** appears only for Employment Visa & Work Permit + Case B.
- Multiple documents can be staged before Submit.
- Submit is disabled while required Candidate or Visa fields are invalid or a submission is in progress.
- The prototype creates one simulated request ID on Submit and reuses it on retry.
- A prototype test control can simulate document upload failure so retry / duplicate protection can be reviewed.
- Confirmation is shown only after the simulated request + upload sequence succeeds.

## Prototype boundaries

This site is for interaction and flow review only. It does **not**:

- write to the `Visa Requests` SharePoint list;
- upload to `NH_Documents`;
- run `New Hire Intake - Upload to NH Documents`;
- contain credentials, API keys, employee submissions, government identifiers, or production documents;
- prove the pending end-to-end UAT of the live Canvas app.

The `Other / non-EV service` option is a neutral prototype path used only to exercise the documented visibility rule that Special Hire Case is shown exclusively for Employment Visa & Work Permit. It is not intended to represent a production SharePoint choice value.

## Preview

With GitHub Pages serving the repository from the current branch/root configuration, open:

`https://rawadelias90-alt.github.io/TheGitHoster/Intake2/`

For local preview, serve the repository root or this folder with any static web server and open `Intake2/index.html`. No build step or dependency installation is required.
