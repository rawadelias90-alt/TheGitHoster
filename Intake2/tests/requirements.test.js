const assert = require('node:assert/strict');
const R = require('../requirements.js');
const P = require('../production-rules.js');

assert.equal(R.sourceVersion, P.version);
assert.equal(R.productionRules, P);
assert.deepEqual(R.serviceTypes.map((item) => item.label), [
  'Employment Visa & Work Permit',
  'Work Permit for Relative Visa Holders',
  'Work Permit for Golden Visa Holder',
  'Work Permit for Emirati National',
  'Work Permit for GCC National'
]);
assert.equal(R.getRoute('diplomaticPassport'), null);

assert.equal(R.candidateFields.find((item) => item.id === 'candidateFullName').required, true);
assert.equal(R.candidateFields.find((item) => item.id === 'expectedJoiningDate').required, true);
assert.equal(R.candidateFields.find((item) => item.id === 'skilledStatus').required, true);
assert.equal(R.candidateFields.find((item) => item.id === 'unifiedNumber').required, false);

const baseDraft = {
  candidate: {
    candidateFullName: 'Test Candidate',
    nationality: 'Jordan',
    countryOfBirth: 'Jordan',
    personalEmail: 'candidate@example.com',
    contactNumber: '+971500000000',
    sponsorshipLocation: 'AECOM Dubai',
    skilledStatus: 'Unskilled',
    expectedJoiningDate: '2026-10-01'
  },
  mainDocuments: {
    passportCopy: [{ name: 'passport.pdf' }],
    candidatePhoto: [{ name: 'photo.jpg' }],
    signedOffer: [{ name: 'offer.pdf' }]
  },
  service: {
    serviceType: 'Employment Visa & Work Permit',
    routeId: 'employmentVisa',
    clientApprovalConfirmed: 'Yes',
    mobilizingFrom: 'Local Hire',
    intake1Completed: 'Yes'
  },
  route: {},
  education: {},
  additionalDocuments: {}
};

assert.equal(R.getOnboardingPath(baseDraft).id, 'EVW-MNL-LOCAL');
assert.equal(R.isSpecialHireApplicable(baseDraft), false);
assert.equal(R.getReadiness(baseDraft).ready, true, 'complete unskilled Mainland Local Employment Visa request should be ready');

const specialDraft = structuredClone(baseDraft);
specialDraft.candidate.nationality = 'Egyptian';
specialDraft.candidate.sponsorshipLocation = 'AECOM Abu Dhabi';
specialDraft.service.mobilizingFrom = 'Overseas Hire';
specialDraft.route.homeCountryNationalId = [{ name: 'national-id.pdf' }];
assert.equal(R.isSpecialHireApplicable(specialDraft), true);
assert.equal(R.getOnboardingPath(specialDraft).id, 'EVW-MNL-OVERSEAS-SH');
assert.equal(R.getReadiness(specialDraft).ready, true);

delete specialDraft.route.homeCountryNationalId;
const specialMissing = R.getReadiness(specialDraft);
assert.equal(specialMissing.ready, false);
assert.ok(specialMissing.missing.some((item) => item.id === 'homeCountryNationalId'));

const skilledDraft = structuredClone(baseDraft);
skilledDraft.candidate.skilledStatus = 'Skilled';
skilledDraft.mainDocuments.educationCertificate = [{ name: 'education.pdf' }];
skilledDraft.education.equivalencyAvailable = 'No';
skilledDraft.education.awardOrEducationDetailsDocument = [{ name: 'award.pdf' }];
assert.equal(R.getReadiness(skilledDraft).ready, true, 'Skilled candidate with the No-equivalency document branch should be ready');

const relativeDraft = structuredClone(baseDraft);
relativeDraft.service = {
  serviceType: 'Work Permit for Relative Visa Holders',
  routeId: 'relativeVisa',
  clientApprovalConfirmed: 'Yes',
  intake1Completed: 'Yes'
};
assert.equal(R.getOnboardingPath(relativeDraft).id, 'WP-MNL-RELATIVE');
assert.equal(R.getReadiness(relativeDraft).ready, true, 'Relative Visa sponsor documents remain conditional/where applicable');

assert.equal(R.fileRules.maxSizeMB, 10);
assert.deepEqual(R.fileRules.allowedExtensions, ['pdf', 'jpg', 'jpeg', 'png']);

console.log('requirements tests passed');
