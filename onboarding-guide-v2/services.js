export const ENTITIES = [
  { value: "ad", label: "Abu Dhabi", group: "Mainland" },
  { value: "dubai", label: "Dubai", group: "Mainland" },
  { value: "alain", label: "Al Ain", group: "Mainland" },
  { value: "dwc", label: "Dubai South (DWC)", group: "Dubai South (DWC)" },
];

export const SERVICE_TYPES = [
  { value: "ev", label: "Employment Visa and Work Permit", help: "For candidates who require an AECOM-sponsored employment visa and Work Permit." },
  { value: "wp", label: "Work Permit", help: "For candidates who already hold valid UAE residency, including a Golden Visa or Relative / Family Visa." },
  { value: "nat", label: "Emirati and GCC National Work Permit", help: "For Emirati and GCC National candidates." },
];

export const NATIONALITIES = [
  { value: "india", label: "India" },
  { value: "pakistan", label: "Pakistan" },
  { value: "egypt", label: "Egypt" },
  { value: "srilanka", label: "Sri Lanka" },
  { value: "other", label: "Another nationality" },
];

const MAINLAND_ENTITIES = ["ad", "dubai", "alain"];
const COMMON_REQUIRED = ["Passport copy", "Candidate photograph", "Signed AECOM Offer / Contract"];
const EDUCATION_CONDITIONAL = [
  "Education Certificate — required for applicable skilled classifications",
  "Educational Verification / Equivalency — where available and applicable",
  "Award or Education Details document — where the candidate has an education certificate but no verification or equivalency",
];

const entityLabel = entity => ENTITIES.find(item => item.value === entity)?.label ?? "";
const isMainland = entity => MAINLAND_ENTITIES.includes(entity);
const pensionFund = entity => ["ad", "alain"].includes(entity) ? "ADPF" : "GPSSA";

export function isSpecialHire({ entity, service, hireStatus, nationality }) {
  if (service !== "ev" || hireStatus !== "overseas") return false;
  if (["ad", "alain"].includes(entity)) return ["india", "pakistan", "egypt", "srilanka"].includes(nationality);
  if (entity === "dwc") return ["egypt", "srilanka"].includes(nationality);
  return false;
}

function intake1For(entity, service) {
  const required = isMainland(entity) && service !== "nat";
  return {
    required,
    title: required ? "MOHRE Pre-Hire Verification" : "Not required for this route",
    documents: required ? ["Passport copy", "Candidate photograph"] : [],
    detail: required
      ? "Advance MOHRE document-quality verification for the passport copy and candidate photograph only. Intake 1 is not the formal Work Permit application. No education verification is performed through Intake 1."
      : "Intake 1 does not apply to this route.",
  };
}

function readinessFor({ service, hireStatus, specialHire, residency, category }) {
  const items = [
    "Candidate full name matches the passport",
    "Nationality and country of birth are confirmed",
    "Correct sponsoring entity is confirmed",
    "Correct onboarding service is confirmed",
    "Personal email and contact number are confirmed",
    "Current UAE visa / residency is confirmed where applicable",
    "Skilled status is confirmed where applicable",
    "Expected joining date is confirmed for planning and coordination",
  ];
  if (service === "ev") {
    items.push(`Hire status is confirmed as ${hireStatus === "local" ? "Local Hire" : "Overseas Hire"}`);
    if (hireStatus === "overseas") items.push(`Special Hire status is ${specialHire ? "applicable" : "not applicable"} for the selected entity and nationality`);
  }
  if (service === "wp") {
    items.push(`Current UAE residency is confirmed as ${residency === "golden" ? "Golden Visa" : "Relative / Family Visa"}`);
    items.push("Existing UAE residency remains valid and applicable to the Work Permit route");
  }
  if (service === "nat") {
    items.push(`Candidate category is confirmed as ${category === "emirati" ? "Emirati" : "GCC National"}`);
  }
  items.push("Unified Number and Last Working Date are confirmed where available / applicable");
  items.push("Required documents and candidate actions are checked before Intake 2");
  return items;
}

