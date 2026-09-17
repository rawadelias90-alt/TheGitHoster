const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const requirementsIndex = html.indexOf('./requirements.js');
const scriptIndex = html.indexOf('./script.js');
assert.ok(requirementsIndex >= 0, 'requirements.js must be loaded');
assert.ok(scriptIndex > requirementsIndex, 'requirements.js must load before script.js');
assert.match(html, /id="progressNav"/);
assert.match(html, /id="screenHost"/);
assert.match(html, /id="readinessPanel"/);
assert.match(html, /id="routeLiveRegion"/);
assert.match(html, /id="prototypeTestTools"/);
assert.match(html, /id="submitRequest"/);
assert.match(html, /data-step="candidate"/);
assert.match(html, /data-step="documents"/);
assert.match(html, /data-step="servicePath"/);
assert.match(html, /data-step="conditionalRequirements"/);
assert.match(html, /data-step="review"/);
assert.match(html, /data-step="confirmation"/);
assert.doesNotMatch(html, /data-step="mainDocuments"|data-step="service"|data-step="route"|data-step="education"|data-step="additional"/);

console.log('shell tests passed');
