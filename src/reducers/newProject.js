const initialState = {
  error: '',
  isComplete: false,
  isLoading: false
};

function newProjectReducer(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_PROJECT_REQ': {
      return {
        ...state,
        error: '',
        isComplete: false,
        isLoading: true
      };
    }
    case 'CREATE_PROJECT_RES': {
      return {
        ...state,
        error: '',
        isComplete: true,
        isLoading: false
      };
    }
    case 'CREATE_PROJECT_ERR': {
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

export default newProjectReducer;
