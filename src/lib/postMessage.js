import Bluebird from 'bluebird';
import uuid from 'uuid';

let ipcRenderer;

if (window && window.process && window.process.type) {
  // ipcRenderer = require('electron').ipcRenderer;
  // ipcRenderer.on('reject', (event, data) => {
  //   window.handlers[data.id].resolve();
  //   delete window.handlers[data.id];
  // });
  //
  // ipcRenderer.on('resolve', (event, data) => {
  //   window.handlers[data.id].resolve();
  //   delete window.handlers[data.id];
  // });
}

export default function postMessage(type, data) {
  return new Bluebird((resolve, reject) => {
    const id = uuid.v4();
    window.webkit.messageHandlers.jsHandler.postMessage(JSON.stringify({
      id,
      action: type,
      ...data
    }));
    window.handlers[id] = { resolve, reject };
  });
  //
  // if (window && window.process && window.process.type) {
  //   return new Bluebird((resolve, reject) => {
  //     const id = uuid.v4();
  //     window.handlers[id] = { resolve, reject };
  //     ipcRenderer.send(type, { id, data });
  //   });
  // }
  return Bluebird.resolve({});
}
