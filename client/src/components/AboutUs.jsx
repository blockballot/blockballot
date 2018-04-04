import React from 'react';
import '../style/aboutus.css';

const AboutUs = () => (
  <div className="aboutContainer">
    <hr className="topBar" />
    <div className="aboutHeader">
      About BlockBallot
    </div>
    <p className="sectionTitle">Our Concept and Mission</p>
    <div className="grid1">
      <div className="gridItem">
        <p>
          Because voter data is permanently written to the Ethereum blockchain, BlockBallot is the safest, most transparent way to organize a vote.
          
          Elections and other collective decision-making processes are too important to risk the threat of data manipulation. Bind your decisions to the Ethereum blockchain with BlockBallot.
        </p>
      </div>
    </div>
    <p className="sectionTitle">Blockchain Basics</p>
    <div className="grid3">
      <div className="gridItem">1</div>
      <div className="gridItem">2</div>
      <div className="gridItem">3</div>
      <div className="gridItem">4</div>
      <div className="gridItem">5</div>
      <div className="gridItem">6</div>
    </div>
    <p className="sectionTitle">Getting Started with BlockBallot</p>
    <div className="grid1">
      <div className="gridItem">
        <p>Sign up your organization for a BlockBallot account, design custom ballots, and track outcomes with our results dashboard.</p>
      </div>
    </div>
    <p className="sectionTitle">Developer Team</p>
    <div className="grid4">
      <div className="gridItem">Evaline</div>
      <div className="gridItem">Norbie</div>
      <div className="gridItem">Paula</div>
      <div className="gridItem">Michael</div>
    </div>
  </div>
);

export default AboutUs;
