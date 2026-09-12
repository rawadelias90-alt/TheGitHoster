# Administrative

Reusable bilingual static web template for the **Administrative Services Commercial Pack**.

## Project files

- `index.html` — site entry point and proposal content
- `styles.css` — responsive desktop/mobile styling, RTL support, and print rules
- `script.js` — English/Arabic switching, pricing calculations, local draft persistence, and UI behavior
- `README.md` — project and hosting notes

## GitHub Pages

This project is designed to run directly on GitHub Pages with no build step, package manager, framework, or server-side dependency.

The site uses relative asset paths, so the `administrative` folder remains self-contained when served as a project subpath.

Pages path:

`https://rawadelias90-alt.github.io/TheGitHoster/administrative/`

## Local use

Open `index.html` in a browser. The proposal supports English and Arabic, RTL layout, responsive desktop/mobile views, proposal pricing calculations, local draft saving, and browser print/PDF output.

Draft data is stored only in the user's browser through `localStorage`.

## Security

Do not add API keys, access tokens, passwords, credentials, or other secrets to this folder. The current project is a client-side static site and does not require any secrets.

## Reuse

Keep Administrative-specific changes inside this folder. Additional projects can be added later as separate top-level folders in `TheGitHoster` using the same self-contained structure.
