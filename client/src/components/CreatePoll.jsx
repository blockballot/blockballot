import React from 'react';
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
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleStartDateChange(event) {
    this.setState({
      start: event._d
    });
  }

  handleEndDateChange(event) {
    this.setState({
      end: event._d
    });
  }

  handleOptionChange(event) {
    let matchIndex = Number(event.target.name)
    let newballotOption = this.state.ballotOption.map((option, index) => {
      if(matchIndex === index) {
        option.optionName = event.target.value;
      }
    });
    this.setState({
      balletOption: newballotOption
    });
  }

  handleAddOption() {
    this.setState({ 
      ballotOption: this.state.ballotOption.concat([{ optionName: '', optionAnswer:false }]) 
    });
  }
  
  handleRemoveOption(event) {
    let removeIndex = Number(event.target.name);
    this.setState({ 
      ballotOption: this.state.ballotOption.filter((option, i) => removeIndex !== i) 
    });
  }
  
  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    let optionEntry = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        <input
          type="text"
          placeholder="Enter your options"
          name={index}
          value={option.optionName}
          onChange={this.handleOptionChange}
        />
        <input type="button" name={index} value="remove" onClick={this.handleRemoveOption} />
      </div>
    ))

    var option = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        {option.optionName}
      </div>
    ))

    return (
      <div>
      <div>CreatePoll</div>
      <form>
        <label>
          Title:
          <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} />
        </label><br/>
        <label>
          Options: <br/>
          {optionEntry}  <br/>
          <button type="button" onClick={this.handleAddOption}>Add Option</button>
        </label><br/>
          {option}

        <label>
          start:
            <DatePicker
                placeholderText="Click to select a date"
                selected={moment(this.state.start)}
                onChange={this.handleStartDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL"
                timeCaption="time"
                withPortal
            /><br/>
            {this.state.start.toString()}
        </label><br/>  
        <label>
          end:
            <DatePicker
                placeholderText="Click to select a date"
                selected={moment(this.state.end)}
                onChange={this.handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="LLL"
                timeCaption="time"
                withPortal
            /><br/>
              {this.state.end.toString()}
        </label><br/>
        {/* <label>
          voter access:
          <input type="text" name="voterAccess" value={this.state.voterAccess} onChange={this.handleInputChange}/>
        </label><br/> */}
        <input label="Launch" type="submit" value="Submit" onClick={this.handleSubmit} />
      </form>
    </div>
    )
  }
}

export default CreatePoll;
