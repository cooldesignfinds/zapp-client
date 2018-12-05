import { GeneratorAPI } from 'zapp-sdk';

function createProject(opts) {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'CREATE_PROJECT_REQ'
      });
      const createParams = {
        body: {
          author: opts.author,
          name: opts.name
        }
      };
      const { generator } = await GeneratorAPI.create(createParams);
      dispatch({
        type: 'CREATE_PROJECT_RES'
      });
      window.location.href = `/${generator.author.username}/${generator.name}/latest`;
    } catch (error) {
      dispatch({
        type: 'CREATE_PROJECT_ERR',
        error: error.response.data.message
      });
    }
  };
}

export default createProject;
