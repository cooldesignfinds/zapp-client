import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Tabs.sass';

class Tabs extends Component {
  render() {
    return (
      <ul className={styles.tabs}>
        {this.props.children}
      </ul>
    );
  }
}

Tabs.defaultProps = {
  children: {}
};

Tabs.propTypes = {
  children: PropTypes.object
};

export default Tabs;
