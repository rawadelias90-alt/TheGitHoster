# Intake2 SharePoint Production Data Model

**Stage:** 4  
**Status:** Production model baseline  
**Business source:** AECOM UAE Employee Onboarding Journey, 17 September 2026  
**Runtime rules:** `production-rules.js`

## Production structures

Stage 4 uses new production structures rather than renaming or expanding the existing test assets:

- **Request tracker:** `Intake2 Requests`
- **Document library:** `Intake2 Documents`

The existing `Intake2 Integration Test` list and `Intake2 Test Documents` library remain untouched. This keeps synthetic pilot data separate from operational cases and provides a clean rollback path.

The production model is designed to work with normal SharePoint list-management permissions. It does not require Entra ID changes, premium connectors, tenant administration, or a new external service. The one-time provisioning package uses the standard SharePoint connector through Power Automate and therefore runs with the permissions of the selected SharePoint connection.

## Primary key and compatibility

`RequestID` is the operational key for every Intake2 case.

- Format: `REQ-########`
- Type: Single line of text
- Required: Yes
- Indexed: Yes
- Enforce unique values: Yes
- The built-in SharePoint `Title` field is retained for compatibility and Stage 5 will write the same Request ID to it.

Documents remain in a separate library and use the same Request ID as metadata and in the file name:

`REQ-########__<original filename>`

This supports a one-to-many relationship: one request record can have multiple documents without needing folders.

## Request lifecycle controls

### Request Status

- Draft
- Submission Received
- Documents Incomplete
- Ready for GRO
- Processing
- Completed
- Exception

Default on item creation: **Submission Received**.

### Document Status

- Pending
- Complete
- Incomplete

Default on item creation: **Pending**.

### GRO Status

- Not Started
- Submitted to Authority
- Candidate Action Required
- Initial Approval
- Payment / Processing
- Approved
- Visa Issued
- Status Change
- Post-Joining
- Pension
- Completed
- Exception

Default on item creation: **Not Started**.

These statuses provide a common tracker across Mainland, Dubai South (DWC), Employment Visa, Work Permit, Emirati and GCC cases without forcing every route to use the same detailed milestones.

## Request tracker columns

### Request and control

| Display name | Internal name | Type | Required | Indexed |
|---|---|---:|---:|---:|
| Request ID | RequestID | Text | Yes | Yes / Unique |
| Requester Email | RequesterEmail | Text | Yes | Yes |
| Submitted At | SubmittedAt | Date/Time | Yes | Yes |
| Request Status | RequestStatus | Choice | Yes | Yes |
| Document Status | DocumentStatus | Choice | Yes | Yes |

### Candidate

| Display name | Internal name | Type | Required |
|---|---|---:|---:|
| Candidate Full Name | CandidateFullName | Text | Yes |
| Nationality | Nationality | Text | Yes |
| Country of Birth | CountryOfBirth | Text | Yes |
| Personal Email | PersonalEmail | Text | Yes |
| Contact Number | ContactNumber | Text | Yes |
| Expected Joining Date | ExpectedJoiningDate | Date | Yes |

### Case classification

| Display name | Internal name | Type | Required |
|---|---|---:|---:|
| Sponsoring Entity | SponsoringEntity | Choice | Yes |
| Entity Group | EntityGroup | Choice | Yes |
| Service | Service | Choice | Yes |
| Service Group | ServiceGroup | Choice | Yes |
| Hire Status | HireStatus | Choice | Yes |
| Skilled Status | SkilledStatus | Choice | Conditional |
| Special Hire | SpecialHire | Yes/No | Yes |
| Path ID | PathID | Text | Yes |
| Onboarding Path | OnboardingPath | Text | Yes |
| Intake 1 Required | Intake1Required | Yes/No | Yes |
| Intake 1 Status | Intake1Status | Choice | Yes |
| Client Approval Confirmed | ClientApprovalConfirmed | Yes/No | Yes |
| Client Approval Date | ClientApprovalDate | Date | No |
| Current UAE Visa / Residency | CurrentUaeVisaResidency | Text | No |
| Unified Number | UnifiedNumber | Text | No |
| Last Working Date | LastWorkingDate | Date | No |
| Education Requirement | EducationRequirement | Choice | Conditional |

The Intake 1 and Client Approval controls reflect the Project Source: Intake 1 is path-specific and Client Approval is required before Intake 2.

## Operational GRO milestones

The list carries milestone dates that apply selectively according to the chosen service path. Unused milestone columns remain blank.

| Display name | Internal name |
|---|---|
| GRO Status | GROStatus |
| GRO Submitted Date | GROSubmittedDate |
| Initial Approval Date | InitialApprovalDate |
| Candidate Signature Date | CandidateSignatureDate |
| Work Permit Approval Date | WorkPermitApprovalDate |
| Visa Issued Date | VisaIssuedDate |
| Status Change Date | StatusChangeDate |
| Medical Completed Date | MedicalCompletedDate |
| Emirates ID Completed Date | EmiratesIdCompletedDate |
| Residence Completed Date | ResidenceCompletedDate |
| Work Permit Start Date | WorkPermitStartDate |
| Pension Fund | PensionFund |
| Pension Enrollment Date | PensionEnrollmentDate |
| Joining Date | JoiningDate |
| Completion Date | CompletionDate |

`PensionFund` choices are `ADPF`, `GPSSA`, and `Not Applicable`. The Work Permit start date is stored separately from Joining Date because the Project Source states that pension uses the applicable Work Permit start date, not the employee joining date.

## Exception handling

- `ExceptionFlag` — Yes/No, indexed
- `ExceptionReason` — Multiple lines of text
- `GRONotes` — Multiple lines of text

This keeps exception cases visible without changing the normal status model.

## Document library metadata

| Display name | Internal name | Type | Required |
|---|---|---:|---:|
| Request ID | RequestID | Text / Indexed | Yes |
| Candidate Full Name | CandidateFullName | Text | Yes |
| Document Type | DocumentType | Text / Indexed | Yes |
| Service | Service | Text | Yes |
| Sponsoring Entity | SponsoringEntity | Text | Yes |
| Required for Submission | RequiredForSubmission | Yes/No | Yes |
| Upload Status | UploadStatus | Choice / Indexed | Yes |
| Original File Name | OriginalFileName | Text | Yes |

`UploadStatus` choices are `Uploaded`, `Superseded`, and `Exception`.

Document Type is intentionally stored as text rather than a fixed SharePoint Choice column. The Intake2 production rules already determine the permitted document types, and using text avoids a SharePoint schema change whenever a future business rule introduces or renames one document slot.

## Default tracker view

The production default view is deliberately compact:

- Request ID
- Submitted At
- Request Status
- Document Status
- Candidate Full Name
- Expected Joining Date
- Sponsoring Entity
- Service
- Hire Status
- Special Hire
- GRO Status
- Joining Date

Recommended operational views defined in the data model are:

- Active Cases
- Ready for GRO
- Documents Incomplete
- Exceptions
- Completed

The provisioning step creates the production structures and columns. View customization can remain a normal SharePoint user-level task and does not block the submission architecture.

## Permission and deployment rule

The production structures should be provisioned through the supplied one-time Power Automate package using the existing SharePoint connection. The connection account must have **Manage Lists** permission on the target site. No tenant administrator or Entra configuration is required for the model itself.

If list creation is disabled by site policy, the fallback is to provision the same columns into a list created manually by the user; the data model and Stage 5 payload do not change.
