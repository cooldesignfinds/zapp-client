export default function togglePaneTree({ paneIndex }) {
  return {
    type: 'TOGGLE_PANE_TREE',
    paneIndex
  };
}
