import semver from 'semver';

export default function validateZappVersion(version = '0.0.0') {
  const cleanVersion = semver.coerce(version);
  if (semver.satisfies(cleanVersion, '>=0.7.1')) {
    return true;
  }
  return false;
}
