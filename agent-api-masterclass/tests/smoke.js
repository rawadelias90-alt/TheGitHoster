const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m => m[1]);
assert(ids.length === new Set(ids).size, 'Duplicate HTML IDs detected');
assert(html.includes('href="./styles.css"'), 'styles.css must use a relative path');
assert(html.includes('src="./app.js"'), 'app.js must use a relative path');

for (const id of [
  'view-modules','view-builder','view-simulator','view-trace','view-architecture','view-codestudio','view-quiz',
  'learning-home','agent-blueprint','premium-academy-hero','academy-path','builder-architecture-snapshot',
  'sim-run-summary','trace-debug-guide','design-concept-legend','mastery-path'
]) {
  assert(html.includes(`id="${id}"`), `Missing required UI id: ${id}`);
}

for (const asset of ['./assets/agent-network.svg','./assets/trace-stack.svg','./assets/learning-path.svg']) {
  assert(html.includes(asset), `Missing HTML reference to ${asset}`);
  assert(fs.existsSync(path.join(root, asset.slice(2))), `Missing asset file ${asset}`);
}

assert(css.includes('.premium-academy-hero'), 'Premium hero styles missing');
assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion support missing');
assert(js.includes('function renderPremiumLearningExperience'), 'Premium render coordinator missing');
assert(js.includes('function renderBuilderArchitectureSnapshot'), 'Builder architecture renderer missing');
assert(js.includes('function renderSimulatorRunSummary'), 'Simulator summary renderer missing');

console.log('smoke: PASS');
