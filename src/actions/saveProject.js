import axios from 'axios';
import { GeneratorAPI } from '@zappjs/sdk';

import action from '../lib/action';
import orderedMapToObject from '../lib/orderedMapToObject';

async function saveProject({
  dispatch,
  getState
}) {
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

  if (state.project.isLocal) {
    await axios({
      method: 'post',
      url: 'http://localhost:12345/saveProject',
      data: {
        cwd: state.project.cwd,
        project
      }
    });

    dispatch({
      type: 'SAVE_PROJECT_RES'
    });

    return;
  }

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
}

export default action(saveProject);
