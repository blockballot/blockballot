import React from 'react';
import {Button, Header, Icon} from 'semantic-ui-react';
import PollResults from './PollResults.jsx';
import {Link, Redirect, Route} from 'react-router-dom';

const Poll = (props) => {
  return (
      <div className="card"
      onClick={() => props.handlePollClick(props.poll)}>
        <div className="content">
          <div className="header">
            {props.poll.pollName}
          </div>

          <br/>
          
          <div className="extra content">
            <span className="left floated">
              <b>Start: </b>{props.poll.pollTimeStart} (GMT) <br/>
              <b>End: </b>{props.poll.pollTimeEnd} (GMT)
            </span>
            <span className="right floated">
              {props.poll.voteCount}
              <i className="check square outline icon"></i> 
            </span>
          </div>

        </div>
      </div>
  )   
}

export default Poll;
