import axios from 'axios';

import action from '../lib/action';
import updateItem from './updateItem';

async function loadFile({
  data: {
    paneIndex,
    itemPathParts,
    itemPath
  },
  dispatch,
  state
}) {
  const result = await axios({
    method: 'post',
    url: 'http://localhost:12345/loadFile',
    data: {
      cwd: state.project.cwd,
      path: itemPath
    }
  });

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

export default action(loadFile);
