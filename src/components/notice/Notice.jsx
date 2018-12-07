import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import redo from '../../actions/redo';
import undo from '../../actions/undo';

import Icon from '../../components/icon/Icon';
import IconButton from '../../components/icon-button/IconButton';
import ProjectActions from '../../components/project-actions/ProjectActions';

import styles from './Notice.sass';

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      openValue: '',
      showError: false
    };
  }
  handleRefresh() {
    window.location.reload();
  }
  render() {
    return (
      <div
        className={styles.notice}
      >
        <If condition={this.props.title}>
          <h1 className={styles.title}>
            {this.props.title}
          </h1>
        </If>
        <If condition={this.props.message}>
          <p>
            {this.props.message}
          </p>
        </If>
      </div>
    );
  }
}

Notice.defaultProps = {
  message: '',
  title: ''
};

Notice.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string
};

export default Notice;
