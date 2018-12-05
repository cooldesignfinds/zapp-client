import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import hideHint from '../../actions/hideHint';

import getQuerySelector from '../../lib/getQuerySelector';

import styles from './Hint.sass';

class Hint extends Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.state = {
      isSearching: false,
      searchOptions: [],
      searchValue: '',
      selectedIndex: -1
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  handleMouseOver(index) {
    this.setState({
      selectedIndex: index
    });
  }
  handleResize() {
    this.setState({});
  }
  render() {
    const targets = this.props.elements
      .map(element => document.querySelector(getQuerySelector(element)))
      .filter(element => element !== null);
    const target = targets[0] || document.body;

    const componentBounds = this.wrapperRef ? this.wrapperRef.getBoundingClientRect() : {};
    const targetBounds = target ? target.getBoundingClientRect() : {};

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
    const hintTop = isAbove ? top - 5 : top + 5;

    return (
      <Fragment>
        <div
          className={styles.hint}
          id="hint"
          ref={node => this.setWrapperRef(node)}
          style={{
            left,
            top: hintTop,
            width
          }}
        >
          <If condition={this.props.title}>
            <h6 className={styles.title}>
              {this.props.title}
            </h6>
          </If>
          <div className={styles.content}>
            {this.props.content}
          </div>
          <div className={styles.footer}>
            <If condition={this.props.message}>
              <div className={styles.message}>
                {this.props.message}
              </div>
            </If>
            <If condition={this.props.buttons.length > 0}>
              <div className={styles.buttons}>
                {this.props.buttons.map((button) => {
                  return (
                    <button
                      className={styles.button}
                      key={button.value}
                      onClick={button.onClick}
                    >
                      {button.text}
                    </button>
                  );
                })}
              </div>
            </If>
          </div>
        </div>
        <If condition={target.id !== 'selector'}>
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
        </If>
      </Fragment>
    );
  }
}

Hint.defaultProps = {
  // state props
  buttons: [],
  content: '',
  elements: [],
  left: 'auto',
  message: '',
  target: document.createElement('div'),
  top: 'auto',
  title: '',
  width: 'auto',
  // dispatch props
  hideHint: () => {}
};

Hint.propTypes = {
  // state props
  buttons: PropTypes.array,
  content: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  elements: PropTypes.array,
  left: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  message: PropTypes.string,
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
  hideHint: PropTypes.func
};

function mapStateToProps(state) {
  return {
    buttons: state.hint.buttons,
    content: state.hint.content,
    elements: state.hint.elements,
    left: state.hint.left,
    message: state.hint.message,
    target: state.hint.target,
    title: state.hint.title,
    top: state.hint.top,
    width: state.hint.width
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideHint: () => {
      dispatch(hideHint());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hint);
