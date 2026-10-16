"""Approved single-question wizard regression; fails against stacked progressive form."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re

ROOT=Path(__file__).resolve().parents[1]
index=(ROOT/"index.html").read_text()
css=(ROOT/"styles.css").read_text()
services=re.sub(r"\bexport\s+", "", (ROOT/"services.js").read_text())
app=re.sub(r"^\s*import[^\n]+\n", "", (ROOT/"app.js").read_text(), count=1)
html=index.replace('<link rel="stylesheet" href="styles.css">', f"<style>{css}</style>")
html=html.replace('<script type="module" src="app.js"></script>', f"<script>{services}\n{app}</script>")

def current(page,key):
    visible=page.locator(".progressive-question:visible")
    assert visible.count()==1, f"Expected one visible question, found {visible.count()}"
    assert visible.first.get_attribute("data-question-row")==key
    assert page.locator(f"#question-{key}").is_visible()

def choose(page,key,value):
    current(page,key)
    page.select_option(f"#question-{key}", value)

def back(page,expected):
    page.get_by_role("button",name="Back",exact=True).click()
    current(page,expected)

def continued(page,expected):
    page.get_by_role("button",name="Continue",exact=True).click()
    current(page,expected)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    page=browser.new_page(viewport={"width":1440,"height":1000})
    page.set_content(html,wait_until="load")
    page.get_by_role("button",name="Start guided journey").click()
    page.evaluate("window.originalHeader = document.querySelector('.app-header')")
    assert page.locator(".app-header").is_visible()
    header=page.locator(".app-header").inner_text()
    title=page.locator(".question-title").inner_text()
    current(page,"entity")
    assert page.get_by_role("button",name="Back to start").is_visible()
    assert page.get_by_role("button",name="Continue").count()==0
    choose(page,"entity","ad")
    current(page,"service")
    assert page.evaluate("window.originalHeader === document.querySelector('.app-header')")
    assert page.locator(".app-header").inner_text()==header
    assert page.locator(".question-title").inner_text()==title
    assert page.evaluate("document.activeElement.id")=="question-service"
    assert not page.locator("#question-entity").is_visible()

    choose(page,"service","ev")
    current(page,"hireStatus")
    choose(page,"hireStatus","overseas")
    current(page,"nationality")
    choose(page,"nationality","india")
    current(page,"nationality")
    assert page.get_by_role("button",name="View service").is_visible()
    assert page.get_by_role("button",name="Continue").count()==0

    back(page,"hireStatus")
    assert page.locator("#question-hireStatus").input_value()=="overseas"
    assert page.get_by_role("button",name="Continue").is_visible()
    continued(page,"nationality")
    assert page.locator("#question-nationality").input_value()=="india"
    back(page,"hireStatus")
    back(page,"service")
    assert page.locator("#question-service").input_value()=="ev"
    choose(page,"service","wp")
    current(page,"residency")
    assert page.locator("#question-hireStatus").input_value()==""
    assert page.locator("#question-nationality").input_value()==""
    choose(page,"residency","golden")
    current(page,"residency")
    assert page.get_by_role("button",name="View service").is_visible()
    page.get_by_role("button",name="View service").click()
    page.locator(".detail-section").evaluate_all("panels => panels.forEach(panel => panel.open = true)")
    assert page.get_by_role("heading",name="Golden Visa Work Permit").is_visible()
    assert page.get_by_role("button",name="Print").is_visible()

    page.get_by_role("button",name="Edit answers").click()
    current(page,"entity")
    assert page.locator("#question-entity").input_value()=="ad"
    continued(page,"service")
    assert page.locator("#question-service").input_value()=="wp"
    continued(page,"residency")
    assert page.locator("#question-residency").input_value()=="golden"
    back(page,"service")
    back(page,"entity")
    choose(page,"entity","dwc")
    current(page,"service")
    assert page.locator("#question-service").input_value()==""
    choose(page,"service","nat")
    current(page,"category")
    choose(page,"category","gcc")
    current(page,"category")
    assert page.get_by_role("button",name="View service").is_visible()
    assert not page.locator("#question-gccStatus").is_visible()
    page.get_by_role("button",name="View service").click()
    page.locator(".detail-section").evaluate_all("panels => panels.forEach(panel => panel.open = true)")
    assert page.get_by_role("heading",name="GCC National Work Permit").is_visible()
    assert page.locator(".gro-step h3").filter(has_text="DWC Work Permit").count()>0

    page.get_by_role("button",name="Start again").click()
    page.get_by_role("button",name="Start guided journey").click()
    current(page,"entity")
    choose(page,"entity","alain")
    choose(page,"service","nat")
    choose(page,"category","gcc")
    current(page,"gccStatus")
    choose(page,"gccStatus","existingUid")
    assert page.get_by_role("button",name="View service").is_visible()
    page.get_by_role("button",name="View service").click()
    page.locator(".detail-section").evaluate_all("panels => panels.forEach(panel => panel.open = true)")
    assert page.get_by_role("heading",name="Emirates ID",exact=True).is_visible()

    # Change GCC to Emirati from Edit Answers; old GCC status must be cleared.
    page.get_by_role("button",name="Edit answers").click()
    continued(page,"service")
    continued(page,"category")
    choose(page,"category","emirati")
    current(page,"category")
    assert page.locator("#question-gccStatus").input_value()==""
    assert page.get_by_role("button",name="View service").is_visible()

    # On mobile the header remains fixed and only one card may appear.
    page.set_viewport_size({"width":390,"height":844})
    back(page,"service")
    back(page,"entity")
    choose(page,"entity","dubai")
    current(page,"service")
    assert page.locator("body").evaluate("el=>el.scrollWidth<=window.innerWidth")
    assert page.locator(".app-header").is_visible()
    assert page.evaluate("window.originalHeader === document.querySelector('.app-header')")
    assert page.locator(".progressive-question:visible").count()==1

    browser.close()
