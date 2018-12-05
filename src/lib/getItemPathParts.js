export default function getItemPathParts(itemPath = '/') {
  return itemPath === '/' ? [] : itemPath.replace(/^\//, '').split('/').map(key => decodeURIComponent(key));
}
