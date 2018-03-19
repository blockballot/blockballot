import React from 'react';
import ReactDOM from 'react-dom';
import AppWithRouter from './components/App.jsx';
import {BrowserRouter as Router} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
  <Router>
    <MuiThemeProvider>
      <AppWithRouter />
    </MuiThemeProvider>
  </Router>, document.getElementById('app'));