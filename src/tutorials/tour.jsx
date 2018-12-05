import { List, OrderedMap } from 'immutable';
import React, { Fragment } from 'react';

import hideHint from '../actions/hideHint';
import hideModal from '../actions/hideModal';
import loadImports from '../actions/loadImports';
import tutorialNext from '../actions/tutorialNext';

import Recommendations from '../components/recommendations/Recommendations';
import SubmitButton from '../components/submit-button/SubmitButton';

import objectToOrderedMap from '../lib/objectToOrderedMap';

const initialGeneratorState = {
  type: 'LOAD_PROJECT_RES',
  id: 'none',
  name: 'tutorial',
  code: OrderedMap(),
  color: '#4c5dfc',
  configuration: 'default',
  configs: OrderedMap(),
  engines: OrderedMap(),
  files: OrderedMap(),
  icon: 'tour-white',
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
  items: {
    specs: objectToOrderedMap({
      app: {
        name: 'my-app',
        version: '1.0.0',
        description: 'this is my app'
      }
    })
  },
  steps: [
    {
      type: 'modal',
      content: (
        <Fragment>
          <h2>Take a Tour</h2>
          <p>
            Welcome and thanks for checking out ZappJS!
          </p>
          <p>
            This tour guides you through all of the different buttons, selectors and other clickables in the editor.
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
        dispatch(hideHint());
      }
    },
    {
      element: '#icon-button',
      title: 'Main Menu',
      content: (
        <div>
          This is where you have essential options like <b>New Generator</b> and <b>Open Generator</b>.
        </div>
      )
    },
    {
      element: '#generator-button',
      title: 'Generator Selector',
      content: (
        <div>
          This is the <b>Generator Selector</b> button. Use it to switch between generators or create new generators.
        </div>
      )
    },
    {
      element: '#version-button',
      title: 'Version Selector',
      content: (
        <div>
          This is the <b>Version Selector</b> button. Use it to publish new versions and view older versions.
        </div>
      )
    },
    {
      element: '#configuration-button',
      title: 'Configuration Selector',
      content: (
        <div>
          This is the <b>Configuration Selector</b> button. Most generators only have one configuration: <b>default</b>. However, there are times when you'll want various configurations such as examples. More on that later.
        </div>
      )
    },
    {
      element: '#favorite-button',
      title: 'Favorite',
      content: (
        <div>
          Like a generator? Add it with the <b>Favorite</b> button.
        </div>
      )
    },
    {
      element: '#undo-button',
      title: 'Undo',
      content: (
        <div>
          Uh oh - you made a mistake. Thank goodness for the almighty <b>Undo</b> button.
        </div>
      )
    },
    {
      element: '#redo-button',
      title: 'Redo',
      content: (
        <div>
          ...And of course, the <b>Redo</b> button for undoing the undoing of your mistakes that might not be mistakes after all.
        </div>
      )
    },
    {
      element: '#add-button',
      title: 'Add',
      content: (
        <div>
          The <b>Add</b> button is a quick way to create new <b>Generators</b>, <b>Versions</b> and <b>Configurations</b>.
        </div>
      )
    },
    {
      element: '#pane-0_pane-selector',
      title: 'Pane Selector',
      content: (
        <div>
          The <b>Pane Selector</b> lets you switch between panes: Specs, Code, Schemas, Templates, Files and Engines.
        </div>
      )
    },
    {
      element: '#pane-0_toggle-sidebar-button',
      title: 'Toggle Sidebar',
      content: (
        <div>
          The <b>Toggle Sidebar</b> button does what it sounds like. It shows/hides the pane's sidebar.
        </div>
      )
    },
    {
      element: '#pane-0_split-pane-button',
      title: 'Split Pane',
      content: (
        <div>
          The <b>Split Pane</b> button makes a new pane.
        </div>
      )
    },
    {
      element: '#pane-0_close-pane-button',
      title: 'Close Pane',
      content: (
        <div>
          After creating new panes, the <b>Close Pane</b> button lets you close them. Note: there is always at least one pane open.
        </div>
      )
    },
    {
      element: '#pane-1_pane-selector',
      title: 'Tip',
      content: (
        <div>
          There are usually multiple panes open.
        </div>
      )
    },
    {
      element: '#pane-0_path-selector',
      title: 'Path Selector',
      content: (
        <div>
          The <b>Path Selector</b> is used to jump between paths.
        </div>
      )
    },
    {
      element: '#pane-0_add-item-button',
      title: 'Add Item',
      content: (
        <div>
          The <b>Add Item</b> lets you add items to this pane.
        </div>
      )
    },
    {
      element: '#pane-0_recent-paths-button',
      title: 'Recent Paths',
      content: (
        <div>
          Use the <b>Recent Paths</b> button to recall recent paths.
        </div>
      )
    },
    {
      element: '#import-button',
      title: 'Import Generator',
      content: (
        <div>
          The <b>Import</b> button enables you to import other generators into your generator. Let's import a few modules to see how that works.
        </div>
      )
    },
    {
      element: '#import-button',
      content: (
        <div>
          Notice we've imported 3 generators: <a href="zappjs/npm" target="_blank">npm</a>, <a href="zappjs/readme" target="_blank">readme</a> and <a href="zappjs/license" target="_blank">license</a>. In addition, 3 files have been generated (as shown in the <b>Code</b> panel).
        </div>
      ),
      onLoad: ({ dispatch, state }) => {
        dispatch({
          type: 'LOAD_PROJECT_RES',
          id: 'none',
          name: 'untitled',
          code: OrderedMap(),
          configuration: 'default',
          configs: OrderedMap(),
          engines: OrderedMap(),
          meta: OrderedMap(),
          path: 'untitled',
          generators: OrderedMap(),
          imports: objectToOrderedMap({
            zappjs: {
              npm: 'latest',
              readme: 'latest',
              license: 'latest'
            }
          }),
          importsData: List(),
          schemas: OrderedMap(),
          specs: state.project.specs,
          templates: OrderedMap(),
          version: 'latest'
        });
      }
    },
    {
      element: '#refresh-button',
      title: 'Refresh Imports',
      content: (
        <div>
          The <b>Refresh Imports</b> button lets you refresh your imports in case they change.
        </div>
      ),
      onLoad: ({ dispatch }) => {
        dispatch(loadImports());
      }
    },
    {
      element: '#download-button',
      title: 'Download',
      content: (
        <div>
          The <b>Download</b> button lets you download your generated code as a ZIP file.
        </div>
      )
    },
    {
      element: '#save-button',
      title: 'Save',
      content: (
        <div>
          The <b>Save</b> button lets you save your generator.
        </div>
      )
    },
    {
      element: '#generate-button',
      title: 'Generate',
      content: (
        <div>
          The <b>Generate</b> button lets you manually generate your code. Normally, this happens automatically so you shouldn't have to click this often.
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
