import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Label from '../label/Label';

import styles from './RadioFields.sass';

class RadioFields extends Component {
  handleChange(event) {
    event.stopPropagation();
    let target = event.target;
    if (target.tagName !== 'BUTTON') {
      target = target.parentNode;
    }
    this.props.onChange({
      ...event,
      target
    });
  }
  render() {
    return (
      <div className={styles.field}>
        <ul className={styles.options}>
          <Label htmlFor={this.props.name}>
            {this.props.label}
          </Label>
          {this.props.options.map((option, index) => {
            return (
              <li className={styles.option} key={index}>
                <button
                  className={
                    classNames(
                      styles.radio,
                      this.props.value === option.value ? styles.checked : null
                    )
                  }
                  id={option.name}
                  name={this.props.name}
                  onClick={event => this.handleChange(event)}
                  type="button"
                  value={option.value}
                >
                  <span />
                  <Label className={styles.label} htmlFor={this.props.name}>
                    {option.text}
                  </Label>
                </button>
                <input
                  checked={this.props.value === option.value}
                  className={styles.input}
                  id={option.name}
                  name={this.props.name}
                  onChange={this.props.onChange}
                  type="radio"
                  value={option.value}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

RadioFields.defaultProps = {
  label: '',
  name: '',
  onChange: () => {},
  options: [],
  value: ''
};

RadioFields.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string
};

export default RadioFields;
