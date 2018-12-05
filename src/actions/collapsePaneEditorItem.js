export default function collapsePaneEditorItem(paneIndex, itemPath) {
  return {
    type: 'COLLAPSE_PANE_EDITOR_ITEM',
    itemPath,
    paneIndex
  };
}
