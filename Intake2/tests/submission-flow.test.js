const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

assert.match(html, /id="submissionUrl"/, 'Review/test tools must accept the submission Flow URL at runtime');
assert.match(html, /type="password"[^>]*id="submissionUrl"|id="submissionUrl"[^>]*type="password"/, 'Submission Flow URL must be visually protected while entered');
assert.match(script, /fetch\(submissionUrl/, 'Submit must call the runtime submission Flow URL');
assert.match(script, /method:\s*['"]POST['"]/, 'Submission call must use POST');
assert.match(script, /email:\s*window\.Intake2Access\?\.email/, 'Submission payload must include the validated requester email');
assert.match(script, /requestTitle:/, 'Submission payload must include requestTitle');
assert.match(script, /response\.status\s*===\s*200/, 'HTTP 200 must be treated as successful submission');
assert.match(script, /response\.status\s*===\s*500|response\.ok/, 'Submission failure must be handled');
assert.doesNotMatch(script, /localStorage|sessionStorage/, 'Submission URL must not be persisted in browser storage');
assert.doesNotMatch(script, /https:\/\/[^'"\s]+environment\.api\.powerplatform\.com/, 'No Power Automate endpoint may be committed in source');

console.log('submission flow tests passed');
