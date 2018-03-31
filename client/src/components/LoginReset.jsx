import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import {Card, CardText, CardHeader, TextField, RaisedButton, FlatButton} from 'material-ui';
import axios from 'axios';


class LoginReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      resetComplete: false,
      resetError: false
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
    axios.post('/resetPassword', {
      email: this.state.email,
      password: this.state.password
    }).then((res) => {
      console.log('RES', res);
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
  
  render() {
    let resetConfirmation = null;
    if (this.state.resetComplete === true) {
      resetConfirmation = (
        <div>
          <b>Password reset. You are now logged in.</b>
        </div>
      )
    }
    
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
            title="Reset your Password"/>

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
                label="Reset"
                onClick={this.onReset}/>

            </div>
            <br/>
            {resetConfirmation}

          </CardText>
        </Card>
      </div>
    );
  }
}

export default LoginReset;