import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Log.sass';

class Log extends Component {
  render() {
    return (
      <li
        className={
          classNames(
            styles.log,
            styles[this.props.level]
          )
        }
      >
        {this.props.children}
      </li>
    );
  }
}

Log.defaultProps = {
  children: '',
  level: ''
};

Log.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  level: PropTypes.string
};

export default Log;
