import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import clearLogs from '../../actions/clearLogs';

import styles from './Errors.sass';

class Errors extends Component {
  handleClearLogs() {
    this.props.clearLogs();
  }
  render() {
    const errors = this.props.logs.filter(log => log.level === 'error');
    return (
      <If condition={errors.length > 0}>
        <div className={styles.error}>
          <button className={styles.errorClose} onClick={() => this.handleClearLogs()}>
            x
          </button>
          <span className={styles.errorCount}>
            {errors.length}
          </span>
          <span className={styles.errorMessage}>
            {errors[0].message}
          </span>
        </div>
      </If>
    );
  }
}

Errors.defaultProps = {
  clearLogs: () => {},
  logs: []
};

Errors.propTypes = {
  clearLogs: PropTypes.func,
  logs: PropTypes.array
};

function mapStateToProps(state) {
  return {
    logs: state.log.logs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearLogs: () => {
      dispatch(clearLogs());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Errors);
