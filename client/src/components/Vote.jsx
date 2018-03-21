import React from 'react';
import axios from 'axios';
import { default as Web3} from 'web3';
import getWeb3 from '../../../helpers/getWeb3.js';
import contract from 'truffle-contract';
import VoterResults from './VoterResults.jsx';
import TestVote from '../../../build/contracts/TestVote.json';
import { Divider, Card, RaisedButton, Checkbox} from 'material-ui';
import '../style/voter.css';


class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueId: '',
      isLoggedIn: false,
      web3: null,
      storageValue: 0,
      contractInstance: null,
      voteHash: null,
      candidateName: 'Lenny',
      isVoteSubmitted: false,
      isBallotCompleted: false,

      // Need to replace the below vars with dynamic data
      ballotName: 'Election for Board of Trustees',
      ballotOption: [
        { optionName:'Mark Cuban',
          optionAnswer: false
        },
        { optionName:'Dwayne "The Rock" Johnson',
          optionAnswer: false
        },
        { optionName:'Oprah Winfrey',
          optionAnswer: false
        },
        { optionName:'Lenny',
          optionAnswer: false
        }
      ]
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
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

  instantiateContract() {
    const TestContract = contract(TestVote);
    TestContract.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts((error, accounts) => {
      TestContract.deployed().then((instance) => {
        this.setState({
          contractInstance: instance
        });
      });
    });
  }

  submitVote(candidate) {
    // Replace state variable with candidate param onclick
    let candidateName = this.state.candidateName;
    console.log(candidateName);
    var TestContractInstance;

    TestContractInstance = this.state.contractInstance;

    TestContractInstance.voteForCandidate(candidateName, {gas: 2800000, from: this.state.web3.eth.accounts[0]})
    .then((result) => {
      this.setState({
        voteHash: result.tx
      });
      return TestContractInstance.totalVotesFor.call(candidateName)
    }).then((voteCount) => {
      console.log(voteCount);
      this.setState({
        storageValue: voteCount.c[0],
        isVoteSubmitted: true
      });
    });
  }

  render() {
    let ballotInfo = this.state;
    let ballotQuestionList = ballotInfo.ballotOption.map((option, index) => {
      return (
        <div>
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
    });

    if(this.state.isVoteSubmitted === true) {
      return (
        <VoterResults
          ballotOption={this.state.ballotOption}
          ballotName={this.state.ballotName}
          voteHash={this.state.voteHash}
        />
      )
    } else {

      return (
        <div>
          <div className="header">VOTE PAGE</div>
          <form>
            <Card className="center">
              <div style={{fontSize: 16, minWidth: 400}}>
                <b>{ballotInfo.ballotName}</b><br/>
                <div>{ballotQuestionList}</div>
              </div>
              <br/>
              <RaisedButton
                label="Submit" onClick={this.submitVote}/>
            </Card>
          </form>
        </div>
      )
    }
  }
}

export default Vote;