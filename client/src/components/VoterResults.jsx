import React from 'react';
import axios from 'axios';
import Checkbox from 'material-ui/Checkbox';
import { Card, Divider, TextField, RaisedButton } from 'material-ui';
import '../style/voter.css';

class VoteResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false,
      ballotName: props.ballotName || '',
      ballotOption: props.ballotOption || [],
    };
  }

  componentWillMount() {
    // get the ballotName and ballot question to update the state
  } 

  render() {
    let voteResult = this.state.ballotOption.reduce((acc, cur, index) => {
        if (cur.optionAnswer === true) {
          acc.push(<div key={index}>{cur.optionName}</div>);
        }
        return acc;
      }, []);

    return (
      <div>
        <div className="header">
          VOTER RESULTS <br/>
          {this.state.ballotName}
        </div>
        <Card className="center">
          <div style={{fontSize: 16, minWidth: 400}}>
            <b>Your Choice</b>
            <div>
              {voteResult}
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default VoteResults;