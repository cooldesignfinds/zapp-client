import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import Error from '../../components/error/Error';
import Form from '../../components/form/Form';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import createVersion from '../../actions/createVersion';

import styles from './NewVersionForm.sass';

class NewVersionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      minorVersion: '',
      patchVersion: ''
    };
  }
  handleInput({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }
  handleSubmit() {
    const minorVersion = parseInt(this.state.minorVersion, 10);
    const patchVersion = parseInt(this.state.patchVersion, 10);

    if (isNaN(minorVersion) || isNaN(patchVersion)) {
      this.setState({
        error: 'Invalid version.'
      });
      return;
    }

    this.props.createVersion({
      version: `0.${this.state.minorVersion}.${this.state.patchVersion}`
    });
  }
  render() {
    return (
      <Form className={styles.new} onSubmit={() => this.handleSubmit()}>
        <Error>
          {this.state.error}
        </Error>
        <h2>New Version</h2>
        <p>
          Note: versions are currently limited to minor and patch updates only.
        </p>
        <TextField
          disabled
          label="Major"
          name="majorVersion"
          onChange={e => this.handleInput(e)}
          textAlign="center"
          type="text"
          value="0"
          width="33.3%"
        />
        <TextField
          autoFocus
          label="Minor"
          name="minorVersion"
          onChange={e => this.handleInput(e)}
          textAlign="center"
          type="text"
          value={this.state.minorVersion}
          width="33.3%"
        />
        <TextField
          label="Patch"
          name="patchVersion"
          onChange={e => this.handleInput(e)}
          textAlign="center"
          type="text"
          value={this.state.patchVersion}
          width="33.4%"
        />
        <SubmitButton disabled={this.props.isLoading} onClick={() => this.handleSubmit()}>
          {this.props.isLoading ? 'Loading...' : 'Create New Version'}
        </SubmitButton>
      </Form>
    );
  }
}

NewVersionForm.defaultProps = {
  createVersion: () => {},
  error: '',
  isLoading: false,
  login: () => {},
  username: ''
};

NewVersionForm.propTypes = {
  createVersion: PropTypes.func,
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  login: PropTypes.func,
  username: PropTypes.string
};

function mapStateToProps(state) {
  return {
    error: state.newProject.error,
    isLoading: state.newProject.isLoading,
    username: state.user.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createVersion: (opts) => {
      dispatch(createVersion(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVersionForm);
