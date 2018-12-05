import React, { Component } from 'react';

import { Link } from 'react-router';

import styles from './NotFound.sass';

class NotFoundPage extends Component {
  render() {
    return (
      <div className={styles.notFound}>
        <h1>Not Found</h1>
        <div>Go back <Link to="/">home</Link></div>
      </div>
    );
  }
}

export default NotFoundPage;
