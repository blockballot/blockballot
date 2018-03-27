import React from 'react';
import { Link } from 'react-router-dom';
import {Card, CardText, CardHeader, TextField, RaisedButton, Dialog, FlatButton, GridList} from 'material-ui';
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
    const dialogActions = [
      <FlatButton
        label="Close"
        onClick={this.handleClose}
      />
    ]
    const formChange = this.state.passwordGen ? (
      <div>
        <TextField
            hintText='Password'
            type='password'
            errorText=''
            name='password'
            value={this.state.password}
            onChange={this.onChange}
            underlineFocusStyle={{ borderBottomColor: '#4183D9'}}
        /> 

        <RaisedButton 
          style={{marginTop: 20}}
          label="Create Account"
          onClick={this.signupClick}
        />
      </div>) 

      : (<div>
          <RaisedButton 
            style={{marginTop: 20}}
            label="Generate Password"
            onClick={this.handleOpen}
          />
        </div>);

    return (
      <div
        style={{
          width: 400,
          height: 500,
          position: 'absolute',
          top: 200,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto'
        }}
      >
        <Card>
          <CardHeader
            titleStyle={{marginLeft: 20, marginTop: 10, fontSize: 25}}
            title="Create Your Account"
          />

          <CardText style={{marginLeft: 20}}>
            <TextField
              hintText='Organization Name'
              name='name'
              errorText=''
              value={this.state.name}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9'}}
            />

            <br/>

            <TextField
              hintText="Organization Email"
              errorText={this.props.signupError}
              name='email'
              value={this.state.email}
              onChange={this.onChange}
              underlineFocusStyle={{ borderBottomColor: '#4183D9'}}/>

            <Dialog
              contentStyle={{width: 600}}
              title="Unique Password"
              actions={dialogActions}
              modal={false}
              open={this.state.dialogOpen}
              onRequestClose={this.handleClose}>

              <div>
                Copy the unique password below to create your account:
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
        </Card>
        <div
          style={{
            width: '100%',
            marginTop: 20,
            marginLeft: '25%',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          Already have an account? <Link style={{marginLeft: 5}} to='/login'> Log In </Link>
        </div>
      </div>
    );
  }
}

export default Signup;