import React from 'react';
import axios from 'axios';
import Checkbox from 'material-ui/Checkbox';
import { Card, Divider, TextField, RaisedButton } from 'material-ui';
import '../style/voter.css';

class VoterResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLoggedIn: false,
      isVoteSubmitted: false,
      isBallotCompleted: false,
      ballotName: props.ballotName || '',
      ballotOption: props.ballotOption || []
    };
  }

  render() {
    let voteResult = this.state.ballotOption.reduce((acc, cur, index) => {
      if (cur.optionAnswer === true) {
        acc.push(<div key={index}>{cur.optionName}</div>);
      }
      return acc;
    }, []);
    
    let etherscanUrl = `https://rinkeby.etherscan.io/tx/${this.props.voteHash}`;

    return (
      <div>
        <div className='header'>
          Thank You For Voting
        </div>
        <div className="subHeader">
          Your response has been permanently recorded for the following ballot:
        </div>
        <div className="ballotName">
          {this.state.ballotName}
        </div>
        <Card className="center">
          <div>
            <b>Confirmation ID for Your Records:</b>
            <div className="voteHash">
              {this.props.voteHash}
            </div>
          </div>
          <div className='etherscan'>
            <b>View a Record of Your Vote on Etherscan <a href={etherscanUrl}>Here</a></b>
          </div>
        </Card>
        <div className='subHeader'>
          View Election Outcomes Here in: 03:20:00
        </div>
      </div>
    )
  }
}

export default VoterResults;