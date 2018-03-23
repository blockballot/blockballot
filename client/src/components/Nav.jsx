import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react';


class Nav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let activeItem = this.props.activeItem;
    let navComponent = null;
    if (this.props.loggedIn) {
      navComponent = (
        <Menu pointing secondary>
          <Link to="/dashboard">
            <Menu.Item
              name="Dashboard"
              active={activeItem === 'Dashboard'}
              onClick={this.props.handleNavClick}
            >
            </Menu.Item>
          </Link>
          <Link to="/createpoll">
            <Menu.Item
              name="Create Poll"
              active={activeItem === 'Create Poll'}
              onClick={this.props.handleNavClick}
            >
            </Menu.Item>
          </Link>
          <Link to="/voter">
            <Menu.Item
              className="menuItem"
              name="Submit Vote"
              active={activeItem === 'Submit Vote'}
              onClick={this.props.handleNavClick}
            />
          </Link>
          <Menu.Menu position='right'>
            <Menu.Item
              className="menuItem"
              name="Logout"
              active={activeItem === 'Logout'}
              onClick={this.props.handleNavClick}
              href="/logout"
            />
          </Menu.Menu>
        </Menu>
      )
    } else {
      navComponent = (
        <Menu pointing secondary>
          <Link to="/">
            <Menu.Item
              name="Home"
              active={activeItem === 'Home'}
              onClick={this.props.handleNavClick}
            >
            </Menu.Item>
          </Link>
          
          <Link to="/voter">
            <Menu.Item
              className="menuItem"
              name="Submit Vote"
              active={activeItem === 'Submit Vote'}
              onClick={this.props.handleNavClick}
            />
          </Link>
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
