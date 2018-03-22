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
import PollResults from './PollResults'
import $ from 'jquery';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      loggedIn: false,
      signupError: '',
      loginEmailError: '',
      loginPasswordError: '',
      currentPoll: {}
    }
    this.loginSubmit = this.loginSubmit.bind(this);
    this.signupSubmit = this.signupSubmit.bind(this);
    this.handlePollClick = this.handlePollClick.bind(this);
  }

  componentDidMount() {
    if (cookie !== undefined) {
      if (cookie.load('loggedIn') === 'true' && this.state.loggedIn === false) {
        let currentUser = cookie.load('username');
        this.setState({
          loggedIn: true,
          currentUser: currentUser
        });
      }
    }
  }

  signupSubmit(signup) {
    console.log('SIGNUP', signup);
    let user = {
      name: `${signup.name}`,
      email: `${signup.email}`,
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
        this.setState({
          signupError: err.responseText
        })
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
          this.props.history.push(`/dashboard`);
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.setState({
            loginEmailError: err.responseText
          })
        }
        if (err.status === 402) {
          this.setState({
            loginPasswordError: err.responseText
          })
        }
      }
    });
  }

  logoutSubmit() {
    $.get('/logout');
  }

  handlePollClick(poll) {
    this.setState({
      currentPoll: poll
    });
    this.props.history.push(`/pollresults`);
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
            <Signup
            signupSubmit={this.signupSubmit}
            signupError={this.state.signupError}
            />
          }
        />

        <Route
          style={{backgroundColor: '#F0F8FF'}}
          exact path='/login'
          render={ () =>
            <Login
            loginSubmit={this.loginSubmit}
            loginEmailError={this.state.loginEmailError}
            loginPasswordError={this.state.loginPasswordError}
            />
          }
        />

        <Route
          exact path='/dashboard'
          render={ () =>
            <Dashboard 
            handlePollClick = {this.handlePollClick}/>
          }
        />
        <Route
          exact path='/createpoll'
          render={ () =>
            <CreatePoll />
          }
        />

        <Route
          exact path='/pollresults'
          render={ () =>
            <PollResults
            poll={this.state.currentPoll} 
            />
          }
        />
        
      </div>
    )
  }
}

const AppWithRouter = withRouter(App);
module.exports = AppWithRouter;