import createBrowserHistory from 'history/lib/createBrowserHistory';
import { stringify, parse } from 'qs';
import React from 'react';
import thunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { render } from 'react-dom';
import { Router, Route, useRouterHistory } from 'react-router';
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

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
    shortcuts: shortcutsReducer
  }),
  applyMiddleware(
    thunk,
    router
  )
);

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
              <Route path="*" component={ProjectPage} />
            </Route>
          </Router>
        </Provider>
      </ThemeContext.Provider>
    );
  }
}

render(<App />, document.getElementById('app'));
