# Intake2 submission pilot

Runtime-only test connection. The final Submit action sends only:

- `email`: validated requester email held in browser memory
- `requestTitle`: generated `INT-########` pilot request identifier

Expected response handling:

- HTTP 200: show real SharePoint success confirmation and returned item ID when available.
- HTTP 500 or other non-success response: remain on the review page and show the returned error.

The Power Automate submission URL is entered at runtime and is not committed or persisted.
