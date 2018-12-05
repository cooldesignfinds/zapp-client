import uuid from 'uuid';

const initialItemId = uuid.v4();

const initialState = {
  currentItem: '',
  items: [],
  show: false
};

function terminalReducer(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_TERMINAL': {
      const newItemId = uuid.v4();
      const items = state.items.slice();
      items.push({
        id: newItemId,
        name: `Terminal ${items.length}`
      });
      return {
        ...state,
        currentItem: newItemId,
        items
      };
    }
    case 'SWITCH_TERMINAL': {
      return {
        ...state,
        currentItem: action.itemId
      };
    }
    case 'CLOSE_TERMINAL': {
      const items = state.items.slice();
      const itemIndex = items.findIndex(item => item.id === action.itemId);
      if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
      }
      const currentItemIndex = itemIndex - 1 === -1 ? 0 : itemIndex - 1;
      return {
        ...state,
        currentItem: items[currentItemIndex].id,
        items
      };
    }
    case 'HIDE_TERMINAL': {
      return {
        ...state,
        show: false
      };
    }
    case 'SHOW_TERMINAL': {
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

export default terminalReducer;
