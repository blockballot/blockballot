import React from 'react';
import axios from 'axios';
import PasswordInput from 'grommet/components/PasswordInput';

class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({
        value: event.target.value
    });
  }

  handleSubmit() {
    alert(this.state.value)
    event.preventDefault();
    axios({
      method: 'POST',
      url: '/api/voter',
      data: {
        voter_id: this.state.value
      }
    }) 
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
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
            <div>redirect to voter's result page</div>
          )
        } else {
          return (
            <div>redirect to vote page</div>
          )
        }
      }
    } else {
      return (
        <form onSubmit={this.handleSubmit} >
            <label>
            <div>ENTER YOUR UNIQUE CODE</div>
            <input type="password" name="voterPassword" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
      )
    }
  }
}
module.exports = Voter;