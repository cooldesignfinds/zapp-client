import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import hideSelector from '../../actions/hideSelector';
import showSelector from '../../actions/showSelector';
import selectPaneTreeItem from '../../actions/selectPaneTreeItem';
import updateNewItemPath from '../../actions/updateNewItemPath';

import IconButton from '../../components/icon-button/IconButton';

import formatPaneName from '../../lib/formatPaneName';
import getItemPathParts from '../../lib/getItemPathParts';

import styles from './PathSelector.sass';

class PathSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changePath: '',
      isChanging: false
    };
  }
  handleBlur() {
    this.props.hideSelector();
  }
  handleChange(event) {
    const { value } = event.target;
    const lowercaseValue = event.target.value.toLowerCase();

    this.setState({
      changePath: value,
      isChanging: true
    });

    const filteredPaths = this.props.allPaths
      .filter(path => path.toLowerCase().includes(lowercaseValue));

    const options = [];
    filteredPaths.forEach((path) => {
      options.push({
        iconType: 'icon-gray',
        onSelect: () => this.handleRecentSelection(path),
        text: path,
        value: path
      });
    });

    this.props.showSelector({
      target: event.target,
      title: 'Matching Paths',
      name: 'path',
      options,
      width: event.target.offsetWidth
    });
  }
  handleKeyUp(event) {
    if (event.keyCode === 13 && document.activeElement) {
      document.activeElement.blur();
    }
  }
  handleNew() {
    this.props.updateNewItemPath();
    this.props.onRefFocus(`${this.props.itemPath === '/' ? '' : this.props.itemPath}/`, 'key');
  }
  handlePathSelector(event) {
    if (this.props.recentPaths.length === 0) {
      this.props.hideSelector();
      return;
    }

    const { value } = event.target;
    const lowercaseValue = event.target.value.toLowerCase();

    const filteredPaths = this.props.allPaths
      .filter(path => path.toLowerCase().includes(lowercaseValue));

    const options = [];
    filteredPaths.forEach((path) => {
      options.push({
        iconType: 'icon-gray',
        onSelect: () => this.handleRecentSelection(path),
        text: path,
        value: path
      });
    });

    this.props.showSelector({
      target: event.target,
      title: 'Matching Paths',
      name: 'path',
      options,
      width: event.target.offsetWidth
    });
  }
  handleRecentSelection(recentPath) {
    this.props.selectPaneTreeItem({
      itemPathParts: getItemPathParts(recentPath),
      itemPath: recentPath,
      paneIndex: this.props.paneIndex
    });
    this.setState({
      changePath: '',
      isChanging: false
    });
  }
  handleRecentSelector(event) {
    if (this.props.recentPaths.length === 0) {
      this.props.hideSelector();
      return;
    }

    const target = event.target.parentNode && event.target.parentNode.tagName === 'BUTTON'
      ? event.target.parentNode
      : event.target;

    const options = [];
    this.props.recentPaths.forEach((path) => {
      options.push({
        iconType: 'icon-gray',
        onSelect: () => this.handleRecentSelection(path),
        text: path,
        value: path
      });
    });

    this.props.showSelector({
      target,
      title: 'Recent Paths',
      name: 'path',
      options
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    this.props.hideSelector();

    const changePath = this.state.changePath.substr(0, 1) !== '/'
      ? `/${this.state.changePath}`
      : this.state.changePath;

    this.props.selectPaneTreeItem({
      itemPathParts: getItemPathParts(changePath),
      itemPath: changePath,
      paneIndex: this.props.paneIndex
    });

    this.setState({
      changePath: '',
      isChanging: false
    });

    if (this.pathRef) {
      this.pathRef.blur();
    }
  }
  render() {
    return (
      <div
        className={styles.pathSelector}
      >
        <IconButton
          onClick={() => this.handleNew()}
          paddingHeight={16}
          paddingWidth={10}
          size={8}
          title={`Add ${formatPaneName(this.props.type)} in ${this.props.itemPath}`}
          type={this.props.iconType}
        />
        <form
          className={classNames(
            styles.pathSelectorForm,
            this.props.readOnly ? styles.readOnly : null
          )}
          onSubmit={event => this.handleSubmit(event)}
        >
          <input
            autoComplete="off"
            spellCheck="false"
            className={styles.pathSelectorInput}
            id={`pane-${this.props.paneIndex}_path-selector`}
            ref={(ref) => { this.pathRef = ref; }}
            onBlur={() => this.handleBlur()}
            onChange={event => this.handleChange(event)}
            onFocus={event => this.handlePathSelector(event)}
            onKeyUp={event => this.handleKeyUp(event)}
            title={`Path Selector (${this.props.itemPath})`}
            value={this.state.isChanging ? this.state.changePath : this.props.itemPath}
          />
        </form>
        <If condition={!this.props.readOnly}>
          <IconButton
            id={`pane-${this.props.paneIndex}_add-item-button`}
            onClick={() => this.handleNew()}
            paddingHeight={16}
            paddingWidth={10}
            size={8}
            title={`Add ${formatPaneName(this.props.type)} in ${this.props.itemPath}`}
            type="add-gray"
          />
        </If>
        <IconButton
          id={`pane-${this.props.paneIndex}_recent-paths-button`}
          onClick={event => this.handleRecentSelector(event)}
          paddingHeight={16}
          paddingWidth={10}
          size={8}
          title="Recent Paths"
          type="recent-gray"
        />
      </div>
    );
  }
}

PathSelector.defaultProps = {
  allPaths: [],
  hideSelector: PropTypes.func,
  iconType: 'file',
  itemPath: '',
  onRefFocus: () => {},
  paneIndex: -1,
  readOnly: false,
  recentPaths: [],
  selectPaneTreeItem: () => {},
  showSelector: () => {},
  type: '',
  updateNewItemPath: () => {}
};

PathSelector.propTypes = {
  allPaths: PropTypes.array,
  hideSelector: PropTypes.func,
  iconType: PropTypes.string,
  itemPath: PropTypes.string,
  onRefFocus: PropTypes.func,
  paneIndex: PropTypes.number,
  readOnly: PropTypes.bool,
  recentPaths: PropTypes.array,
  selectPaneTreeItem: PropTypes.func,
  showSelector: PropTypes.func,
  type: PropTypes.string,
  updateNewItemPath: PropTypes.func
};

function mapDispatchToProps(dispatch, props) {
  return {
    hideSelector: () => {
      dispatch(hideSelector());
    },
    selectPaneTreeItem: (opts) => {
      dispatch(selectPaneTreeItem(opts));
    },
    showSelector: (opts) => {
      dispatch(showSelector(opts));
    },
    updateNewItemPath: (opts) => {
      dispatch(updateNewItemPath({
        itemPath: props.itemPath,
        paneIndex: props.paneIndex,
        ...opts
      }));
    }
  };
}

function mapStateToProps(state, props) {
  const pane = state.pane.items[props.paneIndex];
  return {
    recentPaths: pane.recentPaths
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PathSelector);
