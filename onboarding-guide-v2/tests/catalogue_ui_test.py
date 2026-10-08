"""Catalogue edits must restore the chosen route without stale candidate details."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
index = (ROOT / 'index.html').read_text()
css = (ROOT / 'styles.css').read_text()
services = re.sub(r'\bexport\s+', '', (ROOT / 'services.js').read_text())
app = re.sub(r'^\s*import[^\n]+\n', '', (ROOT / 'app.js').read_text(), count=1)
html = index.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
html = html.replace('<script type="module" src="app.js"></script>', f'<script>{services}\n{app}</script>')
cases = json.loads(subprocess.check_output([
    'node', '--input-type=module', '-e',
    "import {browseCases} from './services.js'; console.log(JSON.stringify(browseCases()))",
], cwd=ROOT, text=True))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    page.set_content(html, wait_until='load')
    page.get_by_role('button', name='Explore all services', exact=True).click()
    for width, height in ((1440, 1000), (390, 844)):
        page.set_viewport_size({'width': width, 'height': height})
        for case in cases:
            entity, service_id = case['entity'], case['serviceId']
            print(f'Catalogue edit and navigation: {entity}/{service_id} at {width}px', flush=True)
            page.locator('.app-header [data-action="browse"]').click()
            page.select_option('#browseEntity', entity)
            button = page.locator(f'[data-action="view-service"][data-service-id="{service_id}"]')
            card = button.locator('xpath=ancestor::details')
            card.locator('summary').click()
            button.click()
            assert page.locator('.result-title').inner_text() == case['title']
            assert page.get_by_role('button', name='Print service guide').is_visible()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            selector = '.journey-list' if width == 1440 else '.mobile-journey-list'
            links = page.locator(selector + ' .journey-link')
            for index in range(links.count()):
                target = links.nth(index).get_attribute('data-target')
                assert page.locator('#' + target).count() == 1, (service_id, target)
            # Smooth scroll down and back up on every catalogue scenario.
            for index in (links.count() - 1, 0):
                if width == 390:
                    page.locator('.mobile-journey summary').click()
                target = links.nth(index).get_attribute('data-target')
                links.nth(index).click()
                page.wait_for_function('''id => {
                    const el = document.getElementById(id);
                    const desired = el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el).scrollMarginTop);
                    const maximum = document.documentElement.scrollHeight - innerHeight;
                    return Math.abs(scrollY - Math.max(0, Math.min(desired, maximum))) < 2;
                }''', arg=target, timeout=5000)
            page.get_by_role('button', name='Edit answers', exact=True).click()
            assert page.locator('#question-entity').input_value() == entity
            assert page.locator('#question-service').input_value() == case['service']
            if case['service'] == 'ev':
                expected = 'local' if service_id.endswith('-local') else 'overseas'
                assert page.locator('#question-hireStatus').input_value() == expected
                if expected == 'overseas':
                    assert page.locator('#question-nationality').input_value() == ''
                    assert page.get_by_role('button', name='View service', exact=True).is_hidden()
                    # Use a known fixture nationality matching the catalogue scenario.
                    nationality = 'egypt' if case['specialHire'] else 'other'
                    page.select_option('#question-nationality', nationality)
            elif case['service'] == 'wp':
                expected = 'relative' if service_id.endswith('-relative') else 'golden'
                assert page.locator('#question-residency').input_value() == expected
                assert page.locator('#question-hireStatus').input_value() == ''
                assert page.locator('#question-nationality').input_value() == ''
            else:
                assert page.locator('#question-category').input_value() == case['category']
                assert page.locator('#question-gccStatus').input_value() == (case.get('gccStatus') or '')
                assert page.locator('#question-residency').input_value() == ''
            page.get_by_role('button', name='View service', exact=True).click()
            assert page.locator('.result-kicker').inner_text().find(case['descriptor']) >= 0

    page.locator('.app-header [data-action="browse"]').click()
    page.select_option('#browseEntity', 'ad')
    page.select_option('#browseService', 'nat')
    gcc = page.locator('.service-preview-card').filter(has_text='GCC National Work Permit')
    assert 'All UAE status scenarios' in gcc.locator('.preview-meta').inner_text()
    assert 'Existing Emirates ID' not in gcc.locator('summary').inner_text()
    browser.close()
