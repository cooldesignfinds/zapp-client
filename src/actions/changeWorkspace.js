export default function changeWorkspace({ workspace }) {
  localStorage.setItem('workspace', workspace);
  return {
    type: 'CHANGE_WORKSPACE',
    workspace
  };
}
