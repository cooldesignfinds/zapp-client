export default function isLinkItem(val) {
  if (
    val
      && val.getType
      && typeof val.getType === 'function'
      && val.getType() === 'link'
  ) {
    return true;
  }
  return false;
}
