import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';
import { Card, TextField } from 'material-ui';
import axios from 'axios';
import Vote from './Vote';
import VoterResults from './VoterResults';
import VoteStartsAt from './VoteStartsAt';
import '../style/voter.css';
import PollResults from './PollResults';

class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      hasVoted: false,
      pollId: 0,
      errorText: '',
      pollHash: '',
      pollStart: null,
      pollEnd: '',
      pollExpired: false,
      pollName: '',
      pollResult: '',
      showResult: false,
      voteHash: '',
      keyId: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowResult = this.handleShowResult.bind(this);
  }

  handleShowResult(event) {
    event.preventDefault();
    this.setState({
      showResult: true
    });
  }

  handleChange(event) {
    this.setState({
      uniqueId: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const voter = this;
    axios.post('/voter', {
      uniqueId: this.state.uniqueId
    })
      .then((res) => {

        const startTime = res.data.poll.pollTimeStart;
        const endTime = res.data.poll.pollTimeEnd;
        if (res.data.poll.pollExpired === '1') {
          // poll is closed, take voter to poll results
          const poll = res.data.poll;
          axios.post('/poll', {
            pollId: poll.id
          })
            .then((options) => {
              const optionNames = [];
              const optionVotes = [];
              let totalVotes = 0;
              options.data.forEach((option) => {
                optionNames.push(option.optionName);
                const voteObj = {};
                totalVotes += Number(option.voteCount);
                voteObj[option.optionName] = option.voteCount;
                optionVotes.push(voteObj);
              });
              // format poll object in a way that PollResults component understands
              poll.options = optionNames.join(',');
              poll.voteCount = totalVotes;
              poll.optionVotes = optionVotes;
              poll.pollId = poll.id;
              if (res.data.vote) {
                const voteHash = res.data.vote.voteHash;
                voter.setState({
                  isLogin: true,
                  pollExpired: true,
                  pollResult: poll,
                  hasVoted: true,
                  pollEnd: endTime,
                  voteHash: voteHash,
                  pollName: poll.pollName
                });
              } else {
                voter.setState({
                  isLogin: true,
                  pollExpired: true,
                  pollResult: poll,
                  pollEnd: endTime,
                  pollName: poll.pollName
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (res.data.vote) {
          // this code has already voted, send them directly to their vote result page
          const voteHash = res.data.vote.voteHash;
          voter.setState({
            isLogin: true,
            hasVoted: true,
            pollEnd: endTime,
            voteHash: voteHash,
            pollName: res.data.poll.pollName
          });
        } else {
          const poll = res.data.pollId;
          const hash = res.data.poll.pollHash;
          const keyId = res.data.id;
          const name = res.data.poll.pollName;
          voter.setState({
            isLogin: true,
            pollId: poll,
            pollHash: hash,
            pollStart: startTime,
            pollName: name,
            pollEnd: endTime,
            keyId: keyId
          });
        }
      })
      .catch((error) => {
        console.log(error);
        voter.setState({
          errorText: 'Your unique code is incorrect. Please try again'
        });
      });
  }

  render() {

    let startTime = this.state.pollStart;
    let now = new Date();
    if(startTime === null) {
      startTime = new Date();
    }
    startTime = new Date(this.state.pollStart);

    if(startTime.getTime() > now.getTime()) {
      return (
        <VoteStartsAt
          pollStart={this.state.pollStart}
          pollName={this.state.pollName}
        />
      );
    }
    const pollResult = (
      <div>
        <Menu attached borderless style={{ border: 'none' }}>
          <Link to="/">
            <Menu.Item>
              <h3 style={{
                fontFamily: 'Hammersmith One',
                fontSize: '30px'
              }}
              >
                BB
              </h3>
            </Menu.Item>
          </Link>
        </Menu>
        <PollResults
          poll={this.state.pollResult}
          loggedIn={false}
        />
      </div>
    );

    if (this.state.isLogin) {
      if (this.state.showResult && !this.state.hasVoted) {
        return (
          <div>
            {pollResult}
          </div>
        );
      }
      if (this.state.hasVoted && !this.state.showResult) {
        return (
          <VoterResults
            ballotName={this.state.pollName}
            handleResult={this.handleShowResult}
            voteHash={this.state.voteHash}
            pollEnd={this.state.pollEnd}
            poll={this.state.pollResult}
            pollExpired={this.state.pollExpired}
          />
        );
      }
      if (this.state.pollExpired) {
        return (
          <div>
            {pollResult}
          </div>
        );
      }
      return (
        <Vote
          pollId={this.state.pollId}
          pollHash={this.state.pollHash}
          pollEnd={this.state.pollEnd}
          uniqueId={this.state.uniqueId}
          keyId={this.state.keyId}
        />
      );
    }
    return (
      <div>
        <Menu attached borderless style={{ border: 'none' }}>
          <Link to="/">
            <Menu.Item>
              <h3 style={{
                fontFamily: 'Hammersmith One',
                fontSize: '30px'
              }}
              >
                BB
              </h3>
            </Menu.Item>
          </Link>
        </Menu>
        <div className="header">
        Enter Your Voter Code
        </div>
        <form>
          <Card className="enterCode">
            <TextField
              type="password"
              name="uniqueId"
              hintText="Enter Code"
              value={this.state.uniqueId}
              onChange={this.handleChange}
              errorText={this.state.errorText}
              underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
            />
            <br />
            <Button
              primary
              className="submitButton"
              type="submit"
              value="Submit"
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </Card>
        </form>
      </div>
    );
  }
}

export default Voter;
