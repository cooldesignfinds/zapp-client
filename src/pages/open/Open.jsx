import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import listGenerators from '../../actions/listGenerators';
import listProjects from '../../actions/listProjects';

import Icon from '../../components/icon/Icon';
import LinkButton from '../../components/link-button/LinkButton';
import Loader from '../../components/loader/Loader';

import styles from './Open.sass';

class OpenPage extends Component {
  render() {
    if (this.props.isLoading) {
      return (
        <Loader text="Loading Generators..." />
      );
    }
    const categories = [
      {
        title: 'Favorites',
        generators: this.props.userFavorites.map(generator => ({
          ...generator,
          url: `${generator.author.username}/${generator.name}/latest`
        }))
      },
      {
        title: 'My Generators',
        generators: this.props.myGenerators.map(generator => ({
          ...generator,
          url: `${generator.author.username}/${generator.name}/latest`
        }))
      },
      {
        title: 'Tutorials',
        generators: [
          {
            color: '#4c5dfc',
            iconType: 'tour-white',
            name: 'Take a Tour',
            url: 'tutorials/tour'
          },
          {
            color: '#76cc71',
            iconType: 'hello-world-white',
            name: 'Hello World',
            url: 'tutorials/hello-world'
          },
          {
            color: '#e2de51',
            iconType: 'generator-white',
            name: 'Import Generators',
            url: 'tutorials/import-generators'
          },
          {
            color: '#f44a4a',
            iconType: 'schema-white',
            name: 'Add Schemas',
            url: 'tutorials/add-schemas'
          },
          {
            color: '#d14cfc',
            iconType: 'template-white',
            name: 'Create Templates',
            url: 'tutorials/create-templates'
          },
          {
            color: '#efa143',
            iconType: 'file-white',
            name: 'Configure Files',
            url: 'tutorials/configure-files'
          },
          {
            color: '#000',
            iconType: 'code-white',
            name: 'Browse Code',
            url: 'tutorials/browse-code'
          }
        ]
      },
      {
        title: 'Popular Generators',
        generators: this.props.generators.map(generator => ({
          ...generator,
          url: `${generator.author.username}/${generator.name}/latest`
        }))
      }
    ];
    return (
      <div className={styles.open}>
        <div className={styles.content}>
          <h2>Open Generator</h2>
          {categories.filter(category => category.generators.length > 0).map(category => (
            <div key={category.title}>
              <h3>
                {category.title}
              </h3>
              <h4>
                {category.generators.length} generator{category.generators.length === 1 ? '' : 's'}
              </h4>
              <hr />
              <If condition={category.generators.length === 0}>
                <div className={styles.empty}>
                  <h5>You haven't created any generators.<br />Why not <Link to="new">create one</Link>?</h5>
                </div>
              </If>
              <If condition={category.generators.length > 0}>
                <ul className={styles.generators}>
                  {category.generators.map((generator) => {
                    return (
                      <li className={styles.generator} key={generator.id}>
                        <a
                          href={`${generator.url}`}
                        >
                          <Icon
                            className={styles.icon}
                            size={52}
                            style={{
                              backgroundColor: generator.color || '#000'
                            }}
                            type={
                              generator.iconType
                                ? generator.iconType
                                : (
                                  generator.icon && generator.icon.length > 0
                                    ? `//cdn.zappjs.com/icons/${generator.icon}.svg`
                                    : 'images/icons/logo.png'
                                )
                            }
                          />
                          <span className={styles.name}>
                            {generator.name}
                          </span>
                          <If condition={generator.author}>
                            <span className={styles.author}>
                              {generator.author.username}
                            </span>
                          </If>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </If>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

OpenPage.defaultProps = {
  generators: [],
  isLoading: true,
  isLoggedIn: false,
  listGenerators: () => {},
  listProjects: () => {},
  myGenerators: [],
  userFavorites: []
};

OpenPage.propTypes = {
  generators: PropTypes.array,
  isLoading: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  listGenerators: PropTypes.func,
  listProjects: PropTypes.func,
  myGenerators: PropTypes.array,
  userFavorites: PropTypes.array
};

function mapStateToProps(state) {
  return {
    generators: state.generators.generators,
    isLoggedIn: state.user.isLoggedIn,
    isLoading: !state.userGenerators.isComplete,
    myGenerators: state.userGenerators.generators,
    userFavorites: state.user.favorites
  };
}

function mapDispatchToProps(dispatch) {
  return {
    listGenerators: () => {
      dispatch(listGenerators());
    },
    listProjects: () => {
      dispatch(listProjects());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenPage);
