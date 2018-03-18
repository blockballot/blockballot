import React from 'react';

class VoterLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isLogin: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({
        value: event.target.value
    });
  }

  handleSubmit(event) {
    alert(this.state.value)
    event.preventDefault();

  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} >
        <label>
          <div>ENTER YOUR UNIQUE CODE</div>
          <input type="password" name="voterPassword" value={this.state.value} onChange={this.handleChange} />
        </label>
         <input type="submit" value="Submit" />
      </form>
    )
  }
}
module.exports = VoterLogin;