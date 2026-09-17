from pathlib import Path
from playwright.sync_api import sync_playwright
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
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"])
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

    # Progressive guided journey: existing controls remain in place while new ones appear.
    page.get_by_role("button", name="Start guided journey").click()
    assert page.get_by_role("heading", name="Find the right onboarding route").is_visible()
    assert page.locator("#question-entity").is_visible()
    assert page.locator("#question-service").is_hidden()

    page.select_option("#question-entity", "ad")
    assert page.locator("#question-entity").input_value() == "ad"
    assert page.locator("#question-service").is_visible()

    page.select_option("#question-service", "ev")
    assert page.locator("#question-service").input_value() == "ev"
    assert page.locator("#question-hireStatus").is_visible()

    page.select_option("#question-hireStatus", "overseas")
    assert page.locator("#question-nationality").is_visible()
    page.select_option("#question-nationality", "india")
    assert page.get_by_role("button", name="View service").count() == 1
    page.get_by_role("button", name="View service").click()

    # Full service result remains unchanged.
    assert page.get_by_role("heading", name="Employment Visa and Work Permit").is_visible()
    assert page.get_by_text("Special Hire applies").is_visible()
    assert page.get_by_role("heading", name="Pre-Hire Readiness").is_visible()
    assert page.get_by_role("heading", name="Documents").is_visible()
    assert page.get_by_role("heading", name="Candidate Actions").is_visible()
    assert page.get_by_role("heading", name="GRO Processing", exact=True).is_visible()
    assert page.get_by_role("heading", name="Initial Work Permit Approval", exact=True).is_visible()
    assert page.get_by_role("heading", name="Home-Country Medical", exact=True).is_visible()
    assert page.get_by_role("heading", name="UAE Embassy Process", exact=True).is_visible()
    assert page.get_by_role("heading", name="Joining / Travel").is_visible()
    assert page.get_by_role("heading", name="Post-Joining").is_visible()
    assert page.get_by_role("heading", name="Completion Point").is_visible()

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
    page.select_option("#question-entity", "dwc")
    page.select_option("#question-service", "ev")
    page.select_option("#question-hireStatus", "overseas")
    assert page.locator("#question-nationality").is_visible()

    page.select_option("#question-service", "wp")
    assert page.locator("#question-residency").is_visible()
    assert page.locator("#question-hireStatus").is_hidden()
    assert page.locator("#question-nationality").is_hidden()
    page.select_option("#question-residency", "golden")
    assert page.get_by_role("button", name="View service").count() == 1
    assert page.locator("body").evaluate("(el) => el.scrollWidth <= window.innerWidth")

    browser.close()