function documentsFor(entity, { specialHire = false, relative = false, category = "" } = {}) {
  const required = [...COMMON_REQUIRED];
  const conditional = [
    ...EDUCATION_CONDITIONAL,
    "Police Clearance Certificate — where requested or applicable",
    "Emirates ID — where applicable",
    "Current UAE visa / residency — where applicable",
  ];

  if (["dubai", "dwc"].includes(entity)) {
    conditional.push("External Cover Passport — required for Dubai Mainland and Dubai South (DWC), where applicable");
  }
  if (specialHire) required.push("Home-country National ID");
  if (relative) {
    conditional.push("Sponsor passport, residence visa, Emirates ID and No Objection Certificate — where applicable");
  }
  if (category === "gcc") required.push("GCC-country National ID");
  if (category === "emirati") required.push("National ID", "Family Book");

  return { required, conditional };
}

const step = (owner, title, detail = "") => ({ owner, title, detail });

function groEmploymentMainlandLocal() {
  return [
    step("GRO", "Submit to MOHRE", "GRO submits the Employment Visa and Work Permit application through MOHRE."),
    step("Candidate", "Employee Signature", "GRO informs Mobilisation when the application reaches signature stage; Mobilisation coordinates completion with the candidate."),
    step("GRO", "GRO Payment", "GRO proceeds with the applicable authority payment after signature completion."),
    step("Authority", "Visa Approval", "The application progresses through the applicable visa approval stage."),
    step("GRO", "Visa Issued", "GRO provides the issued visa result to Mobilisation."),
    step("GRO", "Status Change", "GRO completes the applicable Status Change and provides evidence to Mobilisation."),
  ];
}

function groEmploymentMainlandOverseas(specialHire = false) {
  if (specialHire) {
    return [
      step("GRO", "MOHRE Processing", "GRO manages the Employment Visa and Work Permit application through MOHRE."),
      step("Authority", "Initial Work Permit Approval", "The case reaches the initial Work Permit approval stage before later Special Hire requirements."),
      step("Candidate", "Home-Country Medical", "The candidate completes the required medical in the home country when applicable; this is not an Intake 2 document."),
      step("GRO", "GRO Processing / Payment", "GRO progresses the case and applicable payment after the authority-system result."),
      step("Candidate", "UAE Embassy Process", "Where required, Mobilisation provides original-passport instructions and the candidate completes the UAE Embassy process in the home country."),
      step("Candidate", "Employee Signature", "The candidate completes the required employee signature at the applicable later stage."),
      step("Authority", "Visa Approval", "The case progresses to final visa approval."),
      step("GRO", "Visa Issued", "GRO provides the issued visa to Mobilisation for candidate communication."),
    ];
  }
  return [
    step("GRO", "MOHRE Processing", "GRO manages the Employment Visa and Work Permit application through MOHRE."),
    step("Authority", "Initial Work Permit Approval", "Initial Work Permit approval is obtained."),
    step("Candidate", "Employee Signature", "Mobilisation coordinates the required candidate signature."),
    step("GRO", "GRO Payment", "GRO completes the applicable payment and visa processing."),
    step("Authority", "Visa Approval", "The application progresses to visa approval."),
    step("GRO", "Visa Issued", "GRO provides the issued visa to Mobilisation."),
  ];
}

function groEmploymentDwcLocal() {
  return [
    step("GRO", "DWC Portal", "GRO submits the case through the Dubai South (DWC) process."),
    step("Authority", "DWC / Immigration Approval", "DWC and Immigration approval is obtained."),
    step("Candidate", "Digital Contract Signature", "The candidate completes the required digital contract signature."),
    step("GRO", "Visa and Status Change", "The applicable visa and Status Change process is completed within the DWC route."),
  ];
}

