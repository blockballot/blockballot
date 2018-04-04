/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'material-ui';
import { Menu } from 'semantic-ui-react';
import { formatDate } from '../../../helpers/helpers';
import '../style/voter.css';

class VoterResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const etherscanUrl = `https://rinkeby.etherscan.io/tx/${this.props.voteHash}`;

    let endTime = null;
    if (this.props.pollEnd === '') {
      endTime = 'Ballot will be manually closed by the org.  Return to this page once the ballot is closed to view results.';
    } else {
      const formattedTime = formatDate(this.props.pollEnd);
      endTime = `Ballot closes on ${formattedTime}. Return to this page once the allotted time is over to view results.`;
    }

    return (
      <div>
        <Menu attached borderless style={{ border: 'none' }}>
          <Link to="/">
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
            {
              this.props.pollExpired &&
              <div>
                Ballot is now closed for voting. View ballot results <a href="#" onClick={this.props.handleResult}>here</a>
              </div>
            }
            {
              !this.props.pollExpired &&
              <div>
                {endTime}
              </div>
            }
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
    );
  }
}

export default VoterResults;
