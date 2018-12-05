export default function splitPane({ paneIndex }) {
  return {
    type: 'SPLIT_PANE',
    paneIndex
  };
}
