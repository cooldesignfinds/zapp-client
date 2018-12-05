import action from '../lib/action';

import updateTutorial from './updateTutorial';

async function startTutorial({
  data: {
    name,
    steps
  },
  dispatch
}) {
  dispatch({
    type: 'START_TUTORIAL',
    show: true,
    name,
    steps
  });
  dispatch(updateTutorial({
    stepIndex: 0
  }));
}

export default action(startTutorial);
