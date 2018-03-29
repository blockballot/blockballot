import React from 'react';
import axios from 'axios';
import Vote from './Vote.jsx';
import VoteResults from './VoterResults.jsx';
import { Card, TextField } from 'material-ui';
import { Button } from 'semantic-ui-react';
import '../style/voter.css';


class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false,
      pollId: 0, 
      errorText: ''
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
    var voter = this;
    axios({
      method: 'POST',
      url: '/api/voter',
      data: {
        uniqueId: this.state.uniqueId
      }
    })
    .then(function (res) {
      var poll = res.data.pollId;
      voter.setState({
        isLogin: true,
        pollId: poll
      });
    })
    .catch(function (error) {
      console.log(error);
      voter.setState({
        errorText: "Your unique code is incorrect. Please, try again"
      });
    });
  }

  render() {
    if(this.state.isLogin) {
      if(this.state.isBallotCompleted) {
        return (
          <div>ballot result visual</div>
        )
      } else {
        if(this.state.isVoteSubmitted) {
          return (
            <VoteResults  />
          )
        } else {
          return (
            <Vote pollId={this.state.pollId} />
          )
        }
      }
    } else {
      return (
        <div>
          <div className="header">
          Enter Your Voter Code
          </div>
            <form>
              <Card className="center">
                <TextField
                  type="password"
                  name="uniqueId"
                  value={this.state.uniqueId}
                  onChange={this.handleChange}
                  hintText="Enter Code"
                  errorText= {this.state.errorText}
                  underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
                />
                <br/>
                <Button
                  primary
                  className='submitButton'
                  type="submit"
                  value="Submit"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </Card>
            </form>
        </div>
      )
    }
  }
}

export default Voter;