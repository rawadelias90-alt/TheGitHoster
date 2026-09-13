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
assert.match(html, /data-step="mainDocuments"/);
assert.match(html, /data-step="service"/);
assert.match(html, /data-step="route"/);
assert.match(html, /data-step="education"/);
assert.match(html, /data-step="additional"/);
assert.match(html, /data-step="review"/);

console.log('shell tests passed');
