const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const loader = fs.readFileSync(path.join(root, 'test-mode.js'), 'utf8');

assert.match(loader, /searchParams\.get\(['\"]v['\"]\)/, 'Document upload loader must reuse the page version as a cache key');
assert.match(loader, /document-upload-pilot\.js\?v=/, 'Document upload pilot must be loaded with a cache-busting version query');
assert.match(loader, /Date\.now\(\)/, 'Loader must fall back to a fresh cache key when the page has no version query');

console.log('document upload cache test passed');
