import React from 'react';
import {Button, Header, Icon} from 'semantic-ui-react';
import PollResults from './PollResults.jsx';
import {Link, Redirect, Route} from 'react-router-dom';
import {formatDate} from '../../../helpers/helpers';
import '../style/dashboard.css';


const Poll = (props) => {
  let time = null;
  if (props.poll.pollTimeStart === null && props.poll.pollTimeEnd === null) {
    time = (
      <div>
        <b>Start:</b> Manual <br/>
        <b>End:</b> Manual
      </div>
    )
  } else {
    let startTime = formatDate(props.poll.pollTimeStart);
    let endTime = formatDate(props.poll.pollTimeEnd);
    time = (
      <div>
        <b>Start: </b>{startTime}<br/>
        <b>End: </b>{endTime}
      </div>
    )
  }
  return (
      <div 
        className="card"
        onClick={() => props.handlePollClick(props.poll)}
      >
        <div class="content hovercontent">
          <div className="header">
            {props.poll.pollName}
          </div>
          <br/>
          {time}
          <div className="extra content">
            <span className="left floated">
         
            </span>
            <span 
              className="right floated"
              style={{color: '#2284d1'}}
            >
              {props.poll.voteCount}
              <i className="check square outline icon">
              </i> 
            </span>
          </div>

        </div>
      </div>
  )   
}

export default Poll;
