import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Label.sass';

class Button extends Component {
  render() {
    return (
      <label
        className={classNames(styles.label, this.props.className)}
        htmlFor={this.props.htmlFor}
      >
        {this.props.children}
      </label>
    );
  }
}

Button.defaultProps = {
  className: '',
  children: '',
  htmlFor: ''
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  htmlFor: PropTypes.string
};

export default Button;
