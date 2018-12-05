import { GeneratorAPI } from '@zappjs/sdk';

import orderedMapToObject from '../lib/orderedMapToObject';

function saveProject() {
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
    dispatch({
      type: 'SAVE_PROJECT_REQ'
    });

    await GeneratorAPI.update({
      params: {
        id: state.project.id,
        version: state.project.version,
        configuration: state.project.configuration
      },
      body: project
    });

    setTimeout(() => {
      dispatch({
        type: 'SAVE_PROJECT_RES'
      });
    }, 500);
  };
}

export default saveProject;
