import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Selector from '../../components/selector/Selector';

class SelectorWrapper extends Component {
  render() {
    if (!this.props.show || !this.props.options.length) {
      return null;
    }

    return (
      <Selector />
    );
  }
}

SelectorWrapper.defaultProps = {
  // state props
  options: [],
  show: false
};

SelectorWrapper.propTypes = {
  // state props
  options: PropTypes.array,
  show: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    options: state.selector.options,
    show: state.selector.show
  };
}

export default connect(mapStateToProps)(SelectorWrapper);
