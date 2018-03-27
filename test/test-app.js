// require('babel-register')();
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import { spy } from 'sinon';
import AppWithRouter from '../client/src/components/App.jsx';
import Landing from '../client/src/components/Landing.jsx';

spy(AppWithRouter.prototype, 'componentDidMount');

describe('Client Functionality', () => {
  
  describe('App Component', () => {
    it('should call componentDidMount', () => {
      const wrapper = shallow(<AppWithRouter />);
      expect(AppWithRouter.protoype.componentDidMount.calledOnce).to.equal(true);
    });
    //   it('should call componentDidMount', () => {
    //   const wrapper = mount(<Landing/>);
    //   expect(wrapper.protoype.componentDidMount).to.equal(true);
    // });
  });
});

// "test-client": "mocha test/test-setup test/test-app.js --timeout 10000 --exit",