(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.Intake2ProductionRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const rules = {
    version: '1.1',
    status: 'approved-stage-1-source-synced',
    source: {
      title: 'AECOM UAE Employee Onboarding Journey',
      date: '2026-09-17',
      authority: 'project-source'
    },

    // Approved Intake2 implementation decisions that sit on top of the business source.
    requestId: {
      prefix: 'REQ',
      pattern: 'REQ-########',
      provenance: 'approved-intake2-implementation'
    },
    terminology: {
      route: 'Onboarding Path',
      routeId: 'Path ID',
      routeRegister: 'Onboarding Path Overview',
      routeSteps: 'Path Steps and Dependencies',
      routeSelection: 'Your onboarding path',
      provenance: 'approved-intake2-implementation'
    },
    fileRules: {
      maxSizeMB: 10,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      oneFilePerDocumentSlot: true,
      additionalSupportingDocumentsAllowMultiple: true,
      provenance: 'approved-intake2-implementation'
    },

    preconditions: {
      clientApproval: 'required',
      intake1: 'pathSpecific'
    },

    readinessFields: [
      { id: 'candidateFullName', label: 'Candidate Full Name', requirement: 'required', note: 'Must match the passport.' },
      { id: 'nationality', label: 'Nationality', requirement: 'required' },
      { id: 'countryOfBirth', label: 'Country of Birth', requirement: 'required' },
      { id: 'hireStatus', label: 'Hire Status', requirement: 'conditional', when: 'employmentVisaAndWorkPermit' },
      { id: 'sponsoringEntity', label: 'Sponsoring Entity', requirement: 'required' },
      { id: 'service', label: 'Service', requirement: 'required' },
      { id: 'currentUaeVisa', label: 'Current UAE Visa / Residency', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'unifiedNumber', label: 'Unified Number', requirement: 'conditional', when: 'whereAvailable' },
      { id: 'lastWorkingDate', label: 'Last Working Date', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'personalEmail', label: 'Personal Email', requirement: 'required' },
      { id: 'contactNumber', label: 'Contact Number', requirement: 'required' },
      { id: 'skilledStatus', label: 'Skilled Status', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'specialHireStatus', label: 'Special Hire Status', requirement: 'conditional', when: 'overseasEmploymentVisa' },
      { id: 'expectedJoiningDate', label: 'Expected Joining Date', requirement: 'required' },
      { id: 'candidateActions', label: 'Candidate Actions', requirement: 'conditional', when: 'whereApplicable' }
    ],

    entities: [
      { id: 'abuDhabi', label: 'AECOM Abu Dhabi', group: 'mainland' },
      { id: 'dubai', label: 'AECOM Dubai', group: 'mainland' },
      { id: 'alAin', label: 'AECOM Al Ain', group: 'mainland' },
      { id: 'dwc', label: 'AECOM Dubai South / DWC', group: 'freeZone' }
    ],

    serviceGroups: [
      {
        id: 'employmentVisaAndWorkPermit',
        label: 'Employment Visa and Work Permit',
        appliesWhen: 'candidateRequiresAecomSponsoredEmploymentVisaAndWorkPermit'
      },
      {
        id: 'existingVisaWorkPermit',
        label: 'Work Permit',
        appliesWhen: 'candidateAlreadyHoldsValidUaeResidency'
      },
      {
        id: 'nationalWorkPermit',
        label: 'Emirati and GCC National Work Permit',
        appliesWhen: 'candidateIsEmiratiOrGccNational'
      }
    ],

    // Intake2-specific service variants under the three source service groups.
    services: [
      {
        id: 'employmentVisa',
        label: 'Employment Visa & Work Permit',
        serviceGroup: 'employmentVisaAndWorkPermit',
        hireStatus: ['local', 'overseas']
      },
      {
        id: 'relativeVisa',
        label: 'Work Permit for Relative Visa Holders',
        serviceGroup: 'existingVisaWorkPermit',
        hireStatus: ['uaeResident']
      },
      {
        id: 'goldenVisa',
        label: 'Work Permit for Golden Visa Holder',
        serviceGroup: 'existingVisaWorkPermit',
        hireStatus: ['uaeResident']
      },
      {
        id: 'emiratiNational',
        label: 'Work Permit for Emirati National',
        serviceGroup: 'nationalWorkPermit',
        hireStatus: ['local']
      },
      {
        id: 'gccNational',
        label: 'Work Permit for GCC National',
        serviceGroup: 'nationalWorkPermit',
        hireStatus: ['local']
      }
    ],

    documents: [
      { id: 'passportCopy', label: 'Passport Copy', requirement: 'required' },
      { id: 'candidatePhoto', label: 'Candidate Photograph', requirement: 'required' },
      { id: 'signedOffer', label: 'Signed AECOM Offer / Contract', requirement: 'required' },
      {
        id: 'educationCertificate',
        label: 'Education Certificate',
        requirement: 'conditional',
        when: 'applicableSkilledClassification'
      },
      {
        id: 'educationalVerificationOrEquivalency',
        label: 'Educational Verification / Equivalency',
        requirement: 'conditional',
        when: 'educationCertificateProvidedAndVerificationAvailable'
      },
      {
        id: 'awardOrEducationDetailsDocument',
        label: 'Award or Education Details Document',
        requirement: 'conditional',
        when: 'educationCertificateProvidedAndVerificationUnavailable'
      },
      { id: 'policeClearance', label: 'Police Clearance Certificate', requirement: 'conditional', when: 'whereRequestedOrApplicable' },
      { id: 'emiratesId', label: 'Emirates ID', requirement: 'conditional', when: 'whereApplicable' },
      { id: 'currentResidency', label: 'Current UAE Visa / Residency', requirement: 'conditional', when: 'whereApplicable' },
      {
        id: 'externalCoverPassport',
        label: 'External Cover Passport',
        requirement: 'conditional',
        when: 'dubaiOrDwcAndApplicable',
        applicableEntities: ['dubai', 'dwc'],
        notApplicableEntities: ['abuDhabi', 'alAin']
      },
      {
        id: 'homeCountryNationalId',
        label: 'Home-country National ID',
        requirement: 'conditional',
        when: 'specialHireApplicable'
      }
    ],

    serviceDocuments: {
      relativeVisa: [
        { id: 'sponsorPassportCopy', label: 'Sponsor Passport Copy', requirement: 'conditional', when: 'whereApplicable' },
        { id: 'sponsorResidenceVisa', label: 'Sponsor Residence Visa', requirement: 'conditional', when: 'whereApplicable' },
        { id: 'sponsorEmiratesId', label: 'Sponsor Emirates ID', requirement: 'conditional', when: 'whereApplicable' },
        { id: 'sponsorNocLetter', label: 'Sponsor No Objection Certificate', requirement: 'conditional', when: 'whereApplicable' }
      ],
      // The current project source does not define a separate mandatory Golden Visa upload.
      // Current UAE residency evidence is handled by the core current-residency rule where applicable.
      goldenVisa: []
    },

    nationalDocuments: {
      emirati: {
        familyBook: 'required',
        nationalId: 'required',
        medicalAtIntake2: 'notApplicable',
        medicalTiming: 'afterWorkPermitApproval'
      },
      gcc: {
        familyBook: 'notApplicable',
        nationalId: 'required',
        medicalAtIntake2: 'notApplicable',
        medicalTiming: 'afterWorkPermitApproval'
      }
    },

    education: {
      certificateRequiredWhen: 'applicableSkilledClassification',
      verificationBranchWhen: 'educationCertificateProvided',
      question: 'Is Educational Verification / Certificate of Equivalency available?',
      ifEquivalencyAvailable: 'certificateOfEquivalencyOrEducationalVerification',
      ifEquivalencyUnavailable: 'awardOrEducationDetailsDocument',
      intake1Relationship: 'separate'
    },

    specialHire: {
      appliesOnlyTo: {
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
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
      allowMultiple: true,
      provenance: 'approved-intake2-implementation'
    },

    paths: [
      {
        id: 'EVW-MNL-LOCAL',
        label: 'Employment Visa & Work Permit – Mainland – Local Hire',
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'local',
        specialHire: false,
        intake1Required: true
      },
      {
        id: 'EVW-MNL-OVERSEAS',
        label: 'Employment Visa & Work Permit – Mainland – Overseas Hire',
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'overseas',
        specialHire: false,
        intake1Required: true
      },
      {
        id: 'EVW-MNL-OVERSEAS-SH',
        label: 'Employment Visa & Work Permit – Mainland – Overseas Special Hire',
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'overseas',
        specialHire: true,
        intake1Required: true
      },
      {
        id: 'EVW-DWC-LOCAL',
        label: 'Employment Visa & Work Permit – AECOM Dubai South / DWC – Local Hire',
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'local',
        specialHire: false,
        intake1Required: false
      },
      {
        id: 'EVW-DWC-OVERSEAS',
        label: 'Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Hire',
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'overseas',
        specialHire: false,
        intake1Required: false
      },
      {
        id: 'EVW-DWC-OVERSEAS-SH',
        label: 'Employment Visa & Work Permit – AECOM Dubai South / DWC – Overseas Special Hire',
        service: 'employmentVisa',
        serviceGroup: 'employmentVisaAndWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'overseas',
        specialHire: true,
        intake1Required: false
      },
      {
        id: 'WP-MNL-GOLDEN',
        label: 'Golden Visa Work Permit – Mainland',
        service: 'goldenVisa',
        serviceGroup: 'existingVisaWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'uaeResident',
        intake1Required: true
      },
      {
        id: 'WP-DWC-GOLDEN',
        label: 'Golden Visa Work Permit – AECOM Dubai South / DWC',
        service: 'goldenVisa',
        serviceGroup: 'existingVisaWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'uaeResident',
        intake1Required: false
      },
      {
        id: 'WP-MNL-RELATIVE',
        label: 'Relative Visa Work Permit – Mainland',
        service: 'relativeVisa',
        serviceGroup: 'existingVisaWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'uaeResident',
        intake1Required: true
      },
      {
        id: 'WP-DWC-RELATIVE',
        label: 'Relative Visa Work Permit – AECOM Dubai South / DWC',
        service: 'relativeVisa',
        serviceGroup: 'existingVisaWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'uaeResident',
        intake1Required: false
      },
      {
        id: 'WP-MNL-EMIRATI',
        label: 'Emirati National Work Permit – Mainland',
        service: 'emiratiNational',
        serviceGroup: 'nationalWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'local',
        intake1Required: false
      },
      {
        id: 'WP-DWC-EMIRATI',
        label: 'Emirati National Work Permit – AECOM Dubai South / DWC',
        service: 'emiratiNational',
        serviceGroup: 'nationalWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'local',
        intake1Required: false
      },
      {
        id: 'WP-MNL-GCC',
        label: 'GCC National Work Permit – Mainland',
        service: 'gccNational',
        serviceGroup: 'nationalWorkPermit',
        entityGroup: 'mainland',
        hireStatus: 'local',
        intake1Required: false
      },
      {
        id: 'WP-DWC-GCC',
        label: 'GCC National Work Permit – AECOM Dubai South / DWC',
        service: 'gccNational',
        serviceGroup: 'nationalWorkPermit',
        entityGroup: 'freeZone',
        hireStatus: 'local',
        intake1Required: false
      }
    ]
  };

  return Object.freeze(rules);
});
