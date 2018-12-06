import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { List, OrderedMap } from 'immutable';

import download from '../../actions/download';
import generate from '../../actions/generate';
import openFolder from '../../actions/openFolder';
import saveProject from '../../actions/saveProject';
import showSelector from '../../actions/showSelector';

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
  render() {
    const folder = getWorkspaceDir(`${this.props.projectAuthorUsername}/${this.props.projectName}/${this.props.projectVersion}/${this.props.projectConfiguration}`);
    return (
      <Fragment>
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
  username: '',
  // dispatch
  download: () => {},
  generate: () => {},
  openFolder: () => {},
  saveProject: () => {},
  showSelector: () => {}
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
  username: PropTypes.string,
  // dispatch
  download: PropTypes.func,
  generate: PropTypes.func,
  openFolder: PropTypes.func,
  saveProject: PropTypes.func,
  showSelector: PropTypes.func
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
    openFolder: (opts) => {
      dispatch(openFolder(opts));
    },
    saveProject: () => {
      dispatch(saveProject());
    },
    showSelector: (opts) => {
      dispatch(showSelector(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectActions);
