import action from '../lib/action';

import showHint from './showHint';
import showModal from './showModal';

import getQuerySelector from '../lib/getQuerySelector';

function updateTutorial({
  data: {
    response,
    stepIndex
  },
  dispatch,
  getState
}) {
  const state = getState();

  const previousStep = state.tutorial.steps[stepIndex - 1];
  const currentStep = state.tutorial.steps[stepIndex];

  if (previousStep && previousStep.onComplete) {
    previousStep.onComplete({ dispatch, response, state, getState });
  }

  dispatch({
    type: 'UPDATE_TUTORIAL',
    enabledElements: currentStep.enabledElements,
    stepIndex,
    value: currentStep.value
  });

  if (currentStep.onLoad) {
    currentStep.onLoad({ dispatch, state, getState });
  }

  const buttons = [];
  if (!currentStep.hideButtons) {
    if (stepIndex !== 0) {
      // buttons.push({
      //   onClick: () => {
      //     const newState = getState();
      //     const newStepIndex = newState.tutorial.stepIndex - 1;
      //     const fn = action(updateTutorial);
      //     dispatch(fn({
      //       stepIndex: newStepIndex
      //     }));
      //   },
      //   text: 'Back',
      //   value: 'back'
      // });
    }
    buttons.push({
      onClick: () => {
        const newState = getState();
        const newStepIndex = newState.tutorial.stepIndex + 1;
        const fn = action(updateTutorial);
        dispatch(fn({
          stepIndex: newStepIndex
        }));
      },
      text: 'Next',
      value: 'next'
    });
  }

  if (currentStep.type === 'modal') {
    dispatch(showModal({
      content: currentStep.content
    }));
  } else {
    dispatch(showHint({
      name,
      elements: currentStep.elements || [currentStep.element],
      target: currentStep.elements
        ? currentStep.elements
          .map((element) => {
            return document.querySelector(getQuerySelector(element));
          })
          .filter(element => element !== null)[0]
        : document.querySelector(getQuerySelector(currentStep.element)),
      title: currentStep.title,
      message: `${stepIndex + 1} of ${state.tutorial.steps.length}`,
      content: currentStep.content,
      buttons,
      left: currentStep.left || 'auto',
      top: currentStep.top || 'auto',
      width: currentStep.width || 'auto'
    }));
  }
}

export default action(updateTutorial);
