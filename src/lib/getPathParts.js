export default function getPathParts(itemPath = '/') {
  return itemPath === '/' ? [] : itemPath.replace(/^\//, '').split('/').map(key => decodeURIComponent(key));
}
