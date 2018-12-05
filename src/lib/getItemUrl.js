import { parse, stringify } from 'qs';

export default function getItemUrl({
  paneIndex = 0,
  paneType = 'specs',
  itemPath = '/'
}) {
  const params = parse(location.search.substr(1));
  if (!Array.isArray(params.pane)) {
    params.pane = [];
  }
  params.pane[paneIndex] = `/${paneType}${itemPath}`;
  params.selectedPane = paneIndex;
  const stringifiedParams = stringify(params, { arrayFormat: 'indices' });
  return `${location.pathname}?${decodeURIComponent(stringifiedParams)}`;
}
