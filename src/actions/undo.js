import generate from './generate';

export default function undo() {
  return (dispatch) => {
    dispatch({
      type: 'UNDO'
    });
    dispatch(generate({ ignoreChanges: true }));
  };
}
