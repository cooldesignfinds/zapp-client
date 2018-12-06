import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import moveItem from '../../actions/moveItem';

import TreeItem from '../../components/tree-item/TreeItem';

import CodeItem from '../../lib/CodeItem';
import formatPaneName from '../../lib/formatPaneName';
import getItemPathParts from '../../lib/getItemPathParts';
import getItemType from '../../lib/getItemType';
import getItemPath from '../../lib/getItemPath';
import getMode from '../../lib/getMode';

import styles from './Tree.sass';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newLevel: 0,
      newPath: [],
      newValue: '',
      schemaProperties: [],
      showNew: ''
    };
  }
  filterItems(key, items) {
    const value = items[key];
    return value instanceof OrderedMap;
  }
  handleDragEnd() {
    if (this.props.readOnly) {
      return;
    }
    this.setState({
      dragFromId: '',
      dragToId: '',
      dragDirection: ''
    });
  }
  handleDragOver(event, itemPath) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.readOnly) {
      return;
    }
    let dragDirection = 'below';
    if (event.nativeEvent.offsetY < event.target.offsetHeight / 2) {
      dragDirection = 'above';
    }
    if (this.state.dragToId !== itemPath || this.state.dragDirection !== dragDirection) {
      this.setState({
        dragToId: itemPath,
        dragDirection
      });
    }
  }
  handleDragStart(event, itemPath) {
    event.stopPropagation();
    if (this.props.readOnly) {
      return;
    }
    this.setState({
      dragFromId: itemPath
    });
  }
  handleDrop(event, itemPath) {
    event.stopPropagation();
    if (this.props.readOnly) {
      return;
    }
    this.props.moveItem({
      srcItemPathParts: getItemPathParts(this.state.dragFromId),
      targetItemPathParts: getItemPathParts(itemPath),
      direction: this.state.dragDirection
    });
    this.setState({
      dragFromId: '',
      dragToId: '',
      dragDirection: ''
    });
  }
  renderItems(items, parentItem, parentPath = []) {
    const level = parentPath.length;
    if (!(items instanceof OrderedMap) && !this.props.includeItems) {
      return null;
    }
    return (
      <ul className={!parentPath.length ? styles.parent : null}>
        {[...items.keys()].filter(k => items.get(k) instanceof CodeItem || items.get(k) instanceof OrderedMap || this.props.includeItems).map((itemKey) => {
          const itemMode = getMode(itemKey);
          const itemValue = items.get(itemKey);
          const itemPathParts = parentPath.slice(0).concat([itemKey]);
          const itemPath = getItemPath(itemPathParts);
          const itemType = getItemType(itemValue);

          const isExpandable = ['array', 'object'].includes(itemType);
          const isEmpty = (!Array.isArray(itemValue) && !(itemValue instanceof OrderedMap)) || itemValue.reduce((accum, childItem) => {
            if (accum === false || childItem instanceof OrderedMap || childItem instanceof CodeItem || this.props.includeItems) {
              return false;
            }
            return true;
          }, true);

          const isSelected = this.props.selectedItem === itemPath;
          const isExpanded = this.props.expandedItems
            .some(expandedPath => itemPath === expandedPath);

          let iconType = itemMode || 'file';
          if (isExpandable) {
            if (isEmpty) {
              if (isSelected) {
                iconType = 'arrow-dark-orange';
              } else {
                iconType = 'arrow-gray';
              }
            } else if (isSelected) {
              iconType = 'arrow-black';
            } else {
              iconType = 'arrow';
            }
          } else if (isSelected) {
            iconType = `${iconType}-black`;
          }

          return (
            <Fragment key={itemPath}>
              <If condition={this.state.dragFromId !== itemPath && this.state.dragToId === itemPath && this.state.dragDirection === 'above'}>
                <li
                  className={styles.drag}
                  style={{ padding: `0 0 0 ${(level - 1) * 18}px` }}
                />
              </If>
              <TreeItem
                hasChanges={this.props.codeChanges.includes(itemPath)}
                iconType={iconType}
                isEmpty={isEmpty}
                isExpandable={isExpandable}
                isExpanded={isExpanded}
                isFocused={this.props.isFocused}
                isSelected={isSelected}
                itemKey={itemKey}
                itemPathParts={itemPathParts}
                itemPath={itemPath}
                itemValue={itemValue}
                items={this.props.items}
                level={level}
                newItemPath={this.props.newItemPath}
                newItemValue={this.props.newItemValue}
                onDragEnd={() => this.handleDragEnd()}
                onDragOver={e => this.handleDragOver(e, itemPath)}
                onDragStart={e => this.handleDragStart(e, itemPath)}
                onDrop={e => this.handleDrop(e, itemPath)}
                paneIndex={this.props.paneIndex}
                paneName={formatPaneName(this.props.paneType)}
                paneType={this.props.paneType}
                parentItem={parentItem}
                projectId={this.props.projectId}
                readOnly={this.props.readOnly}
                schemas={this.props.schemas}
                selectorData={this.props.selectorData}
                showNew={this.props.newItemPath === itemPath}
              >
                <If condition={isExpanded}>
                  {this.renderItems(itemValue, items, itemPathParts)}
                </If>
              </TreeItem>
              <If condition={this.state.dragFromId !== itemPath && this.state.dragToId === itemPath && this.state.dragDirection === 'below'}>
                <li
                  className={styles.drag}
                  style={{ padding: `0 0 0 ${(level - 1) * 18}px` }}
                />
              </If>
            </Fragment>
          );
        })}
      </ul>
    );
  }
  render() {
    return (
      <div className={styles.tree}>
        <If condition={this.props.paneType === 'code'}>
          {this.renderItems(this.props.items)}
        </If>
        <If condition={this.props.paneType !== 'code'}>
          <ul>
            <TreeItem
              isFocused={this.props.isFocused}
              isSelected={this.props.selectedItem === '/'}
              itemKey="/"
              itemPathParts={[]}
              itemPath="/"
              items={this.props.items}
              key="/"
              level={-1}
              newItemPath={this.props.newItemPath}
              newItemValue={this.props.newItemValue}
              paneIndex={this.props.paneIndex}
              paneName={formatPaneName(this.props.paneType)}
              paneType={this.props.paneType}
              projectId={this.props.projectId}
              readOnly={this.props.readOnly}
              schemas={this.props.schemas}
              selectorData={this.props.selectorData}
              showNew={this.props.newItemPath === '/'}
            >
              {this.renderItems(this.props.items)}
            </TreeItem>
          </ul>
        </If>
      </div>
    );
  }
}

