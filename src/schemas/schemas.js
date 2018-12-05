import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';

function getProperties() {
  const properties = objectToOrderedMap({
    additionalProperties: {
      condition: {
        key: 'type',
        value: 'object'
      },
      description: 'the additional properties of an object',
      properties: getProperties,
      type: 'object'
    },
    description: {
      description: 'the description of the property',
      type: 'string'
    },
    enum: {
      description: 'the enumerable values',
      type: 'array'
    },
    items: {
      condition: {
        key: 'type',
        value: 'array'
      },
      description: 'the items of an array',
      properties: getProperties,
      type: 'object'
    },
    mode: {
      condition: {
        key: 'type',
        value: 'code'
      },
      description: 'mode of code',
      type: 'string'
    },
    properties: {
      condition: {
        key: 'type',
        value: 'object'
      },
      additionalProperties: {
        type: 'object',
        properties: getProperties
      },
      description: 'the properties of an object',
      type: 'object'
    },
    required: {
      description: 'is the property required?',
      type: 'boolean'
    },
    type: {
      description: 'the schema type',
      enum: [
        'array',
        'boolean',
        'number',
        'object',
        'string'
      ],
      type: 'string'
    }
  });
  return properties;
}

let schemasSchema = OrderedMap();
schemasSchema = schemasSchema.set(Infinity, objectToOrderedMap({
  description: 'the schema name (corresponds with a spec name)',
  type: 'object',
  properties: getProperties
}));

const schema = schemasSchema;

export default schema;
