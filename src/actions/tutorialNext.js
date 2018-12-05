import action from '../lib/action';

import updateTutorial from './updateTutorial';

function tutorialNext({
  data,
  dispatch,
  getState
}) {
  const state = getState();

  dispatch(updateTutorial({
    response: data.response,
    stepIndex: state.tutorial.stepIndex + 1
  }));
}

export default action(tutorialNext);
