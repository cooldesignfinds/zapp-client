import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Tab.sass';

class Tab extends Component {
  render() {
    return (
      <li
        className={styles.tab}
        title={this.props.title}
      >
        {this.props.children}
      </li>
    );
  }
}

Tab.defaultProps = {
  children: {},
  title: ''
};

Tab.propTypes = {
  children: PropTypes.object,
  title: PropTypes.string
};

export default Tab;
