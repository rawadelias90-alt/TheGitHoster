(() => {
  'use strict';

  const R = window.IntakeRequirements;
  if (!R) throw new Error('IntakeRequirements failed to load.');

  const steps = ['welcome', 'candidate', 'documents', 'servicePath', 'conditionalRequirements', 'review', 'confirmation'];
  const stepMeta = {
    candidate: { eyebrow: 'Step 2 of 7', title: 'Candidate Information', description: 'Confirm the candidate information required to determine the applicable onboarding path.' },
    documents: { eyebrow: 'Step 3 of 7', title: 'Documents', description: 'Add the common documents and any conditional documents that already apply.' },
    servicePath: { eyebrow: 'Step 4 of 7', title: 'Service & Onboarding Path', description: 'Select the service and confirm the preconditions required before Intake 2.' },
    conditionalRequirements: { eyebrow: 'Step 5 of 7', title: 'Conditional Requirements', description: 'Complete only the additional requirements that apply to this candidate.' },
    review: { eyebrow: 'Step 6 of 7', title: 'Review & Submit', description: 'Check the request, resolve any missing required items, and submit when ready.' }
  };

  const state = {
    currentStep: 'welcome',
    maxVisited: 0,
    draft: createEmptyDraft(),
    isSubmitting: false
  };

  const dom = {
    welcomeScreen: document.querySelector('#welcomeScreen'),
    workflowShell: document.querySelector('#workflowShell'),
    confirmationScreen: document.querySelector('#confirmationScreen'),
    screenHost: document.querySelector('#screenHost'),
    screenEyebrow: document.querySelector('#screenEyebrow'),
    screenTitle: document.querySelector('#screenTitle'),
    screenDescription: document.querySelector('#screenDescription'),
    screenStatus: document.querySelector('#screenStatus'),
    errorSummary: document.querySelector('#errorSummary'),
    backButton: document.querySelector('#backButton'),
    nextButton: document.querySelector('#nextButton'),
    submitRequest: document.querySelector('#submitRequest'),
    readinessBadge: document.querySelector('#readinessBadge'),
    readinessRing: document.querySelector('#readinessRing'),
    readinessPercent: document.querySelector('#readinessPercent'),
    readinessSummary: document.querySelector('#readinessSummary'),
    readinessMissing: document.querySelector('#readinessMissing'),
    fieldMetric: document.querySelector('#fieldMetric'),
    documentMetric: document.querySelector('#documentMetric'),
    routePreviewText: document.querySelector('#routePreviewText'),
    missingPreview: document.querySelector('#missingPreview'),
    missingCount: document.querySelector('#missingCount'),
    missingList: document.querySelector('#missingList'),
    routeLiveRegion: document.querySelector('#routeLiveRegion'),
    statusMessage: document.querySelector('#statusMessage'),
    simulateUploadFailure: document.querySelector('#simulateUploadFailure'),
    confirmationText: document.querySelector('#confirmationText'),
    mobileProgressLabel: document.querySelector('#mobileProgressLabel'),
    mobileProgressCount: document.querySelector('#mobileProgressCount')
  };

  function createEmptyDraft() {
    return {
      candidate: {},
      mainDocuments: {},
      service: {
        serviceType: '',
        routeId: '',
        clientApprovalConfirmed: '',
        mobilizingFrom: '',
        intake1Completed: ''
      },
      route: {},
      education: {},
      additionalDocuments: {},
      submittedRequest: null
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;' }[char]));
  }

  function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function acceptFor(rule) {
    return (rule.allowedExtensions || []).map((ext) => `.${ext}`).join(',');
  }

  function currentRoute() {
    return R.getRoute(state.draft.service.routeId || R.getRouteIdForService(state.draft.service.serviceType));
  }

  function currentPath() {
    return R.getOnboardingPath(state.draft);
  }

  function setStatus(message = '', type = '') {
    if (!message) {
      dom.statusMessage.hidden = true;
      dom.statusMessage.textContent = '';
      delete dom.statusMessage.dataset.type;
      return;
    }
    dom.statusMessage.hidden = false;
    dom.statusMessage.textContent = message;
    if (type) dom.statusMessage.dataset.type = type;
    else delete dom.statusMessage.dataset.type;
    window.setTimeout(() => {
      if (dom.statusMessage.textContent === message && type !== 'error') dom.statusMessage.hidden = true;
    }, 3200);
  }

  function setScreenStatus(text = '') {
    dom.screenStatus.textContent = text;
  }

  function showErrorSummary(errors) {
    if (!errors.length) {
      dom.errorSummary.hidden = true;
      dom.errorSummary.innerHTML = '';
      return;
    }
    dom.errorSummary.hidden = false;
    dom.errorSummary.innerHTML = `<strong>Complete ${errors.length === 1 ? 'this item' : 'these items'} before continuing.</strong><ul>${errors.map((error) => `<li>${escapeHtml(error.message)}</li>`).join('')}</ul>`;
    errors.forEach((error) => {
      const control = dom.screenHost.querySelector(`[name="${CSS.escape(error.id)}"]`);
      if (control) control.setAttribute('aria-invalid', 'true');
      const errorNode = dom.screenHost.querySelector(`#error-${CSS.escape(error.id)}`);
      if (errorNode) errorNode.textContent = error.message;
    });
    const first = dom.screenHost.querySelector('[aria-invalid="true"]');
    if (first) first.focus({ preventScroll: true });
    dom.errorSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearValidation() {
    dom.errorSummary.hidden = true;
    dom.errorSummary.innerHTML = '';
    dom.screenHost.querySelectorAll('[aria-invalid="true"]').forEach((node) => node.removeAttribute('aria-invalid'));
    dom.screenHost.querySelectorAll('.field-error').forEach((node) => { node.textContent = ''; });
  }

  function renderField(field, section) {
    const value = state.draft[section]?.[field.id] || '';
    const required = field.required ? '<span class="required-mark" aria-hidden="true">*</span>' : '';
    const requiredText = field.required ? ' <span class="sr-only">required</span>' : '';
    const helper = field.helper ? `<p class="field-helper" id="help-${field.id}">${escapeHtml(field.helper)}</p>` : '';
    const describedBy = `${field.helper ? `help-${field.id} ` : ''}error-${field.id}`.trim();

    if (field.type === 'radio') {
      return `<fieldset class="field-group field-group-wide" data-field-id="${field.id}"><legend>${escapeHtml(field.label)} ${required}${requiredText}</legend>${helper}<div class="choice-grid">${field.options.map((option) => `<label class="choice-card"><input type="radio" name="${field.id}" data-section="${section}" value="${escapeHtml(option)}" ${value === option ? 'checked' : ''} ${field.required ? 'required' : ''} aria-describedby="${describedBy}"><span><strong>${escapeHtml(option)}</strong></span></label>`).join('')}</div><p class="field-error" id="error-${field.id}" aria-live="polite"></p></fieldset>`;
    }

    if (field.type === 'select') {
      return `<label class="field-group"><span>${escapeHtml(field.label)} ${required}${requiredText}</span>${helper}<select name="${field.id}" data-section="${section}" ${field.required ? 'required' : ''} aria-describedby="${describedBy}"><option value="">Select an option</option>${field.options.map((option) => `<option value="${escapeHtml(option)}" ${value === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select><p class="field-error" id="error-${field.id}" aria-live="polite"></p></label>`;
    }

    const autocomplete = field.id === 'candidateFullName' ? 'name' : field.id === 'personalEmail' ? 'email' : field.id === 'contactNumber' ? 'tel' : 'off';
    return `<label class="field-group"><span>${escapeHtml(field.label)} ${required}${requiredText}</span>${helper}<input name="${field.id}" data-section="${section}" type="${field.type}" value="${escapeHtml(value)}" ${field.required ? 'required' : ''} autocomplete="${autocomplete}" aria-describedby="${describedBy}"><p class="field-error" id="error-${field.id}" aria-live="polite"></p></label>`;
  }

  function renderDocumentCard(rule, section) {
    const files = state.draft[section]?.[rule.id] || [];
    const guidance = [];
    if (rule.allowMultiple) guidance.push('Multiple files allowed');
    else guidance.push('One file');
    if (rule.maxSizeMB) guidance.push(`${rule.maxSizeMB} MB max per file`);
    if (rule.allowedExtensions?.length) guidance.push(rule.allowedExtensions.map((ext) => ext.toUpperCase()).join(', '));
    const accept = acceptFor(rule);
    const fileList = files.length
      ? `<div class="staged-files">${files.map((file, index) => `<span class="file-chip"><svg class="icon"><use href="./assets/icon-sprite.svg#document"></use></svg><span>${escapeHtml(file.name)} <small>${formatFileSize(file.size)}</small></span><button type="button" class="icon-button" data-remove-file="${rule.id}" data-section="${section}" data-index="${index}" aria-label="Remove ${escapeHtml(file.name)}">×</button></span>`).join('')}</div>`
      : '<p class="empty-file-state">No file staged yet.</p>';

    return `<article class="document-card ${files.length ? 'has-files' : ''}" data-document-id="${rule.id}"><div class="document-card-top"><div class="document-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#upload"></use></svg></div><div class="document-copy"><div class="document-title-row"><h3>${escapeHtml(rule.label)}</h3><span class="requirement-tag ${rule.required ? 'is-required' : 'is-optional'}">${rule.required ? 'Required' : 'If applicable'}</span></div>${rule.helper ? `<p>${escapeHtml(rule.helper)}</p>` : ''}<p class="file-guidance">${escapeHtml(guidance.join(' · '))}</p></div></div>${fileList}<label class="upload-button"><span>${files.length ? 'Replace or add file' : 'Choose file'}</span><input type="file" name="${rule.id}" data-file-input="${rule.id}" data-section="${section}" ${accept ? `accept="${accept}"` : ''} ${rule.allowMultiple ? 'multiple' : ''}></label><p class="field-error" id="error-${rule.id}" aria-live="polite"></p></article>`;
  }

  function renderCandidate() {
    dom.screenHost.innerHTML = `<div class="section-intro"><div class="section-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#candidate"></use></svg></div><div><strong>Candidate information</strong><span>Fields marked * are required.</span></div></div><div class="form-grid">${R.candidateFields.map((field) => renderField(field, 'candidate')).join('')}</div>`;
    setScreenStatus(`${R.candidateFields.filter((field) => field.required).length} required fields`);
  }

  function renderDocuments() {
    const documents = R.getCoreDocuments(state.draft);
    dom.screenHost.innerHTML = `<div class="source-callout"><svg class="icon"><use href="./assets/icon-sprite.svg#info"></use></svg><div><strong>Core documents</strong><p>Common documents are required for every request. Other items appear only when relevant to the candidate information already entered.</p></div></div><div class="document-grid">${documents.map((rule) => renderDocumentCard(rule, 'mainDocuments')).join('')}</div>`;
    const requiredCount = documents.filter((rule) => rule.required).length;
    setScreenStatus(`${requiredCount} required document${requiredCount === 1 ? '' : 's'}`);
  }

  function serviceSelectionMarkup() {
    const selected = state.draft.service.serviceType;
    return `<div class="section-intro"><div class="section-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#route"></use></svg></div><div><strong>Choose a service</strong><span>The service, entity and hire status determine the onboarding path.</span></div></div><fieldset class="field-group field-group-wide"><legend>Select Service Type <span class="required-mark" aria-hidden="true">*</span><span class="sr-only">required</span></legend><div class="service-grid">${R.serviceTypes.map((service) => `<label class="service-card"><input type="radio" name="serviceType" data-section="service" value="${escapeHtml(service.value)}" data-route-id="${service.routeId}" ${selected === service.value ? 'checked' : ''}><span class="service-card-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#route"></use></svg></span><span><strong>${escapeHtml(service.label)}</strong><small>${escapeHtml(serviceSummary(service.routeId))}</small></span><span class="service-radio" aria-hidden="true"></span></label>`).join('')}</div><p class="field-error" id="error-serviceType" aria-live="polite"></p></fieldset>`;
  }

  function servicePreconditionsMarkup() {
    if (!state.draft.service.serviceType) return '';
    const fields = R.getServicePathFields(state.draft);
    return `<div class="subsection-heading"><span>Before Intake 2</span><h2>Confirm readiness</h2></div><div class="form-grid">${fields.map((field) => renderField(field, 'service')).join('')}</div>`;
  }

  function renderServicePath() {
    const path = currentPath();
    const route = currentRoute();
    const specialHire = R.isSpecialHireApplicable(state.draft);
    let pathPreview = '<div class="empty-state"><strong>Your onboarding path will appear here.</strong><p>Select the service and complete the required service details.</p></div>';

    if (path) {
      pathPreview = `<div class="route-banner"><div class="route-banner-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#passport"></use></svg></div><div><p class="eyebrow">Onboarding path</p><h2>${escapeHtml(path.label)}</h2><p>${path.intake1Required ? 'Intake 1 applies to this path.' : 'No Intake 1 is required for this path.'}${specialHire ? ' Special Hire requirements apply.' : ''}</p></div></div>`;
    } else if (route) {
      pathPreview = '<div class="empty-state"><strong>Complete the service details.</strong><p>The final onboarding path will appear once the required information is available.</p></div>';
    }

    dom.screenHost.innerHTML = `${serviceSelectionMarkup()}${servicePreconditionsMarkup()}${pathPreview}`;
    setScreenStatus(path ? path.label : route ? 'Complete service details' : 'Selection required');
  }

  function routeRequirementsMarkup() {
    const routeDocs = R.getRouteDocuments(state.draft);
    if (!routeDocs.length) {
      return '<div class="source-callout"><svg class="icon"><use href="./assets/icon-sprite.svg#check"></use></svg><div><strong>No additional path document required</strong><p>No additional service-specific Intake 2 document is required for this onboarding path.</p></div></div>';
    }
    const specialHire = R.isSpecialHireApplicable(state.draft);
    const title = specialHire ? 'Special Hire document' : 'Onboarding path documents';
    return `<div class="subsection-heading"><span>Onboarding path</span><h2>${escapeHtml(title)}</h2></div><div class="document-grid">${routeDocs.map((rule) => renderDocumentCard(rule, 'route')).join('')}</div>`;
  }

  function educationRequirementsMarkup() {
    if (!R.isEducationApplicable(state.draft)) return '';
    const field = R.educationFields[0];
    const documents = R.getEducationDocuments(state.draft);
    return `<div class="subsection-heading"><span>Education</span><h2>Education verification / equivalency</h2></div><div class="source-callout"><svg class="icon"><use href="./assets/icon-sprite.svg#education"></use></svg><div><strong>Education document check</strong><p>The Education Certificate is handled in Documents. Confirm whether verification or equivalency is available so Intake2 can request the correct supporting document.</p></div></div><div class="form-grid education-field">${renderField(field, 'education')}</div>${documents.length ? `<div class="document-grid">${documents.map((rule) => renderDocumentCard(rule, 'education')).join('')}</div>` : ''}`;
  }

  function additionalDocumentsMarkup() {
    return `<div class="subsection-heading"><span>Optional</span><h2>Other supporting documents</h2></div><div class="document-grid">${R.additionalDocuments.map((rule) => renderDocumentCard(rule, 'additionalDocuments')).join('')}</div>`;
  }

  function renderConditionalRequirements() {
    if (!state.draft.service.serviceType || !currentPath()) {
      dom.screenHost.innerHTML = '<div class="empty-state"><strong>Onboarding path not ready.</strong><p>Return to Service & Path and complete the required service details first.</p></div>';
      setScreenStatus('Complete Service & Path first');
      return;
    }
    dom.screenHost.innerHTML = `${routeRequirementsMarkup()}${educationRequirementsMarkup()}${additionalDocumentsMarkup()}`;
    const requiredCount = R.getConditionalDocuments(state.draft).filter((rule) => rule.required).length;
    setScreenStatus(requiredCount ? `${requiredCount} required conditional document${requiredCount === 1 ? '' : 's'}` : 'No required conditional documents');
  }

  function reviewValue(value) {
    if (Array.isArray(value)) return value.length ? value.map((file) => file.name).join(', ') : 'Not provided';
    return hasValue(value) ? String(value) : 'Not provided';
  }

  function reviewSection(title, step, rows, status) {
    return `<article class="review-card"><div class="review-card-heading"><div><span class="review-status ${status.complete ? 'is-complete' : 'needs-action'}"><svg class="icon"><use href="./assets/icon-sprite.svg#${status.complete ? 'check' : 'warning'}"></use></svg>${status.complete ? 'Complete' : `${status.missing} missing`}</span><h2>${escapeHtml(title)}</h2></div><button type="button" class="text-button" data-edit-step="${step}">Edit</button></div><dl>${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(reviewValue(value))}</dd></div>`).join('')}</dl></article>`;
  }

  function sectionMissing(sectionName) {
    return R.getReadiness(state.draft).missing.filter((item) => item.section === sectionName).length;
  }

  function renderReview() {
    const readiness = R.getReadiness(state.draft);
    const path = currentPath();
    const candidateRows = R.candidateFields.map((field) => [field.label, state.draft.candidate[field.id]]);
    const coreDocs = R.getCoreDocuments(state.draft);
    const documentRows = coreDocs.map((rule) => [rule.label, state.draft.mainDocuments[rule.id] || []]);
    const serviceRows = [
      ['Service Type', state.draft.service.serviceType],
      ['Onboarding Path', path ? path.label : 'Not determined'],
      ...R.getServicePathFields(state.draft).map((field) => [field.label, state.draft.service[field.id]])
    ];
    const conditionalRows = [
      ...R.getRouteDocuments(state.draft).map((rule) => [rule.label, state.draft.route[rule.id] || []]),
      ...(R.isEducationApplicable(state.draft) ? [[R.educationFields[0].label, state.draft.education.equivalencyAvailable]] : []),
      ...R.getEducationDocuments(state.draft).map((rule) => [rule.label, state.draft.education[rule.id] || []]),
      ...R.additionalDocuments.map((rule) => [rule.label, state.draft.additionalDocuments[rule.id] || []])
    ];

    const missingCandidate = sectionMissing('candidate');
    const missingMain = sectionMissing('mainDocuments');
    const missingService = sectionMissing('service');
    const missingConditional = sectionMissing('route') + sectionMissing('education');

    dom.screenHost.innerHTML = `<div class="review-hero ${readiness.ready ? 'is-ready' : ''}"><div><p class="eyebrow">Submission readiness</p><h2>${readiness.ready ? 'Ready to submit' : 'Action required before Submit'}</h2><p>${readiness.ready ? 'All required fields and documents for this onboarding path are complete.' : `${readiness.missing.length} required item${readiness.missing.length === 1 ? '' : 's'} still need attention.`}</p></div><div class="review-score"><strong>${calculatePercent(readiness)}%</strong><span>complete</span></div></div><div class="review-grid">${reviewSection('Candidate Information', 'candidate', candidateRows, { complete: missingCandidate === 0, missing: missingCandidate })}${reviewSection('Documents', 'documents', documentRows, { complete: missingMain === 0, missing: missingMain })}${reviewSection('Service & Onboarding Path', 'servicePath', serviceRows, { complete: missingService === 0, missing: missingService })}${reviewSection('Conditional Requirements', 'conditionalRequirements', conditionalRows, { complete: missingConditional === 0, missing: missingConditional })}</div>`;
    setScreenStatus(readiness.ready ? 'Ready to submit' : `${readiness.missing.length} missing required item${readiness.missing.length === 1 ? '' : 's'}`);
  }

  function renderCurrentStep() {
    clearValidation();
    if (state.currentStep === 'candidate') renderCandidate();
    else if (state.currentStep === 'documents') renderDocuments();
    else if (state.currentStep === 'servicePath') renderServicePath();
    else if (state.currentStep === 'conditionalRequirements') renderConditionalRequirements();
    else if (state.currentStep === 'review') renderReview();
    bindDynamicEvents();
    updateReadiness();
  }

  function bindDynamicEvents() {
    dom.screenHost.querySelectorAll('input:not([type="file"]), select').forEach((control) => {
      control.addEventListener('change', handleControlChange);
      if (control.tagName === 'INPUT' && !['radio', 'checkbox', 'date'].includes(control.type)) control.addEventListener('input', handleControlChange);
    });
    dom.screenHost.querySelectorAll('[data-file-input]').forEach((input) => input.addEventListener('change', handleFileChange));
    dom.screenHost.querySelectorAll('[data-remove-file]').forEach((button) => button.addEventListener('click', handleRemoveFile));
    dom.screenHost.querySelectorAll('[data-edit-step]').forEach((button) => button.addEventListener('click', () => goToStep(button.dataset.editStep, { force: true })));
  }

  function handleControlChange(event) {
    clearValidation();
    const control = event.target;
    const name = control.name;
    const section = control.dataset.section;
    if (!name || !section) return;

    if (section === 'service' && name === 'serviceType') {
      const newService = control.value;
      const newRouteId = R.getRouteIdForService(newService);
      const previousRouteId = state.draft.service.routeId;
      if (previousRouteId && previousRouteId !== newRouteId && routeHasData()) {
        const confirmed = window.confirm('Changing the service type will clear information already staged for the current onboarding path. Common candidate and document data will be kept. Continue?');
        if (!confirmed) {
          renderServicePath();
          bindDynamicEvents();
          return;
        }
      }
      if (previousRouteId !== newRouteId) {
        state.draft.route = {};
        state.draft.education = {};
        state.draft.service.mobilizingFrom = '';
        state.draft.service.intake1Completed = '';
      }
      state.draft.service.serviceType = newService;
      state.draft.service.routeId = newRouteId;
      renderServicePath();
      bindDynamicEvents();
      updateReadiness();
      return;
    }

    state.draft[section][name] = control.value;

    if (section === 'service') {
      if (name === 'mobilizingFrom') state.draft.service.intake1Completed = '';
      renderServicePath();
      bindDynamicEvents();
    } else if (section === 'education' && name === 'equivalencyAvailable') {
      state.draft.education.certificateOfEquivalencyOrEducationalVerification = [];
      state.draft.education.awardOrEducationDetailsDocument = [];
      renderConditionalRequirements();
      bindDynamicEvents();
    }

    updateReadiness();
  }

  function routeHasData() {
    return Object.values(state.draft.route).some(hasValue) || Object.values(state.draft.education).some(hasValue);
  }

  function fileExtension(fileName) {
    const match = String(fileName || '').toLowerCase().match(/\.([a-z0-9]+)$/);
    return match ? match[1] : '';
  }

  function handleFileChange(event) {
    clearValidation();
    const input = event.currentTarget;
    const section = input.dataset.section;
    const id = input.dataset.fileInput;
    const rule = findDocumentRule(id);
    const files = Array.from(input.files || []);
    if (!rule) return;

    const errors = [];
    if (!rule.allowMultiple && files.length > 1) errors.push(`${rule.label} accepts one file only.`);
    if (rule.maxSizeMB) {
      const maxBytes = rule.maxSizeMB * 1024 * 1024;
      if (files.some((file) => file.size > maxBytes)) errors.push(`Each file for ${rule.label} must be ${rule.maxSizeMB} MB or smaller.`);
    }
    if (rule.allowedExtensions?.length) {
      const allowed = new Set(rule.allowedExtensions.map((ext) => ext.toLowerCase()));
      if (files.some((file) => !allowed.has(fileExtension(file.name)))) errors.push(`${rule.label} accepts only ${rule.allowedExtensions.map((ext) => ext.toUpperCase()).join(', ')} files.`);
    }

    if (errors.length) {
      showErrorSummary(errors.map((message) => ({ id, message })));
      input.value = '';
      return;
    }

    const metadata = files.map((file) => ({ name: file.name, size: file.size, type: file.type, lastModified: file.lastModified }));
    if (rule.allowMultiple) state.draft[section][id] = [...(state.draft[section][id] || []), ...metadata];
    else state.draft[section][id] = metadata.slice(0, 1);
    renderCurrentStep();
    setStatus(`${files.length} file${files.length === 1 ? '' : 's'} staged for ${rule.label}.`, 'success');
  }

  function handleRemoveFile(event) {
    const button = event.currentTarget;
    const section = button.dataset.section;
    const id = button.dataset.removeFile;
    const index = Number(button.dataset.index);
    const current = [...(state.draft[section][id] || [])];
    current.splice(index, 1);
    state.draft[section][id] = current;
    renderCurrentStep();
  }

  function findDocumentRule(id) {
    const all = [
      ...R.getCoreDocuments(state.draft),
      ...R.getRouteDocuments(state.draft),
      ...R.getEducationDocuments(state.draft),
      ...R.additionalDocuments
    ];
    return all.find((rule) => rule.id === id) || null;
  }

  function errorsForCurrentStep() {
    const readiness = R.getReadiness(state.draft);
    const sections = {
      candidate: ['candidate'],
      documents: ['mainDocuments'],
      servicePath: ['service'],
      conditionalRequirements: ['route', 'education']
    }[state.currentStep] || [];

    return readiness.missing
      .filter((item) => sections.includes(item.section))
      .map((item) => ({ id: item.id, message: `${item.label} is required.` }));
  }

  function validateCurrentStep() {
    if (window.INTAKE2_TEST_MODE) {
      showErrorSummary([]);
      return true;
    }
    const errors = errorsForCurrentStep();
    showErrorSummary(errors);
    return errors.length === 0;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    const index = steps.indexOf(state.currentStep);
    if (index < 1 || index >= steps.indexOf('review')) return;
    goToStep(steps[index + 1]);
  }

  function previousStep() {
    const index = steps.indexOf(state.currentStep);
    if (index <= 1) goToStep('welcome', { force: true });
    else goToStep(steps[index - 1], { force: true });
  }

  function goToStep(step, options = {}) {
    if (!steps.includes(step)) return;
    const targetIndex = steps.indexOf(step);
    if (!options.force && targetIndex > state.maxVisited + 1) return;
    state.currentStep = step;
    state.maxVisited = Math.max(state.maxVisited, targetIndex);

    const isWelcome = step === 'welcome';
    const isConfirmation = step === 'confirmation';
    dom.welcomeScreen.hidden = !isWelcome;
    dom.workflowShell.hidden = isWelcome || isConfirmation;
    dom.confirmationScreen.hidden = !isConfirmation;

    if (!isWelcome && !isConfirmation) {
      const meta = stepMeta[step];
      dom.screenEyebrow.textContent = meta.eyebrow;
      dom.screenTitle.textContent = meta.title;
      dom.screenDescription.textContent = meta.description;
      renderCurrentStep();
      dom.nextButton.hidden = step === 'review';
      dom.submitRequest.hidden = step !== 'review';
      dom.backButton.textContent = step === 'candidate' ? 'Back to start' : 'Back';
    }

    updateProgress();
    updateReadiness();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress() {
    const activeIndex = steps.indexOf(state.currentStep);
    document.querySelectorAll('#progressNav [data-step]').forEach((item) => {
      const index = steps.indexOf(item.dataset.step);
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-complete', index < activeIndex);
      const button = item.querySelector('button');
      const navigable = index <= state.maxVisited && index > 0 && index < steps.length - 1;
      button.disabled = !navigable;
      if (index === activeIndex) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    const activeItem = document.querySelector(`#progressNav [data-step="${state.currentStep}"] em`);
    dom.mobileProgressLabel.textContent = activeItem ? activeItem.textContent : 'Start';
    dom.mobileProgressCount.textContent = `${activeIndex + 1} / ${steps.length}`;
  }

  function calculatePercent(readiness) {
    const total = readiness.requiredFields + readiness.requiredDocuments;
    const completed = readiness.completedFields + readiness.completedDocuments;
    return total ? Math.round((completed / total) * 100) : 0;
  }

  function updateReadiness() {
    const readiness = R.getReadiness(state.draft);
    const percent = calculatePercent(readiness);
    dom.readinessRing.style.setProperty('--progress', percent);
    dom.readinessPercent.textContent = `${percent}%`;
    dom.fieldMetric.textContent = `${readiness.completedFields} / ${readiness.requiredFields}`;
    dom.documentMetric.textContent = `${readiness.completedDocuments} / ${readiness.requiredDocuments}`;
    dom.readinessBadge.textContent = window.INTAKE2_TEST_MODE ? 'Test mode' : readiness.ready ? 'Ready' : 'In progress';
    dom.readinessBadge.classList.toggle('is-ready', readiness.ready && !window.INTAKE2_TEST_MODE);
    dom.readinessSummary.textContent = readiness.ready ? 'Ready to submit' : 'Request in progress';
    dom.readinessMissing.textContent = readiness.ready ? 'All required items are complete.' : `${readiness.missing.length} required item${readiness.missing.length === 1 ? '' : 's'} remaining.`;

    const path = readiness.path || currentPath();
    dom.routePreviewText.textContent = path ? path.label : 'Complete Service & Path to see the applicable onboarding path.';

    if (readiness.missing.length && !window.INTAKE2_TEST_MODE) {
      dom.missingPreview.hidden = false;
      dom.missingCount.textContent = String(readiness.missing.length);
      dom.missingList.innerHTML = readiness.missing.slice(0, 4).map((item) => `<li>${escapeHtml(item.label)}</li>`).join('');
    } else {
      dom.missingPreview.hidden = true;
      dom.missingList.innerHTML = '';
    }

    dom.submitRequest.disabled = state.isSubmitting || (!readiness.ready && !window.INTAKE2_TEST_MODE);
  }

  function serviceSummary(routeId) {
    const summaries = {
      employmentVisa: 'AECOM-sponsored Employment Visa and Work Permit.',
      relativeVisa: 'Work Permit for a candidate with Relative / Family Visa.',
      goldenVisa: 'Work Permit for a candidate with Golden Visa.',
      emiratiNational: 'Work Permit route for an Emirati National.',
      gccNational: 'Work Permit route for a GCC National.'
    };
    return summaries[routeId] || 'Applicable requirements appear after selection.';
  }

  function createPrototypeRequest() {
    const suffix = Date.now().toString().slice(-8);
    return {
      id: `REQ-${suffix}`,
      createdAt: new Date().toISOString(),
      candidateName: state.draft.candidate.candidateFullName || '',
      serviceType: state.draft.service.serviceType || '',
      pathId: currentPath()?.id || ''
    };
  }

  async function handleSubmit() {
    if (state.isSubmitting) return setStatus('Please wait. A submission is already in progress.', 'error');
    const readiness = R.getReadiness(state.draft);
    if (!readiness.ready && !window.INTAKE2_TEST_MODE) {
      setStatus('The request still has required items to complete.', 'error');
      renderReview();
      updateReadiness();
      return;
    }

    state.isSubmitting = true;
    dom.submitRequest.textContent = 'Submitting…';
    updateReadiness();
    if (!state.draft.submittedRequest) state.draft.submittedRequest = createPrototypeRequest();
    await new Promise((resolve) => window.setTimeout(resolve, 550));

    if (dom.simulateUploadFailure?.checked) {
      state.isSubmitting = false;
      dom.submitRequest.textContent = 'Retry submission';
      setStatus(`Upload failed in prototype test mode. Retry will reuse request ${state.draft.submittedRequest.id}.`, 'error');
      updateReadiness();
      return;
    }

    state.isSubmitting = false;
    dom.submitRequest.textContent = 'Submit request';
    dom.confirmationText.textContent = `Prototype request ${state.draft.submittedRequest.id} completed using the guarded submit sequence.`;
    setStatus('Prototype submission complete.', 'success');
    goToStep('confirmation', { force: true });
  }

  function resetRequest() {
    state.draft = createEmptyDraft();
    state.isSubmitting = false;
    state.maxVisited = 1;
    if (dom.simulateUploadFailure) dom.simulateUploadFailure.checked = false;
    setStatus();
    goToStep('candidate', { force: true });
  }

  document.querySelector('#startRequest').addEventListener('click', resetRequest);
  document.querySelector('#newRequest').addEventListener('click', resetRequest);
  document.querySelector('#brandHome').addEventListener('click', (event) => { event.preventDefault(); goToStep('welcome', { force: true }); });
  dom.backButton.addEventListener('click', previousStep);
  dom.nextButton.addEventListener('click', nextStep);
  dom.submitRequest.addEventListener('click', handleSubmit);

  document.querySelectorAll('[data-progress-target]').forEach((button) => {
    button.addEventListener('click', () => goToStep(button.dataset.progressTarget, { force: true }));
  });

  updateProgress();
  updateReadiness();
})();
