export default function resetCurrentEditorItem({ paneIndex }) {
  return {
    type: 'RESET_CURRENT_EDITOR_ITEM',
    paneIndex
  };
}
