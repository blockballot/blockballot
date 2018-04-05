import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'material-ui';
import { Menu } from 'semantic-ui-react';
import '../style/voter.css';
import { formatDate } from '../../../helpers/helpers';

class VoteStartsAt extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
        <div className="confirmationPage">
          <div className="confirmationHeader">
            Ballot is Not Yet Active
          </div>
          <div className="subHeader">
            You are trying to access the following ballot:
          </div>
          <div className="ballotName">
            {this.props.pollName}
          </div>
          <div className="subHeader">
            Ballot opens on:
          </div>
          <div className="subHeader">
            {formatDate(this.props.pollStart)}
          </div>
          <div className="colorBackground" />
        </div>
      </div>
    )
  }
}

export default VoteStartsAt;