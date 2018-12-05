import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { OrderedMap } from 'immutable';

import deleteItem from '../../actions/deleteItem';
import generate from '../../actions/generate';
import loadImports from '../../actions/loadImports';
import showSelector from '../../actions/showSelector';
import updateItem from '../../actions/updateItem';

import IconButton from '../../components/icon-button/IconButton';
import ProjectActions from '../../components/project-actions/ProjectActions';

import { ThemeContext } from '../../contexts/theme';

import styles from './Imports.sass';

class Imports extends Component {
  constructor(props) {
    super(props);
    this.iframes = {};
    this.state = {
      searchValue: ''
    };
  }
  getAllGenerators() {
    const userGenerators = this.props.userGenerators
      .filter((userGenerator) => {
        return !this.props.generators.find(generator => generator.id === userGenerator.id);
      });
    const allGenerators = this.props.generators
      .concat(userGenerators)
      .filter(generator => generator.id !== this.props.projectId || this.props.projectConfiguration !== 'default')
      .sort((a, b) => {
        const aName = `${a.author.username}/${a.name}`;
        const bName = `${b.author.username}/${b.name}`;
        if (aName < bName) {
          return -1;
        } else if (aName > bName) {
          return 1;
        }
        return 0;
      });
    return allGenerators;
  }
  handleAddImport(authorUsername, generatorName) {
    this.props.updateImport({
      projectId: this.props.projectId,
      items: this.props.imports,
      itemPathParts: [authorUsername, generatorName],
      itemValue: 'latest',
      generate: this.props.generate
    });
    this.setState({
      searchValue: ''
    });
  }
  handleOpenImport(authorUsername, generatorName) {
    window.open(`${CONFIG.editor.host}/${authorUsername}/${generatorName}`);
  }
  handleSearchValueChange(event) {
    this.setState({
      searchValue: event.target.value
    });
    this.toggleImports(event.target.value);
  }
  handleRemoveImport(authorUsername, generatorName) {
    this.props.deleteImport({
      projectId: this.props.projectId,
      items: this.props.imports,
      itemPathParts: [authorUsername, generatorName],
      generate: this.props.generate
    });
  }
  toggleImports(searchValue) {
    const allGenerators = this.getAllGenerators();

    const value = searchValue !== undefined ? searchValue : this.state.searchValue;
    const lowercaseValue = value.toLowerCase();
    const filteredImports = allGenerators
      .filter(generator => generator.name.toLowerCase().includes(lowercaseValue) && !(/-example$/.test(generator.name)));

    const options = [];
    filteredImports.forEach((generator) => {
      options.push({
        id: `selector_${generator.author.username}_${generator.name}`,
        iconColor: generator.color,
        iconType: generator.icon
          ? `//cdn.zappjs.com/icons/${generator.icon}.svg`
          : 'images/icons/logo.png',
        onSelect: () => this.handleAddImport(generator.author.username, generator.name),
        text: `${generator.author.username}/${generator.name}`,
        value: `${generator.author.username}/${generator.name}`
      });
    });

    this.props.showSelector({
      target: this.addButton,
      title: 'Import Generator',
      name: 'generators',
      searchPlaceholder: 'Search Generators...',
      showSearch: true,
      options
    });
  }
  toggleImportMenu(event, authorUsername, generatorName) {
    const bounds = event.target.getBoundingClientRect();
    this.props.showSelector({
      target: event.target,
      title: `${authorUsername}/${generatorName}`,
      name: 'generator-menu',
      options: [
        {
          iconType: 'window-gray',
          onSelect: () => this.handleOpenImport(authorUsername, generatorName),
          text: 'Open Generator',
          value: 'open-generator'
        },
        {
          iconType: 'delete-gray',
          onSelect: () => this.handleRemoveImport(authorUsername, generatorName),
          text: 'Remove Generator',
          value: 'remove-generator'
        }
      ]
    });
  }
  render() {
    if (this.props.isLoading || !this.props.projectId) {
      return null;
    }

    const allGenerators = this.getAllGenerators();

    const imports = [...this.props.imports.keys()].reduce((accum, authorUsername) => {
      const author = this.props.imports.get(authorUsername);
      const importKeys = [...author.keys()];
      return accum.concat(...importKeys.map((generatorName) => {
        return `${authorUsername}/${generatorName}`;
      }));
    }, []);

    return (
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div
            className={classNames(styles.imports, this.props.terminalIsVisible ? styles.terminal : null)}
            style={{
              backgroundColor: theme.background || '#000',
              borderTopColor: theme.borderColor
            }}
          >
            <nav className={styles.manage}>
              <ul>
                <li>
                  <IconButton
                    buttonRef={(button) => { this.addButton = button; }}
                    disabled={this.props.projectVersion !== 'latest' || (!!this.props.projectAuthorUsername && this.props.projectAuthorUsername !== this.props.username)}
                    id="import-button"
                    onClick={() => this.toggleImports()}
                    paddingHeight={12}
                    paddingWidth={12}
                    size={12}
                    title="Import Generator"
                    type="add-gray"
                  />
                </li>
                <div className={styles.importsContainer} id="imports">
                  {imports.map((importName) => {
                    const importData = allGenerators.find((g) => {
                      return `${g.author.username}/${g.name}` === importName;
                    });
                    if (!importData) {
                      return null;
                    }
                    return (
                      <li key={`${importData.author.username}/${importData.name}`}>
                        <IconButton
                          className={styles.icon}
                          iconStyle={{
                            backgroundColor: importData.color || '#000',
                            borderColor: theme.borderColor
                          }}
                          id={`imports-${importData.name}`}
                          onClick={(event) => {
                            return this.toggleImportMenu(
                              event,
                              importData.author.username,
                              importData.name
                            );
                          }}
                          size={20}
                          title={`${importData.author.username}/${importData.name}`}
                          type={
                            importData.icon
                              ? `https://cdn.zappjs.com/icons/${importData.icon}.svg`
                              : 'images/icons/logo.png'
                          }
                        />
                      </li>
                    );
                  })}
                </div>
                <li>
                  <IconButton
                    className={classNames(
                      styles.refresh,
                      this.props.isRefreshing ? styles.refreshing : null
                    )}
                    id="refresh-button"
                    onClick={() => this.props.loadImports()}
                    paddingHeight={12}
                    paddingWidth={12}
                    size={12}
                    title="Refresh Imports (CMD+SHIFT+R)"
                    type="refresh-gray"
                  />
                </li>
              </ul>
            </nav>
            <nav className={styles.actions}>
              <ul>
                <ProjectActions />
              </ul>
            </nav>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

Imports.defaultProps = {
  deleteImport: () => {},
  generate: () => {},
  generators: [],
  imports: OrderedMap(),
  isLoading: false,
  isRefreshing: false,
  loadImports: () => {},
  projectAuthorUsername: '',
  projectConfiguration: '',
  projectId: '',
  projectVersion: '',
  showSelector: () => {},
  terminalIsVisible: false,
  updateImport: () => {},
  userGenerators: [],
  username: ''
};

Imports.propTypes = {
  deleteImport: PropTypes.func,
  generate: PropTypes.func,
  generators: PropTypes.array,
  imports: PropTypes.instanceOf(OrderedMap),
  isLoading: PropTypes.bool,
  isRefreshing: PropTypes.bool,
  loadImports: PropTypes.func,
  projectAuthorUsername: PropTypes.string,
  projectConfiguration: PropTypes.string,
  projectId: PropTypes.string,
  projectVersion: PropTypes.string,
  showSelector: PropTypes.func,
  terminalIsVisible: PropTypes.bool,
  updateImport: PropTypes.func,
  userGenerators: PropTypes.array,
  username: PropTypes.string
};

function mapStateToProps(state = {}) {
  return {
    generators: state.generators.generators,
    imports: state.project.imports,
    importsData: state.project.importsData,
    isLoading: state.project.isLoading,
    isRefreshing: state.imports.isLoading,
    projectAuthorUsername: state.project.author && state.project.author.username ? state.project.author.username : '',
    projectConfiguration: state.project.configuration,
    projectId: state.project.id,
    projectVersion: state.project.version,
    terminalIsVisible: state.terminal.show,
    userGenerators: state.userGenerators.generators,
    username: state.user.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteImport: (opts) => {
      dispatch(deleteItem({
        paneType: 'imports',
        ...opts
      }));
    },
    loadImports: () => {
      dispatch(loadImports());
    },
    generate: () => {
      dispatch(generate());
    },
    showSelector: (selector) => {
      dispatch(showSelector(selector));
    },
    updateImport: (opts) => {
      dispatch(updateItem({
        paneType: 'imports',
        ...opts
      }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Imports);
