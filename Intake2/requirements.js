(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.IntakeRequirements = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const sponsorshipLocations = [
    'AECOM Middle East Limited – Abu Dhabi',
    'AECOM Middle East Limited – Dubai',
    'AECOM Middle East Limited – Al Ain',
    'AECOM Middle East Limited – DWC'
  ];

  const religions = [
    'Muslim - Sunni',
    'Muslim - Shia',
    'Muslim - Ebadi',
    'Muslim - Zaidi',
    "Muslim - Mu'tazila",
    'Muslim - Sufi',
    "Muslim - Ash'aris",
    'Christian - Catholicism',
    'Christian - Eastern Orthodox Churches',
    'Christian - Oriental Orthodox and Assyrian Churches',
    'Christian - Nestorian Church (Church of the East)',
    'Christian - Protestantism',
    'Christian - The Anglican Communion',
    'Christian - Mormons',
    'Hinduism',
    'Buddhism',
    "Baha'i",
    'Sikhism',
    'Non-Religious'
  ];

  const candidateFields = [
    { id: 'candidateFullName', label: 'Candidate Full Name', type: 'text', required: true, helper: 'The name must be as per the verified passport copy.' },
    { id: 'nationality', label: 'Nationality', type: 'text', required: true, helper: 'Use country/nationality wording as shown in the source, e.g. USA, UK, Syria; not American, British, Syrian.' },
    { id: 'countryOfBirth', label: 'Country of Birth', type: 'text', required: true },
    { id: 'mobilizingFrom', label: 'Mobilizing From', type: 'radio', required: true, options: ['Overseas Hire', 'Local Hires'] },
    { id: 'uid', label: 'Unified Number (UID)', type: 'text', required: false, helper: 'If applicable.' },
    { id: 'lastWorkingDate', label: 'Last Working Date with Current Employer', type: 'date', required: false },
    { id: 'religion', label: 'Religion', type: 'select', required: true, options: religions },
    { id: 'mothersName', label: 'Mother’s Name', type: 'text', required: true, helper: 'The name must be as appear in passport.' },
    { id: 'maritalStatus', label: 'Marital Status', type: 'radio', required: true, options: ['Single', 'Married', 'Divorced', 'Widowed'] },
    { id: 'personalEmail', label: 'Candidate’s Personal Email Address', type: 'email', required: true },
    { id: 'contactNumber', label: 'Candidate’s Contact Number', type: 'tel', required: true, helper: 'Home Country: (+1-xxxxxxxxx) · Local (UAE): (05X-XXX-XXXX)' },
    { id: 'sponsorshipLocation', label: 'Select Visa Sponsorship Location', type: 'radio', required: true, options: sponsorshipLocations },
    { id: 'employmentStartDate', label: 'Employment Start Date', type: 'date', required: true, source: 'retained-current-prototype' }
  ];

  const mainDocuments = [
    { id: 'passportCopy', label: 'Passport_copy', required: true, helper: 'Use the same documents that was verified by MOHRE.', maxFiles: 3, maxSizeGB: 1, allowedTypes: ['Image'] },
    { id: 'mohreVerifiedPhoto', label: 'MOHRE_Verified_Photo', required: true, helper: 'Use the same photo that was verified by MOHRE.', maxFiles: 1, maxSizeGB: 1, allowedTypes: ['Image'] },
    { id: 'educationCertificateMofa', label: 'Education certificate attested by MoFA in the UAE', required: true, helper: 'If no document is uploaded, this application will be processed as unskilled application.', maxFiles: 7, maxSizeGB: 1, allowedTypes: ['PDF', 'Image'] },
    { id: 'policeClearanceCertificate', label: 'Police Clearance Certificate PCC', required: true, source: 'branching-schema', maxFiles: null, maxSizeGB: null, allowedTypes: [] },
    { id: 'emiratesIdCopy', label: 'Emirates_ID_Copy', required: false, helper: 'Only if applicable.', maxFiles: 3, maxSizeGB: 1, allowedTypes: ['PDF', 'Image'] },
    { id: 'visaResidencyCopy', label: 'Visa_Residency_Copy', required: false, helper: 'If applicable.', maxFiles: 3, maxSizeGB: 1, allowedTypes: ['PDF', 'Image'] },
    { id: 'externalCoverPassport', label: 'External_Cover_Passport', required: false, requiredWhen: 'dubai-or-dwc', helper: 'Required ONLY for AECOM Dubai & DWC Candidates.', maxFiles: 3, maxSizeGB: 1, allowedTypes: ['Word', 'Excel', 'PPT', 'PDF', 'Image', 'Video', 'Audio'] },
    { id: 'offerOfEmployment', label: 'Offer of Employment', required: true, helper: 'Signed AECOM Contract.', maxFiles: 3, maxSizeGB: 1, allowedTypes: ['PDF', 'Image'] }
  ];

  const serviceTypes = [
    { value: 'Employment Visa & Work Permit', label: 'Employment Visa & Work Permit', routeId: 'employmentVisa' },
    { value: 'Work Permit for Relative Visa Holders', label: 'Work Permit for Relative Visa Holders', routeId: 'relativeVisa' },
    { value: 'Work Permit for Golden Visa Holder', label: 'Work Permit for Golden Visa Holder', routeId: 'goldenVisa' },
    { value: 'Work Permit for Emirati National', label: 'Work Permit for Emirati National', routeId: 'emiratiNational' },
    { value: 'Work Permit for GCC National', label: 'Work Permit for GCC National', routeId: 'gccNational' },
    { value: 'Work Permit for Diplomatic Passport Holder', label: 'Work Permit for Diplomatic Passport Holder', routeId: 'diplomaticPassport' }
  ];

  const pdfImageTypes = ['PDF', 'Image'];

  const routes = {
    employmentVisa: {
      id: 'employmentVisa',
      title: 'Employment Visa & Work Permit',
      nextStage: 'education',
      importantNote: {
        intro: 'If nationals of the countries listed below are hired overseas for the specified AECOM entities, they are required to complete the medical examination in their home country and submit their original passport to the UAE Embassy for visa issuance.',
        caseA: { nationals: ['India', 'Pakistan', 'Egypt', 'Sri Lanka'], hiredUnder: ['AECOM Abu Dhabi', 'Al Ain'] },
        caseB: { nationals: ['Egypt', 'Sri Lanka'], hiredUnder: ['AECOM Dubai South'] }
      },
      confirmQuestion: 'STOP & CONFIRM – Does this request fall under CASE A or CASE B?',
      confirmOptions: ['Yes', 'No'],
      documents: [],
      specialHire: {
        documents: [
          { id: 'homeCountryNationalId', label: 'Copy of the National ID Card issued in Home Country', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes }
        ],
        confirmations: [
          { id: 'medicalHomeCountryConfirmed', label: 'I confirm that the candidate has been informed of the requirement to complete the medical test in their home country.', required: true, options: ['Yes'] },
          { id: 'passportEmbassyConfirmed', label: 'I confirm that the candidate has been informed that, following issuance of the medical results, they are required to submit their original passport to the UAE Embassy in their home country.', required: true, options: ['Yes'] }
        ]
      }
    },
    relativeVisa: {
      id: 'relativeVisa',
      title: 'Work Permit for Relative Visa Holders',
      nextStage: 'education',
      documents: [
        { id: 'sponsorPassportCopy', label: 'Upload Sponsor’s passport copy', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'sponsorResidenceVisa', label: 'Upload Sponsor’s residence visa', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'sponsorEmiratesId', label: 'Upload Sponsor’s Emirates ID', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'sponsorNocLetter', label: 'Upload NOC letter', required: true, helper: 'From current visa sponsor.', maxFiles: 2, maxSizeGB: 1, allowedTypes: pdfImageTypes }
      ]
    },
    goldenVisa: {
      id: 'goldenVisa',
      title: 'Work Permit for Golden Visa Holders',
      nextStage: 'education',
      documents: [
        { id: 'goldenVisaCopy', label: 'Upload Copy of Golden Visa', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes }
      ]
    },
    emiratiNational: {
      id: 'emiratiNational',
      title: 'Work Permit for Emirati National',
      nextStage: 'education',
      documents: [
        { id: 'familyBook', label: 'Upload Family book', required: true, helper: 'Required for Emirati Candidates Only.', maxFiles: 7, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'medicalTestResult', label: 'Upload Medical test result', required: false, helper: 'If applicable.', maxFiles: 2, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'nationalId', label: 'Upload National ID', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes }
      ]
    },
    gccNational: {
      id: 'gccNational',
      title: 'Work Permit for GCC National',
      nextStage: 'education',
      documents: [
        { id: 'familyBook', label: 'Upload Family book', required: false, helper: 'Source note: Required for Emirati Candidates Only.', maxFiles: 7, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'medicalTestResult', label: 'Upload Medical test result', required: false, helper: 'If applicable.', maxFiles: 2, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'nationalId', label: 'Upload National ID', required: true, maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes }
      ]
    },
    diplomaticPassport: {
      id: 'diplomaticPassport',
      title: 'Work Permit for Diplomatic Passport Holder',
      nextStage: 'education',
      documents: [
        { id: 'diplomaticNocLetter', label: 'Upload NOC Letter', required: true, helper: 'From Visa Sponsor.', maxFiles: 3, maxSizeGB: 1, allowedTypes: pdfImageTypes },
        { id: 'embassyApproval', label: 'Upload Approval from Embassy', required: false, helper: 'If applicable.', maxFiles: 2, maxSizeGB: 1, allowedTypes: pdfImageTypes }
      ]
    }
  };

  const educationFields = [
    { id: 'equivalencyAvailable', label: 'Is Certificate of Equivalency Available?', type: 'radio', required: true, options: ['Yes', 'No'] }
  ];

  const educationDocuments = [
    { id: 'educationDetailsForm', label: 'Upload the Education Details Form', required: true, helper: 'Upload the Word File.', maxFiles: 1, maxSizeGB: 1, allowedTypes: ['Word'] },
    { id: 'certificateOfEquivalency', label: 'Upload Certificate of Equivalency', required: true, helper: 'Upload Scanned Copy.', maxFiles: 4, maxSizeGB: 1, allowedTypes: pdfImageTypes }
  ];

  const additionalDocuments = [
    { id: 'additionalSupportingDocuments', label: 'Upload Additional Supporting Documents', required: false, helper: 'Use this section to upload any additional supporting documents, if required.', maxFiles: 5, maxSizeGB: 1, allowedTypes: ['Word', 'Excel', 'PPT', 'PDF', 'Image', 'Video', 'Audio'] }
  ];

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  function getRoute(routeId) {
    return routes[routeId] || null;
  }

  function getRouteIdForService(serviceType) {
    const service = serviceTypes.find((item) => item.value === serviceType);
    return service ? service.routeId : '';
  }

  function isMainDocumentRequired(documentId, candidate) {
    const document = mainDocuments.find((item) => item.id === documentId);
    if (!document) return false;
    if (document.requiredWhen === 'dubai-or-dwc') {
      return candidate && (candidate.sponsorshipLocation === sponsorshipLocations[1] || candidate.sponsorshipLocation === sponsorshipLocations[3]);
    }
    return Boolean(document.required);
  }

  function getRequiredRouteItems(routeId) {
    const route = getRoute(routeId);
    if (!route) return [];
    const items = [];
    if (routeId === 'employmentVisa') {
      items.push({ id: 'caseConfirmation', section: 'service', label: route.confirmQuestion });
      route.specialHire.documents.filter((item) => item.required).forEach((item) => items.push({ id: item.id, section: 'route', label: item.label }));
      route.specialHire.confirmations.filter((item) => item.required).forEach((item) => items.push({ id: item.id, section: 'route', label: item.label }));
      return items;
    }
    route.documents.filter((item) => item.required).forEach((item) => items.push({ id: item.id, section: 'route', label: item.label }));
    return items;
  }

  function getReadiness(draft) {
    const safeDraft = draft || {};
    const candidate = safeDraft.candidate || {};
    const main = safeDraft.mainDocuments || {};
    const service = safeDraft.service || {};
    const routeValues = safeDraft.route || {};
    const education = safeDraft.education || {};
    const missing = [];
    let requiredFields = 0;
    let completedFields = 0;
    let requiredDocuments = 0;
    let completedDocuments = 0;

    candidateFields.filter((field) => field.required).forEach((field) => {
      requiredFields += 1;
      if (hasValue(candidate[field.id])) completedFields += 1;
      else missing.push({ section: 'candidate', id: field.id, label: field.label, kind: 'field' });
    });

    mainDocuments.forEach((document) => {
      if (!isMainDocumentRequired(document.id, candidate)) return;
      requiredDocuments += 1;
      if (hasValue(main[document.id])) completedDocuments += 1;
      else missing.push({ section: 'mainDocuments', id: document.id, label: document.label, kind: 'document' });
    });

    requiredFields += 1;
    if (hasValue(service.serviceType)) completedFields += 1;
    else missing.push({ section: 'service', id: 'serviceType', label: 'Select Service Type', kind: 'field' });

    const routeId = service.routeId || getRouteIdForService(service.serviceType);
    getRequiredRouteItems(routeId).forEach((item) => {
      const source = item.section === 'service' ? service : routeValues;
      const value = source[item.id];
      const isDocument = Array.isArray(value) || (getRoute(routeId) && routeId !== 'employmentVisa' && getRoute(routeId).documents.some((doc) => doc.id === item.id)) || (routeId === 'employmentVisa' && getRoute(routeId).specialHire.documents.some((doc) => doc.id === item.id));
      if (isDocument) {
        requiredDocuments += 1;
        if (hasValue(value)) completedDocuments += 1;
        else missing.push({ section: item.section, id: item.id, label: item.label, kind: 'document' });
      } else {
        requiredFields += 1;
        if (hasValue(value)) completedFields += 1;
        else missing.push({ section: item.section, id: item.id, label: item.label, kind: 'field' });
      }
    });

    educationFields.filter((field) => field.required).forEach((field) => {
      requiredFields += 1;
      if (hasValue(education[field.id])) completedFields += 1;
      else missing.push({ section: 'education', id: field.id, label: field.label, kind: 'field' });
    });

    educationDocuments.filter((document) => document.required).forEach((document) => {
      requiredDocuments += 1;
      if (hasValue(education[document.id])) completedDocuments += 1;
      else missing.push({ section: 'education', id: document.id, label: document.label, kind: 'document' });
    });

    return {
      requiredFields,
      completedFields,
      requiredDocuments,
      completedDocuments,
      missing,
      ready: missing.length === 0
    };
  }

  return Object.freeze({
    sponsorshipLocations,
    religions,
    candidateFields,
    mainDocuments,
    serviceTypes,
    routes,
    educationFields,
    educationDocuments,
    additionalDocuments,
    getRoute,
    getRouteIdForService,
    getRequiredRouteItems,
    isMainDocumentRequired,
    getReadiness
  });
});
