export default function collapsePaneTreeItem(paneIndex, itemPath) {
  return {
    type: 'COLLAPSE_PANE_TREE_ITEM',
    itemPath,
    paneIndex
  };
}
