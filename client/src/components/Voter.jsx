import React from 'react';
import axios from 'axios';
import PasswordInput from 'grommet/components/PasswordInput';
import Vote from './Vote.jsx'
import VoteResults from './VoterResults.jsx'

class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false
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
    // axios({
    //   method: 'POST',
    //   url: '/api/Voter',
    //   data: {
    //     uniqueId: this.state.uniqueId
    //   }
    // })
    // .then(function (res) {
    //   console.log('found unique ID', res);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    if(this.state.uniqueId === 'test') {
      this.setState({
        isLogin: true
      });
    }

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
            <VoteResults />
          )
        } else {
          return (
            <Vote />
          )
        }
      }
    } else {
      return (
        <div>
        <form>
            <label>
            <div>ENTER YOUR UNIQUE CODE -type "test"</div>
            <input type="password" name="uniqueId" value={this.state.uniqueId} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" onClick={this.handleSubmit} />
        </form>
        </div>
      )
    }
  }
}

export default Voter;