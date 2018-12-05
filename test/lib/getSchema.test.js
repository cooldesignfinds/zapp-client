import assert from 'assert';

import getSchemaProperties from '../../src/lib/getSchemaProperties';
import objectToOrderedMap from '../../src/lib/objectToOrderedMap';

describe('getSchemaProperties', () => {
  /*
  const testSpec = {
    routes: {
      users: {
        post: {
          operationId: 'addUser',
          body: {
            username: 'testuser'
          }
        }
      }
    }
  };
  */

  const testSchema = objectToOrderedMap({
    routes: {
      description: 'the routes',
      required: true,
      type: 'object',
      additionalProperties: {
        description: 'the route name',
        type: 'object',
        additionalProperties: {
          description: 'a method for the route',
          type: 'object',
          properties: {
            operationId: {
              description: 'the operation id of the route/method',
              type: 'string'
            },
            body: {
              description: 'the body of the route/method',
              type: 'object',
              additionalProperties: {
                description: 'a body part of the route/method',
                type: 'object',
                properties: {
                  default: {
                    description: 'a default value for the body part',
                    type: 'string'
                  },
                  required: {
                    description: 'is required?',
                    type: 'boolean'
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  it('should get level 1 schema', () => {
    const actualProperties = getSchemaProperties(testSchema);
    const expectedProperties = [
      {
        description: 'the routes',
        name: 'routes',
        required: true,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 2 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['routes']);
    const expectedProperties = [
      {
        description: 'the route name',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 3 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['routes', 'users']);
    const expectedProperties = [
      {
        description: 'a method for the route',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 4 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['routes', 'users', 'post']);
    const expectedProperties = [
      {
        description: 'the operation id of the route/method',
        name: 'operationId',
        type: 'string'
      },
      {
        description: 'the body of the route/method',
        name: 'body',
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 5 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['routes', 'users', 'post', 'body']);
    const expectedProperties = [
      {
        description: 'a body part of the route/method',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 6 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['routes', 'users', 'post', 'body', 'username']);
    const expectedProperties = [
      {
        description: 'a default value for the body part',
        name: 'default',
        type: 'string'
      },
      {
        description: 'is required?',
        name: 'required',
        type: 'boolean'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });
});
