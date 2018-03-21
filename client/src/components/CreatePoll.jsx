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

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false,
      ballotName: '',
      ballotOption: [{optionName:'', optionAnswer:false}],
      start: {},
      end: {},
      voterAccess: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
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

  handleAddOption() {
    this.setState({ ballotOption: this.state.ballotOption.concat([{ optionName: '', optionAnswer:false }]) });
  }
  
  handleRemoveOption(idx) {
    this.setState({ ballotOption: this.state.ballotOption.filter((s, sidx) => idx !== sidx) });
  }
  
  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }


  render() {
    var date = this.state;
    var options = this.state.ballotOption.map((option, index) => (
      <div>
        <input
          type="text"
          placeholder="Enter your options"
          value={option.optionName}
          onChange={this.handleOptionChange}
          key={index}
        />
        <button type="button" onClick={this.handleRemoveOption}>Remove</button>
      </div>
    ))


    return (
      <div>
      <div>CreatePoll</div>
      <form>
        <label>
          Title:
          <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
        </label><br/>
 
        <label>
          Options: <br/>
          {options}  <br/>
          <button type="button" onClick={this.handleAddOption}>Add Option</button>
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
