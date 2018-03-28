import React from 'react';
import { shallow, mount, render } from 'enzyme';
import renderer from 'react-test-renderer';
import Landing from '../client/src/components/Landing.jsx';

describe('Landing Component', () => {
  it('should be defined', () => {
    expect(Landing).toBeDefined();
  });
});