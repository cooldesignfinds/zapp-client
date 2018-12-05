import { UserAPI } from '@zappjs/sdk';

import action from '../lib/action';

async function toggleFavorite({
  dispatch,
  getState
}) {
  try {
    const state = getState();

    if (state.project.isFavorite) {
      dispatch({
        type: 'UNFAVORITE_REQ'
      });
      await UserAPI.deleteFavorite({
        params: {
          userId: state.user.id
        },
        body: {
          generatorId: state.project.id
        }
      });

      dispatch({
        type: 'UNFAVORITE_RES'
      });
      return;
    }

    dispatch({
      type: 'FAVORITE_REQ'
    });

    await UserAPI.createFavorite({
      params: {
        userId: state.user.id
      },
      body: {
        generatorId: state.project.id
      }
    });

    dispatch({
      type: 'FAVORITE_RES'
    });
  } catch (error) {
    console.log(error);
  }
}

export default action(toggleFavorite);
