import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const css = fs.readFileSync(new URL('styles.css', root), 'utf8');

test('guide text and controls use the supplied Playbook font settings', () => {
  const dom = new JSDOM(html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`));
  const { window: w } = dom;
  assert.equal(w.getComputedStyle(w.document.documentElement).fontFamily, 'Arial, "Segoe UI", sans-serif');
  assert.equal(w.getComputedStyle(w.document.querySelector('.text-button')).fontFamily, '"Segoe UI", Arial, sans-serif');
  w.close();
});
