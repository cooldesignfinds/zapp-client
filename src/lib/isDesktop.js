export default function isDesktop() {
  if (window && window.process && window.process.type) {
    return true;
  }
  return false;
}
