import classNames from 'classnames';
import { List, OrderedMap } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import collapsePaneEditorItem from '../../actions/collapsePaneEditorItem';
import deleteItem from '../../actions/deleteItem';
import expandPaneEditorItem from '../../actions/expandPaneEditorItem';
import generate from '../../actions/generate';
import hideSelector from '../../actions/hideSelector';
import hideShortcuts from '../../actions/hideShortcuts';
import resetNewItemPath from '../../actions/resetNewItemPath';
import selectPaneTreeItem from '../../actions/selectPaneTreeItem';
import showSelector from '../../actions/showSelector';
import showShortcuts from '../../actions/showShortcuts';
import sortItem from '../../actions/sortItem';
import updateItem from '../../actions/updateItem';
import updateNewItemPath from '../../actions/updateNewItemPath';

import Code from '../../components/code/Code';
import IconButton from '../../components/icon-button/IconButton';
import SelectField from '../../components/select-field/SelectField';

import CodeItem from '../../lib/CodeItem';
import formatPaneName from '../../lib/formatPaneName';
import getItemType from '../../lib/getItemType';
import getPath from '../../lib/getPath';
import getShortcutKey from '../../lib/getShortcutKey';
import getSchemaProperties from '../../lib/getSchemaProperties';
import getTypes from '../../lib/getTypes';
import isCodeItem from '../../lib/isCodeItem';
import isLinkItem from '../../lib/isLinkItem';
import toValue from '../../lib/toValue';

import styles from './EditorItem.sass';

class EditorItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChanging: false,
      changeKey: '',
      changeMode: '',
      changeType: '',
      changeValue: '',
      currentField: '',
      hasFocus: false,
      selectorIndex: -1,
      selectorValue: ''
    };
  }
  commitChanges(key, value, type) {
    // console.log('commitChanges');
    // console.log(key);
    // console.log(value);
    // console.log(type);

    const itemKey = this.props.parentItemType === 'array' && this.props.isNew
      ? this.props.parentItem.size
      : key;
    const itemValue = toValue(
      value,
      type || this.props.itemType,
      getItemType(value)
    );

    if (this.props.isNew) {
      this.props.updateItem({
        itemPathParts: this.props.itemPathParts.slice(0, -1).concat(itemKey),
        itemMode: value.mode,
        itemType: type,
        itemValue
      });
    } else {
      this.props.updateItem({
        itemPathParts: this.props.itemPathParts.slice(0, -1).concat(itemKey),
        itemMode: value.mode,
        itemType: type,
        itemValue,
        oldItemPathParts: this.props.itemPathParts
      });
    }

    this.props.expandPaneEditorItem({
      paneIndex: this.props.paneIndex,
      itemPath: getPath(this.props.itemPathParts.slice(0, -1).concat(itemKey))
    });
  }
  handleAdd() {
    setTimeout(() => {
      document.getElementById(`pane-${this.props.paneIndex}_editor-item_${this.props.itemPath}/_key`).focus();
    }, 100);
  }
  handleBlur() {
    this.setState({
      hasFocus: false
    });
  }
  handleChange(event) {
    const fields = {
      key: 'changeKey',
      mode: 'changeMode',
      value: 'changeValue'
    };
    const field = fields[event.target.name];
    this.setState({
      isChanging: true,
      [field]: event.target.value
    });

    const suggestions = this.getSuggestions();

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
  handleDelete() {
    this.props.deleteItem({
      itemPathParts: this.props.itemPathParts
    });
    this.props.generate();

    this.props.hideSelector();
    this.props.hideShortcuts();

    this.setState({
      isChanging: false
    });

    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
  handleDuplicate() {
    const itemKeyRegex = new RegExp(this.props.itemKey, 'i');
    const parentItem = this.props.parentItem;

    const newItemPathParts = this.props.itemPathParts.slice(0, -1);

    if (this.props.parentItemType === 'array') {
      newItemPathParts.push(parentItem.size);
    } else {
      let duplicateIndex = 0;
      parentItem.keySeq().forEach((key) => {
        if (itemKeyRegex.test(key)) {
          duplicateIndex += 1;
        }
      });
      newItemPathParts.push(`${this.props.itemKey}-${duplicateIndex}`);
    }

    this.props.updateItem({
      itemPathParts: newItemPathParts,
      itemValue: this.props.itemValue
    });
  }
  handleExpand() {
    if (this.props.isExpandable) {
      if (this.props.isExpanded) {
        this.props.collapsePaneEditorItem(
          this.props.paneIndex,
          this.props.itemPath
        );
      } else {
        this.props.expandPaneEditorItem({
          paneIndex: this.props.paneIndex,
          itemPath: this.props.itemPath
        });
      }
      return;
    }

    this.handleSelect();
  }
  handleFocus(event) {
    // console.log('handleFocus');
    // console.log(this.props.itemValue);
    // console.log(this.props.schemas);

    const parentItem = this.props.parentItem;
    const suggestions = this.getSuggestions(event.target.name);

    const ignoreProperties = [...parentItem.keys()].filter(key => key !== this.props.itemKey);
    this.handleSuggestions(
      event,
      suggestions,
      ignoreProperties,
      event.target.name === 'key' ? this.props.itemKey : this.props.itemValue,
      event.target.name
    );

    if (this.state.isChanging) {
      this.setState({
        currentField: event.target.name,
        hasFocus: true
      });
    } else {
      this.setState({
        isChanging: true,
        changeKey: this.props.parentItemType === 'array' && this.props.isNew
          ? this.props.parentItem.size : this.props.itemKey,
        changeMode: this.props.itemMode,
        changeType: this.props.itemType,
        changeValue: isLinkItem(this.props.itemValue) ? this.props.itemValue.value : this.props.itemValue,
        currentField: event.target.name,
        hasFocus: true
      });
    }
  }
  handleKeySelection(key, type) {
    this.props.hideSelector();

    if (this.props.isNew) {
      if (type === 'array' || type === 'object') {
        this.setState({
          changeKey: '',
          changeMode: '',
          changeValue: ''
        });
        this.commitChanges(key, type === 'array' ? [] : {}, type);

        const newItemPath = getPath(this.props.itemPathParts.slice(0, -1).concat(key));

        this.props.updateNewItemPath({
          itemPath: newItemPath
        });
        this.props.onRefFocus(`${newItemPath}/`, 'key');
      } else {
        this.setState({
          changeKey: key,
          changeValue: toValue(this.state.changeValue, type, getItemType(this.state.changeValue)),
          changeType: type
        });
        if (type === 'code') {
          this.props.onRefFocus(this.props.itemPath, 'mode');
        } else {
          this.props.onRefFocus(this.props.itemPath, 'value');
        }
      }
    } else {
      this.commitChanges(key, this.state.changeValue, type);
    }
  }
  handleModeSelection(mode, type) {
    this.props.hideSelector();

    const value = new CodeItem({
      mode,
      value: this.state.changeValue.value
    });

    this.commitChanges(this.state.changeKey, value, type);

    this.setState({
      changeKey: '',
      changeMode: '',
      changeValue: '',
      isChanging: false
    });

    if (document.activeElement) {
      document.activeElement.blur();
    }

    this.props.onRefFocus(`${this.props.itemPath}${this.state.changeKey}`, 'value', true);
  }
  handleMore(event) {
    const options = [];
    if (this.props.itemType === 'array' || this.props.itemType === 'object') {
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.handleAdd(),
        text: `Add in ${this.props.itemPath}`,
        value: 'add'
      });
    }
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
      title: 'More Options',
      name: 'more',
      options,
      searchPlaceholder: 'Search Options...',
      showSearch: true
    });
  }
  handleNew(itemPathOverride) {
    this.props.expandPaneEditorItem({
      paneIndex: this.props.paneIndex,
      itemPath: this.props.itemPath
    });

    if (this.props.itemType === 'array') {
      const element = document.getElementById(`pane-${this.props.paneIndex}_editor-item_${itemPathOverride || this.props.itemPath}/_value`);
      if (element) {
        element.focus();
      }
    } else {
      const element = document.getElementById(`pane-${this.props.paneIndex}_editor-item_${itemPathOverride || this.props.itemPath}/_key`);
      if (element) {
        element.focus();
      }
    }

    setTimeout(() => {
      if (this.props.itemType === 'array') {
        const element = document.getElementById(`pane-${this.props.paneIndex}_editor-item_${itemPathOverride || this.props.itemPath}/_value`);
        if (element) {
          element.focus();
        }
      } else {
        const element = document.getElementById(`pane-${this.props.paneIndex}_editor-item_${itemPathOverride || this.props.itemPath}/_key`);
        if (element) {
          element.focus();
        }
      }
    }, 100);
    // this.props.updateNewItemPath({
    //   itemPath: itemPathOverride || this.props.itemPath
    // });
    //
    // const itemPath = itemPathOverride || this.props.itemPath;
    //
    // this.props.onRefFocus(`${itemPath}/`, 'key');
  }
  handleRename() {
    this.props.onRefFocus(this.props.itemPath, 'key');
  }
  handleSelect() {
    this.props.selectPaneTreeItem();
  }
  handleShortcuts(event, shortcutOverrides = {}) {
    const shortcuts = {
      ...{
        down: () => {
          const suggestions = this.getSuggestions();

          const parentItem = this.props.parentItem;
          const ignoreProperties = [...parentItem.keys()].filter(key => key !== this.props.itemKey);

          this.handleSuggestions(
            event,
            suggestions,
            ignoreProperties,
            event.target.value,
            event.target.name,
            'down'
          );
        },
        enter: () => {
          if (!this.props.isNew || event.target.name === 'value') {
            this.setState({
              isChanging: false
            });
          }
          return true;
        },
        esc: () => {
          this.props.resetNewItemPath();
          this.props.hideSelector();

          event.target.blur();

          this.setState({
            isChanging: false
          });
        },
        up: () => {
          const suggestions = this.getSuggestions();

          const parentItem = this.props.parentItem;
          const ignoreProperties = [...parentItem.keys()].filter(key => key !== this.props.itemKey);

          this.handleSuggestions(
            event,
            suggestions,
            ignoreProperties,
            event.target.value,
            event.target.name,
            'up'
          );
        },
        special: {
          left: () => {
            this.props.updateItem({
              itemPathParts: this.props.itemPathParts.slice(0, -2)
                .concat(this.state.changeKey),
              itemValue: this.state.changeValue,
              oldItemPathParts: this.props.itemPathParts
            });

            this.props.hideSelector();
            this.props.hideShortcuts();
          },
          right: () => {
            const parentItemPathParts = this.props.itemPathParts.slice(0, -1);
            const parentItem = this.props.parentItem;
            let lastChildObjectKey;
            parentItem.entrySeq().forEach(([key, value]) => {
              if (getItemType(value) === 'object') {
                lastChildObjectKey = key;
              }
            });

            if (lastChildObjectKey) {
              const newItemPathParts = parentItemPathParts.concat(
                [lastChildObjectKey, this.state.changeKey]
              );
              this.props.updateItem({
                itemPathParts: newItemPathParts,
                itemValue: this.state.changeValue,
                oldItemPathParts: this.props.itemPathParts
              });

              this.props.hideSelector();
              this.props.hideShortcuts();
            }
          },

          delete: () => {
            this.handleDelete();
          },
          d: () => {
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

            this.props.hideSelector();
          },
          equal: () => {
            this.handleNew();
          },

          a: () => {
            this.handleTypeChange('array');
          },
          b: () => {
            this.handleTypeChange('boolean');
          },
          c: () => {
            this.handleTypeChange('code');
          },
          l: () => {
            this.handleTypeChange('null');
          },
          n: () => {
            this.handleTypeChange('number');
          },
          s: () => {
            this.handleTypeChange('string');
          },
          o: () => {
            this.handleTypeChange('object');
          }
        },
        tab: () => {
          if (
            (
              (event.target.name === 'key' && event.shiftKey)
                || (event.target.name === 'key' && this.props.itemType === 'object' && !event.shiftKey)
                || (event.target.name === 'value' && !event.shiftKey)
            )
              && this.props.isNew
              && !this.state.changeKey
              && this.props.parentItemType !== 'array'
          ) {
            this.props.hideSelector();

            this.setState({
              isChanging: false
            });

            return true;
          }

          if (
            (
              (event.target.name === 'key' && this.props.itemType === 'object')
              ||
              event.target.name === 'value'
            )
            &&
            !event.shiftKey
            && (
              // commit changes only if there are changes
              (this.props.parentItemType !== 'array' && this.state.changeKey !== this.props.itemKey)
                || this.state.changeValue !== this.props.itemValue
                || this.state.changeType !== this.props.itemType
            )
          ) {
            this.commitChanges(
              this.state.changeKey,
              this.state.changeValue,
              this.state.changeType
            );

            const newItemPath = getPath(this.props.itemPathParts.slice(0, -1).concat(this.state.changeKey));

            // clear item changes
            if (this.props.isNew) {
              this.setState({
                changeKey: '',
                changeMode: '',
                changeValue: '',
                isChanging: false
              });
            }

            // tabbing from key field
            if (event.target.name === 'key') {
              if (this.props.itemValue.size === 0) {
                setTimeout(() => {
                  document.getElementById(`pane-${this.props.paneIndex}_editor-item_${newItemPath}/_key`).focus();
                }, 100);
                return false;
              }
            // tabbing from value field
            } else {
              const parentItem = this.props.parentItem;
              if (
                this.props.isNew
                  || !parentItem.keySeq().last()
                  || parentItem.keySeq().last() === this.state.changeKey
                  || (
                    this.props.parentItemType === 'array' && parentItem.keySeq().last() + 1 === this.state.changeKey
                  )
              ) {
                setTimeout(() => {
                  if (document.activeElement) {
                    document.activeElement.blur();
                  }
                  if (this.props.parentItemType === 'array') {
                    document.getElementById(`pane-${this.props.paneIndex}_editor-item_${getPath(this.props.itemPathParts.slice(0, -1))}/_value`).focus();
                  } else {
                    document.getElementById(`pane-${this.props.paneIndex}_editor-item_${getPath(this.props.itemPathParts.slice(0, -1))}/_key`).focus();
                  }
                }, 100);
                return false;
              }
            }
          }

          return true;
        }
      },
      ...shortcutOverrides
    };

    if (event.altKey && event.ctrlKey && [17, 18].includes(event.keyCode)) {
      this.props.showShortcuts();
      return;
    }

    const shortcutKey = getShortcutKey(event.keyCode);

    const shortcut = event.altKey && event.ctrlKey
      ? shortcuts.special[shortcutKey]
      : shortcuts[shortcutKey];

    if (shortcut) {
      const shortcurtResult = shortcut();
      if (shortcurtResult !== true) {
        event.preventDefault();
      }
    }
  }
  handleSort() {
    this.props.sortItem({
      itemPathParts: this.props.itemPathParts
    });
  }
  handleSubmit(event) {
    event.preventDefault();

    this.commitChanges(this.state.changeKey, this.state.changeValue, this.state.changeType);

    if (this.props.isNew) {
      this.setState({
        changeKey: '',
        changeMode: '',
        changeValue: ''
      });
    }

    this.props.resetNewItemPath();
    this.props.hideSelector();

    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
  handleSubmitNew(event) {
    event.preventDefault();

    this.commitChanges(this.state.changeKey, this.state.changeValue, this.state.changeType);

    this.props.hideSelector();
    this.props.resetNewItemPath();

    this.setState({
      isChanging: false,
      changeKey: '',
      changeMode: '',
      changeValue: ''
    });
  }
  handleSuggestions(event, properties = [], ignoreProperties = [], newValue = '', field, selectionDirection) {
    // console.log('suggestProperties');
    // console.log('properties', properties);
    // console.log('ignoreProperties', ignoreProperties);
    // console.log('newValue', newValue);
    // console.log('field', field);
    const newSchemas = properties
      .filter((property) => {
        if (field === 'mode') {
          if (
            (newValue.length > 0 && !(new RegExp(newValue, 'i').test(property.name)))
          ) {
            return false;
          }
          return true;
        }

        if (field === 'value') {
          if (
            (this.state.isChanging && property.name !== this.state.changeKey)
              || (!this.state.changeKey && property.name !== this.props.itemKey)
              || (!property.enum && property.type !== 'boolean')
          ) {
            return false;
          }
          return true;
        }

        if (
          (property.name !== Infinity && newValue.length > 0 && !(new RegExp(newValue, 'i').test(property.name)))
          ||
          ignoreProperties.includes(property.name)
        ) {
          return false;
        }
        return true;
      })
      .reduce((accum, property) => {
        if (field !== 'value') {
          return accum.concat(property);
        }
        if (property.type === 'boolean') {
          return [
            {
              name: 'true',
              text: 'true',
              type: property.type
            },
            {
              name: 'false',
              text: 'false',
              type: property.type
            }
          ].filter((enumObj) => {
            if (enumObj.name !== Infinity && newValue.length > 0 && !(new RegExp(newValue, 'i').test(enumObj.name))) {
              return false;
            }
            return true;
          });
        }
        return accum.concat(
          property.enum
            .map(enumText => ({
              name: enumText,
              text: enumText,
              type: property.type
            }))
            .filter((enumObj) => {
              if (enumObj.name !== Infinity && newValue.length > 0 && !(new RegExp(newValue, 'i').test(enumObj.name))) {
                return false;
              }
              return true;
            })
        );
      }, [])
      .sort((a, b) => {
        const fullRegex = new RegExp(`^${newValue}$`, 'i');
        const startRegex = new RegExp(`^${newValue}`, 'i');
        const endRegex = new RegExp(`${newValue}$`, 'i');

        let aRank = 0;
        let bRank = 0;

        // ranking for "a"
        if (a.name === Infinity) {
          aRank = 4;
        } else if (newValue) {
          if (fullRegex.test(a.name)) {
            aRank = 3;
          } else if (startRegex.test(a.name)) {
            aRank = 2;
          } else if (endRegex.test(a.name)) {
            aRank = 1;
          }
        }

        // get ranking for "b"
        if (b.name === Infinity) {
          bRank = 4;
        } else if (newValue) {
          if (fullRegex.test(b.name)) {
            bRank = 3;
          } else if (startRegex.test(b.name)) {
            bRank = 2;
          } else if (endRegex.test(b.name)) {
            bRank = 1;
          }
        }

        // no ranking, sort by name
        if (aRank === 0 && bRank === 0) {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          }
          return 0;
        }

        // sort by ranking
        if (aRank > bRank) {
          return -1;
        } else if (aRank < bRank) {
          return 1;
        }

        return 0;
      })
      .map((property) => {
        const newProperty = { ...property };
        if (newValue.length > 0) {
          newProperty.text = property.name === Infinity
            ? newValue
            : property.name.replace(new RegExp(`(${newValue})`, 'ig'), '<b>$1</b>');
          newProperty.value = property.name === Infinity
            ? newValue
            : property.name;
        } else if (property.name === Infinity) {
          newProperty.text = '*';
          newProperty.value = property.name === Infinity
            ? newValue
            : property.name;
        } else {
          newProperty.text = property.name;
          newProperty.value = property.name;
        }
        return newProperty;
      });

    if (newSchemas.length === 0) {
      this.props.hideSelector();
      return;
    }

    let newSelectorIndex = this.state.selectorIndex;
    if (selectionDirection === 'down') {
      if (newSelectorIndex > newSchemas.length - 2) {
        newSelectorIndex = 0;
      } else {
        newSelectorIndex += 1;
      }
    } else if (selectionDirection === 'up') {
      if (newSelectorIndex === 0) {
        newSelectorIndex = newSchemas.length - 1;
      } else {
        newSelectorIndex -= 1;
      }
    }
    this.setState({
      selectorIndex: newSelectorIndex,
      selectorValue: newSelectorIndex === -1 ? '' : newSchemas[newSelectorIndex].name
    });

    const options = [];
    if (newSchemas.length > 0) {
      newSchemas.forEach((newSchema) => {
        const itemName = newSchema.name === Infinity
          ? (event.target.value || '*')
          : newSchema.name;
        const itemType = newSchema.type instanceof List ? newSchema.type.get(0) : (newSchema.type || '?');
        const description = newSchema.description ? ` - ${newSchema.description}` : '';
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
          id: `selector_${newSchema.value}`,
          onSelect: () => {
            if (field === 'value') {
              return this.handleValueSelection(itemName, itemType, newSchema.mode);
            } else if (field === 'mode') {
              return this.handleModeSelection(itemName, itemType, newSchema.mode);
            }
            return this.handleKeySelection(itemName, itemType, newSchema.mode);
          },
          subtext: description,
          text: newSchema.text,
          value: newSchema.name
        });
      });
    }

    this.props.showSelector({
      target: event.target,
      name: 'tree',
      title: field === 'mode' || field === 'value'
        ? `${getPath(this.props.itemPathParts.slice(0, -1))}/${this.state.isChanging ? this.state.changeKey : this.props.itemKey}${field === 'mode' ? ' mode' : ''}`
        : (this.props.itemPathParts.slice(0, -1).length === 0 ? '/' : `${getPath(this.props.itemPathParts.slice(0, -1))}/`),
      newSchemas,
      options,
      left: event.target.parentNode.getBoundingClientRect().left + ((this.props.level - 1) * 18),
      width: event.target.parentNode.offsetWidth - ((this.props.level - 1) * 18)
    });
  }
  handleTypeChange(newItemType) {
    const newItemValue = toValue(this.props.itemValue, newItemType, this.props.itemType);

    this.props.updateItem({
      itemPathParts: this.props.itemPathParts,
      itemType: newItemType,
      itemValue: newItemValue
    });
  }
  handleValueSelection(value, type) {
    this.props.hideSelector();

    this.commitChanges(this.state.changeKey, value, type);

    this.setState({
      changeKey: '',
      changeMode: '',
      changeValue: '',
      isChanging: false
    });

    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
  getSuggestions(currentField) {
    return (currentField && currentField === 'mode') || this.state.currentField === 'mode'
      ? [
        {
          name: 'actionscript',
          type: 'code'
        },
        {
          name: 'apache_conf',
          type: 'code'
        },
        {
          name: 'applescript',
          type: 'code'
        },
        {
          name: 'c_cpp',
          type: 'code'
        },
        {
          name: 'clojure',
          type: 'code'
        },
        {
          name: 'cobol',
          type: 'code'
        },
        {
          name: 'coldfusion',
          type: 'code'
        },
        {
          name: 'csharp',
          type: 'code'
        },
        {
          name: 'css',
          type: 'code'
        },
        {
          name: 'd',
          type: 'code'
        },
        {
          name: 'dart',
          type: 'code'
        },
        {
          name: 'diff',
          type: 'code'
        },
        {
          name: 'django',
          type: 'code'
        },
        {
          name: 'dockerfile',
          type: 'code'
        },
        {
          name: 'ejs',
          type: 'code'
        },
        {
          name: 'elixir',
          type: 'code'
        },
        {
          name: 'erlang',
          type: 'code'
        },
        {
          name: 'fortran',
          type: 'code'
        },
        {
          name: 'gcode',
          type: 'code'
        },
        {
          name: 'gitignore',
          type: 'code'
        },
        {
          name: 'golang',
          type: 'code'
        },
        {
          name: 'groovy',
          type: 'code'
        },
        {
          name: 'haml',
          type: 'code'
        },
        {
          name: 'handlebars',
          type: 'code'
        },
        {
          name: 'haskell',
          type: 'code'
        },
        {
          name: 'html',
          type: 'code'
        },
        {
          name: 'ini',
          type: 'code'
        },
        {
          name: 'jade',
          type: 'code'
        },
        {
          name: 'java',
          type: 'code'
        },
        {
          name: 'javascript',
          type: 'code'
        },
        {
          name: 'json',
          type: 'code'
        },
        {
          name: 'jsx',
          type: 'code'
        },
        {
          name: 'julia',
          type: 'code'
        },
        {
          name: 'kotlin',
          type: 'code'
        },
        {
          name: 'less',
          type: 'code'
        },
        {
          name: 'lisp',
          type: 'code'
        },
        {
          name: 'lua',
          type: 'code'
        },
        {
          name: 'makefile',
          type: 'code'
        },
        {
          name: 'markdown',
          type: 'code'
        },
        {
          name: 'matlab',
          type: 'code'
        },
        {
          name: 'mysql',
          type: 'code'
        },
        {
          name: 'objectivec',
          type: 'code'
        },
        {
          name: 'pascal',
          type: 'code'
        },
        {
          name: 'perl',
          type: 'code'
        },
        {
          name: 'php',
          type: 'code'
        },
        {
          name: 'protobuf',
          type: 'code'
        },
        {
          name: 'python',
          type: 'code'
        },
        {
          name: 'r',
          type: 'code'
        },
        {
          name: 'razor',
          type: 'code'
        },
        {
          name: 'ruby',
          type: 'code'
        },
        {
          name: 'rust',
          type: 'code'
        },
        {
          name: 'sass',
          type: 'code'
        },
        {
          name: 'scala',
          type: 'code'
        },
        {
          name: 'scss',
          type: 'code'
        },
        {
          name: 'soy_template',
          type: 'code'
        },
        {
          name: 'sql',
          type: 'code'
        },
        {
          name: 'swift',
          type: 'code'
        },
        {
          name: 'text',
          type: 'code'
        },
        {
          name: 'typescript',
          type: 'code'
        },
        {
          name: 'vbscript',
          type: 'code'
        },
        {
          name: 'xml',
          type: 'code'
        },
        {
          name: 'yaml',
          type: 'code'
        }
      ]
      : getSchemaProperties(
        this.props.schemas,
        this.props.showNew
          ? this.props.itemPathParts
          : this.props.itemPathParts.slice(0, -1)
      );
  }
  render() {
    const {
      level,
      isNew,
      itemKey,
      itemMode,
      itemPathParts,
      itemType,
      itemPath,
      itemValue,
      paneType,
      parentItemType
    } = this.props;

    const currentItemType = this.state.isChanging
      ? this.state.changeType
      : itemType;

    let itemValuePrint = '';
    if (currentItemType === 'code') {
      itemValuePrint = isCodeItem(itemValue) ? itemValue.value : '';
    } else if (currentItemType === 'link') {
      itemValuePrint = isLinkItem(itemValue) ? itemValue.value : '';
    } else if (itemValue === null) {
      itemValuePrint = 'null';
    } else {
      itemValuePrint = itemValue.toString();
    }

    const id = `pane-${this.props.paneIndex}_editor-item_${this.props.itemPath}`;
    const keyId = `${id}_key`;
    const modeId = `${id}_mode`;
    const valueId = `${id}_value`;

    return (
      <li
        draggable
        key={itemPath}
        onDragEnd={this.props.onDragEnd}
        onDragOver={this.props.onDragOver}
        onDragStart={this.props.onDragStart}
        onDrop={this.props.onDrop}
      >
        <form
          className={classNames(
            isNew ? styles.newItem : null,
            isNew && this.state.hasFocus ? styles.newItemFocus : null
          )}
          onSubmit={event => this.handleSubmit(event)}
          style={{
            padding: `0 0 0 ${((level - 1) * 18)}px`
          }}
        >
          <Choose>
            <When condition={currentItemType !== 'array' && currentItemType !== 'object'}>
              <SelectField
                className={classNames(styles.type, styles[currentItemType])}
                onChange={newItemType => this.handleTypeChange(newItemType)}
                name={`${itemPath}/type`}
                options={getTypes().map(type => ({
                  icon: (
                    <div className={classNames(styles.type, styles[type.value])}>
                      {(type.value || '').substr(0, 1).toUpperCase()}
                    </div>
                  ),
                  text: type.value,
                  value: type.value
                }))}
                title={currentItemType}
                text={(currentItemType || '').substr(0, 1).toUpperCase()}
                value={currentItemType}
              />
            </When>
            <Otherwise>
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
            </Otherwise>
          </Choose>
          <input
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            disabled={
              parentItemType === 'array' || this.props.readOnly
            }
            id={keyId}
            name="key"
            onBlur={() => this.handleBlur()}
            onChange={event => this.handleChange(event)}
            onFocus={event => this.handleFocus(event)}
            onKeyDown={event => this.handleShortcuts(event)}
            onKeyUp={() => this.props.hideShortcuts()}
            placeholder={isNew ? '<new key>' : '<key>'}
            ref={this.props.keyRef}
            spellCheck="false"
            style={{
              width: ['array', 'object'].includes(currentItemType)
                ? 'calc(100% - 18px - 18px - 18px)'
                : `calc(50% - 9px - 9px - ${level * 9}px)`
            }}
            title={`New key for ${itemPath}`}
            value={
              this.state.isChanging
                ? this.state.changeKey
                : itemKey
            }
          />
          <If condition={!['array', 'code', 'object'].includes(currentItemType)}>
            <input
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={classNames(
                styles.value,
                styles[currentItemType]
              )}
              disabled={
                this.props.readOnly
              }
              id={valueId}
              name="value"
              onBlur={() => this.handleBlur()}
              onChange={event => this.handleChange(event)}
              onFocus={event => this.handleFocus(event)}
              onKeyDown={event => this.handleShortcuts(event)}
              onKeyUp={() => this.props.hideShortcuts()}
              placeholder={isNew ? '<new value>' : '<value>'}
              ref={this.props.valueRef}
              spellCheck="false"
              style={{
                width: `calc(50% - 18px + ${level * 9}px)`
              }}
              title={`New key for ${itemValue}`}
              value={
                this.state.isChanging
                  ? this.state.changeValue
                  : itemValuePrint
              }
            />
          </If>
          <If condition={currentItemType === 'code'}>
            <input
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={classNames(
                styles[currentItemType]
              )}
              disabled={
                parentItemType === 'array' || this.props.readOnly
              }
              id={modeId}
              name="mode"
              onBlur={() => this.handleBlur()}
              onChange={event => this.handleChange(event)}
              onFocus={event => this.handleFocus(event)}
              onKeyDown={event => this.handleShortcuts(event)}
              onKeyUp={() => this.props.hideShortcuts()}
              placeholder={isNew ? '<new mode>' : '<mode>'}
              ref={this.props.modeRef}
              spellCheck="false"
              style={{
                width: `calc(50% - 18px + ${level * 9}px)`
              }}
              title={`New key for ${itemMode}`}
              value={
                this.state.isChanging
                  ? this.state.changeMode
                  : itemMode
              }
            />
          </If>
          <If condition={!isNew && !this.props.readOnly}>
            <If condition={currentItemType === 'array' || currentItemType === 'object'}>
              <IconButton
                onClick={() => this.handleNew()}
                paddingHeight={17}
                paddingWidth={10}
                size={8}
                tabIndex={-1}
                title={`Add ${formatPaneName(paneType)} in ${itemPath}`}
                type="add-gray"
              />
            </If>
            <IconButton
              onClick={event => this.handleMore(event, itemPathParts)}
              paddingHeight={17}
              paddingWidth={10}
              tabIndex={-1}
              size={8}
              title="More Options"
              type="more-gray"
            />
          </If>
          <If condition={currentItemType === 'code'}>
            <div style={{ padding: '0 0 0 18px' }}>
              <Code
                defaultValue={itemValuePrint}
                height="auto"
                id={valueId}
                itemPathParts={this.props.itemPathParts}
                mode={itemMode}
                onKeyDown={event => this.handleShortcuts(event)}
                onKeyUp={() => this.props.hideShortcuts()}
                paneIndex={this.props.paneIndex}
                paneType={this.props.paneType}
                readOnly={false}
                value={itemValuePrint}
              />
            </div>
          </If>
          <button type="submit">
            Save
          </button>
        </form>
        {this.props.children}
      </li>
    );
  }
}

