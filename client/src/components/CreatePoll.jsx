import React from 'react';
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import TestVote from '../../../build/contracts/TestVote.json';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const style = {
  marginRight: 20,
};

const Vote = contract(TestVote);

let candidates = ['Norbie', 'Evaline', 'Paula', 'Michael'];

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.submitVote = this.submitVote.bind(this);
  }

  componentWillMount() {
    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like Metamask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  Vote.setProvider(web3.currentProvider);
  }

  submitVote(candidate) {
    let candidateName = "Evaline";
    console.log(Vote);
    try {
      console.log('Vote has been submitted');

      /* Voting.deployed() returns an instance of the contract. Every call
       * in Truffle returns a promise which is why we have used then()
       * everywhere we have a transaction call
       */
      Vote.deployed().then((contractInstance) => {
        contractInstance.voteForCandidate(candidateName, {gas: 2800000, from: web3.eth.accounts[0]})
        .then(() => {
          console.log(candidateName)
          return contractInstance.totalVotesFor.call(candidateName)
          .then((voteCount) => {
            console.log(voteCount);
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <FloatingActionButton
        style={style}
        onClick={this.submitVote}
      >
        <ContentAdd />
      </FloatingActionButton>
    )
  }

}

export default CreatePoll;
