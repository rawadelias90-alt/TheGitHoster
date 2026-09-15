const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

assert.match(html, /id="accessForm"/, 'Welcome screen must contain the access form');
assert.match(html, /name="accessEmail"/, 'Access form must collect AECOM email');
assert.match(html, /name="employeeId"/, 'Access form must collect Employee ID');
assert.match(html, /id="accessError"/, 'Access form must provide an accessible validation message');
assert.match(html, /id="startRequest"[^>]*type="submit"/, 'Start action must submit the access form');
assert.match(script, /access:\s*\{\s*email:\s*''\s*,\s*employeeId:\s*''\s*,\s*validated:\s*false/, 'Draft state must track access identity and validation state');
assert.match(script, /function validateAccessEntry\(/, 'Script must validate the Welcome entry gate');
assert.match(script, /state\.draft\.access\.validated\s*=\s*true/, 'Successful local entry validation must unlock the journey');
assert.match(script, /state\.draft\.access\.validated\s*=\s*false/, 'Reset must clear access validation');

console.log('entry gate tests passed');
