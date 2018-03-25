import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment, Button } from 'semantic-ui-react';
import cookie from 'react-cookie';

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  handleNavClick() {
    this.classList.toggle("change");
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
              <h3 style={{
                marginTop: '0.4em'
              }}>Dashboard</h3>
            </Menu.Item>
          </Link>
          <Link to='createpoll'>
            <Menu.Item>
              <h3 style={{
                marginTop: '0.4em'
              }}>Create Poll</h3>
            </Menu.Item>
          </Link>
          <Menu.Item position='right'>
            <Button basic color='black' href='/logout' content='Log Out' />
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
            <Link to='/login'>
              <Button basic color='black' content='Log In'/>
            </Link>
            <Link to='signup'>
              <Button basic color='black' content='Sign Up' style={{'marginLeft': '0.5em'}}/>
            </Link>
          </Menu.Item>
        </Menu>
      )
    }

    return (
      <div>
      {navComponent}
      </div>
    )
  }
}

export default Nav;
