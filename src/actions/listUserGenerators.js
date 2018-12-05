import axios from 'axios';

import { GeneratorAPI } from 'zapp-sdk';

export default function listUserGenerators(id) {
  return (dispatch) => {
    dispatch({
      type: 'LIST_USER_GENERATORS_REQ',
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
          type: 'LIST_USER_GENERATORS_RES',
          generators: generators.sort((a, b) => {
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
          type: 'LIST_USER_GENERATORS_ERR',
          error: error.message
        });
      });
  };
}
