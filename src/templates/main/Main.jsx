import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import clearLogs from '../../actions/clearLogs';
import focusPane from '../../actions/focusPane';
import generate from '../../actions/generate';
import loadImports from '../../actions/loadImports';
import redo from '../../actions/redo';
import saveProject from '../../actions/saveProject';
import selectPaneTreeItem from '../../actions/selectPaneTreeItem';
import setPaneType from '../../actions/setPaneType';
import togglePaneTree from '../../actions/togglePaneTree';
import undo from '../../actions/undo';

import Errors from '../../components/errors/Errors';
import Header from '../../components/header/Header';
import HintWrapper from '../../components/hint-wrapper/HintWrapper';
import Modal from '../../components/modal/Modal';
import SelectorWrapper from '../../components/selector-wrapper/SelectorWrapper';
import Shortcuts from '../../components/shortcuts/Shortcuts';
import Upgrade from '../../components/upgrade/Upgrade';

import { ThemeContext } from '../../contexts/theme';

import getItemPathParts from '../../lib/getItemPathParts';
import getZappVersion from '../../lib/getZappVersion';
import getShortcutKey from '../../lib/getShortcutKey';
import isDesktop from '../../lib/isDesktop';
import validateZappVersion from '../../lib/validateZappVersion';

import styles from './Main.sass';

const zappVersion = getZappVersion();
const isValidZappVersion = !isDesktop() || validateZappVersion(zappVersion);

class MainTemplate extends Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  componentWillMount() {
    browserHistory.listen(this.handleLocationChange);
    window.addEventListener('keydown', this.handleKeyDown);
    window.onbeforeunload = this.handleBeforeUnload.bind(this);
  }

  componentDidMount() {
    this.handleLocationChange();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleBeforeUnload(event) {
    if (isDesktop()) {
      return;
    }
    if (this.props.hasUnsavedChanges) {
      const e = event || window.event;
      const message = 'You have unsaved changes that will be lost if you continue.';
      if (e) {
        e.returnValue = message;
      }
      return message;
    }
  }

  handleLocationChange() {
    if (
      !this.props.router
        || !this.props.router.location
        || !this.props.router.location.query
        || !this.props.router.location.query.pane
        || !Array.isArray(this.props.router.location.query.pane)
    ) {
      return;
    }

    const selectedPane = parseInt(this.props.router.location.query.selectedPane, 10);
    if (!isNaN(selectedPane)) {
      this.props.focusPane({
        paneIndex: selectedPane
      });
    }

    const panes = this.props.router.location.query.pane;
    panes.forEach((pane, paneIndex) => {
      const paneLocation = pane.substr(1).split('/');
      if (paneLocation.length > 0) {
        const hashPaneType = paneLocation[0];
        this.props.setPaneType(paneIndex, hashPaneType);
      }
      if (paneLocation.length > 1) {
        const hashPath = `/${paneLocation.slice(1).join('/')}`;
        this.props.selectPaneTreeItem({
          itemPathParts: getItemPathParts(hashPath),
          itemPath: hashPath,
          paneIndex
        });
      }
    });
  }

  handleKeyDown(event) {
    const shortcutKey = getShortcutKey(event.keyCode);

    const shortcuts = {
      esc: () => {
        this.props.clearLogs();
        if (document.activeElement) {
          document.activeElement.blur();
        }
      }
    };

    const shortcut = shortcuts[shortcutKey];

    if (shortcut) {
      const shortcurtResult = shortcut();
      if (shortcurtResult !== true) {
        event.preventDefault();
      }
    } else if ((event.ctrlKey || event.metaKey) && !isNaN(parseInt(shortcutKey, 10))) {
      this.props.focusPane({
        paneIndex: parseInt(shortcutKey, 10) - 1
      });
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 'g') {
      this.props.generate();
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && shortcutKey === 'r') {
      this.props.loadImports();
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 'r') {
      window.location.reload();
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 's') {
      this.props.saveProject();
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 'z') {
      if (event.shiftKey) {
        this.props.redo();
      } else {
        this.props.undo();
      }
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 'backSlash') {
      this.props.togglePaneTree({ paneIndex: this.props.focusedPane });
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 'equal') {
      if (document.getElementById(`pane-${this.props.focusedPane}_add-item-button`)) {
        document.getElementById(`pane-${this.props.focusedPane}_add-item-button`).click();
      }
      event.preventDefault();
    } else if ((event.ctrlKey || event.metaKey) && shortcutKey === 'forwardSlash') {
      document.getElementById(`pane-${this.props.focusedPane}_path-selector`).focus();
      document.getElementById(`pane-${this.props.focusedPane}_path-selector`).select();
    } else if ((!document.activeElement || !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) && (event.ctrlKey || event.metaKey) && shortcutKey === 'left') {
      history.back();
      event.preventDefault();
    } else if ((!document.activeElement || !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) && (event.ctrlKey || event.metaKey) && shortcutKey === 'right') {
      history.forward();
      event.preventDefault();
    }
  }

  render() {
    if (!isValidZappVersion) {
      return (
        <Upgrade />
      );
    }

    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div className={styles.main}>
            <Helmet>
              <style type="text/css">
                {`
                  body {
                    background-color: ${theme.background};
                    color: ${theme.textColor};
                  }

                  button, input {
                    color: ${theme.textColor};
                  }
                `}
              </style>
            </Helmet>
            <Header />
            {this.props.children}
            <Errors />
            <Modal />
            <HintWrapper />
            <SelectorWrapper />
            <Shortcuts />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

MainTemplate.defaultProps = {
  children: '',
  router: {},
  // state props
  focusedPane: 0,
  hasUnsavedChanges: false,
  // dispatch props
  clearLogs: () => {},
  focusPane: () => {},
  generate: () => {},
  loadImports: () => {},
  redo: () => {},
  saveProject: () => {},
  setPaneType: () => {},
  selectPaneTreeItem: () => {},
  togglePaneTree: () => {},
  undo: () => {}
};

MainTemplate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  router: PropTypes.object,
  // state props
  focusedPane: PropTypes.number,
  hasUnsavedChanges: PropTypes.bool,
  // dispatch props
  clearLogs: PropTypes.func,
  focusPane: PropTypes.func,
  generate: PropTypes.func,
  loadImports: PropTypes.func,
  redo: PropTypes.func,
  saveProject: PropTypes.func,
  setPaneType: PropTypes.func,
  selectPaneTreeItem: PropTypes.func,
  togglePaneTree: PropTypes.func,
  undo: PropTypes.func
};

function mapStateToProps(state) {
  return {
    focusedPane: state.pane.focusedItem,
    hasUnsavedChanges: state.project.hasUnsavedChanges
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearLogs: () => {
      dispatch(clearLogs());
    },
    focusPane: (opts) => {
      dispatch(focusPane(opts));
    },
    generate: () => {
      dispatch(generate());
    },
    loadImports: () => {
      dispatch(loadImports());
    },
    redo: () => {
      dispatch(redo());
    },
    saveProject: () => {
      dispatch(saveProject());
    },
    setPaneType: (paneIndex, paneType) => {
      dispatch(setPaneType(paneIndex, paneType));
    },
    selectPaneTreeItem: (opts) => {
      dispatch(selectPaneTreeItem(opts));
    },
    togglePaneTree: (opts) => {
      dispatch(togglePaneTree(opts));
    },
    undo: () => {
      dispatch(undo());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainTemplate);
