import _ from 'lodash';
import Bluebird from 'bluebird';
import { OrderedMap } from 'immutable';
import { GeneratorAPI } from '@zappjs/sdk';
import yaml from 'js-yaml';

import action from '../lib/action';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import merge from '../lib/merge';

function openProject({
  data,
  dispatch
}) {
  const code = {};
  data.codeFiles.forEach((key) => {
    _.set(code, key.split('/'), '');
  });
  const configs = data.configs ? (yaml.safeLoad(atob(data.configs)) || {}) : {};
  const generators = data.generators ? (yaml.safeLoad(atob(data.generators)) || {}) : {};
  const meta = data.meta ? (yaml.safeLoad(atob(data.meta)) || {}) : {};
  const path = data.path;
  let schemas = data.schemas ? (yaml.safeLoad(atob(data.schemas)) || {}) : {};
  const specs = data.specs ? (yaml.safeLoad(atob(data.specs)) || {}) : {};
  const templates = data.templates ? (yaml.safeLoad(atob(data.templates)) || {}) : {};

  dispatch({
    type: 'LOAD_PROJECT_REQ'
  });

  const generatorIds = Object.keys(generators)
    .filter(name => !!generators[name].id)
    .map((name) => {
      const generator = generators[name];
      return generator.id;
    });

  return Bluebird.map(generatorIds, (generatorId) => {
    return GeneratorAPI
      .get({
        params: {
          id: generatorId
        }
      })
      .then(({ generator }) => generator);
  })
    .then((generatorsWithSchemas) => {
      let generatorSchemas = {};
      generatorsWithSchemas.forEach((generator) => {
        generatorSchemas = merge(generatorSchemas, generator.schemas);
      });
      schemas = merge(schemas, generatorSchemas);

      const metaMap = objectToOrderedMap(meta);

      dispatch({
        type: 'LOAD_PROJECT_RES',
        name: path,
        code: objectToOrderedMap(code, OrderedMap(), [], true),
        configs: objectToOrderedMap(configs, metaMap.get('configs')),
        meta: metaMap,
        path: data.path,
        generators: objectToOrderedMap(generators, metaMap.get('generators')),
        projectType: (configs.project || {}).type,
        schemas: objectToOrderedMap(schemas, metaMap.get('schemas')),
        specs: objectToOrderedMap(specs, metaMap.get('specs')),
        templates: objectToOrderedMap(templates, metaMap.get('templates'))
      });
    })
    .catch((error) => {
      dispatch({
        type: 'LOAD_PROJECT_ERR',
        error: error.message
      });
    });
}

export default action(openProject);
