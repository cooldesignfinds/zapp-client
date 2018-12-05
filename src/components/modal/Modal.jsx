import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import hideModal from '../../actions/hideModal';

import ChangeIconForm from '../../forms/change-icon/ChangeIconForm';
import CommitForm from '../../forms/commit/CommitForm';
import NewConfigurationForm from '../../forms/new-configuration/NewConfigurationForm';
import NewForm from '../../forms/new/NewForm';
import NewVersionForm from '../../forms/new-version/NewVersionForm';
import ResetForm from '../../forms/reset/ResetForm';

import IconButton from '../icon-button/IconButton';

import styles from './Modal.sass';

class Modal extends Component {
  handleClose() {
    this.props.hideModal();
  }
  render() {
    return (
      <If condition={this.props.currentModal !== ''}>
        <div className={styles.modal}>
          <div className={styles.content}>
            <If condition={!this.props.tutorialMode}>
              <IconButton
                className={styles.close}
                onClick={() => this.handleClose()}
                size={16}
                title="Close"
                type="close"
              />
            </If>
            <Choose>
              <When condition={this.props.currentModal === 'changeIcon'}>
                <ChangeIconForm />
              </When>
              <When condition={this.props.currentModal === 'commit'}>
                <CommitForm />
              </When>
              <When condition={this.props.currentModal === 'reset'}>
                <ResetForm />
              </When>
              <When condition={this.props.currentModal === 'newConfiguration'}>
                <NewConfigurationForm />
              </When>
              <When condition={this.props.currentModal === 'newGenerator'}>
                <NewForm />
              </When>
              <When condition={this.props.currentModal === 'newVersion'}>
                <NewVersionForm />
              </When>
              <Otherwise>
                {this.props.content}
              </Otherwise>
            </Choose>
          </div>
        </div>
      </If>
    );
  }
}

Modal.defaultProps = {
  content: '',
  currentModal: '',
  hideModal: () => {},
  tutorialMode: false
};

Modal.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  currentModal: PropTypes.string,
  hideModal: PropTypes.func,
  tutorialMode: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    content: state.modal.content,
    currentModal: state.modal.current,
    tutorialMode: state.tutorial.show
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: () => {
      dispatch(hideModal());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
