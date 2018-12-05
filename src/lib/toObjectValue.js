import getItemType from './getItemType';

export default function toObject(value) {
  const itemType = getItemType(value);
  if (itemType === 'object') {
    return value;
  }
  return {};
}
