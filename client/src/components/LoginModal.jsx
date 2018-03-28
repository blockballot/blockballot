import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import cookie from 'react-cookie';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import { Card, CardText, CardHeader, TextField, RaisedButton, FlatButton, Dialog } from 'material-ui';
import { BarLoader } from 'react-spinners';
import $ from 'jquery';
import '../style/forms.css';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false,
      dialogEmailSent: false,
      loading: false
    }
    this.loginClick = this.loginClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
  }

  handleOpenDialog() {
    this.setState({
      dialogOpen: true
    });
  }

  handleCloseDialog() {
    this.setState({
      dialogOpen: false
    });
  }

  onChange(e) {
    let target = e.target.name;
    this.setState({
      [target]: e.target.value
    });
  }

  loginClick() {
    let login = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.loginSubmit(login);
  }

  handlePasswordReset() {
    this.setState({
      loading: true
    })
    $.ajax({
      type: 'POST',
      url: '/email',
      data: { email: this.state.forgotPasswordEmail },
      success: (res) => {
        console.log('email sent - client');
        this.setState({
          dialogEmailSent: true,
          loading: false
        });
        console.log(this.state.dialogEmailSent);
      },
      error: (err) => {
        console.log('error');
      }
    })
  }

  render() {
    if (cookie.load('loggedIn') === 'true') {
      return (<Redirect to='/dashboard' />)
    }

    let sendConfirmation = null;
    if (this.state.dialogEmailSent === true) {
      sendConfirmation = (
        <div>
          <b>A link to reset your password has been sent to your email inbox.</b>
        </div>
      )
    }
    const dialogActions = [
      <FlatButton
        label="Close"
        onClick={this.handleCloseDialog}
      />
    ]

    return (
      <Modal
        className='loginModal'
        trigger={
          <Button
            basic
            color='black'
            className='buttonStyle'
            onClick={this.props.handleOpen}
          >
            Log In
          </Button>
        }
        open={this.props.modalOpen}
        onClose={this.props.handleClose}
        basic
        size='small'
      >
        <Modal.Content>
          <h3 className='loginHeader'>Log Into Your BlockBallot Account</h3>
          <Card className='cardContent'>

            <CardText className='cardText'>
              <TextField
                fullWidth
                hintText='Email'
                errorText={this.props.loginEmailError}
                name='email'
                value={this.state.email}
                onChange={this.onChange}
                underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
              />
              <br/>
              <TextField
                fullWidth
                hintText="Password"
                type="password"
                errorText={this.props.loginPasswordError}
                name='password'
                value={this.state.password}
                onChange={this.onChange}
                underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
              />
              <br/>

              <Dialog
                contentStyle={{ color: '#4183D9' }}
                title="Forgot Password?"
                actions={dialogActions}
                modal={false}
                open={this.state.dialogOpen}
                onRequestClose={this.handleCloseDialog}>
                <div>
                  Enter your account email to reset your password.
              </div>
                <br />
                <TextField
                  hintText="Email"
                  name='forgotPasswordEmail'
                  value={this.state.forgotPasswordEmail}
                  onChange={this.onChange}
                  underlineFocusStyle={{ borderBottomColor: '#4183D9' }}
                />
                <Button
                  primary
                  className='buttonStyle'
                  className='blueMatch'
                  onClick={this.handlePasswordReset}>
                  Send
                </Button>
                <br />
                <BarLoader
                  color={'#4183D9'}
                  loading={this.state.loading}
                  width={250}
                />
                {sendConfirmation}
              </Dialog>
            </CardText>

            <Modal.Actions className='modalButtons'>
              <Button
                primary
                className='buttonStyle'
                className='blueMatch'
                onClick={this.loginClick}
              >
                Submit
              </Button>
              <Button
                basic
                color="black"
                className='buttonStyle'
                onClick={this.handleOpenDialog}
              >
                Forgot Password?
              </Button>
            </Modal.Actions>
          </Card>
          <div className='signupRedirect'>
            Don't have an account? <Link className='sigupLink' to='/signup'> Sign up </Link>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default LoginModal;