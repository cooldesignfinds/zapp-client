import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { connect } from 'react-redux';

import Error from '../../components/error/Error';
import Form from '../../components/form/Form';
import Icon from '../../components/icon/Icon';
import SubmitButton from '../../components/submit-button/SubmitButton';
import TextField from '../../components/text-field/TextField';

import changeColor from '../../actions/changeColor';
import updateIcon from '../../actions/updateIcon';

import styles from './ChangeIconForm.sass';

class ChangeIconForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      color: ''
    };
  }
  handleIconClick() {
    this.fileInput.click();
  }
  handleIconChange(e) {
    if (!/\.svg$/i.test(e.target.value)) {
      this.setState({
        showError: true
      });
      return;
    }
    this.props.updateIcon({
      file: e.target.files[0]
    });
  }
  handleInput({ target: { name, value } }) {
    this.setState({
      [name]: value
    });
  }
  handleSubmit() {
    if (this.state.color.length === 0) {
      this.setState({
        error: 'Color is required.'
      });
      return;
    }

    this.props.changeColor({
      color: this.state.color
    });
  }
  render() {
    return (
      <Form className={styles.new} onSubmit={() => this.handleSubmit()}>
        <Error>
          {this.state.error}
        </Error>
        <h2>Change Icon</h2>
        <div className={styles.left}>
          <Icon
            className={styles.icon}
            size={128}
            style={{
              backgroundColor: this.props.projectColor || '#000'
            }}
            type={
              this.props.projectIcon.length > 0
                ? `https://cdn.zappjs.com/icons/${this.props.projectIcon}.svg`
                : 'images/icons/logo.png'
            }
          />
        </div>
        <div className={styles.right}>
          <label>Icon Image</label>
          <button className={styles.uploadButton} onClick={() => this.handleIconClick()} type="button">
            Choose SVG File
          </button>
          <input
            accept=".svg"
            className={styles.file}
            name="icon"
            onChange={event => this.handleIconChange(event)}
            ref={(input) => { this.fileInput = input; }}
            type="file"
          />
          <TextField
            autoFocus
            label="Icon Background Color"
            name="color"
            onChange={e => this.handleInput(e)}
            type="text"
            value={this.state.color || this.props.projectColor}
          />
        </div>
        <SubmitButton disabled={this.props.isLoading} onClick={() => this.handleSubmit()}>
          {this.props.isLoading ? 'Loading...' : 'Save Changes'}
        </SubmitButton>
      </Form>
    );
  }
}

ChangeIconForm.defaultProps = {
  // state props
  error: '',
  isLoading: false,
  projectColor: PropTypes.string,
  projectIcon: '',
  username: '',
  // dispatch props
  changeColor: () => {},
  updateIcon: () => {}
};

ChangeIconForm.propTypes = {
  // state props
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  projectColor: PropTypes.string,
  projectIcon: PropTypes.string,
  username: PropTypes.string,
  // dispatch props
  changeColor: PropTypes.func,
  updateIcon: PropTypes.func
};

function mapStateToProps(state) {
  return {
    error: state.newProject.error,
    isLoading: state.newProject.isLoading,
    projectColor: state.project.color,
    projectIcon: state.project.icon,
    username: state.user.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeColor: (opts) => {
      dispatch(changeColor(opts));
    },
    updateIcon: (opts) => {
      dispatch(updateIcon(opts));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeIconForm);
