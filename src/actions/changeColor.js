import { GeneratorAPI } from '@zappjs/sdk';

import hideModal from './hideModal';

export default function changeColor({ color }) {
  return async (dispatch, getState) => {
    const state = getState();

    await GeneratorAPI.updateColor({
      params: {
        id: state.project.id,
        version: state.project.version,
        configuration: state.project.configuration
      },
      body: {
        color
      }
    });

    dispatch({
      type: 'CHANGE_COLOR_RES',
      color
    });
    dispatch(hideModal());
  };
}
