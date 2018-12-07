import axios from 'axios';

import action from '../lib/action';

async function initialize({ state }) {
  await axios({
    method: 'post',
    url: 'http://localhost:12345/initialize',
    data: {
      cwd: state.project.cwd
    }
  });

  window.location.reload();
}

export default action(initialize);
