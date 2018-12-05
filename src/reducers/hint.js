const initialState = {
  buttons: [],
  content: '',
  data: {},
  elements: [],
  left: 'auto',
  message: '',
  name: '',
  show: false,
  target: document.createElement('div'),
  title: '',
  top: 'auto',
  width: 'auto'
};

function hintReducer(state = initialState, action) {
  switch (action.type) {
    case 'HIDE_HINT': {
      return initialState;
    }
    case 'SHOW_HINT': {
      return {
        ...state,
        buttons: action.buttons,
        content: action.content,
        data: action.data || {},
        elements: action.elements,
        left: action.left || 'auto',
        message: action.message || '',
        name: action.name,
        show: true,
        target: action.target,
        title: action.title,
        top: action.top || 'auto',
        width: action.width || 'auto'
      };
    }
    default: {
      return state;
    }
  }
}

export default hintReducer;
