import React from 'react';
import { Card } from 'material-ui';
import '../style/voter.css';

class VoterResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let etherscanUrl = `https://rinkeby.etherscan.io/tx/${this.props.voteHash}`;

    return (
      <div className="confirmationPage">
        <div className="confirmationHeader">
          Thank You For Voting
        </div>
        <div className="subHeader">
          Your response has been permanently recorded for the following ballot:
        </div>
        <div className="ballotName">
          {this.props.ballotName}
        </div>
        <div className="subHeader">
          Ballot closes at {this.props.pollEnd}
        </div>
        <Card className="confirmCard">
          <div>
            <b>Confirmation ID for Your Records:</b>
            <div className="voteHash">
              {this.props.voteHash}
            </div>
          </div>
          <div className="etherscan">
            <b>View a Record of Your Vote on Etherscan <a href={etherscanUrl}>Here</a></b>
          </div>
        </Card>
        <div className="colorBackground" />
      </div>
    )
  }
}

export default VoterResults;
