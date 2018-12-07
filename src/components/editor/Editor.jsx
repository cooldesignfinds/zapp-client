import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { List, OrderedMap } from 'immutable';

import generate from '../../actions/generate';
import hideSelector from '../../actions/hideSelector';
import moveItem from '../../actions/moveItem';

import EditorItem from '../../components/editor-item/EditorItem';
import PathSelector from '../../components/path-selector/PathSelector';

import getAllItemPaths from '../../lib/getAllItemPaths';
import getItemPath from '../../lib/getItemPath';
import getItemPathParts from '../../lib/getItemPathParts';
import getItemType from '../../lib/getItemType';
import getQuerySelector from '../../lib/getQuerySelector';
import getSchemaProperties from '../../lib/getSchemaProperties';

import styles from './Editor.sass';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.handleRefFocus = this.handleRefFocus.bind(this);

    this.keyRefs = {};
    this.modeRefs = {};
    this.valueRefs = {};

    this.state = {
      goToNextWhenDone: false,

      collapsedPaths: [],
      dragFromId: '',
      dragFromPath: [],
      dragToId: '',
      formType: '',
      selectedItemPathParts: [],

      field: '',
      id: '',
      level: 0,
      oldKey: '',
      path: [],
      key: '',
      schemas: [],
      type: '',
      value: '',
      mode: ''
    };
  }
  getLeft(val) {
    return this.props.leftOffset + val;
  }
  handleDragEnd() {
    this.setState({
      dragFromId: '',
      dragFromPath: [],
      dragToId: '',
      dragDirection: ''
    });
  }
  handleDragOver(event, itemPath) {
    event.preventDefault();
    event.stopPropagation();
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
  handleDragStart(event, itemPath, itemPathParts) {
    event.stopPropagation();
    this.setState({
      dragFromId: itemPath,
      dragFromPath: itemPathParts
    });
  }
  handleDrop(event, itemPath, itemPathParts) {
    event.stopPropagation();
    this.props.moveItem({
      srcItemPathParts: getItemPathParts(this.state.dragFromId),
      targetItemPathParts: itemPathParts,
      direction: this.state.dragDirection
    });
    this.setState({
      dragFromId: '',
      dragFromPath: [],
      dragToId: '',
      dragDirection: ''
    });
    this.props.generate();
  }
  handleRefFocus(itemPath, refType, isCode) {
    setTimeout(() => {
      const ref = document.querySelector(getQuerySelector(`#pane-${this.props.paneIndex}_editor-item_${itemPath}_${refType}${isCode ? ' textarea' : ''}`));
      if (ref) {
        ref.focus();
      }
    }, 1);
  }
  resetForm() {
    this.props.hideSelector();
    this.setState({
      field: '',
      id: '',
      oldKey: '',
      path: [],
      key: '',
      type: '',
      value: '',
      mode: ''
    });
  }
  renderItems(items, parentItemPathParts = [], parentLevel = 0, parentItemType = 'object') {
    const level = parentLevel + 1;
    let mappedItems = (
      items instanceof List
        ? (
          items.map((itemValue, itemIndex) => {
            return {
              isNew: false,
              itemKey: itemIndex,
              itemType: getItemType(itemValue === null ? 'null' : itemValue),
              itemValue: itemValue === null ? 'null' : itemValue
            };
          })
        )
        : (
          [...items.keys()].map((itemKey) => {
            const itemValue = items.get(itemKey);
            return {
              isNew: false,
              itemKey,
              itemType: getItemType(itemValue === null ? 'null' : itemValue),
              itemValue: itemValue === null ? 'null' : itemValue
            };
          })
        )
    );
    if (!this.props.readOnly) {
      // guess desired item type/value based on suggestions
      const ignoreProperties = [...items.keys()];
      const suggestions = getSchemaProperties(this.props.schemas, parentItemPathParts)
        .filter(suggestion => !ignoreProperties.includes(suggestion.name));

      let newItemType = suggestions.length > 0 ? suggestions[0].type : 'string';
      if (newItemType instanceof List) {
        newItemType = newItemType.get(0);
      }

      const newItemValue = newItemType === 'array'
        ? []
        : (newItemType === 'object' ? OrderedMap() : '');

      mappedItems = mappedItems.concat({
        isNew: true,
        itemKey: '',
        itemType: newItemType,
        itemValue: newItemValue
      });
    }
    return (
      <ul className={classNames(!parentItemPathParts.length ? styles.parent : null)}>
        {mappedItems.map(({ isNew, itemKey, itemType, itemValue }) => {
          // console.log('isNew');
          // console.log(isNew);
          // console.log('itemKey');
          // console.log(itemKey);
          // console.log('itemValue');
          // console.log(itemValue);

          const itemPathParts = parentItemPathParts.slice(0).concat([itemKey]);
          const itemPath = getItemPath(itemPathParts);
          const itemMode = itemType === 'code' ? itemValue.mode : '';
          const isExpandable = ['array', 'code', 'object'].includes(itemType);
          const isSelected = false;
          const isExpanded = this.props.expandedItems.some(expandedPath => itemPath === expandedPath);

          const isCollapsed = this.state.collapsedPaths.reduce((accum, expandedPath) => {
            if (accum === true || itemPath === getItemPath(expandedPath)) {
              return true;
            }
            return false;
          }, false);

          let isEmpty = true;
          if (
            itemType === 'code'
            ||
            (itemValue instanceof List && itemValue.size > 0)
            ||
            (itemValue instanceof OrderedMap && itemValue.size > 0)
          ) {
            isEmpty = false;
          }

          let iconType = itemMode || 'file';
          if (isExpandable) {
            if (isEmpty) {
              if (isSelected) {
                iconType = 'arrow-dark-orange';
              } else {
                iconType = 'arrow-gray';
              }
            } else if (isSelected) {
              iconType = 'arrow-white';
            } else {
              iconType = 'arrow';
            }
          } else if (isSelected) {
            iconType = `${iconType}-black`;
          }

          return (
            <div key={itemPath}>
              <If condition={this.state.dragFromId !== itemPath && this.state.dragDirection === 'above' && this.state.dragToId === itemPath}>
                <li className={styles.drag} style={{ margin: `0 0 0 ${(level - 1) * 18}px` }} />
              </If>
              <EditorItem
                level={level}
                iconType={iconType}
                item={itemValue}
                itemKey={itemKey}
                itemMode={itemMode}
                itemPathParts={itemPathParts}
                itemType={itemType}
                itemPath={itemPath}
                itemValue={itemValue}
                isCollapsed={isCollapsed}
                isEmpty={isEmpty}
                isExpandable={isExpandable}
                isExpanded={isExpanded}
                isNew={isNew}
                isSelected={isSelected}
                onDragEnd={() => this.handleDragEnd()}
                onDragOver={e => this.handleDragOver(e, itemPath, itemPathParts)}
                onDragStart={e => this.handleDragStart(e, itemPath, itemPathParts)}
                onDrop={e => this.handleDrop(e, itemPath, itemPathParts)}
                onRefFocus={this.handleRefFocus}
                paneIndex={this.props.paneIndex}
                paneType={this.props.paneType}
                parentItem={items}
                parentItemType={parentItemType}
                projectId={this.props.projectId}
                keyRef={(ref) => { this.keyRefs[itemPath] = ref; }}
                modeRef={(ref) => { this.modeRefs[itemPath] = ref; }}
                readOnly={this.props.readOnly}
                schemas={this.props.schemas}
                valueRef={(ref) => { this.valueRefs[itemPath] = ref; }}
              >
                <If condition={(itemType === 'array' || itemType === 'object') && isExpanded}>
                  <If condition={isNew === false}>
                    {this.renderItems(itemValue, itemPathParts, level, itemType)}
                  </If>
                </If>
              </EditorItem>
              <If condition={this.state.dragFromId !== itemPath && this.state.dragDirection === 'below' && this.state.dragToId === itemPath}>
                <li className={styles.drag} style={{ margin: `0 0 0 ${(level - 1) * 18}px` }} />
              </If>
            </div>
          );
        })}
      </ul>
    );
  }
  render() {
    return (
      <Fragment>
        <PathSelector
          allPaths={getAllItemPaths(this.props.allItems, '/', 'object')}
          itemPath={this.props.rootItemPath}
          onRefFocus={this.handleRefFocus}
          paneIndex={this.props.paneIndex}
          type={this.props.paneType}
        />
        <div className={styles.editor}>
          {this.renderItems(this.props.items, this.props.rootItemPathParts)}
        </div>
      </Fragment>
    );
  }
}

