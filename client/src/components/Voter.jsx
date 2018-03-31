import React from 'react';
import axios from 'axios';
import { Card, TextField } from 'material-ui';
import { Button } from 'semantic-ui-react';
import Vote from './Vote';
import '../style/voter.css';


class Voter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      pollId: 0,
      errorText: '',
      pollHash: '',
      pollEnd: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      uniqueId: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const voter = this;
    axios({
      method: 'POST',
      url: '/api/voter',
      data: {
        uniqueId: this.state.uniqueId,
      }
    })
      .then((res) => {
        const poll = res.data.pollId;
        const hash = res.data.poll.pollHash;
        const endTime = res.data.poll.pollTimeEnd;
        voter.setState({
          isLogin: true,
          pollId: poll,
          pollHash: hash,
          pollEnd: endTime,
        });
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
      return (
        <Vote
          pollId={this.state.pollId}
          pollHash={this.state.pollHash}
          pollEnd={this.state.pollEnd}
        />
      );
    }
    return (
      <div>
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