function groEmploymentDwcOverseas(specialHire = false) {
  if (specialHire) {
    return [
      step("GRO", "DWC / Immigration Processing", "GRO manages the DWC and Immigration route."),
      step("Authority", "Initial Approval", "The case reaches the applicable initial approval stage."),
      step("Candidate", "Home-Country Medical", "Completed where required at the applicable later stage; it is not an initial Intake 2 document."),
      step("Candidate", "UAE Embassy Process", "Completed where required at the applicable later stage; it is not an initial Intake 2 document."),
      step("Candidate", "Digital Contract Signature", "The candidate completes the required digital contract signature."),
      step("Authority", "Visa Approval", "The case progresses to visa approval."),
      step("GRO", "Visa Issued", "GRO provides the issued visa to Mobilisation."),
    ];
  }
  return [
    step("GRO", "DWC / Immigration Processing", "GRO manages DWC and Immigration processing."),
    step("Authority", "Visa Approval", "Visa approval is obtained."),
    step("Candidate", "Digital Contract Signature", "The candidate completes the required digital contract signature after Visa Approval."),
    step("GRO", "Visa Issued", "The visa is issued and provided to Mobilisation."),
  ];
}

function groWorkPermit(entity) {
  if (entity === "dwc") {
    return [
      step("GRO", "DWC Portal", "GRO progresses the case through the DWC portal."),
      step("GRO", "Work Permit Processing", "GRO completes the DWC Work Permit processing."),
      step("Candidate", "Digital Candidate Signature", "The candidate completes the required digital signature."),
      step("Authority", "Work Permit Approval", "Work Permit approval is obtained."),
    ];
  }
  return [
    step("GRO", "MOHRE Work Permit Process", "GRO processes the Work Permit through MOHRE."),
    step("Candidate", "Employee Signature", "The candidate completes the required signature when requested by Mobilisation."),
    step("Authority", "Work Permit Approval", "Work Permit approval is obtained and Mobilisation is informed."),
  ];
}

function groNational(entity) {
  if (entity === "dwc") {
    return [
      step("GRO", "DWC Work Permit Process", "GRO processes the National Work Permit through DWC."),
      step("Candidate", "Digital Candidate Signature", "The candidate completes the required digital signature."),
      step("Authority", "Work Permit Approval", "Work Permit approval is obtained before Medical."),
    ];
  }
  return [
    step("GRO", "MOHRE Work Permit", "GRO processes the National Work Permit through MOHRE."),
    step("Candidate", "Candidate Signature", "The candidate completes the required signature."),
    step("Authority", "Work Permit Approval", "Work Permit approval is obtained before Medical."),
  ];
}

function employmentJourney({ intake1, local, specialHire }) {
  const items = ["Pre-Hire Readiness"];
  if (intake1) items.push("Intake 1");
  items.push("Client Approval", "Intake 2", "GRO Processing");
  if (specialHire) items.push("Special Hire Requirements");
  items.push(local ? "Visa & Status Change" : "Visa Issued", local ? "Joining" : "Travel / Joining", "Post-Joining", "Completion");
  return items;
}

function workPermitJourney(intake1) {
  const items = ["Pre-Hire Readiness"];
  if (intake1) items.push("Intake 1");
  items.push("Client Approval", "Intake 2", "GRO Processing", "Work Permit Approval", "Joining", "Completion");
  return items;
}

function nationalJourney() {
  return ["Pre-Hire Readiness", "Client Approval", "Intake 2", "GRO Processing", "Medical", "Joining / Employment Activity", "Pension Enrollment", "Completion"];
}

function buildCase(config) {
  return {
    allowedEntities: config.allowedEntities,
    serviceId: config.serviceId,
    title: config.title,
    entity: config.entity,
    entityLabel: entityLabel(config.entity),
    authority: config.authority,
    service: config.service,
    category: config.category,
    gccStatus: config.gccStatus,
    emiratesIdAction: config.emiratesIdAction ?? "",
    descriptor: config.descriptor,
    specialHire: config.specialHire ?? false,
    preHireReadiness: config.preHireReadiness,
    intake1: config.intake1,
    documents: config.documents,
    candidateActions: config.candidateActions,
    groProcess: config.groProcess,
    groNote: config.groNote ?? "",
    journey: config.journey,
    beforeIntake2: config.beforeIntake2,
    next: config.next,
    outcome: config.outcome,
    joiningHeading: config.joiningHeading,
    joining: config.joining,
    postJoining: config.postJoining,
    completionPoint: config.completionPoint,
    guidance: config.guidance ?? "Mobilisation manages candidate communication. This guide supports route identification and operational understanding; it does not verify document readiness, approval or joining authorisation.",
  };
}

