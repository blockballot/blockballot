import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility
} from 'semantic-ui-react';
import Nav from './Nav';
import cookie from 'react-cookie';


class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fixed: true
    }
  }

  render() {
    console.log(cookie.load('loggedIn'));
    return (
      <Responsive>
        <Segment
          vertical
          className="mainSegment"
          style={{
            minHeight: 700,
            padding: '1em 0em',
            backgroundSize: 'cover',
            backgroundImage: 'url(https://c1.staticflickr.com/1/820/39104766100_936bc7c75d_o.jpg)'
          }}>
          <Container
            text
            style={{textAlign: 'center'}}>
            <Header
              as='h1'
              content='BlockBallot'
              style={{
                fontSize: '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: '3em'
              }}/>
            <Header
              as='h2'
              content='Decentralized Voting for a Transparent World'
              style={{
                fontSize: '1.7em',
                fontWeight: 'normal',
                marginTop: '1.5em'
              }}/>
            <Link to='/createpoll'>
              <Button primary size='huge'>
                Get Started
              </Button>
            </Link>
          </Container>
        </Segment>
        <Segment
          vertical
          style={{
            minHeight: 700,
            padding: '1em 0em',
            backgroundColor: '#F0F8FF'
          }}>
          <Grid
            container
            stackable
            verticalAlign='middle'
            style={{marginTop: '3em'}}>
            <Grid.Row>
              <Grid.Column width={8}>
                <Header
                  as='h3'
                  style={{
                    fontSize: '2em',
                    marginTop: '1em'
                  }}>
                  How to Get Started
                </Header>
                <p style={{
                  fontSize: '1.33em',
                  textAlign: 'center',
                  }}>
                  Sign up your organization for a BlockBallot account, design custom ballots, and track results with our analytics dashboard.
                </p>
                <Header as='h3' style={{fontSize: '2em'}}>Blockchain for Transparency</Header>
                <p style={{
                  fontSize: '1.33em',
                  textAlign: 'center'
                  }}>
                  Because voter data is permanently written to a private Ethereum blockchain, BlockBallot is the safest, most transparent way to organize a vote.
                </p>
              </Grid.Column>
              <Grid.Column floated='right' width={6}>
              <Image
                bordered
                rounded
                size='large'
                src='https://images.unsplash.com/photo-1509374864550-ec7bcb9c17ff?ixlib=rb-0.3.5&s=250695a9f647ae3c0aad52c6ab6c01a7&auto=format&fit=crop&w=634&q=80'
              />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Segment inverted vertical style={{ padding: '5em 0em' }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Header style={{textAlign: 'left'}} inverted as='h4' content='About' />
                  <List link inverted>
                    <List.Item as='a'>About Us</List.Item>
                    <List.Item as='a' href='https://github.com/blockballot/blockballot'>Source Code</List.Item>
                    <List.Item as='a'>White Paper</List.Item>
                  </List>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header style={{textAlign: 'left'}} inverted as='h4' content='Actions' />
                  <List link inverted>
                    <Link to='/signup'>
                      <List.Item as='a'>Signup</List.Item>
                    </Link>
                    <br/>
                    <Link to='/login'>
                      <List.Item as='a'>Login</List.Item>
                    </Link>
                    <br/>
                    <Link to='/createpoll'>
                      <List.Item as='a'>Create Poll</List.Item>
                    </Link>
                  </List>
                </Grid.Column>
                <Grid.Column width={7}>
                  <Header style={{textAlign: 'left'}} as='h4' inverted>BlockBallot</Header>
                  <p>Elections and other collective decision-making processes are too important to risk the threat of data manipulation. Bind your decisions to the Ethereum blockchain with BlockBallot.</p>
                  <a href='https://www.freepik.com/free-vector/vector-network-background-abstract-polygon-triangle_1306336.htm'>Vector Background Designed by Freepik</a>
                  <br/>
                  <a href='https://unsplash.com/photos/MT6wpZAEjHM'>Oculus NYC by Alex Iby</a>
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