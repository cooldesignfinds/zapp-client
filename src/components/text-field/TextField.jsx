import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './TextField.sass';

import Label from '../label/Label';

class TextField extends Component {
  render() {
    return (
      <div
        className={classNames(styles.field, this.props.className)}
        style={{
          textAlign: this.props.textAlign,
          width: this.props.width
        }}
      >
        <Label htmlFor={this.props.name}>
          {this.props.label}
        </Label>
        <input
          autoFocus={this.props.autoFocus}
          className={styles.button}
          disabled={this.props.disabled}
          id={this.props.name}
          name={this.props.name}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          style={{
            textAlign: this.props.textAlign
          }}
          type={this.props.type}
          value={this.props.value}
        />
      </div>
    );
  }
}

TextField.defaultProps = {
  autoFocus: false,
  className: '',
  disabled: false,
  label: '',
  name: '',
  onChange: () => {},
  placeholder: '',
  textAlign: 'left',
  type: '',
  value: '',
  width: '100%'
};

TextField.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  textAlign: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  width: PropTypes.string
};

export default TextField;
