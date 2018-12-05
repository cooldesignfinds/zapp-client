import { GeneratorAPI } from 'zapp-sdk';

import action from '../lib/action';

function listGenerators({
  dispatch
}) {
  dispatch({
    type: 'LIST_GENERATORS_REQ'
  });
  return GeneratorAPI.list()
    .then(({ generators }) => {
      dispatch({
        type: 'LIST_GENERATORS_RES',
        generators: generators.sort((a, b) => {
          const aName = `${a.author.username}/${a.name}`;
          const bName = `${b.author.username}/${b.name}`;
          if (aName < bName) {
            return -1;
          }
          if (aName > bName) {
            return 1;
          }
          return 0;
        })
      });
    })
    .catch((error) => {
      dispatch({
        type: 'LIST_GENERATORS_ERR',
        error: error.message
      });
      throw error;
    });
}

export default action(listGenerators);
