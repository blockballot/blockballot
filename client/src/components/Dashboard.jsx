import React from 'react';
import axios from 'axios';
import cookie from 'react-cookie';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import Poll from './Poll';
import '../style/dashboard.css';
import { formatDate } from '../../../helpers/helpers';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: [],
      loading: true
    };
    this.retrieveOrgPolls = this.retrieveOrgPolls.bind(this);
  }

  componentWillMount() {
    this.retrieveOrgPolls();
    this.timer = setInterval(this.retrieveOrgPolls, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updatePoll(res) {
    this.setState({
      polls: res.data
    });
  }

  retrieveOrgPolls() {
    axios.get('/polls')
      .then((polls) => {
        this.updatePoll(polls);
        this.setState({
          loading: false
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const polls = this.state.polls;
    let pollComponent = null;

    if (cookie.load('loggedIn') !== 'true') {
      return (<Redirect to="/" />);
    }
    if (this.state.loading === true) {
      pollComponent = (
        <div class="ui active inverted dimmer">
          <div class="ui large text loader">Loading</div>
        </div>
      )
    } 
    if (polls.length === 0 && this.state.loading === false) {
      pollComponent = (
        <div className="ballotImg">
          <img src="https://c1.staticflickr.com/1/805/39390736730_b01c35326c_n.jpg" alt="No Ballots Currently" />
          <h2>No Ballots to Display</h2>
        </div>
      );
    } else {
      pollComponent = (
        <div style={{ marginLeft: 50, marginRight: 50, marginTop: 50, marginBottom: 30 }}>
          <div className="ui four cards">
            {polls.map(poll => (
              <Poll
                poll={poll}
                handlePollClick={this.props.handlePollClick}
              />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="headers">
          <h2 className="welcome">Welcome, {this.props.currentUser}</h2>
          <h2 className="dashboardTitle">Your Ballot Dashboard</h2>
          <Link to="/createpoll">
            <Button
              primary
              className="buttonStyle blueMatch"
            >
              Create Ballot
            </Button>
          </Link>
        </div>
        {pollComponent}
      </div>
    );
  }
}


export default Dashboard;