function employmentCase(entity, hireStatus, specialHire = false) {
  const local = hireStatus === "local";
  const isDwc = entity === "dwc";
  const intake1 = intake1For(entity, "ev");
  const authority = isDwc ? "DWC / Immigration" : "MOHRE";
  const allowedEntities = isDwc ? ["dwc"] : (specialHire ? ["ad", "alain"] : [...MAINLAND_ENTITIES]);
  const outcome = specialHire
    ? "Special Hire Entry Visa"
    : local
      ? (isDwc ? "Visa and Status Change" : "Employment Visa and Status Change")
      : "Entry Visa";

  const candidateActions = [];
  if (specialHire) {
    candidateActions.push("Complete the applicable Home-Country Medical when instructed by Mobilisation.");
    candidateActions.push("Complete the UAE Embassy / original-passport process where required and when instructed by Mobilisation.");
  }
  candidateActions.push(isDwc ? "Complete the required digital contract signature at the applicable DWC stage." : "Complete the required employee signature when Mobilisation advises that the MOHRE case has reached signature stage.");
  if (local) candidateActions.push("Follow the applicable Status Change instructions coordinated through Mobilisation.");

  const groProcess = isDwc
    ? (local ? groEmploymentDwcLocal() : groEmploymentDwcOverseas(specialHire))
    : (local ? groEmploymentMainlandLocal() : groEmploymentMainlandOverseas(specialHire));

  return buildCase({
    allowedEntities,
    serviceId: `ev-${isDwc ? "dwc" : "mainland"}-${local ? "local" : specialHire ? "overseas-special" : "overseas"}`,
    title: "Employment Visa and Work Permit",
    entity,
    authority,
    service: "ev",
    descriptor: `${local ? "Local Hire" : "Overseas Hire"}${specialHire ? " · Special Hire" : ""}`,
    specialHire,
    preHireReadiness: readinessFor({ service: "ev", hireStatus, specialHire }),
    intake1,
    documents: documentsFor(entity, { specialHire }),
    candidateActions,
    groProcess,
    groNote: specialHire ? "Special Hire sequence may vary according to authority requirements. Home-Country Medical and Embassy requirements occur after initial approval at the applicable later stage and are not initial Intake 2 uploads." : "",
    journey: employmentJourney({ intake1: intake1.required, local, specialHire }),
    beforeIntake2: `${intake1.required ? "Complete Intake 1, " : ""}obtain Client Approval, confirm the route and verify the applicable documents and candidate actions before submitting Intake 2.`,
    next: `Intake 2 formally triggers GRO processing through ${authority}.`,
    outcome,
    joiningHeading: local ? "Joining" : "Joining / Travel",
    joining: local
      ? (isDwc ? "Mobilisation confirms joining once the DWC visa and Status Change process is complete." : "Mobilisation confirms the joining date after visa issuance and completed Status Change.")
      : "Mobilisation sends the issued visa and joining / travel instructions to the candidate, who travels and joins according to the agreed schedule.",
    postJoining: "Employee Arrival / Joining → Medical Fitness → Emirates ID → Residence Completion → Final Employee Documentation",
    completionPoint: "Case is complete when the applicable visa, residence, joining and post-joining requirements are completed.",
  });
}

