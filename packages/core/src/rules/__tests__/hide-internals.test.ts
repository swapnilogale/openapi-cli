import { outdent } from 'outdent';
import { bundleDocument } from '../../bundle'
import { BaseResolver } from '../../resolve';
import { parseYamlToDocument, yamlSerializer } from '../../../__tests__/utils';
import { makeConfig } from './config';

describe('oas3 filter-by-permission: remove internal paths', () => {
  expect.addSnapshotSerializer(yamlSerializer);
  beforeEach(() => {
    delete process.env.FILTER_BY_PERMISSION_PROPERTY;
    delete process.env.FILTER_BY_PERMISSION_VALUE;
  });

  it('should use default values of `permissionProperty` and `permissionValue`', async () => {
    const testDocument = parseYamlToDocument(
      outdent`
        openapi: 3.0.0
        paths:
          /pet:
            x-internal: true
            get:
              operationId: petGet
      `);
    const { bundle: res } = await bundleDocument({
      document: testDocument,
      externalRefResolver: new BaseResolver(),
      config: makeConfig({}, { 'filter-for-permission': 'on' })
    });
    expect(res.parsed).toMatchInlineSnapshot(
    `
    openapi: 3.0.0
    components: {}

    `);
  });

  it('should use environment variables', async () => {
    process.env.FILTER_BY_PERMISSION_PROPERTY = 'x-permission';
    process.env.FILTER_BY_PERMISSION_VALUE = 'guest';
    const testDocument = parseYamlToDocument(
      outdent`
        openapi: 3.0.0
        paths:
          /pet:
            x-permission: guest
            get:
              parameters:
                - $ref: '#/components/parameters/x'
      `);
    const { bundle: res } = await bundleDocument({
      document: testDocument,
      externalRefResolver: new BaseResolver(),
      config: makeConfig({}, { 'filter-for-permission': 'on' })
    });
    expect(res.parsed).toMatchInlineSnapshot(
    `
    openapi: 3.0.0
    components: {}

    `);
  });

  it('should use `permissionProperty` and default value of `permissionValue`', async () => {
    const testDocument = parseYamlToDocument(
      outdent`
        openapi: 3.0.0
        paths:
          /pet:
            x-audience: true
            get:
              parameters:
                - $ref: '#/components/parameters/x'
        components:
          parameters:
            x:
              name: x
      `);

    const { bundle: res } = await bundleDocument({
      document: testDocument,
      externalRefResolver: new BaseResolver(),
      config: makeConfig({}, { 'filter-for-permission': { 'permissionProperty': 'x-audience' } })
    });
    expect(res.parsed).toMatchInlineSnapshot(
    `
    openapi: 3.0.0
    components:
      parameters:
        x:
          name: x

    `);
  });

  it('should use `permissionProperty` and `permissionValue`', async () => {
    const testDocument = parseYamlToDocument(
      outdent`
        openapi: 3.0.0
        paths:
          /pet:
            x-audience: user
            get:
              parameters:
                - $ref: '#/components/parameters/x'
      `);

    const { bundle: res } = await bundleDocument({
      document: testDocument,
      externalRefResolver: new BaseResolver(),
      config: makeConfig({}, { 'filter-for-permission': {
        'permissionProperty': 'x-audience',
        'permissionValue': 'user'
      }})
    });
    expect(res.parsed).toMatchInlineSnapshot(
    `
    openapi: 3.0.0
    components: {}

    `);
  });

  it('should handle node property as array', async () => {
    const testDocument = parseYamlToDocument(
      outdent`
        openapi: 3.0.0
        paths:
          /pet:
            x-audience:
              - user
              - admin
            get:
              parameters:
                - $ref: '#/components/parameters/x'
      `);

      const { bundle: res } = await bundleDocument({
        document: testDocument,
        externalRefResolver: new BaseResolver(),
        config: makeConfig({}, { 'filter-for-permission': {
          'permissionProperty': 'x-audience',
          'permissionValue': 'user'
        }})
      });
      expect(res.parsed).toMatchInlineSnapshot(
      `
      openapi: 3.0.0
      components: {}

      `);
    });

  it('should clean types: Server, Operation, Parameter, PathItem, Example', async () => {
    const testDoc = parseYamlToDocument(
      outdent`
        openapi: 3.1.0
        servers:
          - url: //petstore.swagger.io/v2
            description: Default server
            x-internal: true
        paths:
          /pet:
            get:
              x-internal: true
              operationId: getPet
              parameters:
                - $ref: '#/components/parameters/x'
            put:
              parameters:
                - name: Accept-Language
                  x-internal: true
                  in: header
                  example: en-US
                  required: false
                - name: cookieParam
                  x-internal: true
                  in: cookie
                  description: Some cookie
                  required: true
          /admin:
            x-internal: true
            post:
              parameters:
                - $ref: '#/components/parameters/y'
          /store/order:
            post:
              operationId: placeOrder
              responses:
                '200':
                  description: successful operation
                  content:
                    application/json:
                      examples:
                        response:
                          x-internal: true
                          value: OK
        components:
          parameters:
            x:
              name: x
            y:
              name: y
      `);
      const { bundle: res } = await bundleDocument({
        document: testDoc,
        externalRefResolver: new BaseResolver(),
        config: makeConfig({}, { 'filter-for-permission': 'on' })
      });
      expect(res.parsed).toMatchInlineSnapshot(
      `
      openapi: 3.1.0
      paths:
        /pet:
          put: {}
        /store/order:
          post:
            operationId: placeOrder
            responses:
              '200':
                description: successful operation
                content:
                  application/json: {}
      components:
        parameters:
          x:
            name: x
          'y':
            name: 'y'

      `
      );
  });

  it('should clean types: Schema, Response, RequestBody, MediaType, Callback', async () => {
    const testDoc = parseYamlToDocument(
      outdent`
        openapi: 3.1.0
        paths:
          /pet:
            post:
              summary: test
              requestBody:
                x-internal: true
                content:
                  application/x-www-form-urlencoded:
                    schema:
                      type: object
          /store/order:
            post:
              operationId: storeOrder
              parameters:
                - name: api_key
                  schema:
                    x-internal: true
                    type: string
              responses:
                '200':
                  x-internal: true
                  content:
                    application/json:
                      examples:
                        response:
                          value: OK
              requestBody:
                content:
                  application/x-www-form-urlencoded:
                    x-internal: true
                    schema:
                      type: object
              callbacks:
                orderInProgress:
                  x-internal: true
                  '{$request.body#/callbackUrl}?event={$request.body#/eventName}':
                    servers:
                      - url: //callback-url.path-level/v1
                        description: Path level server
      `);
      const { bundle: res } = await bundleDocument({
        document: testDoc,
        externalRefResolver: new BaseResolver(),
        config: makeConfig({}, { 'filter-for-permission': 'on' })
      });
      expect(res.parsed).toMatchInlineSnapshot(
      `
      openapi: 3.1.0
      paths:
        /pet:
          post:
            summary: test
        /store/order:
          post:
            operationId: storeOrder
            parameters:
              - name: api_key
            requestBody: {}
      components: {}

      `);
  });
});

describe('oas2 hide-x-internal', () => {
  it('should clean types - base test', async () => {
    const testDoc = parseYamlToDocument(
      outdent`
        swagger: '2.0'
        host: api.instagram.com
        paths:
          '/geographies/{geo-id}/media/recent':
            get:
              parameters:
                - description: The geography ID.
                  x-internal: true
                  in: path
                  name: geo-id
                  required: true
                  type: string
                - description: Max number of media to return.
                  x-internal: true
                  format: int32
                  in: query
                  name: count
                  required: false
                  type: integer
              responses:
                '200':
                  x-internal: true
                  description: List of recent media entries.
      `);
    const { bundle: res } = await bundleDocument({
      document: testDoc,
      externalRefResolver: new BaseResolver(),
      config: makeConfig({}, { 'filter-for-permission': 'on' })
    });
    expect(res.parsed).toMatchInlineSnapshot(
    `
    swagger: '2.0'
    host: api.instagram.com
    paths:
      /geographies/{geo-id}/media/recent:
        get: {}

    `
    );
  });
});
