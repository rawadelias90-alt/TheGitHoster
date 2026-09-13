(() => {
  "use strict";

  const EMPLOYMENT_SERVICE = "Employment Visa & Work Permit";
  const steps = ["welcome", "candidate", "visa", "documents", "review", "confirmation"];

  const state = {
    currentStep: "welcome",
    draft: {
      candidate: {},
      visa: {}
    },
    attachments: [],
    submittedRequest: null,
    isSubmitting: false
  };

  const candidateForm = document.querySelector("#candidateForm");
  const visaForm = document.querySelector("#visaForm");
  const serviceType = document.querySelector("#serviceType");
  const specialHireGroup = document.querySelector("#specialHireGroup");
  const specialHireCase = document.querySelector("#specialHireCase");
  const equivalencyGroup = document.querySelector("#equivalencyGroup");
  const certificateOfEquivalency = document.querySelector("#certificateOfEquivalency");
  const documentInput = document.querySelector("#documentInput");
  const documentList = document.querySelector("#documentList");
  const reviewSummary = document.querySelector("#reviewSummary");
  const submitRequest = document.querySelector("#submitRequest");
  const statusMessage = document.querySelector("#statusMessage");
  const simulateUploadFailure = document.querySelector("#simulateUploadFailure");
  const confirmationText = document.querySelector("#confirmationText");

  function formDataToObject(form) {
    return Object.fromEntries(new FormData(form).entries());
  }

  function applyObjectToForm(form, values) {
    Object.entries(values).forEach(([name, value]) => {
      const control = form.elements.namedItem(name);
      if (control && typeof value === "string") control.value = value;
    });
  }

  function updateDraft(section, form) {
    state.draft[section] = {
      ...state.draft[section],
      ...formDataToObject(form)
    };
  }

  function showScreen(step) {
    if (!steps.includes(step)) return;
    state.currentStep = step;

    document.querySelectorAll("[data-screen]").forEach((screen) => {
      const active = screen.dataset.screen === step;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });

    const activeIndex = steps.indexOf(step);
    document.querySelectorAll("[data-progress]").forEach((item) => {
      const index = steps.indexOf(item.dataset.progress);
      item.classList.toggle("is-active", index === activeIndex);
      item.classList.toggle("is-complete", index < activeIndex);
    });

    if (step === "candidate") applyObjectToForm(candidateForm, state.draft.candidate);
    if (step === "visa") {
      applyObjectToForm(visaForm, state.draft.visa);
      updateVisaBranch();
    }
    if (step === "review") renderReview();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateVisaBranch() {
    const isEmploymentService = serviceType.value === EMPLOYMENT_SERVICE;
    specialHireGroup.hidden = !isEmploymentService;
    specialHireCase.disabled = !isEmploymentService;
    specialHireCase.required = isEmploymentService;

    if (!isEmploymentService) {
      specialHireCase.value = "";
      certificateOfEquivalency.value = "";
      state.draft.visa.specialHireCase = "";
      state.draft.visa.certificateOfEquivalency = "";
    }

    const isCaseB = isEmploymentService && specialHireCase.value === "No";
    equivalencyGroup.hidden = !isCaseB;
    certificateOfEquivalency.disabled = !isCaseB;
    certificateOfEquivalency.required = isCaseB;

    if (!isCaseB) {
      certificateOfEquivalency.value = "";
      state.draft.visa.certificateOfEquivalency = "";
    }
  }

  function renderDocuments() {
    documentList.innerHTML = "";

    if (state.attachments.length === 0) {
      const empty = document.createElement("li");
      empty.textContent = "No documents staged.";
      documentList.append(empty);
      return;
    }

    state.attachments.forEach((file) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      const size = document.createElement("span");
      name.textContent = file.name;
      size.textContent = formatFileSize(file.size);
      item.append(name, size);
      documentList.append(item);
    });
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function displayValue(value) {
    return value && String(value).trim() ? String(value) : "—";
  }

  function createReviewSection(title, rows) {
    const section = document.createElement("section");
    section.className = "review-section";

    const heading = document.createElement("h3");
    heading.textContent = title;
    section.append(heading);

    const list = document.createElement("dl");
    list.className = "review-list";

    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "review-row";
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = displayValue(value);
      row.append(term, description);
      list.append(row);
    });

    section.append(list);
    return section;
  }

  function renderReview() {
    updateDraft("candidate", candidateForm);
    updateDraft("visa", visaForm);

    const candidate = state.draft.candidate;
    const visa = state.draft.visa;
    const branch = visa.serviceType === EMPLOYMENT_SERVICE
      ? (visa.specialHireCase === "No" ? "Case B" : visa.specialHireCase === "Yes" ? "Case A" : "—")
      : "Not applicable";

    reviewSummary.innerHTML = "";
    reviewSummary.append(
      createReviewSection("Candidate", [
        ["Candidate name", candidate.candidateName],
        ["Nationality", candidate.nationality],
        ["Mobilisation location", candidate.mobilisationLocation],
        ["Email", candidate.email],
        ["Phone", candidate.phone],
        ["Employment start", candidate.employmentDate]
      ]),
      createReviewSection("Visa", [
        ["Service type", visa.serviceType],
        ["Country of birth", visa.countryOfBirth],
        ["UID", visa.uid],
        ["Mother's name", visa.mothersName],
        ["Marital status", visa.maritalStatus],
        ["Sponsorship location", visa.sponsorshipLocation],
        ["Branch", branch],
        ["Special Hire Case", visa.specialHireCase],
        ["Certificate of Equivalency", visa.certificateOfEquivalency]
      ]),
      createReviewSection("Documents", state.attachments.length
        ? state.attachments.map((file, index) => [`Document ${index + 1}`, `${file.name} (${formatFileSize(file.size)})`])
        : [["Documents", "None staged"]]),
      createReviewSection("Submission boundary", [
        ["Draft storage", "Browser memory only"],
        ["Request record", state.submittedRequest ? `Created in prototype: ${state.submittedRequest.id}` : "Not created"],
        ["Duplicate protection", state.submittedRequest ? "Retry will reuse request ID" : "Ready"]
      ])
    );

    updateSubmitAvailability();
  }

  function formsAreValid() {
    updateVisaBranch();
    return candidateForm.checkValidity() && visaForm.checkValidity();
  }

  function updateSubmitAvailability() {
    submitRequest.disabled = state.isSubmitting || !formsAreValid();
  }

  function setStatus(message = "", type = "") {
    statusMessage.textContent = message;
    if (type) statusMessage.dataset.type = type;
    else delete statusMessage.dataset.type;
  }

  function createPrototypeRequest() {
    const suffix = Date.now().toString().slice(-8);
    return {
      id: `INT-${suffix}`,
      createdAt: new Date().toISOString(),
      candidateName: state.draft.candidate.candidateName || "",
      serviceType: state.draft.visa.serviceType || ""
    };
  }

  async function handleSubmit() {
    if (state.isSubmitting) {
      setStatus("Please wait. A submission is already in progress.", "error");
      return;
    }

    if (!formsAreValid()) {
      setStatus("Candidate or visa details are incomplete. Go back and complete the required fields.", "error");
      updateSubmitAvailability();
      return;
    }

    state.isSubmitting = true;
    updateSubmitAvailability();
    setStatus("Submitting prototype request…");

    if (!state.submittedRequest) {
      state.submittedRequest = createPrototypeRequest();
    }

    await new Promise((resolve) => window.setTimeout(resolve, 450));

    if (simulateUploadFailure.checked) {
      state.isSubmitting = false;
      setStatus(
        `Upload failed in prototype test mode. Retry will reuse request ${state.submittedRequest.id}.`,
        "error"
      );
      renderReview();
      return;
    }

    state.isSubmitting = false;
    confirmationText.textContent = `Prototype request ${state.submittedRequest.id} completed using the guarded submit sequence.`;
    setStatus("Prototype submission complete.", "success");
    showScreen("confirmation");
  }

  function resetState() {
    state.currentStep = "welcome";
    state.draft = { candidate: {}, visa: {} };
    state.attachments = [];
    state.submittedRequest = null;
    state.isSubmitting = false;

    candidateForm.reset();
    visaForm.reset();
    documentInput.value = "";
    simulateUploadFailure.checked = false;
    setStatus();
    updateVisaBranch();
    renderDocuments();
    showScreen("candidate");
  }

  document.querySelector("#startRequest").addEventListener("click", resetState);
  document.querySelector("#newRequest").addEventListener("click", resetState);

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.currentStep === "candidate") updateDraft("candidate", candidateForm);
      if (state.currentStep === "visa") updateDraft("visa", visaForm);
      showScreen(button.dataset.go);
    });
  });

  candidateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!candidateForm.reportValidity()) return;
    updateDraft("candidate", candidateForm);
    showScreen("visa");
  });

  visaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateVisaBranch();
    if (!visaForm.reportValidity()) return;
    updateDraft("visa", visaForm);
    showScreen("documents");
  });

  serviceType.addEventListener("change", () => {
    updateVisaBranch();
    updateDraft("visa", visaForm);
  });

  specialHireCase.addEventListener("change", () => {
    updateVisaBranch();
    updateDraft("visa", visaForm);
  });

  documentInput.addEventListener("change", () => {
    state.attachments = Array.from(documentInput.files || []).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    renderDocuments();
  });

  document.querySelector("#toReview").addEventListener("click", () => showScreen("review"));
  submitRequest.addEventListener("click", handleSubmit);

  candidateForm.addEventListener("input", updateSubmitAvailability);
  visaForm.addEventListener("input", updateSubmitAvailability);

  updateVisaBranch();
  renderDocuments();
  showScreen("welcome");
})();
