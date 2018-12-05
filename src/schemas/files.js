import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';

let filesSchema = OrderedMap();
filesSchema = filesSchema.set(Infinity, objectToOrderedMap({
  type: 'object',
  properties: {
    engine: {
      description: 'The template engine to use',
      type: 'string',
      enum: [
        'handlebars',
        'json',
        'plist',
        'yaml'
      ]
    },
    iterator: {
      description: 'The spec to iterate through',
      type: 'string'
    },
    filename: {
      type: 'object',
      properties: {
        engine: {
          type: 'string'
        },
        mapping: {
          type: 'object'
        },
        template: {
          type: 'string'
        }
      }
    },
    mapping: {
      description: 'Mapping from specs to templates',
      type: 'object',
      additionalProperties: {
        description: 'the spec mapped to the template (i.e /app/name)',
        type: 'string'
      }
    },
    // schema: {
    //   description: 'The schema to use for the generated file',
    //   type: 'string'
    // },
    template: {
      description: 'The template to use for the generated file',
      type: 'string'
    }
  }
}));

const schema = filesSchema;

export default schema;
