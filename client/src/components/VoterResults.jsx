import React from 'react';
import axios from 'axios';
import Checkbox from 'material-ui/Checkbox';
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
      <form>
        <label>
          <div>VOTER RESULTS PAGE</div>
          <div>{this.state.ballotName}</div>
          <div>Your Choices</div>
          <div className="block" >
            {voteResult}
          </div>
        </label>
      </form>
    )
  }
}

export default VoteResults;