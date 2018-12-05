export default function showHint({
  buttons = [],
  elements = [],
  name = '',
  title = '',
  message = '',
  target = {},
  data = {},
  content = '',
  left = 'auto',
  top = 'auto',
  width = 'auto'
}) {
  return (dispatch) => {
    dispatch({
      type: 'SHOW_HINT',
      buttons,
      elements,
      name,
      title,
      target,
      message,
      data,
      content,
      left,
      top,
      width
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  };
}
