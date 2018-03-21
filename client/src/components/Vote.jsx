import React from 'react';
import axios from 'axios';
import { default as Web3} from 'web3';
import getWeb3 from '../../../helpers/getWeb3.js';
import contract from 'truffle-contract';
import VoteResults from './VoterResults.jsx';
import TestVote from '../../../build/contracts/TestVote.json';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { RaisedButton, Checkbox} from 'material-ui';
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
      candidateName: 'Evaline',
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
      this.setState({storageValue: voteCount.c[0]})
    });
  }

  render() {
    let ballotInfo = this.state;
    let ballotQuestionList = ballotInfo.ballotOption.map((option, index) => {
      return  <Checkbox className="checkbox" labelPosition="left" key={index} label={option.optionName} checked={option.optionAnswer} onCheck={this.updateCheck} name={option.optionName}/>
    })

    if(this.state.isVoteSubmitted === true) {
      return (
        <VoteResults ballotOption={this.state.ballotOption} ballotName= {this.state.ballotName} />
      )
    } else {
      return (
        <form id="voteForm">
          <label>
            <div>VOTE PAGE</div>
            <div>{ballotInfo.ballotName}</div>
            <div className="block" >{ballotQuestionList}</div>
          </label>
          <RaisedButton label="Submit" onClick={this.submitVote} />
        </form>
      )
    }
  }
}

export default Vote;