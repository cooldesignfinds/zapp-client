import Bluebird from 'bluebird';

export default function action(cb) {
  return (data = {}, opts = {}) => (dispatch, getState) => {
    const state = getState();
    return Bluebird.resolve()
      .then(() => cb({ dispatch, data, opts, state, getState }))
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.code === 'AuthRequiredError') {
          window.location.href = `${CONFIG.auth.host}/login`;
          return;
        }
        throw err;
      });
  };
}
