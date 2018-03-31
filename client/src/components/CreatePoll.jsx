import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Card, TextField, Divider, RaisedButton, Dialog, FlatButton, RadioButtonGroup, RadioButton } from 'material-ui';
import cookie from 'react-cookie';
import $ from 'jquery';
import axios from 'axios';
import CSVReader from 'react-csv-reader';
import { BarLoader } from 'react-spinners';
import Loadable from 'react-loading-overlay';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import '../style/voter.css';
import {
  Button,
  Container,
  Header,
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


  componentWillMount() {
    if (localStorage.getItem('pollInfo')) {
      const localStoragePollInfo = JSON.parse(localStorage.getItem('pollInfo'));
      this.setState({
        ballotName: localStoragePollInfo.title,
        ballotOption: localStoragePollInfo.option,
        start: localStoragePollInfo.start,
        end: localStoragePollInfo.end,
      });
      localStorage.clear();
    }
    Moment.locale('en');
    momentLocalizer();
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

  handleVisitorSubmit() {
    const pollInfo = {
      title: this.state.ballotName,
      start: this.state.start,
      end: this.state.end,
      option: this.state.ballotOption,
    };
    localStorage.setItem('pollInfo', JSON.stringify(pollInfo));
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
    console.log(this.state.start);
    console.log(this.state.end);
    console.log(new Date())
    const actions = [
      <FlatButton label="Close" primary onClick={this.handleClose} />,
    ];

    let submitButton = null;
    if (cookie.load('loggedIn') === 'true') {
      submitButton = (
        <div>

          <Button
            primary
            attached="bottom"
            // type='submit'
            onClick={this.handleSubmit}
            backgroundColor="#2284d1"
          >
            Deploy
          </Button>
          <br />
          <BarLoader
            color="#2284d1"
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
      this.handleVisitorSubmit();
      submitButton = (
        <Link to="/signup">
          <Button
            primary
            attached="bottom"
            backgroundColor="#2284d1"
          >
            Deploy
          </Button>
        </Link>
      );
    }

    let csvInfo = null;
    if (this.state.displayInfoCSV === true) {
      csvInfo = (
        <div>
          <div>
            Total Participants: {this.state.numVoters}
          </div>
          <div
            onClick={this.openVoterDialog}
            style={{
              cursor: 'pointer',
              color: '#2284d1',
            }}
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
        <Button
          name={index}
          onClick={this.handleRemoveOption}
          style={{
            marginLeft: '30px',
          }}
        >x
        </Button>
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
          <section
            style={{
              display: 'flex',
              padding: 30,
            }}
          >
            <div
              style={{
                flex: 1,
                padding: 5,
              }}
            >
              <Loadable
                active={this.state.loaderActive}
                spinner
                text="We're creating your ballot"
              >
                <Card
                  style={{
                    padding: 30,
                    margin: 15,
                    marginBottom: 50,
                    backgroundColor: '#F0F8FF',
                    height: '425px',
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '22px',
                      marginBottom: '10%',
                    }}
                  >
                    {this.state.ballotName}
                  </div>
                  <br /><br />
                  <form
                    style={{
                      margin: '0 auto',
                      width: '300px',
                      fontSize: '18px',
                    }}
                  >
                    <div>
                      <RadioButtonGroup
                        name="voteoptions"
                        labelPosition="left"
                      >
                        {this.state.ballotOption.map((option, index) => (
                          <RadioButton
                            // style={{ marginButton:16, width:300 }}
                            iconStyle={{ fill: '#4183D9' }}
                            key={index}
                            label={`${option.optionName}`}
                          />
                          ))
                        }
                      </RadioButtonGroup>
                    </div>
                  </form>
                </Card>
              </Loadable>
            </div>
            <div
              style={{
                flex: 1,
                padding: 5,
                lineHeight: '1.7em',
              }}
            >
              <Card
                style={{
                  padding: 30,
                  margin: 15,
                  fontSize: '14px',
                  height: '425px',
                }}
              >
                <div>
                  <h3>Send Voter Codes</h3>
                  <p>While we are creating your ballot, please upload a CSV file containing the email of each voter who is participating in the vote. BlockBallot will generate and email a unique ID for each participant, which they can then use to securely access your ballot.
                  </p>
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
                  contentStyle={{
                    width: 500,
                    color: '#2284d1',
                  }}
                  title="Ballot Participants"
                  actions={dialogActions}
                  modal={false}
                  open={this.state.voterDialogOpen}
                  onRequestClose={this.handleClose}
                >
                  <div>{emailList}</div>
                  <br />
                </Dialog>
                <Button
                  primary
                  onClick={this.handleSendEmail}
                  disabled={this.state.sendVotesDisabled}
                >
                  Send Voter Codes
                </Button>
                <br /><br />
                <BarLoader
                  color="#2284d1"
                  loading={this.state.loading}
                  width={250}
                  fullWidth
                />
                {pollConfirmation}
              </Card>
            </div>
          </section>
        </div>
      );
    }
    return (
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div className="header">Create Your Ballot</div>
        <Segment
          attached
          raised
          style={{
            marginTop: 50,
            fontSize: 'large',
            padding: '5%',
          }}
        >
          <div className="ui two column grid" >
            <div className="column">
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

              <div style={{ marginTop: 72 }}>
                <b>2. Choose Start and End Times</b><br />
                <DateTimePicker
                  onSelect={this.handleStartDateChange}
                  name="start"
                  value={this.state.start}
                  onChange={this.handleInputChange}
                />
                <DateTimePicker
                  onSelect={this.handleEndDateChange}
                  name="end"
                  value={this.state.end}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="column">
              <b>3. Add Ballot Options</b><br />
              {optionEntry}

              <Button
                basic
                fluid
                style={{ marginTop: 20 }}
                onClick={this.handleAddOption}
              >
                Add Option
              </Button>
              <br />
              <div>
                <b>4. Review and Deploy</b><br />
                <p style={{
                    fontSize: 14,
                    marginTop: '5px',
                  }}
                >
                  If everything looks good, click 'deploy' to create a read-only contract containing your ballot. This will be saved to the Ethereum blockchain.
                </p>
              </div>
            </div>
          </div>
        </Segment>
        {submitButton}
      </div>
    );
  }
}

export default CreatePoll;
