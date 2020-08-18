import React from 'react'
import {expect} from 'chai';
import {mount} from 'enzyme';
import sinon from 'sinon';
import Cascader from '../index';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

configure({adapter: new Adapter()});

describe('test cascader component', () => {
  it('should load dom when initialing component', function() {
      const dom = mount(<Cascader expandTrigger="hover" options={[]} />)
      expect(dom.find('.hui-cascader')).to.have.lengthOf(1);
    })
})
