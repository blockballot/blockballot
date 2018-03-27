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
import CSVReader from 'react-csv-reader';
import { BarLoader } from 'react-spinners';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog'

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.state = {
      ballotName: '',
      ballotOption: [{optionName:''}],
      calendar: false,
      start: null,
      end: null,
      dateTime: null,
      voterNumber: "4",
      emails: [],
      emailConfirmation: false,
      open: false,
      numVoters: 0,
      displayInfoCSV: false,
      voterDialogOpen: false,
      loading: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleErrorCSV = this.handleErrorCSV.bind(this);
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
    this.openVoterDialog = this.openVoterDialog.bind(this);
    this.closeVoterDialog = this.closeVoterDialog.bind(this);

  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }


  handleStartDateChange(event) {
    console.log(event)
    this.setState({
      start: event,
      calendar: true
    });
  }

  handleEndDateChange(event) {
    console.log(event)
    this.setState({
      end: event,
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
      ballotOption: this.state.ballotOption.concat([{ optionName: ''}])
    });
  }

  handleRemoveOption(event) {
    let removeIndex = Number(event.target.name);
    this.setState({
      ballotOption: this.state.ballotOption.filter((option, i) => removeIndex !== i)
    });
  }

  handleSubmit(event) {
    if (this.state.ballotName === '' || this.state.start === null || this.state.end === null) {
      this.setState({
        open: true
      });
      return;
    }

    event.preventDefault();
    this.setState({
      loading: true
    })

    $.ajax({
      type: 'POST',
      url: '/emailcodes',
      data: {emails: JSON.stringify(this.state.emails)},
      success: (res) => {
        this.setState({
          emailConfirmation: true,
          loading: false
        });
        console.log('emails successful')
      },
      error: (err) => {
        this.setState({
          loading: false
        });
        console.log('error sending emails');
      }
    })

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
    });
  }

  openVoterDialog() {
    this.setState({
      voterDialogOpen: true
    })
  }

  closeVoterDialog() {
    this.setState({
      voterDialogOpen: false
    })
  }

  handleErrorCSV() {
    console.log('csv upload failed')
  }

  handleUploadCSV(data) {
    this.setState({
      emails: data,
      numVoters: data.length,
      displayInfoCSV: true
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

    let csvInfo = null;
    if (this.state.displayInfoCSV === true) {
      csvInfo = (
        <div>
          <div>
            Total participants: {this.state.numVoters}
          </div>
          <div onClick = {this.openVoterDialog} style={{cursor: 'pointer', color: '#2284d1'}}>
            See Participants
          </div>
        </div>
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

    const dialogActions = [
      <FlatButton
        label="Close"
        onClick={this.closeVoterDialog}
        style={{color: '#2284d1'}}/>
    ]

    let emails = this.state.emails;
    let emailList = emails.map((email) =>
      <ul>{email}</ul>
    );

    let pollConfirmation = null;
    if (this.state.emailConfirmation === true) {
      pollConfirmation = (
        <div>
         Poll created! Your voters can check their inbox for a unique voting ID.
        </div>
      )
    }

    return (
      <div>
        <div className="header">Create Poll</div>
        {/*<section style={{ display: "flex", padding: 30}}>*/}
          <div style={{ flex: 1, padding: 5 }}>
          <Card style={{ padding: 30, margin: 15, marginBottom: 50 }}>
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
            </label>
            <br/>

            <label>
              {optionEntry}
              <RaisedButton
                label="Add Option Entry"
                onClick={this.handleAddOption}
               />
            </label>
            <br/><br/><br/>
            <b>POLL OPENING AND CLOSING TIME:</b>
            <br/>
                <DateTimePicker 
                  onChange={this.handleStartDateChange}
                  floatingLabelText="Enter poll opening time"
                  showCurrentDateByDefault={false}
                  DatePicker={DatePickerDialog}
                  TimePicker={TimePickerDialog}
                />
                <DateTimePicker 
                  onChange={this.handleEndDateChange}
                  floatingLabelText="Enter poll ending time"
                  showCurrentDateByDefault={false}
                  DatePicker={DatePickerDialog}
                  TimePicker={TimePickerDialog}
                />
            <CSVReader
              cssClass="csv-input"
              label="Upload a CSV file with voter emails."
              onFileLoaded={this.handleUploadCSV}
              onError={this.handleErrorCSV}
            />
            <br/>
            {csvInfo}
            <br/>
            <Dialog
              contentStyle={{width: 500, color: '#2284d1'}}
              title="Poll Participants"
              actions={dialogActions}
              modal={false}
              open={this.state.voterDialogOpen}
              onRequestClose={this.handleClose}>
              <div>{emailList}</div>
              <br/>
            </Dialog>
            {submitButton}
          </div>
          <br />
          <BarLoader
            color={'#2284d1'} 
            loading={this.state.loading}
            width={250} 
          />
          {pollConfirmation}
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

              </div>
              <div>
                <div>

                </div>
              </div>
              <br/>
            </div>
            </Card>
          </div>
        {/*</section>*/}
      </div>
    )
  }
}

export default CreatePoll;
