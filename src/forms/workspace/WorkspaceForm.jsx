import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import changeWorkspace from '../../actions/changeWorkspace';
import hideModal from '../../actions/hideModal';

import Form from '../../components/form/Form';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import isDesktop from '../../lib/isDesktop';

import styles from './WorkspaceForm.sass';

class WorkspaceForm extends Component {
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
    this.props.changeWorkspace({
      workspace: this.state.workspace
    });
    this.props.hideModal();
  }
  render() {
    return (
      <Form className={styles.workspace} onSubmit={() => this.handleSubmit()}>
        <h2>Change Workspace</h2>
        <p>This is where all of your generated code will end up.</p>
        <If condition={!isDesktop()}>
          <p>
            <b>This feature only affects the desktop version of ZappJS.</b>
          </p>
        </If>
        <TextField
          autoFocus
          disabled={!isDesktop()}
          label="Workspace Directory"
          name="workspace"
          onChange={e => this.handleInput(e)}
          type="text"
          value={this.state.workspace}
        />
        <SubmitButton disabled={!isDesktop()}>
          Set Workspace
        </SubmitButton>
      </Form>
    );
  }
}

WorkspaceForm.defaultProps = {
  changeWorkspace: () => {},
  hideModal: () => {}
};

WorkspaceForm.propTypes = {
  changeWorkspace: PropTypes.func,
  hideModal: PropTypes.func
};

function mapDispatchToProps(dispatch) {
  return {
    changeWorkspace: (opts) => {
      dispatch(changeWorkspace(opts));
    },
    hideModal: (opts) => {
      dispatch(hideModal(opts));
    }
  };
}

export default connect(null, mapDispatchToProps)(WorkspaceForm);
