import React from 'react';
import {Button, Header, Icon} from 'semantic-ui-react';
import PollResults from './PollResults.jsx';
import {Link, Redirect, Route} from 'react-router-dom';

const Poll = (props) => {
  return (
      <div class="card"
      onClick={() => props.handlePollClick(props.poll)}>
        <div class="content">
          
          <div class="header">
            {props.poll.pollName}
          </div>

          <br />

          <div class="extra content">
            <span className="left floated">
              {props.poll.date}
            </span>
            <span className="right floated">
              {props.poll.voteCount}
              <i class="check square outline icon"></i> 
            </span>
          </div>

        </div>

      </div>
  )   
}

export default Poll;
