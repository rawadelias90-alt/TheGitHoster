import test from "node:test";
import assert from "node:assert/strict";
import { resolveCase, getQuestionSequence, SERVICES } from "../services.js";

const supportedCases = [
  [{entity:"ad",service:"ev",hireStatus:"local"}, "ev-mainland-local"],
  [{entity:"dubai",service:"ev",hireStatus:"local"}, "ev-mainland-local"],
  [{entity:"alain",service:"ev",hireStatus:"local"}, "ev-mainland-local"],
  [{entity:"ad",service:"ev",hireStatus:"overseas",nationality:"india"}, "ev-mainland-overseas-special"],
  [{entity:"dubai",service:"ev",hireStatus:"overseas",nationality:"india"}, "ev-mainland-overseas"],
  [{entity:"dwc",service:"ev",hireStatus:"local"}, "ev-dwc-local"],
  [{entity:"dwc",service:"ev",hireStatus:"overseas",nationality:"egypt"}, "ev-dwc-overseas-special"],
  [{entity:"dwc",service:"ev",hireStatus:"overseas",nationality:"india"}, "ev-dwc-overseas"],
  [{entity:"ad",service:"wp",residency:"golden"}, "wp-mainland-golden"],
  [{entity:"dubai",service:"wp",residency:"relative"}, "wp-mainland-relative"],
  [{entity:"dwc",service:"wp",residency:"golden"}, "wp-dwc-golden"],
  [{entity:"dwc",service:"wp",residency:"relative"}, "wp-dwc-relative"],
  [{entity:"ad",service:"nat",category:"emirati"}, "nat-mainland-emirati"],
  [{entity:"dubai",service:"nat",category:"gcc"}, "nat-mainland-gcc"],
  [{entity:"dwc",service:"nat",category:"emirati"}, "nat-dwc-emirati"],
  [{entity:"dwc",service:"nat",category:"gcc"}, "nat-dwc-gcc"],
];

test("every supported case resolves deterministically", () => {
  for (const [input, expected] of supportedCases) {
    assert.equal(resolveCase(input)?.serviceId, expected, JSON.stringify(input));
  }
});

test("question sequence stays short and branch-specific", () => {
  assert.deepEqual(getQuestionSequence({}), ["entity"]);
  assert.deepEqual(getQuestionSequence({entity:"ad"}), ["entity","service"]);
  assert.deepEqual(getQuestionSequence({entity:"ad",service:"ev"}), ["entity","service","hireStatus"]);
  assert.deepEqual(getQuestionSequence({entity:"ad",service:"ev",hireStatus:"overseas"}), ["entity","service","hireStatus","nationality"]);
  assert.deepEqual(getQuestionSequence({entity:"ad",service:"wp"}), ["entity","service","residency"]);
  assert.deepEqual(getQuestionSequence({entity:"ad",service:"nat"}), ["entity","service","category"]);
});

test("all service families expose the complete operating result model", () => {
  assert.equal(SERVICES.length, 14);
  for (const item of SERVICES) {
    assert.ok(item.authority, item.serviceId);
    assert.ok(Array.isArray(item.preHireReadiness) && item.preHireReadiness.length >= 6, item.serviceId);
    assert.ok(item.intake1 && typeof item.intake1.required === "boolean", item.serviceId);
    assert.ok(Array.isArray(item.groProcess) && item.groProcess.length >= 3, item.serviceId);
    assert.ok(item.groProcess.every(step => step.owner && step.title), item.serviceId);
    assert.ok(Array.isArray(item.journey) && item.journey.includes("GRO Processing"), item.serviceId);
    assert.ok(item.completionPoint, item.serviceId);
  }
});

test("Intake 1 is limited to passport and photograph quality verification", () => {
  const mainlandEv = resolveCase({entity:"ad",service:"ev",hireStatus:"local"});
  assert.equal(mainlandEv.intake1.required, true);
  assert.deepEqual(mainlandEv.intake1.documents, ["Passport copy", "Candidate photograph"]);
  assert.match(mainlandEv.intake1.detail, /not the formal Work Permit application/i);
  assert.match(mainlandEv.intake1.detail, /No education verification/i);
  assert.equal(resolveCase({entity:"dwc",service:"ev",hireStatus:"local"}).intake1.required, false);
  assert.equal(resolveCase({entity:"dubai",service:"nat",category:"emirati"}).intake1.required, false);
});

test("education document logic stays separate from Intake 1", () => {
  const item = resolveCase({entity:"ad",service:"ev",hireStatus:"overseas",nationality:"other"});
  const conditional = item.documents.conditional.join(" | ");
  assert.match(conditional, /Education Certificate/);
  assert.match(conditional, /Educational Verification \/ Equivalency/);
  assert.match(conditional, /Award or Education Details/);
  assert.ok(!item.intake1.documents.some(x => /education/i.test(x)));
});

