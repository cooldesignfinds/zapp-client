import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import hideSelector from '../../actions/hideSelector';

import Button from '../../components/button/Button';
import Icon from '../../components/icon/Icon';

import getShortcutKey from '../../lib/getShortcutKey';

import styles from './Selector.sass';

class Selector extends Component {
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      isSearching: false,
      searchOptions: [],
      searchValue: '',
      selectedIndex: -1
    };
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  }
  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  handleClickOutside(event) {
    event.stopPropagation();
    if (
      !this.wrapperRef
      ||
      (!this.wrapperRef.contains(event.target) && !this.props.target.contains(event.target))
      ||
      (this.wrapperRef.contains(event.target) && event.target.tagName !== 'INPUT')
    ) {
      this.props.hideSelector();
    }
  }
  handleKeyDown(event) {
    const shortcuts = {
      down: () => {
        const options = this.props.options.filter((option) => {
          if (this.state.searchValue.length > 0 && !(new RegExp(this.state.searchValue, 'i').test(option.text))) {
            return false;
          }
          return true;
        });
        this.setState({
          selectedIndex: this.state.selectedIndex >= options.length - 1
            ? -1
            : this.state.selectedIndex + 1
        });
        if (!this.selectedRef) {
          return;
        }
        this.selectedRef.scrollIntoView({
          block: 'center'
        });
      },
      enter: () => {
        return this.handleSelection();
      },
      esc: () => {
        this.props.hideSelector();
      },
      tab: () => {
        return this.handleSelection();
      },
      up: () => {
        const options = this.props.options.filter((option) => {
          if (this.state.searchValue.length > 0 && !(new RegExp(this.state.searchValue, 'i').test(option.text))) {
            return false;
          }
          return true;
        });
        this.setState({
          selectedIndex: this.state.selectedIndex <= -1
            ? options.length - 1
            : this.state.selectedIndex - 1
        });
        if (!this.selectedRef) {
          return;
        }
        this.selectedRef.scrollIntoView({
          block: 'center'
        });
      }
    };

    const shortcutKey = getShortcutKey(event.keyCode);
    const shortcut = shortcuts[shortcutKey];

    if (shortcut) {
      const shortcurtResult = shortcut();
      if (shortcurtResult !== true) {
        event.preventDefault();
      }
    }
  }
  handleMouseOver(index) {
    this.setState({
      selectedIndex: index
    });
  }
  handleResize() {
    this.setState({});
  }
  handleSearchValueChange(event) {
    const newSearchValue = event.target.value;

    const options = this.props.options.filter((option) => {
      if (newSearchValue.length > 0 && !(new RegExp(newSearchValue, 'i').test(option.text))) {
        return false;
      }
      return true;
    });

    this.setState({
      isSearching: true,
      selectedIndex: -1,
      searchOptions: options,
      searchValue: newSearchValue
    });

    setTimeout(() => {
      this.handleResize();
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }
  handleSelection() {
    if (this.state.selectedIndex === -1) {
      return true;
    }

    const options = this.props.options.filter((option) => {
      if (this.state.searchValue.length > 0 && !(new RegExp(this.state.searchValue, 'i').test(option.text))) {
        return false;
      }
      return true;
    });

    const option = options[this.state.selectedIndex];

    options[this.state.selectedIndex].onSelect();
    this.props.hideSelector();

    return false;
  }
  render() {
    const componentBounds = this.wrapperRef ? this.wrapperRef.getBoundingClientRect() : {};
    const targetBounds = this.props.target.getBoundingClientRect();

    let width = 0;
    if (this.props.width === 'auto') {
      width = targetBounds.width < 200 ? 200 : targetBounds.width;
    } else {
      width = this.props.width;
    }

    let left = 0;
    if (this.props.left === 'auto') {
      left = targetBounds.left + ((targetBounds.width - width) / 2);
      if (left < 0) {
        left = 0;
      } else if (left + 200 > document.body.scrollWidth) {
        left = document.body.scrollWidth - 200;
      }
    } else {
      left = this.props.left;
    }

    let isAbove = false;
    let top = 0;
    if (this.props.top === 'auto') {
      top = targetBounds.top + targetBounds.height;
      if (top + componentBounds.height > document.body.scrollHeight * 0.75) {
        isAbove = true;
        top = targetBounds.top - componentBounds.height;
      }
    } else {
      top = this.props.top;
    }

    const caretTop = isAbove ? targetBounds.top - 5 : top;
    const selectorTop = isAbove ? top - 5 : top + 5;

    const options = this.state.isSearching
      ? this.state.searchOptions
      : this.props.options;

    return (
      <Fragment>
        <div
          className={styles.selector}
          id="selector"
          ref={node => this.setWrapperRef(node)}
          style={{
            left,
            top: selectorTop,
            width
          }}
        >
          <If condition={this.props.title}>
            <h6>
              {this.props.title}
            </h6>
          </If>
          <ul>
            <If condition={this.props.showSearch}>
              <li>
                <form>
                  <Icon
                    className={styles.selectorIcon}
                    size={16}
                    type="search-gray"
                  />
                  <input
                    autoFocus
                    spellCheck="false"
                    onChange={event => this.handleSearchValueChange(event)}
                    placeholder={this.props.searchPlaceholder}
                    type="text"
                    value={this.state.searchValue}
                  />
                </form>
              </li>
            </If>
            {options.map((option, index) => (
              <li
                className={classNames(this.state.selectedIndex === index ? styles.selected : null)}
                key={option.value}
                onMouseOver={() => this.handleMouseOver(index)}
                ref={(ref) => {
                  if (this.state.selectedIndex === index) {
                    this.selectedRef = ref;
                  }
                }}
              >
                <Button
                  id={option.id}
                  onMouseDown={(event) => {
                    option.onSelect(event);
                  }}
                >
                  <If condition={option.icon}>
                    {option.icon}
                  </If>
                  <If condition={!option.icon}>
                    <Icon
                      className={styles.selectorIcon}
                      size={option.iconSize || 16}
                      style={{
                        backgroundColor: option.iconColor ? option.iconColor : null
                      }}
                      title={option.text}
                      type={
                        this.state.selectedIndex === index
                          ? option.iconType.replace(/-gray$/, '-white')
                          : option.iconType
                      }
                    />
                  </If>
                  <span className={styles.selectorText}>
                    <If condition={option.text}>
                      <span dangerouslySetInnerHTML={{ __html: option.text }} />
                    </If>
                    <If condition={option.subtext}>
                      <em>
                        {option.subtext}
                      </em>
                    </If>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={
            classNames(
              styles.caret,
              isAbove ? styles.above : null
            )
          }
          style={{
            left: targetBounds.left + ((targetBounds.width - 10) / 2),
            top: caretTop
          }}
        />
      </Fragment>
    );
  }
}

Selector.defaultProps = {
  // state props
  left: 'auto',
  options: [],
  searchPlaceholder: 'Search Items...',
  showSearch: false,
  target: document.createElement('div'),
  top: 'auto',
  title: '',
  width: 'auto',
  // dispatch props
  hideSelector: () => {}
};

Selector.propTypes = {
  // state props
  left: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  options: PropTypes.array,
  searchPlaceholder: PropTypes.string,
  showSearch: PropTypes.bool,
  target: PropTypes.object,
  title: PropTypes.string,
  top: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  // dispatch props
  hideSelector: PropTypes.func
};

function mapStateToProps(state) {
  return {
    left: state.selector.left,
    options: state.selector.options,
    searchPlaceholder: state.selector.searchPlaceholder,
    showSearch: state.selector.showSearch,
    target: state.selector.target,
    title: state.selector.title,
    top: state.selector.top,
    width: state.selector.width
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideSelector: () => {
      dispatch(hideSelector());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Selector);
