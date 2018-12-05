const initialState = {
  logs: []
};

function logReducer(state = initialState, action) {
  if (action.type === 'CLEAR_LOGS') {
    return initialState;
  }

  if (!/(_ERR|_RES)$/.test(action.type)) {
    return state;
  }

  let message = '';
  let level = 'info';
  if (/_ERR$/.test(action.type)) {
    message = action.error;
    level = 'error';
  }
  if (/_RES$/.test(action.type)) {
    message = action.type;
    level = 'success';
  }

  const logs = state.logs.slice();
  logs.push({
    message,
    level
  });

  return {
    ...state,
    logs
  };
}

export default logReducer;
