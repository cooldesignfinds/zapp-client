export default function toNumberValue(value) {
  const numberValue = parseFloat(value, 10);
  if (Number.isNaN(numberValue)) {
    return 0;
  }
  return numberValue;
}
