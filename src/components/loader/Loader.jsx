import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './Loader.sass';

class Loader extends Component {
  render() {
    return (
      <div className={styles.loader}>
        <img alt="Loading..." height="60" src="images/loader.gif" width="60" />
        <div>{this.props.text || 'Loading...'}</div>
      </div>
    );
  }
}

Loader.defaultProps = {
  text: ''
};

Loader.propTypes = {
  text: PropTypes.string
};

export default Loader;
