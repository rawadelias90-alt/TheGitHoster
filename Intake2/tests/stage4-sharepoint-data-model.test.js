const assert = require('node:assert/strict');
const model = require('../sharepoint-data-model.js');

assert.equal(model.version, '1.0');
assert.equal(model.requestsList.title, 'Intake2 Requests');
assert.equal(model.documentsLibrary.title, 'Intake2 Documents');
assert.notEqual(model.requestsList.title, 'Intake2 Integration Test');
assert.notEqual(model.documentsLibrary.title, 'Intake2 Test Documents');

const requestColumns = Object.fromEntries(model.requestsList.columns.map((column) => [column.internalName, column]));
const documentColumns = Object.fromEntries(model.documentsLibrary.columns.map((column) => [column.internalName, column]));

assert.equal(requestColumns.RequestID.type, 'Text');
assert.equal(requestColumns.RequestID.required, true);
assert.equal(requestColumns.RequestID.indexed, true);
assert.equal(requestColumns.RequestID.unique, true);
assert.match(requestColumns.RequestID.pattern, /^REQ-/);

assert.deepEqual(requestColumns.RequestStatus.choices, [
  'Draft',
  'Submission Received',
  'Documents Incomplete',
  'Ready for GRO',
  'Processing',
  'Completed',
  'Exception'
]);
assert.equal(requestColumns.RequestStatus.defaultValue, 'Submission Received');
assert.deepEqual(requestColumns.DocumentStatus.choices, ['Pending', 'Complete', 'Incomplete']);
assert.equal(requestColumns.GROStatus.indexed, true);

for (const requiredColumn of [
  'RequesterEmail', 'CandidateFullName', 'Nationality', 'CountryOfBirth', 'PersonalEmail', 'ContactNumber',
  'ExpectedJoiningDate', 'SponsoringEntity', 'EntityGroup', 'Service', 'ServiceGroup', 'HireStatus',
  'SpecialHire', 'PathID', 'OnboardingPath', 'Intake1Required', 'Intake1Status', 'ClientApprovalConfirmed'
]) {
  assert.ok(requestColumns[requiredColumn], `${requiredColumn} must exist in the production request tracker`);
}

for (const milestone of [
  'GROSubmittedDate', 'InitialApprovalDate', 'CandidateSignatureDate', 'WorkPermitApprovalDate', 'VisaIssuedDate',
  'StatusChangeDate', 'MedicalCompletedDate', 'EmiratesIdCompletedDate', 'ResidenceCompletedDate',
  'WorkPermitStartDate', 'PensionFund', 'PensionEnrollmentDate', 'JoiningDate', 'CompletionDate'
]) {
  assert.ok(requestColumns[milestone], `${milestone} must exist for operational tracking`);
}

assert.deepEqual(requestColumns.PensionFund.choices, ['ADPF', 'GPSSA', 'Not Applicable']);
assert.equal(requestColumns.ExceptionFlag.indexed, true);
assert.ok(requestColumns.ExceptionReason);
assert.ok(requestColumns.GRONotes);

assert.equal(documentColumns.RequestID.required, true);
assert.equal(documentColumns.RequestID.indexed, true);
assert.equal(documentColumns.DocumentType.required, true);
assert.equal(documentColumns.OriginalFileName.required, true);
assert.deepEqual(documentColumns.UploadStatus.choices, ['Uploaded', 'Superseded', 'Exception']);

assert.ok(model.requestsList.defaultView.includes('RequestID'));
assert.ok(model.requestsList.defaultView.includes('CandidateFullName'));
assert.ok(model.requestsList.defaultView.includes('RequestStatus'));
assert.ok(model.requestsList.defaultView.includes('GROStatus'));
assert.ok(model.documentsLibrary.defaultView.includes('RequestID'));
assert.ok(model.documentsLibrary.defaultView.includes('DocumentType'));

assert.equal(model.compatibility.titleValue, 'RequestID');
assert.equal(model.provisioning.requiresAdmin, false);
assert.equal(model.provisioning.connector, 'SharePoint');
assert.equal(model.provisioning.method, 'Power Automate SharePoint REST');

console.log('Stage 4 SharePoint production data model contract passed');
