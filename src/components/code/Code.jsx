import AceEditor from 'react-ace';
import brace from 'brace';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import 'brace/mode/actionscript';
import 'brace/mode/apache_conf';
import 'brace/mode/applescript';
import 'brace/mode/c_cpp';
import 'brace/mode/clojure';
import 'brace/mode/cobol';
import 'brace/mode/coldfusion';
import 'brace/mode/csharp';
import 'brace/mode/css';
import 'brace/mode/d';
import 'brace/mode/dart';
import 'brace/mode/diff';
import 'brace/mode/django';
import 'brace/mode/dockerfile';
import 'brace/mode/ejs';
import 'brace/mode/elixir';
import 'brace/mode/erlang';
import 'brace/mode/fortran';
import 'brace/mode/gcode';
import 'brace/mode/gitignore';
import 'brace/mode/golang';
import 'brace/mode/groovy';
import 'brace/mode/haml';
import 'brace/mode/handlebars';
import 'brace/mode/haskell';
import 'brace/mode/html';
import 'brace/mode/ini';
import 'brace/mode/jade';
import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/jsx';
import 'brace/mode/julia';
import 'brace/mode/kotlin';
import 'brace/mode/less';
import 'brace/mode/lisp';
import 'brace/mode/lua';
import 'brace/mode/makefile';
import 'brace/mode/markdown';
import 'brace/mode/matlab';
import 'brace/mode/mysql';
import 'brace/mode/objectivec';
import 'brace/mode/pascal';
import 'brace/mode/perl';
import 'brace/mode/php';
import 'brace/mode/protobuf';
import 'brace/mode/python';
import 'brace/mode/r';
import 'brace/mode/razor';
import 'brace/mode/ruby';
import 'brace/mode/rust';
import 'brace/mode/sass';
import 'brace/mode/scala';
import 'brace/mode/scss';
import 'brace/mode/soy_template';
import 'brace/mode/sql';
import 'brace/mode/sqlserver';
import 'brace/mode/svg';
import 'brace/mode/swift';
import 'brace/mode/text';
import 'brace/mode/typescript';
import 'brace/mode/vbscript';
import 'brace/mode/xml';
import 'brace/mode/yaml';

import 'brace/theme/tomorrow_night_eighties';

import updateItem from '../../actions/updateItem';

import styles from './Code.sass';

class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeValue: '',
      isChanging: false
    };
  }
  handleBlur() {
    if (this.props.readOnly) {
      return;
    }
    this.props.updateItem({
      itemPathParts: this.props.itemPathParts,
      itemValue: this.state.changeValue
    });
    this.setState({
      isChanging: false
    });
  }
  handleChange(value) {
    this.setState({
      changeValue: value
    });
  }
  handleFocus() {
    this.setState({
      isChanging: true,
      changeValue: this.props.value || ''
    });
  }
  render() {
    const value = this.state.isChanging
      ? this.state.changeValue
      : (this.props.value || '');
    return (
      <AceEditor
        defaultValue={this.props.defaultValue || ''}
        editorProps={{ $blockScrolling: true }}
        height={
          this.props.height === 'auto'
            ? `${
              12 + (
                12 * (value.match(/\n/g) || []).length
              )
            }px`
            : this.props.height
        }
        mode={this.props.mode || 'text'}
        name={this.props.id}
        onBlur={() => this.handleBlur()}
        onChange={changeValue => this.handleChange(changeValue)}
        onFocus={() => this.handleFocus()}
        readOnly={this.props.readOnly}
        style={{
          fontFamily: 'Inconsolata'
        }}
        tabSize={2}
        theme="tomorrow_night_eighties"
        useSoftTabs={false}
        value={value}
        width={this.props.width}
      />
    );
  }
}

Code.defaultProps = {
  defaultValue: '',
  height: '100%',
  id: '',
  itemPathParts: [],
  mode: 'text',
  paneIndex: -1,
  paneType: '',
  readOnly: true,
  value: '',
  width: '100%',
  // dispatch props
  updateItem: () => {}
};

Code.propTypes = {
  defaultValue: PropTypes.string,
  height: PropTypes.string,
  id: PropTypes.string,
  itemPathParts: PropTypes.array,
  mode: PropTypes.string,
  paneIndex: PropTypes.number,
  paneType: PropTypes.string,
  readOnly: PropTypes.bool,
  value: PropTypes.string,
  width: PropTypes.string,
  // dispatch props
  updateItem: PropTypes.func
};

function mapDispatchToProps(dispatch, props) {
  return {
    updateItem: (opts) => {
      dispatch(updateItem({
        paneIndex: props.paneIndex,
        paneType: props.paneType,
        ...opts
      }));
    }
  };
}

export default connect(null, mapDispatchToProps)(Code);
