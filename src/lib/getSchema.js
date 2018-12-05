import { OrderedMap } from 'immutable';

import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

function azSort(a, b) {
  if (a < b) {
    return -1;
  } else if (b > a) {
    return 1;
  }
  return 0;
}

function getSchemaObject(
  schemas,
  fullSchemaPath,
  schemaPath,
  isAdditional = false,
  specKeys = [],
  filterTypes = [],
  items = OrderedMap(),
  schemaText
) {
  // console.log('getSchemaObject()');
  // console.log('schemas');
  // console.log(schemas);
  // console.log('fullSchemaPath');
  // console.log(fullSchemaPath);
  // console.log('schemaPath');
  // console.log(schemaPath);
  // console.log('specKeys');
  // console.log(specKeys);
  // console.log('isAdditional');
  // console.log(isAdditional);
  // console.log('items:');
  // console.log(orderedMapToObject(items));

  if (schemaPath.length === 0) {
    // console.log('finalizing');
    return Object.keys(schemas)
      .filter((key) => {
        // console.log('key');
        // console.log(key);
        if (filterTypes.length && !filterTypes.includes(schemas[key].type)) {
          return false;
        }
        if (key !== '*' && schemaText && !key.toLowerCase().includes(schemaText.toLowerCase())) {
          return false;
        }
        if (!items.hasIn((specKeys || []).concat(key))) {
          return true;
        }
        return false;
      })
      .sort(azSort)
      .map((key) => {
        const name = schemas[key].name || key;
        const searchName = schemaText ? name.replace(new RegExp(`(${schemaText})`, 'ig'), '<b>$1</b>') : name;
        const schema = {
          name,
          searchName
        };
        if (schemas[key].description) {
          schema.description = schemas[key].description;
        }
        if (schemas[key].disabled) {
          schema.disabled = schemas[key].disabled;
        }
        if (schemas[key].mode) {
          schema.mode = schemas[key].mode;
        }
        if (schemas[key].type) {
          schema.type = schemas[key].type;
        }
        return schema;
      });
  }
  let schema = isAdditional ? schemas : schemas[schemaPath[0]];
  if (!schema && schemas['*']) {
    schema = schemas['*'];
  }
  // console.log('schema');
  // console.log(schema);
  if (!schema) {
    return [];
  }
  // console.log('1');
  if (schema.type === 'array') {
    // console.log(schema.items);
    return getSchemaObject(
      schema.items,
      fullSchemaPath,
      schemaPath.slice(1),
      true,
      specKeys,
      filterTypes,
      items,
      schemaText
    );
  }

  // console.log('2');

  const props = {};
  if (schema.properties && Object.keys(schema.properties).length) {
    // console.log('3');
    Object.keys(schema.properties).forEach((key) => {
      const prop = schema.properties[key];
      if (!prop.condition || items.getIn(fullSchemaPath.concat(prop.condition.key)) === prop.condition.value) {
        props[key] = prop;
      } else {
        // console.log(items.getIn(schemaPath.concat(prop.condition.key)));
        props[key] = {
          ...prop,
          disabled: true
        };
      }
    });
  }
  // console.log('props 1:');
  // console.log(props);
  if (schema.additionalProperties && Object.keys(schema.additionalProperties).length) {
    // console.log('4');
    props['*'] = {
      ...schema.additionalProperties,
      name: schemaText
    };
  }

  // console.log('props 2:');
  // console.log(props);

  if (!Object.keys(props).length) {
    return [];
  }

  return getSchemaObject(
    props,
    fullSchemaPath,
    schemaPath.slice(1),
    false,
    specKeys,
    filterTypes,
    items,
    schemaText
  );
}

function getMap(schemasMap, parentKeys, level = 0, maxLevel = 5, specKeys, items, fullSchemaPath) {
  // console.log('getMap()');
  // console.log(level);
  // console.log(maxLevel);
  // console.log(orderedMapToObject(schemasMap));
  // console.log(parentKeys);
  // console.log(specKeys);

  if (level >= maxLevel) {
    return schemasMap;
  }
  let newSchemasMap = OrderedMap();
  if (schemasMap.has('*')) {
    if (parentKeys.length) {
      parentKeys.forEach((parentKey) => {
        newSchemasMap = newSchemasMap.set(
          parentKey, schemasMap.get('*')
        );
      });
    } else {
      newSchemasMap = schemasMap.get('*');
    }
  } else {
    newSchemasMap = schemasMap;
  }

  // console.log(specKeys.slice(0, level + 2).join('/'));
  // console.log(fullSchemaPath.join('/'));

  // TODO: fix
  // if (specKeys.slice(0, level + 2).join('/') !== fullSchemaPath.join('/')) {
  //   return newSchemasMap;
  // }

  // console.log('orderedMapToObject(newSchemasMap)');
  // console.log(orderedMapToObject(newSchemasMap));
  newSchemasMap = newSchemasMap
    .map((value) => {
      let newValue = value;
      if (typeof value === 'function') {
        newValue = objectToOrderedMap(value());
      }
      // console.log('newValue');
      // console.log(newValue);
      if (OrderedMap.isOrderedMap(newValue)) {
        // console.log([...newValue.keys()]);
        const newSubValue = getMap(newValue, [...newSchemasMap.keys()], level + 1, maxLevel, specKeys, items, fullSchemaPath);
        // console.log('newSubValue');
        // console.log(orderedMapToObject(newSubValue));
        return newSubValue;
      }
      return value;
    });
  return newSchemasMap;
}

export default function getSchema(
  schemasMap,
  schemaPath,
  specKeys = [],
  filterTypes = [],
  parentKeys = [],
  items = OrderedMap(),
  schemaText
) {
  // console.log('\n\ngetSchema()');
  // console.log('schemaPath', schemaPath);
  // console.log('specKeys', specKeys);
  // console.log('schemaText', schemaText);

  // TODO: fix
  // const wildSchemasMap = getMap(schemasMap, parentKeys, 0, schemaPath.length, specKeys, items, schemaPath);
  const wildSchemasMap = getMap(schemasMap, parentKeys, 0, 5, specKeys, items, schemaPath);

  const schemas = orderedMapToObject(wildSchemasMap);
  // console.log('schemas');
  // console.log(schemas);

  if (!schemaPath.length) {
    return Object.keys(schemas)
      .filter((key) => {
        if (filterTypes.length && !filterTypes.includes(schemas[key].type)) {
          return false;
        }
        return !specKeys.includes(key);
      })
      .sort(azSort)
      .map((key) => {
        const schema = {
          name: key
        };
        if (schemas[key].description) {
          schema.description = schemas[key].description;
        }
        if (schemas[key].type) {
          schema.type = schemas[key].type;
        }
        return schema;
      });
  }
  return getSchemaObject(
    schemas,
    schemaPath,
    schemaPath,
    false,
    specKeys,
    filterTypes,
    items,
    schemaText
  );
}
