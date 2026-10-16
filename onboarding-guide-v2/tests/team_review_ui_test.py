from pathlib import Path
from playwright.sync_api import sync_playwright
from wizard_helpers import choose
import re

ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/"styles.css").read_text()
services=re.sub(r"\bexport\s+","",(ROOT/"services.js").read_text())
app=re.sub(r"^\s*import[^\n]+\n","",(ROOT/"app.js").read_text(),count=1)
html=(ROOT/"index.html").read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">',f"<style>{css}</style>")
html=html.replace('<script type="module" src="app.js"></script>',f"<script>{services}\n{app}</script>")

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
    page=browser.new_page(viewport={"width":1440,"height":1000})
    page.set_content(html,wait_until="load")

    # Local Employment Visa documents have either/or in-country evidence and no OTP.
    page.get_by_role("button",name="Start guided journey").click()
    choose(page,"entity","dubai")
    choose(page,"service","ev")
    choose(page,"hireStatus","local")
    page.get_by_role("button",name="View service").click()
    assert page.get_by_role("heading",name="Employment Visa and Work Permit").is_visible()
    doc=page.locator(".detail-section").filter(has=page.get_by_role("heading",name="Documents",exact=True))
    assert "cancellation" in doc.inner_text().lower() and "visit visa" in doc.inner_text().lower()
    assert "Current UAE visa / residency" not in doc.inner_text()
    assert "Name differences in education documents" in doc.inner_text()
    assert "previous passport" in doc.inner_text()
    assert "university" in doc.inner_text().lower()
    assert "OTP 1" not in page.locator(".gro-sequence").inner_text()
    assert "OTP 2" not in page.locator(".gro-sequence").inner_text()

    # Golden Visa Work Permit has signature between two distinct OTP checkpoints.
    page.get_by_role("button",name="Edit answers").click()
    choose(page,"service","wp")
    choose(page,"residency","golden")
    page.get_by_role("button",name="View service").click()
    doc=page.locator(".detail-section").filter(has=page.get_by_role("heading",name="Documents",exact=True))
    assert "Attested Education Certificate" in doc.inner_text()
    assert "Education Details document" not in doc.inner_text()
    assert "Educational Verification / Equivalency" not in doc.inner_text()
    assert "Name differences in education documents" in doc.inner_text()
    gro=page.locator(".gro-step h3").all_inner_texts()
    assert gro.index("OTP 1 — Contract Typing") < gro.index("MOHRE Digital Contract Signature") < gro.index("OTP 2 — Before Contract Submission") < gro.index("Submit Work Permit to MOHRE")
    assert len([s for s in gro if s.startswith("OTP ")]) == 2
    actions=page.locator(".detail-section").filter(has=page.get_by_role("heading",name="Candidate Actions",exact=True)).inner_text()
    assert "Mobilisation" in actions and "digital" in actions.lower()
    assert page.get_by_role("button",name="Print").is_visible()

    # DWC Work Permit keeps authority's own digital signature and no OTP.
    page.get_by_role("button",name="Edit answers").click()
    choose(page,"entity","dwc")
    choose(page,"service","wp")
    choose(page,"residency","relative")
    page.get_by_role("button",name="View service").click()
    gro=page.locator(".gro-step h3").all_inner_texts()
    assert gro == ["DWC Portal","Work Permit Processing","Digital Candidate Signature","Work Permit Approval"]
    assert page.locator(".result-main").get_by_text("Name differences in education documents").count()==1

    # Mobile and print do not lose new conditional note.
    page.set_viewport_size({"width":390,"height":844})
    assert page.locator("body").evaluate("(el)=>el.scrollWidth <= window.innerWidth")
    page.emulate_media(media="print")
    assert page.get_by_text("Name differences in education documents").is_visible()
    page.emulate_media(media="screen")
    browser.close()
