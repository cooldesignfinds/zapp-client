const initialState = {
  error: '',
  generators: [],
  isComplete: false,
  isLoading: false
};

function generatorsReducer(state = initialState, action) {
  switch (action.type) {
    case 'LIST_GENERATORS_REQ': {
      return {
        ...state,
        error: '',
        generators: [],
        isComplete: false,
        isLoading: true
      };
    }
    case 'LIST_GENERATORS_RES': {
      return {
        ...state,
        error: '',
        generators: action.generators,
        isComplete: true,
        isLoading: false
      };
    }
    case 'LIST_GENERATORS_ERR': {
      return {
        ...state,
        error: action.error,
        generators: [],
        isComplete: true,
        isLoading: false
      };
    }
    default: {
      return state;
    }
  }
}

export default generatorsReducer;
