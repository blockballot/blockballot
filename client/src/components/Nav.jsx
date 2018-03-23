import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment, Button } from 'semantic-ui-react';
import cookie from 'react-cookie';


class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let navComponent = null;
    if (this.props.loggedIn) {
      navComponent = (
      <Menu pointing secondary>
        <Link to='/dashboard'>
          <Menu.Item 
          name="Dashboard"
          active={this.props.activeItem === 'Dashboard'}
          onClick={() => this.handleNavClick('Dashboard')}/>
        </Link>
        <Link to='/createpoll'>
          <Menu.Item name="Create Poll"/>
        </Link>
        <Link to='/voter'>
          <Menu.Item name="Submit Vote" />
        </Link>

        <Menu.Menu position='right'>
          <Menu.Item
            name="Logout"
            href='/logout'/>
        </Menu.Menu>
      </Menu>
    )

    } else {
      navComponent = (
        <Menu pointing secondary>

          <Menu.Item 
          as='a'  
          active={this.props.activeItem === 'Home'}
          onClick={() => this.handleNavClick('Home')}>
            <Link to='/'>
              Home
            </Link>
          </Menu.Item>
          <Menu.Item as='a'>
            <Link to='/aboutus'>
              About Us
            </Link>
          </Menu.Item>
          <Menu.Item as='a'>
            <Link to='/voter'>
              Voters
            </Link>
          </Menu.Item>

          <Menu.Item position='right'>
            <Link to='/login' >
              <Button> Log In</Button>
            </Link>
            <Link to='/signup' >
              <Button style={{marginLeft: '0.5em'}}> Sign Up</Button>
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
