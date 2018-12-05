import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Form.sass';

class Form extends Component {
  handleSubmit(event) {
    if (!this.props.action) {
      event.preventDefault();
    }
    this.props.onSubmit();
  }
  render() {
    return (
      <form
        action={this.props.action}
        className={classNames(styles.form, this.props.className)}
        onSubmit={event => this.handleSubmit(event)}
      >
        {this.props.children}
      </form>
    );
  }
}

Form.defaultProps = {
  action: '',
  children: '',
  className: '',
  onSubmit: () => {}
};

Form.propTypes = {
  action: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.string,
  onSubmit: PropTypes.func
};

export default Form;
