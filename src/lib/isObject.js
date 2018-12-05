export default function isObject(object) {
  if (typeof object === 'object' && !Array.isArray(object)) {
    return true;
  }
  return false;
}
