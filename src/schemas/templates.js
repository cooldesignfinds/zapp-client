import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';

let templatesSchema = OrderedMap();
templatesSchema = templatesSchema.set(Infinity, objectToOrderedMap({
  description: 'the template name (i.e readme, model, view)',
  type: 'object',
  properties: {
    template: {
      description: 'the template',
      type: 'code'
    }
  }
}));

const schema = templatesSchema;

export default schema;
