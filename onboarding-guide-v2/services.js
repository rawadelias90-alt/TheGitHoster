export const ENTITIES = [
  { value: "ad", label: "Abu Dhabi", group: "Mainland" },
  { value: "dubai", label: "Dubai", group: "Mainland" },
  { value: "alain", label: "Al Ain", group: "Mainland" },
  { value: "dwc", label: "Dubai South (DWC)", group: "Free Zone / DWC" },
];

export const SERVICE_TYPES = [
  { value: "ev", label: "Employment Visa and Work Permit", help: "AECOM-sponsored employment visa and Work Permit." },
  { value: "wp", label: "Work Permit", help: "For candidates who already hold a Golden Visa or Relative / Family Visa." },
  { value: "nat", label: "Emirati and GCC National Work Permit", help: "For Emirati and GCC National candidates." },
];

export const NATIONALITIES = [
  { value: "india", label: "India" },
  { value: "pakistan", label: "Pakistan" },
  { value: "egypt", label: "Egypt" },
  { value: "srilanka", label: "Sri Lanka" },
  { value: "syria", label: "Syria" },
  { value: "other", label: "Another nationality" },
];

const entityLabel = (entity) => ENTITIES.find(item => item.value === entity)?.label ?? "";
const mainland = (entity) => ["ad", "dubai", "alain"].includes(entity);
const intake1Required = (entity, service) => mainland(entity) && service !== "nat";
const pensionFund = (entity) => ["ad", "alain"].includes(entity) ? "ADPF" : "GPSSA";

export function isSpecialHire({ entity, service, hireStatus, nationality }) {
  if (service !== "ev" || hireStatus !== "overseas") return false;
  if (["ad", "alain"].includes(entity)) return ["india", "pakistan", "egypt", "srilanka"].includes(nationality);
  if (entity === "dwc") return ["egypt", "srilanka"].includes(nationality);
  return false;
}

function commonDocuments(entity, specialHire = false, relative = false) {
  const required = [
    "Passport copy",
    "Candidate photograph",
    "Signed AECOM Offer / Contract",
  ];
  const conditional = [
    "Education certificate attested by MoFA UAE, for applicable skilled classification",
    "Police Clearance Certificate, where requested or applicable",
    "Emirates ID and current UAE visa / residency, where applicable",
  ];
  if (["dubai", "dwc"].includes(entity)) {
    conditional.push("External Cover Passport, where applicable");
  }
  if (specialHire) {
    conditional.push("Home-country National ID");
  }
  if (relative) {
    conditional.push("Sponsor passport, residence visa, Emirates ID and No Objection Certificate, where required");
  }
  return { required, conditional };
}

function employmentJourney(entity, hireStatus, specialHire) {
  const steps = [];
  if (intake1Required(entity, "ev")) steps.push("Intake 1");
  steps.push("Client Approval", "Intake 2", "GRO processing");
  if (specialHire) steps.push("Special Hire actions");
  steps.push(hireStatus === "local" ? "Visa & Status Change" : "Visa issuance");
  steps.push("Joining");
  steps.push("Post-joining");
  return steps;
}

function workPermitJourney(entity) {
  const steps = [];
  if (intake1Required(entity, "wp")) steps.push("Intake 1");
  steps.push("Client Approval", "Intake 2", "Work Permit approval", "Joining");
  return steps;
}

function nationalJourney(entity) {
  return ["Client Approval", "Intake 2", "Work Permit approval", "Medical", "Joining", `${pensionFund(entity)} pension`];
}

function buildCase({
  serviceId, title, entity, service, descriptor, specialHire = false, intake1,
  documents, candidateActions, journey, next, joining, afterJoining, note,
}) {
  return {
    serviceId,
    title,
    entity,
    entityLabel: entityLabel(entity),
    service,
    descriptor,
    specialHire,
    intake1,
    documents,
    candidateActions,
    journey,
    beforeIntake2: `${intake1 ? "Complete Intake 1 passport and photo quality verification, then " : ""}obtain Client Approval and confirm the applicable documents are current before Intake 2.`,
    next,
    joining,
    afterJoining,
    note,
    outcome: service === "ev" ? (descriptor.includes("Local") ? "Visa + Status Change" : "Entry Visa") : "Work Permit",
  };
}

