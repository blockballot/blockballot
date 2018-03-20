import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from 'grommet/components/LoginForm';
import {TextField, RaisedButton, Grid} from 'material-ui';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
    this.onChange = this.onChange.bind(this);
    this.loginClick = this.loginClick.bind(this);
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
  
  render() {
    return (
      <div>
        <TextField
          hintText="Email"
          errorText=''
          name='email'
          value={this.state.email}
          onChange={this.onChange}
        /><br />
        <TextField
          hintText="Password"
          errorText=''
          name='password'
          value={this.state.password}
          onChange={this.onChange}
        /><br />
        <RaisedButton 
          label="Log in"
          onClick={this.loginClick}
        />
      </div>
    );
  }
}

export default Login;