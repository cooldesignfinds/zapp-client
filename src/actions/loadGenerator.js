import { OrderedMap } from 'immutable';
import { GeneratorAPI } from '@zappjs/sdk';

import objectToOrderedMap from '../lib/objectToOrderedMap';

function loadGenerator(id) {
  return (dispatch) => {
    dispatch({
      type: 'LOAD_PROJECT_REQ',
      id
    });
    const getParams = {
      params: {
        id
      }
    };
    return GeneratorAPI.get(getParams)
      .then(({ generator }) => {
        const workingCopyStorage = localStorage.getItem(`generators/${generator.id}`);

        const workingCopy = workingCopyStorage ? JSON.parse(workingCopyStorage) : null;
        const workingCopyMeta = workingCopy
          ? objectToOrderedMap(workingCopy.meta || {})
          : OrderedMap();
        const workingCopyMaps = workingCopy ? {
          code: objectToOrderedMap(workingCopy.code || {}, OrderedMap(), [], true),
          configs: objectToOrderedMap(workingCopy.configs || {}, workingCopyMeta.get('configs')),
          files: objectToOrderedMap(workingCopy.files || {}, workingCopyMeta.get('files')),
          generators: objectToOrderedMap(workingCopy.generators || {}, workingCopyMeta.get('generators')),
          meta: workingCopyMeta,
          schemas: objectToOrderedMap(workingCopy.schemas || {}, workingCopyMeta.get('schemas')),
          specs: objectToOrderedMap(workingCopy.specs || {}, workingCopyMeta.get('specs')),
          templates: objectToOrderedMap(workingCopy.templates || {}, workingCopyMeta.get('templates'))
        } : {};

        const remoteCopy = {
          code: generator.code,
          configs: generator.configs,
          files: generator.files,
          generators: generator.generators,
          meta: generator.meta,
          schemas: generator.schemas,
          specs: generator.specs,
          templates: generator.remplates
        };
        const remoteCopyMeta = objectToOrderedMap(remoteCopy.meta) || OrderedMap();
        const remoteCopyMaps = {
          code: objectToOrderedMap(generator.code, OrderedMap(), [], true),
          configs: objectToOrderedMap(generator.configs, remoteCopyMeta.get('configs')),
          files: objectToOrderedMap(generator.files, remoteCopyMeta.get('files')),
          generators: objectToOrderedMap(generator.generators, remoteCopyMeta.get('generators')),
          meta: remoteCopyMeta,
          schemas: objectToOrderedMap(generator.schemas, remoteCopyMeta.get('schemas')),
          specs: objectToOrderedMap(generator.specs, remoteCopyMeta.get('specs')),
          templates: objectToOrderedMap(generator.templates, remoteCopyMeta.get('templates'))
        };

        dispatch({
          type: 'LOAD_PROJECT_RES',
          id: generator.id,
          name: generator.name,
          branches: generator.branches,
          code: workingCopy ? workingCopyMaps.code : remoteCopyMaps.code,
          configs: workingCopy ? workingCopyMaps.configs : remoteCopyMaps.configs,
          files: workingCopy ? workingCopyMaps.files : remoteCopyMaps.files,
          meta: workingCopy ? workingCopyMaps.meta : remoteCopyMaps.meta,
          generators: workingCopy ? workingCopyMaps.generators : remoteCopyMaps.generators,
          projectType: generator.type,
          schemas: workingCopy ? workingCopyMaps.schemas : remoteCopyMaps.schemas,
          specs: workingCopy ? workingCopyMaps.specs : remoteCopyMaps.specs,
          templates: workingCopy ? workingCopyMaps.templates : remoteCopyMaps.templates
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOAD_PROJECT_ERR',
          error: error.message
        });
      });
  };
}

export default loadGenerator;
