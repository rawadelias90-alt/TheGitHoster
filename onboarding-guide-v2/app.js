import { ENTITIES, SERVICE_TYPES, NATIONALITIES, resolveCase, getQuestionSequence, browseCases } from "./services.js";

const app = document.getElementById("app");

const state = {
  mode: "welcome",
  answers: {
    entity: "",
    service: "",
    hireStatus: "",
    nationality: "",
    residency: "",
    category: "",
  },
  questionIndex: 0,
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
    help: "Local Hire and Overseas Hire are confirmed case facts.",
    options: [
      { value: "local", label: "Local Hire" },
      { value: "overseas", label: "Overseas Hire" },
    ],
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
    help: "V1 covers Golden Visa and Relative / Family Visa Work Permit cases.",
    options: [
      { value: "golden", label: "Golden Visa" },
      { value: "relative", label: "Relative / Family Visa" },
    ],
  },
  category: {
    title: "Which candidate category applies?",
    label: "Candidate category",
    placeholder: "Select category",
    help: "This service is limited to Emirati and GCC National candidates.",
    options: [
      { value: "emirati", label: "Emirati" },
      { value: "gcc", label: "GCC National" },
    ],
  },
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
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

function clearDownstream(changedKey) {
  const order = ["entity","service","hireStatus","nationality","residency","category"];
  const index = order.indexOf(changedKey);
  for (let i = index + 1; i < order.length; i++) state.answers[order[i]] = "";

  if (changedKey === "service") {
    state.answers.hireStatus = "";
    state.answers.nationality = "";
    state.answers.residency = "";
    state.answers.category = "";
  }
  if (changedKey === "hireStatus" && state.answers.hireStatus !== "overseas") {
    state.answers.nationality = "";
  }
  state.result = null;
}

function renderWelcome() {
  app.innerHTML = `
    <section class="screen welcome">
      <div>
        <p class="eyebrow">AECOM UAE onboarding</p>
        <h1 class="display-title" data-screen-heading tabindex="-1">UAE New Hire Guide</h1>
        <p class="lede">Find the onboarding requirements, documents and next steps that apply to a UAE new hire.</p>
        <div class="welcome-actions">
          <button class="primary-button" type="button" data-action="start">Start guided journey</button>
          <button class="secondary-button" type="button" data-action="browse">Explore all services</button>
        </div>
      </div>
      <aside class="welcome-aside">
        <strong>How to use the guide</strong>
        Answer only the questions relevant to the candidate. The guide then presents the applicable preparation, documents, candidate actions and joining guidance. If you already know what you need, browse all services instead.
      </aside>
    </section>
  `;
}

function currentSequence() {
  return getQuestionSequence(state.answers);
}

