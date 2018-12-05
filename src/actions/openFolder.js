import axios from 'axios';

import action from '../lib/action';

async function openFolderAction({
  getState
}) {
  const state = getState();
  return axios({
    method: 'post',
    url: 'http://localhost:12345/openFolder',
    data: {
      cwd: state.project.cwd
    }
  });
}

export default action(openFolderAction);
