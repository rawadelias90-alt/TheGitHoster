(() => {
  'use strict';

  const R = window.IntakeRequirements;
  if (!R) return;

  window.INTAKE2_TEST_MODE = true;

  const optionalize = (items) => {
    (items || []).forEach((item) => {
      if (!item || typeof item !== 'object') return;
      if ('required' in item) item.required = false;
      if ('requiredWhen' in item) item.requiredWhen = null;
    });
  };

  optionalize(R.candidateFields);
  optionalize(R.mainDocuments);
  optionalize(R.educationFields);
  optionalize(R.educationDocuments);
  optionalize(R.additionalDocuments);

  (R.serviceTypes || []).forEach((service) => {
    const route = R.getRoute && R.getRoute(service.routeId);
    if (!route) return;
    optionalize(route.documents);
    if (route.specialHire) {
      optionalize(route.specialHire.documents);
      optionalize(route.specialHire.confirmations);
    }
  });

  function dispatchChange(control) {
    if (!control) return;
    control.checked = true;
    control.dispatchEvent(new Event('change', { bubbles: true }));
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#nextButton')) return;

    const activeStep = document.querySelector('#progressNav li.is-active')?.dataset.step;
    const host = document.querySelector('#screenHost');
    if (!host) return;

    if (activeStep === 'service' && !host.querySelector('input[name="serviceType"]:checked')) {
      dispatchChange(host.querySelector('input[name="serviceType"]'));
    }

    if (activeStep === 'route' && !host.querySelector('input[name="caseConfirmation"]:checked')) {
      dispatchChange(host.querySelector('input[name="caseConfirmation"]'));
    }

    if (activeStep === 'education' && !host.querySelector('input[name="equivalencyAvailable"]:checked')) {
      dispatchChange(host.querySelector('input[name="equivalencyAvailable"]'));
    }
  }, true);

  const cleanTestUI = () => {
    document.querySelectorAll('.required-mark').forEach((node) => node.remove());

    document.querySelectorAll('.requirement-tag.is-required').forEach((node) => {
      node.classList.remove('is-required');
      node.classList.add('is-optional');
      if (node.textContent !== 'Optional for testing') node.textContent = 'Optional for testing';
    });

    document.querySelectorAll('.section-intro span').forEach((node) => {
      if (node.textContent.trim() === 'Fields marked * are required.') {
        node.textContent = 'All fields are optional in prototype test mode.';
      }
    });

    const status = document.querySelector('#screenStatus');
    if (status && /required/i.test(status.textContent) && status.textContent !== 'Test mode') {
      status.textContent = 'Test mode';
    }

    const badge = document.querySelector('#readinessBadge');
    if (badge && badge.textContent !== 'Test mode') badge.textContent = 'Test mode';

    const missing = document.querySelector('#missingPreview');
    if (missing && !missing.hidden) missing.hidden = true;
  };

  document.addEventListener('DOMContentLoaded', () => {
    cleanTestUI();
    const observer = new MutationObserver(cleanTestUI);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
