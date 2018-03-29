import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardText, CardHeader, CardTitle, CardMedia, TextField, RaisedButton, Dialog, FlatButton, GridList} from 'material-ui';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import $ from 'jquery';


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordGen: false,
      dialogOpen: false
    }
    this.onChange = this.onChange.bind(this);
    this.signupClick = this.signupClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  onChange(e) {
    let target = e.target.name;
    this.setState ({
      [target]: e.target.value
    });
  }

  signupClick() {
    let org = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    this.props.signupSubmit(org);
  }

  handleOpen () {
    $.ajax({
      type: 'GET',
      url: '/password',
      success: (res) => {
        this.setState({
          dialogOpen: true,
          password: res
        });
      },
      error: () => {
        console.log('Error!')
      }
    })
  };

  handleClose () {
    this.setState({
      dialogOpen: false,
      passwordGen: true
    });
  };

  render() {
    const formChange = this.state.passwordGen ? (
      <div>
        <TextField
            fullWidth
            hintText='Password'
            type='password'
            errorText={this.props.signupPasswordError}
            name='password'
            value={this.state.password}
            onChange={this.onChange}
            underlineFocusStyle={{ borderBottomColor: '#4183D9'}}
        /> 

        <Button 
          primary
          className='buttonStyle'
          className='blueMatch'
          className='createAccount'
          onClick={this.signupClick}
        >
          Create Account
        </Button>
      </div>) 

      : (<div>
          <Button
            primary
            className='buttonStyle'
            className='blueMatch'
            className='createAccount'
            onClick={this.handleOpen}
          >
            Generate Password
          </Button>
        </div>);

    return (
      <div className='signup'>
        <Card>
          <CardMedia
            overlay={
            <CardTitle
              className='signupCardTitle'
              title='Create Your BlockBallot Account'
              subtitle='Commit to data transparency for your collective decision-making'
            />
            }
          >
            <img src='https://c1.staticflickr.com/1/811/40376791054_b540b344b0_h.jpg'/>
          </CardMedia>
          
          <div>
          <CardText className='signupCardText'>
            <TextField
              fullWidth
              hintText='Organization Name'
              name='name'
              errorText={this.props.signupNameError}
              value={this.state.name}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9'}}
            />

            <br/>

            <TextField
              fullWidth
              hintText="Organization Email"
              errorText={this.props.signupEmailError}
              name='email'
              value={this.state.email}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9'}}
            />

            <Dialog
              title="Unique Password"
              actions={
                <FlatButton
                  label="Close"
                  onClick={this.handleClose}
                />
              }
              modal={false}
              open={this.state.dialogOpen}
              onRequestClose={this.handleClose}>
              <div>
                  We have generated a unique, 64-digit password for you that will be associated with this account. You will need to enter this password when you log in. Please keep it safe by storing it in your computer keychain or electronic wallet.
              </div>
              <br />
              <div>
                Copy the password below to your clipboard:
              </div>
              <br />
              <div style={{cursor: 'pointer'}}>
                <CopyToClipboard text={this.state.password}>
                  <i className="copy outline icon"></i>
                </CopyToClipboard>
                <CopyToClipboard text={this.state.password}>
                  <b>{this.state.password}</b>
                </CopyToClipboard>
              </div>
            </Dialog>
            {formChange}
          </CardText>
          </div>
        </Card>
      </div>
    );
  }
}

export default Signup;