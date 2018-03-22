import React from 'react';
import axios from 'axios';
import Vote from './Vote.jsx';
import VoteResults from './VoterResults.jsx';
import { Card, TextField, RaisedButton } from 'material-ui';
import '../style/voter.css';


class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false,
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
    } else {
      this.setState({
        errorText: "Your unique code is incorrect. Please, try again"
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
          <div className="header">
          Enter Your Unique Code
          <br/>
          (Demo Code: "test")
          </div>
            <form>
              <Card className="center">
                <TextField
                  type="password"
                  name="uniqueId"
                  value={this.state.uniqueId}
                  onChange={this.handleChange}
                  floatingLabelText="Enter Code"
                  errorText= {this.state.errorText}
                  /><br/>
                <RaisedButton label="Submit" type="submit" value="Submit" onClick={this.handleSubmit} />
              </Card>
            </form>
        </div>
      )
    }
  }
}

export default Voter;