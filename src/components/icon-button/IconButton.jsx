import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './IconButton.sass';

class IconButton extends Component {
  handleButtonClick(e) {
    this.props.onClick(e);
  }
  handleLinkClick(e) {
    this.props.onClick(e);
  }
  render() {
    const imageUrl = /^((http|https):)?\/\//.test(this.props.type)
      || /\.gif/.test(this.props.type)
      || /\.png/.test(this.props.type)
      ? this.props.type
      : `images/icons/${this.props.type}.svg`;
    if (this.props.href) {
      return (
        <a
          className={classNames(
            styles.iconButton,
            this.props.rotated ? styles.rotated : null,
            this.props.className
          )}
          disabled={this.props.disabled}
          href={this.props.href}
          id={this.props.id}
          name={this.props.name}
          onClick={() => this.handleLinkClick()}
          rel={this.props.target === '_blank' ? 'noopener noreferrer' : ''}
          ref={this.props.buttonRef}
          style={{
            ...this.props.style,
            lineHeight: `${this.props.size + this.props.paddingHeight + 2}px`,
            height: this.props.size + this.props.paddingHeight,
            width: this.props.size + this.props.paddingWidth
          }}
          tabIndex={this.props.tabIndex}
          target={this.props.target}
          title={this.props.title}
        >
          <span
            className={styles.icon}
            style={{
              ...this.props.iconStyle,
              backgroundImage: `url(${imageUrl})`,
              height: this.props.size,
              width: this.props.size
            }}
          >
            {this.props.children}
          </span>
        </a>
      );
    }
    return (
      <button
        className={classNames(
          styles.iconButton,
          this.props.rotated ? styles.rotated : null,
          this.props.className
        )}
        disabled={this.props.disabled}
        id={this.props.id}
        name={this.props.name}
        onClick={event => this.handleButtonClick(event)}
        ref={this.props.buttonRef}
        style={{
          ...this.props.style,
          lineHeight: `${this.props.size + this.props.paddingHeight + 2}px`,
          height: this.props.size + this.props.paddingHeight,
          width: this.props.size + this.props.paddingWidth
        }}
        tabIndex={this.props.tabIndex}
        title={this.props.title}
        type="button"
      >
        <span
          className={styles.icon}
          style={{
            ...this.props.iconStyle,
            backgroundImage: `url(${imageUrl})`,
            height: this.props.size,
            width: this.props.size
          }}
        >
          {this.props.children}
        </span>
      </button>
    );
  }
}

IconButton.defaultProps = {
  buttonRef: () => {},
  className: '',
  children: '',
  disabled: false,
  href: '',
  iconStyle: {},
  id: '',
  name: '',
  onClick: () => {},
  paddingHeight: 0,
  paddingWidth: 0,
  rotated: false,
  size: 24,
  style: {},
  tabIndex: '',
  target: '',
  title: '',
  type: ''
};

IconButton.propTypes = {
  buttonRef: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  iconStyle: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  paddingHeight: PropTypes.number,
  paddingWidth: PropTypes.number,
  rotated: PropTypes.bool,
  size: PropTypes.number,
  style: PropTypes.object,
  tabIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  target: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string
};

export default IconButton;
