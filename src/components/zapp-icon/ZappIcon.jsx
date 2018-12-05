import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './ZappIcon.sass';

class ZappIcon extends Component {
  render() {
    return (
      <span
        className={styles.icon}
        style={{
          height: this.props.size,
          width: this.props.size
        }}
      >
        {this.props.children}
      </span>
    );
  }
}

ZappIcon.defaultProps = {
  children: '',
  size: 24
};

ZappIcon.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  size: PropTypes.number
};

export default ZappIcon;
