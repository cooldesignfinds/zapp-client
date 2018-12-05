export default function formatPaneName(name, plural = false) {
  const firstLetter = name.substr(0, 1).toUpperCase();
  const letters = name.substr(1, name.length - (plural || name === 'code' ? 1 : 2));
  return `${firstLetter}${letters}`;
}
