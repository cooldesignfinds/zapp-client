export default function getQuerySelector(querySelector) {
  const selectors = querySelector
    .split(' ')
    .map((selector) => {
      if (selector.substr(0, 1) === '.') {
        return `.${CSS.escape(selector.substr(1))}`;
      } else if (selector.substr(0, 1) === '#') {
        return `#${CSS.escape(selector.substr(1))}`;
      }
      return CSS.escape(selector);
    });
  return selectors.join(' ');
}