function workPermitCase(entity, residency) {
  const isDwc = entity === "dwc";
  const relative = residency === "relative";
  const intake1 = intake1For(entity, "wp");
  return buildCase({
    allowedEntities: isDwc ? ["dwc"] : [...MAINLAND_ENTITIES],
    serviceId: `wp-${isDwc ? "dwc" : "mainland"}-${residency}`,
    title: relative ? "Relative / Family Visa Work Permit" : "Golden Visa Work Permit",
    entity,
    authority: isDwc ? "DWC" : "MOHRE",
    service: "wp",
    descriptor: relative ? "Existing UAE residency · Relative / Family Visa" : "Existing UAE residency · Golden Visa",
    preHireReadiness: readinessFor({ service: "wp", residency }),
    intake1,
    documents: documentsFor(entity, { relative }),
    candidateActions: [isDwc ? "Complete the digital candidate signature when requested." : "Complete the employee signature when requested by Mobilisation."],
    groProcess: groWorkPermit(entity),
    journey: workPermitJourney(intake1.required),
    beforeIntake2: `${intake1.required ? "Complete Intake 1, " : ""}obtain Client Approval and confirm the candidate and applicable supporting documents are current before Intake 2.`,
    next: `Intake 2 formally triggers the ${isDwc ? "DWC" : "MOHRE"} Work Permit process.`,
    outcome: "Work Permit",
    joiningHeading: "Joining",
    joining: "The candidate may join after Work Permit approval and Mobilisation confirmation.",
    postJoining: "No new AECOM residence visa, Immigration Medical or Emirates ID process applies under this service.",
    completionPoint: "Work Permit approved and employee joins.",
  });
}

function emiratiNationalCase(entity) {
  const category = "emirati";
  const isDwc = entity === "dwc";
  const fund = pensionFund(entity);
  return buildCase({
    allowedEntities: isDwc ? ["dwc"] : [...MAINLAND_ENTITIES],
    serviceId: `nat-${isDwc ? "dwc" : "mainland"}-${category}`,
    title: category === "emirati" ? "Emirati National Work Permit" : "GCC National Work Permit",
    entity,
    authority: isDwc ? "DWC" : "MOHRE",
    service: "nat",
    category: "emirati",
    descriptor: category === "emirati" ? "Emirati candidate" : "GCC National candidate",
    preHireReadiness: readinessFor({ service: "nat", category }),
    intake1: intake1For(entity, "nat"),
    documents: documentsFor(entity, { category }),
    candidateActions: [isDwc ? "Complete the required digital candidate signature." : "Complete the required candidate signature.", "Complete the required Medical after Work Permit approval."],
    groProcess: groNational(entity),
    journey: nationalJourney(),
    beforeIntake2: "Obtain Client Approval, confirm the National Work Permit route and applicable documents, then submit Intake 2. Intake 1 does not apply.",
    next: `Intake 2 formally triggers the ${isDwc ? "DWC" : "MOHRE"} National Work Permit process.`,
    outcome: "Work Permit and Pension",
    joiningHeading: "Joining / Employment Activity",
    joining: "After Work Permit approval, complete the required Medical, then progress joining / employment activity with Mobilisation.",
    postJoining: `GRO progresses ${fund} pension enrollment after Work Permit approval using the applicable Work Permit start date, not the employee joining date.`,
    completionPoint: "Case is complete when the Work Permit, Medical and pension requirements are completed.",
  });
}


const GCC_MAINLAND_STATUSES = ["existingEid", "existingUid", "firstEntry"];

function gccPensionText(entity) {
  return `Once a valid Emirates ID is available, GRO starts ${pensionFund(entity)} pension registration using the Work Permit start date, not the employee joining date. Medical is completed if requested as part of pension registration. GRO completes pension registration once any requested requirements are met.`;
}

function gccJourney(isDwc, needsNewId) {
  const items = [
    "Pre-Hire Readiness", "Client Approval", "Intake 2", "GRO Processing",
    isDwc ? "DWC Work Permit Approval" : "MOHRE Approval",
    "Joining / Employment Activity",
  ];
  if (needsNewId) items.push("Emirates ID");
  items.push("Pension Registration", "Completion");
  return items;
}

