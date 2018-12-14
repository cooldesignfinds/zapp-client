import getItemType from '../lib/getItemType';
import getItemPathParts from '../lib/getItemPathParts';

export default function cleanMeta({
  r,
  newItems,
  paneType
}) {
  if (r.has('specs')) {
    const specs = r.get('specs');
    [...specs.keys()].forEach((specItemPath) => {
      const specItemPathParts = getItemPathParts(specItemPath);
      const spec = newItems.getIn(specItemPathParts);
      const specItemType = specs.hasIn([specItemPath, 'type'])
        ? specs.getIn([specItemPath, 'type'])
        : getItemType(spec);
      if (!['code', 'link', 'object'].includes(specItemType)) {
        r.deleteIn([paneType, specItemPath]);
      }
    });
  }
}
