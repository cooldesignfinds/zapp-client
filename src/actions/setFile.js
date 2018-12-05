import getItemPathParts from '../lib/getItemPathParts';

export default function setFile({ contents, filename }) {
  return {
    type: 'LOAD_CODE_RES',
    code: atob(contents),
    path: getItemPathParts(filename)
  };
}
