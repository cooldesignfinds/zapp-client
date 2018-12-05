import _ from 'lodash';

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return srcValue;
    return objValue.concat(srcValue);
  }
}

export default function merge(a, b) {
  if (Array.isArray(a)) {
    return b;
    return a.concat(b);
  } else if (typeof a === 'object') {
    return _.mergeWith(a, b, customizer);
  }
  return b;
}
