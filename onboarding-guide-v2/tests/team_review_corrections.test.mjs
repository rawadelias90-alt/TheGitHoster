import test from "node:test";
import assert from "node:assert/strict";
import { browseCases, resolveCase } from "../services.js";

const allEntities=["ad","dubai","alain","dwc"], mainland=allEntities.filter(x=>x!=="dwc");
const ev=(entity,hireStatus,nationality="other")=>resolveCase({entity,service:"ev",hireStatus,...(hireStatus==="overseas"?{nationality}:{})});
const wp=(entity,residency)=>resolveCase({entity,service:"wp",residency});
const emir=entity=>resolveCase({entity,service:"nat",category:"emirati"});
const gcc=(entity,gccStatus)=>resolveCase({entity,service:"nat",category:"gcc",gccStatus});
const labels=item=>item.groProcess.map(x=>x.title);
const description=item=>[...item.preHireReadiness,...item.candidateActions,...item.groProcess.map(x=>x.title+" "+x.detail)].join(" | ");
const evCases=allEntities.flatMap(e=>[ev(e,"local"),ev(e,"overseas"),
 ...(e==="dwc"?[ev(e,"overseas","egypt")]:e==="ad"||e==="alain"?[ev(e,"overseas","india")]:[])]);
const wpMainland=mainland.flatMap(e=>[wp(e,"golden"),wp(e,"relative"),emir(e),...["existingEid","existingUid","firstEntry"].map(s=>gcc(e,s))]);
const wpAll=allEntities.flatMap(e=>[wp(e,"golden"),wp(e,"relative"),emir(e),...(e==="dwc"?[gcc(e)]:["existingEid","existingUid","firstEntry"].map(s=>gcc(e,s)))]);

test("01 Employment Visa routes never require OTP",()=>{
 for(const item of evCases) {
  assert.ok(item);
  assert.doesNotMatch(description(item),/\bOTP\b/i,item.serviceId+"/"+item.entity);
  assert.ok(!labels(item).some(x=>/OTP/.test(x)));
 }
});

test("02 Mainland Work Permit only: signature between two OTPs, followed by Work Permit submission",()=>{
 const firstSeven=["Contract Preparation","OTP 1 — Contract Typing","Contract Completed",
   "MOHRE Digital Contract Signature","Signed Contract Review","OTP 2 — Before Contract Submission",
   "Submit Work Permit to MOHRE"];
 for(const item of wpMainland){
  assert.ok(item);
  assert.deepEqual(labels(item).slice(0,7),firstSeven,item.serviceId+"/"+item.entity);
  assert.equal(labels(item).filter(x=>/\bOTP [12]\b/.test(x)).length,2);
  assert.ok(labels(item).some(x=>x==="MOHRE Approval"||x==="Work Permit Approval"));
  assert.doesNotMatch(item.groProcess[6].detail,/submit.*employment visa/i);
  for(const i of [1,5]){
   const detail=item.groProcess[i].detail;
   assert.match(detail,/GRO.{0,100}Mobilisation/i);
   assert.match(detail,/Mobilisation.{0,120}candidate/i);
   assert.match(detail,/candidate.{0,150}Mobilisation.{0,120}GRO/i);
   assert.match(detail,/approved secure/i);
  }
  assert.match(item.groProcess[3].detail,/MOHRE.*(link|digital)/i);
  assert.match(item.groProcess[3].detail,/candidate.*sign/i);
  assert.match(item.groProcess[3].detail,/inform.*Mobilisation/i);
  assert.match(item.candidateActions.join(" "),/OTP 1|first OTP/i);
  assert.match(item.candidateActions.join(" "),/OTP 2|second OTP/i);
  assert.match(item.candidateActions.join(" "),/digital.*sign/i);
 }
});

test("03 Local Employment Visa documentation requires cancellation OR visit visa, not current residence visa",()=>{
 for(const entity of allEntities){
  const item=ev(entity,"local");
  const docs=[...item.documents.required,...item.documents.conditional].join(" | ");
  assert.match(docs,/residence.*cancellation.*or.*visit visa/i,entity);
  assert.doesNotMatch(docs,/Current UAE visa \/ residency/i,entity);
 }
 for(const entity of allEntities){
  assert.match(wp(entity,"golden").documents.conditional.join(" | "),/Current UAE visa \/ residency/i);
  assert.match(wp(entity,"relative").documents.conditional.join(" | "),/Sponsor.*residence visa/i);
 }
});

