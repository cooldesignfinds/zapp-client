import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './A.sass';

class A extends Component {
  render() {
    return (
      <a
        className={classNames(
          styles.button,
          this.props.className,
          this.props.tutorialMode ? styles.tutorialMode : null
        )}
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
  target: '',
  tutorialMode: false
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
  target: PropTypes.string,
  tutorialMode: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    tutorialMode: state.tutorial.show
  };
}

export default connect(mapStateToProps)(A);
