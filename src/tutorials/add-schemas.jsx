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

import getRandomTutorialRecommendation from '../lib/getRandomTutorialRecommendation';
import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialGeneratorState = {
  type: 'LOAD_PROJECT_RES',
  id: 'none',
  name: 'tutorial',
  code: OrderedMap(),
  color: '#f44a4a',
  configuration: 'default',
  configs: OrderedMap(),
  engines: OrderedMap(),
  icon: 'schema-white',
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
  name: 'add-schemas',
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
          <h2>How to Add Schemas</h2>
          <p>
            Schemas validate specs and help guide us with automated suggestions.
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
          Now choose the <b>Schemas</b> pane.
        </div>
      ),
      enabledElements: [
        'pane-1_pane-selector_schemas'
      ],
      onComplete: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          We'll call our new schema <b>app</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/_key',
        'selector_app'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app'],
          itemValue: {}
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Then we'll add a key called <b>type</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/app/_key',
        'selector_type'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/app/_key').focus();
        }, 100);
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Let's declare our <b>app</b> schema as an <b>object</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/app/_value',
        'selector_object'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/app/_value').focus();
        }, 200);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'type'],
          itemValue: 'object'
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Now's let add some <b>properties</b> to our app schema.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/app/_key',
        'selector_properties'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/app/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties'],
          itemValue: {}
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Let's call our new property <b>name</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/app/properties/_key',
        'selector_name'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/app/properties/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties', 'name', 'type'],
          itemValue: ''
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Enter <b>string</b> as the type.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/app/properties/name/type_value',
        'selector_string'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/app/properties/name/type_value').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties', 'name', 'type'],
          itemValue: 'string'
        }));
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties', 'name', 'description'],
          itemValue: ''
        }));
      }
    },
    {
      element: '#pane-1_editor-item_/app/properties/name/description_value',
      content: (
        <div>
          Enter a <b>description</b>.
        </div>
      ),
      enabledElements: [
        'pane-1_editor-item_/app/properties/name/description_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-1_editor-item_/app/properties/name/description_value').focus();
        }, 100);
      },
      onComplete: ({ dispatch, response }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties', 'name', 'description'],
          itemValue: response
        }));
      }
    },
    {
      element: '#pane-1_editor-item_/app/properties/_key',
      content: (
        <div>
          To save you time, we'll add a couple more properties for you.
        </div>
      ),
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties', 'version'],
          itemValue: {
            type: 'string',
            description: 'the app version'
          }
        }));
        dispatch(updateItem({
          paneType: 'schemas',
          itemPathParts: ['app', 'properties', 'description'],
          itemValue: {
            type: 'string',
            description: 'the app description'
          }
        }));
      }
    },
    {
      element: '#pane-1_editor-item_/app/properties/_key',
      content: (
        <div>
          Voila! How many tutorials will do that for you??
        </div>
      )
    },
    {
      element: '#pane-1_editor-item_/app/properties/_key',
      content: (
        <div>
          Anyways, now that we've added a new schema and a few properties, let's try it out by adding a few specs!
        </div>
      )
    },
    {
      element: '#selector',
      content: (
        <div>
          Ohhhhkay! Notice something familiar about this suggestion?
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/_key'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#pane-1_editor-item_/app_key',
      content: (
        <div>
          It's named <b>app</b> just like our schema over here!
        </div>
      )
    },
    {
      element: '#selector',
      content: (
        <div>
          Let's use it to start writing specs for our new application.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/_key',
        'selector_app'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/_key').focus();
        }, 100);
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
          Now look what happened! Our schemas made more specs available.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_key'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_key').focus();
        }, 100);
      },
      onComplete({ dispatch }) {
        dispatch(hideHint());
        dispatch(hideSelector());
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
