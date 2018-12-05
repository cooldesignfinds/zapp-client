export default function closePane({ paneIndex }) {
  return {
    type: 'CLOSE_PANE',
    paneIndex
  };
}
