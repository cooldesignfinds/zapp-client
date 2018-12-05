import classNames from 'classnames';
import os from 'os';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';

import 'xterm/dist/xterm.css';

import getWorkspaceDir from '../../lib/getWorkspaceDir';

import styles from './Terminal.sass';

Terminal.applyAddon(fit);

class TerminalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commandValue: ''
    };
    window.onbeforeunload = this.handleBeforeUnload.bind(this);
  }
  componentDidMount() {
    if (this.terminal || !window || !window.process || !window.process.type) {
      return;
    }

    // const remote = require('electron').remote;
    // const pty = remote.require('node-pty');

    this.terminal = new Terminal();
    this.terminal.open(this.terminalRef);
    this.terminal.setOption('fontSize', 10);
    this.terminal.fit();
    this.terminal.focus();

    // const shell = remote.process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    // this.process = pty.spawn(shell, [], {
    //   name: 'xterm-color',
    //   cols: 80,
    //   rows: 30,
    //   cwd: this.props.projectCwd,
    //   env: remote.process.env,
    //   uid: os.userInfo.uid,
    //   gid: os.userInfo.gid
    // });

    this.terminal.on('data', (data) => {
      this.process.write(data);
    });
    this.process.on('data', (data) => {
      this.terminal.write(data);
    });
  }
  componentWillUnmount() {
    this.handleBeforeUnload();
  }
  handleBeforeUnload() {
    if (this.process) {
      this.process.kill();
    }
    if (this.terminal) {
      this.terminal.dispose();
    }
  }
  render() {
    return (
      <div
        className={classNames(
          styles.terminal,
          this.props.className,
          this.props.show === false ? styles.hidden : null
        )}
        ref={(ref) => { this.terminalRef = ref; }}
      />
    );
  }
}

TerminalComponent.defaultProps = {
  className: '',
  show: false,
  // state props
  projectAuthorUsername: '',
  projectConfiguration: '',
  projectCwd: '',
  projectName: '',
  projectVersion: ''
};

TerminalComponent.propTypes = {
  className: PropTypes.string,
  show: PropTypes.bool,
  // state props
  projectAuthorUsername: PropTypes.string,
  projectConfiguration: PropTypes.string,
  projectCwd: PropTypes.string,
  projectName: PropTypes.string,
  projectVersion: PropTypes.string
};

function mapStateToProps(state) {
  return {
    projectAuthorUsername: state.project.author && state.project.author.username ? state.project.author.username : '',
    projectConfiguration: state.project.configuration,
    projectCwd: state.project.cwd,
    projectName: state.project.name,
    projectVersion: state.project.version
  };
}

export default connect(mapStateToProps)(TerminalComponent);
