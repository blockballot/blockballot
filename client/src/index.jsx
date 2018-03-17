import React from 'react';
import ReactDOM from 'react-dom';
import AppWithRouter from './components/App.jsx';
import {BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render(
  <Router>
    <AppWithRouter />
  </Router>, document.getElementById('app'));