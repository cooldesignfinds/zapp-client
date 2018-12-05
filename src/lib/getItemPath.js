export default function getItemPath(itemPathParts = []) {
  return `/${itemPathParts.map(key => encodeURIComponent(key)).join('/')}`;
}
