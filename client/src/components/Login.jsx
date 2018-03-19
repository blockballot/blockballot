import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import LoginForm from 'grommet/components/LoginForm';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    return (
      <LoginForm onSubmit = {this.props.loginSubmit}/>
    );
  }
}

export default Login;