const services=[['Emirates ID',385.41],['Medical',322.50],['Visa Stamping',509.90],['Cancellation',188.90],['Change Status',638.90],['Entry Permit Inside',1088.90],['Entry Permit Outside',438.90],['Visa Update',209.90]];
const rows=document.getElementById('pricingRows');
services.forEach(([name,current],i)=>{rows.insertAdjacentHTML('beforeend',`<tr><td data-label="Service">${name}</td><td data-label="Current Price" class="price-current">AED ${current.toFixed(2)}</td><td data-label="Your Price"><div class="money-input"><span>AED</span><input class="offer" data-current="${current}" data-index="${i}" type="number" min="0" step="0.01" placeholder="0.00"></div></td><td data-label="Difference" class="diff" id="diff-${i}">—</td></tr>`)});

const FORM_ENDPOINT='';
const statusArea=document.getElementById('statusArea');
const submitBtn=document.getElementById('submitBtn');
const toast=document.getElementById('toast');

function setStatus(message,type=''){
  statusArea.textContent=message;
  statusArea.className='status-area'+(type?` ${type}`:'');
}

function calc(){
  let currentTotal=0,offerTotal=0,filled=0;
  document.querySelectorAll('.offer').forEach((el,i)=>{
    const c=+el.dataset.current;
    const v=parseFloat(el.value);
    const d=document.getElementById(`diff-${i}`);
    if(Number.isFinite(v)){
      filled++;currentTotal+=c;offerTotal+=v;
      const delta=c-v;
      d.textContent=(delta>=0?'- ':'+ ')+'AED '+Math.abs(delta).toFixed(2);
      d.className='diff '+(delta>0?'good':delta<0?'bad':'');
    }else{
      d.textContent='—';d.className='diff';
    }
  });
  const saving=currentTotal-offerTotal;
  document.getElementById('savingValue').textContent='AED '+(filled?saving:0).toFixed(2);
  document.getElementById('savingPercent').textContent=(filled&&currentTotal?(saving/currentTotal*100):0).toFixed(1)+'%';
  document.getElementById('annualSaving').textContent='AED '+(filled?saving*12/5:0).toFixed(2);
}

document.addEventListener('input',e=>{if(e.target.classList.contains('offer'))calc()});

function getFormControls(){
  return [...document.querySelectorAll('input,textarea')];
}

function buildDraft(){
  return getFormControls().map(el=>({type:el.type,value:el.type==='checkbox'?el.checked:el.value}));
}

function restoreDraft(draft){
  getFormControls().forEach((el,i)=>{
    const item=draft?.[i];
    if(!item)return;
    if(el.type==='checkbox')el.checked=Boolean(item.value);
    else el.value=item.value??'';
  });
  calc();
}

function buildSubmission(){
  const providerFields=[...document.querySelectorAll('#provider-details .field')].map(field=>({
    label:field.querySelector('label')?.textContent.trim()||'',
    value:field.querySelector('input,textarea')?.value||''
  }));
  return {
    proposalReference:'ADM-001',
    language:document.documentElement.lang||'en',
    pricing:services.map(([service,current],i)=>({
      service,
      currentPrice:current,
      proposedPrice:document.querySelector(`.offer[data-index="${i}"]`)?.value||''
    })),
    startingWorkload:{
      startingVolume:document.getElementById('startingVolume').value,
      preferredStartDate:document.getElementById('startDate').value,
      servicesToStartWith:document.getElementById('services').value,
      reviewPeriod:document.getElementById('reviewPeriod').value
    },
    additionalNotes:document.getElementById('notes').value,
    providerDetails:providerFields,
    declaration:document.querySelector('#declaration input[type="checkbox"]').checked,
    submittedAt:new Date().toISOString()
  };
}

document.getElementById('printBtn').addEventListener('click',()=>window.print());

document.getElementById('saveBtn').addEventListener('click',()=>{
  localStorage.setItem('proposalDraft',JSON.stringify(buildDraft()));
  setStatus('Draft saved on this device.','success');
  toast.textContent='Draft saved';
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1400);
});

