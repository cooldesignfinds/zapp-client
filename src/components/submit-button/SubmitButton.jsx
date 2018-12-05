import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './SubmitButton.sass';

class SubmitButton extends Component {
  render() {
    return (
      <button className={styles.button} name={this.props.name} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}

SubmitButton.defaultProps = {
  children: '',
  name: '',
  onClick: () => {}
};

SubmitButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  name: PropTypes.string,
  onClick: PropTypes.func
};

export default SubmitButton;
