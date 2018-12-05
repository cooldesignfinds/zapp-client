export default function getPath(itemPathPartsParts = []) {
  return `/${itemPathPartsParts.map(key => encodeURIComponent(key)).join('/')}`;
}
