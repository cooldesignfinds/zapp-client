import { GeneratorAPI } from 'zapp-sdk';

export default function updateIcon(icon = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const generatorId = state.project.id;

    const data = new FormData();
    data.append('file', icon.file);
    data.append('name', 'icon');
    data.append('description', 'the generator icon');

    dispatch({
      type: 'UPDATE_ICON_REQ'
    });
    const generatorRes = await GeneratorAPI.updateIcon({
      params: {
        id: generatorId
      },
      body: data
    });
    const generator = generatorRes.generator;

    dispatch({
      type: 'UPDATE_ICON_RES',
      icon: generator.iconId
    });
  };
}
