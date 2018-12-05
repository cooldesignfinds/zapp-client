import { ProjectAPI } from 'zapp-sdk';

import getItemPath from '../lib/getItemPath';

function loadCode(projectName, itemPathParts) {
  return (dispatch) => {
    dispatch({
      type: 'LOAD_CODE_REQ',
      path: itemPathParts
    });
    const getParams = {
      params: {
        name: projectName,
        path: getItemPath(itemPathParts)
      }
    };
    return ProjectAPI.getCode(getParams)
      .then(({ code }) => {
        dispatch({
          type: 'LOAD_CODE_RES',
          code: atob(code),
          path: itemPathParts
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOAD_CODE_ERR',
          error: error.message,
          path: itemPathParts
        });
      });
  };
}

export default loadCode;
