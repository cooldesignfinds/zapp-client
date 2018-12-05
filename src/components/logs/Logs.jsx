import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Logs.sass';

class Logs extends Component {
  render() {
    return (
      <ul className={styles.logs}>
        {this.props.children}
      </ul>
    );
  }
}

Logs.defaultProps = {
  children: ''
};

Logs.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
};

export default Logs;
