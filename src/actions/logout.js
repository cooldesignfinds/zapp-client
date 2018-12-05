import { UserAPI } from '@zappjs/sdk';

export default function logout() {
  return async (dispatch) => {
    try {
      dispatch({
        type: 'LOGOUT_REQ'
      });
      await UserAPI.logout();
      dispatch({
        type: 'LOGOUT_RES'
      });
      window.location.reload();
    } catch (error) {
      dispatch({
        type: 'LOGOUT_ERR',
        error: error.message
      });
      window.location.reload();
    }
  };
}
