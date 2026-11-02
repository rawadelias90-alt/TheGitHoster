import {test} from 'node:test';
import assert from 'node:assert/strict';
import {resolveCase} from '../services.js';
const entities=['ad','alain','dubai','dwc'];
const txt=c=>[...c.documents.required,...c.documents.conditional].join(' | ');
test('final document scope: insurance, family details, equivalency and no extra collection items',()=>{
 for(const entity of entities){
  for(const residency of ['golden','relative']){
   const c=resolveCase({entity,service:'wp',residency});
   assert.equal(txt(c).includes('Medical Insurance Card'),entity==='dwc');
   assert.match(txt(c),/Equivalency Certificate/);
   assert.match(txt(c),/Previous labour-card or work-permit cancellation/);
   assert.doesNotMatch(txt(c),/Police Clearance|Signed AECOM|Educational Verification|university-dependent|Educational Details Form/);
  }
  const national=resolveCase({entity,service:'nat',category:'emirati'});
  assert.match(txt(national),/Family member details/);
  assert.doesNotMatch(txt(national),/Police Clearance|Equivalency Certificate|Signed AECOM/);
  const local=resolveCase({entity,service:'ev',hireStatus:'local'});
  assert.match(txt(local),/Police Clearance/);assert.match(txt(local),/Copies of UAE visas/);
  assert.equal(txt(local).includes('Iraqi, Iranian and Afghan'),['ad','alain'].includes(entity));
 }
});
test('mainland GCC document lists follow EID and UID status, DWC never imports mainland UID',()=>{
 for(const entity of entities){
  for(const gccStatus of ['existingEid','existingUid','firstEntry']){
   const c=resolveCase({entity,service:'nat',category:'gcc',gccStatus});
   assert.equal(txt(c).includes('UID and linked'),entity!=='dwc'&&gccStatus!=='existingEid');
   assert.equal(txt(c).includes('Valid Emirates ID'),entity==='dwc'||gccStatus==='existingEid');
  }
 }
});
