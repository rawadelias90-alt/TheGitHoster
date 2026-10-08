import test from "node:test";
import assert from "node:assert/strict";
import { resolveCase, getQuestionSequence, browseCases, SERVICES } from "../services.js";

const gcc = (entity, gccStatus) => resolveCase({ entity, service: "nat", category: "gcc", gccStatus });
const emir = entity => resolveCase({ entity, service: "nat", category: "emirati" });
const joined = arr => arr.join(" | ");

test("GCC question appears only for mainland GCC, never Emirati or DWC", () => {
  assert.deepEqual(getQuestionSequence({entity:"ad",service:"nat",category:"gcc"}), ["entity","service","category","gccStatus"]);
  assert.deepEqual(getQuestionSequence({entity:"dubai",service:"nat",category:"gcc"}), ["entity","service","category","gccStatus"]);
  assert.deepEqual(getQuestionSequence({entity:"alain",service:"nat",category:"gcc"}), ["entity","service","category","gccStatus"]);
  assert.deepEqual(getQuestionSequence({entity:"dwc",service:"nat",category:"gcc"}), ["entity","service","category"]);
  assert.deepEqual(getQuestionSequence({entity:"ad",service:"nat",category:"emirati"}), ["entity","service","category"]);
});

test("Mainland GCC route is incomplete without one of three confirmed statuses", () => {
  for(const entity of ["ad","dubai","alain"]) {
    assert.equal(gcc(entity), null);
    assert.equal(gcc(entity,"bogus"), null);
    for(const status of ["existingEid","existingUid","firstEntry"]) {
      const item = gcc(entity,status);
      assert.ok(item, entity+":"+status);
      assert.equal(item.serviceId, "nat-mainland-gcc-"+status);
      assert.equal(item.gccStatus, status);
      assert.equal(item.category, "gcc");
      assert.equal(item.intake1.required, false);
      assert.equal(item.authority, "MOHRE");
      assert.ok(item.documents.required.includes("GCC-country National ID"));
      assert.ok(!item.documents.required.some(x => /Family Book/i.test(x)));
      assert.match(item.beforeIntake2, /Client Approval/i);
    }
  }
});

test("GCC local existing EID has candidate-owned renewal, joins after approval, and no new ID step", () => {
  const item = gcc("ad","existingEid");
  assert.ok(item.journey.includes("MOHRE Approval"));
  assert.ok(!item.journey.includes("Emirates ID"));
  assert.match(joined(item.candidateActions), /candidate.*renew/i);
  assert.match(item.joining, /(?:after|once).*approv/i);
  assert.doesNotMatch(item.joining, /medical.*before.*join/i);
  assert.match(item.postJoining, /valid Emirates ID/i);
  assert.match(item.postJoining, /GRO.*pension/i);
  assert.match(item.postJoining, /Medical.*if requested/i);
});

test("Mainland GCC previous UAE entry requires UID, accessible OTP mobile and post-approval ID", () => {
  const item = gcc("dubai","existingUid");
  const combined=joined([...item.preHireReadiness,...item.candidateActions,...item.groProcess.map(x=>x.title+" "+x.detail)]);
  assert.match(combined,/existing UID/i);
  assert.match(combined,/OTP/i);
  assert.match(combined,/active.*mobile/i);
  assert.ok(item.groProcess.some(x=>/OTP Verification/i.test(x.title)));
  assert.ok(item.journey.includes("Emirates ID"));
  assert.match(item.emiratesIdAction, /candidate.*Emirates ID/i);
  assert.ok(item.journey.indexOf("Emirates ID") < item.journey.indexOf("Pension Registration"));
});

test("Mainland GCC first UAE entry assigns UID automatically; entry precedes GRO", () => {
  const item = gcc("alain","firstEntry");
  assert.match(joined(item.preHireReadiness),/travel.*UAE/i);
  assert.match(joined(item.candidateActions),/UID.*automatically.*entry/i);
  assert.match(joined(item.candidateActions),/linked.*mobile.*OTP/i);
  assert.match(item.beforeIntake2,/travel.*UAE/i);
  assert.ok(item.journey.includes("Emirates ID"));
  assert.match(item.emiratesIdAction,/candidate.*Emirates ID/i);
  assert.ok(item.groProcess.some(x=>/MOHRE/.test(x.title)));
});

test("Dubai South GCC skips MOHRE and mainland UID questions, owns digital signature", () => {
  const item = gcc("dwc");
  assert.ok(item);
  assert.equal(item.serviceId,"nat-dwc-gcc");
  assert.equal(item.authority,"DWC");
  assert.equal(item.intake1.required,false);
  assert.ok(item.groProcess.some(x=>x.title==="Digital Candidate Signature"));
  assert.ok(item.groProcess.some(x=>/DWC.*Approval/.test(x.title)));
  assert.doesNotMatch(joined([...item.preHireReadiness,...item.candidateActions,...item.groProcess.map(x=>x.title+" "+x.detail)]),/MOHRE|OTP|UID/);
  assert.match(item.emiratesIdAction, /valid.*no action/i);
  assert.match(item.emiratesIdAction, /candidate.*renew/i);
  assert.match(item.postJoining, /Emirates ID.*GRO.*pension/i);
});

test("GCC pension registration requires valid Emirates ID and retains effective Work Permit date", () => {
  for (const [entity,fund] of [["ad","ADPF"],["alain","ADPF"],["dubai","GPSSA"],["dwc","GPSSA"]]) {
    const item=gcc(entity,entity==="dwc" ? undefined : "existingUid");
    assert.match(item.postJoining,new RegExp(fund));
    assert.match(item.postJoining,/valid Emirates ID/i);
    assert.match(item.postJoining,/Work Permit start date/i);
    assert.match(item.postJoining,/Medical.*if requested/i);
    assert.ok(item.journey.includes("Pension Registration"));
    assert.ok(!item.journey.includes("Medical"));
    assert.match(item.completionPoint,/pension/i);
  }
});

test("Emirati route stays unchanged in mainland and DWC", () => {
  for (const entity of ["ad","dubai","alain","dwc"]) {
    const item=emir(entity);
    assert.ok(item);
    assert.equal(item.serviceId,"nat-"+(entity==="dwc"?"dwc":"mainland")+"-emirati");
    assert.equal(item.gccStatus,undefined);
    assert.ok(item.documents.required.includes("Family Book"));
    assert.ok(item.documents.required.includes("National ID"));
    assert.ok(item.journey.includes("Medical"));
    assert.ok(item.journey.includes("Pension Enrollment"));
    assert.doesNotMatch(joined(item.candidateActions),/UID|OTP/);
    assert.match(item.joining,/Medical.*joining/i);
    assert.equal(item.intake1.required,false);
  }
});

test("Browse exposes three mainland GCC variants per entity but one DWC route", () => {
  assert.equal(SERVICES.length,16);
  for(const entity of ["ad","dubai","alain"]) {
    const cases=browseCases(entity,"nat").filter(x=>x.category==="gcc");
    assert.equal(cases.length,3);
    assert.deepEqual(cases.map(x=>x.gccStatus),["existingEid","existingUid","firstEntry"]);
    assert.ok(cases.every(x=>x.entity===entity));
  }
  const dwc=browseCases("dwc","nat").filter(x=>x.category==="gcc");
  assert.equal(dwc.length,1);
  assert.equal(dwc[0].gccStatus,undefined);
});
