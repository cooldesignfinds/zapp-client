import _ from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';

import collapsePaneTreeItem from '../../actions/collapsePaneTreeItem';
import deleteItem from '../../actions/deleteItem';
import expandPaneTreeItem from '../../actions/expandPaneTreeItem';
import generate from '../../actions/generate';
import hideSelector from '../../actions/hideSelector';
import newTreeItem from '../../actions/newTreeItem';
import resetNewTreeItem from '../../actions/resetNewTreeItem';
import selectPaneTreeItem from '../../actions/selectPaneTreeItem';
import showSelector from '../../actions/showSelector';
import sortItem from '../../actions/sortItem';
import updateItem from '../../actions/updateItem';

import IconButton from '../../components/icon-button/IconButton';

import getItemPath from '../../lib/getItemPath';
import getItemUrl from '../../lib/getItemUrl';
import getSchemaProperties from '../../lib/getSchemaProperties';

import styles from './TreeItem.sass';

class TreeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFocus: false,
      isRenaming: false,
      changeKey: ''
    };
  }
  handleBlur(event) {
    if (!event.target.value.length) {
      this.props.resetNewTreeItem();
    }
    this.props.hideSelector();
    this.setState({
      hasFocus: false
    });
  }
  handleDelete() {
    this.props.deleteItem();

    const parentItemPathParts = this.props.itemPathParts.slice(0, -1);
    const parentItemPath = getItemPath(parentItemPathParts);
    this.props.selectPaneTreeItem({
      itemPath: parentItemPath,
      itemPathParts: parentItemPathParts
    });

    this.props.generate();
  }
  handleDuplicate() {
    const itemKeyRegex = new RegExp(this.props.itemKey, 'i');
    const parentItem = this.props.parentItem;

    let duplicateIndex = 0;
    parentItem.keySeq().forEach((key) => {
      if (itemKeyRegex.test(key)) {
        duplicateIndex += 1;
      }
    });

    this.props.updateItem({
      itemPathParts: this.props.itemPathParts.slice(0, -1)
        .concat(`${this.props.itemKey}-${duplicateIndex}`),
      itemValue: this.props.itemValue
    });

    this.props.generate();
  }
  handleExpand() {
    if (this.props.isExpandable) {
      if (this.props.isExpanded) {
        this.props.collapsePaneTreeItem(
          this.props.paneIndex,
          this.props.itemPath
        );
      } else {
        this.props.expandPaneTreeItem({
          paneIndex: this.props.paneIndex,
          itemPath: this.props.itemPath
        });
      }
      return;
    }

    this.handleSelect();
  }
  handleMore(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const options = [];
    if (this.props.itemPath !== '/') {
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.handleNew(),
        text: 'Add New',
        value: 'add'
      });
      options.push({
        iconType: 'delete-gray',
        onSelect: () => this.handleDelete(),
        text: 'Delete',
        value: 'delete'
      });
      options.push({
        iconType: 'duplicate-gray',
        onSelect: () => this.handleDuplicate(),
        text: 'Duplicate',
        value: 'duplicate'
      });
      options.push({
        iconType: 'move-gray',
        onSelect: () => this.handleMove(),
        text: 'Move',
        value: 'move'
      });
      options.push({
        iconType: 'rename-gray',
        onSelect: () => this.handleRename(),
        text: 'Rename',
        value: 'rename'
      });
    }
    options.push({
      iconType: 'sort-gray',
      onSelect: () => this.handleSort(),
      text: 'Sort Keys',
      value: 'sort'
    });
    options.push({
      iconType: 'select-gray',
      onSelect: () => this.handleSelect(),
      text: 'Select',
      value: 'select'
    });

    this.props.showSelector({
      target: event.target,
      data: {
        itemPath: this.props.itemPath,
        paneIndex: this.props.paneIndex
      },
      title: 'More Options',
      name: 'more',
      options,
      searchPlaceholder: 'Search Options...',
      showSearch: true
    });
  }
  handleRename() {
    this.setState({
      isRenaming: true,
      changeKey: this.props.itemKey
    });

    setTimeout(() => {
      if (this.keyRef) {
        this.keyRef.focus();
      }
    }, 100);
  }
  handleRenameChange(event) {
    this.setState({
      changeKey: event.target.value
    });
  }
  handleRenameSubmit(event) {
    event.preventDefault();

    this.props.updateItem({
      itemPathParts: this.props.itemPathParts.slice(0, -1).concat(this.state.changeKey),
      itemValue: this.props.itemValue,
      oldItemPathParts: this.props.itemPathParts
    });

    this.setState({
      isRenaming: false,
      changeKey: ''
    });

    this.props.generate();
  }
  handleNew() {
    const itemPath = this.props.itemPath;
    const spec = _.get(this.props.items, this.props.itemPathParts, {});
    if (!Object.keys(spec).length) {
      this.props.expandPaneTreeItem({
        paneIndex: this.props.paneIndex,
        itemPath
      });
    }

    this.props.newTreeItem(
      this.props.paneIndex,
      itemPath
    );

    setTimeout(() => {
      if (this.newRef) {
        this.newRef.focus();
      }
    }, 100);
  }
  handleNewChange(event) {
    this.setState({
      changeKey: event.target.value
    });

    const suggestions = getSchemaProperties(
      this.props.schemas,
      this.props.showNew
        ? this.props.itemPathParts
        : this.props.itemPathParts.slice(0, -1)
    );

    const parentItem = this.props.parentItem;
    const ignoreProperties = [...parentItem.keys()].filter(key => key !== this.props.itemKey);

    this.handleSuggestions(
      event,
      suggestions,
      ignoreProperties,
      event.target.value,
      event.target.name
    );
  }
  handleNewFocus(event) {
    const itemPathParts = this.props.itemPathParts;
    const item = this.props.items.getIn(itemPathParts);
    const itemChildren = [...item.keys()];
    const schemaProperties = getSchemaProperties(this.props.schemas, itemPathParts);

    this.handleSuggestions(event, schemaProperties, itemChildren);

    this.setState({
      hasFocus: true
    });
  }
  handleNewSelection(selection) {
    const itemKey = selection === Infinity ? this.state.changeKey : selection;
    this.props.updateItem({
      itemPathParts: this.props.itemPathParts.concat([itemKey]),
      itemValue: {}
    });
    this.props.resetNewTreeItem();

    this.setState({
      changeKey: ''
    });

    this.props.generate();
  }
  handleNewSubmit(event) {
    event.preventDefault();

    const newItemPathParts = this.props.itemPathParts.concat([this.state.changeKey]);

    this.props.updateItem({
      itemPathParts: newItemPathParts,
      itemValue: {}
    });
    this.props.resetNewTreeItem();
    this.props.hideSelector();

    this.setState({
      changeKey: ''
    });

    this.props.selectPaneTreeItem({
      itemPath: getItemPath(newItemPathParts),
      itemPathParts: newItemPathParts
    });
  }
  handleSelect() {
    this.props.selectPaneTreeItem();
  }
  handleShortcuts(event) {
    if (event.keyCode === 27) {
      this.props.resetNewTreeItem();
      this.props.hideSelector();
    }
    return true;
  }
  handleSort() {
    this.props.sortItem({
      itemPathParts: this.props.itemPathParts
    });
  }
  handleSuggestions(event, properties = [], ignoreProperties = [], newValue = '') {
    // console.log('handleSuggestions');
    // console.log('properties', properties);
    // console.log('ignoreProperties', ignoreProperties);
    // console.log('newValue', newValue);
    const newSchemas = properties
      .filter((property) => {
        if (
          (property.name !== Infinity && newValue.length > 0 && !(new RegExp(newValue, 'i').test(property.name)))
          ||
          ignoreProperties.includes(property.name)
          ||
          property.type !== 'object'
        ) {
          return false;
        }
        return true;
      })
      .map((property) => {
        const newProperty = { ...property };
        if (newValue.length > 0) {
          newProperty.text = property.name === Infinity
            ? newValue
            : property.name.replace(new RegExp(`(${newValue})`, 'ig'), '<b>$1</b>');
        } else if (property.name === Infinity) {
          newProperty.text = '*';
        } else {
          newProperty.text = property.name;
        }
        return newProperty;
      });

    const options = [];
    if (newSchemas.length > 0) {
      newSchemas.forEach((newSchema) => {
        const itemKey = newSchema.name === Infinity
          ? (event.target.value || '*')
          : newSchema.name;
        const itemType = newSchema.type;
        options.push({
          icon: (
            <span
              className={classNames(styles.type, styles[itemType])}
              style={{ padding: 0 }}
              title={itemType}
            >
              {itemType.substr(0, 1).toUpperCase()}
            </span>
          ),
          iconSize: 8,
          id: `selector_${newSchema.name}`,
          onSelect: () => this.handleNewSelection(itemKey),
          text: itemKey,
          value: newSchema.name
        });
      });
    }

    this.props.showSelector({
      target: event.target,
      name: 'tree',
      newSchemas,
      options
    });
  }
  render() {
    return (
      <li
        className={classNames(this.props.readOnly ? styles.readOnly : null)}
        draggable
        onDragEnd={this.props.onDragEnd}
        onDragOver={this.props.onDragOver}
        onDragStart={this.props.onDragStart}
        onDrop={this.props.onDrop}
      >
        <div
          className={
            classNames(
              styles.item,
              this.props.hasChanges ? styles.changes : null,
              this.props.isExpanded ? styles.expanded : null,
              this.props.isSelected ? styles.selected : null,
              this.props.isSelected && this.props.isFocused ? styles.focused : null
            )
          }
          style={{
            padding: `0 0 0 ${(this.props.level * 18)}px`
          }}
          title={this.props.itemPath}
        >
          <If condition={this.props.iconType}>
            <IconButton
              className={classNames(
                this.props.isEmpty ? styles.empty : null
              )}
              disabled={this.props.isExpandable && this.props.isEmpty}
              onClick={() => this.handleExpand()}
              paddingHeight={17}
              paddingWidth={10}
              rotated={this.props.isExpanded}
              size={8}
              title={
                this.props.isExpandable
                  ? (`${this.props.isExpanded ? 'Collapse' : 'Expand'} ${this.props.itemPath}`)
                  : this.props.itemPath
              }
              type={this.props.iconType}
            />
          </If>
          <If condition={this.state.isRenaming}>
            <form
              className={classNames(
                styles.itemKeyForm,
                (
                  this.props.selectorData.itemPath === this.props.itemPath
                    && this.props.selectorData.paneIndex === this.props.paneIndex
                )
                  ? styles.showActions
                  : null
              )}
              onSubmit={event => this.handleRenameSubmit(event)}
            >
              <input
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className={styles.itemKeyInput}
                ref={(ref) => { this.keyRef = ref; }}
                onChange={event => this.handleRenameChange(event)}
                value={this.state.changeKey}
              />
            </form>
          </If>
          <If condition={!this.state.isRenaming}>
            <Link
              className={classNames(
                styles.itemKey,
                !this.props.iconType ? styles.rootItemKey : null,
                (
                  this.props.selectorData.itemPath === this.props.itemPath
                    && this.props.selectorData.paneIndex === this.props.paneIndex
                )
                  ? styles.showActions
                  : null
              )}
              id={`pane-${this.props.paneIndex}_tree-item_${this.props.itemPath}`}
              onClick={() => this.handleSelect()}
              onContextMenu={event => this.handleMore(event)}
              onDragStart={() => false}
              to={getItemUrl({
                paneIndex: this.props.paneIndex,
                paneType: this.props.paneType,
                itemPath: this.props.itemPath
              })}
            >
              {decodeURIComponent(this.props.itemKey)}
            </Link>
          </If>
          <If condition={!this.props.readOnly}>
            <div
              className={classNames(
                styles.actions,
                (
                  this.props.selectorData.itemPath === this.props.itemPath
                    && this.props.selectorData.paneIndex === this.props.paneIndex
                )
                  ? styles.showActions
                  : null
              )}
            >
              <IconButton
                onClick={() => this.handleNew()}
                paddingHeight={17}
                paddingWidth={10}
                size={8}
                title={`Add ${this.props.paneName} in ${this.props.itemPath}`}
                type={this.props.isSelected ? 'add-black' : 'add-gray'}
              />
              <IconButton
                buttonRef={(ref) => { this.moreButtonRef = ref; }}
                onClick={() => this.handleMore()}
                paddingHeight={17}
                paddingWidth={10}
                size={8}
                title="More Options"
                type={this.props.isSelected ? 'more-black' : 'more-gray'}
              />
            </div>
          </If>
        </div>
        {this.props.children}
        <If condition={!this.props.readOnly}>
          <form
            className={classNames(
              styles.newItem,
              this.state.hasFocus ? styles.newItemFocus : null
            )}
            onSubmit={event => this.handleNewSubmit(event)}
          >
            <input
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={styles.itemKeyInput}
              id={`pane-${this.props.paneIndex}_tree-item_${this.props.itemPath}/`}
              onBlur={event => this.handleBlur(event)}
              onChange={event => this.handleNewChange(event)}
              onFocus={event => this.handleNewFocus(event)}
              onKeyUp={event => this.handleShortcuts(event)}
              ref={(ref) => { this.newRef = ref; }}
              spellCheck="false"
              style={{
                padding: `5px 5px 5px ${((this.props.level + 2) * 18)}px`
              }}
              value={this.state.changeKey}
            />
          </form>
        </If>
      </li>
    );
  }
}

