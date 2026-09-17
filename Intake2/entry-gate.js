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
    validationMode: 'locked',
    requestTitle: ''
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
      validationMode: 'locked',
      requestTitle: ''
    };
    form.reset();
    const submissionUrlInput = document.querySelector('#submissionUrl');
    const submissionError = document.querySelector('#submissionError');
    if (submissionUrlInput) submissionUrlInput.value = '';
    if (submissionError) submissionError.textContent = '';
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

  function getOrCreateRequestTitle() {
    if (!window.Intake2Access) return '';
    if (!window.Intake2Access.requestTitle) {
      window.Intake2Access.requestTitle = `INT-${Date.now().toString().slice(-8)}`;
    }
    return window.Intake2Access.requestTitle;
  }

  async function callPowerAutomate(flowUrl, email, employeeId) {
    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        employeeId: employeeId,
        requestTitle: 'Access validation',
        fileName: '',
        fileContent: ''
      })
    });

    const body = await readResponseBody(response);
    if (response.status === 200) return { success: true, message: body.message || 'Access validated.' };
    if (response.status === 403) return { success: false, message: body.message || 'User validation failed.' };
    return { success: false, message: body.message || `Power Automate returned HTTP ${response.status}.` };
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

  function installSubmissionPilot() {
    const prototypeTools = document.querySelector('#prototypeTestTools');
    const submitButton = document.querySelector('#submitRequest');
    const workflowShell = document.querySelector('#workflowShell');
    const welcomeScreen = document.querySelector('#welcomeScreen');
    const confirmationScreen = document.querySelector('#confirmationScreen');
    const confirmationText = document.querySelector('#confirmationText');
    const confirmationNote = document.querySelector('.confirmation-note');
    if (!prototypeTools || !submitButton || !workflowShell || !welcomeScreen || !confirmationScreen || !confirmationText) return;

    prototypeTools.insertAdjacentHTML('beforeend', `
      <div class="submission-pilot-connection" id="submissionPilotConnection">
        <label class="access-field runtime-url-field">
          <span>Power Automate submission URL</span>
          <input type="password" name="submissionUrl" id="submissionUrl" autocomplete="off" spellcheck="false" placeholder="Paste the Intake2 Submission Test HTTP URL">
        </label>
        <p>Used only for this pilot submission request. The URL is not retained after a successful test.</p>
        <p class="access-error" id="submissionError" role="alert" aria-live="polite"></p>
      </div>
    `);

    const submissionUrlInput = document.querySelector('#submissionUrl');
    const submissionError = document.querySelector('#submissionError');
    if (!submissionUrlInput || !submissionError) return;

    function setSubmissionError(message = '') {
      submissionError.textContent = message;
      submissionUrlInput.removeAttribute('aria-invalid');
      if (message) submissionUrlInput.setAttribute('aria-invalid', 'true');
    }

    function showConfirmation(requestTitle, body) {
      const itemId = body && body.itemId ? String(body.itemId) : '';
      welcomeScreen.hidden = true;
      workflowShell.hidden = true;
      confirmationScreen.hidden = false;
      confirmationText.textContent = itemId
        ? `SharePoint item ${itemId} created successfully for request ${requestTitle}.`
        : `SharePoint item created successfully for request ${requestTitle}.`;
      if (confirmationNote) confirmationNote.textContent = 'Pilot submission reached SharePoint through Power Automate successfully.';

      const progressItems = Array.from(document.querySelectorAll('#progressNav [data-step]'));
      progressItems.forEach((item) => {
        const isDone = item.dataset.step === 'confirmation';
        item.classList.toggle('is-active', isDone);
        item.classList.toggle('is-complete', !isDone);
        const button = item.querySelector('button');
        if (isDone) button?.setAttribute('aria-current', 'step');
        else button?.removeAttribute('aria-current');
      });

      const mobileLabel = document.querySelector('#mobileProgressLabel');
      const mobileCount = document.querySelector('#mobileProgressCount');
      if (mobileLabel) mobileLabel.textContent = 'Done';
      if (mobileCount) mobileCount.textContent = '7 / 7';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function submitToPowerAutomate(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const submissionUrl = submissionUrlInput.value.trim();
      setSubmissionError('');

      if (!window.Intake2Access?.validated || !window.Intake2Access?.email) {
        setSubmissionError('Requester access is not validated. Return to Start and validate again.');
        return;
      }
      if (!submissionUrl) {
        prototypeTools.open = true;
        setSubmissionError('Paste the Intake2 Submission Test URL before submitting.');
        submissionUrlInput.focus();
        prototypeTools.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!validHttpsUrl(submissionUrl)) {
        prototypeTools.open = true;
        setSubmissionError('Enter a valid HTTPS Power Automate submission URL.');
        submissionUrlInput.focus();
        return;
      }

      const requestTitle = getOrCreateRequestTitle();
      const originalLabel = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting…';

      try {
        const response = await fetch(submissionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: window.Intake2Access?.email || '', requestTitle: requestTitle })
        });
        const body = await readResponseBody(response);
        if (response.status === 200) {
          submissionUrlInput.value = '';
          showConfirmation(requestTitle, body);
          return;
        }
        if (response.status === 500 || !response.ok) {
          setSubmissionError(body.message || `Submission failed with HTTP ${response.status}.`);
          return;
        }
        setSubmissionError(body.message || `Unexpected Power Automate response: HTTP ${response.status}.`);
      } catch (error) {
        console.error('Power Automate submission request failed.');
        setSubmissionError('Unable to reach the submission flow. Check the Submission URL and try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel;
      }
    }

    submitButton.addEventListener('click', submitToPowerAutomate, true);
    submissionUrlInput.addEventListener('input', () => setSubmissionError(''));
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

  installSubmissionPilot();

  window.Intake2AccessGate = {
    validateAccessEntry,
    clearAccess,
    getOrCreateRequestTitle
  };
})();
