import React from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { Bar as BarChart } from 'react-chartjs';
import { Menu, Button } from 'semantic-ui-react';
import { Dialog } from 'material-ui';
import axios from 'axios';
import cookie from 'react-cookie';

class PollResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openDelete: false,
      pollId: props.poll.pollId,
      options: props.poll.options,
      optionVotes: props.poll.optionVotes,
      pollExpired: props.poll.pollExpired,
      pollTimeEnd: props.poll.pollTimeEnd,
      pollTimeStart: props.poll.pollTimeStart,
      pollName: props.poll.pollName,
      voteCount: props.poll.voteCount,
      confirmDelete: false
    };
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.handleDeleteBallot = this.handleDeleteBallot.bind(this);
  }

  handleDialogOpen() {
    this.setState({
      open: true
    });
  }

  handleDialogClose() {
    this.setState({
      open: false
    });
  }

  handleDialogSubmit() {
    this.setState({
      open: false
    });

    axios.put('/endpoll', {
      pollId: this.state.pollId,
      pollExpired: true
    })
      .then((result) => {
        console.log('successful', result);
        this.setState({
          pollExpired: result.data.pollExpired
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openDeleteDialog() {
    this.setState({
      openDelete: true
    })
  }

  closeDeleteDialog() {
    this.setState({
      openDelete: false
    });
  }

  handleDeleteBallot() {
    console.log('Delete Ballot')
    this.setState({
      confirmDelete: true
    })
  }


  render() {
    console.log(this.props.poll);
    if (cookie.load('loggedIn') !== 'true') {
      return (<Redirect to="/" />);
    } else if (this.props.poll === undefined) {
      return (<Redirect to="/dashboard" />);
    }

    const voteCounts = [];
    const options = this.state.options.split(',');
    this.state.optionVotes.forEach((optionVote, index) => {
      voteCounts.push(optionVote[options[index]]);
    });
    const data = {
      labels: options,
      datasets: [
        {
          fillColor: 'rgba(240,248,255,0.5)',
          strokeColor: 'rgba(34,132,209,0.8)',
          highlightFill: 'rgba(34,132,209,0.75)',
          highlightStroke: 'rgba(34,132,209,1)',
          data: voteCounts
        }
      ]
    };

    let pollCloseTime = null;
    if (this.state.pollExpired === null) {
      if (this.state.pollTimeStart !== null && this.state.pollTimeEnd !== null) {
        pollCloseTime = (
          <div className="subHeader">
            Ballot Closing Time: {this.state.pollTimeEnd}
          </div>
        );
      } else {
        pollCloseTime = (
          <Button
            primary
            onClick={this.handleDialogOpen}
          >
          End Voting Period for Ballot
          </Button>
        );
      }
    } else {
      pollCloseTime = (
        <div className="subHeader" style={{ color: 'red' }}>
          <b>Your Ballot is Closed</b>
        </div>
      );
    }

    let confirmDelete = null;
    if (this.state.confirmDelete === true) {
      confirmDelete = (
        <div>
          Ballot Deleted!
        </div>
      )
    }

    const actions = [
      <Button
        content="Cancel"
        onClick={this.handleDialogClose}
      />,
      <Button
        primary
        content="End the ballot"
        onClick={this.handleDialogSubmit}
      />
    ];

    const deleteActions = [
      <Button
        content="Cancel"
        onClick={this.closeDeleteDialog}
      />,
      <Button
        primary
        content="Delete"
        onClick={this.handleDeleteBallot}
      />
    ]

    return (
      <div>
        <div className="header">
          {this.state.pollName}
        </div>

        <div className="header">
          <BarChart
            data={data}
            options={options}
            width={600}
            height={250}
          />
        </div>

        <div className="subHeader">
          Total Votes: {this.state.voteCount}
        </div><br />
        <div style={{ textAlign: 'center' }}> 
          <span>
            {pollCloseTime}
          </span>
          <Button
            style={{marginTop: 10}}
            primary
            content="Delete Ballot"
            onClick={this.openDeleteDialog}
          />
        </div>
        <Dialog
          title="You are about to close the Ballot"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleDialogClose}
        >
          If you want to proceed, Click the "End the ballot" button
        </Dialog>
        <Dialog
          title="Are you sure?"
          actions={deleteActions}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDeleteDialog}
        >
          You will not be able to access this ballot if you delete it.
          {confirmDelete}
        </Dialog>
      </div>
    );
  }
}

const options = {
  // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
  scaleBeginAtZero: true,

  // Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines: false,

  // String - Colour of the grid lines
  scaleGridLineColor: 'rgba(0,0,0,.05)',

  // Number - Width of the grid lines
  scaleGridLineWidth: 1,

  // Boolean - Whether to show horizontal lines (except X axis)
  scaleShowHorizontalLines: false,

  // Boolean - Whether to show vertical lines (except Y axis)
  scaleShowVerticalLines: true,

  // Boolean - If there is a stroke on each bar
  barShowStroke: true,

  // Number - Pixel width of the bar stroke
  barStrokeWidth: 2,

  // Number - Spacing between each of the X value sets
  barValueSpacing: 5,

  // Number - Spacing between data sets within X values
  barDatasetSpacing: 1,

  // String - A legend template
  legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'

};

export default PollResults;
