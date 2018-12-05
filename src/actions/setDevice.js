export default function setDevice({
  macAddress,
  serialNumber
}) {
  return {
    type: 'SET_DEVICE',
    macAddress,
    serialNumber
  };
}
