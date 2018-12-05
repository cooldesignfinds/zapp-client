import { push } from 'react-router-redux';
import { CardAPI, GeneratorAPI, ProjectAPI, SubscriptionAPI, TeamAPI, TrialAPI, UserAPI } from 'zapp-sdk';

import listGenerators from './listGenerators';
import listUserGenerators from './listUserGenerators';

CardAPI.endpoint = CONFIG.api.host;
GeneratorAPI.endpoint = CONFIG.api.host;
ProjectAPI.endpoint = CONFIG.api.host;
SubscriptionAPI.endpoint = CONFIG.api.host;
TeamAPI.endpoint = CONFIG.api.host;
TrialAPI.endpoint = CONFIG.api.host;
UserAPI.endpoint = CONFIG.api.host;

export default function autologin() {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'AUTOLOGIN_REQ'
      });

      const userRes = await UserAPI.autologin();
      const avatarUrl = userRes.user.avatarUrl;
      const username = userRes.user.username;
      dispatch({
        type: 'AUTOLOGIN_RES',
        avatarUrl,
        favorites: userRes.user.favorites,
        id: userRes.user.id,
        username
      });
      dispatch(listGenerators());
      dispatch(listUserGenerators());
    } catch (err) {
      if (err.response.data.code === 'AuthRequiredError') {
        dispatch({
          type: 'AUTOLOGIN_RES_GUEST'
        });
        dispatch(listGenerators());
        dispatch(listUserGenerators());
        return;
      }
      dispatch({
        type: 'AUTOLOGIN_ERR',
        error: err.message
      });
    }
  };
}
