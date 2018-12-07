import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import download from '../../actions/download';
import generate from '../../actions/generate';
import openFolder from '../../actions/openFolder';
import saveProject from '../../actions/saveProject';

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
    const folder = getWorkspaceDir(`${this.props.projectName}/${this.props.projectVersion}/${this.props.projectConfiguration}`);
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
            disabled={this.props.projectVersion !== 'latest'}
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
            disabled={this.props.projectVersion !== 'latest'}
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
  hasCodeFiles: false,
  hasUnsavedChanges: false,
  isGenerating: false,
  isSaving: false,
  projectConfiguration: '',
  projectName: '',
  projectVersion: '',
  // dispatch
  download: () => {},
  generate: () => {},
  openFolder: () => {},
  saveProject: () => {}
};

ProjectActions.propTypes = {
  // state
  hasCodeFiles: PropTypes.bool,
  hasUnsavedChanges: PropTypes.bool,
  isGenerating: PropTypes.bool,
  isSaving: PropTypes.bool,
  projectConfiguration: PropTypes.string,
  projectName: PropTypes.string,
  projectVersion: PropTypes.string,
  // dispatch
  download: PropTypes.func,
  generate: PropTypes.func,
  openFolder: PropTypes.func,
  saveProject: PropTypes.func
};

function mapStateToProps(state) {
  return {
    hasCodeFiles: Object.keys(state.project.codeFiles).length > 0,
    hasUnsavedChanges: state.project.hasUnsavedChanges,
    isGenerating: state.project.isGenerating,
    isSaving: state.project.isSaving,
    projectConfiguration: state.project.configuration,
    projectName: state.project.name,
    projectVersion: state.project.version
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
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectActions);
