import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, OrderedMap } from 'immutable';

import generate from '../../actions/generate';
import loadLocalProject from '../../actions/loadLocalProject';
import loadProject from '../../actions/loadProject';
import startTutorial from '../../actions/startTutorial';

import Engines from '../../components/engines/Engines';
import Loader from '../../components/loader/Loader';
import Pane from '../../components/pane/Pane';

import getTutorial from '../../lib/getTutorial';

import configsSchema from '../../schemas/configs';
import enginesSchema from '../../schemas/engines';
import filesSchema from '../../schemas/files';
import importsSchema from '../../schemas/imports';
import schemasSchema from '../../schemas/schemas';
import templatesSchema from '../../schemas/templates';

import styles from './Project.sass';

const schemasMap = {
  configs: configsSchema,
  engines: enginesSchema,
  files: filesSchema,
  imports: importsSchema,
  schemas: schemasSchema,
  templates: templatesSchema
};

class ProjectPage extends Component {
  constructor(props) {
    super(props);

    let projectUrl = '';

    if (this.props.router.routes[1].path === 'local') {
      projectUrl = 'local';
      this.props.loadLocalProject({
        cwd: this.props.router.location.query.cwd
      });
    } else if (this.props.router.routes[1].path === 'tutorials/:tutorialName') {
      projectUrl = 'tutorials';
      const tutorial = getTutorial(this.props.params.tutorialName);
      this.props.loadUntitled(tutorial.items);
      this.props.startTutorial(tutorial);
    } else if (this.props.router.routes[1].path === 'untitled') {
      projectUrl = 'untitled';
      this.props.loadUntitled();
    } else {
      const version = this.props.params.version || 'latest';
      const configuration = this.props.params.configuration || 'default';
      projectUrl = `${this.props.params.user}/${this.props.params.generator}/${version}`;
      this.props.loadProject({
        name: this.props.params.generator,
        user: this.props.params.user,
        version,
        configuration
      }, () => this.handleGenerate());
    }

    this.state = {
      projectUrl
    };
  }
  getRightSection() {
    if (this.state.rightSection) {
      return this.state.rightSection;
    }
    return 'code';
  }
  handleGenerate() {
    this.props.generate();
  }
  toggleAdd(itemPathParts) {
    this.setState({
      addSpecPath: itemPathParts
    });
  }
  toggleLeftSection(leftSection) {
    this.setState({
      leftSection
    });
  }
  toggleRightSection(rightSection) {
    this.setState({
      rightSection
    });
  }
  render() {
    if (this.props.isLoading) {
      return (
        <Loader text="Loading Generator..." />
      );
    }

    const paneWidth = 100 / this.props.panes.length;

    return (
      <div className={styles.project}>
        {this.props.panes.map((pane, paneIndex) => {
          return (
            <Pane
              className={styles.pane}
              currentPath={pane.path || []}
              index={paneIndex}
              items={this.props[pane.type]}
              key={`pane-${paneIndex}`}
              onChangeType={type => this.handleChangeType(type, paneIndex)}
              projectUrl={this.state.projectUrl}
              readOnly={pane.readOnly === true || this.props.projectAuthorId !== this.props.userId}
              schemas={schemasMap[pane.type] || this.props.allSchemas}
              type={pane.type}
              width={paneWidth}
            />
          );
        })}
        <Engines />
      </div>
    );
  }
}

ProjectPage.defaultProps = {
  allSchemas: OrderedMap(),
  configs: OrderedMap(),
  code: OrderedMap(),
  engines: OrderedMap(),
  files: OrderedMap(),
  generators: OrderedMap(),
  imports: OrderedMap(),
  isLoading: false,
  logs: OrderedMap(),
  panes: [],
  params: {},
  projectAuthorId: '',
  router: {},
  schemas: OrderedMap(),
  specs: OrderedMap(),
  templates: OrderedMap(),
  userId: '',
  // dispatch props
  generate: () => {},
  loadLocalProject: () => {},
  loadProject: () => {},
  loadUntitled: () => {},
  startTutorial: () => {}
};

ProjectPage.propTypes = {
  allSchemas: PropTypes.instanceOf(OrderedMap),
  configs: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  code: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  engines: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  files: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  generators: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  imports: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  isLoading: PropTypes.bool,
  logs: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  panes: PropTypes.array,
  params: PropTypes.object,
  projectAuthorId: PropTypes.string,
  router: PropTypes.object,
  schemas: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  specs: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  templates: PropTypes.instanceOf(OrderedMap), // eslint-disable-line react/no-unused-prop-types
  userId: PropTypes.string,
  // dispatch props
  generate: PropTypes.func,
  loadLocalProject: PropTypes.func,
  loadProject: PropTypes.func,
  loadUntitled: PropTypes.func,
  startTutorial: PropTypes.func
};

function mapStateToProps(state) {
  return {
    allSchemas: state.project.allSchemas,
    configs: state.project.configs,
    code: state.project.code,
    engines: state.project.engines,
    files: state.project.files,
    generators: state.project.generators,
    imports: state.project.imports,
    isLoading: state.project.isLoading,
    logs: state.project.logs,
    panes: state.pane.items,
    projectAuthorId: state.project.author && state.project.author.id ? state.project.author.id : '',
    schemas: state.project.schemas,
    specs: state.project.specs,
    templates: state.project.templates,
    userId: state.user.id
  };
}

function mapDispatchToProps(dispatch) {
  return {
    generate: () => {
      dispatch(generate({ ignoreChanges: true }));
    },
    loadLocalProject: (opts) => {
      dispatch(loadLocalProject(opts));
    },
    loadProject: (project, generateFn) => {
      dispatch(loadProject(project, generateFn));
    },
    loadUntitled: (opts = {}) => {
      dispatch({
        ...{
          type: 'LOAD_PROJECT_RES',
          id: 'none',
          name: 'untitled',
          code: opts.code || OrderedMap(),
          configuration: 'default',
          configs: opts.configs || OrderedMap(),
          engines: opts.engines || OrderedMap(),
          meta: opts.meta || OrderedMap(),
          path: 'untitled',
          generators: opts.generators || OrderedMap(),
          imports: opts.imports || OrderedMap(),
          importsData: opts.importsData || List(),
          schemas: opts.schemas || OrderedMap(),
          specs: opts.specs || OrderedMap(),
          templates: opts.templates || OrderedMap(),
          version: 'latest'
        },
        opts
      });
    },
    startTutorial: (opts) => {
      dispatch(startTutorial(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
