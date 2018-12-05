import { OrderedMap } from 'immutable';
import { ProjectAPI } from 'zapp-sdk';

import hideModal from './hideModal';
import orderedMapToObject from '../lib/orderedMapToObject';

function syncProject(projectId, data = {}) {
  return (dispatch, getState) => {
    const state = getState();

    dispatch({
      type: 'SYNC_PROJECT_REQ',
      name
    });
    return ProjectAPI.update({
      params: {
        id: projectId
      },
      body: {
        configs: orderedMapToObject(state.project.configs),
        generators: orderedMapToObject(state.project.generators),
        message: data.message,
        meta: orderedMapToObject(state.project.meta),
        schemas: orderedMapToObject(state.project.schemas),
        specs: orderedMapToObject(state.project.specs),
        templates: orderedMapToObject(state.project.templates)
      }
    })
      .then(() => {
        dispatch({
          type: 'SYNC_PROJECT_RES',
          code: state.project.code,
          configs: state.project.configs,
          files: state.project.files,
          generators: state.project.generators,
          schemas: state.project.schemas,
          specs: state.project.specs,
          templates: state.project.templates
        });
        dispatch(hideModal());
      })
      .catch((error) => {
        dispatch({
          type: 'SYNC_PROJECT_ERR',
          error: error.message
        });
      });
  };
}

export default syncProject;