TreeItem.defaultProps = {
  children: '',
  hasChanges: false,
  iconType: '',
  isEmpty: false,
  isExpandable: false,
  isExpanded: false,
  isFocused: false,
  isSelected: false,
  itemKey: '',
  itemPathParts: [],
  itemPath: '',
  itemValue: '',
  items: OrderedMap(),
  level: 0,
  onDragEnd: () => {},
  onDragOver: () => {},
  onDragStart: () => {},
  onDrop: () => {},
  paneIndex: -1,
  paneName: '',
  paneType: '',
  parentItem: OrderedMap(),
  readOnly: false,
  schemas: OrderedMap(),
  selectorData: {},
  showNew: false,

  collapsePaneTreeItem: () => {},
  deleteItem: () => {},
  expandPaneTreeItem: () => {},
  generate: () => {},
  hideSelector: () => {},
  newTreeItem: () => {},
  resetNewTreeItem: () => {},
  selectPaneTreeItem: () => {},
  showSelector: () => {},
  sortItem: () => {},
  updateItem: () => {}
};

TreeItem.propTypes = {
  children: PropTypes.any,
  hasChanges: PropTypes.bool,
  iconType: PropTypes.string,
  isEmpty: PropTypes.bool,
  isExpandable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isFocused: PropTypes.bool,
  isSelected: PropTypes.bool,
  itemKey: PropTypes.string,
  itemPathParts: PropTypes.array,
  itemPath: PropTypes.string,
  itemValue: PropTypes.any,
  items: PropTypes.instanceOf(OrderedMap),
  level: PropTypes.number,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
  paneIndex: PropTypes.number,
  paneName: PropTypes.string,
  paneType: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  parentItem: PropTypes.instanceOf(OrderedMap),
  readOnly: PropTypes.bool,
  schemas: PropTypes.instanceOf(OrderedMap),
  selectorData: PropTypes.object,
  showNew: PropTypes.bool,

  collapsePaneTreeItem: PropTypes.func,
  deleteItem: PropTypes.func,
  expandPaneTreeItem: PropTypes.func,
  generate: PropTypes.func,
  hideSelector: PropTypes.func,
  newTreeItem: PropTypes.func,
  resetNewTreeItem: PropTypes.func,
  selectPaneTreeItem: PropTypes.func,
  showSelector: PropTypes.func,
  sortItem: PropTypes.func,
  updateItem: PropTypes.func
};

