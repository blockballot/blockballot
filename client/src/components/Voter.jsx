import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';
import { Card, TextField } from 'material-ui';
import axios from 'axios';
import Vote from './Vote';
import VoterResults from './VoterResults';
import '../style/voter.css';

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
      pollEnd: '',
      voteHash: '',
      keyId: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      uniqueId: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const voter = this;
    axios({
      method: 'POST',
      url: '/voter',
      data: {
        uniqueId: this.state.uniqueId
      }
    })
      .then((res) => {
        console.log(res);
        const endTime = res.data.poll.pollTimeEnd;
        // this code has already voted, send them directly to results
        if (res.data.vote) {
          const voteHash = res.data.vote.voteHash;
          voter.setState({
            isLogin: true,
            hasVoted: true,
            pollEnd: endTime,
            voteHash: voteHash
          });
        } else {
          const poll = res.data.pollId;
          const hash = res.data.poll.pollHash;
          const keyId = res.data.id;
          voter.setState({
            isLogin: true,
            pollId: poll,
            pollHash: hash,
            pollEnd: endTime,
            keyId: keyId
          });
        }
      })
      .catch((error) => {
        console.log(error);
        voter.setState({
          errorText: 'Your unique code is incorrect. Please try again',
        });
      });
  }

  render() {
    if (this.state.isLogin) {
      if (this.state.hasVoted) {
        return (
          <VoterResults
            voteHash={this.state.voteHash}
            pollEnd={this.props.pollEnd}
          />
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
          <Link to='/'>
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
