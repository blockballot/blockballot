import React from 'react';
import axios from 'axios';
import VoteResults from './VoterResults.jsx';
import { Divider, Card, RaisedButton, Checkbox} from 'material-ui';
import '../style/voter.css';


class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLogin: false,
      isVoteSubmitted: false,
      isBallotCompleted: false,
      ballotName: 'what is your favorite color', // database input will replace 
      ballotOption: [  // database input will replace 
        { optionName:'red',
          optionAnswer: false
        },
        { optionName:'blue',
          optionAnswer: false
        },
        { optionName:'green',
          optionAnswer: false
        }
      ]
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // get the ballotName and ballot question to update the state
  } 

  updateCheck(event) {
    for (var i = 0; i < this.state.ballotOption.length; i++) {
      if (this.state.ballotOption[i].optionName === event.target.name) {
        let newBallotOptions = this.state.ballotOption.slice();
        newBallotOptions[i].optionAnswer = !this.state.ballotOption[i].optionAnswer;
        this.setState ({
          ballotOption: newBallotOptions
        })
      }
    }
  }

  handleSubmit(event) {
    // event.preventDefault();
    // axios({
    //   method: 'POST',
    //   url: '/api/Voter',
    //   data: {
    //     uniqueId: this.state.uniqueId
    //   }
    // })
    // .then(function (res) {
    //   console.log('found unique ID', res);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    this.setState ({
      isVoteSubmitted: true
    })

  }

  render() {
    let ballotInfo = this.state;
    let ballotQuestionList = ballotInfo.ballotOption.map((option, index) => {
                              return ( <div>
                                          <Checkbox 
                                            style={{ marginTop: 16, marginBottom: 16 }} 
                                            labelPosition="left" 
                                            key={index} 
                                            label={option.optionName} 
                                            checked={option.optionAnswer} 
                                            onCheck={this.updateCheck} 
                                            name={option.optionName}
                                            />
                                          <Divider />
                                        </div>
                                      )
                                    })
    
    if(this.state.isVoteSubmitted === true) {
      return (
        <VoteResults 
          ballotOption={this.state.ballotOption} 
          ballotName= {this.state.ballotName} />
      )
    } else {
   
      return (
        <div>
          <div className="header">VOTE PAGE</div>
          <form  >
            <Card className="center">
              <div style={{fontSize: 16, minWidth: 400}}>
                <b>{ballotInfo.ballotName}</b><br/>
                <div>{ballotQuestionList}</div>
              </div><br/>  
              <RaisedButton label="Submit" type="submit" value="Submit" onClick={this.handleSubmit} />
            </Card>
          </form>
        </div>
      )
    }
  }
}

export default Vote;