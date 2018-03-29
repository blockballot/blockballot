import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Card, TextField, Divider, RaisedButton, Dialog, FlatButton, RadioButtonGroup, RadioButton} from 'material-ui';
import moment from 'moment';
import cookie from 'react-cookie';
import $ from 'jquery';
import axios from 'axios';
import CSVReader from 'react-csv-reader';
import { BarLoader } from 'react-spinners';
import DateTimePicker from 'material-ui-datetimepicker';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog';
import Loadable from 'react-loading-overlay';
import '../style/voter.css';
import {
  Button,
  Container,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react';

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.state = {
      ballotName: '',
      ballotOption: [{ optionName: '' }, { optionName: '' }],
      start: null,
      end: null,
      dateTime: null,
      voterNumber: '4',
      emails: [],
      emailConfirmation: false,
      open: false,
      numVoters: 0,
      displayInfoCSV: false,
      voterDialogOpen: false,
      loading: false,
      isSubmitted: false,
      pollId: 0,
      loaderActive: true,
      sendVotesDisabled: true,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);
    this.handleRemoveOption = this.handleRemoveOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendEmail = this.handleSendEmail.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleErrorCSV = this.handleErrorCSV.bind(this);
    this.handleUploadCSV = this.handleUploadCSV.bind(this);
    this.openVoterDialog = this.openVoterDialog.bind(this);
    this.closeVoterDialog = this.closeVoterDialog.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleStartDateChange(event) {
    console.log(event);
    this.setState({
      start: event,
    });
  }

  handleEndDateChange(event) {
    console.log(event);
    this.setState({
      end: event,
    });
  }

  handleOptionChange(event) {
    const matchIndex = Number(event.target.name);
    const newballotOption = this.state.ballotOption.map((option, index) => {
      if (matchIndex === index) {
        option.optionName = event.target.value;
      }
    });
    this.setState({
      balletOption: newballotOption,
    });
  }

  handleAddOption() {
    this.setState({
      ballotOption: this.state.ballotOption.concat([{ optionName: '' }]),
    });
  }

  handleRemoveOption(event) {
    const removeIndex = Number(event.target.name);
    this.setState({
      ballotOption: this.state.ballotOption.filter((option, i) => removeIndex !== i),
    });
  }

  handleSubmit(event) {
    if (this.state.ballotName === '' || this.state.start === null || this.state.end === null || this.state.ballotOption.length < 2) {
      this.setState({
        open: true,
      });
      return;
    }

    event.preventDefault();

    const options = [];
    for (let i = 0; i < this.state.ballotOption.length; i++) {
      const optName = this.state.ballotOption[i].optionName;
      if (optName !== '') {
        options.push(optName);
      }
    }
    console.log('Sending contract to get mined');
    axios.post('/contract', {
      options,
    })
      .then((contractRes) => {
        console.log(contractRes);
        console.log('Contract mined, updating database');
        const contractInfo = {
          pollName: this.state.ballotName,
          pollStart: this.state.start,
          pollEnd: this.state.end,
          pollOptions: options,
          pollAddress: contractRes.data.address,
        };
        return axios.post('/poll', contractInfo);
      })
      .then((pollRes) => {
        console.log('poll result', pollRes);
        this.setState({
          pollId: pollRes.data[0].pollId,
          loaderActive: false,
          sendVotesDisabled: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.setState({
      isSubmitted: true,
    });
  }

  handleSendEmail() {
    this.setState({
      loading: true,
    });
    axios.post('/emailcodes', {
      emails: JSON.stringify(this.state.emails),
      pollId: this.state.pollId,
    }).then((res) => {
      console.log('RES', res);
      if (res.status === 201) {
        this.setState({
          emailConfirmation: true,
          loading: false,
        });
        console.log('emails successful');
      }
    }).catch((err) => {
      this.setState({
        loading: false,
      });
      console.log('error sending emails');
    });
  }

  handleClose() {
    this.setState({
      open: false,
    });
  }

  openVoterDialog() {
    this.setState({
      voterDialogOpen: true,
    });
  }

  closeVoterDialog() {
    this.setState({
      voterDialogOpen: false,
    });
  }

  handleErrorCSV() {
    console.log('csv upload failed');
  }

  handleUploadCSV(data) {
    this.setState({
      emails: data,
      numVoters: data.length,
      displayInfoCSV: true,
    });
  }

  render() {
    const actions = [
      <FlatButton label="Close" primary onClick={this.handleClose} />,
    ];

    let submitButton = null;
    if (cookie.load('loggedIn') === 'true') {
      submitButton = (
        <div>
          <RaisedButton
            type='submit'
            label='Deploy'
            onClick={this.handleSubmit}
            backgroundColor={'#2284d1'}
            labelColor={'white'}
          />
          <br />
          <BarLoader
            color="22#84d1"
            loading={this.state.loading}
            width={250}
          />
          <Dialog
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            Please fill out all required fields
          </Dialog>
        </div>
      );
    } else {
      submitButton = (
        <Link to="/signup">
          <RaisedButton
            type="submit"
            label="Create Ballot"
            backgroundColor={'#2284d1'}
            labelColor={'white'}
          />
        </Link>
      );
    }

    let csvInfo = null;
    if (this.state.displayInfoCSV === true) {
      csvInfo = (
        <div>
          <div>
            Total participants: {this.state.numVoters}
          </div>
          <div
            onClick={this.openVoterDialog}
            style={{ cursor: 'pointer', color: '#2284d1' }}
          >
            See Participants
          </div>
        </div>
      );
    }

    const optionEntry = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        <TextField
          id="option"
          type="text"
          name={index}
          value={option.optionName}
          underlineFocusStyle={{ borderBottomColor: '#2284d1' }}
          onChange={this.handleOptionChange}
        />
        <input
          type="button"
          name={index}
          value="x"
          onClick={this.handleRemoveOption}
        />
      </div>
    ));

    const option = this.state.ballotOption.map((option, index) => (
      <div key={index}>
        {option.optionName}
      </div>
    ));

    const dialogActions = [
      <FlatButton
        label="Close"
        onClick={this.closeVoterDialog}
        style={{ color: '#2284d1' }}
      />,
    ];

    const emails = this.state.emails;
    const emailList = emails.map((email, index) =>
      <ul key={index}>{email}</ul>);

    let pollConfirmation = null;
    if (this.state.emailConfirmation === true) {
      pollConfirmation = (
        <div>
          Ballot created! Your voters can check their inbox for a unique voting ID.
        </div>
      );
    }

    if (this.state.isSubmitted) {
      return (
        <div>
          <div className="header">Confirm and Send</div>
          <section style={{ display: 'flex', padding: 30 }}>
            <div style={{ flex: 1, padding: 5 }}>
              <Loadable
                active={this.state.loaderActive}
                spinner
                text="We're creating your ballot"
              >
                <Card style={{ padding: 30, margin: 15, marginBottom: 50 }} >
                  <div>
                    <div className="header">{this.state.ballotName}</div>
                    <br /><br /><br /><br />
                    <form>
                      <div style={{ fontSize: 16, minWidth: 400 }}>
                        <RadioButtonGroup name="voteoptions" labelPosition="left">
                          {this.state.ballotOption.map((option, index) => (
                            <RadioButton
                              style={{ marginButton: 16, width: 300 }}
                              key={index}
                              label={`${option.optionName}`}
                            />
                            ))
                          }
                        </RadioButtonGroup>
                      </div>
                      <br />
                      <RaisedButton label="Submit" disabled />

                    </form>
                  </div>
                </Card>
              </Loadable>
            </div>
            <div style={{ flex: 1, padding: 5, lineHeight: '1.7em' }}>
              <Card style={{ padding: 30, margin: 15, minHeight: '296px', fontSize: '14px' }}
              >
                <div>
                While we're creating your ballot, upload a CSV of voter emails. <br /> You'll be able to send after the ballot is created.
                </div>
                <CSVReader
                  cssClass="csv-input"
                  onFileLoaded={this.handleUploadCSV}
                  onError={this.handleErrorCSV}
                />
                <br />
                {csvInfo}
                <br />
                <Dialog
                  contentStyle={{ width: 500, color: '#2284d1' }}
                  title="Ballot Participants"
                  actions={dialogActions}
                  modal={false}
                  open={this.state.voterDialogOpen}
                  onRequestClose={this.handleClose}
                >
                  <div>{emailList}</div>
                  <br />
                </Dialog>
                <RaisedButton
                  label="Send Voter Codes"
                  onClick={this.handleSendEmail}
                  disabled={this.state.sendVotesDisabled}
                />
                <br /><br />
                <BarLoader
                  color="#2284d1"
                  loading={this.state.loading}
                  width={250}
                />
                {pollConfirmation}
              </Card>
            </div>
          </section>
        </div>
      );
    }
    return (
      <div>
        <div className="header" >Create Your Ballot</div>
        <div class = "ui raised padded text container segment" style={{border: 'solid', borderColor: '#D3D3D3', borderWidth: 1, marginBottom: 200, marginTop: 50, fontSize: 'large'}}>
        <div class="ui two column grid" >
          <div class="column">
            <div>
              <b>1. Title Your Ballot</b>
            </div>
            <div>
              <TextField
                id="title"
                type="text"
                name="ballotName"
                value={this.state.ballotName}
                onChange={this.handleInputChange}
                underlineFocusStyle={{ borderBottomColor: '#2284d1' }}
              />
            </div>

            <div style={{marginTop: 72}}>
              <b>2. Choose Start and End Times</b><br />
              <DateTimePicker
                onChange={this.handleStartDateChange}
                showCurrentDateByDefault={false}
                DatePicker={DatePickerDialog}
                TimePicker={TimePickerDialog}
                underlineFocusStyle={{ borderBottomColor: '#2284d1' }}
                clearIcon={null}
              />
              <DateTimePicker
                onChange={this.handleEndDateChange}
                showCurrentDateByDefault={false}
                DatePicker={DatePickerDialog}
                TimePicker={TimePickerDialog}
                underlineFocusStyle={{ borderBottomColor: '#2284d1' }}
                clearIcon={null}

              />
            </div>
          </div>
          
          <div class="column">
            <b>3. Add Ballot Options</b><br />
            {optionEntry}

            <Button
              style={{marginTop: 20}}
              label="Add Options"
              onClick={this.handleAddOption}
            />
          </div>

          <div class="centered row">
            <div style={{marginTop: 50}}>
              {submitButton}
            </div>
          </div>

    
            {/*<Card style={{ padding: 30, margin: 15, marginBottom: 50 }}>
              <CardText>
              <Grid container spacing={8}>
                
                <Grid>
                  <b>1. Ballot Title</b>
                  <TextField
                    id="title"
                    type="text"
                    name="ballotName"
                    value={this.state.ballotName}
                    onChange={this.handleInputChange}
                    underlineStyle={{ borderBottomColor: '#2284d1' }}
                  />
                </Grid>

                <Grid>
                  <b>3. Define Start and End Times</b><br />
                  <DateTimePicker
                    onChange={this.handleStartDateChange}
                    showCurrentDateByDefault={false}
                    DatePicker={DatePickerDialog}
                    TimePicker={TimePickerDialog}
                    underlineStyle={{ borderBottomColor: '#2284d1' }}
                  />
                  <DateTimePicker
                    onChange={this.handleEndDateChange}
                    showCurrentDateByDefault={false}
                    DatePicker={DatePickerDialog}
                    TimePicker={TimePickerDialog}
                    underlineStyle={{ borderBottomColor: '#2284d1' }}
                  />
                </Grid>
                
              </Grid>
              <Grid className="row">
                <div className="col-md-1">
                  <b>2. Add Ballot Options</b><br />
                  {optionEntry}
                  <Button
                    label="Add Ballot Options"
                    onClick={this.handleAddOption}
                  />
                </div>

                <div className="col-md-1">
                  <b>4. Create Your Ballot</b><br />

                  {submitButton}
                </div>
              </Grid>


              </CardText>
            </Card>
          </div>*/}
        </div>
       </div>
      </div>
    );
  }
}

export default CreatePoll;
