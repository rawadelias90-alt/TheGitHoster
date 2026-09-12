# Administrative

Reusable bilingual static web template for the **Administrative Services Commercial Pack**.

## Project files

- `index.html` — site entry point and proposal content
- `styles.css` — responsive desktop/mobile styling, RTL support, action/status styles, and print rules
- `script.js` — English/Arabic switching, pricing calculations, local draft persistence, Print to PDF, and external form submission
- `README.md` — project, setup, usage, and testing notes

## GitHub Pages

This project is designed to run directly on GitHub Pages with no build step, package manager, framework, or server-side dependency.

All asset paths are relative and all project files remain inside the `administrative` folder.

Pages path:

`https://rawadelias90-alt.github.io/TheGitHoster/administrative/`

## Actions

### Print to PDF

The **Print to PDF** button calls the browser print dialog through `window.print()`.

The print stylesheet hides interactive controls, the status area, the received-requests placeholder, and language controls so the printed/PDF proposal remains clean.

### Save

The **Save** button stores the current draft locally in the browser using `localStorage` under the key `proposalDraft`.

No data is sent externally when Save is used. A saved draft is restored automatically on the same browser/device.

### Submit

The **Submit** button sends the proposal as JSON to a configurable external form service endpoint.

In `script.js`, configure:

```js
const FORM_ENDPOINT='https://your-form-service.example/endpoint';
```

Do not place API keys, access tokens, passwords, or secrets in client-side code. Use only a public submission endpoint intended for browser-based form submissions, such as an endpoint provided by a form service that does not require a client secret.

When `FORM_ENDPOINT` is empty, Submit does not send data and the status area explains that setup is required.

If the selected external service supports retrieving submitted requests safely from a public browser endpoint, the **Received Requests** placeholder can later be connected to that supported endpoint. It is intentionally not connected by default because many form services require authenticated server-side access for reading submissions.

## Status messages

The status area reports:

- saved draft success
- restored draft success
- submit-in-progress state
- successful submission
- missing endpoint configuration
- submission errors

## Local use

Open `index.html` in a browser. No build step is required.

The proposal supports English and Arabic, RTL layout, responsive desktop/mobile views, pricing calculations, local draft saving, browser print/PDF output, and optional external submission.

## Testing

Before publishing or changing the submission endpoint:

1. Open the GitHub Pages URL and confirm `styles.css` and `script.js` load correctly.
2. Test English and Arabic switching and confirm RTL layout in Arabic.
3. Enter sample values in all existing fields and pricing rows.
4. Select **Save**, refresh the page, and confirm the draft restores locally.
5. Select **Print to PDF** and confirm interactive controls and status areas are hidden in print preview.
6. With `FORM_ENDPOINT` empty, select **Submit** and confirm the setup warning appears without sending a request.
7. Configure a test form-service endpoint, submit sample data, and confirm success/error feedback behaves correctly.
8. Check desktop and mobile widths to confirm buttons, form fields, pricing cards, and status areas remain usable.
9. Confirm no credentials, tokens, or secrets are present in the repository or browser source.

## Security

This is a public client-side static site. Anything committed here is visible to users and must be treated as public.

Do not add API keys, access tokens, passwords, credentials, private webhook secrets, or other sensitive values to this folder.

## Reuse

Keep Administrative-specific changes inside this folder. Additional projects can be added later as separate top-level folders in `TheGitHoster` using the same self-contained structure.
