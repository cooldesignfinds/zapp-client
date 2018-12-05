function setTitle(title = '') {
  document.title = title;
  return {
    type: 'SET_TITLE',
    title
  };
}

export default setTitle;
