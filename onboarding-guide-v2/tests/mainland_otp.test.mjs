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
test("every Mainland Work Permit-only case has digital signature between two OTP steps",()=>{
 for(const args of cases.filter(x=>x.entity!=="dwc" && x.service!=="ev")) {
  const item=resolveCase(args);assert.ok(item,JSON.stringify(args));
  const titles=item.groProcess.map(x=>x.title);
  const first=titles.indexOf("OTP 1 — Contract Typing"),signature=titles.indexOf("MOHRE Digital Contract Signature");
  const second=titles.indexOf("OTP 2 — Before Contract Submission"),submit=titles.indexOf("Submit Work Permit to MOHRE");
  assert.ok(first>=0 && first<signature && signature<second && second<submit,JSON.stringify(args));
  assert.equal(titles.filter(x=>/OTP/.test(x)).length,2,JSON.stringify(args));
  for(const index of [first,second]){
   assert.match(item.groProcess[index].detail,/GRO.*Mobilisation/i);
   assert.match(item.groProcess[index].detail,/candidate.*Mobilisation.*GRO/i);
  }
  assert.match(item.candidateActions.join(" "),/OTP 1/i);
  assert.match(item.candidateActions.join(" "),/OTP 2/i);
 }
});
test("Mainland Employment Visa routes have no contract OTP requirement",()=>{
 for(const args of cases.filter(x=>x.entity!=="dwc" && x.service==="ev")){
   const item=resolveCase(args);
   assert.ok(item);
   assert.ok(!item.groProcess.some(x=>/OTP/.test(x.title)));
   assert.doesNotMatch(item.candidateActions.join(" "),/OTP/);
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
