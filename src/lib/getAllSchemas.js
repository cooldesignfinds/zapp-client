import merge from '../lib/merge';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

export default function getAllSchemas(schemas, importsData) {
  const allSchemas = objectToOrderedMap(
    (orderedMapToObject(importsData) || []).reduce((acc, cur) => {
      return merge(acc, cur.schemas);
    }, orderedMapToObject(schemas))
  );
  return allSchemas;
}
