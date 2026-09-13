(() => {
  'use strict';

  const R = window.IntakeRequirements;
  if (!R) return;

  window.INTAKE2_TEST_MODE = true;

  // Inline, Safari-safe hero fallback. The image bytes are embedded as text
  // so the prototype does not depend on a separately uploaded binary asset.
  const HERO_DATA_URI = 'data:image/webp;base64,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...';
  const heroImage = document.querySelector('.hero-visual img');
  if (heroImage) {
    heroImage.src = HERO_DATA_URI;
    heroImage.removeAttribute('srcset');
  }

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
