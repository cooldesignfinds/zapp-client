import Bluebird from 'bluebird';

export default function action(cb) {
  return (data = {}, opts = {}) => (dispatch, getState) => {
    const state = getState();
    return Bluebird.resolve()
      .then(() => cb({ dispatch, data, opts, state, getState }));
  };
}
