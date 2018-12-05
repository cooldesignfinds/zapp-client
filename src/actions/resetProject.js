import hideModal from './hideModal';

function resetProject(id, type) {
  return (dispatch) => {
    dispatch({
      type: 'RESET_PROJECT_REQ'
    });
    if (type === 'generator') {
      localStorage.removeItem(`generators/${id}`);
    } else {
      localStorage.removeItem(`projects/${id}`);
    }
    dispatch({
      type: 'RESET_PROJECT_RES'
    });
    dispatch(hideModal());
  };
}

export default resetProject;
