import yaml from 'js-yaml';

import isObject from './isObject';

function objectToFilesInternal(object, parentDir = '.') {
  let files = [];
  const value = object;

  if (isObject(value)) {
    const values = {};
    Object.keys(value).forEach((k) => {
      const filename = `${parentDir}/${encodeURIComponent(k)}`;
      const v = value[k];
      if (isObject(v)) {
        files = files.concat(objectToFilesInternal(v, filename));
        return;
      }
      values[k] = v;
    });
    files.push({
      filename: `${parentDir}.yml`,
      content: yaml.safeDump(values)
    });
    return files;
  }

  files.push({
    filename: `${parentDir}.yml`,
    content: yaml.safeDump(value)
  });
  return files;
}

export default function objectToFiles(object, parentDir = '.') {
  return objectToFilesInternal(object, parentDir)
    .sort((a, b) => {
      if (a.filename < b.filename) {
        return -1;
      } else if (a.filename > b.filename) {
        return 1;
      }
      return 0;
    });
}
