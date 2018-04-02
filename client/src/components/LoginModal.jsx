import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import cookie from 'react-cookie';
import { Button, Modal } from 'semantic-ui-react';
import { Card, CardText, TextField, FlatButton, Dialog } from 'material-ui';
import { BarLoader } from 'react-spinners';
import $ from 'jquery';
import '../style/forms.css';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false,
      dialogEmailSent: false,
      loading: false,
      emailInvalidError: false
    };
    this.loginClick = this.loginClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
  }

  onChange(e) {
    const target = e.target.name;
    this.setState({
      [target]: e.target.value
    });
  }

  handleCloseDialog() {
    this.setState({
      dialogOpen: false
    });
  }

  handleOpenDialog() {
    this.setState({
      dialogOpen: true
    });
  }

  loginClick() {
    const login = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.loginSubmit(login);
  }

  handlePasswordReset() {
    this.setState({
      loading: true,
      emailInvalidError: false
    });
    axios.post('/forgotpassword', {
      email: this.state.forgotPasswordEmail
    })
      .then(() => {
        console.log('email sent - client');
        this.setState({
          dialogEmailSent: true,
          loading: false
        });
      })
      .catch((err) => {
        this.setState({
          emailInvalidError: true,
          loading: false
        })
        console.log('Error sending email for password reset');
      });
  }

  render() {
    if (cookie.load('loggedIn') === 'true') {
      return (<Redirect to="/dashboard" />);
    }

    let sendConfirmation = null;
    if (this.state.dialogEmailSent === true) {
      sendConfirmation = (
        <div>
          <b>A link to reset your password has been sent to your email inbox.</b>
        </div>
      );
    }

    let emailInvalidError = null;
    if (this.state.emailInvalidError === true) {
      emailInvalidError = (
        <div>
          <b>This email doesn't exist in our system.</b>
        </div>
      )
    }

    return (
      <div>
        <Modal
          className="loginModal"
          trigger={
            <Button
              basic
              color="black"
              className="buttonStyle"
              onClick={this.props.handleOpen}
            >
              Log In
            </Button>
          }
          open={this.props.modalOpen}
          onClose={this.props.handleClose}
          basic
          size="small"
        >
          <Modal.Content>
            <h3 className="loginHeader">Log Into Your BlockBallot Account</h3>
            <Card className="loginCardContent">

              <CardText className="loginCardText">
                <TextField
                  fullWidth
                  hintText="Email"
                  errorText={this.props.loginEmailError}
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
                />
                <br />
                <TextField
                  fullWidth
                  hintText="Password"
                  type="password"
                  errorText={this.props.loginPasswordError}
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
                />
                <br />
              </CardText>
              <Modal.Actions className="modalButtons">
                <Button
                  primary
                  className="buttonStyle blueMatch"
                  onClick={this.loginClick}
                >
                  Submit
                </Button>
                <Button
                  basic
                  color="black"
                  className="buttonStyle"
                  onClick={this.handleOpenDialog}
                >
                  Forgot Your Password?
                </Button>
              </Modal.Actions>
            </Card>
            <div className="signupRedirect">
              Don&apos;t have an account?
              <Link
                to="/signup"
                onClick={this.props.handleClose}
              >
                <span className="signupSpan">Sign Up</span>
              </Link>
            </div>
          </Modal.Content>
        </Modal>
        <div className="dialogDiv">
          <Dialog
            className="dialog"
            actions={
              <FlatButton
                label="Close"
                onClick={this.handleCloseDialog}
              />
            }
            modal={false}
            open={this.state.dialogOpen}
            onRequestClose={this.handleCloseDialog}
          >
            <h2 className="forgotPassword">Forgot Your Password?</h2>
            <div>
              Enter your account email to reset your password.
            </div>
            <br />
            <TextField
              fullwidth
              hintText="Email"
              name="forgotPasswordEmail"
              value={this.state.forgotPasswordEmail}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
            />
            <br />
            <BarLoader
              className="barLoader"
              color="#4183D9"
              loading={this.state.loading}
              width={250}
            />
            <br />
            <Button
              primary
              className="buttonStyle blueMatch"
              onClick={this.handlePasswordReset}
            >
              Send
            </Button>
            {sendConfirmation}
            {emailInvalidError}
          </Dialog>
        </div>
      </div>
    );
  }
}

export default LoginModal;