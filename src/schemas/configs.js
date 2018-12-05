import objectToOrderedMap from '../lib/objectToOrderedMap';

const configsSchema = objectToOrderedMap({
  files: {
    description: 'The files to generate',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        engine: {
          description: 'The template engine to use (handlebars, json, yaml, pug)',
          type: 'string'
        },
        mapping: {
          description: 'Mapping from specs to templates',
          type: 'object',
          additionalProperties: {
            description: 'The data mapped to the template',
            type: 'string'
          }
        },
        schema: {
          description: 'The schema to use for the generated file',
          type: 'string'
        },
        template: {
          description: 'The template to use for the generated file',
          type: 'string'
        }
      }
    }
  },
  project: {
    type: 'object',
    properties: {
      id: {
        description: 'the id of the published project',
        type: 'string'
      },
      type: {
        description: 'the type of project (app or generator)',
        type: 'string'
      }
    }
  }
});

const schema = configsSchema;

export default schema;
