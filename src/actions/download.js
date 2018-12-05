import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import action from '../lib/action';

async function download({ state }) {
  const zip = new JSZip();
  Object.keys(state.project.codeFiles).forEach((codeFile) => {
    zip.file(codeFile, state.project.codeFiles[codeFile]);
  });
  const content = await zip.generateAsync({ type: 'blob' });
  const filename = `${state.project.name}-${state.project.version}${state.project.configuration !== 'default' ? `-${state.project.configuration}` : ''}.zip`;
  saveAs(content, filename);
}

export default action(download);
