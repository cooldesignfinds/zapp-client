import assert from 'assert';

import getSchemaProperties from '../../src/lib/getSchemaProperties';
import objectToOrderedMap from '../../src/lib/objectToOrderedMap';

describe('getSchemaProperties w/ functions', () => {
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

  function getProperties() {
    return objectToOrderedMap({
      description: 'a person',
      type: 'object',
      additionalProperties: getProperties
    });
  }

  const testSchema = objectToOrderedMap({
    tableOfContents: {
      description: 'table of contents',
      required: true,
      type: 'object',
      additionalProperties: getProperties
    }
  });

  it('should get level 1 schema', () => {
    const actualProperties = getSchemaProperties(testSchema);
    const expectedProperties = [
      {
        description: 'table of contents',
        name: 'tableOfContents',
        required: true,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 2 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['tableOfContents']);
    const expectedProperties = [
      {
        description: 'a person',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 3 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['tableOfContents', '1']);
    const expectedProperties = [
      {
        description: 'a person',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 4 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['tableOfContents', '1', '1.1']);
    const expectedProperties = [
      {
        description: 'a person',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 5 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['tableOfContents', '1', '1.1', '1.1.1']);
    const expectedProperties = [
      {
        description: 'a person',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });

  it('should get level 6 schema', () => {
    const actualProperties = getSchemaProperties(testSchema, ['tableOfContents', '1', '1.1', '1.1.1', '1.1.1.1']);
    const expectedProperties = [
      {
        description: 'a person',
        name: Infinity,
        type: 'object'
      }
    ];
    assert.deepEqual(actualProperties, expectedProperties);
  });
});
