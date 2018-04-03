import React from 'react';
import { Link } from 'react-router-dom';
import { Card, RadioButton, RadioButtonGroup } from 'material-ui';
import { Menu, Button } from 'semantic-ui-react';
import Loadable from 'react-loading-overlay';
import axios from 'axios';
import VoterResults from './VoterResults';
import '../style/voter.css';

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      voteHash: '',
      isVoteSubmitted: false,
      selectedOption: '',
      candidateName: '',
      ballotName: '',
      ballotOption: [],
      loaderActive: false
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentWillMount() {
    const option = this;
    axios({
      method: 'POST',
      url: '/poll',
      data: {
        pollId: this.props.pollId
      }
    })
      .then((res) => {
        const options = res.data.map((element) => {
          return element;
        });
        const name = res.data[0].poll.pollName;
        option.setState({
          ballotName: name,
          ballotOption: options,
          selectedOption: options[0].id
        });
      })
      .catch((error) => {
        console.log(error);
        option.setState({
          errorText: 'Your unique code is incorrect. Please, try again',
        });
      });
  }

  updateCheck(event) {
    const eventValue = event.target.value.split('.');
    this.setState({
      selectedOption: eventValue[0],
      candidateName: eventValue[1]
    });
  }

  submitVote(event) {
    event.preventDefault();
    const voted = this;
    voted.setState({
      loaderActive: true
    });
    axios.post('/blockchainvote', {
      address: voted.props.pollHash,
      candidate: voted.state.candidateName,
      uniqueId: voted.props.uniqueId
    })
      .then((res) => {
        console.log(`Vote tx hash: ${res.data}`);
        voted.setState({
          voteHash: res.data
        });
        return axios.post('/voteresult', {
          optionId: Number(voted.state.selectedOption),
          voteHash: res.data,
          uniqueId: voted.props.uniqueId,
          pollId: voted.props.pollId,
          keyId: voted.props.keyId
        });
      })
      .then((res) => {
        console.log(res);
        console.log('vote has been submitted');
        voted.setState({
          loaderActive: false,
          isVoteSubmitted: true
        });
      })
      .catch((error) => {
        voted.setState({
          loaderActive: false,
        });
        console.log(error);
      });
  }

  render() {
    const ballotInfo = this.state;
    const ballotQuestionList = ballotInfo.ballotOption.map((option, index) => {
      return (
        <RadioButton
          iconStyle={{ fill:'#4183D9' }}
          key={index}
          label={option.optionName}
          value={`${option.id}.${option.optionName}`}
        />
      );
    });
    if (this.state.isVoteSubmitted === true) {
      return (
        <VoterResults
          ballotOption={this.state.ballotOption}
          ballotName={this.state.ballotName}
          voteHash={this.state.voteHash}
          pollEnd={this.props.pollEnd}
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
        <div className="header">{ballotInfo.ballotName}</div>
        <form>
          <Card className="ballotOptions">
            <div>
              <RadioButtonGroup
                name="voteoptions"
                labelPosition="left"
                valueSelected={`${this.state.selectedOption}.${this.state.candidateName}`}
                onChange={this.updateCheck}
              >
                {ballotQuestionList}
              </RadioButtonGroup>
            </div>
            <br />
            <Loadable
              active={this.state.loaderActive}
              spinnerSize="35px"
              spinner
            >
              <Button
                fluid
                primary
                className="blueMatch buttonStyle voteButton"
                onClick={this.submitVote}
              >
                Vote
              </Button>
            </Loadable>
          </Card>
        </form>
      </div>
    );
  }
}

export default Vote;
