import { List, OrderedMap } from 'immutable';
import React, { Fragment } from 'react';

import hideHint from '../actions/hideHint';
import hideModal from '../actions/hideModal';
import hideSelector from '../actions/hideSelector';
import loadImports from '../actions/loadImports';
import tutorialNext from '../actions/tutorialNext';
import updateItem from '../actions/updateItem';

import Recommendations from '../components/recommendations/Recommendations';
import SubmitButton from '../components/submit-button/SubmitButton';

import CodeItem from '../lib/CodeItem';
import getQuerySelector from '../lib/getQuerySelector';
import getRandomTutorialRecommendation from '../lib/getRandomTutorialRecommendation';
import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialGeneratorState = {
  type: 'LOAD_PROJECT_RES',
  id: 'none',
  name: 'tutorial',
  code: OrderedMap(),
  color: '#d14cfc',
  configuration: 'default',
  configs: OrderedMap(),
  engines: OrderedMap(),
  files: OrderedMap(),
  icon: 'template-white',
  meta: OrderedMap(),
  path: 'untitled',
  generators: OrderedMap(),
  imports: OrderedMap(),
  importsData: List(),
  schemas: OrderedMap(),
  specs: OrderedMap(),
  templates: OrderedMap(),
  version: 'latest'
};

let currentDispatch;

export default {
  name: 'tour',
  items: {},
  steps: [
    // {
    //   type: 'modal',
    //   content: (
    //     <Fragment>
    //       <h2>Thank you!</h2>
    //       <p>
    //         Hope you enjoyed this tutorial. Please try others below:
    //       </p>
    //       <Recommendations
    //         items={getRandomTutorialRecommendation()}
    //       />
    //     </Fragment>
    //   ),
    //   onLoad: ({ dispatch }) => {
    //     currentDispatch = dispatch;
    //   }
    // },
    {
      type: 'modal',
      content: (
        <Fragment>
          <h2>How to Create Templates</h2>
          <p>
            Code Templates determine what your code output will look like.
          </p>
          <SubmitButton
            onClick={() => {
              currentDispatch(hideModal());
              currentDispatch(tutorialNext());
            }}
          >
            Start Tutorial
          </SubmitButton>
        </Fragment>
      ),
      onLoad: ({ dispatch }) => {
        currentDispatch = dispatch;
        dispatch(initialGeneratorState);
      }
    },
    {
      element: '#pane-1_pane-selector',
      title: 'Pane Selector',
      content: (
        <div>
          First, open the <b>Pane Selector</b> for the right pane.
        </div>
      ),
      hideButtons: true,
      enabledElements: [
        'pane-1_pane-selector'
      ]
    },
    {
      element: '#selector',
      content: (
        <div>
          Now choose the <b>Templates</b> pane.
        </div>
      ),
      enabledElements: [
        'pane-1_pane-selector_templates'
      ],
      onComplete: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          We'll call our new template <b>readme</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/_key',
        'selector_readme'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'templates',
          itemPathParts: ['readme'],
          itemValue: {}
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Then we'll add a key called <b>template</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/readme/_key',
        'selector_template'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/readme/_key').focus();
        }, 100);
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Enter <b>markdown</b> as the template mode.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/readme/_mode',
        'selector_markdown'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/readme/_mode').focus();
        }, 1);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'templates',
          itemPathParts: ['readme', 'template'],
          itemValue: new CodeItem({
            mode: 'markdown',
            value: ''
          })
        }));
      }
    },
    {
      element: '#pane-1_editor-item_/readme/template_value',
      content: (
        <div>
          Now's let add a <b>template</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/readme/template_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.querySelector(getQuerySelector('#pane-1_editor-item_/readme/template_value textarea')).focus();
        }, 200);
      },
      onComplete: ({ dispatch, response }) => {
        dispatch(hideHint());
        dispatch(updateItem({
          paneType: 'templates',
          itemPathParts: ['readme', 'template'],
          itemValue: new CodeItem({
            mode: 'markdown',
            value: response
          })
        }));
      }
    },
    {
      type: 'modal',
      content: (
        <Fragment>
          <h2>Thank you!</h2>
          <p>
            Hope you enjoyed this tutorial. Please try others below:
          </p>
          <Recommendations />
        </Fragment>
      ),
      onLoad: ({ dispatch }) => {
        currentDispatch = dispatch;
      }
    }
  ]
};
