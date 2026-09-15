(() => {
  'use strict';

  const form = document.querySelector('#accessForm');
  const startButton = document.querySelector('#startRequest');
  const emailInput = document.querySelector('#accessEmail');
  const employeeIdInput = document.querySelector('#employeeId');
  const flowUrlInput = document.querySelector('#flowUrl');
  const errorNode = document.querySelector('#accessError');

  if (!form || !startButton || !emailInput || !employeeIdInput || !flowUrlInput || !errorNode) return;

  window.Intake2Access = {
    email: '',
    employeeId: '',
    validated: false,
    validationMode: 'locked'
  };

  function setError(message = '', target = '') {
    errorNode.textContent = message;
    emailInput.removeAttribute('aria-invalid');
    employeeIdInput.removeAttribute('aria-invalid');
    flowUrlInput.removeAttribute('aria-invalid');

    if (!message) return;

    if (target === 'email') emailInput.setAttribute('aria-invalid', 'true');
    if (target === 'employeeId') employeeIdInput.setAttribute('aria-invalid', 'true');
    if (target === 'flowUrl') flowUrlInput.setAttribute('aria-invalid', 'true');
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

  function validHttpsUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async function readResponseBody(response) {
    try {
      const text = await response.text();
      if (!text) return {};
      try {
        return JSON.parse(text);
      } catch {
        return { message: text };
      }
    } catch {
      return {};
    }
  }

  async function callPowerAutomate(flowUrl, email, employeeId) {
    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        employeeId: employeeId,
        requestTitle: 'Access validation',
        fileName: '',
        fileContent: ''
      })
    });

    const body = await readResponseBody(response);

    if (response.status === 200) {
      return { success: true, message: body.message || 'Access validated.' };
    }

    if (response.status === 403) {
      return { success: false, message: body.message || 'User validation failed.' };
    }

    return {
      success: false,
      message: body.message || `Power Automate returned HTTP ${response.status}.`
    };
  }

  async function validateAccessEntry() {
    const email = emailInput.value.trim();
    const employeeId = employeeIdInput.value.trim();
    const flowUrl = flowUrlInput.value.trim();

    window.Intake2Access.validated = false;
    window.Intake2Access.validationMode = 'locked';
    setError('');

    if (!email) {
      setError('Enter your AECOM email address.', 'email');
      emailInput.focus();
      return false;
    }

    if (!emailInput.validity.valid) {
      setError('Enter a valid AECOM email address.', 'email');
      emailInput.focus();
      return false;
    }

    if (!employeeId) {
      setError('Enter your Employee ID.', 'employeeId');
      employeeIdInput.focus();
      return false;
    }

    if (!flowUrl) {
      setError('Open Test connection setup and paste the Power Automate validation URL.', 'flowUrl');
      flowUrlInput.closest('details')?.setAttribute('open', '');
      flowUrlInput.focus();
      return false;
    }

    if (!validHttpsUrl(flowUrl)) {
      setError('Enter a valid HTTPS Power Automate URL.', 'flowUrl');
      flowUrlInput.closest('details')?.setAttribute('open', '');
      flowUrlInput.focus();
      return false;
    }

    const originalLabel = startButton.innerHTML;
    startButton.disabled = true;
    startButton.textContent = 'Checking access…';

    try {
      const result = await callPowerAutomate(flowUrl, email, employeeId);
      if (!result.success) {
        setError(result.message || 'User validation failed.');
        return false;
      }

      window.Intake2Access.email = email;
      window.Intake2Access.employeeId = employeeId;
      window.Intake2Access.validated = true;
      window.Intake2Access.validationMode = 'power-automate';

      // Minimize exposure after a successful validation. The endpoint is not retained.
      flowUrlInput.value = '';
      return true;
    } catch (error) {
      console.error('Power Automate access validation request failed.');
      setError('Unable to reach Power Automate. Check the Flow URL and try again.');
      return false;
    } finally {
      startButton.disabled = false;
      startButton.innerHTML = originalLabel;
    }
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
  flowUrlInput.addEventListener('input', () => setError(''));

  document.addEventListener('click', (event) => {
    const progressButton = event.target.closest('[data-progress-target]');
    if (progressButton && progressButton.dataset.progressTarget !== 'welcome' && !window.Intake2Access.validated) {
      event.preventDefault();
      event.stopImmediatePropagation();
      setError('Validate your AECOM email and Employee ID before continuing.');
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
