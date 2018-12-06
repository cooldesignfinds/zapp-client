import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import redo from '../../actions/redo';
import undo from '../../actions/undo';

import Icon from '../../components/icon/Icon';
import IconButton from '../../components/icon-button/IconButton';
import ProjectActions from '../../components/project-actions/ProjectActions';

import styles from './Header.sass';

class Header extends Component {
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
      <header
        className={styles.header}
      >
        <h1>
          <ul className={styles.main}>
            <li>
              <Icon
                className={styles.icon}
                id="icon-button"
                size={24}
                style={{
                  backgroundColor: this.props.projectColor
                }}
                type="images/icons/logo.png"
              />
            </li>
            <If condition={!!this.props.projectName}>
              <li className={styles.projectName}>
                {this.props.projectName}
              </li>
              <li>
                <IconButton
                  className={styles.icon}
                  id="refresh-button"
                  onClick={() => this.handleRefresh()}
                  paddingHeight={12}
                  paddingWidth={12}
                  size={12}
                  title="Refresh (CMD+R)"
                  type="refresh-gray"
                />
              </li>
              <li>
                <IconButton
                  className={styles.icon}
                  disabled={this.props.history.length <= 1 || this.props.historyIndex === 0}
                  id="undo-button"
                  onClick={() => this.props.undo()}
                  paddingHeight={12}
                  paddingWidth={12}
                  size={12}
                  title="Undo"
                  type="undo-gray"
                />
              </li>
              <li>
                <IconButton
                  className={styles.icon}
                  disabled={this.props.history.length <= 1 || this.props.historyIndex === this.props.history.length - 1}
                  id="redo-button"
                  onClick={() => this.props.redo()}
                  paddingHeight={12}
                  paddingWidth={12}
                  size={12}
                  title="Redo"
                  type="redo-gray"
                />
              </li>
            </If>
          </ul>
        </h1>
        <nav className={styles.user}>
          <ul>
            <ProjectActions />
          </ul>
        </nav>
      </header>
    );
  }
}

Header.defaultProps = {
  projectName: '',
  // state props
  history: [],
  historyIndex: 0,
  projectColor: '',
  // dispatch props
  redo: () => {},
  undo: () => {}
};

Header.propTypes = {
  projectName: PropTypes.string,
  // state props
  history: PropTypes.array,
  historyIndex: PropTypes.number,
  projectColor: PropTypes.string,
  // dispatch props
  redo: PropTypes.func,
  undo: PropTypes.func
};

function mapStateToProps(state) {
  return {
    history: state.project.history,
    historyIndex: state.project.historyIndex,
    projectColor: state.project.color,
    projectName: state.project.name,
    selectMenuItem: state.menu.selectedItem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    redo: () => {
      dispatch(redo());
    },
    undo: () => {
      dispatch(undo());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
