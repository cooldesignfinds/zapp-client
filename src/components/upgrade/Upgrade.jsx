import React, { Component } from 'react';

import styles from './Upgrade.sass';

class Upgrade extends Component {
  handleDownload(event) {
    event.preventDefault();
    window.open('https://zappjs.com/download');
    return false;
  }
  render() {
    return (
      <div className={styles.upgrade}>
        <h1>Please Upgrade</h1>
        <p>You are using an outdated version of ZappJS. Upgrade now to continue.</p>
        <h2>Method 1</h2>
        <p>Go to <b>File</b> &gt; <b>Check for Updates</b></p>
        <h2>Method 2</h2>
        <p>Re-download a fresh copy of ZappJS here: <a href="https://zappjs.com/download" onClick={e => this.handleDownload(e)}>https://zappjs.com/download</a></p>
      </div>
    );
  }
}

export default Upgrade;
