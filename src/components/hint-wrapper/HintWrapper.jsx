import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Hint from '../../components/hint/Hint';

class HintWrapper extends Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <Hint />
    );
  }
}

HintWrapper.defaultProps = {
  // state props
  show: false
};

HintWrapper.propTypes = {
  // state props
  show: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    show: state.hint.show
  };
}

export default connect(mapStateToProps)(HintWrapper);
