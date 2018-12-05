import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { List, OrderedMap } from 'immutable';

import download from '../../actions/download';
import generate from '../../actions/generate';
import hideTerminal from '../../actions/hideTerminal';
import openFolder from '../../actions/openFolder';
import openTerminal from '../../actions/openTerminal';
import saveProject from '../../actions/saveProject';
import showSelector from '../../actions/showSelector';
import showTerminal from '../../actions/showTerminal';
import startTutorial from '../../actions/startTutorial';

import IconButton from '../../components/icon-button/IconButton';

import getWorkspaceDir from '../../lib/getWorkspaceDir';
import isDesktop from '../../lib/isDesktop';

import styles from './ProjectActions.sass';

class ProjectActions extends Component {
  handleDownload() {
    this.props.download();
  }
  handleFolder() {
    this.props.openFolder();
  }
  handleGenerate() {
    this.props.generate();
  }
  handleSave() {
    this.props.saveProject();
  }
  handleTerminal() {
    if (this.props.terminalIsVisible) {
      this.props.hideTerminal();
    } else {
      this.props.showTerminal();
      if (this.props.terminals.length === 0) {
        this.props.openTerminal();
      }
    }
  }
  handleTutorial(name) {
    this.props.startTutorial({
      name,
      steps: [
        {
          selector: '#add-button',
          content: 'First, click the add button.'
        },
        {
          selector: '#import-button',
          content: 'First, click the add button.'
        }
      ]
    });
  }
  toggleHelpMenu() {
    this.props.showSelector({
      target: this.helpButton,
      name: 'open',
      title: 'Tutorials',
      options: [
        {
          iconType: 'home',
          onSelect: () => this.handleTutorial('createNewGenerator'),
          text: 'Create New Generator',
          value: 'new-generator'
        }
      ]
    });
  }
  render() {
    const folder = getWorkspaceDir(`${this.props.projectAuthorUsername}/${this.props.projectName}/${this.props.projectVersion}/${this.props.projectConfiguration}`);
    return (
      <Fragment>
        <li className={styles.folder}>
          <IconButton
            buttonRef={(ref) => { this.helpButton = ref; }}
            id="help-button"
            onClick={() => this.toggleHelpMenu()}
            paddingHeight={12}
            paddingWidth={12}
            size={12}
            title="Help"
            type="help-gray"
          />
        </li>
        <If condition={false}>
          <li className={styles.folder}>
            <IconButton
              id="console-button"
              disabled={!isDesktop()}
              onClick={() => this.handleTerminal()}
              paddingHeight={12}
              paddingWidth={12}
              size={12}
              title={!isDesktop() ? 'Only available on desktop version of ZappJS' : 'Terminal (CMD-T)'}
              type="terminal-gray"
            />
          </li>
        </If>
        <li className={styles.folder}>
          <IconButton
            id="folder-button"
            onClick={() => this.handleFolder()}
            paddingHeight={12}
            paddingWidth={12}
            size={12}
            title={
              !isDesktop()
                ? 'Only available on desktop version of ZappJS'
                : `Open Folder (${folder})`
            }
            type="folder-gray"
          />
        </li>
        <If condition={false}>
          <li className={styles.download}>
            <IconButton
              disabled={!this.props.hasCodeFiles}
              id="download-button"
              onClick={() => this.handleDownload()}
              paddingHeight={12}
              paddingWidth={12}
              size={12}
              title={!this.props.hasCodeFiles ? 'No code has been generated' : 'Download (CMD+D)'}
              type="download-gray"
            />
          </li>
        </If>
        <li className={styles.save}>
          <If condition={this.props.hasUnsavedChanges || this.props.isSaving}>
            <div
              className={classNames(
                styles.indicator,
                this.props.hasUnsavedChanges ? styles.unsaved : null,
                this.props.isSaving ? styles.saving : null
              )}
            />
          </If>
          <IconButton
            disabled={this.props.projectVersion !== 'latest' || this.props.projectAuthorUsername !== this.props.username}
            id="save-button"
            onClick={() => this.handleSave()}
            paddingHeight={12}
            paddingWidth={12}
            size={12}
            title="Save (CMD+S)"
            type="save-gray"
          />
        </li>
        <li>
          <If condition={this.props.isGenerating}>
            <div
              className={classNames(
                styles.indicator,
                this.props.isGenerating ? styles.saving : null
              )}
            />
          </If>
          <IconButton
            onClick={() => this.handleGenerate()}
            id="generate-button"
            paddingHeight={12}
            paddingWidth={12}
            size={12}
            title="Generate (CMD+G)"
            type="generate-gray"
          />
        </li>
      </Fragment>
    );
  }
}

