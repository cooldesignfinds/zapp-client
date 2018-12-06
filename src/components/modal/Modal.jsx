import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import hideModal from '../../actions/hideModal';

import ChangeIconForm from '../../forms/change-icon/ChangeIconForm';

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
            <IconButton
              className={styles.close}
              onClick={() => this.handleClose()}
              size={16}
              title="Close"
              type="close"
            />
            <Choose>
              <When condition={this.props.currentModal === 'changeIcon'}>
                <ChangeIconForm />
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
  hideModal: () => {}
};

Modal.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  currentModal: PropTypes.string,
  hideModal: PropTypes.func
};

function mapStateToProps(state) {
  return {
    content: state.modal.content,
    currentModal: state.modal.current
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
