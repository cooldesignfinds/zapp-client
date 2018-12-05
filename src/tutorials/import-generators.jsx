import { List, OrderedMap } from 'immutable';
import React, { Fragment } from 'react';

import generate from '../actions/generate';
import hideHint from '../actions/hideHint';
import hideModal from '../actions/hideModal';
import hideSelector from '../actions/hideSelector';
import loadImports from '../actions/loadImports';
import tutorialNext from '../actions/tutorialNext';
import updateItem from '../actions/updateItem';

import Recommendations from '../components/recommendations/Recommendations';
import SubmitButton from '../components/submit-button/SubmitButton';

import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialGeneratorState = {
  type: 'LOAD_PROJECT_RES',
  id: 'none',
  name: 'tutorial',
  code: OrderedMap(),
  color: '#e2de51',
  configuration: 'default',
  configs: OrderedMap(),
  engines: OrderedMap(),
  icon: 'generator-white',
  meta: OrderedMap(),
  path: 'untitled',
  generators: OrderedMap(),
  imports: OrderedMap(),
  importsData: List(),
  schemas: objectToOrderedMap({
    app: {
      type: 'object'
    }
  }),
  specs: OrderedMap(),
  templates: OrderedMap(),
  version: 'latest'
};

let currentDispatch;

export default {
  name: 'tour',
  items: {},
  steps: [
    {
      type: 'modal',
      content: (
        <Fragment>
          <h2>How to Import Generators</h2>
          <p>
            In this tutorial, we'll look at how to import other generators into our generator to make it better.
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
      element: '#import-button',
      title: 'Import Generator',
      content: (
        <div>
          First, click the <b>Import Generator</b> button.
        </div>
      ),
      hideButtons: true,
      enabledElements: [
        'import-button'
      ]
    },
    {
      element: '#selector',
      content: (
        <div>
          Now choose the <b>zappjs/readme</b> selector.
        </div>
      ),
      enabledElements: [
        'selector_zappjs_readme'
      ]
    },
    {
      element: '#imports',
      content: (
        <div>
          The <b>zappjs/readme</b> has been added to your project.
        </div>
      ),
      enabledElements: [
        'imports'
      ],
      onLoad: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Type <b>app</b> and press tab.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/_key',
        'selector_app'
      ],
      onLoad: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: [],
          itemValue: {}
        }));
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/_key').select();
        }, 200);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app'],
          itemValue: {}
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Now, enter <b>title</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_key',
        'selector_title'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_key').select();
        }, 100);
      }
    },
    {
      element: '#pane-0_editor-item_/app/_value',
      content: (
        <div>
          Then, enter a title.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_value').select();
        }, 100);
      },
      onComplete: ({ dispatch, response }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app', 'title'],
          itemValue: response
        }));
        dispatch(generate());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Now, enter <b>version</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_key',
        'selector_version'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_key').select();
        }, 100);
      }
    },
    {
      elements: [
        'pane-0_editor-item_/app/version_value',
        'pane-0_editor-item_/app/_value'
      ],
      content: (
        <div>
          Then, enter a version such as 1.0.0
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_value').select();
        }, 100);
      },
      onComplete: ({ dispatch, response }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app', 'version'],
          itemValue: response
        }));
        dispatch(generate());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Now, enter <b>description</b> about your app.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_key',
        'selector_description'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_key').select();
        }, 100);
      }
    },
    {
      element: '#pane-0_editor-item_/app/_value',
      content: (
        <div>
          Then, enter a description.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_value').select();
        }, 100);
      },
      onComplete: ({ dispatch, response }) => {
        dispatch(hideHint());
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app', 'description'],
          itemValue: response
        }));
        dispatch(generate());
      }
    },
    {
      element: '#pane-1_tree-item_/README.md',
      content: (
        <div>
          Check out the generated code.
        </div>
      ),
      onComplete: ({ dispatch }) => {
        dispatch(hideHint());
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
