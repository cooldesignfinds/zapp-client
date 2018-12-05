export default function closeTerminal({ itemId }) {
  return {
    type: 'CLOSE_TERMINAL',
    itemId
  };
}
