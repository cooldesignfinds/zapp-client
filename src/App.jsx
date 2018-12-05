import createBrowserHistory from 'history/lib/createBrowserHistory';
import { stringify, parse } from 'qs';
import React from 'react';
import thunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, useRouterHistory } from 'react-router';
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import openProject from './actions/openProject';
import saveProject from './actions/saveProject';
import setDevice from './actions/setDevice';
import setFile from './actions/setFile';
import updateTerminalOutput from './actions/updateTerminalOutput';

import { ThemeContext, themes } from './contexts/theme';

import deviceReducer from './reducers/device';
import generatorsReducer from './reducers/generators';
import logReducer from './reducers/log';
import hintReducer from './reducers/hint';
import importsReducer from './reducers/imports';
import modalReducer from './reducers/modal';
import menuReducer from './reducers/menu';
import newProjectReducer from './reducers/newProject';
import paneReducer from './reducers/pane';
import projectReducer from './reducers/project';
import selectorReducer from './reducers/selector';
import shortcutsReducer from './reducers/shortcuts';
import teamReducer from './reducers/team';
import terminalReducer from './reducers/terminal';
import tutorialReducer from './reducers/tutorial';
import userReducer from './reducers/user';
import userGeneratorsReducer from './reducers/userGenerators';

import NewPage from './pages/new/New';
import NotFoundPage from './pages/not-found/NotFound';
import OpenPage from './pages/open/Open';
import ProjectPage from './pages/project/Project';

import MainTemplate from './templates/main/Main';

import './App.sass';

const stringifyQuery = query => stringify(query, { arrayFormat: 'brackets' });
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: '/',
  parseQueryString: parse,
  stringifyQuery
});

const router = routerMiddleware(browserHistory);

const store = createStore(
  combineReducers({
    device: deviceReducer,
    generators: generatorsReducer,
    log: logReducer,
    hint: hintReducer,
    imports: importsReducer,
    modal: modalReducer,
    menu: menuReducer,
    newProject: newProjectReducer,
    pane: paneReducer,
    project: projectReducer,
    routing: routerReducer,
    selector: selectorReducer,
    shortcuts: shortcutsReducer,
    team: teamReducer,
    terminal: terminalReducer,
    tutorial: tutorialReducer,
    user: userReducer,
    userGenerators: userGeneratorsReducer
  }),
  applyMiddleware(
    thunk,
    router
  )
);
window.actions = {
  openProject,
  saveProject: () => {
    store.dispatch(saveProject());
  },
  setDevice,
  setFile,
  updateTerminalOutput: (data) => {
    store.dispatch(updateTerminalOutput(data));
  }
};
window.handlers = {};
window.onError = (message) => {
  window.handlers[message.id].reject(message.data);
  delete window.handlers[message.id];
};
window.onSuccess = (message) => {
  window.handlers[message.id].resolve(message.data);
  delete window.handlers[message.id];
};
window.store = store;

const history = syncHistoryWithStore(
  browserHistory,
  store
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme: state.theme === themes.dark
          ? themes.light
          : themes.dark,
        themeName: state.theme === themes.dark
          ? 'light'
          : 'dark'
      }));
    };

    this.state = {
      theme: themes.dark,
      themeName: 'dark',
      toggleTheme: this.toggleTheme
    };
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <Provider store={store}>
          <Router history={history}>
            <Route path={CONFIG.baseHref} component={MainTemplate}>
              <IndexRoute component={OpenPage} />
              <Route path="new" component={NewPage} />
              <Route path="local" component={ProjectPage} />
              <Route path="local/*" component={ProjectPage} />
              <Route path="local/code" component={ProjectPage} />
              <Route path="local/code/*.*" component={ProjectPage} />
              <Route path="local/configs" component={ProjectPage} />
              <Route path="local/configs/*" component={ProjectPage} />
              <Route path="local/files" component={ProjectPage} />
              <Route path="local/files/*" component={ProjectPage} />
              <Route path="local/generators" component={ProjectPage} />
              <Route path="local/generators/*" component={ProjectPage} />
              <Route path="local/schemas" component={ProjectPage} />
              <Route path="local/schemas/*" component={ProjectPage} />
              <Route path="local/specs" component={ProjectPage} />
              <Route path="local/specs/*" component={ProjectPage} />
              <Route path="local/templates" component={ProjectPage} />
              <Route path="local/templates/*" component={ProjectPage} />
              <Route path="tutorials/:tutorialName" component={ProjectPage} />
              <Route path="untitled" component={ProjectPage} />
              <Route path="untitled/*" component={ProjectPage} />
              <Route path="untitled/code" component={ProjectPage} />
              <Route path="untitled/code/*.*" component={ProjectPage} />
              <Route path="untitled/configs" component={ProjectPage} />
              <Route path="untitled/configs/*" component={ProjectPage} />
              <Route path="untitled/files" component={ProjectPage} />
              <Route path="untitled/files/*" component={ProjectPage} />
              <Route path="untitled/generators" component={ProjectPage} />
              <Route path="untitled/generators/*" component={ProjectPage} />
              <Route path="untitled/schemas" component={ProjectPage} />
              <Route path="untitled/schemas/*" component={ProjectPage} />
              <Route path="untitled/specs" component={ProjectPage} />
              <Route path="untitled/specs/*" component={ProjectPage} />
              <Route path="untitled/templates" component={ProjectPage} />
              <Route path="untitled/templates/*" component={ProjectPage} />
              <Route path=":user/:generator" component={ProjectPage} />
              <Route path=":user/:generator/:version" component={ProjectPage} />
              <Route path=":user/:generator/:version/:configuration" component={ProjectPage} />
            </Route>
            <Route path="*" component={NotFoundPage} />
          </Router>
        </Provider>
      </ThemeContext.Provider>
    );
  }
}

render(<App />, document.getElementById('app'));
