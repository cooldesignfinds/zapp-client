export default function expandPaneEditorItem({ paneIndex, itemPath, itemPathParts }) {
  return {
    type: 'EXPAND_PANE_EDITOR_ITEM',
    itemPath,
    itemPathParts,
    paneIndex
  };
}
