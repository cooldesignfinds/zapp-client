import toArrayValue from './toArrayValue';
import toBooleanValue from './toBooleanValue';
import toCodeValue from './toCodeValue';
import toLinkValue from './toLinkValue';
import toNullValue from './toNullValue';
import toNumberValue from './toNumberValue';
import toObjectValue from './toObjectValue';
import toStringValue from './toStringValue';

export default function toValue(value, toType, fromType) {
  const valueTypes = {
    array: toArrayValue,
    boolean: toBooleanValue,
    code: toCodeValue,
    link: toLinkValue,
    null: toNullValue,
    number: toNumberValue,
    object: toObjectValue,
    string: toStringValue
  };
  if (!valueTypes[toType]) {
    throw new Error(`Unknown type: ${toType}`);
  }
  return valueTypes[toType](value, fromType);
}
