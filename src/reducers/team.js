const initialState = {
  error: '',
  id: '',
  isComplete: false,
  isLoading: false,
  name: ''
};

function teamReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_TEAM_RES': {
      return {
        ...state,
        error: '',
        id: action.id,
        isComplete: true,
        isLoading: false,
        name: action.name
      };
    }
    default: {
      return state;
    }
  }
}

export default teamReducer;
