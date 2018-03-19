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
import VoterVote from './VoterVote';


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
    console.log('SIGNUP', signup);
    let user = {
      username: `${signup.username}`,
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
        console.log(err);
      }
    });
  }

  loginSubmit(login) {
    let user = {
      username: `${login.username}`,
      password: `${login.password}`
    };
    $.ajax({
      type: 'POST',
      url: '/login',
      data: user,
      success: (res, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          this.setState({
            loggedIn: true,
            currentUser: user.username
          });
          this.props.history.push(`/`);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  logoutSubmit() {
    $.get('/logout');
  }

  render () {
    return (
      <div>
        <Route exact path='/' component={ Landing } />
        <Route exact path='/voter' 
          render={ () =>
            <Voter/>
          }
        />
        <Route exact path="/signup"
          render={ () =>
            <Signup signupSubmit={this.signupSubmit} />
          }
        />

        <Route
          exact path="/login"
          render={ () =>
            <Login loginSubmit={this.loginSubmit} />
          }
        />

        <Route path='/Dashboard' component={ Dashboard } />
        <Route path='/CreatePoll' component={ CreatePoll } />
      </div>
    )
  }
}

const AppWithRouter = withRouter(App);
module.exports = AppWithRouter;