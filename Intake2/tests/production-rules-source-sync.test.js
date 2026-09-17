const assert = require('node:assert/strict');
const path = require('node:path');

const rules = require(path.resolve(__dirname, '..', 'production-rules.js'));

assert.equal(rules.source.date, '2026-09-17');
assert.equal(rules.preconditions.clientApproval, 'required');

assert.deepEqual(
  rules.serviceGroups.map((group) => group.id),
  ['employmentVisaAndWorkPermit', 'existingVisaWorkPermit', 'nationalWorkPermit']
);

const services = Object.fromEntries(rules.services.map((service) => [service.id, service]));
assert.deepEqual(services.employmentVisa.hireStatus, ['local', 'overseas']);
assert.deepEqual(services.relativeVisa.hireStatus, ['uaeResident']);
assert.deepEqual(services.goldenVisa.hireStatus, ['uaeResident']);
assert.equal(services.relativeVisa.serviceGroup, 'existingVisaWorkPermit');
assert.equal(services.goldenVisa.serviceGroup, 'existingVisaWorkPermit');
assert.equal(services.emiratiNational.serviceGroup, 'nationalWorkPermit');
assert.equal(services.gccNational.serviceGroup, 'nationalWorkPermit');

const docs = Object.fromEntries(rules.documents.map((doc) => [doc.id, doc]));
assert.equal(docs.externalCoverPassport.requirement, 'conditional');
assert.equal(docs.externalCoverPassport.when, 'dubaiOrDwcAndApplicable');
assert.deepEqual(docs.externalCoverPassport.notApplicableEntities, ['abuDhabi', 'alAin']);

assert.ok(rules.serviceDocuments.relativeVisa.length === 4);
rules.serviceDocuments.relativeVisa.forEach((doc) => {
  assert.equal(doc.requirement, 'conditional');
  assert.equal(doc.when, 'whereApplicable');
});
assert.deepEqual(rules.serviceDocuments.goldenVisa, []);

assert.equal(rules.education.certificateRequiredWhen, 'applicableSkilledClassification');
assert.equal(rules.education.verificationBranchWhen, 'educationCertificateProvided');
assert.equal(rules.education.ifEquivalencyAvailable, 'certificateOfEquivalencyOrEducationalVerification');
assert.equal(rules.education.ifEquivalencyUnavailable, 'awardOrEducationDetailsDocument');

const readiness = Object.fromEntries(rules.readinessFields.map((field) => [field.id, field]));
assert.equal(readiness.expectedJoiningDate.requirement, 'required');
assert.equal(readiness.hireStatus.when, 'employmentVisaAndWorkPermit');
assert.equal(readiness.currentUaeVisa.requirement, 'conditional');

const paths = Object.fromEntries(rules.paths.map((item) => [item.id, item]));
assert.equal(paths['EVW-MNL-LOCAL'].intake1Required, true);
assert.equal(paths['EVW-MNL-OVERSEAS'].intake1Required, true);
assert.equal(paths['EVW-DWC-LOCAL'].intake1Required, false);
assert.equal(paths['WP-MNL-GOLDEN'].hireStatus, 'uaeResident');
assert.equal(paths['WP-MNL-GOLDEN'].intake1Required, true);
assert.equal(paths['WP-DWC-GOLDEN'].hireStatus, 'uaeResident');
assert.equal(paths['WP-DWC-GOLDEN'].intake1Required, false);
assert.equal(paths['WP-MNL-RELATIVE'].hireStatus, 'uaeResident');
assert.equal(paths['WP-DWC-RELATIVE'].hireStatus, 'uaeResident');
assert.equal(paths['WP-MNL-EMIRATI'].intake1Required, false);
assert.equal(paths['WP-DWC-GCC'].intake1Required, false);

console.log('Intake2 production rules source-sync test passed');