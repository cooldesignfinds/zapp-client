import { List, OrderedMap } from 'immutable';

import cloneArray from '../lib/cloneArray';
import getItemPath from '../lib/getItemPath';
import getItemPathParts from '../lib/getItemPathParts';

const PANE_TYPES = [
  'specs',
  'code',
  'schemas',
  'templates',
  'files',
  'engines',
  'imports'
];

const initialState = {
  focusedItem: 0,
  items: [
    {
      type: 'specs',
      width: 50,
      recentPaths: ['/'],
      path: [],
      tree: {
        open: true,
        expandedItems: [],
        newItem: {
          key: '',
          url: '',
          type: '',
          value: ''
        },
        selectedItem: '/'
      },
      editor: {
        expandedItems: [],
        newItemPath: ''
      }
    },
    // {
    //   type: 'code',
    //   width: 50,
    //   recentPaths: ['/'],
    //   path: [],
    //   tree: {
    //     open: true,
    //     expandedItems: [],
    //     newItem: {
    //       key: '',
    //       url: '',
    //       type: '',
    //       value: ''
    //     },
    //     selectedItem: '/'
    //   },
    //   editor: {
    //     expandedItems: []
    //   }
    // }
  ]
};

export default function paneReducer(state = initialState, action) {
  switch (action.type) {
    case 'CLOSE_PANE': {
      const items = cloneArray(state.items);
      items.splice(action.paneIndex, 1);
      return {
        ...state,
        items
      };
    }
    case 'SET_PANE_TYPE': {
      const items = cloneArray(state.items);
      items[action.paneIndex].type = action.paneType;
      return {
        ...state,
        items
      };
    }
    case 'SPLIT_PANE': {
      const items = cloneArray(state.items);
      const currentTypeIndex = PANE_TYPES.indexOf(items[action.paneIndex].type);
      const usedPaneTypes = items.map(item => item.type);
      const foundPaneType = PANE_TYPES.find((paneType, paneTypeIndex) => {
        if (paneTypeIndex <= currentTypeIndex || usedPaneTypes.includes(paneType)) {
          return false;
        }
        return true;
      });
      items.splice(action.paneIndex + 1, 0, {
        ...initialState.items[0],
        type: foundPaneType || items[action.paneIndex].type
      });
      return {
        ...state,
        items
      };
    }
    case 'TOGGLE_PANE_TREE': {
      const items = cloneArray(state.items);
      items[action.paneIndex].tree.open = !items[action.paneIndex].tree.open;
      return {
        ...state,
        items
      };
    }

    case 'COLLAPSE_PANE_TREE_ITEM': {
      const items = cloneArray(state.items);
      const expandedItems = items[action.paneIndex].tree.expandedItems.slice();
      items[action.paneIndex].tree.expandedItems = expandedItems
        .filter(expandedItem => expandedItem !== action.itemPath);
      return {
        ...state,
        items
      };
    }
    case 'EXPAND_PANE_TREE_ITEM': {
      const items = cloneArray(state.items);
      const expandedItems = items[action.paneIndex].tree.expandedItems.slice();
      const itemPathParts = getItemPathParts(action.itemPath);
      // expand itemPath and all parent itemPath
      itemPathParts.forEach((itemPathPart, index) => {
        const itemPath = getItemPath(itemPathParts.slice(0, index + 1));
        if (!expandedItems.includes(itemPath)) {
          expandedItems.push(itemPath);
        }
      });
      items[action.paneIndex].tree.expandedItems = expandedItems;
      return {
        ...state,
        items
      };
    }
    case 'SELECT_PANE_TREE_ITEM': {
      const items = cloneArray(state.items);
      items[action.paneIndex].path = action.itemPathParts;
      const recentPathIndex = items[action.paneIndex].recentPaths.indexOf(action.itemPath);
      if (recentPathIndex !== -1) {
        items[action.paneIndex].recentPaths.splice(recentPathIndex, 1);
      }
      items[action.paneIndex].recentPaths.unshift(action.itemPath);
      if (items[action.paneIndex].recentPaths.length > 5) {
        items[action.paneIndex].recentPaths.length = 5;
      }
      items[action.paneIndex].tree.selectedItem = action.itemPath;
      return {
        ...state,
        items
      };
    }

    case 'NEW_TREE_ITEM': {
      const items = cloneArray(state.items);
      items[action.paneIndex].tree.newItem = {
        url: action.itemPath
      };
      return {
        ...state,
        items
      };
    }
    case 'RESET_NEW_TREE_ITEM': {
      const items = cloneArray(state.items);
      items[action.paneIndex].tree.newItem = {
        key: '',
        url: '',
        type: '',
        value: ''
      };
      return {
        ...state,
        items
      };
    }
    case 'UPDATE_NEW_TREE_ITEM': {
      const items = cloneArray(state.items);
      items[action.paneIndex].tree.newItem.value = action.itemValue;
      return {
        ...state,
        items
      };
    }

    case 'RESET_NEW_ITEM_PATH': {
      const items = cloneArray(state.items);
      items[action.paneIndex].editor.newItemPath = '';
      return {
        ...state,
        items
      };
    }
    case 'UPDATE_NEW_ITEM_PATH': {
      const items = cloneArray(state.items);
      items[action.paneIndex].editor.newItemPath = action.itemPath;
      return {
        ...state,
        items
      };
    }

    case 'COLLAPSE_PANE_EDITOR_ITEM': {
      const items = cloneArray(state.items);
      const expandedItems = items[action.paneIndex].editor.expandedItems.slice();
      items[action.paneIndex].editor.expandedItems = expandedItems
        .filter(expandedItem => expandedItem !== action.itemPath);
      return {
        ...state,
        items
      };
    }
    case 'EXPAND_PANE_EDITOR_ITEM': {
      const items = cloneArray(state.items);
      const expandedItems = items[action.paneIndex].editor.expandedItems.slice();
      const itemPathParts = getItemPathParts(action.itemPath);
      // expand itemPath and all parent itemPath
      itemPathParts.forEach((itemPathPart, index) => {
        const itemPath = getItemPath(itemPathParts.slice(0, index + 1));
        if (!expandedItems.includes(itemPath)) {
          expandedItems.push(itemPath);
        }
      });
      items[action.paneIndex].editor.expandedItems = expandedItems;
      return {
        ...state,
        items
      };
    }
    case 'RESET_CURRENT_EDITOR_ITEM': {
      const items = cloneArray(state.items);
      items[action.paneIndex].editor.currentItem = {
        field: '',
        isNew: false,
        key: '',
        mode: '',
        path: [],
        suggestions: [],
        type: '',
        url: '',
        value: ''
      };
      return {
        ...state,
        items
      };
    }
    case 'UPDATE_CURRENT_EDITOR_ITEM': {
      const items = cloneArray(state.items);
      if (action.field !== undefined) {
        items[action.paneIndex].editor.currentItem.field = action.field;
      }
      if (action.itemIsNew !== undefined) {
        items[action.paneIndex].editor.currentItem.isNew = action.itemIsNew;
      }
      if (action.itemKey !== undefined) {
        items[action.paneIndex].editor.currentItem.key = action.itemKey;
      }
      if (action.itemMode !== undefined) {
        items[action.paneIndex].editor.currentItem.mode = action.itemMode;
      }
      if (action.itemPathParts !== undefined) {
        items[action.paneIndex].editor.currentItem.path = action.itemPathParts;
      }
      if (action.itemType !== undefined) {
        items[action.paneIndex].editor.currentItem.type = action.itemType;
      }
      if (action.itemPath !== undefined) {
        items[action.paneIndex].editor.currentItem.url = action.itemPath;
      }
      if (action.itemValue !== undefined) {
        items[action.paneIndex].editor.currentItem.value = action.itemValue;
      }
      return {
        ...state,
        items
      };
    }

    case 'UPDATE_ITEMS_RES': {
      if (!action.oldItemPathParts || action.oldItemPathParts.join(',') === action.itemPathParts.join(',')) {
        return state;
      }

      const itemPath = getItemPath(action.itemPathParts);
      const oldItemPath = getItemPath(action.oldItemPathParts);

      const items = cloneArray(state.items);
      items[action.paneIndex].tree.expandedItems = items[action.paneIndex].tree.expandedItems
        .map((expandedItemPath) => {
          if (expandedItemPath === oldItemPath) {
            return itemPath;
          }
          return expandedItemPath;
        });

      return {
        ...state,
        items
      };
    }

    case 'FOCUS_PANE': {
      return {
        ...state,
        focusedItem: action.paneIndex
      };
    }

    default: {
      return state;
    }
  }
}
