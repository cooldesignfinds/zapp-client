import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './LinkButton.sass';

class LinkButton extends Component {
  render() {
    const isExternalLink = /^(https?:)?\/\//.test(this.props.to);
    if (isExternalLink) {
      return (
        <a
          className={classNames(styles.linkButton, this.props.className)}
          href={this.props.to}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </a>
      );
    }
    return (
      <Link
        className={classNames(styles.linkButton, this.props.className)}
        onClick={this.props.onClick}
        to={this.props.to}
      >
        {this.props.children}
      </Link>
    );
  }
}

LinkButton.defaultProps = {
  children: '',
  className: '',
  onClick: () => {},
  to: '/'
};

LinkButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string
};

export default LinkButton;
