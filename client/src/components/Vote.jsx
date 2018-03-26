import React from 'react';
import axios from 'axios';
import { default as Web3} from 'web3';
import getWeb3 from '../../../helpers/getWeb3.js';
import contract from 'truffle-contract';
import VoterResults from './VoterResults.jsx';
import TestVote from '../../../build/contracts/TestVote.json';
import { Divider, Card, RaisedButton, Checkbox, RadioButton, RadioButtonGroup} from 'material-ui';
import '../style/voter.css';

class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      web3: null,
      storageValue: 0,
      contractInstance: null,
      voteHash: 'ssss',
      isVoteSubmitted: false,
      isBallotCompleted: false,
      selectedOption: '',
      candidateName: 'norbie',
      ballotName: '',
      ballotOption: []
    };
    this.updateCheck = this.updateCheck.bind(this);
    this.submitVote = this.submitVote.bind(this);
  }

  componentWillMount() {
    console.log('call getweb3')
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

    var option = this;
    axios({
      method: 'POST',
      url: '/api/poll',
      data: { 
        pollId: this.props.pollId
      }
    })
    .then(function (res) {
      var options = res.data.map(function(element) {
        return element
      });
      var name = res.data[0].poll.pollName;
      option.setState({
        ballotName: name,
        ballotOption: options,
        selectedOption: options[0].id
      });
    })
    .catch(function (error) {      
      voter.setState({
        errorText: "Your unique code is incorrect. Please, try again"
      });
    });
  }

  instantiateContract() {
    const TestContract = contract(TestVote);  //how did we get the testvote?  did it auto compiled from the contract?
    console.log(TestContract)
    TestContract.setProvider(this.state.web3.currentProvider); // current provider
  
    this.state.web3.eth.getAccounts((error, accounts) => {
      TestContract.deployed().then((instance) => {
        this.setState({
          contractInstance: instance
        });
      });
    });
  }

  updateCheck(event) {
    var eventValue = event.target.value.split('.')
    this.setState({
      selectedOption: eventValue[0],
      candidateName: eventValue[1]
    });
  }

  submitVote(candidate) {
    // Replace state variable with candidate param onclick
    // let candidateName = this.state.candidateName;
    // console.log(candidateName);
    // var TestContractInstance;

    // TestContractInstance = this.state.contractInstance;
    // TestContractInstance.voteForCandidate(candidateName, {gas: 2800000, from: this.state.web3.eth.accounts[0]})
    // .then((result) => {
    //   var voted = this;
    //   this.setState({
    //     voteHash: result.tx
    //   }
    // );
    // return TestContractInstance.totalVotesFor.call(candidateName)
    // }).then((voteCount) => {
    //   console.log(voteCount);
    //   this.setState({
    //     storageValue: voteCount.c[0],
    //     isVoteSubmitted: true
    //   });
    // });

    //need to add to the testcontract instance
    var voted = this;
    axios({
      method: 'POST',
      url: '/api/voteresult',
      data: {
        voted: Number(voted.state.selectedOption),
        voteHash: voted.state.voteHash
      }
    })
    .then(function (res) {
      console.log(res)
      console.log('vote has been submitted')
      voted.setState({
        isVoteSubmitted: true
      });
    })
    .catch(function (error) {
      console.log(error)
    });
  }



  render() {
    console.log(this.state.web3)
    // console.log(this.state.selectedOption)
    // console.log(this.state.candidateName)


    let ballotInfo = this.state;
    let ballotQuestionList = ballotInfo.ballotOption.map((option, index) => {
      return (
        <RadioButton
          style={{ marginButton: 16 }}
          key={index}
          label={option.id + ": " + option.optionName}
          value={option.id + "." + option.optionName}
        />
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
          <div className="header">{ballotInfo.ballotName}</div>
          <form>
            <Card className="center">
              <div style={{fontSize: 16, minWidth: 400}}>
                <RadioButtonGroup name="voteoptions" labelPosition="left" valueSelected={this.state.selectedOption + "." + this.state.candidateName} onChange={this.updateCheck}>
                  {ballotQuestionList}
                </RadioButtonGroup>
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