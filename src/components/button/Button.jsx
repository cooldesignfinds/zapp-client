import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Button.sass';

class Button extends Component {
  handleClick(event) {
    this.props.onClick(event);
  }
  handleContextMenu(event) {
    event.preventDefault();
    this.props.onContextMenu(event);
  }
  render() {
    return (
      <button
        className={classNames(
          styles.button,
          this.props.className
        )}
        id={this.props.id}
        name={this.props.name}
        onClick={event => this.handleClick(event)}
        onContextMenu={event => this.handleContextMenu(event)}
        onMouseDown={this.props.onMouseDown}
        ref={this.props.buttonRef}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.defaultProps = {
  alwaysEnabled: false,
  className: '',
  buttonRef: () => {},
  children: '',
  id: '',
  name: '',
  onClick: () => {},
  onContextMenu: () => {},
  onMouseDown: () => {}
};

Button.propTypes = {
  alwaysEnabled: PropTypes.bool,
  className: PropTypes.string,
  buttonRef: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  id: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  onMouseDown: () => {}
};

export default Button;
