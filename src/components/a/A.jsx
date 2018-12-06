import PropTypes from 'prop-types';
import React, { Component } from 'react';

class A extends Component {
  render() {
    return (
      <a
        className={this.props.className}
        href={this.props.href}
        id={this.props.id}
        name={this.props.name}
        onClick={this.props.onClick}
        ref={this.props.buttonRef}
        target={this.props.target}
      >
        {this.props.children}
      </a>
    );
  }
}

A.defaultProps = {
  buttonRef: () => {},
  children: '',
  className: '',
  href: '',
  id: '',
  name: '',
  onClick: () => {},
  // state props
  target: ''
};

A.propTypes = {
  buttonRef: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  href: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  target: PropTypes.string
};

export default A;