test("External Cover Passport is Dubai-only where applicable", () => {
  const ad = resolveCase({entity:"ad",service:"ev",hireStatus:"local"});
  const alain = resolveCase({entity:"alain",service:"ev",hireStatus:"local"});
  const dubai = resolveCase({entity:"dubai",service:"ev",hireStatus:"local"});
  const dwc = resolveCase({entity:"dwc",service:"ev",hireStatus:"local"});
  assert.ok(!ad.documents.conditional.some(x => /External Cover Passport/.test(x)));
  assert.ok(!alain.documents.conditional.some(x => /External Cover Passport/.test(x)));
  assert.ok(dubai.documents.conditional.some(x => /External Cover Passport/.test(x)));
  assert.ok(dwc.documents.conditional.some(x => /External Cover Passport/.test(x)));
});

test("Special Hire documents and later actions are separated correctly", () => {
  const special = resolveCase({entity:"ad",service:"ev",hireStatus:"overseas",nationality:"india"});
  assert.equal(special.specialHire, true);
  assert.equal(special.outcome, "Special Hire Entry Visa");
  assert.ok(special.documents.required.includes("Home-country National ID"));
  assert.ok(!special.documents.required.some(x => /Medical|Embassy/i.test(x)));
  assert.ok(!special.documents.conditional.some(x => /Medical|Embassy/i.test(x)));
  assert.ok(special.groProcess.some(step => /Home-Country Medical/.test(step.title)));
  assert.ok(special.groProcess.some(step => /UAE Embassy Process/.test(step.title)));
});

test("national routes require National ID and Emirati-only Family Book", () => {
  const emir = resolveCase({entity:"ad",service:"nat",category:"emirati"});
  const gcc = resolveCase({entity:"ad",service:"nat",category:"gcc"});
  assert.ok(emir.documents.required.includes("National ID"));
  assert.ok(emir.documents.required.includes("Family Book"));
  assert.ok(gcc.documents.required.includes("National ID"));
  assert.ok(!gcc.documents.required.includes("Family Book"));
  assert.ok(!emir.documents.required.some(x => /Medical/i.test(x)));
});

test("route-specific GRO sequences preserve authority and signature timing", () => {
  const mainlandLocal = resolveCase({entity:"ad",service:"ev",hireStatus:"local"});
  assert.equal(mainlandLocal.authority, "MOHRE");
  assert.deepEqual(mainlandLocal.groProcess.map(s => s.title), [
    "Submit to MOHRE", "Employee Signature", "GRO Payment", "Visa Approval", "Visa Issued", "Status Change",
  ]);
  const dwcOverseas = resolveCase({entity:"dwc",service:"ev",hireStatus:"overseas",nationality:"other"});
  assert.equal(dwcOverseas.authority, "DWC / Immigration");
  const titles = dwcOverseas.groProcess.map(s => s.title);
  assert.ok(titles.indexOf("Visa Approval") < titles.indexOf("Digital Contract Signature"));
  assert.equal(titles.at(-1), "Visa Issued");
});

test("Work Permit and National routes also expose GRO processing", () => {
  const mainlandWp = resolveCase({entity:"ad",service:"wp",residency:"golden"});
  assert.deepEqual(mainlandWp.groProcess.map(s => s.title), ["MOHRE Work Permit Process", "Employee Signature", "Work Permit Approval"]);
  const dwcWp = resolveCase({entity:"dwc",service:"wp",residency:"relative"});
  assert.deepEqual(dwcWp.groProcess.map(s => s.title), ["DWC Portal", "Work Permit Processing", "Digital Candidate Signature", "Work Permit Approval"]);
  const national = resolveCase({entity:"dubai",service:"nat",category:"gcc"});
  assert.equal(national.authority, "MOHRE");
  assert.ok(national.groProcess.some(step => step.title === "Candidate Signature"));
  assert.ok(national.journey.includes("Medical"));
  assert.ok(national.journey.includes("Pension Enrollment"));
});

test("pension fund and completion points follow the updated source", () => {
  assert.match(resolveCase({entity:"ad",service:"nat",category:"emirati"}).postJoining, /ADPF/);
  assert.match(resolveCase({entity:"alain",service:"nat",category:"gcc"}).postJoining, /ADPF/);
  assert.match(resolveCase({entity:"dubai",service:"nat",category:"gcc"}).postJoining, /GPSSA/);
  assert.match(resolveCase({entity:"dwc",service:"nat",category:"emirati"}).postJoining, /GPSSA/);
  assert.match(resolveCase({entity:"ad",service:"ev",hireStatus:"local"}).completionPoint, /visa, residence, joining and post-joining/i);
  assert.match(resolveCase({entity:"ad",service:"wp",residency:"golden"}).completionPoint, /Work Permit approved and employee joins/i);
  assert.match(resolveCase({entity:"ad",service:"nat",category:"emirati"}).completionPoint, /Work Permit, Medical and pension/i);
});

test("incomplete and unsupported combinations do not resolve", () => {
  assert.equal(resolveCase({entity:"ad",service:"ev"}), null);
  assert.equal(resolveCase({entity:"ad",service:"wp",residency:"other"}), null);
  assert.equal(resolveCase({entity:"ad",service:"other"}), null);
});
