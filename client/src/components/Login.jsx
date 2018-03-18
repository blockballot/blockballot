import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    this.props.loginSubmit(this.state);
  }

  render() {
    return (
      <div>
        <form class="ui form">
          <div class="field">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Username"
              onChange={this.handleChange}>
            </input>
          </div>
          <div class="field">
            <label>Password</label>
            <input 
              type="text" 
              name="password" 
              placeholder="Password"
              onChange={this.handleChange}>
            </input>
          </div>
          <button 
            class="ui button" 
            type="submit"
            onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default Login;