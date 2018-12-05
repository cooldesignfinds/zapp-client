import generate from './generate';

export default function redo() {
  return (dispatch) => {
    dispatch({
      type: 'REDO'
    });
    dispatch(generate({ ignoreChanges: true }));
  };
}
