from pathlib import Path
from playwright.sync_api import sync_playwright
import re

ROOT = Path(__file__).resolve().parents[1]
index = (ROOT / "index.html").read_text()
css = (ROOT / "styles.css").read_text()
services = re.sub(r"\bexport\s+", "", (ROOT / "services.js").read_text())
app = re.sub(r"^\s*import[^\n]+\n", "", (ROOT / "app.js").read_text(), count=1)
html = index.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
html = html.replace('<script type="module" src="app.js"></script>', f'<script>{services}\n{app}</script>')

def select_category(page, entity, category):
    page.select_option("#question-entity", entity)
    page.select_option("#question-service", "nat")
    page.select_option("#question-category", category)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.set_content(html, wait_until="load")
    page.get_by_role("button", name="Start guided journey").click()

    select_category(page, "ad", "emirati")
    assert page.locator("#question-gccStatus").is_hidden()
    assert page.get_by_role("button", name="View service").is_visible()
    page.get_by_role("button", name="View service").click()
    assert page.get_by_role("heading", name="Emirati National Work Permit").is_visible()
    assert page.locator(".journey-list").get_by_role("button", name="Go to Medical").is_visible()
    assert page.locator(".result-main").get_by_text("required Medical", exact=False).count() > 0
    assert page.locator("#phase-emirates-id").count() == 0

    page.get_by_role("button", name="Edit answers").click()
    page.select_option("#question-category", "gcc")
    assert page.locator("#question-gccStatus").is_visible()
    assert page.get_by_role("button", name="View service").is_hidden()
    page.select_option("#question-gccStatus", "existingUid")
    assert page.get_by_role("button", name="View service").is_visible()
    page.get_by_role("button", name="View service").click()
    assert page.get_by_role("heading", name="GCC National Work Permit").is_visible()
    assert page.locator("#phase-emirates-id").count() == 1
    assert page.get_by_role("heading", name="Emirates ID", exact=True).is_visible()
    assert page.get_by_role("heading", name="Pension Registration", exact=True).is_visible()
    assert page.locator(".journey-list").get_by_role("button", name="Go to Medical").count() == 0

    links = page.locator(".journey-list .journey-link")
    for i in range(links.count()):
        anchor = links.nth(i).get_attribute("data-target")
        assert anchor and page.locator("#" + anchor).count() == 1, (i, anchor)
    page.locator(".journey-list").get_by_role("button", name="Go to Completion").click()
    page.wait_for_timeout(400)
    bottom = page.evaluate("window.scrollY")
    page.locator(".journey-list").get_by_role("button", name="Go to Pre-Hire Readiness").click()
    page.wait_for_timeout(400)
    assert page.evaluate("window.scrollY") < bottom

    page.evaluate("window.__printCalled = false; window.print = () => { window.__printCalled = true; }")
    page.get_by_role("button", name="Print").click()
    assert page.evaluate("window.__printCalled")
    page.emulate_media(media="print")
    assert page.locator(".result-main").is_visible()
    assert page.locator(".result-toolbar").is_hidden()
    assert page.get_by_role("heading", name="Pension Registration", exact=True).is_visible()
    page.emulate_media(media="screen")

    page.get_by_role("button", name="Edit answers").click()
    page.select_option("#question-gccStatus", "firstEntry")
    page.get_by_role("button", name="View service").click()
    assert page.get_by_text("must travel to UAE", exact=False).count() > 0
    assert page.locator("#phase-emirates-id").count() == 1

    page.get_by_role("button", name="Edit answers").click()
    page.select_option("#question-entity", "dwc")
    page.select_option("#question-service", "nat")
    page.select_option("#question-category", "gcc")
    assert page.locator("#question-gccStatus").is_hidden()
    assert page.get_by_role("button", name="View service").is_visible()
    page.get_by_role("button", name="View service").click()
    assert page.locator(".result-kicker").get_by_text("DWC").is_visible()
    assert page.get_by_text("Digital Candidate Signature", exact=True).count() > 0
    assert page.locator(".journey-list").get_by_role("button", name="Go to DWC Work Permit Approval").is_visible()
    assert page.locator("#phase-emirates-id").count() == 0

    page.get_by_role("button", name="Explore more services").click()
    page.select_option("#browseEntity", "ad")
    page.select_option("#browseService", "nat")
    assert page.locator(".service-preview-card").count() == 2
    gcc_card = page.locator(".service-preview-card").filter(has_text="GCC National Work Permit")
    assert gcc_card.count() == 1
    gcc_card.locator("summary").click()
    assert gcc_card.locator(".gcc-choice-button").count() == 3
    gcc_card.locator(".gcc-choice-button").nth(2).click()
    assert page.get_by_text("First UAE entry", exact=False).count() > 0

    page.set_viewport_size({"width": 390, "height": 844})
    page.get_by_role("button", name="Edit answers").click()
    select_category(page, "alain", "gcc")
    page.select_option("#question-gccStatus", "existingEid")
    page.get_by_role("button", name="View service").click()
    assert page.locator("body").evaluate("(el) => el.scrollWidth <= window.innerWidth")
    mobile = page.locator(".mobile-journey")
    mobile.locator("summary").click()
    assert mobile.get_by_role("button", name="Go to Pension Registration").is_visible()
    mobile.get_by_role("button", name="Go to Pension Registration").click()
    assert mobile.evaluate("(el) => !el.open")
    assert page.locator("#phase-pension").count() == 1
    assert page.locator("#phase-emirates-id").count() == 0
    browser.close()
