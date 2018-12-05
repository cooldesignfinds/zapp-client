function showModal(opts) {
  if (typeof opts === 'string') {
    return {
      type: 'SHOW_MODAL',
      modal: opts
    };
  }
  const { content } = opts;
  return {
    type: 'SHOW_MODAL',
    modal: 'content',
    content
  };
}

export default showModal;
