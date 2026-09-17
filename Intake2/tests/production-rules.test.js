const assert = require('node:assert/strict');
const path = require('node:path');

const rules = require(path.resolve(__dirname, '..', 'production-rules.js'));

assert.equal(rules.version, '1.0');
assert.equal(rules.requestId.prefix, 'REQ');
assert.equal(rules.terminology.route, 'Onboarding Path');
assert.equal(rules.fileRules.maxSizeMB, 10);
assert.deepEqual(rules.fileRules.allowedExtensions, ['pdf', 'jpg', 'jpeg', 'png']);

assert.deepEqual(
  rules.services.map((service) => service.id),
  ['employmentVisa', 'relativeVisa', 'goldenVisa', 'emiratiNational', 'gccNational']
);
assert.ok(!rules.services.some((service) => /diplomatic/i.test(service.id + service.label)));

const docs = Object.fromEntries(rules.documents.map((doc) => [doc.id, doc]));
assert.equal(docs.passportCopy.requirement, 'required');
assert.equal(docs.candidatePhoto.requirement, 'required');
assert.equal(docs.signedOffer.requirement, 'required');
assert.equal(docs.educationCertificate.requirement, 'conditional');
assert.equal(docs.educationCertificate.when, 'skilledApplicable');
assert.equal(docs.policeClearance.requirement, 'conditional');
assert.equal(docs.externalCoverPassport.when, 'dubaiOrDwc');

assert.equal(rules.nationalDocuments.emirati.familyBook, 'required');
assert.equal(rules.nationalDocuments.emirati.nationalId, 'required');
assert.equal(rules.nationalDocuments.gcc.familyBook, 'notApplicable');
assert.equal(rules.nationalDocuments.gcc.nationalId, 'required');

assert.deepEqual(rules.specialHire.mainland.nationalities.sort(), ['Egypt', 'India', 'Pakistan', 'Sri Lanka'].sort());
assert.deepEqual(rules.specialHire.mainland.entities.sort(), ['abuDhabi', 'alAin'].sort());
assert.deepEqual(rules.specialHire.freeZone.nationalities.sort(), ['Egypt', 'Sri Lanka'].sort());
assert.deepEqual(rules.specialHire.intakeDocuments, ['homeCountryNationalId']);
assert.deepEqual(rules.specialHire.laterProcessOnly.sort(), ['homeCountryMedical', 'uaeEmbassyProcess'].sort());

assert.equal(rules.education.ifEquivalencyAvailable, 'certificateOfEquivalency');
assert.equal(rules.education.ifEquivalencyUnavailable, 'awardEducationDetailsDocument');
assert.equal(rules.additionalSupportingDocuments.requirement, 'optional');

console.log('Intake2 production rules test passed');
