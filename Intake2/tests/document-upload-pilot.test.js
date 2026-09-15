const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gate = fs.readFileSync(path.join(root, 'entry-gate.js'), 'utf8');

assert.match(gate, /function installDocumentUploadPilot\(/, 'Document upload pilot installer must exist');
assert.match(gate, /id=\"documentUploadUrl\"/, 'Pilot must accept the document upload Flow URL at runtime');
assert.match(gate, /id=\"documentUploadFile\"/, 'Pilot must expose one file input');
assert.match(gate, /id=\"uploadTestDocument\"/, 'Pilot must expose an upload test button');
assert.match(gate, /2 \* 1024 \* 1024/, 'Pilot must cap the test file at 2 MB');
assert.match(gate, /readAsDataURL\(/, 'Pilot must convert the selected file to Base64');
assert.match(gate, /requestTitle:\s*requestTitle/, 'Upload payload must include requestTitle');
assert.match(gate, /fileName:\s*file\.name/, 'Upload payload must include original fileName');
assert.match(gate, /fileContent:\s*fileContent/, 'Upload payload must include Base64 fileContent');
assert.match(gate, /response\.status\s*===\s*200/, 'HTTP 200 must be treated as upload success');
assert.match(gate, /response\.status\s*===\s*500|!response\.ok/, 'Upload failures must remain visible to the user');
assert.doesNotMatch(gate, /localStorage|sessionStorage/, 'Document upload URL must not be persisted');
assert.doesNotMatch(gate, /https:\/\/[^'\"\s]+environment\.api\.powerplatform\.com/, 'No Power Automate endpoint may be committed in source');

console.log('document upload pilot tests passed');
