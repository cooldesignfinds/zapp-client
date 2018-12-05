const initialState = {
  content: '',
  current: ''
};

function modalReducer(state = initialState, action) {
  switch (action.type) {
    case 'HIDE_MODAL': {
      return {
        ...state,
        content: '',
        current: ''
      };
    }
    case 'SHOW_MODAL': {
      return {
        ...state,
        content: action.content || '',
        current: action.modal
      };
    }
    default: {
      return state;
    }
  }
}

export default modalReducer;
