import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Icon.sass';

class Icon extends Component {
  render() {
    const imageUrl = /^((http|https):)?\/\//.test(this.props.type)
      || /\.gif/.test(this.props.type)
      || /\.png/.test(this.props.type)
      ? this.props.type
      : `images/icons/${this.props.type}.svg`;
    return (
      <span
        className={classNames(styles.icon, this.props.className)}
        style={{
          ...this.props.style,
          backgroundImage: `url(${imageUrl})`,
          height: this.props.size,
          width: this.props.size
        }}
      >
        {this.props.children}
      </span>
    );
  }
}

Icon.defaultProps = {
  className: '',
  children: '',
  disabled: false,
  onClick: () => {},
  paddingHeight: 0,
  paddingWidth: 0,
  rotated: false,
  size: 24,
  style: {},
  title: '',
  type: ''
};

Icon.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  paddingHeight: PropTypes.number,
  paddingWidth: PropTypes.number,
  rotated: PropTypes.bool,
  size: PropTypes.number,
  style: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.string
};

export default Icon;
