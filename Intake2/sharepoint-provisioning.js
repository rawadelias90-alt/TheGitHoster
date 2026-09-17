(function (root, factory) {
  const dataModel = (typeof module === 'object' && module.exports)
    ? require('./sharepoint-data-model.js')
    : root && root.Intake2SharePointDataModel;
  const api = factory(dataModel);
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.Intake2SharePointProvisioning = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (model) {
  'use strict';

  if (!model) throw new Error('Intake2SharePointDataModel failed to load.');

  const SHAREPOINT_API = '/providers/Microsoft.PowerApps/apis/shared_sharepointonline';
  const VERBOSE_HEADERS = Object.freeze({
    Accept: 'application/json;odata=verbose',
    'Content-Type': 'application/json;odata=verbose'
  });

  function xmlEscape(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&apos;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function fieldSchema(column) {
    const attrs = [
      `Type='${xmlEscape(column.type)}'`,
      `DisplayName='${xmlEscape(column.displayName)}'`,
      `Name='${xmlEscape(column.internalName)}'`,
      `StaticName='${xmlEscape(column.internalName)}'`,
      `Required='${column.required ? 'TRUE' : 'FALSE'}'`
    ];

    if (column.indexed) attrs.push("Indexed='TRUE'");
    if (column.unique) attrs.push("EnforceUniqueValues='TRUE'");
    if (column.type === 'Text') attrs.push("MaxLength='255'");
    if (column.type === 'DateTime') attrs.push(`Format='${column.dateOnly ? 'DateOnly' : 'DateTime'}'`);
    if (column.type === 'Note') attrs.push("NumLines='6'", "RichText='FALSE'");

    const inner = [];
    if (column.type === 'Choice') {
      inner.push(`<CHOICES>${(column.choices || []).map((choice) => `<CHOICE>${xmlEscape(choice)}</CHOICE>`).join('')}</CHOICES>`);
    }
    if (column.defaultValue !== undefined && column.defaultValue !== null) {
      const value = column.type === 'Boolean' ? (column.defaultValue ? '1' : '0') : xmlEscape(column.defaultValue);
      inner.push(`<Default>${value}</Default>`);
    }

    return `<Field ${attrs.join(' ')}>${inner.join('')}</Field>`;
  }

  function createListBody(definition) {
    return {
      __metadata: { type: 'SP.List' },
      Title: definition.title,
      BaseTemplate: definition.template,
      EnableVersioning: Boolean(definition.enableVersioning)
    };
  }

  function createFieldBody(column) {
    return {
      parameters: {
        __metadata: { type: 'SP.XmlSchemaFieldCreationInformation' },
        SchemaXml: fieldSchema(column),
        Options: column.addToDefaultView ? 8 : 0
      }
    };
  }

  function buildColumnSteps(target, columns, kind) {
    return columns.map((column) => ({
      label: `create ${target} column ${column.internalName}`,
      method: 'POST',
      uri: `_api/web/lists/getbytitle('${target}')/fields/createfieldasxml`,
      body: createFieldBody(column),
      kind,
      internalName: column.internalName
    }));
  }

  function buildVerifySteps(target, columns, targetKind) {
    const steps = [{
      label: `verify ${target}`,
      method: 'GET',
      uri: `_api/web/lists/getbytitle('${target}')?$select=Title,EnableVersioning,BaseTemplate`,
      body: null,
      kind: 'verify',
      targetKind
    }];

    columns.forEach((column) => {
      steps.push({
        label: `verify ${target} column ${column.internalName}`,
        method: 'GET',
        uri: `_api/web/lists/getbytitle('${target}')/fields/getbyinternalnameortitle('${column.internalName}')?$select=InternalName,Required,Indexed,EnforceUniqueValues,TypeAsString`,
        body: null,
        kind: 'verify',
        targetKind,
        internalName: column.internalName
      });
    });
    return steps;
  }

  function buildRestSteps(siteUrl) {
    if (!/^https:\/\//i.test(String(siteUrl || ''))) throw new Error('A valid HTTPS SharePoint site URL is required.');

    const steps = [
      {
        label: `create ${model.requestsList.title}`,
        method: 'POST',
        uri: '_api/web/lists',
        body: createListBody(model.requestsList),
        kind: 'structure'
      },
      {
        label: `create ${model.documentsLibrary.title}`,
        method: 'POST',
        uri: '_api/web/lists',
        body: createListBody(model.documentsLibrary),
        kind: 'structure'
      },
      ...buildColumnSteps(model.requestsList.title, model.requestsList.columns, 'request-column'),
      ...buildColumnSteps(model.documentsLibrary.title, model.documentsLibrary.columns, 'document-column'),
      ...buildVerifySteps(model.requestsList.title, model.requestsList.columns, 'requests-list'),
      ...buildVerifySteps(model.documentsLibrary.title, model.documentsLibrary.columns, 'documents-library')
    ];

    return steps;
  }

  function safeActionName(label, index) {
    const clean = String(label).replace(/[^A-Za-z0-9_]/g, '_').replace(/_+/g, '_');
    return `S${String(index).padStart(3, '0')}_${clean}`.slice(0, 80);
  }

  function buildFlowDefinition(siteUrl) {
    const steps = buildRestSteps(siteUrl);
    const actions = {};
    let previous = null;
    let inVerification = false;

    steps.forEach((step, index) => {
      const name = safeActionName(step.label, index + 1);
      const parameters = {
        dataset: siteUrl,
        'parameters/method': step.method,
        'parameters/uri': step.uri,
        'parameters/headers': VERBOSE_HEADERS
      };
      if (step.body !== null && step.body !== undefined) parameters['parameters/body'] = JSON.stringify(step.body);

      if (step.kind === 'verify') inVerification = true;
      const runAfter = previous
        ? { [previous]: inVerification ? ['Succeeded'] : ['Succeeded', 'Failed'] }
        : {};

      actions[name] = {
        type: 'OpenApiConnection',
        description: step.label,
        runAfter,
        inputs: {
          host: {
            connectionName: 'shared_sharepointonline',
            operationId: 'HttpRequest',
            apiId: SHAREPOINT_API
          },
          parameters,
          authentication: "@parameters('$authentication')"
        }
      };
      previous = name;
    });

    return {
      $schema: 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
      contentVersion: '1.0.0.0',
      parameters: {
        $authentication: { defaultValue: {}, type: 'SecureObject' },
        $connections: { defaultValue: {}, type: 'Object' }
      },
      triggers: {
        manual: {
          type: 'Request',
          kind: 'Button',
          inputs: { schema: { type: 'object', properties: {} } }
        }
      },
      actions,
      outputs: {}
    };
  }

  return Object.freeze({
    SHAREPOINT_API,
    VERBOSE_HEADERS,
    fieldSchema,
    buildRestSteps,
    buildFlowDefinition
  });
});
