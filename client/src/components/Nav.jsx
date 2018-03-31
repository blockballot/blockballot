import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Button } from 'semantic-ui-react';
import LoginModal from './LoginModal';

class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let navComponent = null;

    if (this.props.loggedIn) {
      navComponent = (
        <Menu attached borderless style={{ border: 'none' }}>
          <Link to='/'>
            <Menu.Item as='a'>
              <h3 style={{
                fontFamily: 'Hammersmith One',
                fontSize: '30px'
              }}>BB</h3>
            </Menu.Item>
          </Link>
          <Link to='/dashboard'>
            <Menu.Item>
              <h3
                style={{
                  marginTop: '0.4em',
                  fontFamily: 'Roboto, sans-serif'
                }}
              >
                Dashboard
              </h3>
            </Menu.Item>
          </Link>
          <Link to='createpoll'>
            <Menu.Item>
              <h3
                style={{
                  marginTop: '0.4em',
                  fontFamily: 'Roboto, sans-serif'
                }}
              >
                Create Ballot
              </h3>
            </Menu.Item>
          </Link>
          <Menu.Item position='right'>
            <Button
              basic
              color='black'
              href='/logout'
              content='Log Out'
              style={{ fontFamily: 'Roboto, sans-serif'}}
            />
          </Menu.Item>
        </Menu>
      )
    } else {
      navComponent = (
        <Menu attached borderless style={{border: 'none'}}>
          <Link to='/'>
            <Menu.Item>
              <h3 style={{
                  fontFamily: 'Hammersmith One',
                  fontSize: '30px'
                }}>BB</h3>
            </Menu.Item>
          </Link>
          <Menu.Item position='right'>
            <LoginModal
              handleOpen={this.props.handleOpen}
              handleClose={this.props.handleClose}
              modalOpen={this.props.modalOpen}
              loginSubmit={this.props.loginSubmit}
              loginEmailError={this.props.loginEmailError}
              loginPasswordError={this.props.loginPasswordError}
            />
            <Link to='signup'>
              <Button
                basic
                color='black'
                content='Sign Up'
                style={{
                  'marginLeft': '0.5em',
                  'fontFamily': 'Roboto, sans-serif'
                  }}
              />
            </Link>
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <div>
      {navComponent}
      </div>
    );
  }
}

export default Nav;
