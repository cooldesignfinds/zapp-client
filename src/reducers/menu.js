const initialState = {
  selectedItem: ''
};

function menuReducer(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_MENU_ITEM': {
      return {
        ...state,
        selectedItem: action.menuItem
      };
    }
    default: {
      return state;
    }
  }
}

export default menuReducer;
