import os from 'os';
import path from 'path';

export default function getWorkspaceDir(dir = '/') {
  const workspaceDir = localStorage.getItem('workspace')
    ? localStorage.getItem('workspace')
    : '~/ZappJS';

  const normalizedWorkspaceDir = workspaceDir.substr(0, 1) === '~'
    ? `${os.homedir()}/${workspaceDir.substr(1)}`
    : workspaceDir;

  const normalizedDir = path.normalize(`${normalizedWorkspaceDir}/${dir}`);

  return normalizedDir;
}
