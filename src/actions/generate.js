import axios from 'axios';

import action from '../lib/action';
import getItemPathParts from '../lib/getItemPathParts';
import merge from '../lib/merge';
import orderedMapToObject from '../lib/orderedMapToObject';
import updateItem from './updateItem';

async function generateAction({
  dispatch,
  state
}) {
  const projectAuthorUsername = state.project.author && state.project.author.username ? state.project.author.username : '';

  const data = {
    id: state.project.id,
    code: state.project.code,
    configs: state.project.configs,
    engines: state.project.engines,
    files: state.project.files,
    generators: state.project.generators,
    generatorPath: `${projectAuthorUsername}/${state.project.name}/${state.project.version}/${state.project.configuration}`,
    importsData: state.project.importsData,
    meta: state.project.meta,
    schemas: state.project.schemas,
    specs: state.project.specs,
    templates: state.project.templates
  };

  dispatch({
    type: 'GENERATE_REQ'
  });

  const items = (orderedMapToObject(data.importsData) || []).reduce((acc, cur) => {
    return merge(acc, {
      configs: cur.configs,
      files: cur.files,
      meta: cur.meta,
      schemas: cur.schemas,
      specs: cur.specs,
      templates: cur.templates
    });
  });

  const zappParams = merge(
    items,
    {
      configs: orderedMapToObject(data.configs),
      files: orderedMapToObject(data.files),
      meta: orderedMapToObject(data.meta),
      schemas: orderedMapToObject(data.schemas),
      specs: orderedMapToObject(data.specs),
      templates: orderedMapToObject(data.templates)
    }
  );

  try {
    const result = await axios({
      method: 'post',
      url: 'http://localhost:12345/generateCode',
      data: {
        cwd: state.project.cwd,
        project: zappParams
      }
    });

    state.pane.items.forEach(async (paneItem, paneIndex) => {
      if (paneItem.type === 'code' && result.data.files[paneItem.tree.selectedItem.substr(1)]) {
        dispatch(updateItem({
          paneIndex,
          paneType: 'code',
          itemPathParts: getItemPathParts(paneItem.tree.selectedItem),
          itemType: 'string',
          itemValue: result.data.files[paneItem.tree.selectedItem.substr(1)]
        }));
      }
    });

    dispatch({
      type: 'GENERATE_RES'
    });
  } catch (error) {
    dispatch({
      type: 'GENERATE_ERR',
      error: error.message
    });
  }
}

export default action(generateAction);
