"""Reusable navigation helpers for the one-question-at-a-time New Hire Guide."""
QUESTION_ORDER=["entity","service","hireStatus","nationality","residency","category","gccStatus"]

def active_question(page):
    rows=page.locator(".progressive-question:visible")
    assert rows.count()==1, f"Expected exactly one active question; found {rows.count()}"
    return rows.first.get_attribute("data-question-row")

def go_to_question(page,key):
    assert key in QUESTION_ORDER,key
    for _ in range(8):
        current=active_question(page)
        if current==key:
            return
        if QUESTION_ORDER.index(current)>QUESTION_ORDER.index(key):
            page.get_by_role("button",name="Back",exact=True).click()
        else:
            button=page.get_by_role("button",name="Continue",exact=True)
            assert button.is_visible(), f"Cannot advance from {current} toward {key}: answer not selected"
            button.click()
    raise AssertionError(f"Could not navigate to {key}; active={active_question(page)}")

def choose(page,key,value):
    go_to_question(page,key)
    page.select_option(f"#question-{key}",value)

def continue_to_result(page):
    for _ in range(8):
        view=page.get_by_role("button",name="View service",exact=True)
        if view.is_visible():
            return
        more=page.get_by_role("button",name="Continue",exact=True)
        assert more.is_visible(), f"Missing candidate answer at {active_question(page)}"
        more.click()
    raise AssertionError("Could not reach View service")
