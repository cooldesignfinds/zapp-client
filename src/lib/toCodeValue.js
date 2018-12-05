import CodeItem from './CodeItem';

export default function toCodeValue(value, fromType) {
  let codeValue;
  if (fromType === 'code') {
    return value;
  } else if (fromType === 'boolean') {
    codeValue = fromType === true ? 'true' : 'false';
  } else if (fromType === 'null') {
    codeValue = 'null';
  } else {
    codeValue = value.toString();
  }
  const codeItem = new CodeItem();
  codeItem.setMode('text');
  codeItem.setValue(codeValue);
  return codeItem;
}
