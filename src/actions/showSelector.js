function showSelector({
  name = '',
  title = '',
  target = {},
  data = {},
  options = [],
  left = 'auto',
  top = 'auto',
  width = 'auto',
  searchPlaceholder,
  showSearch = false
}) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_SELECTOR',
      name,
      title,
      target,
      data,
      options,
      left,
      top,
      width,
      searchPlaceholder,
      showSearch
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  };
}

export default showSelector;
