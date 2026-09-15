const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gate = fs.readFileSync(path.join(root, 'entry-gate.js'), 'utf8');

assert.match(gate, /id="submissionUrl"/, 'Pilot UI must accept the submission Flow URL at runtime');
assert.match(gate, /type="password"[^>]*id="submissionUrl"|id="submissionUrl"[^>]*type="password"/, 'Submission Flow URL must be visually protected while entered');
assert.match(gate, /fetch\(submissionUrl/, 'Submit must call the runtime submission Flow URL');
assert.match(gate, /method:\s*['"]POST['"]/, 'Submission call must use POST');
assert.match(gate, /email:\s*window\.Intake2Access\?\.email/, 'Submission payload must include the validated requester email');
assert.match(gate, /requestTitle:/, 'Submission payload must include requestTitle');
assert.match(gate, /response\.status\s*===\s*200/, 'HTTP 200 must be treated as successful submission');
assert.match(gate, /response\.status\s*===\s*500|!response\.ok/, 'Submission failure must be handled');
assert.match(gate, /SharePoint item/, 'Success state must identify the real SharePoint pilot submission');
assert.doesNotMatch(gate, /localStorage|sessionStorage/, 'Submission URL must not be persisted in browser storage');
assert.doesNotMatch(gate, /https:\/\/[^'"\s]+environment\.api\.powerplatform\.com/, 'No Power Automate endpoint may be committed in source');

console.log('submission flow tests passed');
