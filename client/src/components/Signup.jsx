import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from 'grommet/components/LoginForm';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  render() {
    return (
      <LoginForm onSubmit = {this.props.signupSubmit}/>
    );
  }
}

export default Signup;