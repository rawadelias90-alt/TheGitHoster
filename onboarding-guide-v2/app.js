import { ENTITIES, SERVICE_TYPES, NATIONALITIES, resolveCase, getQuestionSequence, browseCases } from "./services.js";

const app = document.getElementById("app");

const state = {
  mode: "welcome",
  activeQuestion: "entity",
  answers: { entity: "", service: "", hireStatus: "", nationality: "", residency: "", category: "", gccStatus: "" },
  result: null,
  browseEntity: "all",
  browseService: "all",
};

const QUESTIONS = {
  entity: {
    title: "Which AECOM UAE entity is the candidate joining?",
    label: "Sponsoring entity",
    placeholder: "Select the sponsoring entity",
    help: "Choose the legal entity that will sponsor or employ the candidate.",
    options: ENTITIES,
  },
  service: {
    title: "Which service does the candidate need?",
    label: "Service",
    placeholder: "Select a service",
    help: "Choose the service that matches the candidate’s confirmed onboarding case.",
    options: SERVICE_TYPES,
  },
  hireStatus: {
    title: "What is the candidate’s hire status?",
    label: "Hire status",
    placeholder: "Select the confirmed hire status",
    help: "Local Hire and Overseas Hire are confirmed case statuses for Employment Visa routes.",
    options: [{ value: "local", label: "Local Hire" }, { value: "overseas", label: "Overseas Hire" }],
  },
  nationality: {
    title: "What is the candidate’s nationality?",
    label: "Candidate nationality",
    placeholder: "Select nationality",
    help: "Nationality is used only to identify whether the approved Special Hire requirements apply.",
    options: NATIONALITIES,
  },
  residency: {
    title: "What UAE residency does the candidate currently hold?",
    label: "Current UAE residency",
    placeholder: "Select current residency",
    help: "Existing-residency Work Permit routes cover Golden Visa and Relative / Family Visa cases.",
    options: [{ value: "golden", label: "Golden Visa" }, { value: "relative", label: "Relative / Family Visa" }],
  },
  category: {
    title: "Which candidate category applies?",
    label: "Candidate category",
    placeholder: "Select category",
    help: "This service is limited to Emirati and GCC National candidates.",
    options: [{ value: "emirati", label: "Emirati" }, { value: "gcc", label: "GCC National" }],
  },
  gccStatus: {
    title: "What is the GCC candidate's current UAE status?",
    label: "GCC candidate status",
    placeholder: "Select the current UAE status",
    help: "For Mainland GCC National only. This determines whether a UAE Emirates ID or UID is already available.",
    options: [
      { value: "existingEid", label: "Already holds an Emirates ID (local hire)" },
      { value: "existingUid", label: "No Emirates ID, previously entered UAE (existing UID)" },
      { value: "firstEntry", label: "Never entered UAE (first UAE entry)" },
    ],
  },
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}

function setBodyMode() {
  document.body.classList.toggle("landing-mode", state.mode === "welcome");
}

function focusHeading() {
  requestAnimationFrame(() => {
    const heading = app.querySelector("[data-screen-heading]");
    if (heading) heading.focus({ preventScroll: true });
  });
}

function setMode(mode) {
  state.mode = mode;
  render();
  focusHeading();
}

function resetAnswers() {
  Object.keys(state.answers).forEach(key => state.answers[key] = "");
  state.result = null;
  state.activeQuestion = "entity";
}

function clearDownstream(changedKey) {
  const order = ["entity", "service", "hireStatus", "nationality", "residency", "category", "gccStatus"];
  const index = order.indexOf(changedKey);
  for (let i = index + 1; i < order.length; i++) state.answers[order[i]] = "";
  if (changedKey === "service") {
    state.answers.hireStatus = "";
    state.answers.nationality = "";
    state.answers.residency = "";
    state.answers.category = "";
    state.answers.gccStatus = "";
  }
  if (changedKey === "hireStatus" && state.answers.hireStatus !== "overseas") state.answers.nationality = "";
  state.result = null;
}