Tree.defaultProps = {
  codeChanges: [],
  configs: OrderedMap(),
  includeItems: false,
  initialItemPath: '',
  items: OrderedMap(),
  paneIndex: -1,
  paneType: '',
  projectId: '',
  projectName: '',
  readOnly: false,
  schemas: OrderedMap(),
  url: '',
  // state props
  expandedItems: [],
  isFocused: false,
  newItemPath: '',
  newItemValue: '',
  selectedItem: '',
  selectorData: {},
  // dispatch props
  moveItem: () => {}
};

Tree.propTypes = {
  codeChanges: PropTypes.array,
  configs: PropTypes.instanceOf(OrderedMap),
  includeItems: PropTypes.bool,
  initialItemPath: PropTypes.string,
  items: PropTypes.instanceOf(OrderedMap),
  newItem: PropTypes.string,
  paneIndex: PropTypes.number,
  paneType: PropTypes.string,
  projectId: PropTypes.string,
  projectName: PropTypes.string,
  readOnly: PropTypes.bool,
  schemas: PropTypes.instanceOf(OrderedMap),
  url: PropTypes.string,
  // state props
  expandedItems: PropTypes.array,
  isFocused: PropTypes.bool,
  newItemPath: PropTypes.string,
  newItemValue: PropTypes.string,
  selectedItem: PropTypes.string,
  selectorData: PropTypes.object,
  // dispatch props
  moveItem: () => {}
};

function mapStateToProps(state = {}, props) {
  const pane = state.pane.items[props.paneIndex];
  return {
    codeChanges: state.project.codeChanges,
    configs: state.project.configs,
    expandedItems: pane.tree.expandedItems,
    isFocused: state.pane.focusedItem === props.paneIndex,
    newItemPath: pane.tree.newItem.url,
    newItemValue: pane.tree.newItem.value,
    projectId: state.project.id,
    projectName: state.project.name,
    selectedItem: pane.tree.selectedItem,
    selectorData: state.selector.data
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    moveItem: (opts) => {
      dispatch(
        moveItem({
          paneType: props.paneType,
          ...opts
        })
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
