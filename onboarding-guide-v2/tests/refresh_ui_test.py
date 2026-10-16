"""V2 browser contracts and review captures; runs in the regression workflow."""
from pathlib import Path
import os
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright
from pypdf import PdfReader
from wizard_helpers import choose

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('RUNNER_TEMP', '/tmp')) / 'guide-v2-qa'
OUT.mkdir(parents=True, exist_ok=True)
server = subprocess.Popen([sys.executable, '-m', 'http.server', '8767', '--bind', '127.0.0.1'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    time.sleep(.5)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':1440,'height':1024}, device_scale_factor=1, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('console', lambda message: errors.append(message.text) if message.type=='error' else None)
        page.goto('http://127.0.0.1:8767/', wait_until='networkidle')
        assert page.locator('.guide-banner').evaluate("el => getComputedStyle(el).backgroundImage").endswith('dubai-skyline-banner.png")')
        assert page.locator('.cover-logo').evaluate('el => el.complete && el.naturalWidth > 0')
        page.get_by_role('button', name='Start guided journey', exact=True).click()
        choose(page, 'entity', 'dubai'); choose(page, 'service', 'ev'); choose(page, 'hireStatus', 'local')
        page.get_by_role('button', name='View service', exact=True).click()
        assert page.locator('.journey-rail').is_visible()
        cards = page.locator('[data-action="flip-card"]')
        assert cards.count()==3
        assert all(cards.nth(i).get_attribute('aria-expanded')=='false' for i in range(3))
        assert page.locator('.flip-front img').evaluate_all('images => images.every(img => img.complete && img.naturalWidth > 0)')
        cards.nth(0).press('Enter'); cards.nth(1).press('Space'); cards.nth(2).click()
        assert all(cards.nth(i).get_attribute('aria-expanded')=='true' for i in range(3))
        for i in range(3): cards.nth(i).click()
        page.locator('#phase-pre-hire > summary').click()
        page.get_by_role('heading', name='Documents', exact=True).click()
        page.screenshot(path=str(OUT/'desktop-option2.png'), full_page=True)
        assert page.locator('html').evaluate('el => el.scrollWidth <= innerWidth')
        page.get_by_role('button', name='Go to Visa & Status Change', exact=True).click()
        assert page.locator('#phase-gro-processing').evaluate('el => el.open')
        assert page.locator('#phase-visa-status-change').is_visible()
        page.get_by_role('button', name='Go to Client Approval', exact=True).click()
        assert cards.nth(0).get_attribute('aria-expanded')=='true'
        before = page.locator('.detail-section').evaluate_all('panels=>panels.map(p=>p.open)')
        card_before = cards.evaluate_all('cards=>cards.map(c=>c.getAttribute("aria-expanded"))')
        page.pdf(path=str(OUT/'printed-local-service.pdf'), format='A4', print_background=True)
        printed_pages = [' '.join(pg.extract_text().split()).casefold() for pg in PdfReader(OUT/'printed-local-service.pdf').pages]
        text = '\n'.join(printed_pages)
        for expected in ['Before Intake 2','Candidate Actions','GRO Processing','Status Change','Completion Point','Passport copy']:
            assert expected.casefold() in text, expected
        assert any('completion point' in text and 'post-joining requirements are completed.' in text for text in printed_pages), 'Completion heading separated from its paragraph'
        assert page.locator('.detail-section').evaluate_all('panels=>panels.map(p=>p.open)')==before
        assert cards.evaluate_all('cards=>cards.map(c=>c.getAttribute("aria-expanded"))')==card_before
        page.set_viewport_size({'width':390,'height':844})
        page.get_by_role('button', name='Read GRO route', exact=True).click()
        page.get_by_role('button', name='Read Joining', exact=True).click()
        assert page.locator('html').evaluate('el => el.scrollWidth <= innerWidth')
        assert page.locator('.mobile-journey').is_visible()
        for i in range(3):
            assert cards.nth(i).evaluate('el=>el.scrollWidth <= el.clientWidth + 1')
        page.screenshot(path=str(OUT/'mobile-flipped.png'), full_page=True)
        page.locator('.mobile-journey > summary').click()
        page.locator('.mobile-journey').get_by_role('button', name='Go to Completion', exact=True).click()
        assert not page.locator('.mobile-journey').evaluate('el=>el.open')
        assert page.locator('#phase-completion').evaluate('el=>el.open')
        page.locator('.mobile-journey > summary').click()
        page.locator('.mobile-journey').get_by_role('button', name='Go to Pre-Hire Readiness', exact=True).click()
        assert page.locator('#phase-pre-hire').evaluate('el=>el.open')
        assert page.locator('.flip-inner').first.evaluate('el=>getComputedStyle(el).transitionDuration')=='0s'
        assert not errors, errors
        (OUT/'browser-checks.txt').write_text('Desktop 1440x1024, mobile 390x844; keyboard flips, independent persistence, nested navigation, reduced motion, PDF completeness and state restoration passed. Console errors: 0.\n')
        browser.close()
finally:
    server.terminate(); server.wait(timeout=5)
