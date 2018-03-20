import React from 'react';
import { Link } from 'react-router-dom';
import {TextField, RaisedButton, FlatButton, Dialog} from 'material-ui';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Row, Col } from 'react-bootstrap';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      forgotPasswordEmail: '',
      dialogOpen: false
    }
    this.onChange = this.onChange.bind(this);
    this.loginClick = this.loginClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  
  onChange(e) {
    let target = e.target.name;
    this.setState ({
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

  handleOpen () {
    this.setState({
      dialogOpen: true,
    });
  };

  handleClose () {
    this.setState({
      dialogOpen: false,
    });
  };
  
  //need error handling still for empty fields
  render() {
    const dialogActions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ]
    return (
      <div className="loginForm">
        <TextField
          hintText="Email"
          errorText={this.props.loginEmailError}
          name='email'
          value={this.state.email}
          onChange={this.onChange}
        /><br />
        <TextField
          hintText="Password"
          errorText={this.props.loginPasswordError}
          name='password'
          value={this.state.password}
          onChange={this.onChange}
        /><br />
        <RaisedButton 
          label="Log in"
          onClick={this.loginClick}
        />

        <FlatButton
          label="Forgot Password"
          onClick={this.handleOpen}
        />

        <Dialog
          title="Forgot Password?"
          actions={dialogActions}
          modal={false}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          <div>
            Enter your account email and we'll send you a new password.
          </div>
          <TextField
          hintText="Email"
          name='forgotPasswordEmail'
          value={this.state.forgotPasswordEmail}
          onChange={this.onChange}
          />
          <RaisedButton> Send </RaisedButton>
          <br />
          
        </Dialog>

      </div>
    );
  }
}




    {/*<GridList
      cols={2}
      cellHeight={200}
      padding={1}
      style={styles.gridList}
    >
      {tilesData.map((tile) => (
        <GridTile
          key={tile.img}
          title={tile.title}
          actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
          actionPosition="left"
          titlePosition="top"
          titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
          cols={tile.featured ? 2 : 1}
          rows={tile.featured ? 2 : 1}
        >
          <img src={tile.img} />
        </GridTile>
      ))}
    </GridList>*/}



export default Login;