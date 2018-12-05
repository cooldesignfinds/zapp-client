import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './Shortcuts.sass';

class Shortcuts extends Component {
  render() {
    return (
      <If condition={this.props.showShortcuts}>
        <div className={styles.shortcuts}>
          <h4>Shortcuts</h4>
          <h5>Type Casting</h5>
          <ul>
            <li>
              <b>a</b> <em>cast as array</em>
            </li>
            <li>
              <b>b</b> <em>cast as boolean</em>
            </li>
            <li>
              <b>c</b> <em>cast as code</em>
            </li>
            <li>
              <b>l</b> <em>cast as null</em>
            </li>
            <li>
              <b>n</b> <em>cast as number</em>
            </li>
            <li>
              <b>o</b> <em>cast as object</em>
            </li>
            <li>
              <b>s</b> <em>cast as string</em>
            </li>
          </ul>
          <h5>Operations</h5>
          <ul>
            <li>
              <b>+</b> <em>new item</em>
            </li>
            <li>
              <b>d</b> <em>duplicate item</em>
            </li>
            <li>
              <b>delete</b> <em>delete item</em>
            </li>
            <li>
              <b>&lt;</b> <em>move left (unindent)</em>
            </li>
            <li>
              <b>&gt;</b> <em>move right (indent)</em>
            </li>
          </ul>
        </div>
      </If>
    );
  }
}

Shortcuts.defaultProps = {
  showShortcuts: false
};

Shortcuts.propTypes = {
  showShortcuts: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    showShortcuts: state.shortcuts.show
  };
}

export default connect(mapStateToProps)(Shortcuts);
