export default function init() {
  window.webkit.messageHandlers.init.postMessage(
    JSON.stringify({})
  );
  return {
    type: 'INIT'
  };
}
