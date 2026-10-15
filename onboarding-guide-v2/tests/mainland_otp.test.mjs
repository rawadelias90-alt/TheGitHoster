import test from "node:test";
import assert from "node:assert/strict";
import {resolveCase} from "../services.js";

const cases = [];
for (const entity of ["ad","dubai","alain"]) {
  for (const hireStatus of ["local","overseas"]) {
    cases.push({entity,service:"ev",hireStatus,...(hireStatus==="overseas"?{nationality:"other"}:{})});
  }
  cases.push({entity,service:"wp",residency:"golden"},{entity,service:"wp",residency:"relative"},{entity,service:"nat",category:"emirati"});
  for (const gccStatus of ["existingEid","existingUid","firstEntry"]) cases.push({entity,service:"nat",category:"gcc",gccStatus});
}
cases.push({entity:"ad",service:"ev",hireStatus:"overseas",nationality:"india"},{entity:"dwc",service:"ev",hireStatus:"overseas",nationality:"egypt"});
test("every Mainland MOHRE case has two ordered OTP checkpoints, not duplicate generic OTP",()=>{
 for(const args of cases.filter(x=>x.entity!=="dwc")) {
  const item=resolveCase(args);assert.ok(item,JSON.stringify(args));
  const titles=item.groProcess.map(x=>x.title);
  const first=titles.indexOf("OTP 1 — Contract Typing"),second=titles.indexOf("OTP 2 — Before Contract Submission");
  assert.ok(first>=0 && second>first,JSON.stringify(args)+" "+titles.join(" | "));
  assert.equal(titles.filter(x=>/OTP/.test(x)).length,2,JSON.stringify(args));
  assert.ok(second<titles.findIndex(x=>/Approval|Submit to MOHRE/.test(x)),JSON.stringify(args));
  for(const idx of [first,second]) {
   const detail=item.groProcess[idx].detail;
   assert.match(detail,/GRO.*Mobilisation/i);
   assert.match(detail,/Mobilisation.*candidate/i);
   assert.match(detail,/candidate.*OTP.*GRO/i);
  }
  assert.match(item.candidateActions.join(" "),/OTP/i);
 }
});
test("Dubai South flows retain their original steps and have no OTP additions",()=>{
 for(const args of [
 {entity:"dwc",service:"ev",hireStatus:"local"},
 {entity:"dwc",service:"ev",hireStatus:"overseas",nationality:"other"},
 {entity:"dwc",service:"ev",hireStatus:"overseas",nationality:"egypt"},
 {entity:"dwc",service:"wp",residency:"golden"},
 {entity:"dwc",service:"wp",residency:"relative"},
 {entity:"dwc",service:"nat",category:"emirati"},
 {entity:"dwc",service:"nat",category:"gcc"}
 ]) {
  const item=resolveCase(args);
  assert.ok(item);
  assert.equal(item.groProcess.filter(s=>/OTP/.test(s.title)).length,0,JSON.stringify(args));
 }
});
