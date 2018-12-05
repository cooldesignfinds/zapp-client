import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import Error from '../../components/error/Error';
import Form from '../../components/form/Form';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import createConfiguration from '../../actions/createConfiguration';

import styles from './NewConfiguration.sass';

class NewConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      configuration: ''
    };
  }
  handleInput({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }
  handleSubmit() {
    if (this.state.configuration === 'default') {
      this.setState({
        error: 'Cannot use "default".'
      });
      return;
    } else if (this.state.configuration.length === 0) {
      this.setState({
        error: 'Configuration is required.'
      });
      return;
    }

    this.props.createConfiguration({
      configuration: this.state.configuration
    });
  }
  render() {
    return (
      <Form className={styles.new} onSubmit={() => this.handleSubmit()}>
        <Error>
          {this.state.error}
        </Error>
        <h2>New Configuration</h2>
        <p>
          Create a new configuration that extends your default configuration.
        </p>
        <TextField
          autoFocus
          label="Configuration"
          name="configuration"
          onChange={e => this.handleInput(e)}
          type="text"
          value={this.state.configuration}
        />
        <SubmitButton disabled={this.props.isLoading} onClick={() => this.handleSubmit()}>
          {this.props.isLoading ? 'Loading...' : 'Create Configuration'}
        </SubmitButton>
      </Form>
    );
  }
}

NewConfiguration.defaultProps = {
  createConfiguration: () => {},
  error: '',
  isLoading: false,
  login: () => {},
  username: ''
};

NewConfiguration.propTypes = {
  createConfiguration: PropTypes.func,
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
    createConfiguration: (opts) => {
      dispatch(createConfiguration(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewConfiguration);
