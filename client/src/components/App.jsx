import React from 'react';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import Landing from './Landing.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import CreatePoll from './CreatePoll.jsx';
import VoterLogin from './VoterLogin.jsx';
import Vote from './Vote.jsx';
import VoteResults from './VoterResults.jsx';


class App extends React.Component {
  render () {
    return (
      <div>
        <Route exact path='/' component={ Landing } />
        <Route path='/Signup' component={ Signup } />
        <Route path='/Login' component={ Login } />
        <Route path='/Dashboard' component={ Dashboard } />
        <Route path='/CreatePoll' component={ CreatePoll } />
        <Route path='/VoterLogin' component={ VoterLogin } />
        <Route path='/Vote' component={ Vote } />
        <Route path='/VoteResults' component={ VoteResults } />
      </div>
    )
  }
}

const AppWithRouter = withRouter(App);
module.exports = AppWithRouter;