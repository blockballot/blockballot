import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, TextField, Divider, RaisedButton, Dialog, FlatButton } from 'material-ui';
import '../style/voter.css';
import { Redirect, Link } from 'react-router-dom';
import cookie from 'react-cookie';
import $ from 'jquery';
import axios from 'axios';

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
      demoAccessId: ["123-45-678", "453-67-908", "923-65-358", "093-89-435"],
      emails: [],
      emailConfirmation: false,
      open: false

    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendEmailCodes = this.sendEmailCodes.bind(this);
    this.handleVoterNumberSubmit = this.handleVoterNumberSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    if (this.state.ballotName === '' || Object.keys(this.state.start).length === 0 || Object.keys(this.state.end).length === 0) {
      this.setState({
        open: true
      });
      return;
    }     
    event.preventDefault();
    let options = [];
    for (var i = 0; i < this.state.ballotOption.length; i++) {
      var optName = this.state.ballotOption[i].optionName;
      if (optName !== "") {
        options.push(optName);
      }
    }
    console.log('Sending contract to get mined');
    axios.post('/contract', {
      options: options
    })
    .then(contractRes => {
      console.log(contractRes);
      console.log('Contract mined, updating database');
      let contractInfo = {
        pollName: this.state.ballotName,
        pollStart: this.state.start,
        pollEnd: this.state.end,
        pollOptions: options,
        pollAddress: contractRes.data.address
      }
      return axios.post('/poll', contractInfo);
    })
    .then(pollRes => {
      console.log(pollRes)
    })
    .catch(err =>  {
      console.log(err);
    })
  }

  handleClose() {
    this.setState({
      open: false
    });
  };

  sendEmailCodes() {
    // this.setState({
    //   loading: true
    // })
    $.ajax({
      type: 'POST',
      url: '/emailcodes',
      data: {emails: this.state.emails},
      success: (res) => {
        // this.setState({
        //   emailConfirmation: true,
        //   loading: false
        // });
        console.log('emails successful')
      },
      error: (err) => {
        console.log('error');
      }
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    let submitButton = null;
    if (cookie.load('loggedIn') === 'true') {
      submitButton = (
        <div>
          <RaisedButton 
            style={{ backgroundColor: "navy" }}
            type="submit" 
            label="Create Poll" 
            onClick={this.handleSubmit}/>
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
          Please fill out all required fields
          </Dialog>
        </div>
      )
    } else {
      submitButton = (
        <Link to='/signup'>
          <RaisedButton 
            style={{ backgroundColor: "navy" }}
            type="submit" 
            label="Create Poll"/>
        </Link>
      )
    }
    
    let optionEntry = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        <TextField
          id="option"
          type="text"
          floatingLabelText="Enter poll options"
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
        <div className="header">Create Poll</div>
        <section style={{ display: "flex", padding: 30}}>
          <div style={{ flex: 1, padding: 5 }}>
          <Card style={{ padding: 30 }}>
          <div>
            <label>
              <TextField
                id="title"
                type="text" 
                name="ballotName" 
                floatingLabelText="Enter poll title"
                value={this.state.ballotName} 
                onChange={this.handleInputChange} 
              />
            </label><br/>

            <label>
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
            <RaisedButton
              label="Send Codes"
              onClick={this.sendEmailCodes}
            />
            <br/>
            {submitButton}
          </div>
          </Card>
        </div>

        <div style={{ flex: 1, padding: 5, lineHeight: "1.7em" }}>
          <Card style={{ padding: 30, minHeight: "627px", fontSize: "14px"}}>
            <div style={{ textAlign: "center", marginBottom: "30px"}}>
              <b>{this.state.ballotName}</b>
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
