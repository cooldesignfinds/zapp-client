import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import closePane from '../../actions/closePane';
import setPaneType from '../../actions/setPaneType';
import showSelector from '../../actions/showSelector';
import splitPane from '../../actions/splitPane';
import togglePaneTree from '../../actions/togglePaneTree';

import Button from '../../components/button/Button';
import Icon from '../../components/icon/Icon';
import IconButton from '../../components/icon-button/IconButton';

import { ThemeContext } from '../../contexts/theme';

import formatPaneName from '../../lib/formatPaneName';

import styles from './Toolbar.sass';

class Toolbar extends Component {
  handleClosePane() {
    this.props.closePane();
  }
  handleSelection(type) {
    this.props.setPaneType(this.props.paneIndex, type);
  }
  handleSelector(event) {
    const options = [
      {
        id: `pane-${this.props.paneIndex}_pane-selector_specs`,
        iconType: 'spec-gray',
        onSelect: () => this.handleSelection('specs'),
        text: 'Specs',
        value: 'specs'
      },
      {
        id: `pane-${this.props.paneIndex}_pane-selector_code`,
        iconType: 'code-gray',
        onSelect: () => this.handleSelection('code'),
        text: 'Code',
        value: 'code'
      },
      {
        id: `pane-${this.props.paneIndex}_pane-selector_schemas`,
        iconType: 'schema-gray',
        onSelect: () => this.handleSelection('schemas'),
        text: 'Schemas',
        value: 'schemas'
      },
      {
        id: `pane-${this.props.paneIndex}_pane-selector_templates`,
        iconType: 'template-gray',
        onSelect: () => this.handleSelection('templates'),
        text: 'Templates',
        value: 'templates'
      },
      {
        id: `pane-${this.props.paneIndex}_pane-selector_files`,
        iconType: 'file-gray',
        onSelect: () => this.handleSelection('files'),
        text: 'Files',
        value: 'files'
      },
      {
        id: `pane-${this.props.paneIndex}_pane-selector_engines`,
        iconType: 'engine-gray',
        onSelect: () => this.handleSelection('engines'),
        text: 'Engines',
        value: 'engines'
      },
      {
        id: `pane-${this.props.paneIndex}_pane-selector_imports`,
        iconType: 'import-gray',
        onSelect: () => this.handleSelection('imports'),
        text: 'Imports',
        value: 'imports'
      }
    ];

    this.props.showSelector({
      target: event.target,
      title: 'Choose Pane',
      name: 'pane',
      searchPlaceholder: 'Search Panes...',
      showSearch: true,
      options
    });
  }
  handleSidebar() {
    this.props.togglePaneTree();
  }
  handleSplitPane() {
    this.props.splitPane();
  }
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div
            className={styles.toolbar}
            style={{
              borderBottomColor: theme.borderColor
            }}
          >
            <Button
              className={styles.tool}
              id={`pane-${this.props.paneIndex}_pane-selector`}
              onClick={event => this.handleSelector(event)}
              title={`Pane Selector (${formatPaneName(this.props.paneType, true)})`}
            >
              <Icon
                size={8}
                type={`${formatPaneName(this.props.paneType).toLowerCase()}-gray`}
              />
              <span className={styles.name}>
                {formatPaneName(this.props.paneType, true)}
              </span>
            </Button>
            <div className={styles.actions}>
              <IconButton
                className={styles.action}
                id={`pane-${this.props.paneIndex}_toggle-sidebar-button`}
                onClick={() => this.handleSidebar()}
                paddingHeight={16}
                paddingWidth={10}
                size={8}
                title="Toggle Sidebar"
                type="sidebar-gray"
              />
              <IconButton
                className={classNames(styles.action, styles.desktopOnly)}
                id={`pane-${this.props.paneIndex}_split-pane-button`}
                onClick={() => this.handleSplitPane()}
                paddingHeight={16}
                paddingWidth={10}
                size={8}
                title="Split Pane"
                type="add-gray"
              />
              <If condition={this.props.paneCount > 1}>
                <IconButton
                  className={classNames(styles.action, styles.desktopOnly)}
                  id={`pane-${this.props.paneIndex}_close-pane-button`}
                  onClick={() => this.handleClosePane()}
                  paddingHeight={16}
                  paddingWidth={10}
                  size={8}
                  title="Close Pane"
                  type="close-gray"
                />
              </If>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Toolbar.defaultProps = {
  paneCount: 0,
  paneIndex: -1,
  paneType: '',
  // dispatch
  closePane: () => {},
  setPaneType: () => {},
  showSelector: () => {},
  splitPane: () => {},
  togglePaneTree: () => {}
};

Toolbar.propTypes = {
  paneCount: PropTypes.number,
  paneIndex: PropTypes.number,
  paneType: PropTypes.string,
  // dispatch
  closePane: PropTypes.func,
  setPaneType: PropTypes.func,
  showSelector: PropTypes.func,
  splitPane: PropTypes.func,
  togglePaneTree: PropTypes.func
};

function mapDispatchToProps(dispatch, props) {
  return {
    closePane: () => {
      dispatch(closePane({ paneIndex: props.paneIndex }));
    },
    setPaneType: (paneIndex, paneType) => {
      dispatch(setPaneType(paneIndex, paneType));
    },
    showSelector: (opts) => {
      dispatch(showSelector(opts));
    },
    splitPane: () => {
      dispatch(splitPane({ paneIndex: props.paneIndex }));
    },
    togglePaneTree: () => {
      dispatch(togglePaneTree({ paneIndex: props.paneIndex }));
    }
  };
}

export default connect(null, mapDispatchToProps)(Toolbar);
