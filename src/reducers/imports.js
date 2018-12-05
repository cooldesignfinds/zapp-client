const initialState = {
  error: '',
  isComplete: false,
  isLoading: false
};

function importsReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_IMPORTS_REQ': {
      return {
        ...state,
        error: '',
        isComplete: false,
        isLoading: true
      };
    }
    case 'LOAD_IMPORTS_RES': {
      return {
        ...state,
        error: '',
        isComplete: true,
        isLoading: false
      };
    }
    case 'LOAD_IMPORTS_ERR': {
      return {
        ...state,
        error: action.error,
        isComplete: true,
        isLoading: false
      };
    }
    default: {
      return state;
    }
  }
}

export default importsReducer;