ProjectActions.defaultProps = {
  // state
  code: OrderedMap(),
  configs: OrderedMap(),
  engines: OrderedMap(),
  files: OrderedMap(),
  generators: OrderedMap(),
  hasCodeFiles: false,
  hasUnsavedChanges: false,
  isGenerating: false,
  isSaving: false,
  imports: OrderedMap(),
  importsData: List(),
  projectAuthorUsername: '',
  projectConfiguration: '',
  projectPath: '',
  projectName: '',
  projectVersion: '',
  schemas: OrderedMap(),
  specs: OrderedMap(),
  templates: OrderedMap(),
  terminalIsVisible: false,
  terminals: [],
  username: '',
  // dispatch
  download: () => {},
  generate: () => {},
  hideTerminal: () => {},
  openFolder: () => {},
  openTerminal: () => {},
  saveProject: () => {},
  showSelector: () => {},
  showTerminal: () => {},
  startTutorial: () => {}
};

ProjectActions.propTypes = {
  // state
  code: PropTypes.instanceOf(OrderedMap),
  configs: PropTypes.instanceOf(OrderedMap),
  engines: PropTypes.instanceOf(OrderedMap),
  files: PropTypes.instanceOf(OrderedMap),
  generators: PropTypes.instanceOf(OrderedMap),
  hasCodeFiles: PropTypes.bool,
  hasUnsavedChanges: PropTypes.bool,
  imports: PropTypes.instanceOf(OrderedMap),
  importsData: PropTypes.instanceOf(List),
  isGenerating: PropTypes.bool,
  isSaving: PropTypes.bool,
  projectAuthorUsername: PropTypes.string,
  projectConfiguration: PropTypes.string,
  projectPath: PropTypes.string,
  projectName: PropTypes.string,
  projectVersion: PropTypes.string,
  schemas: PropTypes.instanceOf(OrderedMap),
  specs: PropTypes.instanceOf(OrderedMap),
  templates: PropTypes.instanceOf(OrderedMap),
  terminalIsVisible: PropTypes.bool,
  terminals: PropTypes.array,
  username: PropTypes.string,
  // dispatch
  download: PropTypes.func,
  generate: PropTypes.func,
  hideTerminal: PropTypes.func,
  openFolder: PropTypes.func,
  openTerminal: PropTypes.func,
  saveProject: PropTypes.func,
  showSelector: PropTypes.func,
  showTerminal: PropTypes.func,
  startTutorial: PropTypes.func
};

function mapStateToProps(state) {
  return {
    code: state.project.code,
    configs: state.project.configs,
    engines: state.project.engines,
    files: state.project.files,
    generators: state.project.generators,
    hasCodeFiles: Object.keys(state.project.codeFiles).length > 0,
    hasUnsavedChanges: state.project.hasUnsavedChanges,
    imports: state.project.imports,
    importsData: state.project.importsData,
    isGenerating: state.project.isGenerating,
    isLoading: !state.user.isComplete,
    isSaving: state.project.isSaving,
    projectAuthorUsername: state.project.author && state.project.author.username ? state.project.author.username : '',
    projectConfiguration: state.project.configuration,
    projectPath: state.project.id,
    projectName: state.project.name,
    projectVersion: state.project.version,
    schemas: state.project.schemas,
    specs: state.project.specs,
    templates: state.project.templates,
    terminalIsVisible: state.terminal.show,
    terminals: state.terminal.items,
    username: state.user.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    download: (opts) => {
      dispatch(download(opts));
    },
    generate: (opts) => {
      dispatch(generate(opts));
    },
    hideTerminal: (opts) => {
      dispatch(hideTerminal(opts));
    },
    openFolder: (opts) => {
      dispatch(openFolder(opts));
    },
    openTerminal: (opts) => {
      dispatch(openTerminal(opts));
    },
    saveProject: () => {
      dispatch(saveProject());
    },
    showSelector: (opts) => {
      dispatch(showSelector(opts));
    },
    showTerminal: (opts) => {
      dispatch(showTerminal(opts));
    },
    startTutorial: (opts) => {
      dispatch(startTutorial(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectActions);
