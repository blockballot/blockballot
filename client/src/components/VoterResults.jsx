import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'material-ui';
import { Menu } from 'semantic-ui-react';
import '../style/voter.css';

class VoterResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let etherscanUrl = `https://rinkeby.etherscan.io/tx/${this.props.voteHash}`;

    return (
      <div>
        <Menu attached borderless style={{ border: 'none' }}>
          <Link to='/'>
            <Menu.Item>
              <h3 style={{
                fontFamily: 'Hammersmith One',
                fontSize: '30px'
              }}>BB</h3>
            </Menu.Item>
          </Link>
        </Menu>
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
      </div>
    )
  }
}

export default VoterResults;
