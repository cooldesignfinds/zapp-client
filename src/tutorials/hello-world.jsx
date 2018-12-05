import { List, OrderedMap } from 'immutable';
import React, { Fragment } from 'react';
import semver from 'semver';

import expandPaneTreeItem from '../actions/expandPaneTreeItem';
import generate from '../actions/generate';
import hideHint from '../actions/hideHint';
import hideModal from '../actions/hideModal';
import hideSelector from '../actions/hideSelector';
import selectPaneTreeItem from '../actions/selectPaneTreeItem';
import tutorialNext from '../actions/tutorialNext';
import updateItem from '../actions/updateItem';

import Recommendations from '../components/recommendations/Recommendations';
import SubmitButton from '../components/submit-button/SubmitButton';

import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialGeneratorState = {
  type: 'LOAD_PROJECT_RES',
  id: 'none',
  name: 'hello world',
  code: OrderedMap(),
  color: '#76cc71',
  configuration: 'default',
  configs: OrderedMap(),
  engines: OrderedMap(),
  files: OrderedMap(),
  icon: 'hello-world-white',
  meta: OrderedMap(),
  path: 'untitled',
  generators: OrderedMap(),
  imports: OrderedMap(),
  importsData: List(),
  schemas: objectToOrderedMap({
    app: {
      type: 'object',
      properties: {
        name: {
          description: 'the app name',
          type: 'string'
        },
        version: {
          description: 'the app version',
          type: 'version'
        },
        description: {
          description: 'the app description',
          type: 'string'
        }
      }
    }
  }),
  specs: OrderedMap(),
  templates: OrderedMap(),
  version: 'latest'
};

let currentDispatch;

