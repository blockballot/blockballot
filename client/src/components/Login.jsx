import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {Card, CardText, CardHeader, Grid, TextField, RaisedButton, FlatButton, Dialog} from 'material-ui';
import { Responsive, Button, Form, Header, Image, Message, Segment, Container } from 'semantic-ui-react';
import { BarLoader } from 'react-spinners';
import cookie from 'react-cookie';
import $ from 'jquery';
import CreatePoll from './CreatePoll.jsx';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false,
      dialogEmailSent: false,
      loading: false
    }
    this.onChange = this.onChange.bind(this);
    this.loginClick = this.loginClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
  }
  
  onChange(e) {
    let target = e.target.name;
    this.setState ({
      [target]: e.target.value
    });
  }

  loginClick() {
    let login = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.loginSubmit(login);
  }

  handleOpen () {
    this.setState({
      dialogOpen: true,
    });
  };

  handleClose () {
    this.setState({
      dialogOpen: false,
    });
  };

  handlePasswordReset() {
    this.setState({
      loading: true
    })
    $.ajax({
      type: 'POST',
      url: '/email',
      data: {email: this.state.forgotPasswordEmail},
      success: (res) => {
        console.log('email sent - client');
        this.setState({
          dialogEmailSent: true,
          loading: false
        });
      },
      error: (err) => {
        console.log('error');
      }
    })
  }
  
  render() {
    if (cookie.load('loggedIn') === 'true') {
      return (<Redirect to='/dashboard' />)
    } 
    let sendConfirmation = null;
    if (this.state.dialogEmailSent === true) {
      sendConfirmation = (
        <div>
          <b>Sent! Check your inbox to reset your password.</b>
        </div>
      )
    }
    const dialogActions = [
      <FlatButton
        label="Close"
        onClick={this.handleClose}
        style={{color: 'white'}}/>
    ]
    return (
      <div style={{
        width: 400,
        height: 500,
        position: 'absolute',
        top:200,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto'
      }}>
        <Card>
          <CardHeader
            titleStyle={{marginLeft: 20, marginTop: 10, fontSize: 25}}
            title="Log In"/>

          <CardText style={{marginLeft: 20}}>
            <TextField
              hintText="Email"
              errorText={this.props.loginEmailError}
              name='email'
              value={this.state.email}
              onChange={this.onChange}
              underlineStyle={{borderBottomColor: 'white'}}/>

            <br/>

            <TextField
              hintText="Password"
              type="password"
              errorText={this.props.loginPasswordError}
              name='password'
              value={this.state.password}
              onChange={this.onChange}
              underlineStyle={{borderBottomColor: 'white'}}/>

            <br/>

            <div style= {{marginTop: 20}}>
              <RaisedButton 
                label="Log In"
                onClick={this.loginClick}/>

              <FlatButton style = {{marginLeft: 10}}
                label="Forgot Password?"
                onClick={this.handleOpen}/>
            </div>

            <Dialog
              contentStyle={{width: 500, color: 'white'}}
              title="Forgot Password?"
              actions={dialogActions}
              modal={false}
              open={this.state.dialogOpen}
              onRequestClose={this.handleClose}>
              <div>
                Enter your account email and we'll send you a new password.
              </div>
              <br/>
              <TextField
                hintText="Email"
                name='forgotPasswordEmail'
                value={this.state.forgotPasswordEmail}
                onChange={this.onChange}
                underlineStyle={{borderBottomColor: 'white'}}              
              />
              <RaisedButton
                style={{marginTop: 10, marginLeft: 20, textColor: '#2284d1'}}
                onClick={this.handlePasswordReset}>
                Send 
              </RaisedButton>
              <br/>
              <BarLoader
                color={'#2284d1'} 
                loading={this.state.loading}
                width={250} 
              />
              {sendConfirmation}
            </Dialog>

          </CardText>
        </Card>

        <div style={{margin: 'auto', width: '50%', marginTop: 20}}>
          Don't have an account? <Link style={{marginLeft: 5}} to='/signup'> Sign up </Link>
        </div>
      </div>
    );
  }
}

export default Login;