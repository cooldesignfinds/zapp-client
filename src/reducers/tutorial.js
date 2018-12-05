const initialState = {
  enabledElements: [],
  name: '',
  show: false,
  stepIndex: 0,
  steps: []
};

export default function tutorialReducer(state = initialState, action) {
  switch (action.type) {
    case 'START_TUTORIAL': {
      return {
        ...state,
        enabledElements: [],
        name: action.name,
        show: action.show,
        stepIndex: 0,
        steps: action.steps
      };
    }
    case 'UPDATE_TUTORIAL': {
      return {
        ...state,
        enabledElements: action.enabledElements,
        stepIndex: action.stepIndex
      };
    }
    default: {
      return state;
    }
  }
}
