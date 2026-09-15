const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gate = fs.readFileSync(path.join(root, 'entry-gate.js'), 'utf8');

assert.match(html, /\.\/entry-gate\.css/, 'Entry-gate styling must be loaded');
assert.match(html, /\.\/entry-gate\.js/, 'Entry-gate behavior must be loaded');
assert.match(html, /id="accessForm"/, 'Welcome screen must contain the access form');
assert.match(html, /name="accessEmail"/, 'Access form must collect AECOM email');
assert.match(html, /name="employeeId"/, 'Access form must collect Employee ID');
assert.match(html, /id="accessError"/, 'Access form must provide an accessible validation message');
assert.match(html, /id="startRequest"[^>]*type="submit"/, 'Start action must submit the access form');
assert.match(gate, /window\.Intake2Access\s*=\s*\{/, 'Access state must remain browser-memory only');
assert.match(gate, /function validateAccessEntry\(/, 'Entry gate must validate the two identity fields');
assert.match(gate, /Intake2Access\.validated\s*=\s*true/, 'Successful entry validation must unlock the journey');
assert.match(gate, /validated:\s*false/, 'The access state must have a locked state');
assert.match(gate, /data-progress-target/, 'Progress navigation must respect the access gate');
assert.doesNotMatch(gate, /localStorage|sessionStorage/, 'Access identity must not be persisted in browser storage');

console.log('entry gate tests passed');
