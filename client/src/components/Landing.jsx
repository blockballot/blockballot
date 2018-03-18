import React from 'react';
import { Link } from 'react-router-dom';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/Login">get start</Link><br/>
        <Link to="/Voter">voter login page</Link>
      </div>
    )
  }
}
module.exports = Landing;