function gccNationalMainlandCase(entity, gccStatus) {
  const existingId = gccStatus === "existingEid";
  const previousEntry = gccStatus === "existingUid";
  const firstEntry = gccStatus === "firstEntry";
  const label = existingId ? "Existing Emirates ID" : previousEntry ? "Previous UAE entry / existing UID" : "First UAE entry / new UID";
  const readiness = readinessFor({ service: "nat", category: "gcc" });
  readiness.push("Candidate's GCC-country National ID is required and is separate from the UAE Emirates ID.");

  if (existingId) {
    readiness.push("Candidate already has an Emirates ID; Mobilisation confirms that it is valid.");
    readiness.push("If the Emirates ID is expired or near expiry, the candidate is asked to renew it.");
  } else if (previousEntry) {
    readiness.push("Previous UAE entry is confirmed. Candidate has no Emirates ID but provides an existing UID.");
    readiness.push("Existing UID is linked to an active mobile number the candidate can access to receive OTP.");
  } else if (firstEntry) {
    readiness.push("Candidate must travel to UAE first. A UID is assigned automatically upon UAE entry before GRO starts MOHRE processing.");
    readiness.push("New UID must be linked to an active mobile number accessible by the candidate for OTP.");
  }

  const actions = existingId
    ? [
        "Complete the applicable MOHRE candidate signature when requested through Mobilisation.",
        "If your Emirates ID is expired or near expiry, the candidate must renew it; if valid, no Emirates ID action is needed.",
        "Complete Medical only if requested for GCC pension registration.",
      ]
    : [
        ...(firstEntry ? ["Travel to the UAE; a UID is assigned automatically upon UAE entry."] : []),
        ...(previousEntry ? ["Provide your existing UID from your previous UAE entry."] : []),
        "Link the UID to an active mobile number that you can access for OTP verification and provide the UID and linked mobile to Mobilisation before Intake 2.",
        "Receive and complete OTP verification during the MOHRE processing stage when requested.",
        "Complete the applicable MOHRE candidate signature when requested through Mobilisation.",
        "After MOHRE approval, the candidate applies for an Emirates ID and shares the issued valid Emirates ID with Mobilisation.",
        "Complete Medical only if requested for GCC pension registration.",
      ];

  const groProcess = [
    step("GRO", "MOHRE Contract Processing", existingId
      ? "GRO prepares and processes the MOHRE employment contract / Work Permit after Intake 2."
      : "GRO processes the MOHRE employment contract using the candidate's UID and active linked mobile after Intake 2."),
    ...(!existingId ? [step("Candidate", "OTP Verification", "Candidate receives the OTP on the active mobile linked to the UID; GRO progresses the authority verification stage.")] : []),
    step("Candidate", "Candidate Signature", "Mobilisation coordinates the applicable candidate signature when requested."),
    step("Authority", "MOHRE Approval", "The applicable MOHRE contract / Work Permit approval is obtained."),
    step("GRO", "Approved Contract Shared", "GRO confirms approval and returns the approved contract to Mobilisation."),
  ];

  const before = existingId
    ? "Obtain Client Approval, confirm a valid Emirates ID and GCC-country National ID, then submit Intake 2. Intake 1 does not apply."
    : previousEntry
      ? "Obtain Client Approval and confirm the existing UID, linked active OTP mobile and GCC-country National ID before submitting Intake 2. No Intake 1 applies."
      : "Obtain Client Approval. The candidate must travel to UAE to receive a UID automatically upon entry, link an active OTP mobile and provide these details before Intake 2. No Intake 1 applies.";

  return buildCase({
    allowedEntities: [...MAINLAND_ENTITIES],
    serviceId: `nat-mainland-gcc-${gccStatus}`,
    title: "GCC National Work Permit",
    entity,
    authority: "MOHRE",
    service: "nat",
    category: "gcc",
    gccStatus,
    descriptor: `GCC National · ${label}`,
    preHireReadiness: readiness,
    intake1: intake1For(entity, "nat"),
    documents: documentsFor(entity, { category: "gcc" }),
    candidateActions: actions,
    groProcess,
    groNote: "UID and linked mobile are operational information, not document uploads. Candidate owns Emirates ID issuance or renewal. GCC pension registration starts once a valid Emirates ID is available; Medical is required only when requested for pension registration.",
    journey: gccJourney(false, !existingId),
    beforeIntake2: before,
    next: existingId
      ? "After Intake 2, GRO processes the MOHRE contract, confirms approval and shares it with Mobilisation."
      : "After Intake 2, GRO processes the MOHRE contract using UID / linked OTP mobile, then shares the approved contract with Mobilisation.",
    outcome: "MOHRE contract / Work Permit and pension",
    joiningHeading: "Joining / Employment Activity",
    joining: "The candidate may join once the applicable MOHRE contract / Work Permit approval is confirmed by Mobilisation. Medical is not a pre-joining requirement for this GCC pension route.",
    emiratesIdAction: existingId ? "" : "After MOHRE approval, the candidate obtains an Emirates ID and provides the issued valid Emirates ID to Mobilisation. GRO may start pension registration once the ID is available.",
    postJoining: gccPensionText(entity),
    completionPoint: existingId
      ? "Complete once the MOHRE contract / Work Permit approval, joining and GRO pension registration are completed with a valid Emirates ID, including Medical if requested for pension."
      : "Complete once the MOHRE contract / Work Permit approval, joining, Emirates ID issuance and GRO pension registration are completed, including Medical if requested for pension.",
  });
}

