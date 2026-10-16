import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
import * as services from '../services.js';

const root = new URL('../', import.meta.url);
const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const app = fs.readFileSync(new URL('app.js', root), 'utf8').replace(/^import[^\n]+\n/, '');

function guide(t) {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://guide.test/' });
  const w = dom.window;
  Object.assign(w, services);
  w.requestAnimationFrame = fn => fn();
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.print = () => {};
  w.eval(app);
  t.after(() => w.close());
  return w;
}

function openCase(w, serviceId = 'ev-mainland-local', entity = 'dubai') {
  w.document.querySelector('.app-header [data-action="browse"]').click();
  w.document.querySelector(`[data-action="view-service"][data-service-id="${serviceId}"][data-entity="${entity}"]`).click();
}

test('cards reveal independently and a second click only closes that card', t => {
  const w = guide(t); openCase(w);
  const cards = [...w.document.querySelectorAll('[data-action="flip-card"]')];
  assert.equal(cards.length, 3);
  assert.deepEqual(cards.map(c => c.getAttribute('aria-expanded')), ['false', 'false', 'false']);
  cards[0].click(); cards[1].click(); cards[2].click();
  assert.deepEqual(cards.map(c => c.getAttribute('aria-expanded')), ['true', 'true', 'true']);
  cards[1].click();
  assert.deepEqual(cards.map(c => c.getAttribute('aria-expanded')), ['true', 'false', 'true']);
  assert.equal(cards[0].querySelector('.flip-back').getAttribute('aria-hidden'), 'false');
});

test('multiple detail sections stay open and journey navigation opens nested targets', t => {
  const w = guide(t); openCase(w);
  const d = w.document;
  const gro = d.querySelector('#phase-gro-processing');
  const joining = d.querySelector('#phase-joining');
  assert.equal(gro.open, false);
  assert.equal(joining.open, false);
  d.querySelector('[data-action="journey-scroll"][data-target="phase-visa-status-change"]').click();
  assert.equal(gro.open, true);
  d.querySelector('[data-action="journey-scroll"][data-target="phase-joining"]').click();
  assert.equal(joining.open, true);
  assert.equal(gro.open, true);
  assert.equal(d.querySelector('.journey-link[aria-current="location"]').dataset.target, 'phase-joining');
});

test('journey navigation reveals the overview card that contains its explanation', t => {
  const w = guide(t); openCase(w);
  w.document.querySelector('[data-action="journey-scroll"][data-target="phase-client-approval"]').click();
  assert.equal(w.document.querySelector('#phase-client-approval button').getAttribute('aria-expanded'), 'true');
});

test('journey destinations remain in the keyboard tab order after being revealed', t => {
  const w = guide(t); openCase(w);
  const d = w.document;
  d.querySelector('[data-action="journey-scroll"][data-target="phase-client-approval"]').click();
  assert.equal(d.querySelector('#phase-client-approval button').tabIndex, 0);
  d.querySelector('[data-action="journey-scroll"][data-target="phase-joining"]').click();
  assert.notEqual(d.querySelector('#phase-joining > summary').getAttribute('tabindex'), '-1');
});

test('expanded cards expose their revealed explanation as the focused button description', t => {
  const w = guide(t); openCase(w);
  const d = w.document;
  const card = d.querySelector('[data-action="flip-card"]');
  card.click();
  const description = d.getElementById(card.getAttribute('aria-describedby'));
  assert.ok(description);
  assert.match(description.textContent, /Complete Intake 1, obtain Client Approval/);
  assert.equal(description.closest('.flip-back').getAttribute('aria-hidden'), 'false');
  card.click();
  assert.equal(card.hasAttribute('aria-describedby'), false);
});

test('printing expands all detail sections and restores the original state after repeated beforeprint events', t => {
  const w = guide(t); openCase(w);
  const panels = [...w.document.querySelectorAll('.detail-section')];
  assert.ok(panels.every(p => p.tagName === 'DETAILS'));
  panels[1].open = true;
  const before = panels.map(p => p.open);
  const cards = [...w.document.querySelectorAll('[data-action="flip-card"]')];
  cards[1].click();
  w.dispatchEvent(new w.Event('beforeprint'));
  w.dispatchEvent(new w.Event('beforeprint'));
  assert.ok(panels.every(p => p.open));
  assert.ok(cards.every(c => c.getAttribute('aria-expanded') === 'true'));
  w.dispatchEvent(new w.Event('afterprint'));
  assert.deepEqual(panels.map(p => p.open), before);
  assert.deepEqual(cards.map(c => c.getAttribute('aria-expanded')), ['false', 'true', 'false']);
});

test('a suppressed print dialog does not leave the browsing state expanded', t => {
  const w = guide(t); openCase(w);
  const panels = [...w.document.querySelectorAll('.detail-section')];
  panels[2].open = true;
  const before = panels.map(p => p.open);
  w.document.querySelector('[data-action="print"]').click();
  assert.deepEqual(panels.map(p => p.open), before);
  assert.equal(w.document.body.classList.contains('printing-guide'), false);
});

test('every catalogue route retains every GRO step, has unique anchors and can reveal all journey destinations', t => {
  const w = guide(t);
  for (const result of services.browseCases()) {
    openCase(w, result.serviceId, result.entity);
    const d = w.document;
    assert.deepEqual([...d.querySelectorAll('.gro-step h3')].map(h => h.textContent), result.groProcess.map(s => s.title));
    const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
    assert.equal(new Set(ids).size, ids.length, result.serviceId);
    for (const link of d.querySelectorAll('.journey-list .journey-link')) {
      const target = d.getElementById(link.dataset.target);
      assert.ok(target, `${result.serviceId}: ${link.dataset.target}`);
      link.click();
      let ancestor = target;
      while (ancestor) {
        if (ancestor.tagName === 'DETAILS') assert.equal(ancestor.open, true, result.serviceId);
        ancestor = ancestor.parentElement;
      }
    }
  }
});
