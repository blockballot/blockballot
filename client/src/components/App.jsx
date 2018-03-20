import React from 'react';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
import Landing from './Landing.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard';
import CreatePoll from './CreatePoll';
import VoterResults from './VoterResults';
import cookie from 'react-cookie';
import Voter from './Voter';
import Vote from './Vote';
import $ from 'jquery';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      loggedIn: false
    }
    this.loginSubmit = this.loginSubmit.bind(this);
    this.signupSubmit = this.signupSubmit.bind(this);
  }

  // componentDidMount() {
  //   if (cookie.load('loggedIn') === 'true' && this.state.loggedIn === false) {
  //     let currentUser = cookie.load('username');
  //     this.setState({
  //       loggedIn: true,
  //       currentUser: currentUser
  //     });
  //   }
  // }

  signupSubmit(signup) {
    let user = {
      email: `${signup.username}`,
      password: `${signup.password}`
    };
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: user,
      success: (res, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          this.props.history.push(`/login`);
        }
      },
      error: (err) => {
        console.log(err.responseText);
      }
    });
  }

  loginSubmit(login) {
    let user = {
      email: `${login.email}`,
      password: `${login.password}`
    };
    console.log(user);
    $.ajax({
      type: 'POST',
      url: '/login',
      data: user,
      success: (res, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          console.log('Success!');
          this.setState({
            loggedIn: true,
            currentUser: user.email
          });
          this.props.history.push(`/`);
        }
      },
      error: (err) => {
        console.log(err.responseText);
      }
    });
  }

  logoutSubmit() {
    $.get('/logout');
  }

  render () {
    return (
      <div>
        <Route exact path='/'
          render={ () =>
            <Landing />
          }
        />

        <Route exact path='/voter'
          render={ () =>
            <Voter/>
          }
        />

        <Route exact path='/signup'
          render={ () =>
            <Signup signupSubmit={this.signupSubmit} />
          }
        />

        <Route
          exact path='/login'
          render={ () =>
            <Login loginSubmit={this.loginSubmit} />
          }
        />

        <Route
          exact path='/dashboard'
          render={ () =>
            <Dashboard />
          }
        />

        <Route
          exact path='/createpoll'
          render={ () =>
            <CreatePoll />
          }
        />
      </div>
    )
  }
}

const AppWithRouter = withRouter(App);
module.exports = AppWithRouter;