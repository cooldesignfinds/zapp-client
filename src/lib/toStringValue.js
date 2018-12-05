export default function toStringValue(value, fromType) {
  if (fromType === 'boolean') {
    return value === true ? 'true' : 'false';
  } else if (fromType === 'null') {
    return 'null';
  } else if (fromType === 'array' || fromType === 'object') {
    return '';
  }
  return value.toString();
}
