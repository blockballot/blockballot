import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {Card, CardText, CardHeader, TextField, RaisedButton, FlatButton} from 'material-ui';
import axios from 'axios';

class LoginReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: window.location.search.slice(7),
      email: '',
      password1: '',
      password2: '',
      resetComplete: false,
      resetError: false,
      passwordMatchError: false
    }
    this.onReset = this.onReset.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    let target = e.target.name;
    this.setState ({
      [target]: e.target.value
    });
  }

  onReset() {
    this.setState({
      resetError: false,
      passwordMatchError: false
    })
    if (this.state.password1 !== this.state.password2) {
      this.setState({
        passwordMatchError: true
      })
    } else {
      axios.post('/resetpassword', {
        token: this.state.token,
        password: this.state.password1
      }).then((res) => {
        if (res.status === 201) {
          this.setState({
            resetComplete: true,
          });
          console.log('reset successful');
        }
      }).catch((err) => {
        this.setState({
          resetError: true,
        });
        console.log('error sending emails');
      });
    }
  }
  
  render() {
    let resetConfirmation = null;
    if (this.state.resetComplete === true) {
      resetConfirmation = (
        <div>
          <b>Password reset!</b>
        </div>
      )
    }

    let passwordMismatch = null;
    if (this.state.passwordMatchError === true) {
      passwordMismatch = (
        <div>
          <b>Passwords do not match. Please try again.</b>
        </div>
      )
    }

    if (this.state.token === 'error' || this.state.token === '') {
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
              titleStyle={{margin: 20, marginBottom: 10, fontSize: 25}}
              title="Invalid link"
            />
            <CardText style={{marginLeft: 20, marginRight: 20}}>
              <p>This link is invalid or has expired.</p>
              <p>If you need to reset your password, visit <b>Forgot Your Password</b> in the login window.</p>
            </CardText>
          </Card>
        </div>
      )
    } else {
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
              title="Reset your Password"
            />
            <CardText style={{marginLeft: 20}}>
              <TextField
                hintText="Enter your Password"
                errorText={''}
                type="password"
                name='password1'
                value={this.state.password1}
                onChange={this.onChange}
                underlineStyle={{borderBottomColor: 'white'}}
              />
              <br/>
              <TextField
                hintText="Confirm your Password"
                type="password"
                errorText={''}
                name='password2'
                value={this.state.password2}
                onChange={this.onChange}
                underlineStyle={{borderBottomColor: 'white'}}
              />
              <br/>
              <div style= {{marginTop: 20}}>
                <RaisedButton 
                  label="Reset"
                  onClick={this.onReset}
                />
              </div>
              <br/>
              {passwordMismatch}
              {resetConfirmation}
            </CardText>
          </Card>
        </div>
      );
    }
  }
}

export default LoginReset;