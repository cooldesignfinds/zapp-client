import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import logout from '../../actions/logout';
import redo from '../../actions/redo';
import showSelector from '../../actions/showSelector';
import showModal from '../../actions/showModal';
import toggleFavorite from '../../actions/toggleFavorite';
import undo from '../../actions/undo';

import A from '../../components/a/A';
import Button from '../../components/button/Button';
import IconButton from '../../components/icon-button/IconButton';
import ProjectActions from '../../components/project-actions/ProjectActions';

import { ThemeContext } from '../../contexts/theme';

import WorkspaceForm from '../../forms/workspace/WorkspaceForm';

import styles from './Header.sass';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      openValue: '',
      showError: false
    };
  }
  handleFavoriteClick() {
    if (!this.props.isLoggedIn) {
      window.location.href = `${CONFIG.auth.host}/login`;
    }
    this.props.toggleFavorite();
  }
  handleIconChange() {
    this.props.showModal('changeIcon');
  }
  handleNewConfiguration() {
    this.props.showModal('newConfiguration');
  }
  handleNewVersion() {
    this.props.showModal('newVersion');
  }
  handleOpenValueChange(event) {
    this.setState({
      openValue: event.target.value
    });
    this.toggleOpenMenu(event.target.value);
  }
  handleRefresh() {
    window.location.reload();
  }
  handleWorkspace() {
    this.props.showModal({
      content: (
        <WorkspaceForm />
      )
    });
  }
  toggleConfigMenu(openValue) {
    const value = openValue !== undefined ? openValue : this.state.openValue;
    const lowercaseValue = value.toLowerCase();
    const projectConfigurations = this.props.projectConfigurations
      .filter(projectConfiguration => projectConfiguration.toLowerCase().includes(lowercaseValue));

    const options = [];
    if (this.props.isLoggedIn && this.props.projectAuthor === this.props.username) {
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.handleNewConfiguration(),
        text: 'New Configuration',
        value: 'new-config'
      });
    }
    options.push({
      iconType: 'default-config-gray',
      onSelect: () => {
        window.location.href = `${this.props.projectAuthor}/${this.props.projectName}/${this.props.projectVersion}`;
      },
      text: 'default',
      value: 'default'
    });
    projectConfigurations.forEach((projectConfiguration) => {
      const url = `${this.props.projectAuthor}/${this.props.projectName}/${this.props.projectVersion}/${projectConfiguration}`;
      options.push({
        iconType: 'config-gray',
        onSelect: () => { window.location.href = url; },
        text: projectConfiguration,
        value: projectConfiguration
      });
    });

    this.props.showSelector({
      target: this.configButton,
      title: 'Choose Configuration',
      name: 'version',
      searchPlaceholder: 'Search Configurations...',
      showSearch: true,
      options
    });
  }
  toggleMenu(open) {
    this.setState({
      menuIsOpen: open !== undefined ? open : !this.state.menuIsOpen
    });
  }
  toggleIconMenu() {
    const options = [
      {
        iconType: 'add-gray',
        onSelect: () => this.props.showModal('newGenerator'),
        text: 'New Generator',
        value: 'new-generator'
      },
      {
        iconType: 'open-gray',
        onSelect: () => {
          if (this.props.hasUnsavedChanges) {
            window.open('/');
            return;
          }
          window.location.href = '/';
        },
        text: 'Open Generator',
        value: 'open-generator'
      }
    ];
    if (this.props.projectAuthor === this.props.username) {
      options.push({
        iconType: 'icon-gray',
        onSelect: () => this.handleIconChange(),
        text: 'Change Icon',
        value: 'change-icon'
      });
    }

    this.props.showSelector({
      target: this.iconButton,
      title: 'Main Menu',
      name: 'icon',
      options
    });
  }
  toggleNewMenu() {
    const options = [];
    if (this.props.isLoggedIn && this.props.projectAuthor === this.props.username) {
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.handleNewConfiguration(),
        text: 'New Configuration',
        value: 'new-configuration'
      });
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.handleNewVersion(),
        text: 'New Version',
        value: 'new-version'
      });
    }
    options.push({
      iconType: 'add-gray',
      onSelect: () => this.props.showModal('newGenerator'),
      text: 'New Generator',
      value: 'new-generator'
    });

    this.props.showSelector({
      target: this.newButton,
      name: 'version',
      options
    });
  }
  toggleOpenMenu(openValue) {
    const value = openValue !== undefined ? openValue : this.state.openValue;
    const lowercaseValue = value.toLowerCase();
    const filteredGenerators = this.props.generators
      .filter(generator => generator.name.toLowerCase().includes(lowercaseValue));

    const options = [];
    if (this.props.isLoggedIn) {
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.props.showModal('newGenerator'),
        text: 'New Generator',
        value: 'new-generator'
      });
    }
    options.push({
      iconType: 'open-gray',
      onSelect: () => {
        if (this.props.hasUnsavedChanges) {
          window.open('/');
          return;
        }
        window.location.href = '/';
      },
      text: 'Open Generator',
      value: 'open-generator'
    });
    if (this.props.isLoggedIn) {
      filteredGenerators.forEach((generator) => {
        const generatorUrl = `${this.props.username}/${generator.name}/latest`;
        options.push({
          iconColor: generator.color,
          iconType: generator.icon && generator.icon.length > 0
            ? `//cdn.zappjs.com/icons/${generator.icon}.svg`
            : 'images/icons/logo.png',
          onSelect: () => window.open(generatorUrl),
          text: generator.name,
          value: generator.id
        });
      });
    }

    this.props.showSelector({
      target: this.openButton,
      title: 'Open Generator',
      name: 'open',
      searchPlaceholder: 'Search Generators...',
      showSearch: this.props.isLoggedIn,
      options
    });
  }
  toggleUserMenu() {
    const { themeName, toggleTheme } = this.props.themeContext;

    this.props.showSelector({
      target: this.userButton,
      name: 'open',
      options: [
        {
          iconType: 'workspace-gray',
          onSelect: () => this.handleWorkspace(),
          text: 'Change Workspace',
          value: 'workspace'
        },
        {
          iconType: 'theme-gray',
          onSelect: () => toggleTheme(),
          text: `Switch to ${themeName === 'light' ? 'Dark' : 'Light'} Theme`,
          value: 'theme'
        },
        {
          iconType: 'home-gray',
          onSelect: () => { window.open(CONFIG.web.host); },
          text: 'ZappJS Home',
          value: 'home'
        },
        {
          iconType: 'logout-gray',
          onSelect: () => this.props.logout(),
          text: 'Logout',
          value: 'logout'
        }
      ]
    });
  }
  toggleVersionMenu(openValue) {
    const value = openValue !== undefined ? openValue : this.state.openValue;
    const lowercaseValue = value.toLowerCase();
    const filteredVersions = this.props.versions
      .filter(version => version.version.toLowerCase().includes(lowercaseValue));

    const options = [];
    if (this.props.isLoggedIn && this.props.projectAuthor === this.props.username) {
      options.push({
        iconType: 'add-gray',
        onSelect: () => this.handleNewVersion(),
        text: 'New Version',
        value: 'new-version'
      });
    }
    options.push({
      iconType: 'latest-gray',
      onSelect: () => {
        window.location.href = `/${this.props.projectAuthor}/${this.props.projectName}/latest`;
      },
      text: 'latest',
      value: 'latest'
    });
    filteredVersions.forEach((version) => {
      options.push({
        iconType: 'version-gray',
        onSelect: () => {
          window.location.href = `/${this.props.projectAuthor}/${this.props.projectName}/v${version.version}`;
        },
        text: `v${version.version}`,
        value: `v${version.version}`
      });
    });

    this.props.showSelector({
      target: this.versionButton,
      title: 'Choose Version',
      name: 'version',
      searchPlaceholder: 'Search Versions...',
      showSearch: true,
      options
    });
  }
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <header
            className={styles.header}
            style={{
              backgroundColor: theme.headerBackground
            }}
          >
            <h1>
              <ul className={styles.main}>
                <If condition={false}>
                  <li>
                    <IconButton
                      buttonRef={(button) => { this.iconButton = button; }}
                      className={styles.icon}
                      id="icon-button"
                      onClick={() => this.toggleIconMenu()}
                      size={24}
                      style={{
                        backgroundColor: this.props.projectColor
                      }}
                      type={
                        this.props.tutorialMode
                          ? this.props.projectIcon
                          : (
                            this.props.projectIcon.length > 0
                              ? `https://cdn.zappjs.com/icons/${this.props.projectIcon}.svg`
                              : 'images/icons/logo.png'
                          )
                      }
                    />
                  </li>
                </If>
                <If condition={!!this.props.projectName}>
                  <li className={styles.projectName}>
                    <Button
                      id="generator-button"
                      buttonRef={(button) => { this.openButton = button; }}
                      onClick={() => this.toggleOpenMenu()}
                    >
                      {!this.props.projectAuthor || this.props.projectAuthor === this.props.username ? '' : `${this.props.projectAuthor || 'unknown'}/`}
                      {this.props.projectName}
                    </Button>
                  </li>
                  <If condition={false}>
                    <li className={styles.projectVersion}>
                      <Button
                        id="version-button"
                        buttonRef={(button) => { this.versionButton = button; }}
                        onClick={() => this.toggleVersionMenu()}
                      >
                        {this.props.projectVersion}
                      </Button>
                    </li>
                    <li className={styles.projectConfiguration}>
                      <Button
                        id="configuration-button"
                        buttonRef={(button) => { this.configButton = button; }}
                        onClick={() => this.toggleConfigMenu()}
                      >
                        {this.props.projectConfiguration}
                      </Button>
                    </li>
                  </If>
                  <li>
                    <IconButton
                      className={styles.icon}
                      id="refresh-button"
                      onClick={() => this.handleRefresh()}
                      paddingHeight={12}
                      paddingWidth={12}
                      size={12}
                      title="Refresh (CMD+R)"
                      type="refresh-gray"
                    />
                  </li>
                  <If condition={false}>
                    <li>
                      <IconButton
                        className={styles.icon}
                        disabled={this.props.isLoading}
                        id="favorite-button"
                        onClick={() => this.handleFavoriteClick()}
                        paddingHeight={12}
                        paddingWidth={12}
                        size={12}
                        title="Favorite"
                        type={this.props.isFavorite ? 'favorite' : 'favorite-gray'}
                      />
                    </li>
                  </If>
                  <li>
                    <IconButton
                      className={styles.icon}
                      disabled={this.props.history.length <= 1 || this.props.historyIndex === 0}
                      id="undo-button"
                      onClick={() => this.props.undo()}
                      paddingHeight={12}
                      paddingWidth={12}
                      size={12}
                      title="Undo"
                      type="undo-gray"
                    />
                  </li>
                  <li>
                    <IconButton
                      className={styles.icon}
                      disabled={this.props.history.length <= 1 || this.props.historyIndex === this.props.history.length - 1}
                      id="redo-button"
                      onClick={() => this.props.redo()}
                      paddingHeight={12}
                      paddingWidth={12}
                      size={12}
                      title="Redo"
                      type="redo-gray"
                    />
                  </li>
                  <If condition={false}>
                    <li>
                      <IconButton
                        buttonRef={(button) => { this.newButton = button; }}
                        className={styles.icon}
                        id="add-button"
                        onClick={() => this.toggleNewMenu()}
                        paddingHeight={12}
                        paddingWidth={12}
                        size={12}
                        title="New"
                        type="add-gray"
                      />
                    </li>
                  </If>
                </If>
                <If
                  condition={
                    !!this.props.projectName
                    &&
                    (
                      (this.props.projectAuthor && this.props.projectAuthor !== this.props.username)
                      ||
                      this.props.projectVersion !== 'latest'
                    )
                  }
                >
                  <li>
                    <IconButton
                      className={styles.icon}
                      id="read-only-button"
                      onClick={() => { window.location.href = `${CONFIG.auth.host}/login`; }}
                      size={10}
                      title="Read-Only Mode"
                      type="view-gray"
                    />
                  </li>
                </If>
              </ul>
            </h1>
            <nav className={styles.user}>
              <ul>
                <If condition={this.props.isLoggedIn && false}>
                  <li>
                    {this.props.username}
                  </li>
                  <li>
                    <IconButton
                      buttonRef={(button) => { this.userButton = button; }}
                      id="user-button"
                      onClick={() => this.toggleUserMenu()}
                      type={`${this.props.avatarUrl}`}
                    />
                  </li>
                </If>
                <If condition={!this.props.isLoggedIn && false}>
                  <li>
                    <A href={`${CONFIG.auth.host}/register`}>
                      Register
                    </A>
                  </li>
                  <li className={styles.login}>
                    <A href={`${CONFIG.auth.host}/login`}>
                      Login
                    </A>
                  </li>
                </If>
                <ProjectActions />
              </ul>
            </nav>
          </header>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Header.defaultProps = {
  avatarUrl: '',
  generatorId: '',
  generators: [],
  hasUnsavedChanges: false,
  isFavorite: false,
  isLoading: false,
  isLoggedIn: false,
  logout: () => {},
  push: () => {},
  projectAuthor: '',
  projectIcon: '',
  projectName: '',
  projectVersion: '',
  selectedMenuItem: '',
  showModal: () => {},
  showSelector: () => {},
  teamName: '',
  themeContext: {},
  username: '',
  // state props
  history: [],
  historyIndex: 0,
  projectColor: '',
  projectConfiguration: 'default',
  projectConfigurations: [],
  tutorialMode: false,
  versions: [],
  // dispatch props
  redo: () => {},
  toggleFavorite: () => {},
  undo: () => {}
};

