import PropTypes from 'prop-types';
import React, { Component } from 'react';

class Group extends Component {
  render() {
    if (this.props.show) {
      if (Array.isArray(this.props.children)) {
        return (
          <div>{this.props.children}</div>
        );
      }
      return this.props.children;
    }
    return null;
  }
}

Group.defaultProps = {
  children: '',
  show: true
};

Group.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  show: PropTypes.bool
};

export default Group;