EditorItem.defaultProps = {
  children: '',
  iconType: '',
  isEmpty: false,
  isExpandable: false,
  isExpanded: false,
  isNew: false,
  itemKey: '',
  itemMode: '',
  itemPathParts: [],
  itemType: '',
  itemPath: '',
  itemValue: '',
  keyRef: () => {},
  level: 0,
  modeRef: () => {},
  onDragEnd: () => {},
  onDragOver: () => {},
  onDragStart: () => {},
  onDrop: () => {},
  onRefFocus: () => {},
  paneIndex: -1,
  paneType: '',
  parentItem: OrderedMap(),
  parentItemType: '',
  readOnly: false,
  schemas: OrderedMap(),
  valueRef: () => {},
  // dispatch
  collapsePaneEditorItem: () => {},
  deleteItem: () => {},
  expandPaneEditorItem: () => {},
  generate: () => {},
  hideSelector: () => {},
  hideShortcuts: () => {},
  resetNewItemPath: () => {},
  selectPaneTreeItem: () => {},
  showSelector: () => {},
  showShortcuts: () => {},
  showNew: false,
  sortItem: () => {},
  updateItem: () => {},
  updateNewItemPath: () => {}
};

EditorItem.propTypes = {
  children: PropTypes.any,
  iconType: PropTypes.string,
  isEmpty: PropTypes.bool,
  isExpandable: PropTypes.bool,
  isExpanded: PropTypes.bool,
  isNew: PropTypes.bool,
  itemKey: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  itemMode: PropTypes.string,
  itemPathParts: PropTypes.array,
  itemType: PropTypes.string,
  itemPath: PropTypes.string,
  itemValue: PropTypes.any,
  keyRef: PropTypes.func,
  level: PropTypes.number,
  modeRef: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrop: PropTypes.func,
  onRefFocus: PropTypes.func,
  paneIndex: PropTypes.number,
  paneType: PropTypes.string,
  parentItem: PropTypes.oneOfType([
    PropTypes.instanceOf(List),
    PropTypes.instanceOf(OrderedMap)
  ]),
  parentItemType: PropTypes.string,
  readOnly: PropTypes.bool,
  resetNewItemPath: PropTypes.func,
  schemas: PropTypes.instanceOf(OrderedMap),
  showNew: PropTypes.bool,
  valueRef: PropTypes.func,
  // dispatch
  collapsePaneEditorItem: PropTypes.func,
  deleteItem: PropTypes.func,
  expandPaneEditorItem: PropTypes.func,
  generate: PropTypes.func,
  hideSelector: PropTypes.func,
  hideShortcuts: PropTypes.func,
  selectPaneTreeItem: PropTypes.func,
  showSelector: PropTypes.func,
  showShortcuts: PropTypes.func,
  sortItem: PropTypes.func,
  updateItem: PropTypes.func,
  updateNewItemPath: PropTypes.func
};

