import LinkItem from './LinkItem';

export default function toLinkValue(value, fromType) {
  let linkValue;
  if (fromType === 'link') {
    return value;
  } else if (fromType === 'boolean') {
    linkValue = fromType === true ? 'true' : 'false';
  } else if (fromType === 'null') {
    linkValue = 'null';
  } else if (fromType === 'array' || fromType === 'object') {
    linkValue = '';
  } else {
    linkValue = value.toString();
  }
  const linkItem = new LinkItem();
  linkItem.setValue(linkValue);
  return linkItem;
}
