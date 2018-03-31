import React from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { Link, Redirect, Route } from 'react-router-dom';

import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';
import { render } from 'react-dom';
import DropdownList from 'react-widgets/lib/DropdownList';

Moment.locale('en')
momentLocalizer()

const AboutUs = props => (
  <div>
    About Us
    <DateTimePicker
      dropUp
      data={[
      'orange',
      'red',
      'blue',
      'purple',
    ]}
    />
  </div>
);

export default AboutUs;
