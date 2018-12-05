export default function getZappVersion() {
  const userAgent = navigator.userAgent.match(/ZappJS\/[0-9]+\.[0-9]+\.[0-9]+/);
  if (!userAgent || !userAgent.length) {
    return '0.0.0';
  }
  const zappInfo = userAgent[0].split('/');
  return zappInfo[1];
}
