import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Card, CardText, CardHeader, Dialog, Divider, TextField, RaisedButton } from 'material-ui';
import axios from 'axios';
import cookie from 'react-cookie';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: '',
      currentEmail1: '',
      currentEmail2: '',
      newEmail: '',
      confirmationMessage: '',
      dialogOpen: false
    };
    this.onChange = this.onChange.bind(this);
    this.onNameReset = this.onNameReset.bind(this);
    this.onEmailReset = this.onEmailReset.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChange(e) {
    const target = e.target.name;
    this.setState({
      [target]: e.target.value
    });
  }

  onNameReset() {
    const reset = this;
    axios.post('/resetname', {
      currentEmail: reset.state.currentEmail1,
      newName: reset.state.newName
    })
      .then((res) => {
        if (res.status === 201) {
          reset.setState({
            confirmationMessage: 'Successfully reset your account name. Please log out and log back in to see your updated changes.',
            dialogOpen: true
          });
        }
      })
      .catch((err) => {
        if (err) {
          reset.setState({
            confirmationMessage: 'Could not reset your account name. Please check your that you are using the correct email or try again later.',
            dialogOpen: true
          });
        }
      });
    this.handleOpen();
  }

  onEmailReset() {
    const reset = this;
    axios.post('/resetemail', {
      currentEmail: reset.state.currentEmail2,
      newEmail: reset.state.newEmail
    })
      .then((res) => {
        if (res.status === 201) {
          reset.setState({
            confirmationMessage: 'Successfully reset your account email. Please log out and log back in to verify your updated changes.',
            dialogOpen: true
          });
        }
      })
      .catch((err) => {
        if (err) {
          reset.setState({
            confirmationMessage: 'Could not reset your account email. Please check that you entered the correct information or try again later.',
            dialogOpen: true
          });
        }
      });
    this.handleOpen();
  }

  handleOpen() {
    this.setState({
      dialogOpen: true,
    });
  };

  handleClose() {
    this.setState({
      dialogOpen: false,
    });
  };

  render() {
    if (cookie.load('loggedIn') !== 'true') {
      return (<Redirect to="/signup" />);
    }
    return (
      <div
        style={{
          width: 500,
          margin: '0 auto',
          marginTop: '50px',
          marginBottom: '50px'
        }}
      >
        <Card>
          <CardHeader
            titleStyle={{ marginLeft: 20, marginTop: 10, fontSize: 22 }}
            title="Edit Account Information"
          />
          <CardText style={{ margin: 20 }}>
            <h4 style={{ fontFamily: 'sans-serif' }}>Reset Name</h4>
            <TextField
              fullWidth
              hintText="Enter Current Email"
              errorText=""
              name="currentEmail1"
              value={this.state.currentEmail1}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
            />
            <br />
            <TextField
              fullWidth
              hintText="Enter New Username"
              errorText=""
              name="newName"
              value={this.state.newName}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
            />
            <br />
            <div style={{ marginTop: 20 }}>
              <RaisedButton
                label="Reset Account Name"
                onClick={this.onNameReset}
              />
            </div>
            <br />

            <Divider />

            <h4 style={{ fontFamily: 'sans-serif' }}>Reset Email</h4>
            <TextField
              fullWidth
              hintText="Enter Current Email"
              errorText=""
              name="currentEmail2"
              value={this.state.currentEmail2}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
            />
            <br />
            <TextField
              fullWidth
              hintText="Enter New Email"
              errorText=""
              name="newEmail"
              value={this.state.newEmail}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
            />
            <br />
            <div style={{ marginTop: 20 }}>
              <RaisedButton
                label="Reset Account Email"
                onClick={this.onEmailReset}
              />
            </div>
            <br />
          </CardText>
        </Card>
        <Dialog
          contentStyle={{ width: 500, color: 'white' }}
          actions={
            <RaisedButton
              label="Close"
              onClick={this.handleClose}
            />
          }
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          <div>
            {this.state.confirmationMessage}
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Settings;