export default {
  name: 'helloWorld',
  items: {},
  steps: [
    {
      type: 'modal',
      content: (
        <Fragment>
          <h2>Hello World</h2>
          <p>
            Learn how ZappJS works.
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
      element: '#imports-readme',
      content: (
        <div>
          <b>zappjs/readme</b> has been added to your project.
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
          document.getElementById('pane-0_editor-item_/_key').focus();
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
          Now, enter <b>name</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_key',
        'selector_name'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_key').focus();
        }, 100);
      }
    },
    {
      element: '#pane-0_editor-item_/app/_value',
      content: (
        <div>
          Then, enter a name for your application like <b>my-app</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_value').focus();
        }, 100);
      },
      onComplete: ({ dispatch, response }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app', 'name'],
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
          document.getElementById('pane-0_editor-item_/app/_key').focus();
        }, 100);
      }
    },
    {
      element: '#pane-0_editor-item_/app/_value',
      content: (
        <div>
          Then, enter a version such as <b>1.0.0</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch, response }) => {
        if (document.activeElement) {
          document.activeElement.blur();
        }
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app', 'version'],
          itemValue: semver.coerce(response || '1.0.0').version
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
          document.getElementById('pane-0_editor-item_/app/_key').focus();
        }, 100);
      }
    },
    {
      element: '#pane-0_editor-item_/app/_value',
      content: (
        <div>
          Then, enter a description (i.e <b>this is my app</b>).
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/_value'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/app/_value').focus();
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
          Check out the generated <b>README.md</b> file.
        </div>
      ),
      onLoad: () => {
        if (document.activeElement) {
          document.activeElement.blur();
        }
      },
      onComplete: ({ dispatch }) => {
        dispatch(hideHint());
      }
    },
    {
      element: '#import-button',
      content: (
        <div>
          Now let's add another generator.
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
          This time, we'll choose <b>zappjs/npm</b>.
        </div>
      ),
      enabledElements: [
        'selector_zappjs_npm'
      ]
    },
    {
      element: '#imports-npm',
      content: (
        <div>
          <b>zappjs/npm</b> has been added to your project.
        </div>
      ),
      onLoad: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Notice that we now have many more specs available.
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
      onComplete: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#pane-1_tree-item_/package.json',
      content: (
        <div>
          We also have a <b>package.json</b> file that already has the specs we've entered before.
        </div>
      )
    },
    {
      element: '#pane-0_editor-item_/app/version_value',
      content: (
        <div>
          Watch what happens if we update the <b>version</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/app/version_value'
      ],
      onLoad: ({ getState }) => {
        setTimeout(() => {
          const state = getState();
          document.getElementById('pane-0_editor-item_/app/version_value').focus();
          document.getElementById('pane-0_editor-item_/app/version_value').value = semver.inc(
            state.project.specs.getIn(['app', 'version']),
            'major'
          );
        }, 100);
      },
      onComplete: ({ dispatch, getState, response }) => {
        const state = getState();
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['app', 'version'],
          itemValue: semver.coerce(
            response || semver.inc(state.project.specs.getIn(['app', 'version']), 'major')
          ).version
        }));
        dispatch(generate());
      }
    },
    {
      element: '#pane-1_tree-item_/README.md',
      content: (
        <div>
          Look how the version has changed in our <b>README.md</b> file.
        </div>
      )
    },
    {
      element: '#pane-1_tree-item_/package.json',
      content: (
        <div>
          As well as our <b>package.json</b> file.
        </div>
      ),
      onLoad: ({ dispatch }) => {
        dispatch(selectPaneTreeItem({
          itemPathParts: ['package.json'],
          itemPath: '/package.json',
          paneIndex: 1
        }));
      }
    },
    {
      element: '#import-button',
      content: (
        <div>
          Let's add one more generator.
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
          Add <b>zappjs/react</b>.
        </div>
      ),
      enabledElements: [
        'selector_zappjs_react'
      ]
    },
    {
      element: '#imports-react',
      content: (
        <div>
          <b>zappjs/react</b> has been added to your project.
        </div>
      ),
      onLoad: ({ dispatch }) => {
        dispatch(hideSelector());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          There are even more specs available!
        </div>
      ),
      enabledElements: [
        'pane-0_tree-item_/'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_tree-item_//').focus();
        }, 100);
      }
    },
    {
      element: '#pane-1_tree-item_/package.json',
      content: (
        <div>
          Our <b>dependencies</b> have also been updated since we brought in <b>zappjs/react</b>.
        </div>
      )
    },
    {
      element: '#selector',
      content: (
        <div>
          Let's add a React component.
        </div>
      ),
      enabledElements: [
        'pane-0_tree-item_//',
        'selector_components'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_tree-item_//').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['components'],
          itemValue: {}
        }));
        dispatch(expandPaneTreeItem({
          itemPath: '/components',
          itemPathParts: ['components'],
          paneIndex: 0
        }));
        dispatch(generate());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Name the component <b>header</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_tree-item_/components/',
        'selector_header'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_tree-item_/components/').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['components', 'header'],
          itemValue: {}
        }));
        dispatch(expandPaneTreeItem({
          itemPath: '/components/header',
          itemPathParts: ['components', 'header'],
          paneIndex: 0
        }));
        dispatch(selectPaneTreeItem({
          itemPath: '/components/header',
          itemPathParts: ['components', 'header'],
          paneIndex: 0
        }));
        dispatch(generate());
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Add <b>props</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/components/header/_key',
        'selector_props'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/components/header/_key').focus();
        }, 200);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['components', 'header', 'props'],
          itemValue: {}
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Name it <b>title</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/components/header/props/_key',
        'selector_title'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/components/header/props/_key').focus();
        }, 100);
      },
      onComplete: ({ dispatch }) => {
        dispatch(updateItem({
          paneType: 'specs',
          itemPathParts: ['components', 'header', 'props', 'title'],
          itemValue: {}
        }));
      }
    },
    {
      element: '#selector',
      content: (
        <div>
          Select <b>type</b>.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/components/header/props/title/_key',
        'selector_type'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/components/header/props/title/_key').focus();
        }, 100);
      }
    },
    {
      element: '#pane-0_editor-item_/components/header/props/title/_value',
      content: (
        <div>
          Enter <b>string</b> as the type.
        </div>
      ),
      enabledElements: [
        'pane-0_editor-item_/components/header/props/title/_value',
        'selector_string'
      ],
      onLoad: () => {
        setTimeout(() => {
          document.getElementById('pane-0_editor-item_/components/header/props/title/_value').focus();
        }, 100);
      }
    },
    {
      element: '#pane-1_tree-item_/src/components/header/Header.jsx',
      content: (
        <div>
          Look how easy it was to put together a React component from scratch.
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
