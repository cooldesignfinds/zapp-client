import axios from 'axios';

import { GeneratorAPI } from '@zappjs/sdk';

function listProjects(id) {
  return (dispatch) => {
    dispatch({
      type: 'LIST_PROJECTS_REQ',
      id
    });
    const listParams = {
      params: {
        owned: true
      }
    };
    return GeneratorAPI.list(listParams)
      .then(({ generators }) => {
        dispatch({
          type: 'LIST_PROJECTS_RES',
          projects: generators.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          })
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LIST_PROJECTS_ERR',
          error: error.message
        });
      });
  };
}

export default listProjects;