function renderQuestion() {
  const sequence = currentSequence();
  state.questionIndex = Math.max(0, Math.min(state.questionIndex, sequence.length - 1));
  const key = sequence[state.questionIndex];
  const question = QUESTIONS[key];
  const value = state.answers[key] || "";
  const progress = Math.round(((state.questionIndex + 1) / sequence.length) * 100);
  const finalKnownQuestion = key === "nationality" || key === "residency" || key === "category" || (key === "hireStatus" && value === "local");
  const nextLabel = finalKnownQuestion ? "View service" : "Continue";

  app.innerHTML = `
    <section class="screen question-screen">
      <div class="progress-row">
        <span>Question ${state.questionIndex + 1} of ${sequence.length}</span>
        <div class="progress-track" aria-hidden="true"><span style="width:${progress}%"></span></div>
      </div>
      <p class="eyebrow">Guided journey</p>
      <h1 class="question-title" data-screen-heading tabindex="-1">${escapeHtml(question.title)}</h1>
      <p class="question-help">${escapeHtml(question.help)}</p>
      <div class="question-field">
        <label class="question-label" for="questionSelect">${escapeHtml(question.label)}</label>
        <div class="select-wrap">
          <select id="questionSelect" data-question="${key}">
            <option value="">${escapeHtml(question.placeholder)}</option>
            ${question.options.map(option => `<option value="${escapeHtml(option.value)}" ${value === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
          </select>
        </div>
        <div class="question-actions">
          <button class="back-button" type="button" data-action="question-back">${state.questionIndex === 0 ? "Back to start" : "Back"}</button>
          <button class="primary-button" type="button" data-action="question-next" ${value ? "" : "disabled"}>${nextLabel}</button>
        </div>
      </div>
    </section>
  `;
}

function renderJourney(result) {
  return result.journey.map((step, index) => `
    <li class="journey-item">
      <span class="journey-index">${String(index + 1).padStart(2,"0")}</span>
      <span class="journey-name">${escapeHtml(step)}</span>
    </li>
  `).join("");
}

function renderList(items) {
  return `<ul class="clean-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderResult(result) {
  state.result = result;
  app.innerHTML = `
    <section class="screen result-layout">
      <aside class="journey-rail" aria-label="Service journey">
        <p class="journey-label">Your journey</p>
        <ol class="journey-list">${renderJourney(result)}</ol>
      </aside>

      <article class="result-main">
        <details class="mobile-journey">
          <summary>Your journey <span aria-hidden="true">+</span></summary>
          <ol>${result.journey.map(step => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </details>

        <header class="result-hero">
          <div class="result-kicker">
            <span>${escapeHtml(result.entityLabel)}</span>
            <span>·</span>
            <span>${escapeHtml(result.descriptor)}</span>
            ${result.specialHire ? `<span class="badge">Special Hire applies</span>` : ""}
          </div>
          <h1 class="result-title" data-screen-heading tabindex="-1">${escapeHtml(result.title)}</h1>
          <div class="summary-grid">
            <section class="summary-item">
              <h3>Before Intake 2</h3>
              <p>${escapeHtml(result.beforeIntake2)}</p>
            </section>
            <section class="summary-item">
              <h3>Next</h3>
              <p>${escapeHtml(result.next)}</p>
            </section>
            <section class="summary-item">
              <h3>Joining</h3>
              <p>${escapeHtml(result.joining)}</p>
            </section>
          </div>
        </header>

        <section class="detail-section">
          <h2>Documents</h2>
          <h3>Required</h3>
          ${renderList(result.documents.required)}
          <h3>Where applicable / requested</h3>
          ${renderList(result.documents.conditional)}
        </section>

        <section class="detail-section">
          <h2>Candidate actions</h2>
          ${renderList(result.candidateActions)}
        </section>

        <section class="detail-section">
          <h2>${result.service === "nat" ? "After Work Permit approval" : "After joining"}</h2>
          <p>${escapeHtml(result.afterJoining)}</p>
          <div class="guidance-note">${escapeHtml(result.note)}</div>
        </section>

        <div class="result-actions">
          <button class="secondary-button" type="button" data-action="edit">Edit answers</button>
          <button class="secondary-button" type="button" data-action="restart">Start again</button>
          <button class="primary-button" type="button" data-action="browse">Explore more services</button>
        </div>
      </article>
    </section>
  `;
}

function shortBefore(caseItem) {
  return caseItem.intake1 ? "Intake 1 + Client Approval" : "Client Approval";
}

function renderCatalogue() {
  const cases = browseCases(state.browseEntity, state.browseService);
  app.innerHTML = `
    <section class="screen">
      <header class="catalogue-header">
        <p class="eyebrow">Browse services</p>
        <h1 class="catalogue-title" data-screen-heading tabindex="-1">Explore UAE onboarding services</h1>
        <p class="catalogue-subtitle">Browse the supported services without completing the guided questions.</p>
      </header>

      <div class="filter-bar">
        <div class="filter-group">
          <label for="browseEntity">Entity / location</label>
          <select id="browseEntity">
            <option value="all">All locations</option>
            ${ENTITIES.map(item => `<option value="${item.value}" ${state.browseEntity===item.value?"selected":""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </div>
        <div class="filter-group">
          <label for="browseService">Service</label>
          <select id="browseService">
            <option value="all">All services</option>
            ${SERVICE_TYPES.map(item => `<option value="${item.value}" ${state.browseService===item.value?"selected":""}>${escapeHtml(item.label)}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="catalogue-grid">
        ${cases.length ? cases.map(item => `
          <details class="service-preview-card">
            <summary>
              <div>
                <div class="preview-title">${escapeHtml(item.title)}</div>
                <div class="preview-meta">${escapeHtml(item.entityLabel)} · ${escapeHtml(item.descriptor)}</div>
              </div>
              <div class="preview-outcome">${escapeHtml(item.outcome)}</div>
            </summary>
            <div class="preview-body">
              <div class="preview-grid">
                <div><strong>Before Intake 2</strong>${escapeHtml(shortBefore(item))}</div>
                <div><strong>Next</strong>${escapeHtml(item.next)}</div>
                <div><strong>Joining</strong>${escapeHtml(item.joining)}</div>
              </div>
              <button class="primary-button" type="button" data-action="view-service" data-service-id="${escapeHtml(item.serviceId)}" data-entity="${escapeHtml(item.entity)}">View full service</button>
            </div>
          </details>
        `).join("") : `<div class="catalogue-empty">No services match these filters.</div>`}
      </div>

      <div class="result-actions">
        <button class="secondary-button" type="button" data-action="home">Back to guide</button>
        <button class="primary-button" type="button" data-action="start">Start guided journey</button>
      </div>
    </section>
  `;
}

function render() {
  if (state.mode === "welcome") renderWelcome();
  else if (state.mode === "guided") renderQuestion();
  else if (state.mode === "result" && state.result) renderResult(state.result);
  else if (state.mode === "browse") renderCatalogue();
}

function questionNext() {
  const sequence = currentSequence();
  const key = sequence[state.questionIndex];
  if (!state.answers[key]) return;

  const refreshed = currentSequence();
  const currentKeyIndex = refreshed.indexOf(key);
  if (currentKeyIndex < refreshed.length - 1) {
    state.questionIndex = currentKeyIndex + 1;
    render();
    focusHeading();
    return;
  }

  const result = resolveCase(state.answers);
  if (!result) return;
  state.mode = "result";
  renderResult(result);
  focusHeading();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function questionBack() {
  if (state.questionIndex === 0) {
    setMode("welcome");
    return;
  }
  state.questionIndex -= 1;
  render();
  focusHeading();
}

function findBrowseCase(serviceId, entity) {
  return browseCases(entity, "all").find(item => item.serviceId === serviceId && item.entity === entity) ?? null;
}

app.addEventListener("change", event => {
  if (event.target.id === "questionSelect") {
    const key = event.target.dataset.question;
    state.answers[key] = event.target.value;
    clearDownstream(key);
    render();
    const select = document.getElementById("questionSelect");
    if (select) select.focus();
  }
  if (event.target.id === "browseEntity") {
    state.browseEntity = event.target.value;
    renderCatalogue();
  }
  if (event.target.id === "browseService") {
    state.browseService = event.target.value;
    renderCatalogue();
  }
});

document.addEventListener("click", event => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "home") {
    state.result = null;
    setMode("welcome");
  } else if (action === "start") {
    if (state.mode === "browse") {
      Object.keys(state.answers).forEach(key => state.answers[key] = "");
      state.result = null;
    }
    state.mode = "guided";
    state.questionIndex = 0;
    render();
    focusHeading();
  } else if (action === "browse") {
    state.mode = "browse";
    renderCatalogue();
    focusHeading();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (action === "question-next") {
    questionNext();
  } else if (action === "question-back") {
    questionBack();
  } else if (action === "edit") {
    state.mode = "guided";
    const sequence = currentSequence();
    state.questionIndex = Math.max(0, sequence.length - 1);
    render();
    focusHeading();
  } else if (action === "restart") {
    Object.keys(state.answers).forEach(key => state.answers[key] = "");
    state.questionIndex = 0;
    state.result = null;
    setMode("welcome");
  } else if (action === "view-service") {
    const result = findBrowseCase(actionEl.dataset.serviceId, actionEl.dataset.entity);
    if (result) {
      state.result = result;
      state.mode = "result";
      renderResult(result);
      focusHeading();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
});

render();