Editor.defaultProps = {
  allItems: OrderedMap(),
  items: OrderedMap(),
  leftOffset: 0,
  paneIndex: -1,
  paneType: '',
  projectId: '',
  readOnly: false,
  rootItemPath: '',
  rootItemPathParts: [],
  schemas: OrderedMap(),
  // state props
  expandedItems: [],
  // dispatch props
  generate: () => {},
  hideSelector: () => {},
  moveItem: () => {}
};

Editor.propTypes = {
  allItems: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(OrderedMap)
  ]),
  items: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.instanceOf(OrderedMap)
  ]),
  leftOffset: PropTypes.number,
  paneIndex: PropTypes.number,
  paneType: PropTypes.string,
  projectId: PropTypes.string,
  readOnly: PropTypes.bool,
  rootItemPath: PropTypes.string,
  rootItemPathParts: PropTypes.array,
  schemas: PropTypes.instanceOf(OrderedMap),
  // state props
  expandedItems: PropTypes.array,
  // dispatch props
  generate: PropTypes.func,
  hideSelector: PropTypes.func,
  moveItem: PropTypes.func
};

function mapStateToProps(state, props) {
  const pane = state.pane.items[props.paneIndex];
  return {
    expandedItems: pane.editor.expandedItems,
    projectId: state.project.id
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    hideSelector: () => {
      dispatch(hideSelector());
    },
    generate: () => {
      dispatch(generate());
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