function mapDispatchToProps(dispatch, props) {
  return {
    collapsePaneEditorItem: (paneIndex, itemPath) => {
      dispatch(collapsePaneEditorItem(paneIndex, itemPath));
    },
    deleteItem: (opts) => {
      // console.log('deleteItem');
      // console.log({
      //   paneType: props.paneType,
      //   ...opts
      // });
      dispatch(deleteItem({
        paneType: props.paneType,
        ...opts
      }));
    },
    expandPaneEditorItem: (opts) => {
      dispatch(expandPaneEditorItem(opts));
    },
    generate: () => {
      dispatch(generate());
    },
    hideSelector: () => {
      dispatch(hideSelector());
    },
    hideShortcuts: () => {
      dispatch(hideShortcuts());
    },
    resetNewItemPath: (opts) => {
      dispatch(resetNewItemPath({
        paneIndex: props.paneIndex,
        ...opts
      }));
    },
    selectPaneTreeItem: (opts) => {
      dispatch(selectPaneTreeItem({
        itemPathParts: props.itemPathParts,
        itemPath: props.itemPath,
        paneIndex: props.paneIndex,
        ...opts
      }));
    },
    showSelector: (opts) => {
      dispatch(showSelector(opts));
    },
    showShortcuts: () => {
      dispatch(showShortcuts());
    },
    sortItem: (opts) => {
      dispatch(sortItem({
        paneIndex: props.paneIndex,
        paneType: props.paneType,
        ...opts
      }));
    },
    updateItem: (opts) => {
      // console.log('updateItem');
      // console.log({
      //   paneIndex: props.paneIndex,
      //   paneType: props.paneType,
      //   ...opts
      // });
      dispatch(updateItem({
        paneIndex: props.paneIndex,
        paneType: props.paneType,
        ...opts
      }));
    },
    updateNewItemPath: (opts) => {
      dispatch(updateNewItemPath({
        paneIndex: props.paneIndex,
        ...opts
      }));
    }
  };
}

export default connect(null, mapDispatchToProps)(EditorItem);