submitBtn.addEventListener('click',async()=>{
  if(!FORM_ENDPOINT){
    setStatus('Submit endpoint is not configured yet. Add the external form service endpoint in script.js.','error');
    return;
  }
  submitBtn.disabled=true;
  setStatus('Submitting…');
  try{
    const response=await fetch(FORM_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(buildSubmission())
    });
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    setStatus('Proposal submitted successfully.','success');
  }catch(error){
    setStatus('Submission failed. Please check the endpoint and try again.','error');
    console.error('Submission error:',error);
  }finally{
    submitBtn.disabled=false;
  }
});

const saved=JSON.parse(localStorage.getItem('proposalDraft')||'null');
if(saved){
  restoreDraft(saved);
  setStatus('Saved draft restored.','success');
}

const arText={
  'Administrative Services Commercial Pack':'الحزمة التجارية للخدمات الإدارية',
  'April–August 2026 · Pricing and implementation proposal':'أبريل–أغسطس 2026 · عرض الأسعار وخطة التنفيذ',
  'Proposal Ref.':'مرجع العرض','Issued':'تاريخ الإصدار','Prepared by':'إعداد',
  'Government Relations – UAE':'العلاقات الحكومية – الإمارات','12 Sep 2026':'12 سبتمبر 2026',
  'Section 1':'القسم 1','Section 2':'القسم 2','Section 3':'القسم 3','Section 4':'القسم 4','Section 5':'القسم 5','Section 6':'القسم 6','Section 7':'القسم 7','Section 8':'القسم 8','Section 9':'القسم 9',
  'Business Snapshot':'لمحة عن الأعمال','A quick view of current commercial scale before the provider enters pricing.':'نظرة سريعة على الحجم التجاري الحالي قبل إدخال مزود الخدمة لأسعاره.',
  'Total Spend':'إجمالي الإنفاق','Average Monthly Spend':'متوسط الإنفاق الشهري','Total Transactions':'إجمالي المعاملات','Highest Month':'أعلى شهر','Second Highest Month':'ثاني أعلى شهر','5-month period':'فترة 5 أشهر','Average across Apr–Aug':'متوسط الفترة من أبريل إلى أغسطس','April–August 2026':'أبريل–أغسطس 2026','June':'يونيو','July':'يوليو',
  'Monthly Spend':'الإنفاق الشهري','Monthly spend is shown as one simple comparison.':'عرض بسيط لمقارنة الإنفاق الشهري.','Monthly spend · AED':'الإنفاق الشهري · AED','Total: AED 296,324.23':'الإجمالي: 296,324.23 درهم','Apr':'أبريل','May':'مايو','Jun':'يونيو','Jul':'يوليو','Aug':'أغسطس',
  'Service Volume':'حجم الخدمات','Transactions by service':'المعاملات حسب الخدمة','Emirates ID':'الهوية الإماراتية','Medical':'الفحص الطبي','Visa Stamping':'تثبيت الإقامة','File Open':'فتح ملف','Contract Submission':'تقديم العقد','Entry Permit – Outside':'إذن دخول – خارج الدولة','Entry Permit – Inside':'إذن دخول – داخل الدولة','Cancellation':'الإلغاء','Change Status':'تعديل الوضع','Golden Visa':'الإقامة الذهبية','Entry Permit Inside':'إذن دخول من داخل الدولة','Entry Permit Outside':'إذن دخول من خارج الدولة','Visa Update':'تحديث بيانات الإقامة',
  'Your Commercial Proposal':'عرضك التجاري','Enter proposed unit prices. Savings update immediately.':'أدخل أسعار الوحدة المقترحة وسيتم تحديث الوفر مباشرة.','Service':'الخدمة','Current Price':'السعر الحالي','Your Price':'سعرك','Difference':'الفرق','Estimated Saving':'الوفورات التقديرية','Savings %':'نسبة الوفر','Projected Annual Saving':'الوفورات السنوية المتوقعة',
  'Starting Workload':'حجم العمل المبدئي','Keep implementation inputs short and practical.':'اجعل بيانات بدء التنفيذ مختصرة وعملية.','Starting Volume':'حجم العمل المبدئي','Preferred Start Date':'تاريخ البدء المفضل','Services To Start With':'الخدمات المقترح البدء بها','Review Period':'فترة المراجعة','Approximate starting workload.':'حجم العمل المبدئي التقريبي.',
  'Assumptions & Notes':'الافتراضات والملاحظات','One open area for conditions, exclusions, and anything that affects the offer.':'مساحة واحدة للشروط والاستثناءات وأي تفاصيل تؤثر على العرض.','Additional Notes':'ملاحظات إضافية',
  'Provider Details':'بيانات مزود الخدمة','Company Name':'اسم الشركة','Contact Person':'الشخص المسؤول','Position':'المسمى الوظيفي','Email':'البريد الإلكتروني','Phone':'الهاتف','Date Submitted':'تاريخ التقديم',
  'Declaration':'الإقرار','We confirm that the above prices are valid and accurate.':'نؤكد أن الأسعار المذكورة أعلاه صحيحة وسارية.','Tick this before submitting or printing the final proposal.':'حدد هذا الخيار قبل تقديم العرض النهائي أو طباعته.',
  'Export & Save':'الحفظ والتصدير','Save locally, submit the proposal, or print a clean copy to PDF.':'احفظ محلياً أو أرسل العرض أو اطبع نسخة نظيفة بصيغة PDF.','Ready':'جاهز','Print to PDF':'طباعة PDF','Save':'حفظ','Submit':'إرسال','Received Requests':'الطلبات المستلمة','No received requests to display.':'لا توجد طلبات مستلمة للعرض.','Draft saved':'تم حفظ المسودة','Draft saved on this device.':'تم حفظ المسودة على هذا الجهاز.','Saved draft restored.':'تم استعادة المسودة المحفوظة.','Submit endpoint is not configured yet. Add the external form service endpoint in script.js.':'لم يتم إعداد رابط الإرسال بعد. أضف رابط خدمة النماذج الخارجية في ملف script.js.','Submitting…':'جارٍ الإرسال…','Proposal submitted successfully.':'تم إرسال العرض بنجاح.','Submission failed. Please check the endpoint and try again.':'فشل الإرسال. تحقق من الرابط وحاول مرة أخرى.'
};

