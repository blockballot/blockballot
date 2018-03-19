import React from 'react';
import { Link } from 'react-router-dom';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/Login">Get Started</Link><br/>
        <Link to="/Voter">Voter Login Page</Link>
      </div>
    )
  }
}
export default Landing;