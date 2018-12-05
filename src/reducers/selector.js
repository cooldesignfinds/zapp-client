const initialState = {
  data: {},
  left: 'auto',
  name: '',
  options: [],
  searchPlaceholder: 'Search Items...',
  show: false,
  showSearch: false,
  target: document.createElement('div'),
  title: '',
  top: 'auto',
  width: 'auto'
};

function selectorReducer(state = initialState, action) {
  switch (action.type) {
    case 'HIDE_SELECTOR': {
      return initialState;
    }
    case 'SHOW_SELECTOR': {
      return {
        ...state,
        random: Math.random(),
        data: action.data || {},
        left: action.left || 'auto',
        name: action.name,
        options: action.options,
        searchPlaceholder: action.searchPlaceholder || initialState.searchPlaceholder,
        show: true,
        showSearch: action.showSearch,
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

export default selectorReducer;
