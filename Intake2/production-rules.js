(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.Intake2ProductionRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const rules = {
    version: '1.0',
    status: 'approved-stage-1',
    requestId: {
      prefix: 'REQ',
      pattern: 'REQ-########'
    },
    terminology: {
      route: 'Onboarding Path',
      routeId: 'Path ID',
      routeRegister: 'Onboarding Path Overview',
      routeSteps: 'Path Steps and Dependencies',
      routeSelection: 'Your onboarding path'
    },
    fileRules: {
      maxSizeMB: 10,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      oneFilePerDocumentSlot: true,
      additionalSupportingDocumentsAllowMultiple: true
    },
    entities: [
      { id: 'abuDhabi', label: 'AECOM Middle East Limited – Abu Dhabi', group: 'mainland' },
      { id: 'dubai', label: 'AECOM Middle East Limited – Dubai', group: 'mainland' },
      { id: 'alAin', label: 'AECOM Middle East Limited – Al Ain', group: 'mainland' },
      { id: 'dwc', label: 'AECOM Dubai South / DWC', group: 'freeZone' }
    ],
    services: [
      { id: 'employmentVisa', label: 'Employment Visa & Work Permit', hireStatus: ['local', 'overseas'] },
      { id: 'relativeVisa', label: 'Work Permit for Relative Visa Holders', hireStatus: ['local'] },
      { id: 'goldenVisa', label: 'Work Permit for Golden Visa Holder', hireStatus: ['local'] },
      { id: 'emiratiNational', label: 'Work Permit for Emirati National', hireStatus: ['local'] },
      { id: 'gccNational', label: 'Work Permit for GCC National', hireStatus: ['local'] }
    ],
    documents: [
      { id: 'passportCopy', label: 'Passport Copy', requirement: 'required' },
      { id: 'candidatePhoto', label: 'Candidate Photograph', requirement: 'required' },
      { id: 'signedOffer', label: 'Signed AECOM Offer / Contract', requirement: 'required' },
      { id: 'educationCertificate', label: 'Education Certificate attested by MoFA UAE', requirement: 'conditional', when: 'skilledApplicable' },
      { id: 'policeClearance', label: 'Police Clearance Certificate', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'emiratesId', label: 'Emirates ID', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'currentResidency', label: 'Current UAE Visa / Residency', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'externalCoverPassport', label: 'External Cover Passport', requirement: 'conditional', when: 'dubaiOrDwc' }
    ],
    serviceDocuments: {
      relativeVisa: [
        { id: 'sponsorPassportCopy', label: 'Sponsor Passport Copy', requirement: 'required' },
        { id: 'sponsorResidenceVisa', label: 'Sponsor Residence Visa', requirement: 'required' },
        { id: 'sponsorEmiratesId', label: 'Sponsor Emirates ID', requirement: 'required' },
        { id: 'sponsorNocLetter', label: 'Sponsor NOC', requirement: 'required' }
      ],
      goldenVisa: [
        { id: 'goldenVisaCopy', label: 'Golden Visa Copy', requirement: 'required' }
      ]
    },
    nationalDocuments: {
      emirati: {
        familyBook: 'required',
        nationalId: 'required',
        medicalAtIntake2: 'notApplicable'
      },
      gcc: {
        familyBook: 'notApplicable',
        nationalId: 'required',
        medicalAtIntake2: 'notApplicable'
      }
    },
    education: {
      appliesWhen: 'skilledApplicable',
      question: 'Is Certificate of Equivalency / Educational Verification available?',
      ifEquivalencyAvailable: 'certificateOfEquivalency',
      ifEquivalencyUnavailable: 'awardEducationDetailsDocument'
    },
    specialHire: {
      appliesOnlyTo: {
        service: 'employmentVisa',
        hireStatus: 'overseas'
      },
      mainland: {
        entities: ['abuDhabi', 'alAin'],
        nationalities: ['India', 'Pakistan', 'Egypt', 'Sri Lanka']
      },
      freeZone: {
        entities: ['dwc'],
        nationalities: ['Egypt', 'Sri Lanka']
      },
      intakeDocuments: ['homeCountryNationalId'],
      laterProcessOnly: ['homeCountryMedical', 'uaeEmbassyProcess']
    },
    additionalSupportingDocuments: {
      requirement: 'optional',
      placement: 'beforeReview',
      allowMultiple: true
    },
    paths: [
      { id: 'EVW-MNL-LOCAL', label: 'Employment Visa & Work Permit – Mainland – Local Hire', service: 'employmentVisa', entityGroup: 'mainland', hireStatus: 'local', specialHire: false },
      { id: 'EVW-MNL-OVERSEAS', label: 'Employment Visa & Work Permit – Mainland – Overseas Hire', service: 'employmentVisa', entityGroup: 'mainland', hireStatus: 'overseas', specialHire: false },
      { id: 'EVW-MNL-OVERSEAS-SH', label: 'Employment Visa & Work Permit – Mainland – Overseas Special Hire', service: 'employmentVisa', entityGroup: 'mainland', hireStatus: 'overseas', specialHire: true },
      { id: 'EVW-DWC-LOCAL', label: 'Employment Visa & Work Permit – AECOM Dubai South / DWC – Local Hire', service: 'employmentVisa', entityGroup: 'freeZone', hireStatus: 'local', specialHire: false },
      { id: 'EVW-DWC-OVERSEAS', label: 'Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Hire', service: 'employmentVisa', entityGroup: 'freeZone', hireStatus: 'overseas', specialHire: false },
      { id: 'EVW-DWC-OVERSEAS-SH', label: 'Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Special Hire', service: 'employmentVisa', entityGroup: 'freeZone', hireStatus: 'overseas', specialHire: true },
      { id: 'WP-MNL-GOLDEN', label: 'Golden Visa Work Permit – Mainland', service: 'goldenVisa', entityGroup: 'mainland', hireStatus: 'local' },
      { id: 'WP-DWC-GOLDEN', label: 'Golden Visa Work Permit – AECOM Dubai South / DWC', service: 'goldenVisa', entityGroup: 'freeZone', hireStatus: 'local' },
      { id: 'WP-MNL-RELATIVE', label: 'Relative Visa Work Permit – Mainland', service: 'relativeVisa', entityGroup: 'mainland', hireStatus: 'local' },
      { id: 'WP-DWC-RELATIVE', label: 'Relative Visa Work Permit – AECOM Dubai South / DWC', service: 'relativeVisa', entityGroup: 'freeZone', hireStatus: 'local' },
      { id: 'WP-MNL-EMIRATI', label: 'Emirati National Work Permit – Mainland', service: 'emiratiNational', entityGroup: 'mainland', hireStatus: 'local' },
      { id: 'WP-DWC-EMIRATI', label: 'Emirati National Work Permit – AECOM Dubai South / DWC', service: 'emiratiNational', entityGroup: 'freeZone', hireStatus: 'local' },
      { id: 'WP-MNL-GCC', label: 'GCC National Work Permit – Mainland', service: 'gccNational', entityGroup: 'mainland', hireStatus: 'local' },
      { id: 'WP-DWC-GCC', label: 'GCC National Work Permit – AECOM Dubai South / DWC', service: 'gccNational', entityGroup: 'freeZone', hireStatus: 'local' }
    ]
  };

  return Object.freeze(rules);
});