test("04 Work Permit-only education requests attested degree, no details/equivalency or concerned form",()=>{
 for(const item of wpAll){
  const docs=[...item.documents.required,...item.documents.conditional].join(" | ");
  assert.match(docs,/Attested Education Certificate/i,item.serviceId);
  assert.doesNotMatch(docs,/Education Details|Equivalency|Educational Verification|concerned form/i,item.serviceId);
 }
});
test("04 Employment Visa retains conditional evidence and a university-dependent form",()=>{
 for(const item of evCases){
  const docs=item.documents.conditional.join(" | ");
  assert.match(docs,/Education Certificate/i);
  assert.match(docs,/Educational Verification \/ Equivalency/i);
  assert.match(docs,/Education Details document/i);
  assert.match(docs,/university.*form/i);
  assert.match(docs,/where required|where requested|only when required/i);
  assert.doesNotMatch(item.documents.required.join(" | "),/Education Details|concerned form/i);
 }
});

test("05 Official evidence of educational name difference is a conditional note, not a mandatory document",()=>{
 for(const item of browseCases()){
  assert.ok(item.educationNameNote,item.serviceId+"/"+item.entity);
  assert.match(item.educationNameNote,/if.*name.*differ/i);
  for(const doc of ["birth certificate","government-issued ID","previous passport","marriage certificate","court-issued letter"])
    assert.match(item.educationNameNote,new RegExp(doc,"i"));
  assert.match(item.educationNameNote,/same person/i);
  assert.ok(!item.documents.required.some(x=>/name difference|birth certificate|court-issued letter/i.test(x)));
 }
});

test("06 Intake 1 checks only passport/photograph; Special Hire National ID is a separate application document",()=>{
 for(const entity of mainland){
  for(const item of [ev(entity,"local"),ev(entity,"overseas"),wp(entity,"golden"),wp(entity,"relative")]){
   assert.equal(item.intake1.required,true);
   assert.deepEqual(item.intake1.documents,["Passport copy","Candidate photograph"]);
  }
  for(const item of [emir(entity),...["existingEid","existingUid","firstEntry"].map(s=>gcc(entity,s))])
   assert.equal(item.intake1.required,false);
 }
 for(const item of [ev("ad","overseas","india"),ev("alain","overseas","india"),ev("dwc","overseas","egypt")]){
  assert.equal(item.specialHire,true);
  assert.ok(item.documents.required.includes("Home-country National ID"));
  assert.ok(!item.intake1.documents.includes("Home-country National ID"));
  assert.match(item.preHireReadiness.join(" | "),/Home-country National ID.*application.*not.*Intake 1/i);
 }
 for(const entity of allEntities) assert.ok(!ev(entity,"local").documents.required.includes("Home-country National ID"));
 assert.ok(emir("ad").documents.required.includes("National ID"));
 assert.ok(gcc("ad","existingEid").documents.required.includes("GCC-country National ID"));
});

test("DWC GRO process and digital signature order unchanged, no MOHRE OTP",()=>{
 const expected=[
  [ev("dwc","local"),["DWC Portal","DWC / Immigration Approval","Digital Contract Signature","Visa and Status Change"]],
  [ev("dwc","overseas"),["DWC / Immigration Processing","Visa Approval","Digital Contract Signature","Visa Issued"]],
  [wp("dwc","golden"),["DWC Portal","Work Permit Processing","Digital Candidate Signature","Work Permit Approval"]],
  [wp("dwc","relative"),["DWC Portal","Work Permit Processing","Digital Candidate Signature","Work Permit Approval"]],
  [emir("dwc"),["DWC Work Permit Process","Digital Candidate Signature","Work Permit Approval"]],
  [gcc("dwc"),["DWC Work Permit Process","Digital Candidate Signature","DWC Work Permit Approval","Approved Permit Shared"]],
 ];
 for(const [item,stages] of expected){
  assert.deepEqual(labels(item),stages,item.serviceId);
  assert.doesNotMatch(description(item),/\bOTP\b/);
 }
});
test("GCC pension dependencies and effective-date logic remain intact",()=>{
 for(const entity of allEntities){
  assert.match(emir(entity).postJoining,/ADPF|GPSSA/);
  const item=gcc(entity,entity==="dwc"?undefined:"existingUid");
  assert.match(item.postJoining,/valid Emirates ID/i);
  assert.match(item.postJoining,/Work Permit start date/i);
  assert.match(item.postJoining,/Medical.*if requested/i);
  assert.match(item.completionPoint,/pension/i);
 }
});
