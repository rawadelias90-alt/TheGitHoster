"""Live read-only selection trail above the active question; test-first regression."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re

ROOT = Path(__file__).resolve().parents[1]
index = (ROOT/"index.html").read_text()
css = (ROOT/"styles.css").read_text()
services = re.sub(r"\bexport\s+", "", (ROOT/"services.js").read_text())
app = re.sub(r"^\s*import[^\n]+\n", "", (ROOT/"app.js").read_text(), count=1)
html = index.replace('<link rel="stylesheet" href="styles.css">', f"<style>{css}</style>")
html = html.replace('<script type="module" src="app.js"></script>', f"<script>{services}\n{app}</script>")

def trail(page):
    return page.locator(".selection-summary")

def labels(page):
    return trail(page).locator(".selection-summary-value").all_inner_texts()

def expected(page, *values):
    assert trail(page).is_visible() == bool(values), ("visibility", values)
    assert labels(page) == list(values), (labels(page), values)
    if values:
        assert page.locator(".selection-summary-label").inner_text() in ("Selected so far:", "Selected:")
        assert page.evaluate("""() => {
          const a = document.querySelector('.selection-summary').getBoundingClientRect();
          const b = document.querySelector('.progressive-question:not([hidden])').getBoundingClientRect();
          return a.bottom <= b.top;
        }""")
    assert page.locator(".progressive-question:visible").count() == 1

def choose(page, key, value):
    assert page.locator(f"#question-{key}").is_visible(), key
    page.select_option(f"#question-{key}", value)

def back(page):
    page.get_by_role("button", name="Back", exact=True).click()

def cont(page):
    page.get_by_role("button", name="Continue", exact=True).click()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.set_content(html, wait_until="load")
    page.get_by_role("button", name="Start guided journey").click()
    page.evaluate("window.headerBefore = document.querySelector('.app-header')")
    header_text = page.locator(".app-header").inner_text()
    guide_title = page.locator(".question-title").inner_text()
    expected(page)
    assert page.locator(".question-entity").count() == 0  # no additional question card

    # Location appears above the Service question.
    choose(page, "entity", "dubai")
    assert page.locator("#question-service").is_visible()
    expected(page, "Dubai")
    assert page.locator(".app-header").inner_text() == header_text
    assert page.locator(".question-title").inner_text() == guide_title
    assert page.evaluate("window.headerBefore === document.querySelector('.app-header')")

    # Service appears above the Residency question, and final answer is included.
    choose(page, "service", "wp")
    assert page.locator("#question-residency").is_visible()
    expected(page, "Dubai", "Work Permit")
    choose(page, "residency", "golden")
    expected(page, "Dubai", "Work Permit", "Golden Visa")
    assert page.get_by_role("button", name="View service").is_visible()

    # Back excludes the active answer; Continue restores preserved values.
    back(page)
    assert page.locator("#question-service").input_value() == "wp"
    expected(page, "Dubai")
    cont(page)
    assert page.locator("#question-residency").input_value() == "golden"
    expected(page, "Dubai", "Work Permit", "Golden Visa")

    # Changing an earlier answer clears all branch-dependent labels.
    back(page)
    choose(page, "service", "ev")
    assert page.locator("#question-hireStatus").is_visible()
    expected(page, "Dubai", "Employment Visa and Work Permit")
    assert "Golden Visa" not in trail(page).inner_text()
    assert page.locator("#question-residency").input_value() == ""
    choose(page, "hireStatus", "overseas")
    expected(page, "Dubai", "Employment Visa and Work Permit", "Overseas Hire")
    choose(page, "nationality", "egypt")
    expected(page, "Dubai", "Employment Visa and Work Permit", "Overseas Hire", "Egypt")

    # Switching entity removes the previous service and route.
    back(page); back(page); back(page)
    assert page.locator("#question-entity").is_visible()
    expected(page)
    choose(page, "entity", "ad")
    assert page.locator("#question-service").is_visible()
    expected(page, "Abu Dhabi")
    assert page.locator("#question-service").input_value() == ""
    assert page.locator("#question-nationality").input_value() == ""

    # Mainland GCC extends summary with category and status.
    choose(page, "service", "nat")
    expected(page, "Abu Dhabi", "Emirati and GCC National Work Permit")
    choose(page, "category", "gcc")
    expected(page, "Abu Dhabi", "Emirati and GCC National Work Permit", "GCC National")
    choose(page, "gccStatus", "existingUid")
    expected(page, "Abu Dhabi", "Emirati and GCC National Work Permit", "GCC National",
             "No Emirates ID, previously entered UAE (existing UID)")
    back(page)
    expected(page, "Abu Dhabi", "Emirati and GCC National Work Permit")
    choose(page, "category", "emirati")
    expected(page, "Abu Dhabi", "Emirati and GCC National Work Permit", "Emirati")
    assert "UID" not in trail(page).inner_text()
    assert page.locator("#question-gccStatus").input_value() == ""

    # DWC GCC skips the Mainland GCC-only question.
    back(page); back(page)
    choose(page, "entity", "dwc")
    expected(page, "Dubai South (DWC)")
    choose(page, "service", "nat")
    choose(page, "category", "gcc")
    expected(page, "Dubai South (DWC)", "Emirati and GCC National Work Permit", "GCC National")
    assert page.get_by_role("button", name="View service").is_visible()
    assert page.locator("#question-gccStatus").is_hidden()

    page.get_by_role("button", name="View service").click()
    page.locator(".detail-section").evaluate_all("panels => panels.forEach(panel => panel.open = true)")
    page.get_by_role("button", name="Edit answers").click()
    expected(page)
    cont(page)
    expected(page, "Dubai South (DWC)")
    cont(page)
    expected(page, "Dubai South (DWC)", "Emirati and GCC National Work Permit", "GCC National")

    # Responsiveness: full labels wrap, no horizontal overflow or extra cards.
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
    assert trail(page).is_visible()
    assert len(labels(page)) == 3
    assert page.evaluate("window.headerBefore === document.querySelector('.app-header')")
    assert page.locator(".progressive-question:visible").count() == 1
    assert page.locator(".selection-summary").evaluate(
        "(el) => el.getBoundingClientRect().right <= innerWidth")
    browser.close()
