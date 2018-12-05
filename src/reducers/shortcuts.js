const initialState = {
  show: false
};

function shortcutsReducer(state = initialState, action) {
  switch (action.type) {
    case 'HIDE_SHORTCUTS': {
      return {
        ...state,
        show: false
      };
    }
    case 'SHOW_SHORTCUTS': {
      return {
        ...state,
        show: true
      };
    }
    default: {
      return state;
    }
  }
}

export default shortcutsReducer;
