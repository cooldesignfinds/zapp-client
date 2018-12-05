import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import getRandomTutorialRecommendation from '../../lib/getRandomTutorialRecommendation';

import Icon from '../icon/Icon';

import styles from './Recommendations.sass';

class Recommendations extends Component {
  render() {
    const items = getRandomTutorialRecommendation(this.props.projectName);
    return (
      <ul
        className={styles.recommendations}
      >
        {items.map(item => (
          <li className={styles.recommendation} key={item.url}>
            <a href={item.url}>
              <Icon
                className={styles.icon}
                size={64}
                style={{
                  backgroundColor: item.color
                }}
                type={item.iconType}
              />
              <span className={styles.name}>
                {item.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

Recommendations.defaultProps = {
  className: '',
  children: '',
  disabled: false,
  items: [],
  onClick: () => {},
  paddingHeight: 0,
  paddingWidth: 0,
  rotated: false,
  size: 24,
  style: {},
  title: '',
  type: '',
  // state props
  projectName: ''
};

Recommendations.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  items: PropTypes.array,
  onClick: PropTypes.func,
  paddingHeight: PropTypes.number,
  paddingWidth: PropTypes.number,
  rotated: PropTypes.bool,
  size: PropTypes.number,
  style: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.string,
  // state props
  projectName: PropTypes.string
};

function mapStateToProps(state) {
  return {
    projectName: state.project.name
  };
}

export default connect(mapStateToProps)(Recommendations);
