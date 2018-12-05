export default function expandPaneTreeItem({ paneIndex, itemPath, itemPathParts }) {
  return {
    type: 'EXPAND_PANE_TREE_ITEM',
    itemPath,
    itemPathParts,
    paneIndex
  };
}
