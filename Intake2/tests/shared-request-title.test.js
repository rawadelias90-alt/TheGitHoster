const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const gate = fs.readFileSync(path.join(root, 'entry-gate.js'), 'utf8');
const upload = fs.readFileSync(path.join(root, 'document-upload-pilot.js'), 'utf8');

assert.match(gate, /requestTitle:\s*''/, 'Access state must reserve one shared request title for the current journey');
assert.match(gate, /function getOrCreateRequestTitle\(/, 'A shared request-title helper must exist');
assert.match(gate, /`INT-\$\{Date\.now\(\)\.toString\(\)\.slice\(-8\)\}`/, 'Shared request titles must use the INT- prefix');
assert.match(gate, /const requestTitle = getOrCreateRequestTitle\(\);/, 'Submission must use the shared request title');
assert.match(gate, /getOrCreateRequestTitle\s*\}/, 'The request-title helper must be exposed to the upload pilot');

assert.match(upload, /Intake2AccessGate\?\.getOrCreateRequestTitle\?\.\(\)/, 'Document upload must obtain the shared Intake2 request title');
assert.doesNotMatch(upload, /`DOC-\$\{/, 'Document upload must not generate a separate DOC- request title');
assert.match(upload, /requestTitle:\s*requestTitle/, 'Document upload payload must send the shared request title');

console.log('shared request title tests passed');
