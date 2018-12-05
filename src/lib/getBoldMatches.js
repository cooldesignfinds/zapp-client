export default function getBoldMatches(string, expression) {
  const regExp = new RegExp(`(${expression})`, 'ig');
  const value = string.replace(regExp, '<b>$1</b>');
  return value;
}
