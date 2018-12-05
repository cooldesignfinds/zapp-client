import axios from 'axios';

import action from '../lib/action';

import updateItem from './updateItem';

async function selectPaneTreeItem({
  data: {
    paneIndex,
    itemPathParts,
    itemPath
  },
  dispatch,
  getState
}) {
  const state = getState();

  dispatch({
    type: 'SELECT_PANE_TREE_ITEM',
    itemPathParts,
    itemPath,
    paneIndex
  });

  if (
    state.project.isLocal
      && state.pane.items[paneIndex].type === 'code'
  ) {
    const result = await axios({
      method: 'post',
      url: 'http://localhost:12345/loadFile',
      data: {
        cwd: state.project.cwd,
        path: itemPath
      }
    });

    console.log(result);

    dispatch(
      updateItem({
        paneIndex,
        paneType: 'code',
        itemPathParts,
        itemType: 'string',
        itemValue: result.data.content
      })
    );
  }
}

export default action(selectPaneTreeItem);
