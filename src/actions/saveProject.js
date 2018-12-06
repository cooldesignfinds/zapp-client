import axios from 'axios';

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
}

export default action(saveProject);
