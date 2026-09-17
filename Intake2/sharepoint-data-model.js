(function (root, factory) {
  const productionRules = (typeof module === 'object' && module.exports)
    ? require('./production-rules.js')
    : root && root.Intake2ProductionRules;
  const model = factory(productionRules);
  if (typeof module === 'object' && module.exports) module.exports = model;
  if (root) root.Intake2SharePointDataModel = model;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (P) {
  'use strict';

  if (!P) throw new Error('Intake2ProductionRules failed to load.');

  const requestStatuses = [
    'Draft',
    'Submission Received',
    'Documents Incomplete',
    'Ready for GRO',
    'Processing',
    'Completed',
    'Exception'
  ];

  const documentStatuses = ['Pending', 'Complete', 'Incomplete'];
  const groStatuses = [
    'Not Started',
    'Submitted to Authority',
    'Candidate Action Required',
    'Initial Approval',
    'Payment / Processing',
    'Approved',
    'Visa Issued',
    'Status Change',
    'Post-Joining',
    'Pension',
    'Completed',
    'Exception'
  ];

  const requestColumns = [
    { internalName: 'RequestID', displayName: 'Request ID', type: 'Text', required: true, indexed: true, unique: true, pattern: 'REQ-########', addToDefaultView: true },
    { internalName: 'RequesterEmail', displayName: 'Requester Email', type: 'Text', required: true, indexed: true },
    { internalName: 'SubmittedAt', displayName: 'Submitted At', type: 'DateTime', required: true, indexed: true, addToDefaultView: true },
    { internalName: 'RequestStatus', displayName: 'Request Status', type: 'Choice', required: true, indexed: true, choices: requestStatuses, defaultValue: 'Submission Received', addToDefaultView: true },
    { internalName: 'DocumentStatus', displayName: 'Document Status', type: 'Choice', required: true, indexed: true, choices: documentStatuses, defaultValue: 'Pending', addToDefaultView: true },

    { internalName: 'CandidateFullName', displayName: 'Candidate Full Name', type: 'Text', required: true, indexed: true, addToDefaultView: true },
    { internalName: 'Nationality', displayName: 'Nationality', type: 'Text', required: true },
    { internalName: 'CountryOfBirth', displayName: 'Country of Birth', type: 'Text', required: true },
    { internalName: 'PersonalEmail', displayName: 'Personal Email', type: 'Text', required: true },
    { internalName: 'ContactNumber', displayName: 'Contact Number', type: 'Text', required: true },
    { internalName: 'ExpectedJoiningDate', displayName: 'Expected Joining Date', type: 'DateTime', dateOnly: true, required: true, indexed: true, addToDefaultView: true },

    { internalName: 'SponsoringEntity', displayName: 'Sponsoring Entity', type: 'Choice', required: true, indexed: true, choices: P.entities.map((item) => item.label), addToDefaultView: true },
    { internalName: 'EntityGroup', displayName: 'Entity Group', type: 'Choice', required: true, indexed: true, choices: ['Mainland', 'Dubai South (DWC)'] },
    { internalName: 'Service', displayName: 'Service', type: 'Choice', required: true, indexed: true, choices: P.services.map((item) => item.label), addToDefaultView: true },
    { internalName: 'ServiceGroup', displayName: 'Service Group', type: 'Choice', required: true, choices: P.serviceGroups.map((item) => item.label) },
    { internalName: 'HireStatus', displayName: 'Hire Status', type: 'Choice', required: true, indexed: true, choices: ['Local', 'Overseas', 'UAE resident'], addToDefaultView: true },
    { internalName: 'SkilledStatus', displayName: 'Skilled Status', type: 'Choice', required: false, choices: ['Skilled', 'Unskilled', 'Not applicable'] },
    { internalName: 'SpecialHire', displayName: 'Special Hire', type: 'Boolean', required: true, indexed: true, defaultValue: false, addToDefaultView: true },
    { internalName: 'PathID', displayName: 'Path ID', type: 'Text', required: true, indexed: true },
    { internalName: 'OnboardingPath', displayName: 'Onboarding Path', type: 'Text', required: true },
    { internalName: 'Intake1Required', displayName: 'Intake 1 Required', type: 'Boolean', required: true, defaultValue: false },
    { internalName: 'Intake1Status', displayName: 'Intake 1 Status', type: 'Choice', required: true, choices: ['Not Required', 'Pending', 'Completed'] },
    { internalName: 'ClientApprovalConfirmed', displayName: 'Client Approval Confirmed', type: 'Boolean', required: true, defaultValue: true },
    { internalName: 'ClientApprovalDate', displayName: 'Client Approval Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'CurrentUaeVisaResidency', displayName: 'Current UAE Visa / Residency', type: 'Text', required: false },
    { internalName: 'UnifiedNumber', displayName: 'Unified Number', type: 'Text', required: false },
    { internalName: 'LastWorkingDate', displayName: 'Last Working Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'EducationRequirement', displayName: 'Education Requirement', type: 'Choice', required: false, choices: ['Not Applicable', 'Certificate Required', 'Verification / Equivalency Available', 'Award / Education Details Required'] },

    { internalName: 'GROStatus', displayName: 'GRO Status', type: 'Choice', required: true, indexed: true, choices: groStatuses, defaultValue: 'Not Started', addToDefaultView: true },
    { internalName: 'GROSubmittedDate', displayName: 'GRO Submitted Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'InitialApprovalDate', displayName: 'Initial Approval Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'CandidateSignatureDate', displayName: 'Candidate Signature Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'WorkPermitApprovalDate', displayName: 'Work Permit Approval Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'VisaIssuedDate', displayName: 'Visa Issued Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'StatusChangeDate', displayName: 'Status Change Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'MedicalCompletedDate', displayName: 'Medical Completed Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'EmiratesIdCompletedDate', displayName: 'Emirates ID Completed Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'ResidenceCompletedDate', displayName: 'Residence Completed Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'WorkPermitStartDate', displayName: 'Work Permit Start Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'PensionFund', displayName: 'Pension Fund', type: 'Choice', required: false, choices: ['ADPF', 'GPSSA', 'Not Applicable'], defaultValue: 'Not Applicable' },
    { internalName: 'PensionEnrollmentDate', displayName: 'Pension Enrollment Date', type: 'DateTime', dateOnly: true, required: false },
    { internalName: 'JoiningDate', displayName: 'Joining Date', type: 'DateTime', dateOnly: true, required: false, indexed: true, addToDefaultView: true },
    { internalName: 'CompletionDate', displayName: 'Completion Date', type: 'DateTime', dateOnly: true, required: false },

    { internalName: 'ExceptionFlag', displayName: 'Exception', type: 'Boolean', required: true, indexed: true, defaultValue: false },
    { internalName: 'ExceptionReason', displayName: 'Exception Reason', type: 'Note', required: false },
    { internalName: 'GRONotes', displayName: 'GRO Notes', type: 'Note', required: false }
  ];

  const documentColumns = [
    { internalName: 'RequestID', displayName: 'Request ID', type: 'Text', required: true, indexed: true, addToDefaultView: true },
    { internalName: 'CandidateFullName', displayName: 'Candidate Full Name', type: 'Text', required: true, indexed: true, addToDefaultView: true },
    { internalName: 'DocumentType', displayName: 'Document Type', type: 'Text', required: true, indexed: true, addToDefaultView: true },
    { internalName: 'Service', displayName: 'Service', type: 'Text', required: true },
    { internalName: 'SponsoringEntity', displayName: 'Sponsoring Entity', type: 'Text', required: true },
    { internalName: 'RequiredForSubmission', displayName: 'Required for Submission', type: 'Boolean', required: true, defaultValue: false },
    { internalName: 'UploadStatus', displayName: 'Upload Status', type: 'Choice', required: true, indexed: true, choices: ['Uploaded', 'Superseded', 'Exception'], defaultValue: 'Uploaded', addToDefaultView: true },
    { internalName: 'OriginalFileName', displayName: 'Original File Name', type: 'Text', required: true }
  ];

  const model = {
    version: '1.0',
    source: {
      title: 'AECOM UAE Employee Onboarding Journey',
      date: '2026-09-17',
      productionRulesVersion: P.version
    },
    requestsList: {
      title: 'Intake2 Requests',
      template: 100,
      enableVersioning: true,
      columns: requestColumns,
      defaultView: requestColumns.filter((column) => column.addToDefaultView).map((column) => column.internalName),
      operationalViews: [
        { title: 'Active Cases', filter: "RequestStatus != 'Completed'" },
        { title: 'Ready for GRO', filter: "RequestStatus = 'Ready for GRO'" },
        { title: 'Documents Incomplete', filter: "RequestStatus = 'Documents Incomplete'" },
        { title: 'Exceptions', filter: "RequestStatus = 'Exception' OR ExceptionFlag = true" },
        { title: 'Completed', filter: "RequestStatus = 'Completed'" }
      ]
    },
    documentsLibrary: {
      title: 'Intake2 Documents',
      template: 101,
      enableVersioning: true,
      columns: documentColumns,
      defaultView: documentColumns.filter((column) => column.addToDefaultView).map((column) => column.internalName),
      fileNamePattern: 'REQ-########__<original filename>'
    },
    compatibility: {
      titleValue: 'RequestID',
      legacyTestList: 'Intake2 Integration Test',
      legacyTestLibrary: 'Intake2 Test Documents',
      preserveLegacyTestAssets: true
    },
    provisioning: {
      connector: 'SharePoint',
      method: 'Power Automate SharePoint REST',
      requiresAdmin: false,
      requiredSitePermission: 'Manage Lists',
      siteUrlStorage: 'runtime/package only; not committed to the public repository'
    }
  };

  return Object.freeze(model);
});
