import React from 'react';
import cookie from 'react-cookie';
import Landing from './Landing';
import Signup from './Signup';
import Dashboard from './Dashboard';
import CreatePoll from './CreatePoll';
import VoterResults from './VoterResults';
import Voter from './Voter';
import Vote from './Vote';
import PollResults from './PollResults';
import Poll from './Poll';
import LoginReset from './LoginReset';
import AboutUs from './AboutUs';
import $ from 'jquery';
import Nav from './Nav';
import { withRouter } from 'react-router';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: '',
      loggedIn: false,
      signupNameError: '',
      signupEmailError: '',
      signupPasswordError: '',
      loginEmailError: '',
      loginPasswordError: '',
      currentPoll: {},
      activeItem: '',
      modalOpen: false,
    }
    this.loginSubmit = this.loginSubmit.bind(this);
    this.signupSubmit = this.signupSubmit.bind(this);
    this.handlePollClick = this.handlePollClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
  }

  componentDidMount() {
    if (cookie.load('loggedIn') === 'true') {
      let currentUser = cookie.load('username');
      this.setState({
        loggedIn: true,
        currentUser: currentUser
      });
    }
  }

  signupSubmit(signup) {
    this.setState({
      signupNameError: '',
      signupEmailError: '',
      signupPasswordError: ''
    })
    if (signup.name === '') {
      this.setState({
        signupNameError: 'This field is required'
      })
    } else if (signup.email === '' || !this.isValidEmail(signup.email)) {
      this.setState({
        signupEmailError: 'Invalid email address'
      })
    } else if (signup.password === '') {
      this.setState({
        signupPasswordError: 'This field is required'
      })
    } else {

      let user = {
        name: `${signup.name}`,
        email: `${signup.email}`,
        password: `${signup.password}`
      }

      $.ajax({
        type: 'POST',
        url: '/signup',
        data: user,
        success: (res, textStatus, jqXHR) => {
          if (jqXHR.status === 200) {
            this.setState({
              modalOpen: true
            })
            this.props.history.push('/');
          }
        },
        error: (err) => {
          this.setState({
            signupEmailError: err.responseText
          })
        }
      });
    }
  }

  isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  loginSubmit(login) {
    this.setState({
      loginEmailError: '',
      loginPasswordError: '',
    })
    let user = {
      email: `${login.email}`,
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
            currentUser: user.email
          });
          this.props.history.push(`/dashboard`);
        }
      },
      error: (err) => {
        console.log('error!')
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
    this.setState({
      loggedIn: false
    })
  }

  handlePollClick(poll) {
    this.setState({
      currentPoll: poll
    });
    this.props.history.push(`/pollresults`);
  }

  handleOpen() {
    this.setState({
      modalOpen: true
    });
  }

  handleClose() {
    this.setState({
      modalOpen: false
    });
  }

  render () {
    return (

      <div>
        <Nav 
          pathname={this.props.location.pathname}
          activeItem={this.state.activeItem}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          modalOpen={this.state.modalOpen}
          loggedIn={this.state.loggedIn}
          loginSubmit={this.loginSubmit}
          loginEmailError={this.state.loginEmailError}
          loginPasswordError={this.state.loginPasswordError}
        />

        <Route
          path='/reset'
          render={ () =>
            <LoginReset/>
          }
        />
        
        <Route exact path='/'
          render={ () =>
            <Landing 
            loggedIn={this.state.loggedIn}/>
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
            signupEmailError={this.state.signupEmailError}
            signupNameError={this.state.signupNameError}
            signupPasswordError={this.state.signupPasswordError}
            />
          }
        />

        <Route
          exact path='/dashboard'
          render={ () =>
            <Dashboard 
            loggedIn={this.state.loggedIn}
            handlePollClick={this.handlePollClick}/>
          }
        />
        <Route
          exact path='/createpoll'
          render={ () =>
            <CreatePoll 
            loggedIn={this.state.loggedIn}
            />
          }
        />

        <Route
          exact path='/pollresults'
          render={ () =>
            <PollResults
            poll={this.state.currentPoll}
            loggedIn={this.state.loggedIn}
            />
          }
        />

        <Route
          exact path='/aboutus'
          render={ () =>
            <AboutUs/>
          }
        />

      </div>
    )
  }
}

const AppWithRouter = withRouter(App);
export default AppWithRouter;
