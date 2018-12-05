export default function updateChangeUrl({ paneIndex, changeUrl }) {
  return {
    type: 'UPDATE_CHANGE_URL',
    changeUrl,
    paneIndex
  };
}
