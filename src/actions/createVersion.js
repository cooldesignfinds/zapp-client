import { push } from 'react-router-redux';
import { GeneratorAPI } from 'zapp-sdk';

import hideModal from './hideModal';

import orderedMapToObject from '../lib/orderedMapToObject';

function createVersion({
  version
}) {
  return async (dispatch, getState) => {
    const state = getState();

    const project = {
      configs: orderedMapToObject(state.project.configs),
      engines: orderedMapToObject(state.project.engines),
      files: orderedMapToObject(state.project.files),
      generators: orderedMapToObject(state.project.generators),
      imports: orderedMapToObject(state.project.imports),
      meta: orderedMapToObject(state.project.meta),
      schemas: orderedMapToObject(state.project.schemas),
      specs: orderedMapToObject(state.project.specs),
      templates: orderedMapToObject(state.project.templates)
    };
    try {
      dispatch({
        type: 'CREATE_VERSION_REQ'
      });
      const createParams = {
        body: {
          ...project,
          version
        },
        params: {
          id: state.project.id
        }
      };
      await GeneratorAPI.createVersion(createParams);
      dispatch({
        type: 'CREATE_VERSION_RES'
      });
      dispatch(hideModal());
      window.location.href = `/${state.project.author.username}/${state.project.name}/v${version}`;
    } catch (error) {
      dispatch({
        type: 'CREATE_VERSION_ERR',
        error: error.response.data.message
      });
    }
  };
}

export default createVersion;
