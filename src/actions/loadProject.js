import { OrderedMap } from 'immutable';
import { GeneratorAPI } from '@zappjs/sdk';

import getItemPathParts from '../lib/getItemPathParts';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';
import loadImports from '../lib/loadImports';

import selectPaneTreeItem from './selectPaneTreeItem';
import setPaneType from './setPaneType';

function loadProject(req, generate) {
  document.title = `${req.name} | latest | Editor | ZappJS`;

  return async (dispatch) => {
    try {
      dispatch({
        type: 'LOAD_PROJECT_REQ',
        name: req.name,
        user: req.user,
        version: req.version,
        configuration: req.configuration
      });

      const { generator } = await GeneratorAPI.get({
        params: {
          name: req.name,
          user: req.user,
          version: req.version,
          configuration: req.configuration
        }
      });

      const workingCopyStorage = localStorage.getItem(`projects/${generator.id}`);

      const workingCopy = workingCopyStorage ? JSON.parse(workingCopyStorage) : null;
      const workingCopyMeta = workingCopy
        ? objectToOrderedMap(workingCopy.meta || {})
        : OrderedMap();
      const workingCopyMaps = workingCopy ? {
        code: objectToOrderedMap(workingCopy.code || {}, OrderedMap(), [], true),
        configs: objectToOrderedMap(workingCopy.configs || {}, workingCopyMeta.get('configs')),
        engines: objectToOrderedMap(workingCopy.engines || {}, workingCopyMeta.get('engines')),
        files: objectToOrderedMap(workingCopy.files || {}, workingCopyMeta.get('files')),
        generators: objectToOrderedMap(workingCopy.generators || {}, workingCopyMeta.get('generators')),
        imports: objectToOrderedMap(workingCopy.imports || {}, workingCopyMeta.get('imports')),
        meta: workingCopyMeta,
        schemas: objectToOrderedMap(workingCopy.schemas || {}, workingCopyMeta.get('schemas')),
        specs: objectToOrderedMap(workingCopy.specs || {}, workingCopyMeta.get('specs')),
        templates: objectToOrderedMap(workingCopy.templates || {}, workingCopyMeta.get('templates'))
      } : {};

      const remoteCopy = {
        code: generator.code || {},
        configs: generator.configs || {},
        engines: generator.engines || {},
        files: generator.files || {},
        generators: generator.generators || {},
        imports: generator.imports || {},
        meta: generator.meta || {},
        schemas: generator.schemas || {},
        specs: generator.specs || {},
        templates: generator.remplates || {}
      };
      const remoteCopyMeta = objectToOrderedMap(remoteCopy.meta) || OrderedMap();
      const remoteCopyMaps = {
        code: objectToOrderedMap(generator.code, OrderedMap(), [], true),
        configs: objectToOrderedMap(generator.configs, remoteCopyMeta.get('configs')),
        engines: objectToOrderedMap(generator.engines, remoteCopyMeta.get('engines')),
        files: objectToOrderedMap(generator.files, remoteCopyMeta.get('files')),
        generators: objectToOrderedMap(generator.generators, remoteCopyMeta.get('generators')),
        imports: objectToOrderedMap(generator.imports, remoteCopyMeta.get('imports')),
        meta: remoteCopyMeta,
        schemas: objectToOrderedMap(generator.schemas, remoteCopyMeta.get('schemas')),
        specs: objectToOrderedMap(generator.specs, remoteCopyMeta.get('specs')),
        templates: objectToOrderedMap(generator.templates, remoteCopyMeta.get('templates'))
      };

      // const generators = workingCopy ? workingCopyMaps.generators : remoteCopyMaps.generators;
      // const generatorIds = [...generators.keys()]
      //   .map((generatorName) => {
      //     const generator = generators.get(generatorName);
      //     return generator.get('id');
      //   });

      const imports = workingCopy ? workingCopyMaps.imports : remoteCopyMaps.imports;
      let importsDataArray = [];
      if (imports.size > 0) {
        try {
          importsDataArray = (await loadImports(orderedMapToObject(imports)))
            .map((importsData) => {
              const meta = objectToOrderedMap(importsData.meta);
              return {
                ...importsData,
                configs: objectToOrderedMap(importsData.configs, meta.get('configs')),
                engines: objectToOrderedMap(importsData.engines, meta.get('engines')),
                files: objectToOrderedMap(importsData.files, meta.get('files')),
                generators: objectToOrderedMap(importsData.generators, meta.get('generators')),
                imports: objectToOrderedMap(importsData.imports, meta.get('imports')),
                meta,
                schemas: objectToOrderedMap(importsData.schemas, meta.get('schemas')),
                specs: objectToOrderedMap(importsData.specs, meta.get('specs')),
                templates: objectToOrderedMap(importsData.templates, meta.get('templates'))
              };
            });
        } catch (error) {
          importsDataArray = [];
        }
      }

      /*
      const generatorsMap = await Bluebird.map(generatorIds, (generatorId) => {
        return GeneratorAPI
          .getById({
            params: {
              id: generatorId
            }
          })
          .then(({ generator }) => generator);
      });
      let schemas = workingCopy ? workingCopyMaps.schemas : remoteCopyMaps.schemas;
      if (projectType === 'application') {
        schemas = {};
        generatorsMap.forEach((generator) => {
          schemas = merge(schemas, generator.schemas);
        });
        schemas = objectToOrderedMap(schemas);
      }
      */

      //
      // const generatorsData = await Bluebird.all(
      //   generatorIds.map(generatorId => GeneratorAPI.getById({
      //     params: {
      //       id: generatorId
      //     }
      //   }))
      // )
      //   .map(res => res.generator);
      //
      // const generatorImports = generatorsData.reduce((accum, generator) => {
      //   return merge(accum, generator.imports || {});
      // }, {});

      /*
      const importIds = Object.keys(generatorImports).map((generatorImportKey) => {
        const generatorImport = generatorImports[generatorImportKey];
        return generatorImport.id;
      });
      const importsDataArray = await Bluebird.all(
        importIds.map(importId => ProjectAPI.getById({
          params: {
            id: importId
          }
        }))
      )
        .map(res => res.project);
      */

      const importsData = objectToOrderedMap(importsDataArray);
      const schemas = workingCopy ? workingCopyMaps.schemas : remoteCopyMaps.schemas;

      dispatch({
        type: 'LOAD_PROJECT_RES',
        id: generator.id,
        color: generator.color,
        icon: generator.icon,
        isFavorite: generator.isFavorite,
        name: generator.name,
        version: generator.version,
        branches: generator.branches,
        code: workingCopy ? workingCopyMaps.code : remoteCopyMaps.code,
        configs: workingCopy ? workingCopyMaps.configs : remoteCopyMaps.configs,
        configuration: generator.configuration,
        configurations: generator.configurations,
        engines: workingCopy ? workingCopyMaps.engines : remoteCopyMaps.engines,
        files: workingCopy ? workingCopyMaps.files : remoteCopyMaps.files,
        meta: workingCopy ? workingCopyMaps.meta : remoteCopyMaps.meta,
        author: generator.author,
        generators: workingCopy ? workingCopyMaps.generators : remoteCopyMaps.generators,
        generatorsData: objectToOrderedMap({}),
        imports: workingCopy ? workingCopyMaps.imports : remoteCopyMaps.imports,
        importsData,
        schemas,
        specs: workingCopy ? workingCopyMaps.specs : remoteCopyMaps.specs,
        templates: workingCopy ? workingCopyMaps.templates : remoteCopyMaps.templates,
        versions: generator.versions.reverse()
      });

      if (generate) {
        setTimeout(() => {
          generate();
        }, 500);
      }
    } catch (error) {
      dispatch({
        type: 'LOAD_PROJECT_ERR',
        error: error.message
      });
    }
  };
}

export default loadProject;
