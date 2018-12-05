import { List, OrderedMap } from 'immutable';
import React, { Fragment } from 'react';

import closePane from '../actions/closePane';
import hideHint from '../actions/hideHint';
import hideModal from '../actions/hideModal';
import hideSelector from '../actions/hideSelector';
import loadImports from '../actions/loadImports';
import setPaneType from '../actions/setPaneType';
import tutorialNext from '../actions/tutorialNext';
import updateItem from '../actions/updateItem';

import Recommendations from '../components/recommendations/Recommendations';
import SubmitButton from '../components/submit-button/SubmitButton';

import getRandomTutorialRecommendation from '../lib/getRandomTutorialRecommendation';
import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialGeneratorState = {
  type: 'LOAD_PROJECT_RES',
  id: 'none',
  name: 'tutorial',
  code: OrderedMap(),
  color: '#000',
  configuration: 'default',
  configs: OrderedMap(),
  engines: OrderedMap(),
  files: OrderedMap(),
  history: [],
  icon: 'code-white',
  meta: OrderedMap(),
  path: 'untitled',
  generators: OrderedMap(),
  imports: objectToOrderedMap({
    zappjs: {
      react: 'latest',
      readme: 'latest',
      npm: 'latest',
      webpack: 'latest'
    }
  }),
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
          <h2>How to Browse Code</h2>
          <p>
            Browsing generated code helps you catch mistakes.
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
        dispatch(closePane({ paneIndex: 1 }));
        dispatch(setPaneType(0, 'code'));
        dispatch(initialGeneratorState);
        dispatch(loadImports());
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
          Now choose the <b>Files</b> pane.
        </div>
      ),
      enabledElements: [
        'pane-1_pane-selector_files'
      ],
      onComplete: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          We'll call our new file <b>README.md</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/_key',
        'selector_README.md'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'files',
          itemPathParts: ['README.md'],
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
        'pane-1_editor-item_/README.md/_key',
        'selector_template'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/README.md/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'files',
          itemPathParts: ['README.md', 'template'],
          itemValue: ''
        }));
      }
    },
    {
      element: '#pane-1_editor-item_/README.md/template_value',
      content: (
        <div>
          Enter <b>readme</b> as the template.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/README.md/template_value',
        'selector_object'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/README.md/template_value').focus();
        }, 200);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['README.md', 'template'],
          itemValue: 'readme'
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Now's let add an <b>engine</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/README.md/_key',
        'selector_engine'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/README.md/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['README.md', 'engine'],
          itemValue: ''
        }));
      }
    },
    {
      element: '#pane-1_editor-item_/README.md/engine_value',
      content: (
        <div>
          Enter <b>handlebars</b> as the template.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/README.md/engine_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/README.md/engine_value').focus();
        }, 200);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['README.md', 'engine'],
          itemValue: 'handlebars'
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
