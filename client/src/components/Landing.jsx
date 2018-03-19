import React from 'react';
import { Link } from 'react-router-dom';

class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/voter">voter login page</Link>
        <div>
          Org Signup/Login
        </div>
        <Link to="/signup">
          <button>
          Signup
          </button>
        </Link>
        <Link to="/login">
          <button>
          Log in
          </button>
        </Link>
      </div>
    );
  }
}

export default Landing;
