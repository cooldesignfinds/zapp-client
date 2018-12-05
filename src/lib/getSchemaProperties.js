import { OrderedMap } from 'immutable';

// import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from './orderedMapToObject';
import orderedMapToKeys from './orderedMapToKeys';

function getSchemaPropertiesRecursive(
  properties = OrderedMap(),
  objectPath = [],
  allProperties = OrderedMap()
) {
  // console.log('============================');
  // console.log('getSchemaPropertiesRecursive');
  // console.log(orderedMapToObject(properties));
  // console.log(objectPath);

  if (objectPath.length === 0) {
    return properties;
  }

  let childProperties = OrderedMap();

  let propertyName = '';
  if (properties.has(objectPath[0])) {
    propertyName = objectPath[0];
  } else if (properties.has(Infinity)) {
    propertyName = Infinity;
  }

  // console.log('propertyName');
  // console.log(propertyName);

  if (propertyName.length > 0 || propertyName === Infinity) {
    const value = properties.get(propertyName);
    if (typeof value === 'string') {
      const linkOrderedMap = allProperties.getIn(value.replace(/^\//, '').split('/'));
      if (linkOrderedMap.has('properties')) {
        childProperties = linkOrderedMap.get('properties');
      }
      if (linkOrderedMap.has('additionalProperties')) {
        childProperties = childProperties.set(Infinity, linkOrderedMap.get('additionalProperties'));
      }
    }
    if (properties.hasIn([propertyName, 'properties'])) {
      childProperties = properties.getIn([propertyName, 'properties']);
    }
    if (properties.hasIn([propertyName, 'additionalProperties'])) {
      childProperties = childProperties.set(Infinity, properties.getIn([propertyName, 'additionalProperties']));
    }
  }
  if (childProperties instanceof Function) {
    childProperties = childProperties();
  }
  childProperties = childProperties.map((prop) => {
    if (prop instanceof Function) {
      return prop();
    }
    return prop;
  });

  // console.log('childProperties');
  // console.log(orderedMapToObject(childProperties));

  return getSchemaPropertiesRecursive(childProperties, objectPath.slice(1), allProperties);
}

export default function getSchemaProperties(
  properties = OrderedMap(),
  objectPath = [],
  ignoreProperties = []
) {
  // console.log('getSchemaProperties');
  // console.log(properties);
  // console.log(orderedMapToObject(properties));
  // console.log('objectPath', objectPath);
  // console.log('ignoreProperties', ignoreProperties);
  // console.log('searchText', searchText);
  // console.log('onlyTypes', onlyTypes);

  const targetSchema = getSchemaPropertiesRecursive(properties, objectPath, properties);

  // console.log('targetSchema');
  // console.log(JSON.stringify(orderedMapToObject(targetSchema), 0, 2));

  const schemaProperties = orderedMapToKeys(targetSchema)
    .filter((name) => {
      if (ignoreProperties.includes(name)) {
        return false;
      }
      return true;
    })
    .map((name) => {
      const schema = targetSchema.get(name);

      const data = {
        name
      };

      if (!schema || !schema.has) {
        const linkData = orderedMapToObject(properties.getIn(schema.replace(/^\//, '').split('/')));
        return {
          ...data,
          ...linkData
        };
      }

      if (schema.has('description')) {
        data.description = schema.get('description');
      }
      if (schema.has('enum')) {
        data.enum = orderedMapToObject(schema.get('enum'));
      }
      if (schema.has('required')) {
        data.required = schema.get('required');
      }
      if (schema.has('type')) {
        data.type = schema.get('type');
      }

      return data;
    });

  // console.log('schemaProperties');
  // console.log(JSON.stringify(schemaProperties, 0, 2));

  return schemaProperties;
}
