import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import hideSelector from '../../actions/hideSelector';
import showSelector from '../../actions/showSelector';

import Label from '../label/Label';

import styles from './SelectField.sass';

class SelectField extends Component {
  toggleSelector(event) {
    const bounds = event.target.getBoundingClientRect();
    this.props.showSelector({
      target: event.target,
      name: this.props.name,
      options: this.props.options.map(option => ({
        icon: option.icon,
        onSelect: () => this.props.onChange(option.value),
        text: option.text,
        value: option.value
      })),
      left: bounds.left - 10,
      showSearch: true,
      top: bounds.top + bounds.height + 5,
      value: this.props.value
    });
  }
  render() {
    return (
      <div className={styles.field}>
        {this.props.label && (
          <Label htmlFor={this.props.name}>
            {this.props.label}
          </Label>
        )}
        <button
          className={classNames(styles.value, this.props.className)}
          onClick={e => this.toggleSelector(e)}
          tabIndex={-1}
          title={this.props.title}
          type="button"
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

SelectField.defaultProps = {
  autoFocus: false,
  className: '',
  hideSelector: () => {},
  label: '',
  name: '',
  onChange: () => {},
  options: [],
  placeholder: '',
  selectorName: '',
  showSelector: () => {},
  text: '',
  title: '',
  type: '',
  value: ''
};

SelectField.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  hideSelector: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  selectorName: PropTypes.string,
  showSelector: PropTypes.func,
  text: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string
};

function mapStateToProps(state) {
  return {
    selectorName: state.selector.name
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideSelector: () => {
      dispatch(hideSelector());
    },
    showSelector: (selector) => {
      dispatch(showSelector(selector));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectField);
