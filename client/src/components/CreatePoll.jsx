import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Segment } from 'semantic-ui-react';
import cookie from 'react-cookie';
import axios from 'axios';
import CSVReader from 'react-csv-reader';
import { BarLoader } from 'react-spinners';
import Loadable from 'react-loading-overlay';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import {
  Card,
  TextField,
  Dialog,
  FlatButton,
  RadioButtonGroup,
  RadioButton,
  CardMedia,
  CardTitle
} from 'material-ui';
import '../style/voter.css';

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.state = {
      ballotName: '',
      ballotOption: [{ optionName: '' }, { optionName: '' }],
      start: null,
      end: null,
      startNow: false,
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
      pollError: false,
      csvError: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartNow = this.handleStartNow.bind(this);
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
        ballotOption: localStoragePollInfo.option
      });
      localStorage.clear();
    }
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleStartDateChange(event) {
    this.setState({
      start: event
    });
  }

  handleEndDateChange(event) {
    this.setState({
      end: event
    });
  }

  handleStartNow() {
    this.setState({
      startNow: !this.state.startNow,
      active: !this.state.active,
      start: null,
      end: null
    });
  }

  handleOptionChange(event) {
    const matchIndex = Number(event.target.name);
    const newballotOption = this.state.ballotOption.forEach((option, index) => {
      if (matchIndex === index) {
        option.optionName = event.target.value;
      }
    });
    this.setState({
      balletOption: newballotOption
    });
  }

  handleAddOption() {
    this.setState({
      ballotOption: this.state.ballotOption.concat([{ optionName: '' }])
    });
  }

  handleRemoveOption(event) {
    const removeIndex = Number(event.target.name);
    this.setState({
      ballotOption: this.state.ballotOption.filter((option, i) => removeIndex !== i)
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const startTime = this.state.start;
    const endTime = this.state.end;
    const options = [];
    for (let i = 0; i < this.state.ballotOption.length; i++) {
      const optName = this.state.ballotOption[i].optionName;
      if (optName !== '') {
        options.push(optName);
      }
    }
    if (this.state.ballotName === '' || options.length < 2) {
      this.setState({
        open: true
      });
      return;
    }
    if (this.state.startNow === false) {
      if (startTime === null || startTime === null || startTime.getTime() >= endTime.getTime()) {
        this.setState({
          open: true
        });
        return;
      }
    }
    console.log('Sending contract to get mined');
    axios.post('/contract', { options })
      .then((contractRes) => {
        console.log('Contract mined, updating database');
        const contractInfo = {
          pollName: this.state.ballotName,
          pollStart: this.state.start,
          pollEnd: this.state.end,
          pollOptions: options,
          pollAddress: contractRes.data.address
        };
        return axios.post('/polls', contractInfo);
      })
      .then((pollRes) => {
        this.setState({
          pollId: pollRes.data[0].pollId,
          loaderActive: false,
          sendVotesDisabled: false
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loaderActive: false,
          pollError: true
        });
      });

    this.setState({
      isSubmitted: true
    });
  }

  handleVisitorSubmit() {
    const pollInfo = {
      title: this.state.ballotName,
      start: this.state.start,
      end: this.state.end,
      option: this.state.ballotOption
    };
    localStorage.setItem('pollInfo', JSON.stringify(pollInfo));
  }

  handleSendEmail() {
    const orgName = (cookie.load('username'));
    this.setState({
      loading: true,
      emailSendError: false
    });
    axios.post('/emailcodes', {
      emails: JSON.stringify(this.state.emails),
      pollId: this.state.pollId,
      orgName: orgName,
      ballotName: this.state.ballotName,
      start: this.state.start,
      end: this.state.end
    }).then((res) => {
      if (res.status === 201) {
        this.setState({
          emailConfirmation: true,
          loading: false
        });
      }
    }).catch((err) => {
      console.log(err);
      this.setState({
        loading: false,
        emailSendError: true
      });
    });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  openVoterDialog() {
    this.setState({
      voterDialogOpen: true
    });
  }

  closeVoterDialog() {
    this.setState({
      voterDialogOpen: false
    });
  }

  handleErrorCSV() {
    this.setState({
      csvError: true
    });
  }

  handleUploadCSV(data) {
    this.setState({
      emails: data,
      numVoters: data.length,
      displayInfoCSV: true,
      csvError: false
    });
  }

  render() {
    Moment.locale('en');
    momentLocalizer();
    const actions = [
      <FlatButton label="Close" primary onClick={this.handleClose} />
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
            Please fill out all required fields, and check the dates
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
              color: '#2284d1'
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
            marginLeft: '30px'
          }}
        >
          x
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
      />
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
    let pollError = null;
    if (this.state.pollError === true) {
      pollError = (
        <CardMedia
          overlayStyle={{
            height: 225
          }}
          overlayContentStyle={{
            height: 100,
            color: 'white' 
          }}
          overlay={
            <CardTitle
              title="Error"
              subtitle="There was an error creating your ballot. Please try again later."
            />
          }

        />
      );
    }
    let emailSendError = null;
    if (this.state.emailSendError === true) {
      emailSendError = (
        <div>
          There was an error sending emails. Please check that the uploaded emails are valid.
        </div>
      );
    }
    const { active } = this.state;

    if (this.state.isSubmitted) {
      return (
        <div>
          <div className="header">Confirm and Send</div>
          <section
            style={{
              display: 'flex',
              padding: 30
            }}
          >
            <div
              style={{
                flex: 1,
                padding: 5
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
                    height: '425px'
                  }}
                >
                  {pollError}
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '22px',
                      marginBottom: '10%'
                    }}
                  >
                    {this.state.ballotName}
                  </div>
                  <br /><br />
                  <form
                    style={{
                      margin: '0 auto',
                      width: '300px',
                      fontSize: '18px'
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
                lineHeight: '1.7em'
              }}
            >
              <Card
                style={{
                  padding: 30,
                  margin: 15,
                  fontSize: '14px',
                  height: '425px'
                }}
              >
                <div>
                  <h3>Send Voter Codes</h3>
                  <p>
                    While we are creating your ballot, please upload a CSV file
                    containing the email of each voter who is participating in the vote.
                    BlockBallot will generate and email a unique ID for each participant,
                    which they can then use to securely access your ballot.
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
                    color: '#2284d1'
                  }}
                  title="Ballot Participants"
                  actions={dialogActions}
                  modal={false}
                  open={this.state.voterDialogOpen}
                  onRequestClose={this.handleClose}
                  autoScrollBodyContent={true}
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
                {emailSendError}
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
          margin: '0 auto'
        }}
      >
        <div className="header">Create Your Ballot</div>
        <Segment
          attached
          raised
          style={{
            marginTop: 50,
            fontSize: 'large',
            padding: '5%'
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

              <div style={{ marginTop: '18px' }}>
                <b>2. Choose Start and End Times</b><br />
                <DateTimePicker
                  name="start"
                  value={this.state.start}
                  min={new Date()}
                  onSelect={this.handleStartDateChange}
                  onChange={this.handleInputChange}
                  style={{
                    marginTop: '20px',
                    maxWidth: '300px',
                    fontSize: '16px'
                  }}
                />
                <DateTimePicker
                  min={this.state.start || new Date()}
                  name="end"
                  value={this.state.end}
                  onSelect={this.handleEndDateChange}
                  onChange={this.handleInputChange}
                  style={{
                    marginTop: '15px',
                    maxWidth: '300px',
                    fontSize: '16px'
                  }}
                />
                <div
                  style={{
                    marginTop: '15px',
                    maxWidth: '300px',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}
                >
                  <b>
                    - Or -
                  </b>
                </div>
                <Button
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    maxWidth: '300px',
                    fontSize: '14px'
                  }}
                  toggle
                  active={active}
                  onClick={this.handleStartNow}
                >
                  Start Now and Close Manually
                </Button>
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
                    marginTop: '20px'
                  }}
                >
                  If everything looks good, click 'deploy' to create a read-only contract
                  containing your ballot. This will be saved to the Ethereum blockchain.
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
