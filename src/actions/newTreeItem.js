export default function newTreeItem(paneIndex, itemPath) {
  return {
    type: 'NEW_TREE_ITEM',
    itemPath,
    paneIndex
  };
}
