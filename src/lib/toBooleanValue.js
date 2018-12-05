export default function toBooleanValue(value, fromType) {
  if (fromType === 'number') {
    return value === 1;
  } else if (fromType === 'string') {
    return value === '1' || value === 'true' || value === 'yes';
  }
  return !!value;
}
