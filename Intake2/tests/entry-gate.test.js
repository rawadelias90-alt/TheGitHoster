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
assert.match(html, /id="flowUrl"/, 'Test gate must accept the Power Automate URL at runtime');
assert.match(html, /type="password"[^>]*id="flowUrl"|id="flowUrl"[^>]*type="password"/, 'Flow URL must be visually protected while entered');
assert.match(html, /id="accessError"/, 'Access form must provide an accessible validation message');
assert.match(html, /type="submit"[^>]*id="startRequest"|id="startRequest"[^>]*type="submit"/, 'Start action must submit the access form');

assert.match(gate, /window\.Intake2Access\s*=\s*\{/, 'Access state must remain browser-memory only');
assert.match(gate, /function validateAccessEntry\(/, 'Entry gate must validate the identity fields');
assert.match(gate, /fetch\(flowUrl/, 'Entry gate must call the runtime Power Automate URL');
assert.match(gate, /method:\s*['"]POST['"]/, 'Power Automate validation must use POST');
assert.match(gate, /email\s*:\s*email/, 'Validation payload must include email');
assert.match(gate, /employeeId\s*:\s*employeeId/, 'Validation payload must include employee ID');
assert.match(gate, /requestTitle\s*:\s*['"]Access validation['"]/, 'Validation payload must remain compatible with the current test trigger schema');
assert.match(gate, /fileName\s*:\s*['"][^'"]*['"]/, 'Validation payload must include the current trigger fileName field');
assert.match(gate, /fileContent\s*:\s*['"][^'"]*['"]/, 'Validation payload must include the current trigger fileContent field');
assert.match(gate, /response\.status\s*===\s*200/, 'Only HTTP 200 may unlock the journey');
assert.match(gate, /response\.status\s*===\s*403/, 'HTTP 403 must be handled as rejected access');
assert.match(gate, /Intake2Access\.validated\s*=\s*true/, 'Successful server validation must unlock the journey');
assert.match(gate, /validated:\s*false/, 'The access state must have a locked state');
assert.match(gate, /data-progress-target/, 'Progress navigation must respect the access gate');
assert.doesNotMatch(gate, /localStorage|sessionStorage/, 'Access identity and Flow URL must not be persisted in browser storage');
assert.doesNotMatch(gate, /https:\/\/[^'"\s]+logic\.azure\.com|https:\/\/[^'"\s]+environment\.api\.powerplatform\.com/, 'No Power Automate endpoint may be committed in source');

console.log('entry gate tests passed');
