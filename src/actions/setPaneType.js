export default function setPaneType(paneIndex, paneType) {
  return {
    type: 'SET_PANE_TYPE',
    paneIndex,
    paneType
  };
}