function renderWelcome() {
  app.innerHTML = `
    <section class="screen landing-cover">
      <div class="cover-title-block">
        <h1 class="cover-title" data-screen-heading tabindex="-1" aria-label="UAE New Hire Guide">
          <span>UAE New Hire</span>
          <span>Guide</span>
        </h1>
      </div>
      <div class="cover-actions" aria-label="Guide entry options">
        <button class="cover-primary" type="button" data-action="start">Start guided journey</button>
        <button class="cover-secondary" type="button" data-action="browse">Explore all services</button>
      </div>
    </section>`;
}

function currentSequence() {
  return getQuestionSequence(state.answers);
}

function focusActiveQuestion() {
  requestAnimationFrame(() => {
    app.querySelector(".progressive-question:not([hidden]) select[data-question]")?.focus({ preventScroll: true });
  });
}

function moveToQuestion(key) {
  if (!currentSequence().includes(key)) return;
  state.activeQuestion = key;
  syncGuidedQuestions();
  window.scrollTo(0, 0);
  focusActiveQuestion();
}

function renderQuestion() {
  const questionKeys = ["entity", "service", "hireStatus", "nationality", "residency", "category", "gccStatus"];
  app.innerHTML = `
    <section class="screen question-screen progressive-screen">
      <p class="eyebrow">Guided journey</p>
      <h1 class="question-title" data-screen-heading tabindex="-1">Find the right onboarding route</h1>
      <p class="question-help">Choose the confirmed case details below. Only questions relevant to the selected route will appear.</p>
      <div class="selection-summary" role="status" aria-label="Selected onboarding details" aria-live="polite" aria-atomic="true" hidden></div>
      <div class="progressive-form" id="progressiveForm">
        ${questionKeys.map((key, index) => {
          const question = QUESTIONS[key];
          return `
            <div class="progressive-question" data-question-row="${key}" ${key === state.activeQuestion ? "" : "hidden"}>
              <div class="progressive-question__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>
              <div class="progressive-question__body">
                <label class="question-label" for="question-${key}">${escapeHtml(question.label)}</label>
                <p class="progressive-question__prompt" id="prompt-${key}">${escapeHtml(question.title)}</p>
                <div class="select-wrap">
                  <select id="question-${key}" data-question="${key}" aria-describedby="prompt-${key} help-${key}">
                    <option value="">${escapeHtml(question.placeholder)}</option>
                    ${question.options.map(option => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("")}
                  </select>
                </div>
                <p class="progressive-question__help" id="help-${key}">${escapeHtml(question.help)}</p>
              </div>
            </div>`;
        }).join("")}
        <div class="progressive-actions">
          <button class="back-button guided-back-button" type="button" data-action="guided-back">Back to start</button>
          <div class="guided-forward-actions">
            <button class="secondary-button guided-next-button" type="button" data-action="guided-next" hidden>Continue</button>
            <button class="primary-button guided-view-button" type="button" data-action="guided-view-service" hidden>View service</button>
          </div>
        </div>
      </div>
    </section>`;
  syncGuidedQuestions();
}

function syncSelectionSummary(sequence, activeIndex, activeAnswered, nextKey) {
  const summary = app.querySelector(".selection-summary");
  if (!summary) return;

  // Show previous completed screens; include the current one only after the last answer.
  const includeCurrent = Boolean(activeAnswered && !nextKey && resolveCase(state.answers));
  const selectedKeys = sequence.slice(0, activeIndex + (includeCurrent ? 1 : 0));
  const selections = selectedKeys
    .filter(key => state.answers[key])
    .map(key => ({
      key,
      label: QUESTIONS[key]?.options.find(option => option.value === state.answers[key])?.label,
    }))
    .filter(item => item.label);

  summary.hidden = selections.length === 0;
  if (!selections.length) {
    summary.replaceChildren();
    return;
  }
  summary.innerHTML = `
    <span class="selection-summary-label">${includeCurrent ? "Selected:" : "Selected so far:"}</span>
    <span class="selection-summary-items">
      ${selections.map((item, index) => `
        <span class="selection-summary-entry">
          ${index ? '<span class="selection-summary-separator" aria-hidden="true">›</span>' : ""}
          <span class="selection-summary-value" data-selection-key="${escapeHtml(item.key)}">${escapeHtml(item.label)}</span>
        </span>
      `).join("")}
    </span>`;
}

function syncGuidedQuestions() {
  const sequence = currentSequence();
  if (!sequence.includes(state.activeQuestion)) state.activeQuestion = sequence[0];
  const activeIndex = sequence.indexOf(state.activeQuestion);
  const nextKey = sequence[activeIndex + 1];
  const activeAnswered = Boolean(state.answers[state.activeQuestion]);
  syncSelectionSummary(sequence, activeIndex, activeAnswered, nextKey);

  app.querySelectorAll("[data-question-row]").forEach(row => {
    const key = row.dataset.questionRow;
    row.hidden = key !== state.activeQuestion;
    const number = row.querySelector(".progressive-question__number");
    if (number && !row.hidden) number.textContent = String(activeIndex + 1).padStart(2, "0");
    const select = row.querySelector("select[data-question]");
    if (select && select.value !== (state.answers[key] || "")) select.value = state.answers[key] || "";
  });
  const back = app.querySelector(".guided-back-button");
  if (back) {
    back.textContent = activeIndex === 0 ? "Back to start" : "Back";
    back.dataset.action = activeIndex === 0 ? "home" : "guided-back";
  }
  const continueButton = app.querySelector(".guided-next-button");
  if (continueButton) continueButton.hidden = !(activeAnswered && nextKey);
  const viewButton = app.querySelector(".guided-view-button");
  if (viewButton) viewButton.hidden = !(activeAnswered && !nextKey && resolveCase(state.answers));
}

const JOURNEY_TARGETS = {
  "Pre-Hire Readiness": "phase-pre-hire",
  "Intake 1": "phase-intake-1",
  "Client Approval": "phase-client-approval",
  "Intake 2": "phase-intake-2",
  "GRO Processing": "phase-gro-processing",
  "Special Hire Requirements": "phase-special-hire",
  "Visa & Status Change": "phase-visa-status-change",
  "Visa Issued": "phase-visa-issued",
  "Travel / Joining": "phase-joining",
  "Joining": "phase-joining",
  "Post-Joining": "phase-post-joining",
  "Work Permit Approval": "phase-work-permit-approval",
  "MOHRE Approval": "phase-mohre-approval",
  "DWC Work Permit Approval": "phase-dwc-approval",
  "Emirates ID": "phase-emirates-id",
  "Pension Registration": "phase-pension",
  "Medical": "phase-medical",
  "Joining / Employment Activity": "phase-joining",
  "Pension Enrollment": "phase-pension",
  "Completion": "phase-completion",
};

function journeyTargetId(label) {
  return JOURNEY_TARGETS[label] || "phase-gro-processing";
}

function groStepTargetId(title) {
  const value = String(title || "").toLowerCase();
  if (value === "visa issued") return "phase-visa-issued";
  if (value === "status change" || value.includes("visa and status change")) return "phase-visa-status-change";
  if (value === "work permit approval") return "phase-work-permit-approval";
  if (value === "mohre approval") return "phase-mohre-approval";
  if (value === "dwc work permit approval") return "phase-dwc-approval";
  return "";
}

function renderJourney(result) {
  return result.journey.map((item, index) => {
    const target = journeyTargetId(item);
    return `
      <li class="journey-item">
        <button class="journey-link" type="button" data-action="journey-scroll" data-target="${escapeHtml(target)}" aria-label="Go to ${escapeHtml(item)}">
          <span class="journey-index">${String(index + 1).padStart(2, "0")}</span>
          <span class="journey-name">${escapeHtml(item)}</span>
        </button>
      </li>`;
  }).join("");
}

function renderList(items) {
  return `<ul class="clean-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderGroProcess(result) {
  return `
    <div class="gro-sequence">
      ${result.groProcess.map((item, index) => {
        const anchorId = groStepTargetId(item.title);
        return `
          <article class="gro-step" ${anchorId ? `id="${anchorId}"` : ""}>
            <div class="gro-step-index">${String(index + 1).padStart(2, "0")}</div>
            <div class="gro-step-body">
              <span class="owner-label">${escapeHtml(item.owner)}</span>
              <h3>${escapeHtml(item.title)}</h3>
              ${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}
            </div>
          </article>`;
      }).join("")}
    </div>
    ${result.groNote ? `<div class="process-note">${escapeHtml(result.groNote)}</div>` : ""}`;
}

function renderFlipCard(title, copy, icon, id = "") {
  const copyId = `overview-${icon}`;
  return `<section class="summary-item" ${id ? `id="${id}"` : ""}>
    <button class="flip-trigger" type="button" data-action="flip-card" aria-expanded="false" aria-controls="${copyId}" aria-label="Read ${title}">
      <span class="flip-inner">
        <span class="flip-front" aria-hidden="false">
          <img src="./assets/icons/${icon}.svg" alt="" width="42" height="42">
          <span class="flip-title">${title}</span><span class="flip-hint">Tap to flip</span>
        </span>
        <span class="flip-back" id="${copyId}" aria-hidden="true">
          <span class="flip-back-title">${title}</span><span class="flip-copy" id="${copyId}-copy">${escapeHtml(copy)}</span>
          <span class="flip-hint">Return to title</span>
        </span>
      </span>
    </button>
  </section>`;
}

function setCardFlipped(button, flipped) {
  button.setAttribute("aria-expanded", String(flipped));
  if (flipped) button.setAttribute("aria-describedby", button.querySelector(".flip-copy").id);
  else button.removeAttribute("aria-describedby");
  button.querySelector(".flip-front").setAttribute("aria-hidden", String(flipped));
  button.querySelector(".flip-back").setAttribute("aria-hidden", String(!flipped));
  const title = button.querySelector(".flip-title").textContent;
  button.setAttribute("aria-label", `${flipped ? "Close" : "Read"} ${title}`);
}

function markJourney(targetId) {
  app.querySelectorAll(".journey-link").forEach(link => {
    if (link.dataset.target === targetId) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function revealJourneyTarget(target) {
  let node = target;
  while (node && node !== app) {
    if (node.tagName === "DETAILS") node.open = true;
    node = node.parentElement;
  }
  const card = target.querySelector('[data-action="flip-card"]');
  if (card) setCardFlipped(card, true);
}

let printSnapshot = null;
function preparePrint() {
  if (state.mode !== "result" || printSnapshot) return;
  printSnapshot = {
    panels: [...app.querySelectorAll(".detail-section")].map(panel => [panel, panel.open]),
    cards: [...app.querySelectorAll('[data-action="flip-card"]')].map(card => [card, card.getAttribute("aria-expanded") === "true"]),
  };
  document.body.classList.add("printing-guide");
  printSnapshot.panels.forEach(([panel]) => panel.open = true);
  printSnapshot.cards.forEach(([card]) => setCardFlipped(card, true));
}
function restoreAfterPrint() {
  if (!printSnapshot) return;
  printSnapshot.panels.forEach(([panel, open]) => panel.open = open);
  printSnapshot.cards.forEach(([card, flipped]) => setCardFlipped(card, flipped));
  printSnapshot = null;
  document.body.classList.remove("printing-guide");
}
window.addEventListener("beforeprint", preparePrint);
window.addEventListener("afterprint", restoreAfterPrint);

function renderResult(result) {
  state.result = result;
  const gccWithNewId = result.category === "gcc" && result.journey.includes("Emirates ID");
  const pensionNumber = gccWithNewId ? "07" : "06";
  const completionNumber = gccWithNewId ? "08" : "07";
  app.innerHTML = `
    <section class="screen result-layout">

      <article class="result-main">
        <div class="result-toolbar">
          <button class="secondary-button print-button" type="button" data-action="print" aria-label="Print service guide"><img src="./assets/icons/print.svg" width="18" height="18" alt="">Print</button>
        </div>


        <header class="result-hero">
          <div class="result-kicker">
            <span>${escapeHtml(result.entityLabel)}</span>
            <span>·</span>
            <span>${escapeHtml(result.descriptor)}</span>
            <span>·</span>
            <span>${escapeHtml(result.authority)}</span>
            <button class="text-button change-selection" type="button" data-action="edit">Change selection</button>
            ${result.specialHire ? `<span class="badge">Special Hire applies</span>` : ""}
          </div>
          <h1 class="result-title" data-screen-heading tabindex="-1">${escapeHtml(result.title)}</h1>

        </header>
      <nav class="journey-rail" aria-label="Service journey">
        <p class="journey-label">Your journey</p>
        <ol class="journey-list">${renderJourney(result)}</ol>
      </nav>
        <details class="mobile-journey">
          <summary>Your journey <img src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <ol class="mobile-journey-list">${renderJourney(result)}</ol>
        </details>
        <div class="summary-grid">
          ${renderFlipCard("Before Intake 2", result.beforeIntake2, "before-intake", "phase-client-approval")}
          ${renderFlipCard("GRO route", result.next, "gro-route", "phase-intake-2")}
          ${renderFlipCard("Joining", result.joining, "joining")}
        </div>

        <details class="detail-section" id="phase-pre-hire" open>
          <summary><span class="section-number">01</span><h2>Pre-Hire Readiness</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">


          <p class="section-intro">Confirm the candidate’s onboarding position before the case progresses. These are readiness checks, not validations performed by this guide.</p>
          ${result.gccStatus === "firstEntry" ? '<div class="process-note">First UAE entry is required: the candidate must travel to the UAE to receive a UID before the MOHRE case can progress.</div>' : ""}
          ${renderList(result.preHireReadiness)}
          ${result.intake1.required ? `
            <div class="intake-card" id="phase-intake-1">
              <div><span class="owner-label">Intake 1</span><h3>${escapeHtml(result.intake1.title)}</h3></div>
              <p>${escapeHtml(result.intake1.detail)}</p>
              <strong>Documents checked</strong>
              ${renderList(result.intake1.documents)}
            </div>` : ""}
        </div>
        </details>

        <details class="detail-section">
          <summary><span class="section-number">02</span><h2>Documents</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">


          <div class="document-columns"><div><h3 class="subsection-title">Required</h3>
          ${renderList(result.documents.required)}</div><div>
          <h3 class="subsection-title">Where applicable / requested</h3>
          ${renderList(result.documents.conditional)}</div></div>
          ${result.educationNameNote ? `
            <div class="process-note education-note" role="note">
              <h3>Name differences in education documents</h3>
              <p>${escapeHtml(result.educationNameNote)}</p>
            </div>` : ""}
        </div>
        </details>

        <details class="detail-section candidate-actions-section">
          <summary><span class="section-number">03</span><h2>Candidate Actions</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">


          ${renderList(result.candidateActions)}
        </div>
        </details>

        <details class="detail-section gro-section" id="phase-gro-processing">
          <summary><span class="section-number">04</span><h2>GRO Processing</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">
          ${result.specialHire ? '<span id="phase-special-hire" class="phase-anchor" aria-hidden="true"></span>' : ""}


          <p class="section-intro">Intake 2 is the formal trigger for GRO processing. The sequence below reflects the selected route.</p>
          ${renderGroProcess(result)}
        </div>
        </details>

        <details class="detail-section" id="phase-joining">
          <summary><span class="section-number">05</span><h2>${escapeHtml(result.joiningHeading)}</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">
          ${result.journey.includes("Medical") ? '<span id="phase-medical" class="phase-anchor" aria-hidden="true"></span>' : ""}


          <p class="large-copy">${escapeHtml(result.joining)}</p>
        </div>
        </details>

        ${gccWithNewId ? `
          <details class="detail-section" id="phase-emirates-id">
          <summary><span class="section-number">06</span><h2>Emirates ID</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">


            <p class="large-copy">${escapeHtml(result.emiratesIdAction)}</p>
          </div>
        </details>` : ""}

        <details class="detail-section" id="${result.category === "gcc" ? "phase-pension" : "phase-post-joining"}">
          <summary><span class="section-number">${pensionNumber}</span><h2>${result.category === "gcc" ? "Pension Registration" : "Post-Joining"}</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">
          ${result.journey.includes("Pension Enrollment") ? '<span id="phase-pension" class="phase-anchor" aria-hidden="true"></span>' : ""}


          ${result.category === "gcc" && !gccWithNewId && result.emiratesIdAction ? `
            <p class="section-intro"><strong>Emirates ID (when applicable):</strong> ${escapeHtml(result.emiratesIdAction)}</p>` : ""}
          <p class="large-copy">${escapeHtml(result.postJoining)}</p>
        </div>
        </details>

        <details class="detail-section completion-section" id="phase-completion">
          <summary><span class="section-number">${completionNumber}</span><h2>Completion Point</h2><img class="section-chevron" src="./assets/icons/chevron-down.svg" width="20" height="20" alt=""></summary>
          <div class="detail-body">


          <p class="completion-copy">${escapeHtml(result.completionPoint)}</p>
          <div class="guidance-note">${escapeHtml(result.guidance)}</div>
        </div>
        </details>

        <div class="result-actions">
          <button class="secondary-button" type="button" data-action="edit">Edit answers</button>
          <button class="secondary-button" type="button" data-action="restart">Start again</button>
          <button class="primary-button" type="button" data-action="browse">Explore more services</button>
        </div>
      </article>
    </section>`;
  markJourney("phase-pre-hire");
}

function shortBefore(item) {
  return item.intake1.required ? "Intake 1 + Client Approval" : "Client Approval";
}

function groSummary(item) {
  return item.groProcess.map(step => step.title).join(" → ");
}

function renderCatalogue() {
  const allCases = browseCases(state.browseEntity, state.browseService);
  // Only one card per Mainland GCC entity; scenario choices live inside that card.
  const cases = allCases.filter(item =>
    !(item.category === "gcc" && item.entity !== "dwc" && item.gccStatus !== "existingEid")
  );
  app.innerHTML = `
    <section class="screen">
      <header class="catalogue-header">
        <p class="eyebrow">Browse services</p>
        <h1 class="catalogue-title" data-screen-heading tabindex="-1">Explore UAE onboarding services</h1>
        <p class="catalogue-subtitle">Browse supported services without completing the guided questions.</p>
      </header>

      <div class="filter-bar">
        <div class="filter-group">
          <label for="browseEntity">Entity / location</label>
          <select id="browseEntity">
            <option value="all">All locations</option>
            ${ENTITIES.map(item => `<option value="${item.value}" ${state.browseEntity === item.value ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </div>
        <div class="filter-group">
          <label for="browseService">Service</label>
          <select id="browseService">
            <option value="all">All services</option>
            ${SERVICE_TYPES.map(item => `<option value="${item.value}" ${state.browseService === item.value ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="catalogue-grid">
        ${cases.length ? cases.map(item => `
          <details class="service-preview-card">
            <summary>
              <div>
                <div class="preview-title">${escapeHtml(item.title)}</div>
                <div class="preview-meta">${escapeHtml(item.entityLabel)} · ${escapeHtml(item.category === "gcc" && item.entity !== "dwc" ? "GCC National · All UAE status scenarios" : item.descriptor)}</div>
              </div>
              <div class="preview-outcome">${escapeHtml(item.outcome)}</div>
            </summary>
            <div class="preview-body">
              <div class="preview-grid">
                <div><strong>Before Intake 2</strong>${escapeHtml(shortBefore(item))}</div>
                <div><strong>Processed through</strong>${escapeHtml(item.authority)}</div>
                <div><strong>Joining</strong>${escapeHtml(item.joining)}</div>
              </div>
              <div class="browse-gro-summary"><strong>GRO route</strong><span>${escapeHtml(groSummary(item))}</span></div>
              ${item.category === "gcc" && item.gccStatus === "existingEid" ? `
                <div class="gcc-choice-panel">
                  <p class="gcc-choice-help">Choose the GCC candidate's UAE status</p>
                  <div class="gcc-choice-list">
                    ${allCases.filter(variant => variant.category === "gcc" && variant.entity === item.entity).map(variant => `
                      <button class="gcc-choice-button" type="button" data-action="view-service" data-service-id="${escapeHtml(variant.serviceId)}" data-entity="${escapeHtml(variant.entity)}">
                        ${escapeHtml(variant.gccStatus === "existingEid" ? "Already has Emirates ID" : variant.gccStatus === "existingUid" ? "Previous UAE entry / UID" : "First UAE entry")}
                        <span aria-hidden="true">↗</span>
                      </button>`).join("")}
                  </div>
                </div>` : `
                <button class="primary-button" type="button" data-action="view-service" data-service-id="${escapeHtml(item.serviceId)}" data-entity="${escapeHtml(item.entity)}">View full service</button>`}
            </div>
          </details>`).join("") : `<div class="catalogue-empty">No services match these filters.</div>`}
      </div>

      <div class="result-actions">
        <button class="secondary-button" type="button" data-action="home">Back to guide</button>
        <button class="primary-button" type="button" data-action="start">Start guided journey</button>
      </div>
    </section>`;
}

function render() {
  setBodyMode();
  if (state.mode === "welcome") renderWelcome();
  else if (state.mode === "guided") renderQuestion();
  else if (state.mode === "result" && state.result) renderResult(state.result);
  else if (state.mode === "browse") renderCatalogue();
}

function findBrowseCase(serviceId, entity) {
  return browseCases(entity, "all").find(item => item.serviceId === serviceId && item.entity === entity) ?? null;
}

app.addEventListener("change", event => {
  if (event.target.matches("select[data-question]")) {
    const key = event.target.dataset.question;
    const changed = state.answers[key] !== event.target.value;
    if (changed) {
      state.answers[key] = event.target.value;
      clearDownstream(key);
    }
    const sequence = currentSequence();
    const next = event.target.value ? sequence[sequence.indexOf(key) + 1] : "";
    if (next) moveToQuestion(next);
    else {
      state.activeQuestion = key;
      syncGuidedQuestions();
    }
    return;
  }
  if (event.target.id === "browseEntity") { state.browseEntity = event.target.value; render(); }
  if (event.target.id === "browseService") { state.browseService = event.target.value; render(); }
});

document.addEventListener("click", event => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "home") {
    state.result = null;
    setMode("welcome");
  } else if (action === "start") {
    if (state.mode === "browse" || state.mode === "welcome") resetAnswers();
    state.activeQuestion = "entity";
    state.mode = "guided";
    render();
    focusActiveQuestion();
  } else if (action === "guided-back") {
    const sequence = currentSequence();
    const index = sequence.indexOf(state.activeQuestion);
    if (state.mode !== "guided" || index <= 0) return;
    moveToQuestion(sequence[index - 1]);
  } else if (action === "guided-next") {
    if (state.mode !== "guided" || !state.answers[state.activeQuestion]) return;
    const sequence = currentSequence();
    const next = sequence[sequence.indexOf(state.activeQuestion) + 1];
    if (next) moveToQuestion(next);
  } else if (action === "browse") {
    state.mode = "browse";
    render();
    focusHeading();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (action === "flip-card") {
    setCardFlipped(actionEl, actionEl.getAttribute("aria-expanded") !== "true");
  } else if (action === "journey-scroll") {
    const target = document.getElementById(actionEl.dataset.target);
    if (target) {
      revealJourneyTarget(target);
      markJourney(actionEl.dataset.target);
      const mobileJourney = actionEl.closest(".mobile-journey");
      if (mobileJourney) mobileJourney.open = false;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        target.scrollIntoView({ behavior, block: "start" });
        const focusTarget = target.querySelector('[data-action="flip-card"]') || (target.tagName === "DETAILS" ? target.querySelector("summary") : target);
        if (!focusTarget.matches("button, summary, a[href], input, select, textarea, [tabindex]")) focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }));
    }
  } else if (action === "print") {
    preparePrint();
    try {
      window.print();
    } finally {
      // Some embedded browsers suppress the dialog and emit no afterprint event.
      if (!window.matchMedia?.("print").matches) restoreAfterPrint();
    }
  } else if (action === "guided-view-service") {
    const result = resolveCase(state.answers);
    if (!result) return;
    state.result = result;
    state.mode = "result";
    render();
    focusHeading();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (action === "edit") {
    state.activeQuestion = "entity";
    state.mode = "guided";
    render();
    focusActiveQuestion();
  } else if (action === "restart") {
    resetAnswers();
    setMode("welcome");
  } else if (action === "view-service") {
    const result = findBrowseCase(actionEl.dataset.serviceId, actionEl.dataset.entity);
    if (result) {
      // Restore only details known from the catalogue; never reuse candidate answers.
      resetAnswers();
      state.answers.entity = result.entity;
      state.answers.service = result.service;
      if (result.service === "ev") {
        state.answers.hireStatus = result.serviceId.endsWith("-local") ? "local" : "overseas";
        // A catalogue route does not identify the candidate's nationality.
      } else if (result.service === "wp") {
        state.answers.residency = result.serviceId.endsWith("-relative") ? "relative" : "golden";
      } else if (result.service === "nat") {
        state.answers.category = result.category;
        state.answers.gccStatus = result.gccStatus ?? "";
      }
      state.result = result;
      state.mode = "result";
      render();
      focusHeading();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});

render();
