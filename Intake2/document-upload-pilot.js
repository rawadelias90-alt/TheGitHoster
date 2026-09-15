(() => {
  'use strict';

  function validHttpsUrl(value) {
    try {
      return new URL(value).protocol === 'https:';
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

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error || new Error('Unable to read the selected file.'));
      reader.onload = () => {
        const value = String(reader.result || '');
        const comma = value.indexOf(',');
        resolve(comma >= 0 ? value.slice(comma + 1) : value);
      };
      reader.readAsDataURL(file);
    });
  }

  function installDocumentUploadPilot() {
    const prototypeTools = document.querySelector('#prototypeTestTools');
    if (!prototypeTools || document.querySelector('#documentUploadPilot')) return;

    prototypeTools.insertAdjacentHTML('beforeend', `
      <div class="submission-pilot-connection" id="documentUploadPilot">
        <strong>Document Upload Test</strong>
        <p>Upload one small dummy PDF through the dedicated Power Automate document flow.</p>
        <label class="access-field runtime-url-field">
          <span>Power Automate document upload URL</span>
          <input type="password" name="documentUploadUrl" id="documentUploadUrl" autocomplete="off" spellcheck="false" placeholder="Paste the Intake2 Document Upload Test HTTP URL">
        </label>
        <label class="access-field">
          <span>Test file (PDF, max 2 MB)</span>
          <input type="file" id="documentUploadFile" accept=".pdf,application/pdf">
        </label>
        <button class="button button-secondary" type="button" id="uploadTestDocument">Upload test document</button>
        <p class="field-helper" id="documentUploadResult" role="status" aria-live="polite"></p>
      </div>
    `);

    const urlInput = document.querySelector('#documentUploadUrl');
    const fileInput = document.querySelector('#documentUploadFile');
    const uploadButton = document.querySelector('#uploadTestDocument');
    const resultNode = document.querySelector('#documentUploadResult');
    if (!urlInput || !fileInput || !uploadButton || !resultNode) return;

    const maxBytes = 2 * 1024 * 1024;
    let pendingRequestTitle = '';

    function setResult(message = '', isError = false) {
      resultNode.textContent = message;
      resultNode.className = isError ? 'access-error' : 'field-helper';
      urlInput.removeAttribute('aria-invalid');
      fileInput.removeAttribute('aria-invalid');
    }

    async function uploadTestDocument() {
      const documentUploadUrl = urlInput.value.trim();
      const file = fileInput.files && fileInput.files[0];
      setResult('');

      if (!documentUploadUrl) {
        setResult('Paste the Intake2 Document Upload Test URL before uploading.', true);
        urlInput.setAttribute('aria-invalid', 'true');
        urlInput.focus();
        return;
      }

      if (!validHttpsUrl(documentUploadUrl)) {
        setResult('Enter a valid HTTPS Power Automate document upload URL.', true);
        urlInput.setAttribute('aria-invalid', 'true');
        urlInput.focus();
        return;
      }

      if (!file) {
        setResult('Choose the dummy PDF before uploading.', true);
        fileInput.setAttribute('aria-invalid', 'true');
        fileInput.focus();
        return;
      }

      if (file.size > maxBytes) {
        setResult('For this pilot, choose a file that is 2 MB or smaller.', true);
        fileInput.setAttribute('aria-invalid', 'true');
        return;
      }

      const requestTitle = pendingRequestTitle || `DOC-${Date.now().toString().slice(-8)}`;
      pendingRequestTitle = requestTitle;
      const originalLabel = uploadButton.textContent;
      uploadButton.disabled = true;
      uploadButton.textContent = 'Uploading…';

      try {
        const fileContent = await fileToBase64(file);
        const response = await fetch(documentUploadUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestTitle: requestTitle,
            fileName: file.name,
            fileContent: fileContent
          })
        });

        const body = await readResponseBody(response);

        if (response.status === 200) {
          const storedFileName = body.storedFileName || `${requestTitle}__${file.name}`;
          setResult(`Upload successful: ${storedFileName}`);
          urlInput.value = '';
          fileInput.value = '';
          pendingRequestTitle = '';
          return;
        }

        if (response.status === 500 || !response.ok) {
          setResult(body.message || `Document upload failed with HTTP ${response.status}.`, true);
          return;
        }

        setResult(body.message || `Unexpected Power Automate response: HTTP ${response.status}.`, true);
      } catch (error) {
        console.error('Power Automate document upload request failed.');
        setResult('Unable to reach the document upload flow. Check the URL and try again.', true);
      } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = originalLabel;
      }
    }

    uploadButton.addEventListener('click', uploadTestDocument);
    urlInput.addEventListener('input', () => setResult(''));
    fileInput.addEventListener('change', () => {
      pendingRequestTitle = '';
      setResult('');
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#newRequest')) return;
      urlInput.value = '';
      fileInput.value = '';
      pendingRequestTitle = '';
      setResult('');
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installDocumentUploadPilot, { once: true });
  } else {
    installDocumentUploadPilot();
  }
})();
