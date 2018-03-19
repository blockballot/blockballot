import React from 'react';
import axios from 'axios';
import PasswordInput from 'grommet/components/PasswordInput';

class VoterResults extends React.Component {
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
    axios({
      method: 'POST',
      url: '/api/Voter',
      data: {
        uniqueId: this.state.uniqueId
      }
    })
    .then(function (res) {
      console.log('found unique ID', res);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <form>
        <label>
          <div>Ballot Name</div>
        </label>
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
      </form>
    )
  }
}

export default VoterResults;