function mapDispatchToProps(dispatch, props) {
  return {
    deleteItem: (opts) => {
      dispatch(deleteItem({
        itemPathParts: props.itemPathParts,
        paneType: props.paneType,
        ...opts
      }));
    },
    collapsePaneTreeItem: (paneIndex, itemPath) => {
      dispatch(collapsePaneTreeItem(paneIndex, itemPath));
    },
    expandPaneTreeItem: (opts) => {
      dispatch(expandPaneTreeItem(opts));
    },
    generate: () => {
      dispatch(generate());
    },
    hideSelector: () => {
      dispatch(hideSelector());
    },
    newTreeItem: (paneIndex, itemPath) => {
      dispatch(newTreeItem(paneIndex, itemPath));
    },
    resetNewTreeItem: () => {
      dispatch(resetNewTreeItem(props.paneIndex));
    },
    selectPaneTreeItem: (opts) => {
      dispatch(selectPaneTreeItem({
        itemPathParts: props.itemPathParts,
        itemPath: props.itemPath,
        paneIndex: props.paneIndex,
        ...opts
      }));
    },
    showSelector: (selector) => {
      dispatch(showSelector(selector));
    },
    sortItem: (opts) => {
      dispatch(sortItem({
        paneIndex: props.paneIndex,
        paneType: props.paneType,
        ...opts
      }));
    },
    updateItem: ({ itemPathParts, itemValue, oldItemPathParts }) => {
      dispatch(
        updateItem({
          paneIndex: props.paneIndex,
          paneType: props.paneType,
          itemPathParts,
          itemValue,
          oldItemPathParts
        })
      );
    }
  };
}

export default connect(null, mapDispatchToProps)(TreeItem);
