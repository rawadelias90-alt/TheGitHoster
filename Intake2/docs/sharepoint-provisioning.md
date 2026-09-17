# Stage 4 — SharePoint Production Provisioning

## Purpose

Provision the Stage 4 production data model without modifying the existing pilot assets.

The one-time package creates:

- `Intake2 Requests` — operational request tracker
- `Intake2 Documents` — production document library

It leaves these pilot assets unchanged:

- `Intake2 Integration Test`
- `Intake2 Test Documents`

## Permission model

The provisioning flow uses the standard SharePoint connector and runs under the SharePoint connection selected during import.

Expected requirement: the connection account has **Manage Lists** permission on the target site. The design does not require Entra ID changes, tenant administration, premium connectors, or a new external service.

## Import and run

1. In Power Automate, open **My flows**.
2. Choose **Import** → **Import Package (Legacy)**.
3. Upload `Intake2_SharePoint_Production_Provisioning.zip`.
4. Import the flow as **Create as new**.
5. For the SharePoint connection, select the same working AECOM SharePoint connection used by the current Intake2 pilot flows.
6. Complete the import.
7. Open **Intake2 SharePoint Production Provisioning**.
8. Select **Run** and run it once.
9. Confirm the run finishes successfully.

The provisioning actions are intentionally re-runnable. Structure/column creation actions continue past “already exists” failures; the final verification chain checks that the expected production list, library and fields exist.

## Expected SharePoint result

After a successful run, the target site contains:

### Intake2 Requests

- unique, indexed `RequestID`
- request/document/GRO statuses
- candidate and case-classification fields
- Intake 1 and Client Approval controls
- operational GRO milestone dates
- joining, pension and completion fields
- exception and GRO notes

### Intake2 Documents

- indexed `RequestID`
- Candidate Full Name
- Document Type
- Service
- Sponsoring Entity
- Required for Submission
- Upload Status
- Original File Name

## Verification

Do not proceed to Stage 5 until the provisioning flow has run successfully in the target SharePoint site. Stage 5 will then update the Submission Flow to create records in `Intake2 Requests` using this production schema.