function employmentCase(entity, hireStatus, specialHire = false) {
  const isDwc = entity === "dwc";
  const local = hireStatus === "local";
  const descriptor = `${local ? "Local Hire" : "Overseas Hire"}${specialHire ? " · Special Hire" : ""}`;
  const actions = [];
  if (specialHire) {
    actions.push(
      "Attend the applicable home-country medical coordinated through Mobilisation.",
      "Follow Mobilisation instructions for the UAE Embassy / original-passport stage where applicable."
    );
  }
  if (isDwc) {
    actions.push(local
      ? "Complete the digital candidate signature when requested during the DWC process."
      : "Complete the digital candidate signature when requested; for standard overseas DWC cases this follows Visa Approval.");
  } else {
    actions.push("Complete the candidate signature when requested by Mobilisation.");
  }
  if (local) {
    actions.push(isDwc
      ? "The DWC visa and Status Change are completed within the same authority process."
      : "After visa issuance, Mobilisation requests Status Change and confirms completion before joining.");
  }
  const id = `ev-${isDwc ? "dwc" : "mainland"}-${local ? "local" : specialHire ? "overseas-special" : "overseas"}`;
  return buildCase({
    serviceId: id,
    title: "Employment Visa and Work Permit",
    entity,
    service: "ev",
    descriptor,
    specialHire,
    intake1: intake1Required(entity, "ev"),
    documents: commonDocuments(entity, specialHire, false),
    candidateActions: actions,
    journey: employmentJourney(entity, hireStatus, specialHire),
    next: "Mobilisation submits Intake 2 once Client Approval and the applicable preparation are complete.",
    joining: local
      ? (isDwc
          ? "Mobilisation confirms joining once the DWC visa and Status Change process is complete."
          : "Mobilisation confirms joining after visa issuance and completed Status Change.")
      : "Mobilisation provides the applicable travel and joining guidance after visa issuance.",
    afterJoining: "Medical Fitness, Emirates ID, residence completion and final employee documentation apply, as relevant to the Employment Visa case.",
    note: "Mobilisation manages candidate communication. Guidance only: the tool does not verify document readiness, approval or joining authorisation.",
  });
}

function workPermitCase(entity, residency) {
  const isDwc = entity === "dwc";
  const relative = residency === "relative";
  return buildCase({
    serviceId: `wp-${isDwc ? "dwc" : "mainland"}-${residency}`,
    title: relative ? "Relative / Family Visa Work Permit" : "Golden Visa Work Permit",
    entity,
    service: "wp",
    descriptor: relative ? "Existing UAE residency · Relative / Family Visa" : "Existing UAE residency · Golden Visa",
    intake1: intake1Required(entity, "wp"),
    documents: commonDocuments(entity, false, relative),
    candidateActions: [
      isDwc ? "Complete the digital candidate signature when requested." : "Complete the candidate signature when requested by Mobilisation."
    ],
    journey: workPermitJourney(entity),
    next: "Mobilisation submits Intake 2 once Client Approval and the applicable documents are ready.",
    joining: "The candidate can join after Work Permit approval and Mobilisation confirmation.",
    afterJoining: "No new AECOM residence visa, Medical Fitness or Emirates ID process applies under this service.",
    note: "Mobilisation manages candidate communication. Guidance only: existing residency must remain valid and applicable to the selected service.",
  });
}

function nationalCase(entity, category) {
  const isDwc = entity === "dwc";
  return buildCase({
    serviceId: `nat-${isDwc ? "dwc" : "mainland"}-${category}`,
    title: category === "emirati" ? "Emirati National Work Permit" : "GCC National Work Permit",
    entity,
    service: "nat",
    descriptor: category === "emirati" ? "Emirati candidate" : "GCC National candidate",
    intake1: false,
    documents: commonDocuments(entity, false, false),
    candidateActions: [
      isDwc ? "Complete the digital candidate signature when requested." : "Complete the candidate signature when requested by Mobilisation.",
      "Complete the required Medical after Work Permit approval.",
    ],
    journey: nationalJourney(entity),
    next: "Mobilisation submits Intake 2 after Client Approval and the applicable preparation are complete.",
    joining: "After Work Permit approval, complete the required Medical, then progress joining / employment activity with Mobilisation.",
    afterJoining: `${pensionFund(entity)} pension enrollment applies using the ${isDwc ? "DWC" : "MOHRE"} Work Permit start date, not the joining date.`,
    note: "Mobilisation manages candidate communication. Guidance only: pension and joining actions are progressed by the responsible teams after the applicable approvals.",
  });
}

