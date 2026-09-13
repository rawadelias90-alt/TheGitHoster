(() => {
  'use strict';

  const R = window.IntakeRequirements;
  if (!R) throw new Error('IntakeRequirements failed to load.');

  const steps = ['welcome', 'candidate', 'mainDocuments', 'service', 'route', 'education', 'additional', 'review', 'confirmation'];
  const stepMeta = {
    candidate: { eyebrow: 'Step 2 of 9', title: 'Candidate Personal Information', description: 'Enter the candidate information used across the new-hire mobility request.' },
    mainDocuments: { eyebrow: 'Step 3 of 9', title: 'The Main Required Documents', description: 'Stage the baseline documents used as the primary reference across the applicable GRO workflow.' },
    service: { eyebrow: 'Step 4 of 9', title: 'Select Service Type', description: 'Choose the employment visa or work permit route that applies to this candidate.' },
    route: { eyebrow: 'Step 5 of 9', title: 'Route-specific requirements', description: 'Complete only the requirements for the selected service route.' },
    education: { eyebrow: 'Step 6 of 9', title: 'Certificate of Equivalency & Education Details', description: 'Confirm equivalency availability and stage the education documents required by the source form.' },
    additional: { eyebrow: 'Step 7 of 9', title: 'Additional Supporting Documents', description: 'Add any other supporting documents needed for this request.' },
    review: { eyebrow: 'Step 8 of 9', title: 'Review & Submission Readiness', description: 'Check every section, resolve missing items, and prepare the request for simulated submission.' }
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
      service: { serviceType: '', routeId: '', caseConfirmation: '' },
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

  function acceptFor(documentRule) {
    const map = {
      Image: 'image/*', PDF: '.pdf', Word: '.doc,.docx', Excel: '.xls,.xlsx', PPT: '.ppt,.pptx', Video: 'video/*', Audio: 'audio/*'
    };
    return (documentRule.allowedTypes || []).map((type) => map[type]).filter(Boolean).join(',');
  }

  function currentRoute() {
    return R.getRoute(state.draft.service.routeId || R.getRouteIdForService(state.draft.service.serviceType));
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
    const value = state.draft[section][field.id] || '';
    const required = field.required ? '<span class="required-mark" aria-hidden="true">*</span>' : '';
    const requiredText = field.required ? ' <span class="sr-only">required</span>' : '';
    const helper = field.helper ? `<p class="field-helper" id="help-${field.id}">${escapeHtml(field.helper)}</p>` : '';
    const describedBy = `${field.helper ? `help-${field.id} ` : ''}error-${field.id}`.trim();

    if (field.type === 'radio') {
      return `<fieldset class="field-group field-group-wide" data-field-id="${field.id}"><legend>${escapeHtml(field.label)} ${required}${requiredText}</legend>${helper}<div class="choice-grid">${field.options.map((option) => `<label class="choice-card"><input type="radio" name="${field.id}" value="${escapeHtml(option)}" ${value === option ? 'checked' : ''} ${field.required ? 'required' : ''} aria-describedby="${describedBy}"><span><strong>${escapeHtml(option)}</strong></span></label>`).join('')}</div><p class="field-error" id="error-${field.id}" aria-live="polite"></p></fieldset>`;
    }

    if (field.type === 'select') {
      return `<label class="field-group"><span>${escapeHtml(field.label)} ${required}${requiredText}</span>${helper}<select name="${field.id}" ${field.required ? 'required' : ''} aria-describedby="${describedBy}"><option value="">Select an option</option>${field.options.map((option) => `<option value="${escapeHtml(option)}" ${value === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select><p class="field-error" id="error-${field.id}" aria-live="polite"></p></label>`;
    }

    const autocomplete = field.id === 'candidateFullName' ? 'name' : field.id === 'personalEmail' ? 'email' : field.id === 'contactNumber' ? 'tel' : 'off';
    return `<label class="field-group"><span>${escapeHtml(field.label)} ${required}${requiredText}</span>${helper}<input name="${field.id}" type="${field.type}" value="${escapeHtml(value)}" ${field.required ? 'required' : ''} autocomplete="${autocomplete}" aria-describedby="${describedBy}"><p class="field-error" id="error-${field.id}" aria-live="polite"></p></label>`;
  }

  function renderDocumentCard(rule, section, requiredOverride) {
    const required = requiredOverride !== undefined ? requiredOverride : Boolean(rule.required);
    const files = state.draft[section][rule.id] || [];
    const guidance = [];
    if (rule.maxFiles) guidance.push(`Up to ${rule.maxFiles} file${rule.maxFiles === 1 ? '' : 's'}`);
    if (rule.maxSizeGB) guidance.push(`${rule.maxSizeGB}GB max per file`);
    if (rule.allowedTypes && rule.allowedTypes.length) guidance.push(rule.allowedTypes.join(', '));
    const accept = acceptFor(rule);
    const fileList = files.length ? `<div class="staged-files">${files.map((file, index) => `<span class="file-chip"><svg class="icon"><use href="./assets/icon-sprite.svg#document"></use></svg><span>${escapeHtml(file.name)} <small>${formatFileSize(file.size)}</small></span><button type="button" class="icon-button" data-remove-file="${rule.id}" data-section="${section}" data-index="${index}" aria-label="Remove ${escapeHtml(file.name)}">×</button></span>`).join('')}</div>` : '<p class="empty-file-state">No file staged yet.</p>';
    return `<article class="document-card ${files.length ? 'has-files' : ''}" data-document-id="${rule.id}"><div class="document-card-top"><div class="document-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#upload"></use></svg></div><div class="document-copy"><div class="document-title-row"><h3>${escapeHtml(rule.label)}</h3><span class="requirement-tag ${required ? 'is-required' : 'is-optional'}">${required ? 'Required' : 'If applicable'}</span></div>${rule.helper ? `<p>${escapeHtml(rule.helper)}</p>` : ''}${guidance.length ? `<p class="file-guidance">${escapeHtml(guidance.join(' · '))}</p>` : '<p class="file-guidance">File guidance is not specified in the supplied source.</p>'}</div></div>${fileList}<label class="upload-button"><span>${files.length ? 'Add or replace file' : 'Choose file'}</span><input type="file" name="${rule.id}" data-file-input="${rule.id}" data-section="${section}" ${accept ? `accept="${accept}"` : ''} ${rule.maxFiles !== 1 ? 'multiple' : ''}></label><p class="field-error" id="error-${rule.id}" aria-live="polite"></p></article>`;
  }

  function renderCandidate() {
    dom.screenHost.innerHTML = `<div class="section-intro"><div class="section-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#candidate"></use></svg></div><div><strong>Candidate information</strong><span>Fields marked * are required.</span></div></div><div class="form-grid">${R.candidateFields.map((field) => renderField(field, 'candidate')).join('')}</div>`;
    setScreenStatus(`${R.candidateFields.filter((field) => field.required).length} required fields`);
  }

  function renderMainDocuments() {
    const location = state.draft.candidate.sponsorshipLocation;
    dom.screenHost.innerHTML = `<div class="source-callout"><svg class="icon"><use href="./assets/icon-sprite.svg#info"></use></svg><div><strong>Baseline document set</strong><p>These documents remain the primary reference across the selected employment visa or work permit workflow. Some items apply only in specific circumstances.</p></div></div><div class="document-grid">${R.mainDocuments.map((rule) => renderDocumentCard(rule, 'mainDocuments', R.isMainDocumentRequired(rule.id, state.draft.candidate))).join('')}</div>`;
    const count = R.mainDocuments.filter((rule) => R.isMainDocumentRequired(rule.id, state.draft.candidate)).length;
    setScreenStatus(`${count} required documents${location ? ` for ${shortLocation(location)}` : ''}`);
  }

  function renderService() {
    const selected = state.draft.service.serviceType;
    dom.screenHost.innerHTML = `<div class="section-intro"><div class="section-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#route"></use></svg></div><div><strong>Choose one route</strong><span>Your selection controls the next document requirements.</span></div></div><fieldset class="field-group field-group-wide"><legend>Select Service Type <span class="required-mark" aria-hidden="true">*</span><span class="sr-only">required</span></legend><div class="service-grid">${R.serviceTypes.map((service) => `<label class="service-card"><input type="radio" name="serviceType" value="${escapeHtml(service.value)}" data-route-id="${service.routeId}" ${selected === service.value ? 'checked' : ''}><span class="service-card-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#route"></use></svg></span><span><strong>${escapeHtml(service.label)}</strong><small>${routeSummary(service.routeId)}</small></span><span class="service-radio" aria-hidden="true"></span></label>`).join('')}</div><p class="field-error" id="error-serviceType" aria-live="polite"></p></fieldset>`;
    setScreenStatus(selected ? currentRoute().title : 'Selection required');
  }

  function renderEmploymentRoute(route) {
    const answer = state.draft.service.caseConfirmation || '';
    return `<div class="important-note"><div class="important-note-heading"><svg class="icon"><use href="./assets/icon-sprite.svg#warning"></use></svg><div><span>Important note</span><strong>Check whether the request falls under the source Case A or Case B criteria.</strong></div></div><p>${escapeHtml(route.importantNote.intro)}</p><div class="case-grid"><div><span class="case-label">Case A</span><strong>Nationals of</strong><p>${escapeHtml(route.importantNote.caseA.nationals.join(' · '))}</p><strong>Hired under</strong><p>${escapeHtml(route.importantNote.caseA.hiredUnder.join(' · '))}</p></div><div><span class="case-label">Case B</span><strong>Nationals of</strong><p>${escapeHtml(route.importantNote.caseB.nationals.join(' · '))}</p><strong>Hired under</strong><p>${escapeHtml(route.importantNote.caseB.hiredUnder.join(' · '))}</p></div></div></div><fieldset class="field-group field-group-wide stop-confirm"><legend>${escapeHtml(route.confirmQuestion)} <span class="required-mark" aria-hidden="true">*</span></legend><p class="field-helper">The source does not map Yes to Case A or No to Case B. Both answers continue to the Special Hire requirements.</p><div class="choice-grid choice-grid-compact">${route.confirmOptions.map((option) => `<label class="choice-card"><input type="radio" name="caseConfirmation" value="${option}" ${answer === option ? 'checked' : ''}><span><strong>${option}</strong></span></label>`).join('')}</div><p class="field-error" id="error-caseConfirmation" aria-live="polite"></p></fieldset><div class="subsection-heading"><span>Special Hire Case</span><h2>Required confirmations and identification</h2></div><div class="document-grid">${route.specialHire.documents.map((rule) => renderDocumentCard(rule, 'route')).join('')}</div><div class="confirmation-list">${route.specialHire.confirmations.map((field) => renderConfirmationField(field)).join('')}</div>`;
  }

  function renderConfirmationField(field) {
    const value = state.draft.route[field.id] || '';
    return `<fieldset class="confirmation-item"><legend>${escapeHtml(field.label)} <span class="required-mark" aria-hidden="true">*</span></legend><label class="confirmation-choice"><input type="radio" name="${field.id}" value="Yes" ${value === 'Yes' ? 'checked' : ''}><span><svg class="icon"><use href="./assets/icon-sprite.svg#check"></use></svg>Yes, confirmed</span></label><p class="field-error" id="error-${field.id}" aria-live="polite"></p></fieldset>`;
  }

  function renderRoute() {
    const route = currentRoute();
    if (!route) {
      dom.screenHost.innerHTML = '<div class="empty-state"><strong>No service selected.</strong><p>Return to Service Type and select the applicable route.</p></div>';
      setScreenStatus('Service selection required');
      return;
    }
    if (route.id === 'employmentVisa') {
      dom.screenHost.innerHTML = renderEmploymentRoute(route);
    } else {
      dom.screenHost.innerHTML = `<div class="route-banner"><div class="route-banner-icon"><svg class="icon"><use href="./assets/icon-sprite.svg#passport"></use></svg></div><div><p class="eyebrow">Selected route</p><h2>${escapeHtml(route.title)}</h2><p>${escapeHtml(routeSummary(route.id))}</p></div></div><div class="document-grid">${route.documents.map((rule) => renderDocumentCard(rule, 'route')).join('')}</div>`;
    }
    const requiredCount = R.getRequiredRouteItems(route.id).length;
    setScreenStatus(`${requiredCount} required route item${requiredCount === 1 ? '' : 's'}`);
  }

  function renderEducation() {
    dom.screenHost.innerHTML = `<div class="source-callout"><svg class="icon"><use href="./assets/icon-sprite.svg#education"></use></svg><div><strong>Education & equivalency</strong><p>The supplied branching schema sends every service route through this section.</p></div></div><div class="form-grid education-field">${R.educationFields.map((field) => renderField(field, 'education')).join('')}</div><div class="document-grid">${R.educationDocuments.map((rule) => renderDocumentCard(rule, 'education')).join('')}</div>`;
    setScreenStatus('1 required answer · 2 required documents');
  }

  function renderAdditional() {
    dom.screenHost.innerHTML = `<div class="source-callout"><svg class="icon"><use href="./assets/icon-sprite.svg#document"></use></svg><div><strong>Optional supporting material</strong><p>Use this section to stage any additional supporting documents if required.</p></div></div><div class="document-grid">${R.additionalDocuments.map((rule) => renderDocumentCard(rule, 'additionalDocuments')).join('')}</div>`;
    setScreenStatus('Optional section');
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
    const route = currentRoute();
    const candidateRows = R.candidateFields.map((field) => [field.label, state.draft.candidate[field.id]]);
    const mainRows = R.mainDocuments.map((rule) => [rule.label, state.draft.mainDocuments[rule.id] || []]);
    const serviceRows = [['Service Type', state.draft.service.serviceType], ['Route', route ? route.title : 'Not selected']];
    if (route && route.id === 'employmentVisa') serviceRows.push([route.confirmQuestion, state.draft.service.caseConfirmation]);
    const routeRules = route ? (route.id === 'employmentVisa' ? [...route.specialHire.documents, ...route.specialHire.confirmations] : route.documents) : [];
    const routeRows = routeRules.map((rule) => [rule.label, state.draft.route[rule.id]]);
    const educationRows = [...R.educationFields, ...R.educationDocuments].map((rule) => [rule.label, state.draft.education[rule.id]]);
    const additionalRows = R.additionalDocuments.map((rule) => [rule.label, state.draft.additionalDocuments[rule.id] || []]);

    const missingCandidate = sectionMissing('candidate');
    const missingMain = sectionMissing('mainDocuments');
    const missingService = sectionMissing('service');
    const missingRoute = sectionMissing('route');
    const missingEducation = sectionMissing('education');

    dom.screenHost.innerHTML = `<div class="review-hero ${readiness.ready ? 'is-ready' : ''}"><div><p class="eyebrow">Submission readiness</p><h2>${readiness.ready ? 'Ready to submit' : 'Action required before Submit'}</h2><p>${readiness.ready ? 'All source-required fields and documents for this route are complete.' : `${readiness.missing.length} required item${readiness.missing.length === 1 ? '' : 's'} still need attention.`}</p></div><div class="review-score"><strong>${calculatePercent(readiness)}%</strong><span>complete</span></div></div><div class="review-grid">${reviewSection('Candidate Information', 'candidate', candidateRows, { complete: missingCandidate === 0, missing: missingCandidate })}${reviewSection('Main Required Documents', 'mainDocuments', mainRows, { complete: missingMain === 0, missing: missingMain })}${reviewSection('Selected Service Route', 'service', serviceRows, { complete: missingService === 0, missing: missingService })}${reviewSection('Route-Specific Requirements', 'route', routeRows, { complete: missingRoute === 0, missing: missingRoute })}${reviewSection('Education / Equivalency', 'education', educationRows, { complete: missingEducation === 0, missing: missingEducation })}${reviewSection('Additional Supporting Documents', 'additional', additionalRows, { complete: true, missing: 0 })}</div>`;
    setScreenStatus(readiness.ready ? 'Ready to submit' : `${readiness.missing.length} missing required item${readiness.missing.length === 1 ? '' : 's'}`);
  }

  function renderCurrentStep() {
    clearValidation();
    if (state.currentStep === 'candidate') renderCandidate();
    else if (state.currentStep === 'mainDocuments') renderMainDocuments();
    else if (state.currentStep === 'service') renderService();
    else if (state.currentStep === 'route') renderRoute();
    else if (state.currentStep === 'education') renderEducation();
    else if (state.currentStep === 'additional') renderAdditional();
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

  function sectionForCurrentStep() {
    if (state.currentStep === 'candidate') return 'candidate';
    if (state.currentStep === 'mainDocuments') return 'mainDocuments';
    if (state.currentStep === 'service') return 'service';
    if (state.currentStep === 'route') return 'route';
    if (state.currentStep === 'education') return 'education';
    if (state.currentStep === 'additional') return 'additionalDocuments';
    return '';
  }

  function handleControlChange(event) {
    clearValidation();
    const control = event.target;
    const name = control.name;
    if (!name) return;

    if (state.currentStep === 'service' && name === 'serviceType') {
      const newService = control.value;
      const newRouteId = R.getRouteIdForService(newService);
      const previousRouteId = state.draft.service.routeId;
      if (previousRouteId && previousRouteId !== newRouteId && routeHasData()) {
        const confirmed = window.confirm('Changing the service type will clear information already staged for the current route. Common candidate and document data will be kept. Continue?');
        if (!confirmed) {
          renderService();
          bindDynamicEvents();
          return;
        }
      }
      if (previousRouteId !== newRouteId) state.draft.route = {};
      state.draft.service.serviceType = newService;
      state.draft.service.routeId = newRouteId;
      state.draft.service.caseConfirmation = '';
      const route = R.getRoute(newRouteId);
      dom.routeLiveRegion.textContent = route ? `${route.title} selected. Route requirements updated.` : 'Service selection cleared.';
      setScreenStatus(route ? route.title : 'Selection required');
      updateReadiness();
      return;
    }

    const section = sectionForCurrentStep();
    if (!section) return;
    if (state.currentStep === 'route' && name === 'caseConfirmation') state.draft.service.caseConfirmation = control.value;
    else state.draft[section][name] = control.value;
    updateReadiness();

    if (state.currentStep === 'candidate' && name === 'sponsorshipLocation') setScreenStatus(`${R.mainDocuments.filter((rule) => R.isMainDocumentRequired(rule.id, state.draft.candidate)).length} core documents will be required`);
  }

  function routeHasData() {
    return Object.values(state.draft.route).some(hasValue);
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
    if (rule.maxFiles && files.length > rule.maxFiles) errors.push(`Choose no more than ${rule.maxFiles} file${rule.maxFiles === 1 ? '' : 's'} for ${rule.label}.`);
    if (rule.maxSizeGB) {
      const maxBytes = rule.maxSizeGB * 1024 * 1024 * 1024;
      if (files.some((file) => file.size > maxBytes)) errors.push(`Each file for ${rule.label} must be ${rule.maxSizeGB}GB or smaller.`);
    }
    if (errors.length) {
      showErrorSummary(errors.map((message) => ({ id, message })));
      input.value = '';
      return;
    }

    const metadata = files.map((file) => ({ name: file.name, size: file.size, type: file.type, lastModified: file.lastModified }));
    if (rule.maxFiles === 1) state.draft[section][id] = metadata.slice(0, 1);
    else state.draft[section][id] = [...(state.draft[section][id] || []), ...metadata].slice(0, rule.maxFiles || undefined);
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
    const route = currentRoute();
    const all = [...R.mainDocuments, ...R.educationDocuments, ...R.additionalDocuments];
    if (route) {
      if (route.id === 'employmentVisa') all.push(...route.specialHire.documents);
      else all.push(...route.documents);
    }
    return all.find((rule) => rule.id === id) || null;
  }

  function validateCurrentStep() {
    const errors = [];
    if (state.currentStep === 'candidate') {
      R.candidateFields.filter((field) => field.required).forEach((field) => {
        const value = state.draft.candidate[field.id];
        if (!hasValue(value)) errors.push({ id: field.id, message: `${field.label} is required.` });
        else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(String(value))) errors.push({ id: field.id, message: 'Enter a valid personal email address.' });
      });
    } else if (state.currentStep === 'mainDocuments') {
      R.mainDocuments.forEach((rule) => {
        if (R.isMainDocumentRequired(rule.id, state.draft.candidate) && !hasValue(state.draft.mainDocuments[rule.id])) errors.push({ id: rule.id, message: `${rule.label} is required.` });
      });
    } else if (state.currentStep === 'service') {
      if (!hasValue(state.draft.service.serviceType)) errors.push({ id: 'serviceType', message: 'Select Service Type is required.' });
    } else if (state.currentStep === 'route') {
      const route = currentRoute();
      if (!route) errors.push({ id: 'serviceType', message: 'Select a service type before continuing.' });
      else if (route.id === 'employmentVisa') {
        if (!hasValue(state.draft.service.caseConfirmation)) errors.push({ id: 'caseConfirmation', message: 'Answer the STOP & CONFIRM question.' });
        route.specialHire.documents.filter((rule) => rule.required).forEach((rule) => {
          if (!hasValue(state.draft.route[rule.id])) errors.push({ id: rule.id, message: `${rule.label} is required.` });
        });
        route.specialHire.confirmations.filter((field) => field.required).forEach((field) => {
          if (state.draft.route[field.id] !== 'Yes') errors.push({ id: field.id, message: 'Confirmation is required.' });
        });
      } else {
        route.documents.filter((rule) => rule.required).forEach((rule) => {
          if (!hasValue(state.draft.route[rule.id])) errors.push({ id: rule.id, message: `${rule.label} is required.` });
        });
      }
    } else if (state.currentStep === 'education') {
      if (!hasValue(state.draft.education.equivalencyAvailable)) errors.push({ id: 'equivalencyAvailable', message: 'Confirm whether Certificate of Equivalency is available.' });
      R.educationDocuments.filter((rule) => rule.required).forEach((rule) => {
        if (!hasValue(state.draft.education[rule.id])) errors.push({ id: rule.id, message: `${rule.label} is required.` });
      });
    }
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
    dom.readinessBadge.textContent = readiness.ready ? 'Ready' : 'In progress';
    dom.readinessBadge.classList.toggle('is-ready', readiness.ready);
    dom.readinessSummary.textContent = readiness.ready ? 'Ready to submit' : 'Request in progress';
    dom.readinessMissing.textContent = readiness.ready ? 'All required items are complete.' : `${readiness.missing.length} required item${readiness.missing.length === 1 ? '' : 's'} remaining.`;

    const route = currentRoute();
    dom.routePreviewText.textContent = route ? `${route.title}. Next: ${routeSummary(route.id)}` : 'Select a service type to see the applicable route.';

    if (readiness.missing.length) {
      dom.missingPreview.hidden = false;
      dom.missingCount.textContent = String(readiness.missing.length);
      dom.missingList.innerHTML = readiness.missing.slice(0, 4).map((item) => `<li>${escapeHtml(item.label)}</li>`).join('');
    } else {
      dom.missingPreview.hidden = true;
      dom.missingList.innerHTML = '';
    }

    dom.submitRequest.disabled = state.isSubmitting || !readiness.ready;
  }

  function shortLocation(location) {
    return location.replace('AECOM Middle East Limited – ', '');
  }

  function routeSummary(routeId) {
    const summaries = {
      employmentVisa: 'Case A/B source check, Special Hire requirements, then education/equivalency.',
      relativeVisa: 'Sponsor passport, residence visa, Emirates ID and NOC, then education/equivalency.',
      goldenVisa: 'Golden Visa copy, then education/equivalency.',
      emiratiNational: 'Family Book, applicable medical result and National ID, then education/equivalency.',
      gccNational: 'Applicable Emirati/GCC section items and National ID, then education/equivalency.',
      diplomaticPassport: 'Visa sponsor NOC and applicable Embassy approval, then education/equivalency.'
    };
    return summaries[routeId] || 'Route requirements will appear after selection.';
  }

  function createPrototypeRequest() {
    const suffix = Date.now().toString().slice(-8);
    return {
      id: `INT-${suffix}`,
      createdAt: new Date().toISOString(),
      candidateName: state.draft.candidate.candidateFullName || '',
      serviceType: state.draft.service.serviceType || ''
    };
  }

  async function handleSubmit() {
    if (state.isSubmitting) return setStatus('Please wait. A submission is already in progress.', 'error');
    const readiness = R.getReadiness(state.draft);
    if (!readiness.ready) {
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

    if (dom.simulateUploadFailure.checked) {
      state.isSubmitting = false;
      dom.submitRequest.textContent = 'Retry submission';
      setStatus(`Upload failed in prototype test mode. Retry will reuse request ${state.draft.submittedRequest.id}.`, 'error');
      updateReadiness();
      return;
    }

    state.isSubmitting = false;
    dom.submitRequest.textContent = 'Submit request';
    dom.confirmationText.textContent = `Prototype request ${state.draft.submittedRequest.id} completed using the guarded submit sequence. The same request ID would be reused if a document upload needed to be retried.`;
    setStatus('Prototype submission complete.', 'success');
    goToStep('confirmation', { force: true });
  }

  function resetRequest() {
    state.draft = createEmptyDraft();
    state.isSubmitting = false;
    state.maxVisited = 1;
    dom.simulateUploadFailure.checked = false;
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