const arPlaceholders={
  'e.g. 40–60 transactions / month':'مثال: 40–60 معاملة / شهر',
  'List the services you recommend starting with':'اذكر الخدمات التي تقترح البدء بها',
  'e.g. 3 months':'مثال: 3 أشهر',
  'Add assumptions, exclusions, payment terms, or commercial notes':'أضف الافتراضات أو الاستثناءات أو شروط الدفع أو الملاحظات التجارية'
};

const translatableNodes=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const tag=node.parentElement?.tagName;if(tag==='SCRIPT'||tag==='STYLE')return NodeFilter.FILTER_REJECT;const key=node.nodeValue.trim();return arText[key]?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
let textNode;while(textNode=walker.nextNode())translatableNodes.push({node:textNode,en:textNode.nodeValue,key:textNode.nodeValue.trim()});
const placeholderFields=[...document.querySelectorAll('[placeholder]')].map(el=>({el,en:el.getAttribute('placeholder')}));
const mobileLabels=[...document.querySelectorAll('[data-label]')].map(el=>({el,en:el.dataset.label}));

function setLanguage(lang){
  const arabic=lang==='ar';
  document.documentElement.lang=lang;
  document.documentElement.dir=arabic?'rtl':'ltr';
  document.title=arabic?'الحزمة التجارية للخدمات الإدارية':'Administrative Services Commercial Pack';
  translatableNodes.forEach(({node,en,key})=>{node.nodeValue=arabic?en.replace(key,arText[key]):en});
  placeholderFields.forEach(({el,en})=>{el.setAttribute('placeholder',arabic?(arPlaceholders[en]||en):en)});
  mobileLabels.forEach(({el,en})=>{el.dataset.label=arabic?(arText[en]||en):en});
  document.querySelectorAll('.lang-option').forEach(btn=>{const active=btn.dataset.lang===lang;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
  const currentStatus=statusArea.textContent.trim();
  if(arabic&&arText[currentStatus])statusArea.textContent=arText[currentStatus];
}

document.querySelectorAll('.lang-option').forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.lang)));
setLanguage('en');
