import action from '../lib/action';
import listFiles from './listFiles';

async function expandPaneTreeItem({
  data: {
    paneIndex, itemPath, itemPathParts
  },
  dispatch
}) {
  dispatch({
    type: 'EXPAND_PANE_TREE_ITEM',
    itemPath,
    itemPathParts,
    paneIndex
  });
  dispatch(listFiles());
}

export default action(expandPaneTreeItem);