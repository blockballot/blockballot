import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, TextField, Divider, RaisedButton } from 'material-ui';
import '../style/voter.css';

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
      calendar: false,
      start: {},
      end: {},
      voterNumber: "4",
      isDemoClicked: false,
      demoAccessId: ["123-45-678", "453-67-908", "923-65-358", "093-89-435"]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleVoterNumberSubmit = this.handleVoterNumberSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleStartDateChange(event) {
    this.setState({
      start: event._d,
      calendar: true
    });
  }

  handleEndDateChange(event) {
    this.setState({
      end: event._d,
      calendar: true
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

  handleVoterNumberSubmit(event) {
    event.preventDefault();
    this.setState({ 
      isDemoClicked: true
    });
 
  }
  
  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    let optionEntry = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        <TextField 
          id="option"
          type="text"
          placeholder="Enter your options"
          name={index}
          value={option.optionName}
          onChange={this.handleOptionChange}
        />
        <input 
          type="button"
          style={{color: "red"}} 
          name={index} 
          value="x" 
          onClick={this.handleRemoveOption} 
        />
      </div>
    ))

    let option = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        {option.optionName}
      </div>
    ))

    let time = ( this.state.calendar) ? (
                <div>
                  <b>Poll Opening and Closing Time: </b><br/>
                  Opening: {this.state.start.toString()} <br/>
                  Closing: {this.state.end.toString()}
                  <Divider />
                </div>
                ) : (
                <div></div>
                )


    /* for demo */
    let isDemoClicked = this.state.isDemoClicked
    let uniqueId = isDemoClicked ? (this.state.demoAccessId.map((id, index) => (
        <div key={index}>
          ID-{index}: {id}
        </div>
      ))) : (
        <div>
          
        </div>
      );
  
    return (
      <div>

        <div className="header">CreatePoll</div>
        <section style={{ display: "flex", padding: 30}}>
          <div style={{ flex: 1, padding: 5 }}> 
          <Card style={{ padding: 30 }}>
          <div>
            <label>
              <b>TITLE:</b> <br/>
              <TextField 
                id="title"
                type="text" 
                name="title" 
                placeholder="Enter title"
                value={this.state.title} 
                onChange={this.handleInputChange} 
              />
            </label><br/>
              
            <label>
              <b>OPTIONS:</b> <br/>
              {optionEntry}
              <RaisedButton 
                label="Add Option Entry"  
                onClick={this.handleAddOption} 
               />
            </label><br/>
              <br/><br/>
              <b>
              POLL OPENING AND CLOSING TIME:
              </b>
              <br/><br/>
            <label>
              OPENING:
                <DatePicker
                    placeholderText="Click to select a date"
                    selected={moment(this.state.start)}
                    onChange={this.handleStartDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="LLL"
                    timeCaption="time"
                />
            </label><br/>  
            <label>
              CLOSING:
                <DatePicker
                    placeholderText="Click to select a date"
                    selected={moment(this.state.end)}
                    onChange={this.handleEndDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="LLL"
                    timeCaption="time"
                /><br/>
            </label>
            {/* <label>
              voter access:
              <input type="text" name="voterAccess" value={this.state.voterAccess} onChange={this.handleInputChange}/>
            </label><br/> */}

            <label><br/>
            <b>UNIQUE CODES:</b> <br/>
              <TextField 
                id="Unique"
                type="text" 
                name="voterNumber" 
                floatingLabelText="Enter number of voters" 
                value={this.state.voterNumber} 
                onChange={this.handleInputChange} 
              />
            </label><br/>
            <RaisedButton 
              type="submit" 
              label="Get Unique Codes" 
              onClick={this.handleVoterNumberSubmit} 
            /><br/>
            <br/>
            <RaisedButton 
              style={{ backgroundColor: "navy" }}
              type="submit" 
              label="Create Poll" 
              onClick={this.handleSubmit} 
            />
          </div>
          </Card>
        </div>

        <div style={{ flex: 1, padding: 5, lineHeight: "1.7em" }}>
          <Card style={{ padding: 30, minHeight: "627px", fontSize: "14px"}}>
            <div style={{ textAlign: "center", marginBottom: "30px"}}>
              <b>{this.state.title}</b>
            </div>  


            <div style={{ marginBottom: "30px"}}>
              {option}
            </div>
            <Divider />
            <div>
              <div>
                {time}
              </div>

              <div>
                {uniqueId}
              </div>
            </div>

            <br/>
          </Card>
        </div>
        </section>
    </div>
    )
  }
}

export default CreatePoll;