function gccNationalDwcCase(entity) {
  const readiness = readinessFor({ service: "nat", category: "gcc" });
  readiness.push("Candidate's GCC-country National ID is required and is separate from a UAE Emirates ID.");
  readiness.push("Confirm whether the Emirates ID is valid; if missing, expired or near expiry, candidate handles application or renewal.");

  return buildCase({
    allowedEntities: ["dwc"],
    serviceId: "nat-dwc-gcc",
    title: "GCC National Work Permit",
    entity,
    authority: "DWC",
    service: "nat",
    category: "gcc",
    descriptor: "GCC National · Dubai South Work Permit",
    preHireReadiness: readiness,
    intake1: intake1For(entity, "nat"),
    documents: documentsFor(entity, { category: "gcc" }),
    candidateActions: [
      "Complete the required digital candidate signature through the DWC Work Permit process when Mobilisation requests it.",
      "If the Emirates ID is valid, no action is needed; if missing, expired or nearing expiry, the candidate is responsible for obtaining or renewing it.",
      "Complete Medical only if requested for GCC pension registration.",
    ],
    groProcess: [
      step("GRO", "DWC Work Permit Process", "GRO processes the application directly through Dubai South. MOHRE does not apply."),
      step("Candidate", "Digital Candidate Signature", "Candidate completes the required digital signature when requested."),
      step("Authority", "DWC Work Permit Approval", "The Dubai South Work Permit is approved."),
      step("GRO", "Approved Permit Shared", "GRO shares the approved Work Permit with Mobilisation."),
    ],
    groNote: "There is no MOHRE processing for DWC. A valid Emirates ID is required before GCC pension registration; the candidate, not GRO, owns any issuance or renewal.",
    journey: gccJourney(true, false),
    beforeIntake2: "Obtain Client Approval, confirm the GCC-country National ID and applicable supporting documents, and submit Intake 2. Intake 1 does not apply.",
    next: "GRO processes the DWC Work Permit, coordinates digital signature through Mobilisation and shares the approved permit.",
    outcome: "DWC Work Permit and pension",
    joiningHeading: "Joining / Employment Activity",
    joining: "The candidate may join after Dubai South Work Permit approval and Mobilisation confirmation. Medical for pension does not block joining.",
    emiratesIdAction: "If a valid Emirates ID is already held, no action is required. If it is missing, expired or near expiry, the candidate obtains or renews the Emirates ID and shares the valid ID with Mobilisation before pension registration.",
    postJoining: gccPensionText(entity),
    completionPoint: "Complete once the DWC Work Permit approval, joining and GRO pension registration are completed with a valid Emirates ID, including Medical if requested for pension.",
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
  emiratiNationalCase("ad"),
  gccNationalMainlandCase("ad", "existingEid"),
  gccNationalMainlandCase("ad", "existingUid"),
  gccNationalMainlandCase("ad", "firstEntry"),
  emiratiNationalCase("dwc"),
  gccNationalDwcCase("dwc"),
];

function cloneForEntity(base, entity) {
  const copy = structuredClone(base);
  copy.entity = entity;
  copy.entityLabel = entityLabel(entity);
  if (copy.service === "ev" || copy.service === "wp" || copy.service === "nat") {
    copy.intake1 = intake1For(entity, copy.service);
  }
  if (copy.service === "nat" && copy.category === "emirati") {
    const fund = pensionFund(entity);
    copy.postJoining = `GRO progresses ${fund} pension enrollment after Work Permit approval using the applicable Work Permit start date, not the employee joining date.`;
  } else if (copy.service === "nat" && copy.category === "gcc") {
    copy.postJoining = gccPensionText(entity);
  }
  copy.documents = documentsFor(entity, {
    specialHire: copy.specialHire,
    relative: copy.serviceId.endsWith("relative"),
    category: copy.category ?? "",
  });
  return copy;
}

function findTemplate(serviceId, entity) {
  return SERVICES.find(item => item.serviceId === serviceId && item.allowedEntities.includes(entity));
}

export function resolveCase(state) {
  const { entity, service, hireStatus, nationality, residency, category } = state;
  if (!ENTITIES.some(item => item.value === entity)) return null;
  if (!SERVICE_TYPES.some(item => item.value === service)) return null;

  const isDwc = entity === "dwc";
  if (service === "ev") {
    if (!["local", "overseas"].includes(hireStatus)) return null;
    if (hireStatus === "overseas" && !NATIONALITIES.some(item => item.value === nationality)) return null;
    const special = isSpecialHire(state);
    const id = `ev-${isDwc ? "dwc" : "mainland"}-${hireStatus === "local" ? "local" : special ? "overseas-special" : "overseas"}`;
    const template = findTemplate(id, entity);
    if (!template) return null;
    return entity === template.entity ? structuredClone(template) : cloneForEntity(template, entity);
  }

  if (service === "wp") {
    if (!["golden", "relative"].includes(residency)) return null;
    const id = `wp-${isDwc ? "dwc" : "mainland"}-${residency}`;
    const template = findTemplate(id, entity);
    if (!template) return null;
    return entity === template.entity ? structuredClone(template) : cloneForEntity(template, entity);
  }

  if (service === "nat") {
    if (!["emirati", "gcc"].includes(category)) return null;
    let id;
    if (category === "emirati") {
      id = `nat-${isDwc ? "dwc" : "mainland"}-emirati`;
    } else if (isDwc) {
      id = "nat-dwc-gcc";
    } else {
      if (!GCC_MAINLAND_STATUSES.includes(state.gccStatus)) return null;
      id = `nat-mainland-gcc-${state.gccStatus}`;
    }
    const template = findTemplate(id, entity);
    if (!template) return null;
    return entity === template.entity ? structuredClone(template) : cloneForEntity(template, entity);
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
    if (state.category === "gcc" && state.entity !== "dwc") sequence.push("gccStatus");
  }
  return sequence;
}

export function browseCases(entityFilter = "all", serviceFilter = "all") {
  const entities = entityFilter === "all" ? ["ad", "dubai", "alain", "dwc"] : [entityFilter];
  const results = [];
  for (const entity of entities) {
    for (const template of SERVICES) {
      if (!template.allowedEntities.includes(entity)) continue;
      if (serviceFilter !== "all" && template.service !== serviceFilter) continue;
      results.push(entity === template.entity ? structuredClone(template) : cloneForEntity(template, entity));
    }
  }
  return results;
}
