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
    .then((res) => {
      var poll = res.data.pollId;
      var hash = res.data.poll.pollHash;
      voter.setState({
        isLogin: true,
        pollId: poll,
        pollHash: hash
      });
    })
    .catch((error) => {
      console.log(error);
      voter.setState({
        errorText: "Your unique code is incorrect. Please try again"
      });
    });
  }

  render() {
    if(this.state.isLogin) {
      return (
        <Vote 
          pollId={this.state.pollId}
          pollHash={this.state.pollHash}
        />
      )
    } else {
      return (
        <div>
          <div className='header'>
          Enter Your Voter Code
          </div>
            <form>
              <Card className='enterCode'>
                <TextField
                  type='password'
                  name='uniqueId'
                  hintText='Enter Code'
                  value={this.state.uniqueId}
                  onChange={this.handleChange}
                  errorText= {this.state.errorText}
                  underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
                />
                <br/>
                <Button
                  primary
                  className='submitButton'
                  type='submit'
                  value='Submit'
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