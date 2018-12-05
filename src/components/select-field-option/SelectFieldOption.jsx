import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './SelectFieldOption.sass';

class SelectFieldOption extends Component {
  render() {
    return (
      <li
        className={
          classNames(
            styles.option,
            this.props.className,
            this.props.selected ? styles.selected : null
          )
        }
      >
        <button onMouseDown={this.props.onClick} type="button">
          {this.props.children}
        </button>
      </li>
    );
  }
}

SelectFieldOption.defaultProps = {
  autoFocus: false,
  className: '',
  children: '',
  label: '',
  onClick: () => {},
  placeholder: '',
  selected: false,
  type: '',
  value: ''
};

SelectFieldOption.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  label: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  selected: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.string
};

export default SelectFieldOption;