Header.propTypes = {
  avatarUrl: PropTypes.string,
  generatorId: PropTypes.string,
  generators: PropTypes.array,
  hasUnsavedChanges: PropTypes.bool,
  isFavorite: PropTypes.bool,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  logout: PropTypes.func,
  projectAuthor: PropTypes.string,
  projectIcon: PropTypes.string,
  projectName: PropTypes.string,
  projectVersion: PropTypes.string,
  push: PropTypes.func,
  selectedMenuItem: PropTypes.string,
  showModal: PropTypes.func,
  showSelector: PropTypes.func,
  teamName: PropTypes.string,
  themeContext: PropTypes.object,
  username: PropTypes.string,
  // state props
  history: PropTypes.array,
  historyIndex: PropTypes.number,
  projectColor: PropTypes.string,
  projectConfiguration: PropTypes.string,
  projectConfigurations: PropTypes.array,
  tutorialMode: PropTypes.bool,
  versions: PropTypes.array,
  // dispatch props
  redo: PropTypes.func,
  toggleFavorite: PropTypes.func,
  undo: PropTypes.func
};

function mapStateToProps(state) {
  return {
    avatarUrl: state.user.avatarUrl,
    generatorId: state.project.id,
    generators: state.userGenerators.generators,
    hasUnsavedChanges: state.project.hasUnsavedChanges,
    history: state.project.history,
    historyIndex: state.project.historyIndex,
    isFavorite: state.project.isFavorite,
    isLoading: state.project.isLoading,
    isLoggedIn: state.user.isLoggedIn,
    projectAuthor: state.project.author && state.project.author.username ? state.project.author.username : '',
    projectColor: state.project.color,
    projectConfiguration: state.project.configuration,
    projectConfigurations: state.project.configurations,
    projectIcon: state.project.icon,
    projectName: state.project.name,
    projectVersion: state.project.version,
    selectMenuItem: state.menu.selectedItem,
    teamName: state.team.name,
    tutorialMode: state.tutorial.show,
    username: state.user.username,
    versions: state.project.versions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (modal) => {
      dispatch(logout(modal));
    },
    push: (opts) => {
      dispatch(push(opts));
    },
    redo: () => {
      dispatch(redo());
    },
    showModal: (modal) => {
      dispatch(showModal(modal));
    },
    showSelector: (opts) => {
      dispatch(showSelector(opts));
    },
    toggleFavorite: () => {
      dispatch(toggleFavorite());
    },
    undo: () => {
      dispatch(undo());
    }
  };
}

const HeaderRef = connect(mapStateToProps, mapDispatchToProps)(Header);

export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {themeContext => <HeaderRef {...props} themeContext={themeContext} ref={ref} />}
  </ThemeContext.Consumer>
));
