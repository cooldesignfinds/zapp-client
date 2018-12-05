import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';

let importsSchema = OrderedMap();
importsSchema = importsSchema.set(Infinity, objectToOrderedMap({
  description: 'the author\'s username',
  type: 'object',
  additionalProperties: {
    description: 'the generator name and version (i.e latest)',
    type: 'string'
  }
}));

const schema = importsSchema;

export default schema;
