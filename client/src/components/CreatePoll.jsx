import React from 'react';
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import Voting from '../../../build/contracts/Voting.json';
import TestVote from '../../../build/contracts/TestVote.json';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react';

// let { DateTimePicker } = ReactWidgets
// const style = {
//   marginRight: 20,
// };

// const RamaContract = contract(Voting);
// const EvContract = contract(TestVote);

// let candidates = ['Norbie', 'Evaline', 'Paula', 'Michael'];

// class CreatePoll extends React.Component {
//   constructor() {
//     super();
//     this.submitVote = this.submitVote.bind(this);
//     this.submitVote2 = this.submitVote2.bind(this);
//   }

//   componentWillMount() {
//     if (typeof web3 !== 'undefined') {
//       console.warn("Using web3 detected from external source like Metamask")
//       // Use Mist/MetaMask's provider
//       window.web3 = new Web3(web3.currentProvider);
//     } else {
//       console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
//     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
//       window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//   }
//   RamaContract.setProvider(web3.currentProvider);
//   EvContract.setProvider(web3.currentProvider);
//   }

//   submitVote(candidate) {
//     let candidateName = "Evaline";
//     try {
//       console.log('Vote has been submitted');

//       /* Voting.deployed() returns an instance of the contract. Every call
//        * in Truffle returns a promise which is why we have used then()
//        * everywhere we have a transaction call
//        */
//       EvContract.deployed().then((contractInstance) => {
//         contractInstance.voteForCandidate(candidateName, {gas: 2800000, from: web3.eth.accounts[0]})
//         .then(() => {
//           console.log(candidateName)
//           return contractInstance.totalVotesFor.call(candidateName)
//           .then((voteCount) => {
//             console.log(voteCount);
//           });
//         });
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }


//   submitVote2(candidate) {
//     let candidateName = "Rama";
//     try {
//       console.log('Vote has been submitted');

//       /* Voting.deployed() returns an instance of the contract. Every call
//        * in Truffle returns a promise which is why we have used then()
//        * everywhere we have a transaction call
//        */
//       RamaContract.deployed().then((contractInstance) => {
//         contractInstance.voteForCandidate(candidateName, {gas: 2800000, from: web3.eth.accounts[0]})
//         .then(() => {
//           console.log(candidateName)
//           return contractInstance.totalVotesFor.call(candidateName)
//           .then((voteCount) => {
//             console.log(voteCount);
//           });
//         });
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   render() {
//     return (
//       <div>
//       <FloatingActionButton
//         style={style}
//         onClick={this.submitVote}
//       >
//         <ContentAdd />
//       </FloatingActionButton>
//       <FloatingActionButton
//         style={style}
//         onClick={this.submitVote2}
//       >
//         <ContentAdd />
//       </FloatingActionButton>
//       </div>
//     )
//   }
// }

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false,
      title: '',
      options: '',
      start: {},
      end: {},
      voterAccess: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
  }


  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleStartDate(event) {
    this.setState({
      start: event._d
    });
  }

  handleEndDate(event) {
      this.setState({
        end: event._d
      });
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    var date = this.state;
    return (
      <div>
      <div>CreatePoll</div>
      <form>
        <label>
          Title:
          <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
        </label><br/>
 
        <label>
          Options:
          <input type="text" name="options" value={this.state.options} onChange={this.handleChange}/>
        </label><br/>

         <label>
          start:
            <DatePicker
                placeholderText="Click to select a date"
                onChange={this.handleStartDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL"
                timeCaption="time"
                withPortal
            /><br/>
            {date.start.toString()}
        </label><br/>
          
        <label>
          end:
            <DatePicker
                placeholderText="Click to select a date"
                onChange={this.handleEndDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL"
                timeCaption="time"
                withPortal
            /><br/>
              {date.end.toString()}
        </label><br/>

        {/* <label>
          voter access:
          <input type="text" name="voterAccess" value={this.state.voterAccess} onChange={this.handleChange}/>
        </label><br/> */}

        <input label="Launch" type="submit" value="Submit" onClick={this.handleSubmit} />
      </form>
    </div>
    )
  }
}

export default CreatePoll;
