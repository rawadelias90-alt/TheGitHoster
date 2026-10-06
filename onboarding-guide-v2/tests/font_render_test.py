from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
PORT = 8765
server = subprocess.Popen(
    [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
    cwd=ROOT,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

try:
    time.sleep(0.8)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto(f"http://127.0.0.1:{PORT}/", wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        for weight in (300, 400, 700, 800):
            loaded = page.evaluate(
                """async ([weight]) => {
                    const faces = await document.fonts.load(weight + ' 16px "AECOM Sans"', 'AECOM Sans');
                    return faces.length;
                }""",
                [weight],
            )
            assert loaded > 0, f"AECOM Sans weight {weight} did not load"
            assert page.evaluate(
                """([weight]) => document.fonts.check(weight + ' 16px "AECOM Sans"')""",
                [weight],
            )
        assert "AECOM Sans" in page.locator("body").evaluate("el => getComputedStyle(el).fontFamily")

        # Desktop guided flow and field typography.
        page.get_by_role("button", name="Start guided journey").click()
        page.select_option("#question-entity", "ad")
        page.select_option("#question-service", "wp")
        page.select_option("#question-residency", "golden")
        assert page.locator("#question-entity").evaluate("el => getComputedStyle(el).fontWeight") == "400"
        assert "AECOM Sans" in page.locator("#question-entity").evaluate("el => getComputedStyle(el).fontFamily")
        page.get_by_role("button", name="View service").click()
        assert page.locator(".result-title").evaluate("el => getComputedStyle(el).fontWeight") == "800"

        # Print media retains the brand font and hides interactive controls.
        page.emulate_media(media="print")
        assert "AECOM Sans" in page.locator(".result-title").evaluate("el => getComputedStyle(el).fontFamily")
        assert not page.locator(".result-toolbar").is_visible()
        assert page.locator(".result-main").is_visible()
        page.emulate_media(media="screen")

        # Mobile remains within viewport with the same font family.
        page.set_viewport_size({"width": 390, "height": 844})
        assert page.locator("body").evaluate("(el) => el.scrollWidth <= window.innerWidth")
        assert "AECOM Sans" in page.locator("body").evaluate("el => getComputedStyle(el).fontFamily")

        browser.close()
finally:
    server.terminate()
    server.wait(timeout=5)
