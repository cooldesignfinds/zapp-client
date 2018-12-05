import loadImports from '../lib/loadImports';
import objectToOrderedMap from '../lib/objectToOrderedMap';
import orderedMapToObject from '../lib/orderedMapToObject';

import generate from './generate';

export default function loadImportsAction() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: 'LOAD_IMPORTS_REQ'
    });
    loadImports(orderedMapToObject(state.project.imports))
      .then((importsData) => {
        const importsDataMap = objectToOrderedMap(importsData);
        dispatch({
          type: 'LOAD_IMPORTS_RES'
        });
        dispatch({
          type: 'UPDATE_IMPORT_DATA_RES',
          importsData: importsDataMap
        });
        dispatch({
          type: 'GENERATE_REQ'
        });
        setTimeout(() => {
          dispatch(generate());
        }, 500);
      });
  };
}
