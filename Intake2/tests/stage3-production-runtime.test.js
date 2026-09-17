const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const R = require(path.join(root, 'requirements.js'));
const P = require(path.join(root, 'production-rules.js'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const testMode = fs.readFileSync(path.join(root, 'test-mode.js'), 'utf8');
const gate = fs.readFileSync(path.join(root, 'entry-gate.js'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

assert.equal(R.sourceVersion, P.version, 'runtime adapter must identify the canonical production-rules version');
assert.equal(R.productionRules, P, 'runtime adapter must consume production-rules.js directly');

const productionIndex = html.indexOf('./production-rules.js');
const requirementsIndex = html.indexOf('./requirements.js');
assert.ok(productionIndex >= 0, 'production-rules.js must be loaded by the page');
assert.ok(requirementsIndex > productionIndex, 'production-rules.js must load before requirements.js');

assert.deepEqual(
  R.serviceTypes.map((item) => item.routeId),
  ['employmentVisa', 'relativeVisa', 'goldenVisa', 'emiratiNational', 'gccNational'],
  'only the five approved production service variants may be exposed'
);
assert.equal(R.getRoute('diplomaticPassport'), null, 'Diplomatic Passport must not exist in the production runtime');

assert.ok(R.candidateFields.some((field) => field.id === 'expectedJoiningDate' && field.required), 'Expected Joining Date must be required');
assert.ok(R.candidateFields.some((field) => field.id === 'skilledStatus'), 'Skilled Status must be captured');
assert.ok(R.candidateFields.some((field) => field.id === 'sponsorshipLocation' && field.required), 'Sponsoring Entity must be required');
assert.ok(!R.candidateFields.some((field) => ['religion', 'mothersName', 'maritalStatus'].includes(field.id)), 'legacy personal fields absent from the Project Source must not drive production readiness');

assert.equal(typeof R.isSpecialHireApplicable, 'function');
assert.equal(typeof R.getOnboardingPath, 'function');
assert.equal(typeof R.getCoreDocuments, 'function');
assert.equal(typeof R.getConditionalDocuments, 'function');

const mainlandSpecial = {
  candidate: {
    nationality: 'Indian',
    sponsorshipLocation: 'AECOM Abu Dhabi',
    skilledStatus: 'Unskilled'
  },
  service: { serviceType: 'Employment Visa & Work Permit', mobilizingFrom: 'Overseas Hire' },
  route: {}, education: {}, mainDocuments: {}, additionalDocuments: {}
};
assert.equal(R.isSpecialHireApplicable(mainlandSpecial), true, 'Indian overseas Abu Dhabi Employment Visa must be Special Hire');
assert.equal(R.getOnboardingPath(mainlandSpecial).id, 'EVW-MNL-OVERSEAS-SH');

const dwcNormal = structuredClone(mainlandSpecial);
dwcNormal.candidate.nationality = 'Jordan';
dwcNormal.candidate.sponsorshipLocation = 'AECOM Dubai South / DWC';
assert.equal(R.isSpecialHireApplicable(dwcNormal), false);
assert.equal(R.getOnboardingPath(dwcNormal).id, 'EVW-DWC-OVERSEAS');

const relative = {
  candidate: { nationality: 'Jordan', sponsorshipLocation: 'AECOM Dubai', skilledStatus: 'Unskilled' },
  service: { serviceType: 'Work Permit for Relative Visa Holders' },
  route: {}, education: {}, mainDocuments: {}, additionalDocuments: {}
};
assert.equal(R.getOnboardingPath(relative).id, 'WP-MNL-RELATIVE');
assert.ok(R.getRoute('relativeVisa').documents.every((doc) => doc.required === false), 'Relative sponsor documents are conditional/where applicable');
assert.equal(R.getRoute('goldenVisa').documents.length, 0, 'Golden Visa has no separate mandatory route upload in the current Project Source');

const emiratiDocs = R.getRoute('emiratiNational').documents;
assert.equal(emiratiDocs.find((doc) => doc.id === 'familyBook').required, true);
assert.equal(emiratiDocs.find((doc) => doc.id === 'nationalId').required, true);
assert.ok(!emiratiDocs.some((doc) => doc.id === 'medicalTestResult'), 'Medical must not be an Intake2 upload for Emirati cases');
const gccDocs = R.getRoute('gccNational').documents;
assert.ok(!gccDocs.some((doc) => doc.id === 'familyBook'), 'Family Book must not be shown for GCC cases');
assert.equal(gccDocs.find((doc) => doc.id === 'nationalId').required, true);

const skilled = structuredClone(relative);
skilled.candidate.skilledStatus = 'Skilled';
const skilledCore = R.getCoreDocuments(skilled);
assert.equal(skilledCore.find((doc) => doc.id === 'educationCertificate').required, true, 'Education Certificate must be required for Skilled cases');
const unskilledCore = R.getCoreDocuments(relative);
assert.ok(!unskilledCore.some((doc) => doc.id === 'educationCertificate'), 'Education Certificate must not be forced on Unskilled cases');

const specialConditional = R.getConditionalDocuments(mainlandSpecial);
assert.equal(specialConditional.find((doc) => doc.id === 'homeCountryNationalId').required, true);
assert.ok(!specialConditional.some((doc) => /medical|embassy/i.test(doc.id)), 'Home-country Medical and Embassy evidence must not be Intake2 uploads');

assert.equal(R.fileRules.maxSizeMB, 10);
assert.deepEqual(R.fileRules.allowedExtensions, ['pdf', 'jpg', 'jpeg', 'png']);
assert.match(testMode, /searchParams\.get\(['"]test['"]\).*===\s*['"]1['"]|searchParams\.has\(['"]test['"]\)/, 'test mode must require an explicit URL flag');
assert.match(gate, /REQ-/, 'shared request ID must use the REQ prefix');
assert.doesNotMatch(gate, /`INT-/, 'entry gate must not generate legacy INT request IDs');
assert.doesNotMatch(script, /`INT-/, 'runtime must not generate legacy INT request IDs');

console.log('Stage 3 production runtime contract passed');
