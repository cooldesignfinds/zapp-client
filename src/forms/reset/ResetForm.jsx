import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

import Error from '../../components/error/Error';
import Form from '../../components/form/Form';
import SubmitButton from '../../components/submit-button/SubmitButton';

import loadProject from '../../actions/loadProject';
import resetProject from '../../actions/resetProject';

import styles from './ResetForm.sass';

class ResetForm extends React.Component {
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
    this.props.resetProject(this.props.projectId, this.props.projectType);
    this.props.loadProject(this.props.projectName);
  }
  render() {
    return (
      <div className={styles.login}>
        <Form onSubmit={() => this.handleSubmit()}>
          <p>
            Are you sure? You will lose any locally saved data for this project.
          </p>
          <SubmitButton
            disabled={this.props.isLoading}
          >
            {this.props.isLoading ? 'Loading...' : 'Reset Project'}
          </SubmitButton>
        </Form>
      </div>
    );
  }
}

ResetForm.defaultProps = {
  error: '',
  isLoading: false,
  loadProject: () => {},
  projectId: '',
  projectName: '',
  projectType: '',
  resetProject: () => {}
};

ResetForm.propTypes = {
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  loadProject: PropTypes.func,
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  projectType: PropTypes.string,
  resetProject: PropTypes.func
};

function mapStateToProps(state) {
  return {
    error: state.project.error,
    isLoading: state.project.isLoading,
    projectId: state.project.id,
    projectName: state.project.name,
    projectType: state.project.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadProject: (name) => {
      dispatch(loadProject(name));
    },
    resetProject: (id, type) => {
      dispatch(resetProject(id, type));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetForm);
