import React from 'react';
import { withRouter } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import cookie from 'react-cookie';
import $ from 'jquery';
import axios from 'axios';
import Landing from './Landing';
import Signup from './Signup';
import Dashboard from './Dashboard';
import CreatePoll from './CreatePoll';
import Voter from './Voter';
import PollResults from './PollResults';
import LoginReset from './LoginReset';
import AboutUs from './AboutUs';
import Settings from './Settings';
import Nav from './Nav';

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
      modalOpen: false
    };
    this.loginSubmit = this.loginSubmit.bind(this);
    this.signupSubmit = this.signupSubmit.bind(this);
    this.handlePollClick = this.handlePollClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
  }

  componentWillMount() {
    if (cookie.load('loggedIn') === 'true') {
      const currentUser = cookie.load('username');
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
    });
    if (signup.name === '') {
      this.setState({
        signupNameError: 'This field is required'
      });
    } else if (signup.email === '' || !this.isValidEmail(signup.email)) {
      this.setState({
        signupEmailError: 'Invalid email address'
      });
    } else if (signup.password === '') {
      this.setState({
        signupPasswordError: 'This field is required'
      });
    } else {
      axios.post('/signup', {
        name: signup.name,
        email: signup.email,
        password: signup.password
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState({
              modalOpen: true
            });
            this.props.history.push('/');
          }
        })
        .catch((err) => {
          this.setState({
            signupEmailError: err.message
          });
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
      loginPasswordError: ''
    });

    axios.post('/login', {
      email: login.email,
      password: login.password
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            loggedIn: true,
            currentUser: cookie.load('username')
          });
          this.props.history.push('/dashboard');
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.setState({
            loginEmailError: err.response.data
          });
        }
        if (err.response.status === 402) {
          this.setState({
            loginPasswordError: err.response.data
          });
        }
      });
  }

  logoutSubmit() {
    $.get('/logout');
    this.setState({
      loggedIn: false
    });
  }

  handlePollClick(poll) {
    this.setState({
      currentPoll: poll
    });
    this.props.history.push('/pollresults');
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

  render() {
    const AddNav = (
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
    );

    return (

      <div>
        <Route
          path='/reset'
          render={() => (
            <div>
              {AddNav}
              <LoginReset/>
            </div>
            )
          }
        />

        <Route
          exact
          path="/"
          render={() => (
            <div>
              {AddNav}
              <Landing loggedIn={this.state.loggedIn} />
            </div>
            )
          }
        />

        <Route
          exact
          path="/voter"
          render={() =>
            <Voter />
          }
        />

        <Route
          exact
          path="/signup"
          render={() => (
            <div>
              {AddNav}
              <Signup
                signupSubmit={this.signupSubmit}
                signupEmailError={this.state.signupEmailError}
                signupNameError={this.state.signupNameError}
                signupPasswordError={this.state.signupPasswordError}
              />
            </div>
            )
          }
        />

        <Route
          exact
          path="/dashboard"
          render={() => (
            <div>
              {AddNav}
              <Dashboard
                loggedIn={this.state.loggedIn}
                handlePollClick={this.handlePollClick}
                currentUser={this.state.currentUser}
              />
            </div>
            )
          }
        />
        <Route
          exact
          path="/createpoll"
          render={() => (
            <div>
              {AddNav}
              <CreatePoll
                loggedIn={this.state.loggedIn}
              />
            </div>
            )
          }
        />

        <Route
          exact
          path="/settings"
          render={() => (
            <div>
              {AddNav}
              <Settings
                loggedIn={this.state.loggedIn}
              />
            </div>
          )
          }
        />

        <Route
          exact
          path="/pollresults"
          render={() => (
            <div>
              {AddNav}
              <PollResults
                poll={this.state.currentPoll}
                loggedIn={this.state.loggedIn}
              />
            </div>
            )
          }
        />

        <Route
          exact
          path="/aboutus"
          render={() => (
            <div>
              {AddNav}
              <AboutUs />
            </div>
            )
          }
        />
      </div>
    );
  }
}

const AppWithRouter = withRouter(App);
export default AppWithRouter;
