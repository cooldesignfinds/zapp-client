export default function updateNewItemPath({
  itemPath,
  paneIndex
}) {
  return {
    type: 'UPDATE_NEW_ITEM_PATH',
    itemPath,
    paneIndex
  };
}
