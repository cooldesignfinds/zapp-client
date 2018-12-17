import { List, OrderedMap } from 'immutable';

import getAllSchemas from '../lib/getAllSchemas';
import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialState = {
  allSchemas: OrderedMap(),
  author: {},
  branches: [],
  canSave: false,
  canSync: false,
  code: OrderedMap(),
  codeChanges: [],
  codeFiles: {},
  codePath: [],
  color: '#000',
  configs: OrderedMap(),
  configuration: 'default',
  configurations: [],
  cwd: '',
  engines: OrderedMap(),
  error: '',
  files: OrderedMap(),
  generators: OrderedMap(),
  hasUnsavedChanges: false,
  isLocal: false,
  imports: OrderedMap(),
  importsData: List(),
  history: [],
  historyIndex: 0,
  icon: '',
  id: '',
  isComplete: false,
  isFavorite: false,
  isGenerating: false,
  isLoading: false,
  isSaving: false,
  isSyncing: false,
  isTranspiling: false,
  logs: OrderedMap(),
  meta: OrderedMap(),
  name: '',
  path: '',
  schemas: OrderedMap(),
  specs: OrderedMap(),
  templates: OrderedMap(),
  title: '(Unknown)',
  type: '',
  version: '',
  versions: []
};

function projectReducer(state = initialState, action) {
  switch (action.type) {
    case 'GENERATE_REQ': {
      return {
        ...state,
        isGenerating: true
      };
    }
    case 'GENERATE_CODE': {
      const code = objectToOrderedMap({
        ...action.code
      }, OrderedMap(), [], true);
      return {
        ...state,
        code,
        codeChanges: action.codeChanges,
        codeFiles: action.codeFiles,
        logs: state.logs.set(new Date(), 'Success')
      };
    }
    case 'GENERATE_RES': {
      return {
        ...state,
        isGenerating: false
      };
    }
    case 'GENERATE_ERR': {
      return {
        ...state,
        isGenerating: false,
        logs: state.logs.set(new Date(), action.error)
      };
    }
    case 'SELECT_PANE_TREE_ITEM': {
      const codeChanges = state.codeChanges.slice();
      const itemPathIndex = codeChanges.indexOf(action.itemPath);
      if (itemPathIndex === -1) {
        return state;
      }
      codeChanges.splice(itemPathIndex, 1);
      return {
        ...state,
        codeChanges
      };
    }
    case 'LOAD_CODE_RES': {
      let code = state.code || OrderedMap();
      code = code.setIn(action.path, action.code);
      return {
        ...state,
        code
      };
    }
    case 'LOAD_PROJECT_REQ': {
      return {
        ...state,
        allSchemas: OrderedMap(),
        author: {
          username: action.user
        },
        branches: [],
        code: OrderedMap(),
        color: '#000',
        configs: OrderedMap(),
        configuration: action.configuration,
        configurations: [],
        cwd: action.cwd,
        engines: OrderedMap(),
        error: '',
        files: OrderedMap(),
        generators: OrderedMap(),
        hasUnsavedChanges: false,
        imports: OrderedMap(),
        importsData: List(),
        icon: '',
        id: '',
        isComplete: false,
        isFavorite: false,
        isLoading: true,
        isLocal: false,
        meta: OrderedMap(),
        name: action.name,
        path: '',
        schemas: OrderedMap(),
        specs: OrderedMap(),
        templates: OrderedMap(),
        title: '',
        type: '',
        version: action.version,
        versions: []
      };
    }
    case 'LOAD_PROJECT_RES': {
      const allSchemas = getAllSchemas(action.schemas, action.importsData);
      return {
        ...state,
        allSchemas,
        author: action.author,
        branches: action.branches,
        canSave: action.canSave,
        canSync: action.canSync,
        code: action.code,
        codeFiles: action.codeFiles,
        color: action.color,
        configs: action.configs,
        configuration: action.configuration,
        configurations: action.configurations,
        engines: action.engines,
        error: '',
        files: action.files,
        generators: action.generators,
        hasUnsavedChanges: false,
        history: [{
          allSchemas,
          configs: action.configs,
          code: action.code,
          imports: action.imports,
          importsData: action.importsData,
          meta: action.meta,
          schemas: action.schemas,
          specs: action.specs,
          templates: action.templates
        }],
        imports: action.imports,
        importsData: action.importsData,
        icon: action.icon,
        id: action.id,
        isComplete: true,
        isFavorite: action.isFavorite,
        isLoading: false,
        isLocal: action.isLocal,
        meta: action.meta,
        name: action.name,
        path: action.path,
        schemas: action.schemas,
        specs: action.specs,
        templates: action.templates,
        title: action.title,
        type: action.projectType,
        version: action.version,
        versions: action.versions
      };
    }
    case 'LOAD_PROJECT_ERR': {
      return {
        ...state,
        allSchemas: OrderedMap(),
        author: {},
        branches: [],
        code: OrderedMap(),
        color: '#000',
        configs: OrderedMap(),
        configuration: 'default',
        configurations: [],
        engines: OrderedMap(),
        error: action.error,
        files: OrderedMap(),
        generators: OrderedMap(),
        hasUnsavedChanges: false,
        imports: OrderedMap(),
        importsData: List(),
        icon: '',
        id: '',
        isComplete: false,
        isFavorite: false,
        isLoading: false,
        isLocal: false,
        meta: OrderedMap(),
        name: '',
        path: '',
        schemas: OrderedMap(),
        specs: OrderedMap(),
        templates: OrderedMap(),
        title: '',
        type: '',
        version: '',
        versions: []
      };
    }
    case 'LIST_FILES_RES': {
      return {
        ...state,
        code: action.code
      };
    }
    case 'DELETE_CONFIG_RES': {
      return {
        ...state,
        configs: action.configs
      };
    }
    case 'DELETE_ENGINE_RES': {
      return {
        ...state,
        imports: action.imports
      };
    }
    case 'DELETE_FILE_RES': {
      return {
        ...state,
        files: action.files
      };
    }
    case 'DELETE_GENERATOR_RES': {
      return {
        ...state,
        generators: action.generators
      };
    }
    case 'DELETE_IMPORT_RES': {
      return {
        ...state,
        imports: action.imports
      };
    }
    case 'DELETE_SCHEMA_RES': {
      const allSchemas = getAllSchemas(action.schemas, state.importsData);
      return {
        ...state,
        allSchemas,
        schemas: action.schemas
      };
    }
    case 'DELETE_SPEC_RES': {
      return {
        ...state,
        specs: action.specs
      };
    }
    case 'DELETE_TEMPLATE_RES': {
      return {
        ...state,
        templates: action.templates
      };
    }
    case 'SAVE_PROJECT_REQ': {
      return {
        ...state,
        isSaving: true
      };
    }
    case 'SAVE_PROJECT_RES': {
      return {
        ...state,
        codeChanges: [],
        hasUnsavedChanges: false,
        isSaving: false
      };
    }
    case 'SAVE_PROJECT_ERR': {
      return {
        ...state,
        isSaving: false
      };
    }
    case 'SET_CODE_PATH': {
      return {
        ...state,
        codePath: action.path
      };
    }
    case 'SET_PROJECT_TYPE': {
      return {
        ...state,
        configs: action.configs,
        type: action.projectType
      };
    }
    case 'SYNC_PROJECT_REQ': {
      return {
        ...state,
        isSyncing: true
      };
    }
    case 'SYNC_PROJECT_RES': {
      return {
        ...state,
        isSyncing: false
      };
    }
    case 'SYNC_PROJECT_ERR': {
      return {
        ...state,
        isSyncing: false
      };
    }
    case 'TRANSPILE_PROJECT_REQ': {
      return {
        ...state,
        isTranspiling: true
      };
    }
    case 'TRANSPILE_PROJECT_RES': {
      return {
        ...state,
        isTranspiling: false
      };
    }
    case 'TRANSPILE_PROJECT_ERR': {
      return {
        ...state,
        isTranspiling: false
      };
    }
    case 'UNDO': {
      if (state.historyIndex === 0) {
        return state;
      }
      const newHistoryIndex = state.historyIndex - 1;
      const newState = {
        ...state,
        historyIndex: newHistoryIndex,
        allSchemas: state.history[newHistoryIndex].allSchemas,
        configs: state.history[newHistoryIndex].configs,
        code: state.history[newHistoryIndex].code,
        imports: state.history[newHistoryIndex].imports,
        importsData: state.history[newHistoryIndex].importsData,
        meta: state.history[newHistoryIndex].meta,
        schemas: state.history[newHistoryIndex].schemas,
        specs: state.history[newHistoryIndex].specs,
        templates: state.history[newHistoryIndex].templates
      };
      return newState;
    }
    case 'REDO': {
      if (state.historyIndex === state.history.length - 1) {
        return state;
      }
      const newHistoryIndex = state.historyIndex + 1;
      const newState = {
        ...state,
        historyIndex: newHistoryIndex,
        allSchemas: state.history[newHistoryIndex].allSchemas,
        configs: state.history[newHistoryIndex].configs,
        code: state.history[newHistoryIndex].code,
        imports: state.history[newHistoryIndex].imports,
        importsData: state.history[newHistoryIndex].importsData,
        meta: state.history[newHistoryIndex].meta,
        schemas: state.history[newHistoryIndex].schemas,
        specs: state.history[newHistoryIndex].specs,
        templates: state.history[newHistoryIndex].templates
      };
      return newState;
    }
    case 'UPDATE_ITEMS_RES': {
      const newState = {
        ...state,
        [action.paneType]: action.items,
        hasUnsavedChanges: action.paneType !== 'code' ? true : state.hasUnsavedChanges,
        historyIndex: action.paneType === 'code' ? state.historyIndex : state.historyIndex + 1,
        meta: action.meta
      };
      if (action.paneType !== 'code') {
        const history = newState.history.slice(0, newState.historyIndex);
        history.push({
          allSchemas: newState.allSchemas,
          configs: newState.configs,
          code: newState.code,
          imports: newState.imports,
          importsData: newState.importsData,
          meta: newState.meta,
          schemas: newState.schemas,
          specs: newState.specs,
          templates: newState.templates
        });
        newState.history = history;
      }
      if (action.paneType === 'schemas') {
        newState.allSchemas = getAllSchemas(action.items, state.importsData);
      }
      return newState;
    }
    case 'UPDATE_CONFIG_RES': {
      return {
        ...state,
        configs: action.configs,
        meta: action.meta
      };
    }
    case 'UPDATE_ENGINE_RES': {
      return {
        ...state,
        engines: action.engines,
        meta: action.meta
      };
    }
    case 'UPDATE_FILE_RES': {
      return {
        ...state,
        files: action.files,
        meta: action.meta
      };
    }
    case 'UPDATE_GENERATOR_RES': {
      const allSchemas = getAllSchemas(action.schemas, state.importsData);
      return {
        ...state,
        allSchemas,
        generators: action.generators,
        meta: action.meta,
        schemas: action.schemas
      };
    }
    case 'UPDATE_IMPORT_RES': {
      return {
        ...state,
        imports: action.imports,
        meta: action.meta
      };
    }
    case 'UPDATE_IMPORT_DATA_RES': {
      const allSchemas = getAllSchemas(state.schemas, action.importsData);
      const history = state.history.slice();
      history[state.historyIndex].allSchemas = allSchemas;
      history[state.historyIndex].importsData = action.importsData;
      return {
        ...state,
        allSchemas,
        history,
        importsData: action.importsData
      };
    }
    case 'UPDATE_SCHEMA_RES': {
      const allSchemas = getAllSchemas(action.schemas, state.importsData);
      return {
        ...state,
        allSchemas,
        meta: action.meta,
        schemas: action.schemas
      };
    }
    case 'UPDATE_SPEC_RES': {
      return {
        ...state,
        meta: action.meta,
        specs: action.specs
      };
    }
    case 'UPDATE_TEMPLATE_RES': {
      return {
        ...state,
        meta: action.meta,
        templates: action.templates
      };
    }
    case 'UPDATE_ICON_RES': {
      return {
        ...state,
        icon: action.icon
      };
    }
    case 'CHANGE_COLOR_RES': {
      return {
        ...state,
        color: action.color
      };
    }
    case 'FAVORITE_REQ': {
      return {
        ...state,
        isFavorite: true
      };
    }
    case 'FAVORITE_RES': {
      return {
        ...state,
        isFavorite: true
      };
    }
    case 'UNFAVORITE_REQ': {
      return {
        ...state,
        isFavorite: false
      };
    }
    case 'UNFAVORITE_RES': {
      return {
        ...state,
        isFavorite: false
      };
    }
    default: {
      return state;
    }
  }
}

export default projectReducer;
