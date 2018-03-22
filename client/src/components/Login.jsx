import React from 'react';
import { Link } from 'react-router-dom';
import {CardText, CardHeader, Grid, TextField, RaisedButton, FlatButton, Dialog, Card} from 'material-ui';
import { Responsive, Button, Form, Header, Image, Message, Segment, Container } from 'semantic-ui-react';
import CreatePoll from './CreatePoll.jsx';
const style = {
  width: 400,
  height: 500,
  position: 'absolute',
  top:200,
  bottom: 0,
  left: 0,
  right: 0,
  margin: 'auto'
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false
    }
    this.onChange = this.onChange.bind(this);
    this.loginClick = this.loginClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
  
  //need error handling still for empty fields
  render() {
    const dialogActions = [
      <FlatButton
        label="Close"
        onClick={this.handleClose}
        style={{color: '#2284d1'}}
      />
    ]
    return (
      <div style = {style}>
        <Card>
          <CardHeader
            titleStyle={{marginLeft: 20, marginTop: 10, fontSize: 25}}
            title="Log In"
          />

          <CardText style={{marginLeft: 20}}>
            <TextField
              hintText="Email"
              errorText={this.props.loginEmailError}
              name='email'
              value={this.state.email}
              onChange={this.onChange}
              underlineStyle={{borderBottomColor: '#2284d1'}}


            /><br />
            <TextField
              hintText="Password"
              type="password"
              errorText={this.props.loginPasswordError}
              name='password'
              value={this.state.password}
              onChange={this.onChange}
              underlineStyle={{borderBottomColor: '#2284d1'}}

            /><br />

            <div style= {{marginTop: 20}}>
              <RaisedButton 
                label="Log In"
                onClick={this.loginClick}
              />

              <FlatButton style = {{marginLeft: 10}}
                label="Forgot Password?"
                onClick={this.handleOpen}
              />
            </div>

            <Dialog
              contentStyle={{width: 500, color: '#2284d1'}}
              title="Forgot Password?"
              actions={dialogActions}
              modal={false}
              open={this.state.dialogOpen}
              onRequestClose={this.handleClose}
            >
              <div>
                Enter your account email and we'll send you a new password.
              </div>
              <br />
              <TextField
              hintText="Email"
              name='forgotPasswordEmail'
              value={this.state.forgotPasswordEmail}
              onChange={this.onChange}
              underlineStyle={{borderBottomColor: '#2284d1'}}              
              />
              <RaisedButton
              style={{marginTop: 10, marginLeft: 20, textColor: '#2284d1'}}
              >Send 
              </RaisedButton>
              <br />
            </Dialog>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default Login;