import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import tutorialNext from '../../actions/tutorialNext';

import styles from './Button.sass';

class Button extends Component {
  handleClick(event) {
    if (this.props.tutorialMode) {
      this.props.tutorialNext();
    }
    this.props.onClick(event);
  }
  handleContextMenu(event) {
    event.preventDefault();
    if (this.props.tutorialMode) {
      this.props.tutorialNext();
    }
    this.props.onContextMenu(event);
  }
  render() {
    const tutorialMode = this.props.tutorialMode
      && !this.props.alwaysEnabled
      && !this.props.tutorialEnabledElements.includes(this.props.id);
    return (
      <button
        className={classNames(
          styles.button,
          this.props.className,
          tutorialMode ? styles.tutorialMode : null
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
  onMouseDown: () => {},
  // state props
  tutorialEnabledElements: [],
  tutorialMode: false,
  // dispatch props
  tutorialNext: () => {}
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
  onMouseDown: () => {},
  // state props
  tutorialEnabledElements: PropTypes.array,
  tutorialMode: PropTypes.bool,
  // dispatch props
  tutorialNext: PropTypes.func
};

function mapStateToProps(state) {
  return {
    tutorialEnabledElements: state.tutorial.enabledElements,
    tutorialMode: state.tutorial.show
  };
}

function mapDispatchToProps(dispatch) {
  return {
    tutorialNext: () => {
      dispatch(tutorialNext());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Button);
