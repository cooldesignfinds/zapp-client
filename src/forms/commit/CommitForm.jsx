import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { OrderedMap } from 'immutable';

import Error from '../../components/error/Error';
import Form from '../../components/form/Form';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import syncProject from '../../actions/syncProject';

import styles from './CommitForm.sass';

class CommitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }
  handleInput({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }
  handleSubmit() {
    this.props.syncProject(this.props.projectName, {
      message: this.state.message
    });
  }
  render() {
    return (
      <div className={styles.login}>
        <Form onSubmit={() => this.handleSubmit()}>
          <TextField
            autoFocus
            label="Commit Message"
            name="message"
            onChange={e => this.handleInput(e)}
            type="text"
            value={this.state.message}
          />
          <SubmitButton
            disabled={this.props.isLoading}
          >
            {this.props.isLoading ? 'Loading...' : 'Commit to GitHub'}
          </SubmitButton>
        </Form>
        <p>
          This will create a new commit that is pushed immediately to GitHub.
        </p>
      </div>
    );
  }
}

CommitForm.defaultProps = {
  code: OrderedMap(),
  configs: OrderedMap(),
  error: '',
  files: OrderedMap(),
  generators: OrderedMap(),
  isLoading: false,
  projectId: '',
  schemas: OrderedMap(),
  specs: OrderedMap(),
  syncProject: () => {},
  templates: OrderedMap(),
  title: ''
};

CommitForm.propTypes = {
  code: PropTypes.object,
  configs: PropTypes.object,
  error: PropTypes.string,
  files: PropTypes.object,
  generators: PropTypes.object,
  isLoading: PropTypes.bool,
  projectName: PropTypes.string,
  schemas: PropTypes.object,
  specs: PropTypes.object,
  syncProject: PropTypes.func,
  templates: PropTypes.object,
  title: PropTypes.string
};

function mapStateToProps(state) {
  return {
    code: state.project.code,
    configs: state.project.configs,
    error: state.login.error,
    files: state.project.files,
    generators: state.project.generators,
    isLoading: state.login.isLoading,
    projectName: state.project.name,
    schemas: state.project.schemas,
    specs: state.project.specs,
    templates: state.project.templates
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncProject: (id, data) => {
      dispatch(syncProject(id, data));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommitForm);
