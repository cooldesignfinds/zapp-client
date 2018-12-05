export default function focusPane({ paneIndex }) {
  return {
    type: 'FOCUS_PANE',
    paneIndex
  };
}
