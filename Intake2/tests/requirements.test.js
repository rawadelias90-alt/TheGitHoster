const assert = require('node:assert/strict');
const R = require('../requirements.js');

const expectedServices = [
  'Employment Visa & Work Permit',
  'Work Permit for Relative Visa Holders',
  'Work Permit for Golden Visa Holder',
  'Work Permit for Emirati National',
  'Work Permit for GCC National',
  'Work Permit for Diplomatic Passport Holder'
];

assert.deepEqual(R.serviceTypes.map((item) => item.label), expectedServices, 'six source service types must be preserved exactly');
assert.equal(R.candidateFields.length, 13, '12 source candidate fields plus retained Employment Start Date');
assert.equal(R.candidateFields.find((item) => item.id === 'candidateFullName').required, true);
assert.equal(R.candidateFields.find((item) => item.id === 'uid').required, false);
assert.equal(R.candidateFields.find((item) => item.id === 'religion').options.length, 19, 'all source religion choices must be retained');

assert.equal(R.mainDocuments.some((item) => item.id === 'policeClearanceCertificate'), true, 'PCC from branching schema must be retained');
assert.equal(R.isMainDocumentRequired('externalCoverPassport', { sponsorshipLocation: 'AECOM Middle East Limited – Dubai' }), true);
assert.equal(R.isMainDocumentRequired('externalCoverPassport', { sponsorshipLocation: 'AECOM Middle East Limited – DWC' }), true);
assert.equal(R.isMainDocumentRequired('externalCoverPassport', { sponsorshipLocation: 'AECOM Middle East Limited – Abu Dhabi' }), false);
assert.equal(R.isMainDocumentRequired('externalCoverPassport', { sponsorshipLocation: 'AECOM Middle East Limited – Al Ain' }), false);

assert.deepEqual(R.getRoute('relativeVisa').documents.map((item) => item.id), [
  'sponsorPassportCopy',
  'sponsorResidenceVisa',
  'sponsorEmiratesId',
  'sponsorNocLetter'
]);
assert.equal(R.getRoute('goldenVisa').documents.length, 1);
assert.equal(R.getRoute('emiratiNational').documents.find((item) => item.id === 'familyBook').required, true);
assert.equal(R.getRoute('gccNational').documents.find((item) => item.id === 'familyBook').required, false);
assert.equal(R.getRoute('diplomaticPassport').documents.find((item) => item.id === 'embassyApproval').required, false);

assert.equal(R.getRoute('employmentVisa').confirmQuestion, 'STOP & CONFIRM – Does this request fall under CASE A or CASE B?');
assert.deepEqual(R.getRoute('employmentVisa').confirmOptions, ['Yes', 'No']);
assert.equal(R.getRoute('employmentVisa').specialHire.confirmations.length, 2);

assert.equal(R.educationFields.find((item) => item.id === 'equivalencyAvailable').required, true);
assert.equal(R.educationDocuments.find((item) => item.id === 'educationDetailsForm').required, true);
assert.equal(R.educationDocuments.find((item) => item.id === 'certificateOfEquivalency').required, true);
assert.equal(R.additionalDocuments[0].required, false);

for (const service of R.serviceTypes) {
  const route = R.getRoute(service.routeId);
  assert.ok(route, `route ${service.routeId} must exist`);
  assert.equal(route.nextStage, 'education', `${service.routeId} must continue to education/equivalency`);
}

const candidate = Object.fromEntries(R.candidateFields.filter((field) => field.required).map((field) => [field.id, 'x']));
candidate.sponsorshipLocation = 'AECOM Middle East Limited – Abu Dhabi';

const readyEmployment = R.getReadiness({
  candidate,
  mainDocuments: Object.fromEntries(R.mainDocuments.filter((doc) => R.isMainDocumentRequired(doc.id, candidate)).map((doc) => [doc.id, [{ name: 'file.pdf' }]])),
  service: { serviceType: 'Employment Visa & Work Permit', routeId: 'employmentVisa', caseConfirmation: 'Yes' },
  route: {
    homeCountryNationalId: [{ name: 'id.pdf' }],
    medicalHomeCountryConfirmed: 'Yes',
    passportEmbassyConfirmed: 'Yes'
  },
  education: {
    equivalencyAvailable: 'Yes',
    educationDetailsForm: [{ name: 'education.docx' }],
    certificateOfEquivalency: [{ name: 'equiv.pdf' }]
  },
  additionalDocuments: []
});
assert.equal(readyEmployment.missing.length, 0, 'fully populated Employment route should be ready');
assert.equal(readyEmployment.ready, true);

console.log('requirements tests passed');
