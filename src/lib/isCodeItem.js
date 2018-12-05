export default function isCodeItem(val) {
  if (
    val
      && val.getType
      && typeof val.getType === 'function'
      && val.getType() === 'code'
  ) {
    return true;
  }
  return false;
}
