import classNames from 'classnames';
import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import focusPane from '../../actions/focusPane';

import Code from '../../components/code/Code';
import Editor from '../../components/editor/Editor';
import PathSelector from '../../components/path-selector/PathSelector';
import Toolbar from '../../components/toolbar/Toolbar';
import Tree from '../../components/tree/Tree';

import { ThemeContext } from '../../contexts/theme';

import getAllItemPaths from '../../lib/getAllItemPaths';
import getItemPathParts from '../../lib/getItemPathParts';
import getItemType from '../../lib/getItemType';
import getMode from '../../lib/getMode';

import styles from './Pane.sass';

class Pane extends Component {
  handleMouseDown() {
    this.props.focusPane({
      paneIndex: this.props.index
    });
  }
  render() {
    const itemPath = this.props.selectedTreeItem;
    const itemPathParts = itemPath.split('/');
    const itemKey = itemPathParts[itemPathParts.length - 1];
    const items = itemPath
      ? this.props.items.getIn(getItemPathParts(itemPath))
      : this.props.items;
    const itemType = getItemType(items);
    const itemMode = itemType === 'code' ? items.mode : getMode(itemKey);
    const itemValue = itemType === 'string'
      ? items
      : (itemType === 'code' ? items.value : '');
    const iconType = itemMode || 'file';
    const readOnly = this.props.type === 'code'
      || (this.props.projectAuthorUsername !== this.props.username)
      || this.props.projectVersion !== 'latest';
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div
            className={classNames(styles.pane, this.props.className)}
            onMouseDown={() => this.handleMouseDown()}
            style={{
              borderRightColor: theme.borderColor,
              left: `${this.props.width * this.props.index}%`,
              width: `${this.props.width}%`
            }}
          >
            <Toolbar
              paneCount={this.props.totalPaneCount}
              paneIndex={this.props.index}
              paneType={this.props.type}
              projectUrl={this.props.projectUrl}
            />
            <If condition={this.props.showSidebar}>
              <div
                className={styles.sidebar}
                style={{
                  borderRightColor: theme.borderColor
                }}
              >
                <Tree
                  includeItems={this.props.type === 'code'}
                  initialItemPath={itemPath}
                  items={this.props.items}
                  paneIndex={this.props.index}
                  paneType={this.props.type}
                  projectId={this.props.projectId}
                  readOnly={readOnly}
                  schemas={this.props.schemas}
                  url={`${this.props.projectUrl}/${this.props.type}`}
                />
              </div>
            </If>
            <div
              className={classNames(styles.content, !this.props.showSidebar ? styles.fullScreen : null)}
            >
              <Choose>
                <When condition={this.props.type === 'code' || itemType === 'code'}>
                  <PathSelector
                    allPaths={getAllItemPaths(this.props.items, '/', this.props.type === 'code' ? 'string' : 'object')}
                    iconType={iconType}
                    itemPath={itemPath}
                    paneIndex={this.props.index}
                    readOnly={readOnly}
                    url={itemPath}
                    type={this.props.type}
                  />
                  <Code
                    defaultValue={itemValue}
                    height="calc(100% - 25px)"
                    id={`pane-${this.props.index}_code`}
                    itemPathParts={this.props.currentPath}
                    mode={itemMode}
                    readOnly={readOnly}
                    paneIndex={this.props.index}
                    paneType={this.props.type}
                    value={itemValue}
                  />
                </When>
                <Otherwise>
                  <Editor
                    allItems={this.props.items}
                    items={items}
                    paneIndex={this.props.index}
                    paneType={this.props.type}
                    readOnly={readOnly}
                    rootItemLevel={this.props.currentPath.length}
                    rootItemPath={itemPath}
                    rootItemPathParts={this.props.currentPath}
                    schemas={this.props.schemas}
                  />
                </Otherwise>
              </Choose>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Pane.defaultProps = {
  className: '',
  currentPath: [],
  index: -1,
  items: OrderedMap(),
  projectUrl: '',
  schemas: OrderedMap(),
  type: '',
  width: 100,
  // state props
  projectAuthorUsername: '',
  projectId: '',
  projectVersion: '',
  selectedTreeItem: '',
  showSidebar: false,
  totalPaneCount: 0,
  username: '',
  // dispatch props
  focusPane: () => {}
};

Pane.propTypes = {
  className: PropTypes.string,
  currentPath: PropTypes.array,
  index: PropTypes.number,
  items: PropTypes.instanceOf(OrderedMap),
  projectUrl: PropTypes.string,
  schemas: PropTypes.instanceOf(OrderedMap),
  type: PropTypes.string,
  width: PropTypes.number,
  // state props
  projectAuthorUsername: PropTypes.string,
  projectId: PropTypes.string,
  projectVersion: PropTypes.string,
  selectedTreeItem: PropTypes.string,
  showSidebar: PropTypes.bool,
  totalPaneCount: PropTypes.number,
  username: PropTypes.string,
  // dispatch props
  focusPane: PropTypes.func
};

function mapStateToProps(state, props) {
  const pane = state.pane.items[props.index];
  return {
    projectAuthorUsername: state.project.author && state.project.author.username ? state.project.author.username : '',
    projectId: state.project.id,
    projectVersion: state.project.version,
    selectedTreeItem: pane.tree.selectedItem,
    showSidebar: pane.tree.open,
    totalPaneCount: state.pane.items.length,
    username: state.user.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    focusPane: (opts) => {
      dispatch(focusPane(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pane);
