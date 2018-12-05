import { OrderedMap } from 'immutable';
import { GeneratorAPI } from 'zapp-sdk';

import orderedMapToObject from '../lib/orderedMapToObject';

function syncGenerator(generatorId, data = {}) {
  return (dispatch) => {
    dispatch({
      type: 'SYNC_PROJECT_REQ',
      name
    });
    return GeneratorAPI.update({
      params: {
        id: generatorId
      },
      body: {
        configs: orderedMapToObject(data.configs),
        generators: orderedMapToObject(data.generators),
        meta: orderedMapToObject(data.meta),
        schemas: orderedMapToObject(data.schemas),
        specs: orderedMapToObject(data.specs),
        templates: orderedMapToObject(data.templates)
      }
    })
      .then(() => {
        dispatch({
          type: 'SYNC_PROJECT_RES',
          code: data.code,
          configs: data.configs,
          files: data.files,
          generators: data.generators,
          schemas: data.schemas,
          specs: data.specs,
          templates: data.templates
        });
      })
      .catch((error) => {
        dispatch({
          type: 'SYNC_PROJECT_ERR',
          error: error.message
        });
      });
  };
}

export default syncGenerator;
