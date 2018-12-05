import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';

let enginesSchema = OrderedMap();
enginesSchema = enginesSchema.set(Infinity, objectToOrderedMap({
  type: 'object',
  properties: {
    engine: {
      description: 'the engine code',
      type: 'code'
    },
    scripts: {
      description: 'external scripts (i.e https://mycdn.com/script.min.js)',
      type: 'array'
    }
  }
}));

const schema = enginesSchema;

export default schema;
