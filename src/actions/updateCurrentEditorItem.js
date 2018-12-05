export default function updateCurrentEditorItem({
  field,
  itemIsNew,
  itemKey,
  itemMode,
  itemPathParts,
  itemType,
  itemPath,
  itemValue,
  paneIndex
}) {
  console.log('updateCurrentEditorItem');
  console.log({
    field,
    itemIsNew,
    itemKey,
    itemMode,
    itemPathParts,
    itemType,
    itemPath,
    itemValue,
    paneIndex
  });
  return {
    type: 'UPDATE_CURRENT_EDITOR_ITEM',
    field,
    itemIsNew,
    itemKey,
    itemMode,
    itemPathParts,
    itemType,
    itemPath,
    itemValue,
    paneIndex
  };
}
