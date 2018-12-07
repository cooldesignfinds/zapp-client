import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';

let importsSchema = OrderedMap();
importsSchema = importsSchema.set(Infinity, objectToOrderedMap({
  description: 'the hostname (ie. github.com)',
  type: 'object',
  additionalProperties: {
    description: 'the author (ie. zappjs)',
    type: 'object',
    additionalProperties: {
      description: 'the repo (ie. zapp-generator-readme)',
      type: 'object',
      properties: {
        path: {
          description: 'a local path',
          type: 'string'
        },
        version: {
          description: 'the repo version (ie. master)',
          type: 'string'
        }
      }
    }
  }
}));

const schema = importsSchema;

export default schema;
