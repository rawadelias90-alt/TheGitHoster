(function (root, factory) {
  const productionRules = (typeof module === 'object' && module.exports)
    ? require('./production-rules.js')
    : root && root.Intake2ProductionRules;
  const api = factory(productionRules);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.IntakeRequirements = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (P) {
  'use strict';

  if (!P) throw new Error('Intake2ProductionRules failed to load.');

  const sourceVersion = P.version;
  const fileRules = Object.freeze({
    maxSizeMB: P.fileRules.maxSizeMB,
    allowedExtensions: [...P.fileRules.allowedExtensions]
  });

  const entityAliases = new Map([
    ['aecoom abu dhabi', 'abuDhabi'],
    ['aecom abu dhabi', 'abuDhabi'],
    ['aecom middle east limited – abu dhabi', 'abuDhabi'],
    ['aecom middle east limited - abu dhabi', 'abuDhabi'],
    ['aecom dubai', 'dubai'],
    ['aecom middle east limited – dubai', 'dubai'],
    ['aecom middle east limited - dubai', 'dubai'],
    ['aecom al ain', 'alAin'],
    ['aecom middle east limited – al ain', 'alAin'],
    ['aecom middle east limited - al ain', 'alAin'],
    ['aecom dubai south / dwc', 'dwc'],
    ['aecom middle east limited – dwc', 'dwc'],
    ['aecom middle east limited - dwc', 'dwc'],
    ['dubai south (dwc)', 'dwc'],
    ['dwc', 'dwc']
  ]);

  const sponsorshipLocations = P.entities.map((entity) => entity.label);

  const candidateFields = [
    { id: 'candidateFullName', label: 'Candidate Full Name', type: 'text', required: true, helper: 'Must match the passport.' },
    { id: 'nationality', label: 'Nationality', type: 'text', required: true },
    { id: 'countryOfBirth', label: 'Country of Birth', type: 'text', required: true },
    { id: 'unifiedNumber', label: 'Unified Number (UID)', type: 'text', required: false, helper: 'Where available.' },
    { id: 'lastWorkingDate', label: 'Last Working Date', type: 'date', required: false, helper: 'Where applicable.' },
    { id: 'personalEmail', label: 'Candidate Personal Email', type: 'email', required: true },
    { id: 'contactNumber', label: 'Candidate Contact Number', type: 'tel', required: true },
    { id: 'sponsorshipLocation', label: 'Sponsoring Entity', type: 'radio', required: true, options: sponsorshipLocations },
    { id: 'skilledStatus', label: 'Skilled Status', type: 'radio', required: true, options: ['Skilled', 'Unskilled', 'Not applicable'], helper: 'Confirm where applicable.' },
    { id: 'expectedJoiningDate', label: 'Expected Joining Date', type: 'date', required: true }
  ];

  const documentDefaults = {
    maxFiles: 1,
    maxSizeMB: fileRules.maxSizeMB,
    allowedExtensions: fileRules.allowedExtensions,
    allowMultiple: false
  };

  function doc(id, label, required, helper) {
    return {
      id,
      label,
      required: Boolean(required),
      helper: helper || '',
      ...documentDefaults
    };
  }

  const commonDocuments = [
    doc('passportCopy', 'Passport Copy', true),
    doc('candidatePhoto', 'Candidate Photograph', true),
    doc('signedOffer', 'Signed AECOM Offer / Contract', true)
  ];

  const conditionalCoreDocuments = {
    educationCertificate: doc('educationCertificate', 'Education Certificate', true, 'Required for applicable skilled classifications.'),
    policeClearance: doc('policeClearance', 'Police Clearance Certificate', false, 'Where requested or applicable.'),
    emiratesId: doc('emiratesId', 'Emirates ID', false, 'Where applicable.'),
    currentResidency: doc('currentResidency', 'Current UAE Visa / Residency', false, 'Where applicable.'),
    externalCoverPassport: doc('externalCoverPassport', 'External Cover Passport', false, 'Dubai Mainland and AECOM Dubai South / DWC only, where applicable.')
  };

  const serviceTypes = P.services.map((service) => ({
    value: service.label,
    label: service.label,
    routeId: service.id,
    serviceGroup: service.serviceGroup
  }));

  function routeDocFromSource(sourceDoc) {
    return doc(sourceDoc.id, sourceDoc.label, sourceDoc.requirement === 'required', sourceDoc.requirement === 'conditional' ? 'Where applicable.' : '');
  }

  const routes = {
    employmentVisa: {
      id: 'employmentVisa',
      title: 'Employment Visa & Work Permit',
      documents: [],
      specialHire: {
        documents: [doc('homeCountryNationalId', 'Home-country National ID', true)],
        confirmations: []
      }
    },
    relativeVisa: {
      id: 'relativeVisa',
      title: 'Work Permit for Relative Visa Holders',
      documents: (P.serviceDocuments.relativeVisa || []).map(routeDocFromSource)
    },
    goldenVisa: {
      id: 'goldenVisa',
      title: 'Work Permit for Golden Visa Holder',
      documents: (P.serviceDocuments.goldenVisa || []).map(routeDocFromSource)
    },
    emiratiNational: {
      id: 'emiratiNational',
      title: 'Work Permit for Emirati National',
      documents: [
        doc('familyBook', 'Family Book', true, 'Required for Emirati candidates only.'),
        doc('nationalId', 'National ID', true)
      ]
    },
    gccNational: {
      id: 'gccNational',
      title: 'Work Permit for GCC National',
      documents: [
        doc('nationalId', 'National ID', true)
      ]
    }
  };

  const educationFields = [
    {
      id: 'equivalencyAvailable',
      label: P.education.question,
      type: 'radio',
      required: true,
      options: ['Yes', 'No']
    }
  ];

  const educationDocuments = [
    doc('certificateOfEquivalencyOrEducationalVerification', 'Educational Verification / Certificate of Equivalency', false),
    doc('awardOrEducationDetailsDocument', 'Award / Education Details Document', false)
  ];

  const additionalDocuments = [{
    id: 'additionalSupportingDocuments',
    label: 'Other Supporting Documents',
    required: false,
    helper: 'Optional. Add only if useful for this request.',
    maxFiles: null,
    maxSizeMB: fileRules.maxSizeMB,
    allowedExtensions: fileRules.allowedExtensions,
    allowMultiple: true
  }];

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function getEntityId(value) {
    const normalized = normalizeText(value);
    const direct = P.entities.find((entity) => normalizeText(entity.label) === normalized);
    if (direct) return direct.id;
    return entityAliases.get(normalized) || '';
  }

  function getEntity(value) {
    const id = getEntityId(value);
    return P.entities.find((entity) => entity.id === id) || null;
  }

  function normalizeNationality(value) {
    const normalized = normalizeText(value).replace(/\bnational\b/g, '').trim();
    const aliases = {
      india: 'India', indian: 'India',
      pakistan: 'Pakistan', pakistani: 'Pakistan',
      egypt: 'Egypt', egyptian: 'Egypt',
      'sri lanka': 'Sri Lanka', 'sri lankan': 'Sri Lanka', srilanka: 'Sri Lanka'
    };
    return aliases[normalized] || String(value || '').trim();
  }

  function getServiceId(serviceType) {
    const value = String(serviceType || '').trim();
    const service = P.services.find((item) => item.label === value || item.id === value);
    return service ? service.id : '';
  }

  function getRoute(routeId) {
    return routes[routeId] || null;
  }

  function getRouteIdForService(serviceType) {
    return getServiceId(serviceType);
  }

  function effectiveHireStatus(draft) {
    const serviceId = getServiceId(draft?.service?.serviceType || draft?.service?.routeId);
    if (serviceId === 'relativeVisa' || serviceId === 'goldenVisa') return 'uaeResident';
    if (serviceId === 'emiratiNational' || serviceId === 'gccNational') return 'local';
    if (serviceId !== 'employmentVisa') return '';
    const value = normalizeText(draft?.service?.mobilizingFrom || draft?.candidate?.mobilizingFrom);
    if (value.includes('overseas')) return 'overseas';
    if (value.includes('local')) return 'local';
    return '';
  }

  function isSpecialHireApplicable(draft) {
    const serviceId = getServiceId(draft?.service?.serviceType || draft?.service?.routeId);
    if (serviceId !== P.specialHire.appliesOnlyTo.service) return false;
    if (effectiveHireStatus(draft) !== 'overseas') return false;

    const entityId = getEntityId(draft?.candidate?.sponsorshipLocation);
    const nationality = normalizeNationality(draft?.candidate?.nationality);
    const mainland = P.specialHire.mainland;
    const freeZone = P.specialHire.freeZone;

    if (mainland.entities.includes(entityId) && mainland.nationalities.includes(nationality)) return true;
    if (freeZone.entities.includes(entityId) && freeZone.nationalities.includes(nationality)) return true;
    return false;
  }

  function getOnboardingPath(draft) {
    const serviceId = getServiceId(draft?.service?.serviceType || draft?.service?.routeId);
    const entity = getEntity(draft?.candidate?.sponsorshipLocation);
    if (!serviceId || !entity) return null;

    const hireStatus = effectiveHireStatus(draft);
    if (!hireStatus) return null;
    const specialHire = isSpecialHireApplicable(draft);

    return P.paths.find((path) => {
      if (path.service !== serviceId || path.entityGroup !== entity.group || path.hireStatus !== hireStatus) return false;
      if (Object.prototype.hasOwnProperty.call(path, 'specialHire')) return path.specialHire === specialHire;
      return true;
    }) || null;
  }

  function getServicePathFields(draft) {
    const serviceId = getServiceId(draft?.service?.serviceType || draft?.service?.routeId);
    const fields = [
      {
        id: 'clientApprovalConfirmed',
        label: 'Client Approval received',
        type: 'radio',
        required: true,
        options: ['Yes'],
        helper: 'Client Approval is required before Intake 2.'
      }
    ];

    if (serviceId === 'employmentVisa') {
      fields.push({
        id: 'mobilizingFrom',
        label: 'Hire Status',
        type: 'radio',
        required: true,
        options: ['Local Hire', 'Overseas Hire']
      });
    }

    const path = getOnboardingPath(draft);
    if (path?.intake1Required) {
      fields.push({
        id: 'intake1Completed',
        label: 'Intake 1 completed',
        type: 'radio',
        required: true,
        options: ['Yes'],
        helper: 'Required for this onboarding path before Intake 2.'
      });
    }
    return fields;
  }

  function isEducationApplicable(draft) {
    return normalizeText(draft?.candidate?.skilledStatus) === 'skilled';
  }

  function getCoreDocuments(draft) {
    const documents = commonDocuments.map((item) => ({ ...item }));
    if (isEducationApplicable(draft)) documents.push({ ...conditionalCoreDocuments.educationCertificate, required: true });

    documents.push({ ...conditionalCoreDocuments.policeClearance });
    documents.push({ ...conditionalCoreDocuments.emiratesId });
    documents.push({ ...conditionalCoreDocuments.currentResidency });

    const entityId = getEntityId(draft?.candidate?.sponsorshipLocation);
    if (['dubai', 'dwc'].includes(entityId)) documents.push({ ...conditionalCoreDocuments.externalCoverPassport });
    return documents;
  }

  const mainDocuments = [
    ...commonDocuments,
    conditionalCoreDocuments.educationCertificate,
    conditionalCoreDocuments.policeClearance,
    conditionalCoreDocuments.emiratesId,
    conditionalCoreDocuments.currentResidency,
    conditionalCoreDocuments.externalCoverPassport
  ];

  function isMainDocumentRequired(documentId, candidateOrDraft) {
    const draft = candidateOrDraft && (candidateOrDraft.candidate || candidateOrDraft.service)
      ? candidateOrDraft
      : { candidate: candidateOrDraft || {}, service: {} };
    const document = getCoreDocuments(draft).find((item) => item.id === documentId);
    return Boolean(document?.required);
  }

  function getRouteDocuments(draft) {
    const serviceId = getServiceId(draft?.service?.serviceType || draft?.service?.routeId);
    const route = getRoute(serviceId);
    if (!route) return [];
    if (serviceId === 'employmentVisa') {
      return isSpecialHireApplicable(draft) ? route.specialHire.documents.map((item) => ({ ...item })) : [];
    }
    return route.documents.map((item) => ({ ...item }));
  }

  function getEducationDocuments(draft) {
    if (!isEducationApplicable(draft)) return [];
    const answer = draft?.education?.equivalencyAvailable;
    if (answer === 'Yes') {
      return [{ ...educationDocuments[0], required: true }];
    }
    if (answer === 'No') {
      return [{ ...educationDocuments[1], required: true }];
    }
    return [];
  }

  function getConditionalDocuments(draft) {
    return [...getRouteDocuments(draft), ...getEducationDocuments(draft)];
  }

  function getRequiredRouteItems(routeId, draft) {
    const routeDraft = draft || { service: { routeId } };
    return getRouteDocuments(routeDraft)
      .filter((item) => item.required)
      .map((item) => ({ id: item.id, section: 'route', label: item.label }));
  }

  function addRequiredField(missing, source, field, section, counts) {
    counts.requiredFields += 1;
    if (hasValue(source[field.id])) counts.completedFields += 1;
    else missing.push({ section, id: field.id, label: field.label, kind: 'field' });
  }

  function addRequiredDocument(missing, source, document, section, counts) {
    counts.requiredDocuments += 1;
    if (hasValue(source[document.id])) counts.completedDocuments += 1;
    else missing.push({ section, id: document.id, label: document.label, kind: 'document' });
  }

  function getReadiness(draft) {
    const safeDraft = draft || {};
    const candidate = safeDraft.candidate || {};
    const main = safeDraft.mainDocuments || {};
    const service = safeDraft.service || {};
    const routeValues = safeDraft.route || {};
    const education = safeDraft.education || {};
    const missing = [];
    const counts = { requiredFields: 0, completedFields: 0, requiredDocuments: 0, completedDocuments: 0 };

    candidateFields.filter((field) => field.required).forEach((field) => addRequiredField(missing, candidate, field, 'candidate', counts));
    getCoreDocuments(safeDraft).filter((document) => document.required).forEach((document) => addRequiredDocument(missing, main, document, 'mainDocuments', counts));

    counts.requiredFields += 1;
    if (hasValue(service.serviceType)) counts.completedFields += 1;
    else missing.push({ section: 'service', id: 'serviceType', label: 'Select Service Type', kind: 'field' });

    if (hasValue(service.serviceType)) {
      getServicePathFields(safeDraft).filter((field) => field.required).forEach((field) => addRequiredField(missing, service, field, 'service', counts));
    }

    getRouteDocuments(safeDraft).filter((document) => document.required).forEach((document) => addRequiredDocument(missing, routeValues, document, 'route', counts));

    if (isEducationApplicable(safeDraft)) {
      const equivalencyField = educationFields[0];
      addRequiredField(missing, education, equivalencyField, 'education', counts);
      getEducationDocuments(safeDraft).filter((document) => document.required).forEach((document) => addRequiredDocument(missing, education, document, 'education', counts));
    }

    return {
      ...counts,
      missing,
      ready: missing.length === 0,
      path: getOnboardingPath(safeDraft),
      specialHire: isSpecialHireApplicable(safeDraft)
    };
  }

  return Object.freeze({
    sourceVersion,
    productionRules: P,
    fileRules,
    sponsorshipLocations,
    candidateFields,
    mainDocuments,
    serviceTypes,
    routes,
    educationFields,
    educationDocuments,
    additionalDocuments,
    getRoute,
    getRouteIdForService,
    getEntityId,
    effectiveHireStatus,
    isSpecialHireApplicable,
    getOnboardingPath,
    getServicePathFields,
    isEducationApplicable,
    getCoreDocuments,
    getRouteDocuments,
    getEducationDocuments,
    getConditionalDocuments,
    getRequiredRouteItems,
    isMainDocumentRequired,
    getReadiness
  });
});
