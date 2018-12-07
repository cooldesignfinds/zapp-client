import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import initialize from '../../actions/initialize';
import hideModal from '../../actions/hideModal';

import Form from '../../components/form/Form';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import isDesktop from '../../lib/isDesktop';

import styles from './InitializeForm.sass';

class InitializeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspace: localStorage.getItem('workspace') || '~/ZappJS'
    };
  }
  handleInput({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }
  handleSubmit() {
    this.props.initialize();
    this.props.hideModal();
  }
  render() {
    return (
      <Form className={styles.workspace} onSubmit={() => this.handleSubmit()}>
        <h2>Initialize Project</h2>
        <p>This will initialize ZAPP in the following directory:</p>
        <p>{this.props.projectCwd}</p>
        <If condition={!isDesktop()}>
          <p>
            <b>This feature only affects the desktop version of ZappJS.</b>
          </p>
        </If>
        <SubmitButton disabled={!isDesktop()}>
          Initialize Project
        </SubmitButton>
      </Form>
    );
  }
}

InitializeForm.defaultProps = {
  // state props
  projectCwd: '',
  // dispatch props
  initialize: () => {},
  hideModal: () => {}
};

InitializeForm.propTypes = {
  // state props
  projectCwd: PropTypes.string,
  // dispatch props
  initialize: PropTypes.func,
  hideModal: PropTypes.func
};

function mapStateToProps(state) {
  return {
    projectCwd: state.project.cwd
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initialize: (opts) => {
      dispatch(initialize(opts));
    },
    hideModal: (opts) => {
      dispatch(hideModal(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InitializeForm);
