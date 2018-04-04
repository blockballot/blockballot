import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'material-ui';
import { Menu } from 'semantic-ui-react';
import '../style/voter.css';
import formatDate from '../utils/helpers.js';

class VoteStartsAt extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(formatDate)
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
            Thank You For Visiting
          </div><br/>
          <div className="subHeader">
            Following ballot has not started:
          </div>
          <div className="ballotName">
            {this.props.pollName}
          </div>
          <div className="subHeader">
            Ballot opens at: <br/> 
            {this.props.pollStart}
          </div>
          <div className="colorBackground" />
        </div>
      </div>
    )
  }
}

export default VoteStartsAt;