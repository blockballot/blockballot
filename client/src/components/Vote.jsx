import React from 'react';
import axios from 'axios';

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false,
      ballotName: 'ballot name from database', // database input will replace 
      ballotQuestion: [  // database input will replace 
        { questionName:'question1',
          questionAnswer: null
        },
        { questionName:'question1',
          questionAnswer: null
        },
        { questionName:'question1',
          questionAnswer: null
        }
      ]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // get the ballotName and ballot question to update the state
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
    let ballotInfo = this.state;
  

    return (
     
      <form>
        <label>
          <div>VOTE PAGE</div>
          <div>{ballotInfo.ballotName}</div>
        </label>
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
      </form>
    )
  }
}

export default Vote;