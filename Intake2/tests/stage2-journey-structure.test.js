const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const gate = fs.readFileSync(path.join(root, 'entry-gate.js'), 'utf8');

const expectedSteps = ['welcome', 'candidate', 'documents', 'servicePath', 'conditionalRequirements', 'review', 'confirmation'];
for (const step of expectedSteps) assert.match(html, new RegExp(`data-step=["']${step}["']`), `Progress navigation must include ${step}`);
for (const retired of ['mainDocuments', 'service', 'route', 'education', 'additional']) assert.doesNotMatch(html, new RegExp(`data-step=["']${retired}["']`), `Progress navigation must not expose retired step ${retired}`);

assert.match(html, /<em>Documents<\/em>/);
assert.match(html, /<em>Service &amp; Path<\/em>/);
assert.match(html, /<em>Requirements<\/em>/);
assert.match(html, /<strong>Your onboarding path<\/strong>/);

assert.match(script, /const steps = \['welcome', 'candidate', 'documents', 'servicePath', 'conditionalRequirements', 'review', 'confirmation'\]/);
assert.match(script, /function renderServicePath\(/);
assert.match(script, /function renderConditionalRequirements\(/);
assert.doesNotMatch(script, /title: 'Additional Supporting Documents'/);
assert.match(script, /Service & Onboarding Path/);
assert.match(script, /Conditional Requirements/);
assert.doesNotMatch(script, /Selected Service Route|Route-Specific Requirements|Choose one route|Selected route/);

assert.match(gate, /mobileCount\.textContent = '7 \/ 7'/);

console.log('Stage 2 simplified journey structure test passed');
