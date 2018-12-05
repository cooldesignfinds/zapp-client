import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import closeTerminal from '../../actions/closeTerminal';
import openTerminal from '../../actions/openTerminal';
import switchTerminal from '../../actions/switchTerminal';

import IconButton from '../icon-button/IconButton';
import Terminal from '../terminal/Terminal';

import styles from './Terminals.sass';

class Terminals extends React.Component {
  handleClose() {
    this.props.closeTerminal({
      itemId: this.props.currentTerminal
    });
  }
  handleNew() {
    this.props.openTerminal();
  }
  handleTab(itemId) {
    this.props.switchTerminal({ itemId });
  }
  render() {
    return (
      <div
        className={classNames(
          styles.terminals,
          this.props.className,
          this.props.show === false
            ? styles.hidden
            : null
        )}
      >
        {this.props.terminals.map((terminal) => {
          return (
            <Terminal
              key={terminal.id}
              show={this.props.currentTerminal === terminal.id}
            />
          );
        })}
        <ul className={styles.tabs}>
          {this.props.terminals.map((terminal, index) => {
            return (
              <li className={styles.tab} key={terminal.id}>
                <button
                  className={classNames(
                    styles.tabButton,
                    this.props.currentTerminal === terminal.id
                      ? styles.selected
                      : null
                  )}
                  onClick={() => this.handleTab(terminal.id)}
                >
                  Terminal {index + 1}
                </button>
              </li>
            );
          })}
          <li className={styles.tab}>
            <IconButton
              onClick={() => this.handleNew()}
              paddingHeight={0}
              paddingWidth={0}
              size={8}
              title="Open Terminal"
              type="add-gray"
            />
          </li>
          <li className={styles.close}>
            <IconButton
              disabled={this.props.terminals.length === 1}
              onClick={() => this.handleClose()}
              paddingHeight={0}
              paddingWidth={10}
              size={8}
              title="Close"
              type="close-gray"
            />
          </li>
        </ul>
      </div>
    );
  }
}

Terminals.defaultProps = {
  className: '',
  // state props
  currentTerminal: '',
  show: false,
  terminals: [],
  // dispatch props
  closeTerminal: () => {},
  openTerminal: () => {},
  switchTerminal: () => {}
};

Terminals.propTypes = {
  className: PropTypes.string,
  // state props
  currentTerminal: PropTypes.string,
  show: PropTypes.bool,
  terminals: PropTypes.array,
  // dispatch props
  closeTerminal: PropTypes.func,
  openTerminal: PropTypes.func,
  switchTerminal: PropTypes.func
};

function mapStateToProps(state) {
  return {
    currentTerminal: state.terminal.currentItem,
    show: state.terminal.show,
    terminals: state.terminal.items
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeTerminal: (opts) => {
      dispatch(closeTerminal(opts));
    },
    openTerminal: (opts) => {
      dispatch(openTerminal(opts));
    },
    switchTerminal: (opts) => {
      dispatch(switchTerminal(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminals);
