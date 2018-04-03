import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from 'scrollreveal';
import {
  Container,
  Grid,
  Header,
  Image,
  List,
  Responsive,
  Segment
} from 'semantic-ui-react';

class Landing extends React.Component {

  componentDidMount() {
    const config = {
      origin: 'top',
      duration: 1000,
      delay: 150,
      distance: '50px',
      easing: 'ease'
    };
    ScrollReveal().reveal(this.refs.box1, config);
  }

  render() {
    return (
      <Responsive>
        <Segment
          vertical
          style={{
            minHeight: 700,
            padding: '1em 0em',
            backgroundSize: 'cover',
            backgroundImage: 'url(https://c1.staticflickr.com/1/820/39104766100_936bc7c75d_o.jpg)'
          }}
        >
          <Container
            text
            style={{ textAlign: 'right' }}
          >
            <Header
              as="h1"
              content="BlockBallot"
              style={{
                fontSize: '5em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '2.0em',
                fontFamily: 'Hammersmith One',
                textAlign: 'left'

              }} />
            <h2
              ref="box1"
              style={{
                fontSize: '2em',
                fontFamily: 'Roboto Condensed',
                marginTop: '1em',
                textAlign: 'left',
                color: '#4183D9'
              }}
            >
            Decentralized Voting for a More Transparent World
            </h2>
          </Container>
        </Segment>
        <Segment
          vertical
          style={{
            minHeight: 700,
            padding: '1em 0em',
            backgroundColor: '#F0F8FF'
          }}
        >
          <Grid
            container
            stackable
            verticalAlign="middle"
            style={{
              marginTop: '3em',
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            <Grid.Row>
              <Grid.Column width={8}>
                <Header
                  as="h3"
                  style={{
                    fontSize: '2em',
                    marginTop: '1em'
                  }}>
                  How to Get Started
                </Header>
                <p
                  style={{
                    fontSize: '1.33em',
                    textAlign: 'center'
                  }}
                >
                  Sign up your organization for a BlockBallot account, design custom ballots, and track outcomes with our results dashboard.
                </p>
                <Header as="h3" style={{ fontSize: '2em' }}>
                  Blockchain for Transparency
                </Header>
                <p
                  style={{
                  fontSize: '1.33em',
                  textAlign: 'center'
                  }}
                >
                  Because voter data is permanently written to the Ethereum blockchain, BlockBallot is the safest, most transparent way to organize a vote.
                </p>
              </Grid.Column>
              <Grid.Column floated="right" width={6}>
                <Image
                  bordered
                  rounded
                  size="large"
                  src="https://images.unsplash.com/photo-1509374864550-ec7bcb9c17ff?ixlib=rb-0.3.5&s=250695a9f647ae3c0aad52c6ab6c01a7&auto=format&fit=crop&w=634&q=80"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment
          inverted
          vertical
          style={{
            padding: '5em 0em',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header style={{textAlign: 'left'}} inverted as="h4" content="About" />
                  <List link inverted>
                    <Link to="/aboutus">
                      <List.Item as="a">About Us</List.Item>
                    </Link>
                    <br />
                    <Link to="/">
                      <List.Item as="a">White Paper</List.Item>
                    </Link>
                    <List.Item
                      style={{ padding: 0 }}
                      as="a"
                      href="https://github.com/blockballot/blockballot"
                    >
                      Source Code
                    </List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header style={{textAlign: 'left'}} inverted as="h4" content="Actions" />
                  <List link inverted>
                    <Link to="/settings">
                      <List.Item as="a">Settings</List.Item>
                    </Link>
                    <br />
                    <Link to="/createpoll">
                      <List.Item as="a">Create Ballot</List.Item>
                    </Link>
                    <br />
                    <Link to="/voter">
                      <List.Item as="a">Voter Page</List.Item>
                    </Link>
                  </List>
                </Grid.Column>
                <Grid.Column width={7}>
                  <Header style={{ textAlign: 'left' }} as="h4" inverted>BlockBallot</Header>
                  <p>Elections and other collective decision-making processes are too important to risk the threat of data manipulation. Bind your decisions to the Ethereum blockchain with BlockBallot.</p>
                  <a href="https://www.freepik.com/free-vector/vector-network-background-abstract-polygon-triangle_1306336.htm">Vector Background Designed by Freepik</a>
                  <br />
                  <a href="https://unsplash.com/photos/MT6wpZAEjHM">Oculus NYC by Alex Iby</a>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </Responsive>
    );
  }
}


export default Landing;
