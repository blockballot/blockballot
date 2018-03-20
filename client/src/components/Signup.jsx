import React from 'react';
import { Link } from 'react-router-dom';
import {TextField, RaisedButton, Dialog, FlatButton, GridList} from 'material-ui';
import $ from 'jquery';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordGen: false,
      dialogOpen: false
    }
    this.onChange = this.onChange.bind(this);
    this.signupClick = this.signupClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChange(e) {
    let target = e.target.name;
    this.setState ({
      [target]: e.target.value
    });
  }

  signupClick() {
    let org = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    this.props.signupSubmit(org);
  }

  handleOpen () {
    $.ajax({
      type: 'GET',
      url: '/signup',
      success: (res) => {
        this.setState({
          dialogOpen: true,
          password: res
        });
      },
      error: () => {
        console.log('Error!')
      }
    })
  };

  handleClose () {
    this.setState({
      dialogOpen: false,
      passwordGen: true
    });
  };

  render() {
    const dialogActions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ]
    const formChange = this.state.passwordGen ? (
    <div>
      <TextField
          hintText="Password"
          errorText=''
          name='password'
          value={this.state.password}
          onChange={this.onChange}
        /> 
        <br />
        <RaisedButton 
        label="Create Account"
        onClick={this.signupClick}
      />
    </div>
    ) : (
      <div>
        <br />
        <RaisedButton 
          label="Generate Password"
          onClick={this.handleOpen}
        />
      </div>
    );

    return (
      <div>
        <TextField
          hintText="Organization Name"
          name='name'
          errorText=''
          value={this.state.name}
          onChange={this.onChange}
        /><br />
        <TextField
          hintText="Email"
          errorText={this.props.signupError}
          name='email'
          value={this.state.email}
          onChange={this.onChange}
        /><br />
        <Dialog
          title="Unique Password"
          actions={dialogActions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          <i class="copy outline icon"></i>
          <div>
            Copy the unique password below to create your account:
          </div>
          <br />
          <div style={{style: 'bold'}}>
            {this.state.password}
          </div>
        </Dialog>
        {formChange}
      </div>
    );
  }
}

export default Signup;