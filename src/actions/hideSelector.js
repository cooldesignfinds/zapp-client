import action from '../lib/action';

function hideSelector({ dispatch }) {
  dispatch({
    type: 'HIDE_SELECTOR'
  });
}

export default action(hideSelector);
