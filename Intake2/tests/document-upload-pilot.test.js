const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const loader = fs.readFileSync(path.join(root, 'test-mode.js'), 'utf8');
const pilotPath = path.join(root, 'document-upload-pilot.js');
const pilot = fs.existsSync(pilotPath) ? fs.readFileSync(pilotPath, 'utf8') : '';

assert.match(loader, /document-upload-pilot\.js/, 'Test mode must load the document upload pilot module');
assert.match(pilot, /function installDocumentUploadPilot\(/, 'Document upload pilot installer must exist');
assert.match(pilot, /id=\"documentUploadUrl\"/, 'Pilot must accept the document upload Flow URL at runtime');
assert.match(pilot, /id=\"documentUploadFile\"/, 'Pilot must expose one file input');
assert.match(pilot, /id=\"uploadTestDocument\"/, 'Pilot must expose an upload test button');
assert.match(pilot, /2 \* 1024 \* 1024/, 'Pilot must cap the test file at 2 MB');
assert.match(pilot, /readAsDataURL\(/, 'Pilot must convert the selected file to Base64');
assert.match(pilot, /requestTitle:\s*requestTitle/, 'Upload payload must include requestTitle');
assert.match(pilot, /fileName:\s*file\.name/, 'Upload payload must include original fileName');
assert.match(pilot, /fileContent:\s*fileContent/, 'Upload payload must include Base64 fileContent');
assert.match(pilot, /response\.status\s*===\s*200/, 'HTTP 200 must be treated as upload success');
assert.match(pilot, /response\.status\s*===\s*500|!response\.ok/, 'Upload failures must remain visible to the user');
assert.doesNotMatch(pilot, /localStorage|sessionStorage/, 'Document upload URL must not be persisted');
assert.doesNotMatch(pilot, /https:\/\/[^'\"\s]+environment\.api\.powerplatform\.com/, 'No Power Automate endpoint may be committed in source');

console.log('document upload pilot tests passed');