export const SERVICES = [
  employmentCase("ad", "local"),
  employmentCase("ad", "overseas", false),
  employmentCase("ad", "overseas", true),
  employmentCase("dwc", "local"),
  employmentCase("dwc", "overseas", false),
  employmentCase("dwc", "overseas", true),
  workPermitCase("ad", "golden"),
  workPermitCase("ad", "relative"),
  workPermitCase("dwc", "golden"),
  workPermitCase("dwc", "relative"),
  nationalCase("ad", "emirati"),
  nationalCase("ad", "gcc"),
  nationalCase("dwc", "emirati"),
  nationalCase("dwc", "gcc"),
];

function cloneForEntity(base, entity) {
  const copy = structuredClone(base);
  copy.entity = entity;
  copy.entityLabel = entityLabel(entity);
  if (copy.service === "nat") {
    copy.afterJoining = `${pensionFund(entity)} pension enrollment applies using the MOHRE Work Permit start date, not the joining date.`;
    copy.journey[copy.journey.length - 1] = `${pensionFund(entity)} pension`;
  }
  if (entity === "dubai" && copy.documents.conditional.every(item => !item.startsWith("External Cover Passport"))) {
    copy.documents.conditional.push("External Cover Passport, where applicable");
  }
  return copy;
}

function findBase(serviceId) {
  return SERVICES.find(item => item.serviceId === serviceId);
}

export function resolveCase(state) {
  const { entity, service, hireStatus, nationality, residency, category } = state;
  if (!ENTITIES.some(item => item.value === entity)) return null;
  if (!SERVICE_TYPES.some(item => item.value === service)) return null;

  const isDwc = entity === "dwc";
  const baseEntity = isDwc ? "dwc" : "ad";

  if (service === "ev") {
    if (!["local", "overseas"].includes(hireStatus)) return null;
    if (hireStatus === "overseas" && !NATIONALITIES.some(item => item.value === nationality)) return null;
    const special = isSpecialHire(state);
    const id = `ev-${isDwc ? "dwc" : "mainland"}-${hireStatus === "local" ? "local" : special ? "overseas-special" : "overseas"}`;
    const base = findBase(id);
    return entity === baseEntity ? structuredClone(base) : cloneForEntity(base, entity);
  }

  if (service === "wp") {
    if (!["golden", "relative"].includes(residency)) return null;
    const id = `wp-${isDwc ? "dwc" : "mainland"}-${residency}`;
    const base = findBase(id);
    return entity === baseEntity ? structuredClone(base) : cloneForEntity(base, entity);
  }

  if (service === "nat") {
    if (!["emirati", "gcc"].includes(category)) return null;
    const id = `nat-${isDwc ? "dwc" : "mainland"}-${category}`;
    const base = findBase(id);
    return entity === baseEntity ? structuredClone(base) : cloneForEntity(base, entity);
  }

  return null;
}

export function getQuestionSequence(state) {
  const sequence = ["entity"];
  if (!state.entity) return sequence;
  sequence.push("service");
  if (!state.service) return sequence;

  if (state.service === "ev") {
    sequence.push("hireStatus");
    if (state.hireStatus === "overseas") sequence.push("nationality");
  } else if (state.service === "wp") {
    sequence.push("residency");
  } else if (state.service === "nat") {
    sequence.push("category");
  }
  return sequence;
}

export function browseCases(entityFilter = "all", serviceFilter = "all") {
  const entities = entityFilter === "all" ? ["ad", "dubai", "alain", "dwc"] : [entityFilter];
  const out = [];
  for (const entity of entities) {
    const templates = SERVICES.filter(item => item.entity === (entity === "dwc" ? "dwc" : "ad"));
    for (const item of templates) {
      if (serviceFilter !== "all" && item.service !== serviceFilter) continue;
      out.push(entity === item.entity ? structuredClone(item) : cloneForEntity(item, entity));
    }
  }

  const seen = new Set();
  return out.filter(item => {
    const key = `${item.entity}:${item.serviceId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
