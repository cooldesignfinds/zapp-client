import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import Form from '../../components/form/Form';
import Group from '../../components/group/Group';
import RadioFields from '../../components/radio-fields/RadioFields';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import createProject from '../../actions/createProject';

import styles from './NewForm.sass';

class NewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      author: '',
      name: ''
    };
  }
  handleInput({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }
  handleSubmit() {
    this.props.createProject({
      author: this.state.author,
      name: this.state.name
    });
  }
  render() {
    return (
      <Form className={styles.new} onSubmit={() => this.handleSubmit()}>
        <h2>New Generator</h2>
        <TextField
          autoFocus
          label="Generator Name"
          name="name"
          onChange={e => this.handleInput(e)}
          type="text"
          value={this.state.name}
        />
        {false && (
          <RadioFields
            label="Generator Access"
            name="access"
            onChange={e => this.handleInput(e)}
            options={[
              {
                text: 'Public',
                value: 'public'
              },
              {
                text: 'Private',
                value: 'private'
              }
            ]}
            value={this.state.type}
          />
        )}
        <SubmitButton disabled={this.props.isLoading}>
          {this.props.isLoading ? 'Loading...' : 'Create New Generator'}
        </SubmitButton>
      </Form>
    );
  }
}

NewForm.defaultProps = {
  createProject: () => {},
  error: '',
  isLoading: false,
  login: () => {},
  username: ''
};

NewForm.propTypes = {
  createProject: PropTypes.func,
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
    createProject: (opts) => {
      dispatch(createProject(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewForm);
