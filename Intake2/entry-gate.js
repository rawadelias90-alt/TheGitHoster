(() => {
  'use strict';

  const form = document.querySelector('#accessForm');
  const startButton = document.querySelector('#startRequest');
  const emailInput = document.querySelector('#accessEmail');
  const employeeIdInput = document.querySelector('#employeeId');
  const errorNode = document.querySelector('#accessError');

  if (!form || !startButton || !emailInput || !employeeIdInput || !errorNode) return;

  window.Intake2Access = {
    email: '',
    employeeId: '',
    validated: false,
    validationMode: 'locked'
  };

  function setError(message = '') {
    errorNode.textContent = message;
    emailInput.removeAttribute('aria-invalid');
    employeeIdInput.removeAttribute('aria-invalid');

    if (!message) return;

    if (!emailInput.value.trim() || !emailInput.validity.valid) emailInput.setAttribute('aria-invalid', 'true');
    if (!employeeIdInput.value.trim()) employeeIdInput.setAttribute('aria-invalid', 'true');
  }

  function clearAccess() {
    window.Intake2Access = {
      email: '',
      employeeId: '',
      validated: false,
      validationMode: 'locked'
    };
    form.reset();
    setError('');
  }

  async function validateAccessEntry() {
    const email = emailInput.value.trim();
    const employeeId = employeeIdInput.value.trim();

    window.Intake2Access.validated = false;
    window.Intake2Access.validationMode = 'locked';
    setError('');

    if (!email) {
      setError('Enter your AECOM email address.');
      emailInput.focus();
      return false;
    }

    if (!emailInput.validity.valid) {
      setError('Enter a valid AECOM email address.');
      emailInput.focus();
      return false;
    }

    if (!employeeId) {
      setError('Enter your Employee ID.');
      employeeIdInput.focus();
      return false;
    }

    /*
      Integration hook for the next phase.
      When Power Automate validation is connected, assign an async function to
      window.Intake2AccessValidator that returns { success: true } for an approved user.
      No endpoint or credential is stored in this repository.
    */
    if (typeof window.Intake2AccessValidator === 'function') {
      const originalLabel = startButton.innerHTML;
      startButton.disabled = true;
      startButton.textContent = 'Checking access…';

      try {
        const result = await window.Intake2AccessValidator({ email, employeeId });
        if (!result || result.success !== true) {
          setError(result && result.message ? result.message : 'Access validation failed.');
          return false;
        }
        window.Intake2Access.validationMode = 'power-automate';
      } catch (error) {
        console.error('Access validation failed.', error);
        setError('Unable to validate access right now. Please try again.');
        return false;
      } finally {
        startButton.disabled = false;
        startButton.innerHTML = originalLabel;
      }
    } else {
      // Current prototype behaviour: validate the required entry fields only.
      // The server-side approved-user check is connected in the next integration step.
      window.Intake2Access.validationMode = 'prototype-local';
    }

    window.Intake2Access.email = email;
    window.Intake2Access.employeeId = employeeId;
    window.Intake2Access.validated = true;
    return true;
  }

  async function handleStartClick(event) {
    if (startButton.dataset.accessBypass === 'true') {
      event.preventDefault();
      queueMicrotask(() => delete startButton.dataset.accessBypass);
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const valid = await validateAccessEntry();
    if (!valid) return;

    startButton.dataset.accessBypass = 'true';
    startButton.click();
  }

  startButton.addEventListener('click', handleStartClick, true);
  form.addEventListener('submit', (event) => event.preventDefault());

  emailInput.addEventListener('input', () => setError(''));
  employeeIdInput.addEventListener('input', () => setError(''));

  document.addEventListener('click', (event) => {
    const progressButton = event.target.closest('[data-progress-target]');
    if (progressButton && progressButton.dataset.progressTarget !== 'welcome' && !window.Intake2Access.validated) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setError('Enter your AECOM email and Employee ID before continuing.');
      document.querySelector('#accessForm')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const newRequest = event.target.closest('#newRequest');
    if (newRequest) {
      event.preventDefault();
      event.stopImmediatePropagation();
      clearAccess();
      document.querySelector('#brandHome')?.click();
    }
  }, true);

  window.Intake2AccessGate = {
    validateAccessEntry,
    clearAccess
  };
})();
