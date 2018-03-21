import React from 'react';
import Poll from './Poll.jsx';
import {Link} from 'react-router-dom';
import {
  Card,
  Button,
  Container,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react';
 

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      polls: samplePolls
    }
  }

  // componentDidMount() {
  //   $.ajax({
  //     type: 'GET',
  //     url: '/dashboard',
  //     success: (data) => {
  //       this.setState({
  //         polls: data
  //       })
  //     },
  //     error: () => {
  //       //handle error
  //     }
  //   });
  // }

  render() {
    let polls = this.state.polls;
    return (
      <div>

        <div>
          <h2 style={{marginLeft: 50, marginTop: 50}}>Polls</h2>
          <Link to='/createpoll'>
            <button
              style={{marginLeft: 50}}
              class="ui button">
              Create Poll
            </button>
          </Link>
        </div>


        <div style={{marginLeft: 50, marginRight:50, marginTop: 50}}>
          <div class="ui four link cards">
            
            {polls.map((poll) =>
              <Link to="/pollresults">
                <Poll
                poll={poll}
                />
              </Link>
            )}

          </div>
        </div>
      </div>
    )
  }
}


const samplePolls = [
{
  pollName: 'Poll 1',
  date: '5/13/18',
  voteCount: 10
},
{
  pollName: 'Poll 2',
  date: '5/12/18',
  voteCount: 30
},
{
  pollName: 'Poll 3',
  date: '4/12/18',
  voteCount: 40
},
{
  pollName: 'Poll 4',
  date: '3/11/18',
  voteCount: 38
},
{
  pollName: 'Poll 5',
  date: '3/5/18',
  voteCount: 61
},
{
  pollName: 'Poll 6',
  date: '2/14/18',
  voteCount: 52
},
{
  pollName: 'Poll 5',
  date: '3/5/18',
  voteCount: 61
},
{
  pollName: 'Poll 6',
  date: '2/14/18',
  voteCount: 52
},
{
  pollName: 'Poll 5',
  date: '3/5/18',
  voteCount: 61
},
{
  pollName: 'Poll 6',
  date: '2/14/18',
  voteCount: 52
},
{
  pollName: 'Poll 5',
  date: '3/5/18',
  voteCount: 61
},
{
  pollName: 'Poll 6',
  date: '2/14/18',
  voteCount: 52
}
]


export default Dashboard;