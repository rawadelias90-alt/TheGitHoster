from pathlib import Path
from playwright.sync_api import sync_playwright
from wizard_helpers import choose
import re

ROOT = Path(__file__).resolve().parents[1]
index = (ROOT / "index.html").read_text()
css = (ROOT / "styles.css").read_text()
services = (ROOT / "services.js").read_text()
app = (ROOT / "app.js").read_text()

services = re.sub(r'\bexport\s+', '', services)
app = re.sub(r'^\s*import[^\n]+\n', '', app, count=1)
html = index.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
html = html.replace('<script type="module" src="app.js"></script>', f'<script>{services}\n{app}</script>')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.set_content(html, wait_until="load")

    # Branded landing cover
    assert page.locator("body").evaluate("el => el.classList.contains('landing-mode')")
    assert page.locator(".landing-cover").is_visible()
    assert page.locator(".cover-logo").is_visible()
    assert page.locator(".cover-logo").get_attribute("src") == "./assets/aecom-logo.png"
    assert page.get_by_role("heading", name="UAE New Hire Guide").is_visible()
    assert page.get_by_role("button", name="Start guided journey").is_visible()
    assert page.get_by_role("button", name="Explore all services").is_visible()

    # The guided journey uses one visible question per screen, with automatic progression.
    page.get_by_role("button", name="Start guided journey").click()
    assert page.get_by_role("heading", name="Find the right onboarding route").is_visible()
    assert page.locator("#question-entity").is_visible()
    assert page.locator("#question-service").is_hidden()

    choose(page,"entity","ad")
    assert page.locator("#question-entity").input_value() == "ad"
    assert page.locator("#question-entity").is_hidden()
    assert page.locator(".progressive-question:visible").count() == 1
    assert page.locator("#question-service").is_visible()

    choose(page,"service","ev")
    assert page.locator("#question-service").input_value() == "ev"
    assert page.locator("#question-hireStatus").is_visible()

    choose(page,"hireStatus","overseas")
    assert page.locator("#question-nationality").is_visible()
    choose(page,"nationality","india")
    assert page.get_by_role("button", name="View service").count() == 1
    page.get_by_role("button", name="View service").click()

    # Full service result remains unchanged.
    assert page.get_by_role("heading", name="Employment Visa and Work Permit").is_visible()
    assert page.get_by_text("Special Hire applies").is_visible()
    assert page.get_by_role("heading", name="Pre-Hire Readiness").is_visible()
    assert page.get_by_role("heading", name="Documents", exact=True).is_visible()
    assert page.get_by_role("heading", name="Candidate Actions").is_visible()
    assert page.get_by_role("heading", name="GRO Processing", exact=True).is_visible()
    assert page.get_by_role("heading", name="Initial Work Permit Approval", exact=True).is_visible()
    assert page.get_by_role("heading", name="Home-Country Medical", exact=True).is_visible()
    assert page.get_by_role("heading", name="UAE Embassy Process", exact=True).is_visible()
    assert page.get_by_role("heading", name="Joining / Travel").is_visible()
    assert page.get_by_role("heading", name="Post-Joining").is_visible()
    assert page.get_by_role("heading", name="Completion Point").is_visible()
    assert page.get_by_role("button", name="Print").is_visible()
    page.evaluate("window.__printCalled = false; window.print = () => { window.__printCalled = true; }")
    page.get_by_role("button", name="Print").click()
    assert page.evaluate("window.__printCalled === true")

    # Every journey entry has an explicit target and can move both down and back up.
    journey_links = page.locator(".journey-list .journey-link")
    assert journey_links.count() == page.locator(".journey-list .journey-item").count()
    assert journey_links.count() >= 7
    for i in range(journey_links.count()):
        target_id = journey_links.nth(i).get_attribute("data-target")
        assert target_id
        assert page.locator(f"#{target_id}").count() == 1

    start_y = page.evaluate("window.scrollY")
    page.get_by_role("button", name=re.compile("Go to Completion", re.I)).click()
    page.wait_for_timeout(350)
    bottom_y = page.evaluate("window.scrollY")
    assert bottom_y > start_y
    page.get_by_role("button", name=re.compile("Go to Pre-Hire Readiness", re.I)).click()
    page.wait_for_timeout(350)
    top_y = page.evaluate("window.scrollY")
    assert top_y < bottom_y

    cards = page.locator(".summary-item")
    assert cards.count() == 3
    first_box = cards.nth(0).bounding_box()
    second_box = cards.nth(1).bounding_box()
    assert second_box["x"] - (first_box["x"] + first_box["width"]) >= 12

    # Browse remains available.
    page.get_by_role("button", name="Explore more services").click()
    assert page.get_by_role("heading", name="Explore UAE onboarding services").is_visible()
    page.select_option("#browseEntity", "dwc")
    first = page.locator(".service-preview-card").first
    first.locator("summary").click()
    assert first.get_by_text("Processed through").is_visible()
    assert first.get_by_text("GRO route").is_visible()

    # Mobile progressive branch and downstream reset.
    page.set_viewport_size({"width": 390, "height": 844})
    page.get_by_role("button", name="Start guided journey").click()
    choose(page,"entity","dwc")
    choose(page,"service","ev")
    choose(page,"hireStatus","overseas")
    assert page.locator("#question-nationality").is_visible()

    choose(page,"service","wp")
    assert page.locator("#question-residency").is_visible()
    assert page.locator("#question-hireStatus").is_hidden()
    assert page.locator("#question-nationality").is_hidden()
    choose(page,"residency","golden")
    assert page.get_by_role("button", name="View service").count() == 1
    assert page.locator("body").evaluate("(el) => el.scrollWidth <= window.innerWidth")

    browser.close()
