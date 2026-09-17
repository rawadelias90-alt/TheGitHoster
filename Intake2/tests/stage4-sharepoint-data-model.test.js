const assert = require('node:assert/strict');
const model = require('../sharepoint-data-model.js');
const provisioning = require('../sharepoint-provisioning.js');

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

const siteUrl = 'https://tenant.sharepoint.com/sites/example';
const steps = provisioning.buildRestSteps(siteUrl);
assert.equal(steps[0].label, 'create Intake2 Requests');
assert.equal(steps[0].method, 'POST');
assert.equal(steps[0].uri, '_api/web/lists');
assert.equal(steps[1].label, 'create Intake2 Documents');
assert.equal(steps.filter((step) => step.kind === 'request-column').length, model.requestsList.columns.length);
assert.equal(steps.filter((step) => step.kind === 'document-column').length, model.documentsLibrary.columns.length);
assert.ok(steps.some((step) => step.kind === 'verify' && step.uri.includes("getbyinternalnameortitle('RequestID')")));
assert.ok(steps.some((step) => step.kind === 'verify' && step.uri.includes("getbytitle('Intake2 Documents')")));

const definition = provisioning.buildFlowDefinition(siteUrl);
assert.equal(definition.triggers.manual.kind, 'Button');
assert.ok(Object.keys(definition.actions).length > model.requestsList.columns.length + model.documentsLibrary.columns.length);
for (const action of Object.values(definition.actions)) {
  assert.equal(action.type, 'OpenApiConnection');
  assert.equal(action.inputs.host.operationId, 'HttpRequest');
  assert.equal(action.inputs.parameters.dataset, siteUrl);
}

const serialized = JSON.stringify(definition);
assert.doesNotMatch(serialized, /aecom\.sharepoint\.com/i, 'public provisioning source must not embed the corporate site URL');

console.log('Stage 4 SharePoint production data model and provisioning contract passed');
